# -*- coding: utf-8 -*-
"""
app_store_reviews.py
====================
Script para extraer reseñas de la Apple App Store de apps peruanas.
Compatible con: Nueva BanBif App (id6736497481) y Agora (id1478814349).

Instalación de dependencias:
    pip install app-store-scraper pandas beautifulsoup4 requests

Autor: Antigravity | Fecha: 2026-06-16
"""

# ── Dependencias estándar ──────────────────────────────────────────────────────
import uuid
import re
import json
import logging
import argparse
import sys
import io
from datetime import datetime
from typing import Optional

# Fix Windows console UTF-8 encoding
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf-8-sig"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ── Dependencias externas ──────────────────────────────────────────────────────
try:
    import pandas as pd
except ImportError:
    raise SystemExit("❌ pandas no está instalado. Ejecuta: pip install pandas")

# ── Configuración de logging ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
log = logging.getLogger(__name__)

# ── Catálogo de apps disponibles ───────────────────────────────────────────────
APPS = {
    "banbif": {
        "app_name": "nueva-banbif-app",
        "app_id": "6736497481",
        "country": "pe",
    },
    "agora": {
        "app_name": "agora-ahorra-y-disfruta",
        "app_id": "1478814349",
        "country": "pe",
    },
}

# ── Columnas normalizadas de salida ────────────────────────────────────────────
COLUMNS = [
    "source", "app_name", "app_id", "review_id", "review_title",
    "review_text", "rating", "user_name", "review_date",
    "developer_response", "country", "extracted_at",
]


# ════════════════════════════════════════════════════════════════════════════════
# ESTRATEGIA 1 — app_store_scraper (principal)
# ════════════════════════════════════════════════════════════════════════════════

def scrape_with_library(
    country: str,
    app_name: str,
    app_id: str,
    how_many: int = 500,
) -> list[dict]:
    """
    Descarga reseñas usando la librería app-store-scraper.
    Retorna una lista de dicts crudos, o [] si falla.
    """
    try:
        # pyrefly: ignore [missing-import]
        from app_store_scraper import AppStore
    except ImportError:
        log.warning("⚠️  app-store-scraper no encontrado. Instala con: pip install app-store-scraper")
        return []

    try:
        log.info(f"[Strategy 1] Iniciando descarga con app-store-scraper ({app_name}, {app_id}) ...")
        store = AppStore(country=country, app_name=app_name, app_id=app_id)
        store.review(how_many=how_many)
        raw: list[dict] = store.reviews
        log.info(f"[Strategy 1] Reseñas obtenidas: {len(raw)}")
        return raw
    except Exception as exc:
        log.error(f"[Strategy 1] Error durante la descarga: {exc}")
        return []


def normalize_library_review(
    review: dict,
    app_name: str,
    app_id: str,
    country: str,
    extracted_at: str,
) -> dict:
    """
    Mapea los campos de app-store-scraper al esquema normalizado.
    Los campos faltantes se rellenan con None.
    """
    return {
        "source": "Apple App Store",
        "app_name": app_name,
        "app_id": app_id,
        "review_id": str(review.get("reviewId") or uuid.uuid4()),
        "review_title": clean_text(review.get("title")),
        "review_text": clean_text(review.get("review")),
        "rating": review.get("rating"),
        "user_name": review.get("userName"),
        "review_date": review.get("date"),
        "developer_response": clean_text(review.get("developerResponse", {}).get("body") if isinstance(review.get("developerResponse"), dict) else review.get("developerResponse")),
        "country": country,
        "extracted_at": extracted_at,
    }


# ════════════════════════════════════════════════════════════════════════════════
# ESTRATEGIA 2 — requests + BeautifulSoup (fallback)
# ════════════════════════════════════════════════════════════════════════════════

