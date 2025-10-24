# 프론트엔드 개발 가이드

Spica Skill Collector 프론트엔드 개발 가이드입니다.

## 목차

- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [컴포넌트 가이드](#컴포넌트-가이드)
- [상태 관리](#상태-관리)
- [스타일링](#스타일링)
- [빌드 및 배포](#빌드-및-배포)

## 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 프로젝트 루트에서
cd FE

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 개발 서버

개발 서버는 `http://localhost:5173`에서 실행됩니다.
- Hot Module Replacement (HMR) 지원
- 자동 새로고침

## 프로젝트 구조

```
FE/
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   └── Layout.tsx   # 전체 레이아웃 (헤더, 사이드바)
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── HomePage.tsx    # 홈 (목록 뷰)
│   │   ├── DetailPage.tsx  # 상세 페이지
│   │   └── FormPage.tsx    # 생성/편집 폼
│   ├── store/           # Zustand 상태 관리
│   │   └── useSkillStore.ts
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── utils/           # 유틸리티 함수
│   ├── App.tsx          # 루트 컴포넌트
│   ├── main.tsx         # 앱 진입점
│   └── index.css        # 글로벌 스타일
├── public/              # 정적 파일
├── index.html           # HTML 템플릿
├── vite.config.ts       # Vite 설정
├── tailwind.config.js   # Tailwind CSS 설정
├── tsconfig.json        # TypeScript 설정
└── package.json         # 프로젝트 메타데이터
```

## 주요 기능

### 1. 스킬 관리 (CRUD)

#### 생성 (Create)
- 경로: `/new`
- 컴포넌트: `FormPage.tsx`
- 기능: 제목, 카테고리, 태그, 5개 섹션 입력

#### 조회 (Read)
- **목록**: `/` (HomePage.tsx)
  - 그리드/리스트 뷰
  - 정렬 (최신순, 제목순)
  - 카테고리/태그 필터링

- **상세**: `/skill/:id` (DetailPage.tsx)
  - 마크다운 렌더링
  - 탭 네비게이션 (5개 섹션)

#### 수정 (Update)
- 경로: `/edit/:id`
- 컴포넌트: `FormPage.tsx`
- 기능: 기존 데이터 로드 및 수정

#### 삭제 (Delete)
- 개별 삭제: 상세 페이지에서 Delete 버튼
- 일괄 삭제: 목록 페이지에서 체크박스 선택 후 삭제

### 2. 마크다운 지원

- 라이브러리: `react-markdown`
- Typography 플러그인: `@tailwindcss/typography`
- 지원 기능:
  - 헤딩, 목록, 링크
  - 코드 블록 (인라인, 블록)
  - 이미지
  - 테이블

### 3. 검색 및 필터링

- **카테고리 필터**: 사이드바에서 선택
- **태그 필터**: 사이드바에서 선택
- **정렬**: 수정일, 생성일, 제목순
- **뷰 모드**: 그리드/리스트 토글

## 컴포넌트 가이드

### Layout.tsx

전체 애플리케이션의 레이아웃을 담당합니다.

```tsx
<Layout>
  ├── Header
  │   ├── Logo
  │   ├── Search
  │   └── New Skill Button
  ├── Sidebar
  │   ├── Home Link
  │   ├── Categories
  │   └── Tags
  └── Main Content (Outlet)
</Layout>
```

**주요 기능:**
- React Router의 `Outlet`을 사용한 중첩 라우팅
- 사이드바에서 카테고리 및 태그 표시
- 반응형 디자인 (데스크톱 중심)

### HomePage.tsx

스킬 목록을 표시하는 메인 페이지입니다.

**주요 기능:**
- 그리드/리스트 뷰 전환
- 정렬 및 필터링
- 다중 선택 삭제
- 카드 형태로 스킬 미리보기

**상태:**
```typescript
const [viewMode, setViewMode] = useState<ViewMode>('grid');
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('updatedAt');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
```

### DetailPage.tsx

개별 스킬의 상세 정보를 표시합니다.

**주요 기능:**
- 마크다운 렌더링
- 섹션별 탭 네비게이션
- 편집/삭제 버튼
- 삭제 확인 모달

**탭 구조:**
```typescript
const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'prerequisites', label: 'Prerequisites' },
  { key: 'bestPractices', label: 'Best Practices' },
  { key: 'commonIssues', label: 'Common Issues' },
  { key: 'examples', label: 'Examples' },
];
```

### FormPage.tsx

스킬 생성 및 편집을 위한 폼입니다.

**주요 기능:**
- 생성/편집 모드 자동 감지 (URL 파라미터)
- 실시간 검증
- 마크다운 입력 (textarea)
- 태그 입력 (쉼표로 구분)

**폼 필드:**
- 제목 (필수)
- 카테고리 (필수)
- 태그 (선택)
- Overview (필수)
- Prerequisites, Best Practices, Common Issues, Examples (선택)

## 상태 관리

### Zustand Store

파일: `src/store/useSkillStore.ts`

```typescript
interface SkillStore {
  items: SkillItem[];
  addItem: (item: Omit<SkillItem, 'id' | 'metadata'>) => void;
  updateItem: (id: string, item: Partial<SkillItem>) => void;
  deleteItem: (id: string) => void;
  deleteItems: (ids: string[]) => void;
  getItemById: (id: string) => SkillItem | undefined;
  getCategories: () => string[];
  getTags: () => string[];
}
```

**특징:**
- LocalStorage 영속성 (zustand/middleware의 `persist` 사용)
- 스토리지 키: `'skill-storage'`
- 자동 메타데이터 관리 (생성일, 수정일)

**사용 예시:**
```typescript
// 컴포넌트에서
const items = useSkillStore((state) => state.items);
const addItem = useSkillStore((state) => state.addItem);
const deleteItem = useSkillStore((state) => state.deleteItem);

// 아이템 추가
addItem({
  title: 'New Skill',
  category: 'Programming',
  tags: ['React', 'TypeScript'],
  content: { ... }
});
```

## 스타일링

### Tailwind CSS

#### 설정
- 파일: `tailwind.config.js`
- 플러그인: `@tailwindcss/typography`

#### 주요 클래스
```css
/* 레이아웃 */
.min-h-screen
.flex
.grid
.grid-cols-{n}

/* 간격 */
.space-x-{n}
.space-y-{n}
.p-{n}
.m-{n}

/* 색상 */
.bg-gray-50
.text-gray-900
.border-gray-200

/* 반응형 */
sm:px-6
md:grid-cols-2
lg:px-8
```

#### 마크다운 스타일링
```tsx
<div className="prose prose-lg max-w-none
                prose-headings:text-gray-900
                prose-p:text-gray-700
                prose-a:text-blue-600
                prose-code:bg-gray-100">
  <ReactMarkdown>{content}</ReactMarkdown>
</div>
```

### 커스텀 스타일

파일: `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 추가 커스텀 스타일 */
body {
  margin: 0;
  font-family: system-ui, -apple-system, ...;
}
```

## 라우팅

### React Router DOM

파일: `src/App.tsx`

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="skill/:id" element={<DetailPage />} />
      <Route path="new" element={<FormPage />} />
      <Route path="edit/:id" element={<FormPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### 라우트 구조
- `/` - 홈 (목록)
- `/skill/:id` - 스킬 상세
- `/new` - 새 스킬 생성
- `/edit/:id` - 스킬 편집

### 네비게이션

```tsx
// Link 사용
<Link to="/new">New Skill</Link>
<Link to={`/skill/${item.id}`}>View</Link>

// 프로그래매틱 네비게이션
const navigate = useNavigate();
navigate('/');
navigate(`/skill/${id}`);
```

## TypeScript 타입

파일: `src/types/index.ts`

### 주요 타입

```typescript
// 스킬 아이템
export interface SkillItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
  content: {
    overview: string;
    prerequisites: string;
    bestPractices: string;
    commonIssues: string;
    examples: string;
  };
}

// 필터 옵션
export interface FilterOptions {
  searchQuery: string;
  selectedCategory: string;
  selectedTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

// 뷰 모드
export type ViewMode = 'grid' | 'list';
```

## 빌드 및 배포

### 프로덕션 빌드

```bash
cd FE
npm run build
```

빌드 결과: `FE/dist/` 디렉토리

### 빌드 미리보기

```bash
npm run preview
```

### 정적 호스팅 배포

#### Vercel
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd FE
vercel
```

#### Netlify
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 배포
cd FE
netlify deploy --prod
```

### 환경 변수

`.env` 파일 생성:
```env
VITE_API_URL=http://localhost:8000/api
```

사용:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 개발 팁

### 1. 핫 리로딩
- Vite의 HMR이 자동으로 작동
- 파일 저장 시 즉시 반영

### 2. 타입 체크
```bash
npm run build  # TypeScript 컴파일 포함
```

### 3. ESLint
```bash
npm run lint
```

### 4. 디버깅
- React Developer Tools 사용
- Zustand DevTools (선택사항)

### 5. 성능 최적화
- React.memo() 사용
- useMemo, useCallback 활용
- 큰 리스트는 가상화 고려 (react-window)

## 트러블슈팅

### 빌드 에러

1. **node_modules 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **캐시 클리어**
   ```bash
   rm -rf .vite
   npm run dev
   ```

### Tailwind CSS 미적용

1. `tailwind.config.js`의 `content` 경로 확인
2. `index.css`에 Tailwind directives 확인
3. 개발 서버 재시작

### TypeScript 에러

- `tsconfig.json` 설정 확인
- 타입 정의 파일 확인 (`*.d.ts`)
- `npm run build`로 전체 타입 체크

---

**Last Updated**: 2025-10-24
