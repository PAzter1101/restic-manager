import os
from unittest.mock import patch

from fastapi.testclient import TestClient

# Мокаем переменные окружения для тестов
test_env = {
    "RESTIC_REPOSITORY": "test://repo",
    "RESTIC_PASSWORD": "test_password",
    "AWS_ACCESS_KEY_ID": "test_key",
    "AWS_SECRET_ACCESS_KEY": "test_secret",
    "SECRET_KEY": "test_secret_key",
    "ADMIN_USERNAME": "admin",
    "ADMIN_PASSWORD": "admin",
    "MAX_FILE_SIZE": "10",  # 10MB для тестов
}

with patch.dict(os.environ, test_env):
    from main import app

client = TestClient(app)


def test_login_page():
    """Тест главной страницы (React SPA или fallback)"""
    response = client.get("/")
    assert response.status_code == 200
    # После рефакторинга может возвращать JSON fallback если React не собран
    content_type = response.headers.get("content-type", "")
    assert any(ct in content_type for ct in ["text/html", "application/json"])


def test_login_invalid_credentials():
    """Тест логина с неверными данными"""
    response = client.post(
        "/api/login", json={"username": "wrong", "password": "wrong"}
    )
    assert response.status_code == 401


def test_login_valid_credentials():
    """Тест логина с правильными данными"""
    response = client.post(
        "/api/login", json={"username": "admin", "password": "admin"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
