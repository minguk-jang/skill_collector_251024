# AI 에이전트 개발 가이드

이 문서는 Spica Skill Collector 프로젝트를 AI 에이전트(Claude Code 등)와 함께 개발할 때 유용한 가이드입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [개발 워크플로우](#개발-워크플로우)
- [에이전트 프롬프트 예시](#에이전트-프롬프트-예시)
- [주의사항](#주의사항)
- [트러블슈팅](#트러블슈팅)

## 프로젝트 개요

### 기술 스택
- **프론트엔드**: React 18 + TypeScript + Vite + Tailwind CSS
- **백엔드**: Python + FastAPI (예정)
- **상태 관리**: Zustand
- **데이터**: LocalStorage (현재) → Database (예정)

### 디렉토리 구조
```
skill_collector_251024/
├── FE/          # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── components/   # React 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── store/        # Zustand 스토어
│   │   ├── types/        # TypeScript 타입 정의
│   │   └── utils/        # 유틸리티 함수
│   └── ...
├── BE/          # 백엔드 API (예정)
├── test/        # 테스트 코드
└── docs/        # 프로젝트 문서
```

## 개발 워크플로우

### 1. 새로운 기능 추가

#### 프론트엔드 기능

```markdown
**프롬프트 예시:**
"프론트엔드에 [기능명]을 추가해줘.
- FE/src/[적절한 경로]에 구현
- TypeScript 타입 안전성 유지
- Tailwind CSS로 스타일링
- 기존 디자인 시스템 따르기"
```

**체크리스트:**
- [ ] 타입 정의 (`FE/src/types/`)
- [ ] 컴포넌트 구현 (`FE/src/components/` or `FE/src/pages/`)
- [ ] 스토어 업데이트 (필요시)
- [ ] 라우팅 추가 (필요시)
- [ ] 빌드 테스트 (`cd FE && npm run build`)

#### 백엔드 기능 (예정)

```markdown
**프롬프트 예시:**
"백엔드에 [기능명] API를 추가해줘.
- BE/app/routers/에 라우터 생성
- SQLAlchemy 모델 정의
- Pydantic 스키마 작성
- FastAPI 문서 자동 생성 확인"
```

### 2. 버그 수정

```markdown
**프롬프트 예시:**
"[파일명]의 [함수/컴포넌트명]에서 [버그 설명] 버그가 있어.
[예상 동작]이 되어야 하는데 [실제 동작]이 발생해."
```

### 3. 리팩토링

```markdown
**프롬프트 예시:**
"FE/src/[경로]를 리팩토링해줘.
- 목표: [리팩토링 목표]
- 기존 기능은 유지
- 타입 안전성 개선
- 코드 가독성 향상"
```

### 4. 문서 작성

```markdown
**프롬프트 예시:**
"[기능/API]에 대한 문서를 docs/[파일명].md에 작성해줘.
- 사용 방법
- 예제 코드
- 주의사항"
```

## 에이전트 프롬프트 예시

### 프론트엔드 개발

#### 새 페이지 추가
```
FE에 사용자 프로필 페이지를 추가해줘.
- 경로: /profile
- 기능: 사용자 정보 표시 및 수정
- FE/src/pages/ProfilePage.tsx 생성
- 라우팅 추가
- 기존 디자인 시스템 사용
```

#### 컴포넌트 생성
```
FE에 재사용 가능한 마크다운 에디터 컴포넌트를 만들어줘.
- FE/src/components/MarkdownEditor.tsx
- props: value, onChange, placeholder
- 실시간 미리보기 옵션
- Tailwind CSS 스타일링
```

#### 상태 관리
```
Zustand 스토어에 사용자 설정 관리 기능을 추가해줘.
- FE/src/store/useSettingsStore.ts
- 테마, 언어, 폰트 크기 설정
- LocalStorage 영속성
```

### 백엔드 개발 (예정)

#### API 엔드포인트 추가
```
BE에 스킬 검색 API를 추가해줘.
- GET /api/skills/search?q={query}
- 전체 텍스트 검색
- 페이지네이션 지원
- FastAPI 라우터 생성
```

#### 데이터베이스 모델
```
BE에 User 모델을 추가해줘.
- SQLAlchemy 모델
- 필드: id, username, email, created_at
- Alembic 마이그레이션 생성
```

### 테스트

#### 프론트엔드 테스트
```
FE/src/components/Layout.tsx에 대한 단위 테스트를 작성해줘.
- Vitest 사용
- 렌더링 테스트
- 사용자 상호작용 테스트
- test/frontend/Layout.test.tsx
```

#### 통합 테스트
```
스킬 생성부터 조회까지의 E2E 테스트를 작성해줘.
- Playwright 또는 Cypress 사용
- test/e2e/skill-crud.spec.ts
```

## 주의사항

### 프론트엔드

1. **타입 안전성**
   - 모든 컴포넌트와 함수에 명확한 타입 정의
   - `any` 타입 사용 지양
   - 타입 import 시 `import type` 사용

2. **코드 스타일**
   - ESLint 규칙 준수
   - Prettier 포맷팅
   - 컴포넌트는 PascalCase
   - 파일명은 컴포넌트명과 일치

3. **성능**
   - 불필요한 리렌더링 방지
   - useMemo, useCallback 적절히 사용
   - 큰 리스트는 가상화 고려

4. **접근성**
   - 시맨틱 HTML 사용
   - ARIA 레이블 추가
   - 키보드 네비게이션 지원

### 백엔드 (예정)

1. **보안**
   - 입력 검증 철저히
   - SQL 인젝션 방지
   - 민감 정보는 환경 변수로

2. **에러 핸들링**
   - 명확한 에러 메시지
   - HTTP 상태 코드 적절히 사용
   - 로깅

3. **API 설계**
   - RESTful 원칙 준수
   - 일관된 응답 형식
   - 버저닝 고려

## 트러블슈팅

### 자주 발생하는 문제

#### 1. vite: not found
```bash
cd FE
rm -rf node_modules package-lock.json
npm install
```

#### 2. Tailwind CSS 스타일이 적용되지 않음
- `FE/tailwind.config.js`의 `content` 경로 확인
- `FE/src/index.css`에 Tailwind directives 확인
- 개발 서버 재시작

#### 3. TypeScript 타입 에러
```bash
cd FE
npm run build  # 타입 체크
```

#### 4. Zustand persist 오류
- LocalStorage 데이터 초기화
- 브라우저 개발자 도구 > Application > Local Storage

### 에이전트에게 문제 해결 요청하기

```markdown
**효과적인 문제 보고:**
1. 발생한 에러 메시지 전체 복사
2. 재현 단계 설명
3. 예상 동작 vs 실제 동작
4. 관련 파일 경로

**예시:**
"FE/src/pages/FormPage.tsx에서 스킬 저장 시 다음 에러가 발생해:
[에러 메시지]

재현 방법:
1. New Skill 버튼 클릭
2. 모든 필드 입력
3. Create 버튼 클릭

예상: 스킬이 생성되고 홈으로 리다이렉트
실제: 에러 발생 및 아무 동작 없음"
```

## 개발 팁

### 1. 점진적 개발
- 큰 기능은 작은 단위로 나누기
- 각 단계마다 테스트
- 커밋을 작게, 자주

### 2. 에이전트 활용
- 명확하고 구체적인 지시
- 예제 코드 제공 시 더 정확한 결과
- 컨텍스트 충분히 설명

### 3. 코드 리뷰
- 에이전트가 생성한 코드도 리뷰
- 이해하지 못하는 코드는 설명 요청
- 보안, 성능 측면 체크

### 4. 문서화
- 새 기능 추가 시 문서 업데이트 요청
- 주석으로 복잡한 로직 설명
- README, AGENTS.md 최신 유지

## 버전 관리

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 등
```

### 브랜치 전략
```
main: 프로덕션 브랜치
develop: 개발 브랜치
feature/*: 기능 개발
fix/*: 버그 수정
```

## 추가 리소스

- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [FastAPI 문서](https://fastapi.tiangolo.com/)
- [Claude Code 문서](https://docs.claude.com/claude-code)

---

**Last Updated**: 2025-10-24
**Maintained By**: Claude Code + Human Developer
