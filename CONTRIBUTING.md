# 협업 규칙

## 브랜치

| 브랜치 | 용도 | 예 |
|---|---|---|
| `main` | 항상 실행 가능한 상태. 직접 커밋하지 않는다 | |
| `feat/{기능ID}-{요약}` | 기능 개발 | `feat/FUNC-002-01-explore-list` |
| `fix/{요약}` | 버그 수정 | `fix/token-reissue-race` |
| `docs/{요약}` | 문서 | `docs/trd-api-status` |
| `test/{요약}` | 테스트만 추가·수정 | `test/compare-store` |
| `refactor/{요약}` | 동작 변화 없는 구조 개선 | `refactor/http-client` |
| `chore/{요약}` | 설정·의존성·빌드 | `chore/setup-vite` |

- 요약은 영어 소문자와 `-`로 짧게 쓴다.
- `main`에는 PR로만 합치고 **Squash merge**한다. PR 제목이 최종 커밋 메시지가 된다.
- 한 PR에는 한 가지 목적만 담는다.

## 커밋 메시지

```
타입(범위): 한국어 요약

(선택) 본문 — 무엇을 왜 바꿨는지
```

| 타입 | 의미 |
|---|---|
| `feat` | 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 |
| `style` | 동작과 무관한 서식 |
| `refactor` | 동작 변화 없는 구조 개선 |
| `test` | 테스트 |
| `chore` | 설정·의존성·빌드 |

- **범위**는 폴더 구조의 기능 이름을 쓴다: `auth`, `onboarding`, `consent`, `explore`, `place`, `compare`, `recommend`, `trip`, `calendar`, `ui`, `map`, `api`, `config`. 여러 곳이면 생략한다.
- 요약은 50자 이내, 마침표 없이, "~한다"가 아니라 명사형·동사 원형으로 쓴다.

예

```
feat(explore): 탐색 목록 무한 스크롤
fix(auth): 토큰 재발급 중복 요청 방지
test(compare): 비교 목록 저장·복원 테스트
docs: TRD API 연결 현황 갱신
```

## PR

- 제목은 커밋 메시지 규칙을 따른다.
- 본문에 관련 기능 ID(`FUNC-xxx`)와 API ID, 테스트 방법을 적는다.
- 머지 전 `pnpm lint`, `pnpm typecheck`, `pnpm test`가 통과해야 한다.
- 기능 코드에는 테스트를 함께 넣는다 ([TRD 11장](docs/TRD.md#11-테스트)).
- API 명세서와 일치하지 않는 기능을 실제 API에 연결하지 않는다 ([TRD 7장](docs/TRD.md#7-api-연결-현황)).