def scrape_with_requests(
    country: str,
    app_id: str,
    how_many: int = 200,
) -> list[dict]:
    """
    Fallback: obtiene reseñas via iTunes RSS API (sin Selenium, sin HTML scraping).
    Limitado a ~500 reseñas por paginación del endpoint RSS de Apple.
    """
    try:
        import requests
    except ImportError:
        log.warning("⚠️  requests no instalado: pip install requests")
        return []

    reviews = []
    pages = min(10, (how_many // 50) + 1)  # Apple devuelve max ~50 por página vía RSS

    for page in range(1, pages + 1):
        url = (
            f"https://itunes.apple.com/{country}/rss/customerreviews/"
            f"page={page}/id={app_id}/sortby=mostrecent/json"
        )
        try:
            log.info(f"[Strategy 2] GET página {page} → {url}")
            resp = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
            data = resp.json()
            entries = data.get("feed", {}).get("entry", [])

            # La primera entrada suele ser metadata de la app, no una reseña
            for entry in entries:
                if not isinstance(entry, dict):
                    continue
                # Saltamos la entrada de info de la app
                if entry.get("im:name"):
                    continue
                reviews.append(entry)

            if len(entries) == 0:
                log.info("[Strategy 2] Sin más páginas disponibles.")
                break

        except Exception as exc:
            log.error(f"[Strategy 2] Error en página {page}: {exc}")
            break

    log.info(f"[Strategy 2] Reseñas obtenidas: {len(reviews)}")
    return reviews


def normalize_rss_review(
    entry: dict,
    app_name: str,
    app_id: str,
    country: str,
    extracted_at: str,
) -> dict:
    """
    Mapea los campos del RSS feed de iTunes al esquema normalizado.
    """
    def get(key, subkey="label", default=None):
        return entry.get(key, {}).get(subkey, default)

    return {
        "source": "Apple App Store",
        "app_name": app_name,
        "app_id": app_id,
        "review_id": get("id") or str(uuid.uuid4()),
        "review_title": clean_text(get("title")),
        "review_text": clean_text(get("content")),
        "rating": get("im:rating"),
        "user_name": get("author", subkey="name") or None,
        "review_date": get("updated"),
        "developer_response": None,  # RSS no expone respuesta de dev
        "country": country,
        "extracted_at": extracted_at,
    }


# ════════════════════════════════════════════════════════════════════════════════
# UTILIDADES
# ════════════════════════════════════════════════════════════════════════════════

def clean_text(text: Optional[str]) -> Optional[str]:
    """Limpieza básica de texto: espacios, saltos de línea redundantes."""
    if not text:
        return None
    text = str(text).strip()
    text = re.sub(r"\s+", " ", text)          # colapsa espacios múltiples
    text = re.sub(r"[\x00-\x1F\x7F]", "", text)  # elimina caracteres de control
    return text if text else None


def build_dataframe(records: list[dict]) -> pd.DataFrame:
    """
    Convierte la lista de reseñas normalizadas a DataFrame,
    garantizando todas las columnas aunque estén vacías.
    """
    df = pd.DataFrame(records)
    # Asegura columnas aunque no existan
    for col in COLUMNS:
        if col not in df.columns:
            df[col] = None
    df = df[COLUMNS]  # orden garantizado

    # Limpieza adicional
    df = df.drop_duplicates(subset=["review_id"])

    # Convierte review_date a datetime si es posible
    if "review_date" in df.columns:
        df["review_date"] = pd.to_datetime(df["review_date"], errors="coerce", utc=True)
        df = df.sort_values("review_date", ascending=False, na_position="last")

    # Rating como numérico
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")

    return df.reset_index(drop=True)


def print_summary(df: pd.DataFrame) -> None:
    """Imprime un resumen estadístico al final de la ejecución."""
    total = len(df)
    avg_rating = df["rating"].mean()
    date_min = df["review_date"].min()
    date_max = df["review_date"].max()

    print("\n" + "=" * 50)
    print("  [RESUMEN DE EXTRACCION]")
    print("=" * 50)
    print(f"  total_reviews  : {total}")
    print(f"  promedio_rating: {avg_rating:.2f}" if pd.notna(avg_rating) else "  promedio_rating: N/A")
    print(f"  fecha_min      : {date_min}")
    print(f"  fecha_max      : {date_max}")
    print("=" * 50 + "\n")


def save_outputs(df: pd.DataFrame, base_name: str) -> tuple[str, str]:
    """
    Guarda el DataFrame en CSV y JSON con timestamp.
    Retorna las rutas generadas.
    """
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_path = f"{base_name}_{ts}.csv"
    json_path = f"{base_name}_{ts}.json"

    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    log.info(f"[OK] CSV guardado: {csv_path}")

    # JSON: convierte fechas a ISO string para serialización
    df_json = df.copy()
    for col in df_json.select_dtypes(include=["datetimetz", "datetime64"]).columns:
        df_json[col] = df_json[col].astype(str)
    df_json.to_json(json_path, orient="records", force_ascii=False, indent=2)
    log.info(f"[OK] JSON guardado: {json_path}")

    return csv_path, json_path


# ════════════════════════════════════════════════════════════════════════════════
# FUNCIÓN PRINCIPAL
# ════════════════════════════════════════════════════════════════════════════════

def main(
    app_key: str = "banbif",
    country: Optional[str] = None,
    app_name: Optional[str] = None,
    app_id: Optional[str] = None,
    how_many: int = 500,
    output_file: str = "reviews",
) -> pd.DataFrame:
    """
    Orquesta la extracción, normalización, limpieza y exportación de reseñas.

    Parámetros
    ----------
    app_key     : 'banbif' o 'agora' (ignora country/app_name/app_id si se da)
    country     : código de país ISO (ej. 'pe')
    app_name    : slug de la app en App Store
    app_id      : ID numérico de la app
    how_many    : número máximo de reseñas a intentar descargar
    output_file : nombre base para los archivos de salida (sin extensión)
    """
    # ── Resolver configuración de la app ──────────────────────────────────────
    if app_key in APPS and not (country and app_name and app_id):
        cfg = APPS[app_key]
        country = cfg["country"]
        app_name = cfg["app_name"]
        app_id = cfg["app_id"]
    elif not (country and app_name and app_id):
        raise ValueError(
            f"app_key '{app_key}' no reconocida. Opciones: {list(APPS.keys())} "
            "o pasa country, app_name y app_id manualmente."
        )

    log.info(f"[INICIO] Extrayendo resenas de: {app_name} (id={app_id}, country={country})")
    extracted_at = datetime.now().isoformat()

    # ── Estrategia 1: app-store-scraper ───────────────────────────────────────
    raw = scrape_with_library(country, app_name, app_id, how_many)
    strategy = "library"

    # ── Fallback: requests + iTunes RSS ───────────────────────────────────────
    if not raw:
        log.warning("⚠️  Estrategia 1 sin resultados. Usando fallback RSS ...")
        raw = scrape_with_requests(country, app_id, how_many)
        strategy = "rss"

    if not raw:
        log.error("❌ No se pudieron obtener reseñas con ninguna estrategia.")
        return pd.DataFrame(columns=COLUMNS)

    # ── Normalización ─────────────────────────────────────────────────────────
    if strategy == "library":
        records = [
            normalize_library_review(r, app_name, app_id, country, extracted_at)
            for r in raw
        ]
    else:
        records = [
            normalize_rss_review(r, app_name, app_id, country, extracted_at)
            for r in raw
        ]

    # ── DataFrame, limpieza y deduplicación ───────────────────────────────────
    df = build_dataframe(records)
    log.info(f"[INFO] Total resenas unicas procesadas: {len(df)}")

    # ── Exportación ───────────────────────────────────────────────────────────
    base = f"{output_file}_{app_name}"
    csv_path, json_path = save_outputs(df, base)

    # ── Resumen final ─────────────────────────────────────────────────────────
    print_summary(df)

    return df


# ════════════════════════════════════════════════════════════════════════════════
# ENTRYPOINT CLI
# ════════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Extrae reseñas de App Store para apps peruanas.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:

  # Reseñas de BanBif (default)
  python app_store_reviews.py --app banbif --how_many 500

  # Reseñas de Agora
  python app_store_reviews.py --app agora --how_many 300

  # App personalizada
  python app_store_reviews.py \\
      --country pe \\
      --app_name mi-app-peru \\
      --app_id 1234567890 \\
      --how_many 200 \\
      --output_file mis_reviews
        """
    )
    parser.add_argument("--app",        default="banbif",  choices=list(APPS.keys()), help="App predefinida")
    parser.add_argument("--country",    default=None,  help="Código de país (ej. pe)")
    parser.add_argument("--app_name",   default=None,  help="Slug de la app en App Store")
    parser.add_argument("--app_id",     default=None,  help="App ID numérico")
    parser.add_argument("--how_many",   default=500,   type=int, help="Número máximo de reseñas")
    parser.add_argument("--output_file",default="reviews", help="Nombre base del archivo de salida")

    args = parser.parse_args()

    df_result = main(
        app_key=args.app,
        country=args.country,
        app_name=args.app_name,
        app_id=args.app_id,
        how_many=args.how_many,
        output_file=args.output_file,
    )

    print(f"\n[PREVIEW] Primeras 5 resenas:\n")
    print(df_result[["app_name", "rating", "review_title", "review_date"]].head().to_string(index=False))
