# Spica Skill Collector

마크다운 기반 스킬 수집 및 관리 풀스택 애플리케이션입니다.

## 📁 프로젝트 구조

```
skill_collector_251024/
├── FE/                 # 프론트엔드 (React + TypeScript + Vite)
├── BE/                 # 백엔드 (Python + FastAPI) - 예정
├── test/               # 테스트 코드
├── docs/               # 프로젝트 문서
├── README.md           # 프로젝트 개요 (이 파일)
└── AGENTS.md           # AI 에이전트 가이드
```

## 🚀 빠른 시작

### 프론트엔드

```bash
cd FE
npm install
npm run dev
```

프론트엔드 개발 서버는 `http://localhost:5173`에서 실행됩니다.

### 백엔드 (예정)

```bash
cd BE
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uvicorn main:app --reload
```

## 📋 주요 기능

- ✅ **CRUD 기능**: 스킬 데이터 생성, 조회, 수정, 삭제
- ✅ **마크다운 지원**: 모든 콘텐츠에 마크다운 문법 사용 가능
- ✅ **구조화된 데이터**: Overview, Prerequisites, Best Practices, Common Issues, Examples의 5개 섹션
- ✅ **검색 및 필터링**: 카테고리, 태그별 필터링
- ✅ **반응형 디자인**: 데스크톱 중심의 반응형 레이아웃
- 🔜 **백엔드 API**: Python FastAPI 기반 RESTful API
- 🔜 **데이터베이스**: PostgreSQL/SQLite를 통한 영구 저장
- 🔜 **인증/권한**: 사용자 인증 및 권한 관리

## 🛠 기술 스택

### 프론트엔드
- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS + Typography Plugin
- **라우팅**: React Router DOM
- **상태 관리**: Zustand (with persist middleware)
- **마크다운**: react-markdown
- **아이콘**: Lucide React

### 백엔드 (예정)
- **프레임워크**: FastAPI
- **ORM**: SQLAlchemy
- **데이터베이스**: PostgreSQL / SQLite
- **패키지 관리**: uv
- **마이그레이션**: Alembic

## 📚 문서

자세한 문서는 [`docs/`](./docs/) 디렉토리를 참조하세요:

- [프론트엔드 가이드](./docs/frontend.md)
- [백엔드 가이드](./docs/backend.md) - 예정
- [API 문서](./docs/api.md) - 예정
- [배포 가이드](./docs/deployment.md) - 예정

## 🤖 AI 에이전트 사용

이 프로젝트는 Claude Code를 사용하여 개발되었습니다. AI 에이전트를 활용한 개발 가이드는 [AGENTS.md](./AGENTS.md)를 참조하세요.

## 🧪 테스트

```bash
# 프론트엔드 테스트
cd FE
npm run test

# 백엔드 테스트 (예정)
cd BE
pytest
```

## 📝 개발 로드맵

### Phase 1 (완료 ✅)
- [x] 프론트엔드 기본 CRUD
- [x] 마크다운 에디터 및 렌더러
- [x] LocalStorage 기반 데이터 저장
- [x] 반응형 UI

### Phase 2 (진행 중 🚧)
- [ ] Python FastAPI 백엔드 구축
- [ ] RESTful API 설계 및 구현
- [ ] 데이터베이스 연동
- [ ] 프론트엔드-백엔드 통합

### Phase 3 (예정 📅)
- [ ] 사용자 인증 및 권한 관리
- [ ] 전체 텍스트 검색
- [ ] 데이터 내보내기/가져오기
- [ ] 마크다운 에디터 툴바
- [ ] 다크 모드 지원

### Phase 4 (예정 📅)
- [ ] 템플릿 시스템
- [ ] 버전 히스토리
- [ ] 협업 기능
- [ ] 프로덕션 배포

## 🤝 기여

이 프로젝트는 개인 프로젝트입니다. 제안이나 버그 리포트는 이슈를 통해 제출해주세요.

## 📄 라이선스

MIT License

---

**Last Updated**: 2025-10-24
**Created with**: Claude Code + React + TypeScript + FastAPI
