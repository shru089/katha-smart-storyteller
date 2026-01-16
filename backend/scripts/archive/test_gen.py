import requests
import json

url = "http://127.0.0.1:8000/api/scenes/1/generate"
response = requests.post(url)
print(f"Status: {response.status_code}")
try:
    print(json.dumps(response.json(), indent=2))
except:
    print(response.text)
