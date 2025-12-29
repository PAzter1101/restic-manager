import os
import sys
from io import BytesIO
from unittest.mock import MagicMock, patch

import pytest
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
    """Тест главной страницы (страница логина)"""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]


def test_login_invalid_credentials():
    """Тест логина с неверными данными"""
    response = client.post("/login", data={"username": "wrong", "password": "wrong"}, follow_redirects=False)
    assert response.status_code == 302  # Редирект на страницу с ошибкой


def test_login_valid_credentials():
    """Тест логина с правильными данными"""
    response = client.post("/login", data={"username": "admin", "password": "admin"}, follow_redirects=False)
    assert response.status_code == 302  # Редирект на dashboard
    assert "access_token" in response.cookies
