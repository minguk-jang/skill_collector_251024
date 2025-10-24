# Spica Skill Collector

마크다운 기반 스킬 수집 및 관리 웹 애플리케이션입니다.

## 기능

### ✨ 핵심 기능

- **CRUD 기능**: 스킬 데이터 생성, 조회, 수정, 삭제
- **마크다운 지원**: 모든 콘텐츠에 마크다운 문법 사용 가능
- **구조화된 데이터**: Overview, Prerequisites, Best Practices, Common Issues, Examples의 5개 섹션
- **검색 및 필터링**: 카테고리, 태그별 필터링
- **반응형 디자인**: 데스크톱 중심의 반응형 레이아웃

### 📋 데이터 구조

각 스킬 항목은 다음과 같이 구성됩니다:

- **메타데이터**: 제목, 카테고리, 태그, 생성일, 수정일
- **콘텐츠 섹션**:
  - Overview: 개요 및 요약
  - Prerequisites: 선행 요구사항
  - Best Practices: 모범 사례
  - Common Issues: 일반적인 문제 및 해결책
  - Examples: 실제 예제

## 기술 스택

- **프론트엔드**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS + Typography Plugin
- **라우팅**: React Router DOM
- **상태 관리**: Zustand (with persist middleware)
- **마크다운 렌더링**: react-markdown
- **아이콘**: Lucide React
- **데이터 저장**: LocalStorage

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

## 사용 방법

### 1. 새 스킬 생성

1. 상단 헤더의 "New Skill" 버튼 클릭
2. 제목, 카테고리, 태그 입력
3. 5개 섹션에 마크다운 형식으로 콘텐츠 작성
4. "Create" 버튼으로 저장

### 2. 스킬 조회

- **홈 페이지**: 모든 스킬을 카드 또는 리스트 형태로 조회
- **상세 페이지**: 개별 스킬의 전체 내용 확인
- **탭 네비게이션**: 섹션별로 빠르게 이동

### 3. 스킬 수정

- 상세 페이지에서 "Edit" 버튼 클릭
- 내용 수정 후 "Update" 버튼으로 저장

### 4. 스킬 삭제

- 상세 페이지: "Delete" 버튼으로 개별 삭제
- 홈 페이지: 체크박스로 선택 후 일괄 삭제

### 5. 필터링 및 정렬

- **사이드바**: 카테고리 및 태그로 필터링
- **정렬**: 수정일, 생성일, 제목순 정렬
- **뷰 모드**: 그리드/리스트 뷰 전환

## 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 컴포넌트
│   └── Layout.tsx   # 레이아웃 (헤더, 사이드바)
├── pages/           # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈 (목록 뷰)
│   ├── DetailPage.tsx  # 상세 페이지
│   └── FormPage.tsx    # 생성/편집 폼
├── store/           # 상태 관리
│   └── useSkillStore.ts # Zustand 스토어
├── types/           # TypeScript 타입 정의
│   └── index.ts
└── utils/           # 유틸리티 함수
```

## 데이터 저장

이 애플리케이션은 브라우저의 **LocalStorage**를 사용하여 데이터를 저장합니다.

- 데이터는 자동으로 로컬에 저장됩니다
- 브라우저 데이터를 삭제하면 모든 데이터가 사라집니다
- 백업이 필요한 경우 브라우저의 개발자 도구에서 LocalStorage를 내보낼 수 있습니다

## 향후 개발 계획

### Phase 2
- [ ] 전체 텍스트 검색
- [ ] 마크다운 에디터 툴바
- [ ] 다크 모드 지원

### Phase 3
- [ ] 데이터 내보내기/가져오기 (JSON, Markdown)
- [ ] 템플릿 시스템
- [ ] 버전 히스토리

## 라이선스

MIT
