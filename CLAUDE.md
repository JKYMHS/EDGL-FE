# EDGL-FE — 어디 갈래 웹 프론트엔드

관광지·축제를 탐색·비교하고 AI 여행 코스를 받아 여행으로 저장하고 구글 캘린더에 올리는 데스크톱 웹 서비스의 FE 저장소다.

## 문서 (작업 전에 읽을 것)

- [docs/PRD.md](docs/PRD.md) — 제품 요구사항: 기능, 화면 구조, 접근 권한, 입력 제한, 에러 코드
- [docs/TRD.md](docs/TRD.md) — 기술 요구사항: 스택, 폴더 구조, 인증, API 연결 현황, 테스트
- [docs/research/onboarding-style-review.md](docs/research/onboarding-style-review.md) — 온보딩 여행 스타일 분류 검토
- [CONTRIBUTING.md](CONTRIBUTING.md) — 브랜치·커밋·PR 규칙
- Notion: [기능 명세서](https://app.notion.com/p/3e43b7994291804ca293df5cda4d658d), [API 명세서](https://app.notion.com/p/4063b79942918093b5effa5b7a153295)
- 기준 디자인: `어디 갈래 전체 화면 (명세 반영).html` (사용자 다운로드 폴더, 저장소에는 없음)

## 꼭 지킬 것

- **API 명세서와 일치하는 기능만 실제 API에 연결한다.** 연결 범위는 TRD 7장 표가 기준이고, 미연결 기능은 MSW 목업으로만 동작시킨다. 판단은 `src/shared/api/api-readiness.ts` 한 곳에서 한다.
- 기능 명세 ID(`FUNC-xxx`)와 API ID를 코드·PR에서 그대로 쓴다.
- 코드를 쓰면 테스트도 함께 쓴다 (TRD 11장).
- 토큰은 localStorage·sessionStorage에 저장하지 않는다 (TRD 4.1).
- 날짜 계산은 `shared/lib`의 KST 함수만 쓴다.
- 사용자에게 보이는 문구와 문서는 한국어로 쓴다.
- 커밋·브랜치는 CONTRIBUTING.md 규칙을 따른다.

## 개발 환경

- 패키지 매니저는 pnpm. 키는 `.env.example`을 `.env.local`로 복사해 채운다.
- Superset 작업공간에서는 `.superset/` 스크립트가 의존성 설치, `.env*` 복사, 작업공간별 포트 지정을 처리한다.
