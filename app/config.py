"""Configuration settings for the application."""

import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Restic configuration - обязательные параметры
    RESTIC_REPOSITORY: str
    RESTIC_PASSWORD: str

    # AWS credentials - обязательные параметры
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str

    # Application security - обязательные параметры
    SECRET_KEY: str
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    # Optional parameters
    MAX_FILE_SIZE: int = 100  # MB

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"),
        env_file_encoding="utf-8",
    )

    @property
    def max_file_size_bytes(self) -> int:
        """Get maximum file size in bytes."""
        return self.MAX_FILE_SIZE * 1024 * 1024

    def get_restic_env(self) -> dict:
        """Get environment variables for restic commands."""
        return {
            "RESTIC_REPOSITORY": self.RESTIC_REPOSITORY,
            "RESTIC_PASSWORD": self.RESTIC_PASSWORD,
            "AWS_ACCESS_KEY_ID": self.AWS_ACCESS_KEY_ID,
            "AWS_SECRET_ACCESS_KEY": self.AWS_SECRET_ACCESS_KEY,
        }


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
