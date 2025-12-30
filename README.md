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

**[🇷🇺 Русская версия](README.ru.md)**

Modern web interface for viewing and downloading backups from restic repository. Built with FastAPI backend and React frontend.

## 🚀 Features

- 🔐 User authentication via JWT tokens
- 📸 View snapshots list with pagination
- 🔍 Advanced filtering by hosts and tags
- ⬇️ Download files from snapshots via browser
- 📁 Interactive file browser for snapshots
- ℹ️ Detailed snapshot information and statistics
- 📱 Responsive React-based web interface
- 🚀 Modern SPA architecture
- 📊 Real-time snapshot size loading
- 🎨 Clean and intuitive UI/UX

## 🏗️ Architecture

- **Backend**: FastAPI (Python 3.10+) with modular structure
- **Frontend**: React 18 + TypeScript + Vite
- **Testing**: pytest (backend) + Vitest + React Testing Library (frontend)
- **Code Quality**: Black, isort, flake8, mypy, ESLint
- **CI/CD**: GitHub Actions with automated testing and releases
- **Containerization**: Multi-stage Docker builds

## Requirements

- Docker & Docker Compose
- Access to S3 storage with restic repository
- Modern web browser with JavaScript enabled

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
   From GitHub Container Registry
   ```bash
   docker run -d -p 8000:8000 --env-file .env ghcr.io/pazter1101/restic-web-manager:latest
   ```
   Or from Docker Hub
   ```bash
   docker run -d -p 8000:8000 --env-file .env pazter1101/restic-web-manager:latest
   ```

3. Open http://localhost:8000 in browser

### Option 2: Build from Source

1. Copy `.env.example` to `.env` and configure variables:
   ```bash
   cp .env.example .env
   ```

2. Run application:
   ```bash
   docker compose up -d
   ```

## Usage

1. Login using credentials from `.env`
2. Browse snapshots list
3. Filter by hosts and tags
4. Click on file to download

## Testing

### Backend Tests
```bash
pip install -r requirements-test.txt
cd app && python -m pytest ../tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm ci
npm test -- --run
```

### Code Quality
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

- `GET /` - serve React SPA
- `POST /api/login` - user authentication
- `GET /api/snapshots` - get snapshots list with pagination and filtering
- `GET /api/snapshot/{snapshot_id}/size` - get snapshot size
- `GET /api/snapshots/{snapshot_id}/files` - get files in snapshot
- `POST /api/upload` - upload files and create backup
- `GET /api/download/{snapshot_id}` - download files from snapshot

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to the project.

## 📄 License

This project is licensed under MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Restic](https://restic.net/) - for excellent backup tool
- [FastAPI](https://fastapi.tiangolo.com/) - for modern web framework
- All contributors who help improve the project
