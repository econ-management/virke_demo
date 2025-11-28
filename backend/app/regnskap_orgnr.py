from dotenv import load_dotenv
load_dotenv()
from models.general_methods import raw_url_conv
import os
import psycopg2
import pandas as pd

econm_url = raw_url_conv(os.getenv("ECONM_DB_URL"))

def db_get_regnskap_orgnr(orgnr):
    conn = psycopg2.connect(econm_url)
    cur = conn.cursor()
    orgnr = int(orgnr)
    cur.execute("SELECT * FROM core_facts.proff_regnskap WHERE orgnr = %s", (orgnr,))
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

def get_regnskap_orgnr(orgnr):
    df = db_get_regnskap_orgnr(orgnr)
    df = df[df['year'] >= 2019].copy().reset_index(drop=True)
    df = df.rename(columns = {'driftsinntekter_sum' : 'omsetning', 'lonn_trygd_pensjon' : 'lonnskostnader'})
    df['driftsmargin'] = df['ebit'] / df['omsetning']
    df['lonn_oms'] = df['lonnskostnader'] / df['omsetning']
    df['vare_oms'] = df['varekostnad'] / df['omsetning']


    df = df[['orgnr', 'year', 'driftsmargin', 'omsetning', 'vare_oms', 'lonn_oms']].copy()

    if df.empty:
        return {"error": "No data found"}
    df = df.fillna(0)
    data = df.to_dict(orient="records")
    return data
