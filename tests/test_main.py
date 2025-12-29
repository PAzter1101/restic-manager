import os
import sys
from unittest.mock import patch

from fastapi.testclient import TestClient

# Добавляем путь к приложению
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

# Мокаем переменные окружения для тестов
test_env = {
    "RESTIC_REPOSITORY": "test://repo",
    "RESTIC_PASSWORD": "test_password",
    "AWS_ACCESS_KEY_ID": "test_key",
    "AWS_SECRET_ACCESS_KEY": "test_secret",
    "SECRET_KEY": "test_secret_key",
    "ADMIN_USERNAME": "admin",
    "ADMIN_PASSWORD": "admin",
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
    response = client.post("/login", data={"username": "wrong", "password": "wrong"})
    assert response.status_code == 200  # Возвращает страницу с ошибкой


def test_snapshots_without_auth():
    """Тест доступа к снапшотам без авторизации"""
    response = client.get("/snapshots")
    assert response.status_code == 401


def test_download_without_auth():
    """Тест скачивания без авторизации"""
    response = client.get("/download/test/test.txt")
    assert response.status_code == 404  # Неверный путь возвращает 404
