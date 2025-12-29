# Restic Web Manager

Веб-интерфейс для просмотра и скачивания бекапов из restic репозитория на базе FastAPI.

## Возможности

- Авторизация пользователей через JWT токены
- Просмотр списка снапшотов
- Фильтрация по хостам и тегам
- Скачивание файлов из снапшотов через браузер
- Просмотр информации о снапшотах
- Веб-интерфейс с адаптивным дизайном

## Требования

- Docker
- Docker Compose
- Доступ к S3 хранилищу с restic репозиторием

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
   docker-compose up -d
   ```

## Использование

1. Войдите используя учетные данные из `.env`
2. Просматривайте список снапшотов
3. Фильтруйте по хостам и тегам
4. Кликните на файл для скачивания

## API

- `GET /` - главная страница
- `POST /login` - авторизация
- `GET /snapshots` - список снапшотов
- `GET /download/{snapshot_id}/{path}` - скачивание файла
