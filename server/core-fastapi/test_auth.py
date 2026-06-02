import sys
import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("Testing signup...")
    response = client.post(
        "/api/v1/auth/signup",
        json={"call_sign": "TEST_ALPHA", "email": "test@example.com", "password": "secure_password"}
    )
    print("Signup response:", response.status_code, response.json())
    assert response.status_code == 200

    print("Testing signin...")
    response = client.post(
        "/api/v1/auth/signin",
        json={"email": "test@example.com", "password": "secure_password", "badge_key": "SECURE-123"}
    )
    print("Signin response:", response.status_code, response.json())
    assert response.status_code == 200
    assert "access_token" in response.json()

if __name__ == "__main__":
    run_tests()
    print("All tests passed!")
