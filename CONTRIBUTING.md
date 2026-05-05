# Contributing to Marksmith

## 설치 및 빌드

```bash
cd marksmith
npm install
npm run compile
```

## 개발 모드 실행

1. VS Code에서 이 폴더를 열기
2. `F5`를 눌러 Extension Development Host 실행
3. `.md` 파일을 열고 `Cmd+Shift+V`로 미리보기 확인

## 패키징

```bash
npm run package
```

생성된 `.vsix` 파일을 VS Code / Windsurf에서 직접 설치할 수 있습니다.

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
