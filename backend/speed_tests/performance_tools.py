import time
import asyncio
import requests


# ---------------------------------------------------------
# 1. Measure runtime of ANY Python function (sync or async)
# ---------------------------------------------------------

def measure_function_time(func, *args, **kwargs):
    """
    Measure runtime of a Python function.

    Works for both sync and async functions.
    Returns (result, seconds_elapsed).
    """

    if asyncio.iscoroutinefunction(func):
        # Async function → run inside event loop
        async def _run_async():
            start = time.perf_counter()
            result = await func(*args, **kwargs)
            end = time.perf_counter()
            return result, end - start

        return asyncio.run(_run_async())

    else:
        # Sync function
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        return result, end - start



# ---------------------------------------------------------
# 2. Measure runtime of ANY FastAPI endpoint
# ---------------------------------------------------------

def measure_endpoint_time(
    url: str,
    method: str = "GET",
    json: dict | None = None,
    timeout: int = 60,
):
    """
    Measure runtime of a FastAPI endpoint.
    Supports GET and POST.
    Returns (response, seconds_elapsed).
    """

    method = method.upper()

    start = time.perf_counter()

    if method == "GET":
        response = requests.get(url, timeout=timeout)
    elif method == "POST":
        response = requests.post(url, json=json, timeout=timeout)
    else:
        raise ValueError(f"Unsupported method: {method}")

    end = time.perf_counter()

    return response, end - start


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
