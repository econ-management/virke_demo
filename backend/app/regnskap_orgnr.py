from dotenv import load_dotenv
load_dotenv()
from backend.models.general_methods import raw_url_conv
import os
import pandas as pd
import asyncio
import backend.db.pool as dbpool
from backend.db.pool import init_pool

econm_url = raw_url_conv(os.getenv("ECONM_DB_URL"))

async def db_get_regnskap_orgnr(orgnr: str | int):
    await init_pool()  # ensure pool is created
    orgnr = int(orgnr)
    query = """
        SELECT orgnr, year, driftsinntekter_sum, lonn_trygd_pensjon,
               varekostnad, ebit
        FROM core_facts.proff_regnskap
        WHERE orgnr = $1;
    """
    async with dbpool.pool.acquire() as conn:
        rows = await conn.fetch(query, orgnr)
    if not rows:
        return pd.DataFrame(columns=[
            "orgnr", "year", "driftsinntekter_sum",
            "lonn_trygd_pensjon", "varekostnad", "ebit"
        ])
    df = pd.DataFrame([dict(r) for r in rows])
    return df



"""Variabelnavn: driftsinntekter_sum avskrivninger, nedskrivninger, ebit, andre_renteinntekter, andre_finansinntekter, finansinntekter, finanskostnader,
resultat_for_skatt, skattekostnad_ordinart, ordinaert_resultat, arsresultat, utbytte_sum, goodwill, anleggsmidler,
varelager_sum, kundefordringer, andre_fordringer, fordringer_sum, kontant_bank_post_sum, omlopsmidler_sum, eiendeler_sum,
egenkapital, opptjent_egenkapital_sum, langsiktig_gjeld_sum, leverandorgjeld, kortsiktig_gjeld_sum,
 lederlonn_nok, leder_annen_godtgjoerelse, revisjonshonorar_nok, annen_revisjonsbistand, ebitda,
 driftskostnader_sum, pensjonskostnader, kontanter_bank_post, varer_sum, aarsverk, varekostnad"""

async def get_regnskap_orgnr(orgnr):
    df = await db_get_regnskap_orgnr(orgnr)
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
