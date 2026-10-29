# 어디 갈래 FE — TRD (Technical Requirements Document)

| 항목 | 내용 |
|---|---|
| 대상 | EDGL-FE (웹 프론트엔드) |
| 문서 상태 | 초안 (v0.1, 2026-10-28) |
| 제품 요구사항 | [PRD](PRD.md) |
| 원천 문서 | [Notion · 기능 명세서](https://app.notion.com/p/3e43b7994291804ca293df5cda4d658d) · [Notion · API 명세서](https://app.notion.com/p/4063b79942918093b5effa5b7a153295) |
| 협업 규칙 | [CONTRIBUTING.md](../CONTRIBUTING.md) |

---

## 0. 결정 요약

| # | 결정 | 근거 |
|---|---|---|
| 1 | Vite + React + TypeScript SPA | 데스크톱 전용, SEO 요구 없음, 지도·표 중심의 인터랙티브 화면 |
| 2 | **API 명세서와 일치하는 기능만 실제 API에 연결**한다. 일치하지 않는 기능은 화면을 만들되 MSW 목업으로만 동작시킨다 | 2026-10-28 결정. API 명세서는 기능 명세 변경(여행 > 일정안 등) 전 기준이며 나중에 갱신 예정 ([7장](#7-api-연결-현황)) |
| 3 | 액세스 토큰은 메모리, 리프레시 토큰은 서버가 내려주는 **httpOnly 쿠키** | 2026-10-28 결정(A). 현재 API 명세는 두 토큰을 응답 본문으로 주며 백엔드가 바꿀 예정 ([4.1](#41-토큰-보관)) |
| 4 | 에러 응답에 **`code` 필드**가 추가된다. FE는 `code`로 분기하고, 없으면 HTTP 상태로 대체 | 2026-10-28 결정(B) ([5.3](#53-에러-처리)) |
| 5 | AI 코스 생성 진행·캘린더 작업 상태는 **SSE**로 받는다. SSE 명세가 나오기 전에는 현재 명세의 polling으로 연결 | 2026-10-28 결정(C) ([6장](#6-실시간-진행-상태-sse)) |
| 6 | 구글 로그인·캘린더 연동은 **FE가 구글 인가 화면으로 보내고 콜백에서 받은 code를 서버에 전달**한다 | 2026-10-28 결정(E), API 명세 `AUTH_GOOGLE_LOGIN`·`CALENDAR_CONNECT` ([4.4](#44-구글-oauth)) |
| 7 | 카카오 로컬(출발지 검색)은 서버를 거친다 (`PLACE_SEARCH`). FE는 카카오맵 JavaScript 키만 쓴다 | REST 키 노출 방지. API 명세와 일치 |
| 8 | 지원 브라우저는 최신 Chrome·Edge. 화면 폭 1280px 미만은 안내 화면 | PRD 7장, 2026-10-28 결정 |
| 9 | 배포는 아직 하지 않는다. CI도 아직 두지 않는다 | 2026-10-28 결정 |

---

## 1. 기술 스택

버전은 초기 설정 시 최신 안정 버전으로 고정하며 `package.json`이 기준이다.

| 영역 | 선택 | 쓰임 |
|---|---|---|
| 언어 | TypeScript (`strict`) | |
| 빌드 | Vite | 개발 서버, 번들링. `pnpm dev`는 `.superset/run.sh`가 실행 |
| UI | React | |
| 라우팅 | React Router | PRD 6.2 경로표 |
| 서버 상태 | TanStack Query | 캐시, 무한 스크롤, 낙관적 업데이트, polling |
| 클라이언트 상태 | Zustand | 세션, 비교 목록, 로그인 후 이어서 실행, 추천 요청 입력값 |
| 폼·검증 | React Hook Form + Zod | PRD 8.1 입력 제한 |
| HTTP | axios | 인증 헤더, 401 재발급, 에러 정규화 |
| SSE | `@microsoft/fetch-event-source` | `Authorization` 헤더를 보낼 수 있는 fetch 기반 SSE |
| 스타일 | Tailwind CSS + CSS 변수 디자인 토큰 | |
| 기본 컴포넌트 | Radix UI Primitives | 모달, 드롭다운, 토글, 탭의 접근성 |
| 지도 | 카카오맵 JavaScript SDK + `react-kakao-maps-sdk` | 탐색·찜·상세·코스 지도 |
| 드래그 정렬 | dnd-kit | 일정 편집 |
| 날짜 | date-fns + `@date-fns/tz` | KST 계산 |
| 달력 | react-day-picker | 추천 요청 기간 선택 |
| 아이콘 | lucide-react | |
| 글꼴 | Pretendard, JetBrains Mono (npm 패키지로 자체 호스팅) | 디자인 00 |
| API 목업 | MSW | 개발·테스트, 미연결 기능 |
| 테스트 | Vitest + Testing Library, Playwright | [11장](#11-테스트) |
| 코드 품질 | ESLint + Prettier | |
| 패키지 매니저 | pnpm | |

---

## 2. 폴더 구조

```
src/
├─ app/                  # 진입점: 라우터, Provider(Query·Router), 전역 스타일, 데스크톱 전용 안내
├─ pages/                # 화면 단위. PRD 6.2 경로와 1:1
│  ├─ search-start/  explore/  place-detail/  likes/
│  ├─ recommend/  trips/  plan-edit/  calendar-upload/
│  ├─ my/  auth/  oauth/  # oauth: 구글 콜백 화면
├─ features/             # 기능별 로직과 전용 UI
│  ├─ auth/  onboarding/  consent/
│  ├─ explore/  place/  compare/
│  ├─ recommend/  trip/  calendar/
│  └─ (각 기능) api/ · components/ · model/ · lib/
├─ shared/
│  ├─ api/               # http 클라이언트, 토큰 재발급, 에러 정규화, SSE, 연결 현황(api-readiness)
│  ├─ ui/                # 디자인 시스템 컴포넌트
│  ├─ map/               # 카카오맵 래퍼, 마커, 경로 선, 반경
│  ├─ lib/               # KST 날짜, 숫자 표시, 검증 스키마
│  └─ config/            # 환경 변수 읽기
├─ mocks/                # MSW 핸들러·목업 데이터
└─ test/                 # 테스트 공용 설정·유틸
e2e/                     # Playwright 시나리오
```

**의존 규칙**

- `pages → features → shared` 방향으로만 가져다 쓴다.
- `features`끼리는 각 기능의 `index.ts`가 공개한 것만 쓴다. 예: 상세의 "코스 추천받기"는 `compare`·`recommend`의 공개 함수만 호출한다.
- `shared`는 `features`·`pages`를 모른다.
- 경로 별칭은 `@/` → `src/`.

**이름 규칙**

| 대상 | 규칙 | 예 |
|---|---|---|
| 폴더·파일 | kebab-case | `explore-table.tsx` |
| 컴포넌트 | PascalCase | `ExploreTable` |
| 훅 | `use` + camelCase | `useContentList` |
| Zustand 스토어 | `use` + 이름 + `Store` | `useCompareStore` |
| Query 키 | 기능별 팩토리 | `contentKeys.list(filters)` |
| 테스트 | 대상 옆 `*.test.ts(x)`, E2E는 `e2e/*.spec.ts` | |

---

## 3. 라우팅과 접근 권한

PRD 6.2의 경로를 그대로 쓴다. 로그인 필요 경로는 `RequireAuth` 레이아웃으로 감싼다.

| 경로 | 화면 | 접근 |
|---|---|---|
| `/` | 검색 시작 | 공개 |
| `/explore` | 탐색 (`?tab=festival\|place&q=&region=&category=&status=&sort=&chip=`) | 공개 |
| `/places/:id` | 상세 | 공개 |
| `/likes` | 찜 | 로그인 |
| `/recommend` | 추천 요청 5단계 | 로그인 |
| `/recommend/:requestId` | 생성 중 · 결과 | 로그인 |
| `/trips`, `/trips/:tripId` | 내 여행 목록 · 여행 상세 | 로그인 |
| `/trips/:tripId/plans/:planId/edit` | 일정 편집 | 로그인 |
| `/trips/:tripId/calendar` | 캘린더 업로드 | 로그인 |
| `/my/account`, `/my/preferences`, `/my/calendar`, `/my/password` | 마이페이지 | 로그인 |
| `/login`, `/signup`, `/password/reset`, `/link-account` | 인증 | 공개 |
| `/onboarding` | 온보딩 | 로그인 |
| `/oauth/google/callback`, `/oauth/google/calendar/callback` | 구글 콜백 | 공개 |

- **복귀 주소:** `/login?returnTo=` 로 넘긴다. `returnTo`는 `/`로 시작하고 `//`로 시작하지 않는 내부 경로만 허용하며, 아니면 `/`로 보낸다.
- **로그인 후 이어서 실행 (PRD 5.0):** 누른 동작을 `pendingAction`(`{ type: 'WISH' | 'RECOMMEND' | 'COMPARE_RECOMMEND' | 'ADD_TO_TRIP', payload }`)으로 sessionStorage에 저장한다. 구글 로그인처럼 페이지를 벗어나도 남아야 하기 때문이다. 로그인(또는 온보딩) 완료 후 복귀 주소로 이동하고 한 번 실행한 뒤 지운다.
- **데스크톱 전용:** 앱 최상단에서 `window.innerWidth < 1280`이면 안내 화면만 그린다(리사이즈 반영).

---

## 4. 인증

### 4.1 토큰 보관

| 토큰 | 목표 (결정 A) | 현재 API 명세 대응 |
|---|---|---|
| 액세스 | 응답 본문으로 받아 **메모리**(Zustand, 비영속)에만 둔다 | 같음 |
| 리프레시 | 서버가 **httpOnly 쿠키**로 설정. FE는 읽지 않는다 | 현재 명세는 본문으로 준다. 이 경우 **메모리에만** 두고(새로고침하면 로그아웃) 재발급 요청에 담아 보낸다. localStorage·sessionStorage에는 저장하지 않는다 |

- 모든 요청은 `withCredentials: true` (쿠키 전송).
- 토큰이 필요한 요청은 `Authorization: Bearer {accessToken}`.
- **앱 시작 시 세션 복구:** `POST /api/auth/reissue`를 한 번 조용히 호출한다. 성공하면 로그인 상태, 실패하면 비로그인 상태로 시작한다(쿠키 전환 후 유효).

### 4.2 401 처리와 재발급

1. 응답이 401이면 재발급을 **한 번만** 실행하고(동시에 여러 요청이 401이어도 재발급 요청은 하나), 대기하던 요청을 새 토큰으로 다시 보낸다.
2. 재발급이 실패하면 세션을 비운다.
   - 로그인 필요 화면이면 현재 주소를 `returnTo`로 넘겨 `/login`으로 보낸다.
   - 공개 화면이면 비로그인 상태로 전환만 하고 화면을 유지한다.
3. 재발급 요청 자체와 로그인 요청의 401은 재시도하지 않는다.

### 4.3 로그인 필요 모달

- 공개 화면의 로그인 필요 버튼(찜, 일정에 추가, 코스 추천받기 등)은 `useRequireLogin(action)` 훅으로 감싼다.
- 로그인 상태면 바로 실행하고, 아니면 `pendingAction`을 저장한 뒤 모달을 띄운다(문구 4종, 디자인 14-1·14-2).

### 4.4 구글 OAuth

| 용도 | scope | 콜백 경로 | 서버 API |
|---|---|---|---|
| 로그인·가입 | `openid email profile` | `/oauth/google/callback` | `POST /api/auth/google` |
| 마이페이지 계정 연결 | `openid email profile` | `/oauth/google/callback` (`state`에 목적 표시) | `POST /api/members/me/google` |
| 캘린더 연동 | `https://www.googleapis.com/auth/calendar.events` (+ 캘린더 목록 읽기, API 명세 갱신 후) · `access_type=offline` · `prompt=consent` | `/oauth/google/calendar/callback` | `POST /api/calendar` |

1. FE가 무작위 `state`를 만들어 sessionStorage에 저장하고 구글 인가 화면으로 이동한다(`VITE_GOOGLE_CLIENT_ID`, 리다이렉트 주소).
2. 콜백 화면에서 `state`가 일치하는지 확인한다. 다르면 요청을 버리고 로그인 페이지로 보낸다(PRD 001-02).
3. `code`를 서버 API에 보낸다. 서버는 같은 리다이렉트 주소로 토큰을 교환한다.
4. 응답에 따라 이동한다: 로그인 완료 → 복귀 주소·`pendingAction`, 연결 필요(`LINK_REQUIRED`) → `/link-account`, 신규 → 약관 동의 → 온보딩.
5. 사용자가 동의를 취소해 `error=access_denied`로 돌아오면 이전 화면으로 보내고 안내한다.

- 리다이렉트 주소는 `VITE_GOOGLE_REDIRECT_URI`, `VITE_GOOGLE_CALENDAR_REDIRECT_URI`로 둔다. 구글 클라우드 콘솔에 등록하는 일은 사용자 담당이다.

---

## 5. API 연동

### 5.1 클라이언트 구성

- 기본 주소는 `VITE_API_BASE_URL`. 개발 중에는 Vite 프록시로 같은 출처처럼 보내 쿠키·CORS 문제를 피한다(`/api` → 백엔드).
- 요청·응답 타입은 `features/*/api/types.ts`에 API 명세를 그대로 옮겨 정의한다. 명세가 바뀌면 이 파일과 MSW 핸들러를 함께 고친다.
- 날짜는 `YYYY-MM-DD`, 시각은 `HH:mm` 문자열 그대로 받고, 계산은 `shared/lib/date`의 KST 함수만 쓴다.

### 5.2 Query 규칙

| 항목 | 규칙 |
|---|---|
| 키 | 기능별 키 팩토리 (`contentKeys`, `wishKeys`, `recommendKeys` …) |
| 커서 목록 | `useInfiniteQuery`, `nextCursor`·`hasNext` 사용. 400(잘못된 커서)·409(인기순 배치 버전 변경)이면 첫 페이지부터 다시 조회 |
| 찜 | 낙관적 업데이트, 실패 시 롤백 + 토스트, 연속 클릭 300ms 디바운스 |
| 기본 옵션 | `staleTime` 30초, 401·4xx는 재시도 안 함, 5xx·네트워크 오류는 1회 재시도 |

### 5.3 에러 처리

- 응답 형식: `{ code?, message, status, timestamp, description }`. `code`는 결정 B로 추가될 필드다.
- `shared/api/errors.ts`가 모든 실패를 `AppError { code, status, message, description }`으로 정규화한다.
- 화면 처리는 `code` 기준으로 PRD 8.2 표를 따른다. `code`가 없으면 HTTP 상태별 기본 처리로 대체한다.
- 서버 `message`는 사용자 안내 문구로 그대로 써도 되는 문장이다. FE 전용 문구는 `code`별 사전에 둔다.

**API 명세와 PRD가 다른 상태 코드** (`code` 도입 시 해소)

| 상황 | PRD 8.2 | 현재 API 명세 |
|---|---|---|
| 로그인 잠금 | 429 `LOGIN_LOCKED` | 423 |
| 구글 전용 계정으로 이메일 로그인 | 401 `INVALID_CREDENTIALS` (구분 안 함) | 409 별도 메시지 |
| 꼭 포함할 장소 지역·기간 불일치 | 경고만 | 422 |

---

## 6. 실시간 진행 상태 (SSE)

### 6.1 구조

- `shared/api/sse.ts`에 `subscribe(url, handlers)`를 둔다. 내부는 `fetch-event-source`이며, 액세스 토큰 헤더를 넣고 401이면 재발급 후 다시 연결한다.
- 기능 코드는 `subscribeRecommendation(requestId, handlers)`, `subscribeCalendarJob(jobId, handlers)` 같은 **어댑터**만 쓴다.
- 어댑터 안에서 SSE와 polling을 바꿔 끼운다. 명세가 나오기 전에는 polling 구현을 쓴다.

### 6.2 현재 연결 (API 명세 기준 polling)

| 대상 | 방식 |
|---|---|
| AI 코스 생성 | `GET /api/recommendations/{requestId}`를 2초 간격 조회. `PENDING` → 계속, `DONE`·`FALLBACK` → 결과, `FAILED` → 실패 화면(`refunded` 표시). 생성 중 화면의 5단계 표시는 단계 정보가 없으므로 시간 경과로만 진행 막대를 보여준다 |
| 캘린더 작업 | `GET /api/calendar/jobs/{jobId}` — 업로드 API가 미연결이라 당장은 쓰지 않음 |

### 6.3 SSE 이벤트 제안 (백엔드 명세 확정 전 초안)

| 엔드포인트 | 이벤트 | 데이터 |
|---|---|---|
| `GET /api/recommendations/{requestId}/events` | `progress` | `{ step: 'CANDIDATES' \| 'COMPOSE' \| 'HOURS' \| 'ROUTES' \| 'MEALS', index, total, message }` |
| | `done` | `{ status: 'DONE' \| 'FALLBACK' }` → FE가 결과 조회 API로 본문을 받음 |
| | `failed` | `{ refunded }` |
| `GET /api/calendar/jobs/{jobId}/events` | `progress` / `done` / `failed` | `{ total, succeeded, failed, failedItemIds }` |

- 연결이 끊기면 지수 백오프로 최대 3회 다시 연결하고, 그래도 안 되면 polling으로 넘어간다.

---

## 7. API 연결 현황

결정 2: **이 표에서 "연결"인 것만 실제 API를 호출한다.** "부분"은 표의 연결 범위만 호출하고, 나머지 요소는 숨기거나 목업으로 둔다. "미연결"은 화면을 디자인대로 만들되 MSW 목업으로만 동작한다.

- 실제 서버 모드(`VITE_API_MOCKING=false`)에서는 미연결 기능의 진입 버튼을 "준비 중"으로 비활성화한다. 판단은 `shared/api/api-readiness.ts` 한 곳에서 한다.
- API 명세가 갱신되면 이 표와 `api-readiness.ts`를 함께 고친다.

| 기능 (PRD) | API ID | 상태 | 연결 범위 / 미연결 이유 |
|---|---|---|---|
| 이메일 인증·가입 (001-06, 07) | `AUTH_EMAIL_SEND`, `AUTH_EMAIL_VERIFY`, `AUTH_SIGNUP` | 부분 | 가입 연결. 약관 중 **위치 정보 동의**는 API에 없어 보내지 않음 |
| 이메일 로그인·재발급·로그아웃 (001-01, 11) | `AUTH_LOGIN`, `AUTH_REISSUE`, `AUTH_LOGOUT` | 연결 | 토큰 보관은 4.1 |
| 구글 로그인·연결 (001-02, 04, 08) | `AUTH_GOOGLE_LOGIN`, `AUTH_GOOGLE_LINK`, `MEMBER_GOOGLE_LINK`, `MEMBER_GOOGLE_UNLINK` | 연결 | 4.4 |
| 비밀번호 찾기·변경·설정 (001-09, 10) | `AUTH_PASSWORD_RESET`, `MEMBER_PASSWORD_CHANGE`, `MEMBER_PASSWORD_SET` | 연결 | |
| 내 정보·탈퇴 (001-12) | `MEMBER_ME_QUERY`, `MEMBER_WITHDRAW` | 연결 | |
| 온보딩 건너뛰기 (001-13) | `MEMBER_ONBOARDING_SKIP` | 연결 | |
| 온보딩·취향 저장·조회 (001-13, 14) | `MEMBER_PREFERENCE_SAVE`, `MEMBER_PREFERENCE_QUERY` | **미연결** | API는 관심 카테고리(필수)·아침형/저녁형·유모차/휠체어를 받음. 새 온보딩(스타일 7개 중 1~3개, 시간대 3종, 이동 편의)과 다름 |
| 동의 설정 (001-15) | `MEMBER_CONSENT_QUERY`, `MEMBER_CONSENT_UPDATE` | 부분 | 행동 데이터·이메일 알림 연결. 위치 정보 동의는 API 없음 |
| 지역·카테고리 목록 (002-02) | `REGION_LIST`, `CATEGORY_LIST` | 연결 | 탐색 필터용. 온보딩에는 쓰지 않음 |
| 탐색 목록 (002-01~03) | `CONTENT_LIST` | 부분 | 표 목록, 지역 하나·카테고리·진행상태 필터, 인기순·개최 임박순 정렬 연결. **미연결:** 지도 마커(응답에 좌표 없음), 빠른 필터 칩, 이름순 정렬, 실내·실외 라벨, 오늘 운영 상태, "이 지역에서 다시 찾기" |
| 검색·자동완성 (002-07) | `CONTENT_SEARCH`, `CONTENT_AUTOCOMPLETE` | 연결 | 추천 검색 칩은 칩 조건(빠른 필터)이 미연결이라 목업 |
| 출발지 검색 (003-01) | `PLACE_SEARCH` | 연결 | 현재 위치 → 주소 변환은 API 없음(미연결) |
| 상세 (002-04) | `CONTENT_DETAIL` | 부분 | 정보·이미지·찜 수 연결. **미연결:** 인기 점수, 실내·실외, 함께 가기 좋은 곳(002-09 API 없음) |
| 주변 음식점·숙박 (003-04, 10) | `CONTENT_NEARBY` | 연결 | |
| 찜·찜 목록 (002-05, 06) | `WISH_ADD`, `WISH_REMOVE`, `WISH_LIST` | 연결 | "종료된 축제 숨기기"는 응답의 `progress`로 FE에서 거름. "오늘 휴무 숨기기"는 운영 정보가 없어 미연결 |
| 비교 담기 (002-08) | — | 해당 없음 | 브라우저 저장. 요약 카드의 기간 겹침은 FE 계산, 휴무일 문장은 운영 정보가 없어 미연결 |
| 남은 추천 횟수 (003-01) | `RECOMMEND_QUOTA` | 연결 | |
| 추천 요청 (003-01) | `RECOMMEND_REQUEST` | 부분 | 지역 하나, 기간, 시작 시간, 출발지, 동행, 꼭 포함할 장소 연결. **미연결:** 시·군·구 복수 선택(`regionId` 하나), "실내 위주로 짜기" |
| 추천 결과·다시 추천 (003-02, 05) | `RECOMMEND_RESULT`, `RECOMMEND_RETRY` | 연결 | polling (6.2). 진행 단계는 SSE 명세 후 |
| 경로 다시 계산 (003-03) | `ROUTE_CALCULATE` | 연결 | 일정 편집이 미연결이라 당장은 추천 결과 화면에서만 사용 |
| 방문 확인 (003-09) | `VISIT_CHECK_*` | **미연결** | 일정(`schedules`) 기준. 여행 > 일정안 구조와 다름 |
| 여행·일정안 전체 (004-*) | `SCHEDULE_*` | **미연결** | API는 일정 1개 단위. 여행·일정안·확정·저장 위치 선택 구조와 다름 |
| 캘린더 연동·상태·해제 (005-01) | `CALENDAR_CONNECT`, `CALENDAR_STATUS`, `CALENDAR_DISCONNECT` | 부분 | 연동·해제 연결. 캘린더 목록 읽기 권한은 API 갱신 후 |
| 캘린더 업로드·일괄·작업 상태 (005-02~04) | `CALENDAR_UPLOAD`, `CALENDAR_BULK_UPLOAD`, `CALENDAR_JOB_STATUS` | **미연결** | 일정 기준이며 확정 일정안·캘린더 선택이 없음 |

---

## 8. 상태 관리

| 상태 | 위치 | 저장 | 비고 |
|---|---|---|---|
| 서버 데이터 | TanStack Query | 메모리 | |
| 세션(액세스 토큰, 사용자 요약, 온보딩 상태) | `useSessionStore` | 메모리 | 4.1 |
| 로그인 후 이어서 실행 | `pendingAction` | sessionStorage | 3장 |
| 비교 목록 | `useCompareStore` | localStorage (`edgl:compare`) | 개수 제한 없음, 삭제된 콘텐츠는 조회 시 제거 |
| 추천 요청 입력값 | `useRecommendDraftStore` | sessionStorage | 단계 이동·새로고침 대비. 현재 위치 좌표는 저장하지 않음 |
| 최근 검색어 | `useRecentSearchStore` | localStorage (`edgl:recent-search`) | 최대 10개 |
| OAuth `state` | — | sessionStorage | 4.4 |
| 탐색 필터·탭·정렬 | URL 쿼리 | 주소 | 공유·뒤로 가기 대응 |

---

## 9. 지도

- 카카오맵 SDK는 `VITE_KAKAO_MAP_APP_KEY`로 필요할 때 한 번만 불러온다(`autoload=false`).
- `shared/map` 공통 컴포넌트

| 컴포넌트 | 쓰임 |
|---|---|
| `MapView` | 지도 틀, 범위 맞춤, 로딩 실패 시 재시도 안내 (PRD 003-06) |
| `ExploreMarker` | 탐색 마커 기본·강조·선택 (디자인 00) |
| `CourseMarker` | 일차 색 번호 마커 (1~4일차 색) |
| `RouteLine` | 도보 점선, 대중교통 실선, 택시 굵은 실선, 임시 직선 회색 점선 |
| `RadiusCircle` | 도보 15분 반경 |

- 표 행 hover ↔ 마커 강조는 선택 상태를 화면 단위 스토어로 공유한다.
- 키가 없거나 SDK 로딩에 실패하면 지도 영역에 안내를 보여주고 표·타임라인은 그대로 동작한다.

---

## 10. 디자인 시스템

- 기준 디자인: `어디 갈래 전체 화면 (명세 반영).html` (PRD 6장).
- 토큰은 `src/app/styles/tokens.css`에 CSS 변수로 두고 Tailwind 테마에 연결한다.

| 토큰 | 값 |
|---|---|
| 배경 / 잉크 / 보조 텍스트 / 선 | `#FFFFFF` / `#1E2420` / `#5B635D` / `#E3E6E8` |
| 하늘(채움) / 하늘(텍스트) / 선택 배경 / 필드 | `#1E9DEB` / `#0B7BC4` / `#EAF6FE` / `#F3F5F7` |
| 경고 / 오류 / 찜 / 완료 | `#A86B00` / `#B23A2E` / `#E2552D` / `#1B7A4B` |
| 일차 색 1~4 | `#E2552D` / `#2C6BD8` / `#2E9A5A` / `#8A4FD1` |
| 글꼴 | 본문 Pretendard, 숫자·날짜·시간 JetBrains Mono |
| 타입 스케일 | 페이지 제목 34, 패널 제목 22, 행 제목 15~16(600), 본문·메타 13~14, 표 머리 12(600) |

- 레이아웃: 디자인 폭 1440, 최소 1280. 헤더 높이 76, 왼쪽 패널 680px + 오른쪽 지도.
- 공통 컴포넌트(`shared/ui`): Button(주요·보조·연한 강조·비활성), Chip, StatusChip(진행중·예정·종료·D-day), SyncBadge, IoLabel(실내·실외), Tray(하단 플로팅), Modal, Toggle, Tabs, TableRow, SearchInput, StepHeader(단계형 화면).

---

## 11. 테스트

코드를 작성할 때 테스트를 함께 작성한다. 기능 PR은 테스트 없이 머지하지 않는다.

| 층 | 도구 | 대상 |
|---|---|---|
| 단위 | Vitest | `shared/lib`(KST 날짜·D-day·이번 주말·진행상태, 숫자 표시), 검증 스키마(PRD 8.1), 에러 정규화, `returnTo` 검증, 토큰 재발급 단일 실행, 비교 목록 스토어 |
| 컴포넌트 | Vitest + Testing Library + MSW | 화면 단위 동작: 필터·무한 스크롤, 찜 낙관적 업데이트·롤백, 로그인 필요 모달·이어서 실행, 추천 요청 단계 검증, 에러 코드별 안내 |
| E2E | Playwright (MSW 목업 모드) | 핵심 흐름: ① 비로그인 탐색 → 상세 → 찜 → 로그인 → 찜 저장 ② 추천 요청 5단계 → 생성 중 → 결과 ③ 회원가입 4단계 ④ 비교 담기 → 코스 추천 |

- MSW 핸들러는 API 명세의 요청·응답 예시를 그대로 따른다. 개발 서버(`VITE_API_MOCKING=true`)와 테스트가 같은 핸들러를 쓴다.
- 시간에 의존하는 테스트는 KST 기준 고정 시각을 주입한다.

---

## 12. 개발 환경

**명령어** (초기 설정 후 `package.json`에 정의)

| 명령 | 내용 |
|---|---|
| `pnpm dev` | 개발 서버 (Superset Run 버튼이 포트를 정해 실행) |
| `pnpm build` | 타입 검사 + 빌드 |
| `pnpm test` | 단위·컴포넌트 테스트 |
| `pnpm test:e2e` | Playwright |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |
| `pnpm typecheck` | `tsc --noEmit` |

**환경 변수** (`.env.example` 참고, 실제 값은 `.env.local`에 넣고 git에 올리지 않음)

| 변수 | 용도 | 넣는 사람 |
|---|---|---|
| `VITE_API_BASE_URL` | 백엔드 주소 | 사용자 |
| `VITE_API_MOCKING` | `true`면 MSW 목업 사용 | 기본 `true` |
| `VITE_KAKAO_MAP_APP_KEY` | 카카오맵 JavaScript 키 (도메인 등록 필요) | 사용자 |
| `VITE_GOOGLE_CLIENT_ID` | 구글 OAuth 클라이언트 ID | 사용자 |
| `VITE_GOOGLE_REDIRECT_URI` | 로그인 콜백 (`http://localhost:{port}/oauth/google/callback`) | 사용자 |
| `VITE_GOOGLE_CALENDAR_REDIRECT_URI` | 캘린더 연동 콜백 | 사용자 |

- Superset 작업공간은 포트가 작업공간마다 다르다(3100, 3110…). 구글 콘솔과 카카오 앱에는 실제로 쓸 포트의 주소를 등록해야 한다.

**코드 규칙**

- TypeScript `strict`, `any` 금지(불가피하면 이유를 주석으로).
- 컴포넌트는 함수 컴포넌트, `export default`는 화면(`pages`)에만 쓴다.
- 서버 데이터를 Zustand에 복사하지 않는다.
- 사용자에게 보이는 문구는 한국어, 숫자·날짜·시간은 `shared/lib`의 표시 함수를 거친다.

---

## 13. 미결 사항

| # | 내용 | 담당 |
|---|---|---|
| 1 | API 명세서를 기능 명세 변경에 맞춰 갱신: 여행·일정안·확정·저장, 온보딩 취향, 위치 정보 동의, 함께 가기 좋은 곳, 목록 좌표·빠른 필터·실내·실외·운영 정보·지도 범위 조회, 시·군·구 복수 선택, 실내 위주, 캘린더 목록·선택, 확정 일정안 업로드 | 백엔드 |
| 2 | 리프레시 토큰 httpOnly 쿠키 전환 (결정 A), 쿠키 경로·SameSite 값 | 백엔드 |
| 3 | 에러 응답 `code` 필드와 코드 목록 (결정 B) | 백엔드 |
| 4 | SSE 엔드포인트·이벤트 명세 (결정 C, 6.3 초안 참고) | 백엔드 |
| 5 | `AUTH_GOOGLE_LOGIN` 응답의 신규 가입 상태 처리(약관 동의를 거치는지) | 백엔드 |
| 6 | 카카오맵 JavaScript 키, 구글 OAuth 클라이언트 등록 | 사용자 |
