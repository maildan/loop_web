# Loop Dashboard 배포 가이드 (CloudFlare CDN 포함)

## 🚀 빠른 시작

### 개발 환경
```bash
# 개발 서버 시작 (localhost:3001)
yarn start

# 또는 명시적으로 개발 모드로 시작
yarn start:dev
```

### 프로덕션 빌드
```bash
# 프로덕션 빌드 생성
yarn build

# CloudFlare CDN 최적화 빌드
yarn build:cdn

# 프로덕션 서버 시작
yarn serve

# 빌드 + 서버 시작을 한 번에
yarn prod
```

## 🌐 CloudFlare CDN 배포

### 1. CloudFlare 계정 설정
```bash
# CloudFlare 계정 생성 후 도메인 추가
# https://dash.cloudflare.com/

# 환경 설정 파일 생성
cp .env.cloudflare.example .env.cloudflare

# API 토큰과 Zone ID 입력
vi .env.cloudflare
```

### 2. 자동 CDN 설정
```bash
# CloudFlare CDN 자동 설정
yarn cloudflare:setup

# DNS 레코드만 설정
yarn cloudflare:dns

# 캐시 규칙만 설정  
yarn cloudflare:cache
```

### 3. CDN 최적화 배포
```bash
# CDN 최적화 빌드 + 캐시 무효화
yarn deploy:cdn

# 수동 캐시 무효화
yarn cloudflare:purge
```

## 🌐 도메인 배포

### 1. 서버 환경 설정

#### Ubuntu/Debian
```bash
# Nginx 설치
sudo apt update
sudo apt install nginx

# Node.js 18+ 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn 설치
npm install -g yarn

# PM2 설치 (프로세스 관리)
npm install -g pm2
```

#### CentOS/RHEL
```bash
# Nginx 설치
sudo yum install nginx

# Node.js 18+ 설치
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Yarn 설치
npm install -g yarn

# PM2 설치
npm install -g pm2
```

### 2. SSL 인증서 설치
```bash
# 스크립트 실행 전 이메일 주소 수정
vi install-ssl.sh

# SSL 인증서 자동 설치
./install-ssl.sh
```

### 3. 애플리케이션 배포
```bash
# 프로젝트 클론
git clone <repository-url>
cd loop_3_web

# 배포 스크립트 실행
./deploy.sh
```

### 4. Docker를 사용한 배포 (선택사항)
```bash
# Docker Compose로 전체 스택 배포
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

## 📁 파일 구조

```
loop_3_web/
├── nginx.conf              # Nginx 설정 파일
├── docker-compose.yml      # Docker Compose 설정
├── Dockerfile             # Docker 이미지 빌드 설정
├── install-ssl.sh         # SSL 인증서 설치 스크립트
├── deploy.sh              # 배포 스크립트
├── server.js              # Express 프로덕션 서버
├── ecosystem.config.json  # PM2 설정
├── .env.development       # 개발 환경 설정
├── .env.production        # 프로덕션 환경 설정
└── build/                 # 빌드된 정적 파일들
```

## 🔧 환경 설정

### 개발 환경 (.env.development)
- `localhost:3001`에서 실행
- 소스맵 생성
- Hot reload 활성화

### 프로덕션 환경 (.env.production)
- `cloop.kro.kr` 도메인 사용
- 최적화된 빌드
- 압축 및 캐싱 활성화

## 📊 모니터링

### 헬스체크
```bash
# 서버 상태 확인
curl http://localhost:3001/health
```

### PM2 모니터링
```bash
# 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs loop-dashboard-prod

# 메모리/CPU 사용률 확인
pm2 monit
```

### Nginx 로그
```bash
# 액세스 로그
sudo tail -f /var/log/nginx/cloop.kro.kr.access.log

# 에러 로그
sudo tail -f /var/log/nginx/cloop.kro.kr.error.log
```

## 🔒 보안 설정

### SSL 인증서 자동 갱신
```bash
# Cron job으로 자동 갱신 설정됨
sudo crontab -l
```

### 방화벽 설정
```bash
# UFW 사용 시
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```

## 🚨 문제 해결

### 포트 충돌
```bash
# 3001 포트 사용 중인 프로세스 확인
sudo netstat -tlnp | grep :3001
sudo kill -9 <PID>
```

### Nginx 설정 오류
```bash
# 설정 테스트
sudo nginx -t

# 설정 다시 로드
sudo systemctl reload nginx
```

### SSL 인증서 문제
```bash
# 인증서 상태 확인
sudo certbot certificates

# 수동 갱신
sudo certbot renew
```

## 📈 성능 최적화

- ✅ Gzip 압축 활성화
- ✅ 정적 파일 캐싱 (1년)
- ✅ 코드 분할 (vendor, react, recharts, lucide)
- ✅ 이미지 최적화
- ✅ Tree shaking
- ✅ React 최적화 (memo, useCallback, Suspense)

## 🔗 유용한 링크

- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Let's Encrypt 가이드](https://letsencrypt.org/getting-started/)
- [PM2 문서](https://pm2.keymetrics.io/docs/)
- [Docker Compose 가이드](https://docs.docker.com/compose/)
