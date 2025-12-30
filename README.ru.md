# Restic Manager

[![Tests](https://github.com/pazter1101/restic-manager/workflows/Tests/badge.svg)](https://github.com/pazter1101/restic-manager/actions)
[![Code Quality](https://github.com/pazter1101/restic-manager/workflows/Code%20Quality/badge.svg)](https://github.com/pazter1101/restic-manager/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/pazter1101/restic-manager/badge)](https://www.codefactor.io/repository/github/pazter1101/restic-manager)
[![codecov](https://codecov.io/gh/pazter1101/restic-manager/branch/main/graph/badge.svg)](https://codecov.io/gh/pazter1101/restic-manager)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/pazter1101/restic-manager)](https://github.com/pazter1101/restic-manager/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/pazter1101/restic-manager)](https://github.com/pazter1101/restic-manager/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)](https://www.typescriptlang.org/)

**[🇺🇸 English version](README.md)**

Современный веб-интерфейс для просмотра и скачивания бекапов из restic репозитория. Построен на FastAPI бэкенде и React фронтенде.

## 🚀 Возможности

- 🔐 Авторизация пользователей через JWT токены
- 📸 Просмотр списка снапшотов с пагинацией
- 🔍 Расширенная фильтрация по хостам и тегам
- ⬇️ Скачивание файлов из снапшотов через браузер
- 📁 Интерактивный браузер файлов для снапшотов
- ℹ️ Детальная информация о снапшотах и статистика
- 📱 Адаптивный веб-интерфейс на React
- 🚀 Современная SPA архитектура
- 📊 Загрузка размеров снапшотов в реальном времени
- 🎨 Чистый и интуитивный UI/UX

## 🏗️ Архитектура

- **Бэкенд**: FastAPI (Python 3.10+) с модульной структурой
- **Фронтенд**: React 18 + TypeScript + Vite
- **Тестирование**: pytest (бэкенд) + Vitest + React Testing Library (фронтенд)
- **Качество кода**: Black, isort, flake8, mypy, ESLint
- **CI/CD**: GitHub Actions с автоматическим тестированием и релизами
- **Контейнеризация**: Многоэтапная сборка Docker

## Требования

- Docker & Docker Compose
- Доступ к S3 хранилищу с restic репозиторием
- Современный браузер с поддержкой JavaScript

## Установка

### Вариант 1: Готовый Docker образ

1. Создайте `.env` файл с настройками:
   ```
   RESTIC_REPOSITORY=s3:https://s3.example.com/your-backup-bucket
   RESTIC_PASSWORD=ваш_пароль_restic
   AWS_ACCESS_KEY_ID=ваш_ключ_доступа
   AWS_SECRET_ACCESS_KEY=ваш_секретный_ключ
   SECRET_KEY=случайная_строка_для_jwt
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=ваш_пароль_админа
   ```

2. Запустите контейнер:
   ```bash
   # Из GitHub Container Registry
   docker run -d -p 8000:8000 --env-file .env ghcr.io/pazter1101/restic-web-manager:latest
   
   # Или из Docker Hub
   docker run -d -p 8000:8000 --env-file .env pazter1101/restic-web-manager:latest
   ```

3. Откройте http://localhost:8000 в браузере

### Вариант 2: Сборка из исходников

1. Скопируйте `.env.example` в `.env` и настройте переменные:
   ```bash
   cp .env.example .env
   ```

2. Запустите приложение:
   ```bash
   docker compose up -d
   ```

## Использование

1. Войдите используя учетные данные из `.env`
2. Просматривайте список снапшотов
3. Фильтруйте по хостам и тегам
4. Кликните на файл для скачивания

## Тестирование

### Тесты бэкенда
```bash
pip install -r requirements-test.txt
cd app && python -m pytest ../tests/ -v
```

### Тесты фронтенда
```bash
cd frontend
npm install
npm test
```

### Качество кода
```bash
# Python
black --check .
isort --check-only .
flake8 .
mypy --ignore-missing-imports app/

# TypeScript
cd frontend
npm run lint
npx tsc --noEmit
```

## API

- `GET /` - обслуживание React SPA
- `POST /api/login` - авторизация пользователя
- `GET /api/snapshots` - получение списка снапшотов с пагинацией и фильтрацией
- `GET /api/snapshot/{snapshot_id}/size` - получение размера снапшота
- `GET /api/snapshots/{snapshot_id}/files` - получение файлов в снапшоте
- `POST /api/upload` - загрузка файлов и создание бэкапа
- `GET /api/download/{snapshot_id}` - скачивание файлов из снапшота

## 🤝 Участие в разработке

Читайте [CONTRIBUTING.md](CONTRIBUTING.md) для получения информации о том, как внести вклад в проект.

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- [Restic](https://restic.net/) - за отличный инструмент резервного копирования
- [FastAPI](https://fastapi.tiangolo.com/) - за современный веб-фреймворк
- Всем участникам, которые помогают улучшать проект
