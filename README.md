# Marksmith

The smart Markdown toolkit for VS Code / Windsurf.

> Smart Paste · Bi-directional Preview · Document X-Ray — and everything you need for Markdown.

## Highlights

### Smart Paste

클립보드 내용을 자동으로 최적의 마크다운으로 변환합니다.

- **HTML → Markdown** — 웹페이지/Word에서 복사한 HTML을 깨끗한 마크다운으로 변환
- **URL → Link** — URL 붙여넣기 시 페이지 제목을 자동 fetch하여 `[제목](url)` 생성
- **표 데이터 → Table** — Excel/Google Sheets에서 복사한 TSV/CSV를 마크다운 테이블로 변환
- **선택 텍스트 + URL** — 텍스트 선택 후 URL 붙여넣기 시 자동 링크 래핑

### Bi-directional Preview

미리보기와 에디터가 양방향으로 연동됩니다.

- **클릭 → 소스 점프** — 미리보기 요소 클릭 시 에디터 해당 라인으로 이동
- **스크롤 동기화** — 에디터 스크롤 ↔ 프리뷰 스크롤 실시간 연동
- **체크박스 토글** — 미리보기에서 체크박스 클릭 시 소스 자동 수정
- **인라인 편집** — 미리보기에서 텍스트 더블클릭으로 직접 편집
- **증분 업데이트** — 전체 리렌더 대신 변경분만 DOM 패치

### Document X-Ray

사이드바에서 문서를 실시간 분석합니다.

- **단어 수 / 읽기 시간** — 한국어/영어 혼합 문서 지원, 상태바에 항시 표시
- **가독성 점수** — 문장 길이, 헤딩 구조, 단어 복잡도 기반 0–100점
- **헤딩 구조 트리** — 클릭 시 해당 위치로 점프
- **단어 빈도 차트** — 과다 사용 단어를 한눈에 파악
- **링크 헬스 체크** — 문서 내 모든 URL 유효성 검증

### 미리보기 강화

- **실시간 미리보기** — 편집과 동시에 Webview 패널에서 렌더링
- **KaTeX 수식 지원** — `$...$` (인라인) 및 `$$...$$` (블록) 수식 렌더링
- **Mermaid 다이어그램** — ` ```mermaid ` 코드 블록 자동 렌더링
- **3가지 테마** — GitHub, Dark, Minimal 테마 제공
- **체크박스(Task list)** 지원

### 린터 / 포맷터

- **markdownlint 통합** — 저장 시 자동 린팅, Problems 패널에 결과 표시
- **자동 포맷터** — 빈 줄 정규화, 후행 공백 제거, 불릿 통일 등

### 변환 / 내보내기

- **HTML 내보내기** — 테마 적용된 완전한 HTML 파일로 저장
- **PDF 내보내기** — Chromium 기반 고품질 PDF 생성

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

## 설정 옵션

| 설정 | 기본값 | 설명 |
|------|--------|------|
| `marksmith.preview.theme` | `github` | 미리보기 테마 (github / dark / minimal) |
| `marksmith.preview.fontSize` | `16` | 미리보기 폰트 크기 (px) |
| `marksmith.linter.enabled` | `true` | 저장 시 자동 린팅 활성화 |
| `marksmith.formatter.onSave` | `false` | 저장 시 자동 포맷 활성화 |
| `marksmith.export.pdfMargin` | `20mm` | PDF 여백 |
| `marksmith.smartPaste.enabled` | `true` | Smart Paste 활성화 |
| `marksmith.smartPaste.imageFolder` | `assets` | 이미지 저장 폴더 |
| `marksmith.xray.enabled` | `true` | Document X-Ray 활성화 |
| `marksmith.xray.checkLinks` | `false` | 링크 자동 검증 |

## 커맨드

| 커맨드 | 단축키 | 설명 |
|--------|--------|------|
| Marksmith: Open Enhanced Preview | `Cmd+Shift+V` | 미리보기 열기 |
| Marksmith: Smart Paste | — | 스마트 붙여넣기 |
| Marksmith: Format Document | `Cmd+Shift+F` | 문서 포맷팅 |
| Marksmith: Lint Document | — | 문서 린팅 |
| Marksmith: Export to HTML | — | HTML로 내보내기 |
| Marksmith: Export to PDF | — | PDF로 내보내기 |

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

## 라이선스

MIT
