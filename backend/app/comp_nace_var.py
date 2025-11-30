from dotenv import load_dotenv
load_dotenv()
from backend.models.general_methods import raw_url_conv
import os
import psycopg2
from psycopg2 import sql
import pandas as pd
import numpy as np
from scipy.stats import gaussian_kde, mstats


econm_url = raw_url_conv(os.getenv("ECONM_DB_URL"))

def db_get_comp_nace_var(nace, variable_names, bed_oms):
    conn = psycopg2.connect(econm_url)
    cur = conn.cursor()

    query = sql.SQL("""
        SELECT orgnr, {vars}
        FROM core_facts.proff_regnskap
        WHERE year = 2024
        AND (driftsinntekter_sum > 5000000
             OR driftsinntekter_sum > %s)
        AND orgnr IN (
            SELECT orgnr FROM core_attr.brreg_enheter
            WHERE naring1_kode = %s
            AND har_ansatte = TRUE
        )
    """).format(
        vars=sql.SQL(", ").join(sql.Identifier(v) for v in variable_names)
    )
    cur.execute(query, (0.5 * bed_oms, nace))
    rows = cur.fetchall()
    columns = ["orgnr"] + variable_names
    df = pd.DataFrame(rows, columns=columns)
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




def make_density(series, points=200, p=0.05, min_value=None, max_value=None, k=5):
    values = series.dropna().to_numpy()
    if values.size == 0:
        return {}

    # 1) Apply domain limits (clamp)
    if min_value is not None:
        values = np.maximum(values, min_value)
    if max_value is not None:
        values = np.minimum(values, max_value)

    # 2) Light winsorization for stable KDE
    w_values = mstats.winsorize(values, limits=[p, p]).astype(float)

    kde = gaussian_kde(w_values)

    # 3) Mean ± k·std on winsorized values
    m = w_values.mean()
    s = w_values.std()
    lo_std = m - k * s
    hi_std = m + k * s

    # 4) Also compute percentile limits (2%–98%)
    lo_pct = np.quantile(values, p)
    hi_pct = np.quantile(values, 1 - p)

    # 5) Final range = intersection of std-band AND percentiles
    lo = max(lo_std, lo_pct)
    hi = min(hi_std, hi_pct)

    # Safety check: ensure range is valid
    if hi <= lo:
        hi = lo + 1e-9

    xs = np.linspace(lo, hi, points)
    ys = kde(xs)

    return {
        "density": [{"x": float(x), "density": float(y)} for x, y in zip(xs, ys)],
        "min": float(lo),
        "max": float(hi)
    }



def make_stats(series, p=0.05, window=0.1):
    """
    p      = lower/upper trim cutoff (e.g. 0.02 = 2%)
    window = width of band above/below cutoff for lo_avg/hi_avg (e.g. 0.05 = 5%)
    """
    values = series.dropna().to_numpy()
    if values.size == 0:
        return {}

    # percentile boundaries
    p_low  = p
    p_low2 = p + window        # e.g. 2% → 7%
    p_high = 1 - p             # e.g. 98%
    p_high2 = 1 - p - window   # e.g. 93%

    # actual numeric cuts
    low_cut      = np.quantile(values, p_low)
    low_cut2     = np.quantile(values, p_low2)
    high_cut2    = np.quantile(values, p_high2)
    high_cut     = np.quantile(values, p_high)

    # define windows
    bottom_band = values[(values >= low_cut) & (values <= low_cut2)]
    top_band    = values[(values >= high_cut2) & (values <= high_cut)]

    # compute medians (fallback to cuts if empty)
    lo_avg = float(np.mean(bottom_band) if bottom_band.size > 0 else low_cut)
    hi_avg = float(np.mean(top_band)    if top_band.size > 0 else high_cut)

    return {
        "min": lo_avg,       # median of 2–7%
        "max": hi_avg,       # median of 93–98%
        "median": float(np.median(values)),
        "mean": float(np.mean(values)),
        "std": float(np.std(values)),
        "min_raw": float(values.min()),
        "max_raw": float(values.max())
    }



def get_comp_nace_var(nace, variable_names, calculations, min_value = None, bed_oms=5000000):
    df = db_get_comp_nace_var(nace, variable_names, bed_oms)
    for calc in calculations:
        if calc[1] == 'clean':
            df['return'] = df[variable_names[calc[0]]].copy()
        elif calc[1] == 'divide':
            df['return'] = df[variable_names[calc[0]]] / df[variable_names[calc[2]]]
        else:
            print('abort')

    if df.empty:
        return {"error": "No data found"}

    return_dens = make_density(df["return"], min_value=min_value)
    return_stats = make_stats(df["return"])

    return {"density": return_dens, "stats": return_stats}


