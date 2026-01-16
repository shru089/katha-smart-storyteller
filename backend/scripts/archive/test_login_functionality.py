import requests

def test_login():
    url = "http://localhost:8000/api/users/login"
    # Try with a known user or create one
    # First, let's try to register a test user to be sure
    register_url = "http://localhost:8000/api/users/register"
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    
    # Try register (might fail if exists, which is fine)
    try:
        r = requests.post(register_url, json=user_data)
        print(f"Register status: {r.status_code}")
    except Exception as e:
        print(f"Register failed: {e}")

    # Now login
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    print(f"Testing Login for {login_data['email']}...")
    try:
        r = requests.post(url, json=login_data)
        print(f"Login Status: {r.status_code}")
        if r.status_code == 200:
            print("Login SUCCESS")
            print(r.json().keys())
        else:
            print("Login FAILED")
            print(r.text)
    except Exception as e:
        print(f"Login Exception: {e}")

if __name__ == "__main__":
    test_login()
