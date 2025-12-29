# Restic Web Manager

[![Tests and Code Quality](https://github.com/pazter1101/restic-manager/workflows/Tests%20and%20Code%20Quality/badge.svg)](https://github.com/pazter1101/restic-manager/actions)
[![Code Quality](https://github.com/pazter1101/restic-manager/workflows/Code%20Quality/badge.svg)](https://github.com/pazter1101/restic-manager/actions)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/pazter1101/restic-manager)](https://github.com/pazter1101/restic-manager/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/pazter1101/restic-manager)](https://github.com/pazter1101/restic-manager/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)

**[🇷🇺 Русская версия](README.ru.md)**

Web interface for viewing and downloading backups from restic repository based on FastAPI.

## 🚀 Features

- 🔐 User authentication via JWT tokens
- 📸 View snapshots list
- 🔍 Filter by hosts and tags
- ⬇️ Download files from snapshots via browser
- ℹ️ View snapshot information
- 📱 Responsive web interface

## Requirements

- Docker
- Docker Compose
- Access to S3 storage with restic repository

## Installation

### Option 1: Ready Docker Image

1. Create `.env` file with settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   RESTIC_REPOSITORY=s3:https://s3.example.com/your-backup-bucket
   RESTIC_PASSWORD=your_restic_password
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   SECRET_KEY=random_string_for_jwt
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_admin_password
   ```

2. Run container:
   ```bash
   # From GitHub Container Registry
   docker run -d -p 8000:8000 --env-file .env ghcr.io/username/restic-web-manager:latest
   ```

3. Open http://localhost:8000 in browser

### Option 2: Build from Source

1. Copy `.env.example` to `.env` and configure variables:
   ```bash
   cp .env.example .env
   ```

2. Run application:
   ```bash
   docker-compose up -d
   ```

## Usage

1. Login using credentials from `.env`
2. Browse snapshots list
3. Filter by hosts and tags
4. Click on file to download

## Testing

To run tests:
```bash
pip install -r requirements-test.txt
cd app && python -m pytest ../tests/ -v
```

## API

- `GET /` - main page
- `POST /login` - authentication
- `GET /snapshots` - snapshots list
- `GET /download/{snapshot_id}/{path}` - file download

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to the project.

## 📄 License

This project is licensed under MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Restic](https://restic.net/) - for excellent backup tool
- [FastAPI](https://fastapi.tiangolo.com/) - for modern web framework
- All contributors who help improve the project
