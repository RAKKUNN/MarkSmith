# Contributing to Marksmith

## 릴리스 절차

1. `CHANGELOG.md`에 새 버전 섹션 추가
2. `package.json`의 `version` 필드 업데이트
3. 커밋 후 태그 생성 및 푸시:
   ```bash
   git add -A && git commit -m "release: v0.x.x"
   git tag v0.x.x
   git push origin main --tags
   ```
4. GitHub Actions가 자동으로 빌드 → 테스트 → VS Code Marketplace 퍼블리싱 실행
5. GitHub Releases 페이지에 `.vsix` 파일과 릴리스 노트 자동 생성

> **사전 준비**: GitHub 저장소 Settings → Secrets에 `VSCE_PAT` (VS Code Marketplace Personal Access Token)을 등록해야 합니다.
