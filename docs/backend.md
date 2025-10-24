# 백엔드 개발 가이드 (예정)

Spica Skill Collector 백엔드 개발 가이드입니다.

> 🚧 **개발 예정**: 백엔드는 아직 구현되지 않았습니다. 이 문서는 향후 개발을 위한 계획서입니다.

## 목차

- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [API 설계](#api-설계)
- [데이터베이스](#데이터베이스)
- [인증 및 권한](#인증-및-권한)
- [테스트](#테스트)
- [배포](#배포)

## 개발 환경 설정

### 필수 요구사항

- Python 3.11 이상
- uv (Python 패키지 관리자)
- PostgreSQL 또는 SQLite

### 설치 및 실행

```bash
# 프로젝트 루트에서
cd BE

# uv로 가상환경 생성
uv venv

# 가상환경 활성화
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate    # Windows

# 의존성 설치
uv pip install -r requirements.txt

# 개발 서버 실행
uvicorn main:app --reload

# 마이그레이션 실행
alembic upgrade head
```

## 프로젝트 구조 (계획)

```
BE/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI 앱 진입점
│   ├── config.py         # 설정
│   ├── database.py       # DB 연결
│   ├── models/           # SQLAlchemy 모델
│   │   ├── __init__.py
│   │   ├── skill.py
│   │   └── user.py
│   ├── schemas/          # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── skill.py
│   │   └── user.py
│   ├── routers/          # API 라우터
│   │   ├── __init__.py
│   │   ├── skills.py
│   │   └── users.py
│   ├── dependencies.py   # 의존성
│   └── utils/            # 유틸리티
├── migrations/           # Alembic 마이그레이션
├── tests/                # 테스트
├── requirements.txt      # 의존성 목록
└── .env                  # 환경 변수 (gitignore)
```

## 기술 스택

- **프레임워크**: FastAPI
- **ORM**: SQLAlchemy 2.0
- **DB**: PostgreSQL (프로덕션) / SQLite (개발)
- **마이그레이션**: Alembic
- **인증**: JWT (python-jose)
- **검증**: Pydantic v2
- **테스트**: pytest
- **패키지 관리**: uv

## API 설계

### RESTful API 엔드포인트

#### Skills

```
GET    /api/skills              # 스킬 목록 조회
POST   /api/skills              # 스킬 생성
GET    /api/skills/:id          # 스킬 상세 조회
PUT    /api/skills/:id          # 스킬 수정
DELETE /api/skills/:id          # 스킬 삭제
GET    /api/skills/search       # 스킬 검색
```

#### Categories & Tags

```
GET    /api/categories          # 카테고리 목록
GET    /api/tags                # 태그 목록
```

#### Users (인증 구현 시)

```
POST   /api/auth/register       # 회원가입
POST   /api/auth/login          # 로그인
POST   /api/auth/refresh        # 토큰 갱신
GET    /api/users/me            # 현재 사용자 정보
```

### 요청/응답 형식

#### 스킬 조회 (GET /api/skills)

**Query Parameters:**
```
?page=1
&per_page=20
&category=Programming
&tags=React,TypeScript
&sort_by=updated_at
&sort_order=desc
&search=query
```

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "React Hooks",
      "category": "Programming",
      "tags": ["React", "JavaScript"],
      "metadata": {
        "created_at": "2025-10-24T00:00:00Z",
        "updated_at": "2025-10-24T00:00:00Z",
        "author": "user_id"
      },
      "content": {
        "overview": "...",
        "prerequisites": "...",
        "best_practices": "...",
        "common_issues": "...",
        "examples": "..."
      }
    }
  ],
  "total": 100,
  "page": 1,
  "per_page": 20,
  "pages": 5
}
```

#### 스킬 생성 (POST /api/skills)

**Request:**
```json
{
  "title": "React Hooks",
  "category": "Programming",
  "tags": ["React", "JavaScript"],
  "content": {
    "overview": "...",
    "prerequisites": "...",
    "best_practices": "...",
    "common_issues": "...",
    "examples": "..."
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "React Hooks",
  ...
}
```

### 에러 응답

```json
{
  "detail": "Error message",
  "status_code": 404
}
```

## 데이터베이스

### 스키마 설계

#### Skills 테이블

```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    overview TEXT,
    prerequisites TEXT,
    best_practices TEXT,
    common_issues TEXT,
    examples TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id)
);
```

#### Skill_Tags 테이블 (Many-to-Many)

```sql
CREATE TABLE skill_tags (
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, tag_id)
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);
```

#### Users 테이블

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SQLAlchemy 모델 예시

```python
# app/models/skill.py
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from ..database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    overview = Column(Text)
    prerequisites = Column(Text)
    best_practices = Column(Text)
    common_issues = Column(Text)
    examples = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))

    # Relationships
    user = relationship("User", back_populates="skills")
    tags = relationship("Tag", secondary="skill_tags", back_populates="skills")
```

## Pydantic 스키마

```python
# app/schemas/skill.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class SkillContent(BaseModel):
    overview: str
    prerequisites: str
    best_practices: str
    common_issues: str
    examples: str

class SkillBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    tags: List[str] = []
    content: SkillContent

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    title: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    content: Optional[SkillContent] = None

class SkillResponse(SkillBase):
    id: UUID
    metadata: dict

    class Config:
        from_attributes = True
```

## 인증 및 권한

### JWT 기반 인증

```python
# app/utils/auth.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)
```

### 의존성 주입

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
```

## 테스트

### pytest 설정

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    yield TestClient(app)

    Base.metadata.drop_all(bind=engine)
```

### 테스트 예시

```python
# tests/test_skills.py
def test_create_skill(client):
    response = client.post(
        "/api/skills",
        json={
            "title": "Test Skill",
            "category": "Testing",
            "tags": ["test"],
            "content": {
                "overview": "Test overview",
                "prerequisites": "",
                "best_practices": "",
                "common_issues": "",
                "examples": ""
            }
        }
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Skill"

def test_get_skills(client):
    response = client.get("/api/skills")
    assert response.status_code == 200
    assert "items" in response.json()
```

## 배포

### Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN pip install uv

COPY requirements.txt .
RUN uv pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./BE
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/skillcollector
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: skillcollector
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 환경 변수

`.env` 파일:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/skillcollector
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 다음 단계

1. FastAPI 프로젝트 초기 설정
2. 데이터베이스 모델 및 마이그레이션 생성
3. CRUD API 구현
4. 프론트엔드 연동
5. 인증 시스템 구현
6. 전체 텍스트 검색 추가
7. 테스트 작성
8. 배포

---

**Last Updated**: 2025-10-24
**Status**: 📋 Planning
