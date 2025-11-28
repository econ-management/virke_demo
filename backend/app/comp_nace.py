from dotenv import load_dotenv
load_dotenv()
from backend.models.general_methods import raw_url_conv
import os
import psycopg2
import pandas as pd
import numpy as np

econm_url = raw_url_conv(os.getenv("ECONM_DB_URL"))

def db_get_comp_nace(nace, bed_oms):
    conn = psycopg2.connect(econm_url)
    cur = conn.cursor()
    cur.execute(f"""
    SELECT orgnr, driftsinntekter_sum, ebit FROM core_facts.proff_regnskap 
    WHERE year = 2024
    AND driftsinntekter_sum > 5000000
    OR driftsinntekter_sum > {0.5*bed_oms}
    and orgnr in (SELECT orgnr FROM core_attr.brreg_enheter WHERE naring1_kode = '{nace}')
    """)
    result = cur.fetchall()
    columns = [description[0] for description in cur.description]
    df = pd.DataFrame(result, columns=columns)
    conn.close()
    return df


"""Variabelnavn: driftsinntekter_sum avskrivninger, nedskrivninger, ebit, andre_renteinntekter, andre_finansinntekter, finansinntekter, finanskostnader,
resultat_for_skatt, skattekostnad_ordinart, ordinaert_resultat, arsresultat, utbytte_sum, goodwill, anleggsmidler,
varelager_sum, kundefordringer, andre_fordringer, fordringer_sum, kontant_bank_post_sum, omlopsmidler_sum, eiendeler_sum,
egenkapital, opptjent_egenkapital_sum, langsiktig_gjeld_sum, leverandorgjeld, kortsiktig_gjeld_sum,
 lederlonn_nok, leder_annen_godtgjoerelse, revisjonshonorar_nok, annen_revisjonsbistand, ebitda,
 driftskostnader_sum, pensjonskostnader, kontanter_bank_post, varer_sum, aarsverk, varekostnad"""

"""
'orgnr', 'org_besk', 'sektor', 'navn', 'kommune', 'kommune_nr',
   'adresse', 'postnummer', 'poststed', 'land', 'naring1_kode',
   'naring1_beskrivelse', 'aktivitet', 'vedt_formaal', 'har_ansatte',
   'ansatte', 'reg_dt_ans_enh', 'reg_dt_ans_nava', 'siste_regnsk',
   'konkurs', 'konkurs_dt', 'under_avvik', 'avvik_dt', 'naring2_kode',
   'naring2_besk', 'naring3_kode', 'naring3_besk', 'under_tvang',
   'tvang_slett_dt', 'rekonstr_dt', 'tvang_revn_dt', 'tvang_regn_dt',
   'rev_frav_dt', 'tvang_styre_dt', 'reg_i_mva', 'reg_dt_mva_enh',
   'reg_i_parti', 'reg_i_friv', 'org_kode', 'stift_dt', 'updated_at'
"""


def make_hist(series, bins=19, min_value=None):
    values = series.dropna().to_numpy()
    if values.size == 0:
        return []

    q25 = np.quantile(values, 0.25)
    q75 = np.quantile(values, 0.75)
    mid = np.quantile(values, 0.5)

    if bins % 2 == 0:
        raise ValueError("bins must be odd so you have a true center bin.")

    half = bins // 2
    width = (q75 - q25) / half if half > 0 else (q75 - q25)

    # fallback: if IQR is zero, avoid collapsing to zero-width bins
    if width == 0:
        width = 1e-9

    # build initial edges around median
    edges = np.array([mid + (i - half) * width for i in range(bins + 1)])

    # 🔥 clamp lower bound to min_value IF provided
    if min_value is not None:
        edges = np.maximum(edges, min_value)

        # ensure edges remain strictly increasing after clamping
        # (if clamping flattened the left side)
        for i in range(1, len(edges)):
            if edges[i] <= edges[i-1]:
                edges[i] = edges[i-1] + 1e-9

    hist, _ = np.histogram(values, bins=edges)

    out = []
    for i in range(bins):
        out.append({
            "bin_start": float(edges[i]),
            "bin_end": float(edges[i+1]),
            "count": int(hist[i])
        })

    return out



def make_stats(series):
    values = series.dropna()

    lo = float(values.quantile(0.05))
    hi = float(values.quantile(0.95))

    return {
        "min": lo,
        "max": hi,
        "mean": float(values.mean()),
        "median": float(values.median()),
        "std": float(values.std())
    }

def get_comp_nace(nace, bed_oms=5000000):
    df = db_get_comp_nace(nace, bed_oms)
    df = df.rename(columns={"driftsinntekter_sum": "omsetning"})
    df["driftsmargin"] = df["ebit"] / df["omsetning"]

    df = df[["driftsmargin", "omsetning"]].copy()

    if df.empty:
        return {"error": "No data found"}

    driftsmargin_hist = make_hist(df["driftsmargin"], bins=19)
    omsetning_hist = make_hist(df["omsetning"], bins=19, min_value=0)

    driftsmargin_stats = make_stats(df["driftsmargin"])
    omsetning_stats = make_stats(df["omsetning"])

    return {
        "driftsmargin": {
            "hist": driftsmargin_hist,
            "stats": driftsmargin_stats
        },
        "omsetning": {
            "hist": omsetning_hist,
            "stats": omsetning_stats
        }
    }
