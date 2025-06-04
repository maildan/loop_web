# 🛠️ 개발 환경 설정 가이드

## 목차
- [개발 환경 요구사항](#개발-환경-요구사항)
- [초기 설정](#초기-설정)
- [IDE 설정](#ide-설정)
- [개발 도구](#개발-도구)
- [디버깅](#디버깅)
- [테스팅](#테스팅)
- [코드 품질](#코드-품질)
- [팁과 트릭](#팁과-트릭)

## 개발 환경 요구사항

### 필수 소프트웨어
- **Node.js**: 18.0 이상 (LTS 권장)
- **Yarn**: 1.22 이상 (패키지 관리)
- **Git**: 최신 버전
- **VS Code**: 최신 버전 (권장 IDE)

### 권장 소프트웨어
- **Chrome/Firefox**: 최신 개발자 도구
- **Postman**: API 테스팅
- **Docker**: 컨테이너 개발 (선택사항)

### 시스템 요구사항
- **RAM**: 최소 8GB, 권장 16GB 이상
- **Storage**: 최소 5GB 여유 공간
- **OS**: macOS, Windows 10/11, Ubuntu 20.04 이상

## 초기 설정

### 1. Node.js 설치

#### macOS (Homebrew 사용)
```bash
# Homebrew 설치 (없는 경우)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node@18

# 버전 확인
node --version
npm --version
```

#### macOS/Linux (NVM 사용 - 권장)
```bash
# NVM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 후
nvm install 18
nvm use 18
nvm alias default 18

# 버전 확인
node --version
```

#### Windows
```bash
# Chocolatey 사용
choco install nodejs.install

# 또는 공식 사이트에서 다운로드
# https://nodejs.org/en/download/

# PowerShell에서 버전 확인
node --version
npm --version
```

### 2. Yarn 설치
```bash
# npm을 통한 Yarn 설치
npm install -g yarn

# 버전 확인
yarn --version

# 또는 Homebrew 사용 (macOS)
brew install yarn
```

### 3. 프로젝트 설정
```bash
# 프로젝트 클론
git clone <repository-url>
cd loop_3_web

# 의존성 설치
yarn install

# 개발 서버 실행
yarn start
```

## IDE 설정

### VS Code 권장 확장 프로그램

#### 필수 확장 프로그램
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

설치 방법:
```bash
# VS Code 확장 프로그램 설치 (명령 팔레트에서)
ext install bradlc.vscode-tailwindcss
ext install esbenp.prettier-vscode
ext install dbaeumer.vscode-eslint
ext install ms-vscode.vscode-typescript-next
ext install formulahendry.auto-rename-tag
ext install christian-kohler.path-intellisense
```

#### 선택 확장 프로그램
```bash
# Git 관련
ext install eamodio.gitlens
ext install mhutchie.git-graph

# React 개발
ext install dsznajder.es7-react-js-snippets
ext install burkeholland.simple-react-snippets

# 마크다운
ext install yzhang.markdown-all-in-one
ext install shd101wyy.markdown-preview-enhanced

# 테마 및 아이콘
ext install PKief.material-icon-theme
ext install GitHub.github-vscode-theme
```

### VS Code 설정 파일

#### .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

#### .vscode/launch.json (디버깅)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3001",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "name": "Debug Node.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### .vscode/tasks.json
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "yarn start",
      "group": "build",
      "isBackground": true,
      "problemMatcher": {
        "owner": "typescript",
        "source": "ts",
        "fileLocation": [
          "relative",
          "${cwd}"
        ],
        "pattern": "$tsc",
        "background": {
          "activeOnStart": true,
          "beginsPattern": "webpack: Compiling...",
          "endsPattern": "webpack: Compiled successfully."
        }
      }
    },
    {
      "label": "Build Production",
      "type": "shell",
      "command": "yarn build",
      "group": "build"
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "yarn test",
      "group": "test"
    }
  ]
}
```

## 개발 도구

### 1. 환경 변수 관리

#### 개발 환경 설정 (.env.development)
```bash
# 현재 설정 확인
cat .env.development

# 필요한 경우 환경 변수 추가
echo "REACT_APP_DEBUG=true" >> .env.development
echo "REACT_APP_LOG_LEVEL=debug" >> .env.development
```

#### 로컬 환경 설정 (.env.local)
```bash
# 개인 설정용 파일 생성 (Git 무시됨)
cat > .env.local << EOF
# 개인 개발 설정
REACT_APP_DEVELOPER_MODE=true
REACT_APP_API_MOCK=true
BROWSER=chrome
EOF
```

### 2. 개발 스크립트

#### package.json 스크립트 활용
```bash
# 개발 서버 시작
yarn start

# 개발 모드로 명시적 시작
yarn start:dev

# 빌드 (개발용)
yarn build:dev

# 코드 분석
yarn build:analyze

# 테스트 실행
yarn test

# 테스트 커버리지
yarn test --coverage
```

#### 커스텀 개발 스크립트
```bash
# 개발용 빌드 스크립트 생성
cat > scripts/dev-build.sh << 'EOF'
#!/bin/bash
echo "🔨 개발용 빌드 시작..."
NODE_ENV=development yarn build
echo "✅ 빌드 완료!"
echo "📊 빌드 크기:"
du -sh build/*
EOF

chmod +x scripts/dev-build.sh
```

### 3. 핫 리로드 최적화

#### CRACO 설정 확인
```javascript
// craco.config.js에서 개발 환경 최적화 확인
module.exports = {
  // ... 기존 설정 ...
  devServer: {
    compress: true,
    hot: true,
    host: 'localhost',  // 개발 환경에서는 localhost 사용
    port: 3001,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};
```

## 디버깅

### 1. 브라우저 디버깅

#### Chrome DevTools
```bash
# React DevTools 확장 프로그램 설치
# https://chrome.google.com/webstore/detail/react-developer-tools/

# Redux DevTools (필요한 경우)
# https://chrome.google.com/webstore/detail/redux-devtools/
```

#### 소스맵 활용
```typescript
// 개발 환경에서 소스맵이 활성화되어 있는지 확인
// .env.development에서 GENERATE_SOURCEMAP=true 설정됨

// 컴포넌트에서 디버깅
const Component = () => {
  console.log('Component rendered');
  debugger; // 브라우저에서 일시정지
  
  return <div>Component</div>;
};
```

### 2. VS Code 디버깅

#### React 애플리케이션 디버깅
```bash
# 1. VS Code에서 F5 또는 디버그 패널에서 "Launch Chrome" 선택
# 2. 중단점 설정
# 3. 브라우저에서 해당 코드 실행
```

#### Node.js 서버 디버깅
```bash
# 서버 디버그 모드로 시작
node --inspect server.js

# VS Code에서 "Debug Node.js" 구성 사용
```

### 3. 로그 시스템

#### 개발용 로깅
```typescript
// src/utils/logger.ts 생성
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (message: string, data?: any) => {
    if (isDev) {
      console.log(`🐛 [DEBUG] ${message}`, data);
    }
  },
  info: (message: string, data?: any) => {
    if (isDev) {
      console.info(`ℹ️ [INFO] ${message}`, data);
    }
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [WARN] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`❌ [ERROR] ${message}`, error);
  }
};

// 사용 예시
import { logger } from '../utils/logger';

const MyComponent = () => {
  logger.debug('Component mounting');
  
  useEffect(() => {
    logger.info('Effect running');
  }, []);
  
  return <div>Component</div>;
};
```

## 테스팅

### 1. 단위 테스트

#### Jest 설정 확인
```bash
# 테스트 실행
yarn test

# 워치 모드
yarn test --watch

# 커버리지 확인
yarn test --coverage
```

#### 테스트 작성 예시
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. 통합 테스트

#### React Testing Library
```typescript
// src/components/__tests__/CloudDashboard.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { CloudDashboard } from '../cloud/CloudDashboard';
import { ThemeProvider } from '../ui/ThemeProvider';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('CloudDashboard Integration', () => {
  test('renders dashboard with all sections', async () => {
    renderWithProviders(<CloudDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('문서 관리')).toBeInTheDocument();
      expect(screen.getByText('통계')).toBeInTheDocument();
    });
  });
});
```

### 3. E2E 테스트 (선택사항)

#### Playwright 설정
```bash
# Playwright 설치
yarn add -D @playwright/test

# 설정 파일 생성
npx playwright install
```

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard loads and displays content', async ({ page }) => {
  await page.goto('http://localhost:3001/cloud');
  
  await expect(page.locator('h1')).toContainText('대시보드');
  await expect(page.locator('[data-testid="document-list"]')).toBeVisible();
});
```

## 코드 품질

### 1. ESLint 설정

#### .eslintrc.js 확인 및 수정
```javascript
module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // 개발 중 유용한 규칙들
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'error',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn'
  }
};
```

#### ESLint 실행
```bash
# 린트 검사
yarn lint

# 자동 수정
yarn lint --fix

# 특정 파일만 검사
npx eslint src/components/cloud/CloudDashboard.tsx
```

### 2. Prettier 설정

#### .prettierrc 설정
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

#### Prettier 실행
```bash
# 코드 포매팅
yarn prettier --write src/

# 특정 파일 포매팅
yarn prettier --write src/components/cloud/CloudDashboard.tsx
```

### 3. 타입 체크

#### TypeScript 설정 확인
```bash
# 타입 체크
yarn tsc --noEmit

# 타입 체크 (워치 모드)
yarn tsc --noEmit --watch
```

## 팁과 트릭

### 1. 개발 생산성 향상

#### VS Code 스니펫 설정
```json
// .vscode/snippets.code-snippets
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:ComponentName}Props {",
      "  $2",
      "}",
      "",
      "export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({$3}) => {",
      "  return (",
      "    <div>",
      "      $4",
      "    </div>",
      "  );",
      "};"
    ],
    "description": "Create a React functional component with TypeScript"
  }
}
```

#### Git 훅 설정
```bash
# Husky 설치 (이미 설치된 경우 건너뛰기)
yarn add -D husky lint-staged

# Pre-commit 훅 설정
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn lint-staged
EOF

# package.json에 lint-staged 설정 추가
```

### 2. 성능 개발 도구

#### React DevTools Profiler
```bash
# 프로파일링을 위한 환경 변수 (이미 설정됨)
# REACT_APP_ENABLE_PROFILER=true (.env.development에 있음)

# 컴포넌트에서 프로파일링
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Profiler:', { id, phase, actualDuration });
};

<Profiler id="CloudDashboard" onRender={onRenderCallback}>
  <CloudDashboard />
</Profiler>
```

#### Bundle Analyzer
```bash
# 번들 분석 (이미 설정됨)
yarn build:analyze

# 분석 결과 확인
# 브라우저에서 자동으로 열림
```

### 3. 디버깅 유틸리티

#### React Error Boundary
```typescript
// src/components/utils/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>문제가 발생했습니다.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// 사용법
<ErrorBoundary>
  <CloudDashboard />
</ErrorBoundary>
```

### 4. 유용한 개발 명령어

```bash
# 패키지 정보 확인
yarn info react
yarn list --depth=0

# 캐시 정리
yarn cache clean

# 의존성 업데이트 확인
yarn outdated

# 보안 취약점 확인
yarn audit

# 개발 서버 포트 변경
PORT=3002 yarn start

# 디버그 모드로 실행
DEBUG=* yarn start

# 메모리 사용량 확인
node --inspect --expose-gc server.js
```

이 가이드를 통해 효율적인 개발 환경을 구축하고 생산성을 향상시킬 수 있습니다. 각 도구와 설정을 프로젝트 요구사항에 맞게 조정하여 사용하세요.
