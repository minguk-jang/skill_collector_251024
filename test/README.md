# 테스트 가이드

Spica Skill Collector의 테스트 코드 저장소입니다.

## 디렉토리 구조

```
test/
├── frontend/        # 프론트엔드 테스트
│   ├── unit/       # 단위 테스트
│   ├── integration/ # 통합 테스트
│   └── e2e/        # E2E 테스트
├── backend/         # 백엔드 테스트 (예정)
│   ├── unit/       # 단위 테스트
│   └── integration/ # 통합 테스트
└── README.md        # 이 파일
```

## 프론트엔드 테스트

### 테스트 프레임워크

- **단위 테스트**: Vitest
- **컴포넌트 테스트**: React Testing Library
- **E2E 테스트**: Playwright (예정)

### 설치

```bash
cd FE
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 실행

```bash
# 단위 테스트
npm run test

# watch 모드
npm run test:watch

# 커버리지
npm run test:coverage
```

### 테스트 작성 예시

#### 컴포넌트 테스트

```typescript
// test/frontend/unit/Layout.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Layout from '../../../FE/src/components/Layout';

describe('Layout', () => {
  it('renders header with logo', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    expect(screen.getByText('Spica Skill Collector')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('New Skill')).toBeInTheDocument();
  });
});
```

#### 스토어 테스트

```typescript
// test/frontend/unit/useSkillStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useSkillStore } from '../../../FE/src/store/useSkillStore';

describe('useSkillStore', () => {
  beforeEach(() => {
    // 스토어 초기화
    useSkillStore.setState({ items: [] });
  });

  it('adds a new skill', () => {
    const { addItem, items } = useSkillStore.getState();

    addItem({
      title: 'Test Skill',
      category: 'Testing',
      tags: ['test'],
      content: {
        overview: 'Test',
        prerequisites: '',
        bestPractices: '',
        commonIssues: '',
        examples: ''
      }
    });

    const state = useSkillStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe('Test Skill');
  });

  it('deletes a skill', () => {
    const { addItem, deleteItem } = useSkillStore.getState();

    // 아이템 추가
    addItem({
      title: 'Test Skill',
      category: 'Testing',
      tags: [],
      content: {
        overview: '',
        prerequisites: '',
        bestPractices: '',
        commonIssues: '',
        examples: ''
      }
    });

    const state1 = useSkillStore.getState();
    const itemId = state1.items[0].id;

    // 아이템 삭제
    deleteItem(itemId);

    const state2 = useSkillStore.getState();
    expect(state2.items).toHaveLength(0);
  });
});
```

### E2E 테스트 (예정)

```typescript
// test/frontend/e2e/skill-crud.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Skill CRUD Operations', () => {
  test('creates, views, edits, and deletes a skill', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 생성
    await page.click('text=New Skill');
    await page.fill('[name="title"]', 'E2E Test Skill');
    await page.fill('[name="category"]', 'Testing');
    await page.fill('[name="overview"]', 'This is a test');
    await page.click('button:has-text("Create")');

    // 조회
    await expect(page.locator('text=E2E Test Skill')).toBeVisible();

    // 편집
    await page.click('text=E2E Test Skill');
    await page.click('button:has-text("Edit")');
    await page.fill('[name="title"]', 'Updated E2E Test');
    await page.click('button:has-text("Update")');
    await expect(page.locator('text=Updated E2E Test')).toBeVisible();

    // 삭제
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Delete")'); // 확인 모달
    await expect(page.locator('text=Updated E2E Test')).not.toBeVisible();
  });
});
```

## 백엔드 테스트 (예정)

### 테스트 프레임워크

- **pytest**: Python 테스트 프레임워크
- **httpx**: API 테스트 클라이언트

### 설치

```bash
cd BE
uv pip install pytest pytest-asyncio httpx
```

### 실행

```bash
# 모든 테스트
pytest

# 특정 파일
pytest tests/test_skills.py

# 커버리지
pytest --cov=app
```

### 테스트 작성 예시

```python
# test/backend/unit/test_skills.py
import pytest
from fastapi.testclient import TestClient

def test_create_skill(client: TestClient):
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
    data = response.json()
    assert data["title"] == "Test Skill"
    assert "id" in data

def test_get_skills(client: TestClient):
    response = client.get("/api/skills")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data

def test_update_skill(client: TestClient):
    # 먼저 스킬 생성
    create_response = client.post("/api/skills", json={...})
    skill_id = create_response.json()["id"]

    # 수정
    update_response = client.put(
        f"/api/skills/{skill_id}",
        json={"title": "Updated Title"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Title"

def test_delete_skill(client: TestClient):
    # 먼저 스킬 생성
    create_response = client.post("/api/skills", json={...})
    skill_id = create_response.json()["id"]

    # 삭제
    delete_response = client.delete(f"/api/skills/{skill_id}")
    assert delete_response.status_code == 204

    # 삭제 확인
    get_response = client.get(f"/api/skills/{skill_id}")
    assert get_response.status_code == 404
```

## 테스트 커버리지 목표

- **프론트엔드**: 80% 이상
- **백엔드**: 90% 이상

## CI/CD 통합

### GitHub Actions 예시

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd FE && npm install
      - run: cd FE && npm run test

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install uv
      - run: cd BE && uv pip install -r requirements.txt
      - run: cd BE && pytest
```

## 베스트 프랙티스

1. **테스트 격리**: 각 테스트는 독립적으로 실행 가능해야 함
2. **명확한 이름**: 테스트 함수명으로 무엇을 테스트하는지 알 수 있어야 함
3. **Arrange-Act-Assert**: 준비-실행-검증 패턴 사용
4. **모의 객체**: 외부 의존성은 모의 객체 사용
5. **엣지 케이스**: 정상 케이스뿐만 아니라 에러 케이스도 테스트

---

**Last Updated**: 2025-10-24
