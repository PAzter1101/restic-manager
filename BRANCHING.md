# Branching and Release Strategy

**[🇷🇺 Русская версия](BRANCHING.ru.md)**

## Branches

### `main` 
- 🚀 **Production branch** - always stable
- Only through PR from `develop`
- Automatic releases when creating tags
- Protected from direct commits

### `develop`
- 🔧 **Development branch** - integration of new features
- Base branch for feature branches
- Regular merges to `main` for releases

### `feature/*`
- ✨ **Feature branches** - new functionality
- Created from `develop`
- Merged back to `develop` via PR

### `hotfix/*`
- 🚨 **Critical fixes**
- Created from `main`
- Merged to both `main` and `develop`

## Release Process

1. **Development**: `feature/new-auth` → `develop`
2. **Testing**: in `develop` branch
3. **Release**: `develop` → `main` + create tag `v1.2.3`
4. **Automation**: GitHub Actions creates release and Docker images

## Versioning (SemVer)

- `v1.0.0` - major version (breaking changes)
- `v1.1.0` - minor version (new features)
- `v1.1.1` - patch (bug fixes)

## Commands

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Create release
git checkout main
git merge develop
git tag v1.2.3
git push origin main --tags
```
