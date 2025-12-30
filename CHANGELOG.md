## [1.3.1](https://github.com/PAzter1101/restic-manager/compare/v1.3.0...v1.3.1) (2025-12-30)


### Bug Fixes

* correct GitHub Actions syntax for Docker tags ([d3262cd](https://github.com/PAzter1101/restic-manager/commit/d3262cd56465a875b2680f955b0e859ba7c30548))
* improve Docker image tagging with semantic-release outputs ([2f2ed29](https://github.com/PAzter1101/restic-manager/commit/2f2ed29eb1353f023487c282634e24db02e8efe1))

## 🐳 Docker Images

- **GitHub Container Registry**: `ghcr.io/pazter1101/restic-manager:1.3.1`
- **Docker Hub**: `pazter1101/restic-manager:1.3.1`

### Usage
```bash
docker run -d -p 8000:8000 --env-file .env ghcr.io/pazter1101/restic-manager:1.3.1
```

# [1.3.0](https://github.com/PAzter1101/restic-manager/compare/v1.2.1...v1.3.0) (2025-12-30)


### Features

* add Docker image links to releases and fix image tagging ([0f1b461](https://github.com/PAzter1101/restic-manager/commit/0f1b4615bfb001ff32916d030232a56163db5af8))

## [1.2.1](https://github.com/PAzter1101/restic-manager/compare/v1.2.0...v1.2.1) (2025-12-29)


### Bug Fixes

* add permissions for develop branch sync ([d4e5c13](https://github.com/PAzter1101/restic-manager/commit/d4e5c13e12be216ac9185012a1363e1cc4f7b8a6))

# [1.2.0](https://github.com/PAzter1101/restic-manager/compare/v1.1.2...v1.2.0) (2025-12-29)


### Features

* consolidate all CI/CD jobs into single workflow for reliability ([282cc14](https://github.com/PAzter1101/restic-manager/commit/282cc14863de98985a41276f93bac59abbf6bcde))

## [1.1.2](https://github.com/PAzter1101/restic-manager/compare/v1.1.1...v1.1.2) (2025-12-29)


### Bug Fixes

* standardize workflow name to Tests ([a6dd2d1](https://github.com/PAzter1101/restic-manager/commit/a6dd2d1989f34ecb03befb5369ba6b004f383733))

## [1.1.1](https://github.com/PAzter1101/restic-manager/compare/v1.1.0...v1.1.1) (2025-12-29)


### Bug Fixes

* ensure semantic-release waits for all matrix test jobs ([36ceba5](https://github.com/PAzter1101/restic-manager/commit/36ceba54e8fdda68819a1ab0d711cc134b32f70f))

# [1.1.0](https://github.com/PAzter1101/restic-manager/compare/v1.0.0...v1.1.0) (2025-12-29)


### Features

* consolidate semantic-release into Tests workflow for reliability ([2b72019](https://github.com/PAzter1101/restic-manager/commit/2b7201981723a251594125fcc3880eea31aea115))
* exclude merge commits from semantic-release trigger ([a6e2965](https://github.com/PAzter1101/restic-manager/commit/a6e2965fe8434f763ea1498785f08b64d2cc1a79))
* fix semantic-release workflow execution order ([c29f748](https://github.com/PAzter1101/restic-manager/commit/c29f74854db09b0fff61ebd310b29a9cec731062))

# 1.0.0 (2025-12-29)


* feat!: добавить отдельный React фронтенд ([e5700e5](https://github.com/PAzter1101/restic-manager/commit/e5700e59f147d435ee5888f168c36bae1d7435f7))


### Bug Fixes

* исправить качество кода и настроить линтеры ([fa098e2](https://github.com/PAzter1101/restic-manager/commit/fa098e2a264496d6e5263dee9ea04cd2f706e468))


### Features

* **ci:** Configure multi-registry Docker image publishing ([d48f04b](https://github.com/PAzter1101/restic-manager/commit/d48f04ba875635af5a1b96d847ed651a59234b95))
* **frontend:** Implement Vitest and React Testing Library setup ([022b062](https://github.com/PAzter1101/restic-manager/commit/022b062e0963e2220dfe0f09963e35df9ff9e8a4))


### BREAKING CHANGES

* полностью переписан пользовательский интерфейс с использованием React и TypeScript вместо серверных шаблонов. Изменена архитектура приложения на SPA с отдельным API бэкендом.
