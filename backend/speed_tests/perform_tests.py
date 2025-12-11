from performance_tools import measure_function_time, measure_endpoint_time, measure_post

def test_endpoint_runtime(url):
    response, seconds = measure_endpoint_time(url)

    print("Status:", response.status_code)
    print("Runtime:", seconds)
    print("Response:", response.text[:200])

#test_function_runtime()
#test_endpoint_runtime()

url = "http://127.0.0.1:8000/api/regnskap/977213193"
url = "http://127.0.0.1:8000/api/kpi-result/993924741"

print (url)

test_endpoint_runtime(url)