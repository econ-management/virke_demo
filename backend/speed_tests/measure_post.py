import time
import requests

def measure_post(url: str, payload: dict, timeout: int = 60):
    """
    Measure POST request runtime.
    Returns (response, seconds_elapsed).
    """
    print(f"POST {url}")
    print("Payload:", payload)

    start = time.perf_counter()
    response = requests.post(url, json=payload, timeout=timeout)
    end = time.perf_counter()

    seconds = end - start
    print(f"Time taken: {seconds:.4f} seconds")
    print(f"Status code: {response.status_code}\n")

    return response, seconds

trawls = [
    {'url' : "http://127.0.0.1:8000/api/comp_by_nace_var/70.200",
    'payload' :{
        "variable_names": ["ebit", "driftsinntekter_sum"],
        "calculations": [[0, "divide", 1]],
        "min_value": None
    }},

]

if __name__ == "__main__":
    # Your endpoint:
    url = "http://127.0.0.1:8000/api/comp_by_nace_var/70.200"

    # Example payload:
    payload = {
        "variable_names": ["ebit", "driftsinntekter_sum"],
        "calculations": [[0, "divide", 1]],
        "min_value": None
    }

    response, seconds = measure_post(url, payload)

    print("Response text (first 300 chars):")
    print(response.text[:300], "...")
