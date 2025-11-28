from dotenv import load_dotenv
load_dotenv()
from models.general_methods import raw_url_conv
import os
import psycopg2
import pandas as pd

econm_url = raw_url_conv(os.getenv("ECONM_DB_URL"))


def db_get_brreg_data_orgnr(orgnr):
    conn = psycopg2.connect(econm_url)
    cur = conn.cursor()
    orgnr = int(orgnr)
    cur.execute("SELECT * FROM core_attr.brreg_enheter WHERE orgnr = %s", (orgnr,))
    result = cur.fetchall()
    columns = [description[0] for description in cur.description]
    df = pd.DataFrame(result, columns=columns)
    conn.close()
    return df

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

def get_brreg_data_orgnr(orgnr):
    df = db_get_brreg_data_orgnr(orgnr)
    df = df[['orgnr', 'navn', 'naring1_kode', 'naring1_beskrivelse',
             'ansatte', 'har_ansatte', 'kommune', 'siste_regnsk']].copy()

    if df.empty:
        return {"error": "No data found"}

    data = df.to_dict(orient="records")
    return data

