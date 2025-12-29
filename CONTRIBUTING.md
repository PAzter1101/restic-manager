# Contributing

**[🇷🇺 Русская версия](CONTRIBUTING.ru.md)**

Thanks for your interest in the project! 🎉

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`cd app && python -m pytest ../tests/ -v`)
5. Check code with linters (`black . && isort . && flake8 .`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Create a Pull Request

## Code Style

- We use Black for formatting
- Maximum line length: 88 characters
- Imports are sorted with isort
- Code is checked with flake8 and mypy

## Running Locally

```bash
cp .env.example .env
# Edit .env
docker-compose up -d
```
