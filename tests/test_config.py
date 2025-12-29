import os
import sys
from unittest.mock import patch

import pytest

# Мокаем переменные окружения для тестов перед импортом


class TestConfig:
    """Тесты для конфигурации"""

    def test_settings_with_all_env_vars(self):
        """Тест загрузки настроек со всеми переменными окружения"""
        test_env = {
            "RESTIC_REPOSITORY": "s3://test-bucket",
            "RESTIC_PASSWORD": "test_password",
            "AWS_ACCESS_KEY_ID": "test_key",
            "AWS_SECRET_ACCESS_KEY": "test_secret",
            "SECRET_KEY": "test_jwt_secret",
            "ADMIN_USERNAME": "testadmin",
            "ADMIN_PASSWORD": "testpass",
            "MAX_FILE_SIZE": "50",
        }

        with patch.dict(os.environ, test_env, clear=True):
            # Перезагружаем модуль для применения новых переменных
            if "config" in sys.modules:
                del sys.modules["config"]

            from config import Settings

            settings = Settings()

            assert settings.RESTIC_REPOSITORY == "s3://test-bucket"
            assert settings.RESTIC_PASSWORD == "test_password"
            assert settings.AWS_ACCESS_KEY_ID == "test_key"
            assert settings.AWS_SECRET_ACCESS_KEY == "test_secret"
            assert settings.SECRET_KEY == "test_jwt_secret"
            assert settings.ADMIN_USERNAME == "testadmin"
            assert settings.ADMIN_PASSWORD == "testpass"
            assert settings.MAX_FILE_SIZE == 50

    def test_max_file_size_bytes_property(self):
        """Тест свойства max_file_size_bytes"""
        test_env = {
            "RESTIC_REPOSITORY": "test://repo",
            "RESTIC_PASSWORD": "test",
            "AWS_ACCESS_KEY_ID": "test",
            "AWS_SECRET_ACCESS_KEY": "test",
            "SECRET_KEY": "test",
            "ADMIN_USERNAME": "test",
            "ADMIN_PASSWORD": "test",
            "MAX_FILE_SIZE": "5",
        }

        with patch.dict(os.environ, test_env, clear=True):
            if "config" in sys.modules:
                del sys.modules["config"]

            from config import Settings

            settings = Settings()

            # 5MB = 5 * 1024 * 1024 bytes
            assert settings.max_file_size_bytes == 5 * 1024 * 1024

    def test_get_restic_env(self):
        """Тест получения переменных окружения для restic"""
        test_env = {
            "RESTIC_REPOSITORY": "s3://test-bucket",
            "RESTIC_PASSWORD": "test_password",
            "AWS_ACCESS_KEY_ID": "test_key",
            "AWS_SECRET_ACCESS_KEY": "test_secret",
            "SECRET_KEY": "test",
            "ADMIN_USERNAME": "test",
            "ADMIN_PASSWORD": "test",
        }

        with patch.dict(os.environ, test_env, clear=True):
            if "config" in sys.modules:
                del sys.modules["config"]

            from config import Settings

            settings = Settings()

            restic_env = settings.get_restic_env()

            assert restic_env["RESTIC_REPOSITORY"] == "s3://test-bucket"
            assert restic_env["RESTIC_PASSWORD"] == "test_password"
            assert restic_env["AWS_ACCESS_KEY_ID"] == "test_key"
            assert restic_env["AWS_SECRET_ACCESS_KEY"] == "test_secret"

    def test_missing_required_env_vars(self):
        """Тест обработки отсутствующих обязательных переменных"""
        from pydantic import ValidationError

        # Создаем новый класс Settings без .env файла
        from pydantic_settings import BaseSettings, SettingsConfigDict

        class TestSettings(BaseSettings):
            RESTIC_REPOSITORY: str
            RESTIC_PASSWORD: str
            AWS_ACCESS_KEY_ID: str
            AWS_SECRET_ACCESS_KEY: str
            SECRET_KEY: str
            ADMIN_USERNAME: str
            ADMIN_PASSWORD: str

            model_config = SettingsConfigDict(env_file=".nonexistent")

        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValidationError):
                TestSettings()
