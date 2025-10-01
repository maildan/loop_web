# 🚀 Loop Dashboard 설치 가이드

## 목차
- [시스템 요구사항](#시스템-요구사항)
- [로컬 개발 환경 설정](#로컬-개발-환경-설정)
- [프로덕션 서버 설정](#프로덕션-서버-설정)
- [도메인 연결](#도메인-연결)
- [SSL 인증서 설정](#ssl-인증서-설정)
- [문제 해결](#문제-해결)

## 시스템 요구사항

### 필수 소프트웨어
- **Node.js**: 18.0 이상
- **Yarn**: 1.22 이상 (또는 npm 8.0 이상)
- **Git**: 최신 버전

### 서버 환경 (프로덕션)
- **OS**: Ubuntu 20.04 LTS 이상, CentOS 8 이상, 또는 Debian 11 이상
- **RAM**: 최소 2GB, 권장 4GB 이상
- **Storage**: 최소 10GB 여유 공간
- **Network**: 80, 443, 22 포트 개방

### 선택 소프트웨어
- **PM2**: 프로세스 관리 (권장)
- **Nginx**: 리버스 프록시 및 SSL 종료
- **Docker**: 컨테이너 배포 (선택사항)

## 로컬 개발 환경 설정

### 1. 프로젝트 클론
```bash
# Git 저장소 클론
git clone <repository-url>
cd loop_3_web

# 또는 ZIP 파일 다운로드 후 압축 해제
```

### 2. 의존성 설치
```bash
# Yarn 사용 (권장)
yarn install

# 또는 npm 사용
npm install
```

### 3. 환경 변수 설정
개발 환경용 환경 변수는 이미 `.env.development`에 설정되어 있습니다:

```bash
# .env.development 내용 확인
cat .env.development
```

### 4. 개발 서버 실행
```bash
# 개발 서버 시작 (localhost:3001)
yarn start

# 또는 명시적으로 개발 모드로 시작
yarn start:dev
```

### 5. 개발 환경 확인
브라우저에서 `http://localhost:3001`로 접속하여 애플리케이션이 정상 작동하는지 확인합니다.

## 프로덕션 서버 설정

### 1. 서버 준비

#### Ubuntu/Debian 서버
```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
sudo apt install -y curl wget git unzip nginx

# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn 설치
npm install -g yarn

# PM2 설치 (프로세스 관리)
npm install -g pm2

# 방화벽 설정
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

#### CentOS/RHEL 서버
```bash
# 시스템 업데이트
sudo yum update -y

# EPEL 저장소 추가
sudo yum install -y epel-release

# 필수 패키지 설치
sudo yum install -y curl wget git unzip nginx

# Node.js 18 설치
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Yarn 설치
npm install -g yarn

# PM2 설치
npm install -g pm2

# 방화벽 설정 (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 프로젝트 배포
```bash
# 애플리케이션 디렉터리 생성
sudo mkdir -p /var/www/loop_dashboard
sudo chown $USER:$USER /var/www/loop_dashboard

# 프로젝트 클론
cd /var/www/loop_dashboard
git clone <repository-url> .

# 의존성 설치
yarn install --frozen-lockfile

# 프로덕션 빌드
yarn build
```

### 3. 서비스 사용자 생성 (보안)
```bash
# 전용 사용자 계정 생성
sudo useradd -r -s /bin/false -d /var/www/loop_dashboard loop_dashboard

# 디렉터리 권한 설정
sudo chown -R loop_dashboard:loop_dashboard /var/www/loop_dashboard
sudo chmod -R 755 /var/www/loop_dashboard
```

## 도메인 연결

### 1. DNS 설정
도메인 관리 패널에서 다음 레코드를 추가합니다:

```
타입: A
이름: @
값: [서버 IP 주소]
TTL: 3600

타입: A  
이름: www
값: [서버 IP 주소]
TTL: 3600

타입: CNAME
이름: cloop
값: cloop.kro.kr
TTL: 3600
```

### 2. DNS 전파 확인
```bash
# DNS 전파 확인
nslookup cloop.kro.kr
dig cloop.kro.kr

# 여러 지역에서 DNS 전파 확인 (온라인 도구)
# https://www.whatsmydns.net/
```

## SSL 인증서 설정

### 자동 설치 (권장)
프로젝트에 포함된 자동 설치 스크립트를 사용합니다:

```bash
# 이메일 주소 수정
nano install-ssl.sh
# your-email@example.com을 실제 이메일로 변경

# 스크립트 실행
./install-ssl.sh
```

### 수동 설치

#### 1. Certbot 설치
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL  
sudo yum install certbot python3-certbot-nginx
```

#### 2. SSL 인증서 발급
```bash
# 웹서버 중지
sudo systemctl stop nginx

# 인증서 발급
sudo certbot certonly \
  --standalone \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d cloop.kro.kr \
  -d www.cloop.kro.kr

# 웹서버 시작
sudo systemctl start nginx
```

#### 3. Nginx 설정
```bash
# 프로젝트의 nginx.conf를 복사
sudo cp nginx.conf /etc/nginx/sites-available/cloop.kro.kr

# 사이트 활성화
sudo ln -sf /etc/nginx/sites-available/cloop.kro.kr /etc/nginx/sites-enabled/

# 기본 사이트 비활성화
sudo rm -f /etc/nginx/sites-enabled/default

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### 4. 자동 갱신 설정
```bash
# crontab 편집
sudo crontab -e

# 다음 라인 추가 (매일 12시에 인증서 갱신 확인)
0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

## 애플리케이션 실행

### PM2를 사용한 프로세스 관리 (권장)
```bash
# PM2로 애플리케이션 시작
pm2 start ecosystem.config.json

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs loop-dashboard-prod
```

### 직접 실행
```bash
# 프로덕션 서버 직접 실행
NODE_ENV=production node server.js

# 백그라운드 실행
nohup NODE_ENV=production node server.js > /var/log/loop_dashboard.log 2>&1 &
```

### Systemd 서비스 등록
```bash
# 서비스 파일 생성
sudo nano /etc/systemd/system/loop-dashboard.service
```

서비스 파일 내용:
```ini
[Unit]
Description=Loop Dashboard
After=network.target

[Service]
Type=simple
User=loop_dashboard
WorkingDirectory=/var/www/loop_dashboard
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

서비스 활성화:
```bash
# 서비스 등록 및 시작
sudo systemctl daemon-reload
sudo systemctl enable loop-dashboard
sudo systemctl start loop-dashboard

# 상태 확인
sudo systemctl status loop-dashboard
```

## 배포 자동화

### 자동 배포 스크립트 사용
```bash
# 배포 스크립트 실행
./deploy.sh
```

### 수동 배포
```bash
# 최신 코드 가져오기
git pull origin main

# 의존성 업데이트
yarn install --frozen-lockfile

# 새 빌드 생성
yarn build

# PM2로 애플리케이션 재시작
pm2 restart loop-dashboard-prod

# 또는 systemd 서비스 재시작
sudo systemctl restart loop-dashboard
```

## 모니터링 및 로그

### 애플리케이션 상태 확인
```bash
# 헬스체크
curl http://localhost:3001/health

# 외부에서 접근 확인
curl https://cloop.kro.kr/health
```

### 로그 확인
```bash
# PM2 로그
pm2 logs loop-dashboard-prod

# Nginx 로그
sudo tail -f /var/log/nginx/cloop.kro.kr.access.log
sudo tail -f /var/log/nginx/cloop.kro.kr.error.log

# 시스템 로그 (systemd 사용 시)
sudo journalctl -u loop-dashboard -f
```

### 성능 모니터링
```bash
# PM2 모니터링
pm2 monit

# 시스템 리소스 확인
htop
df -h
free -h
```

## 문제 해결

### 일반적인 문제들

#### 1. 포트 3001이 사용 중인 경우
```bash
# 포트 사용 프로세스 확인
sudo netstat -tlnp | grep :3001
sudo lsof -i :3001

# 프로세스 종료
sudo kill -9 <PID>
```

#### 2. Nginx 설정 오류
```bash
# 설정 문법 확인
sudo nginx -t

# 설정 파일 경로 확인
sudo nginx -T

# Nginx 로그 확인
sudo tail -f /var/log/nginx/error.log
```

#### 3. SSL 인증서 문제
```bash
# 인증서 상태 확인
sudo certbot certificates

# 인증서 수동 갱신
sudo certbot renew --dry-run
sudo certbot renew

# 인증서 삭제 후 재발급
sudo certbot delete --cert-name cloop.kro.kr
```

#### 4. 권한 문제
```bash
# 파일 권한 확인
ls -la /var/www/loop_dashboard

# 권한 수정
sudo chown -R loop_dashboard:loop_dashboard /var/www/loop_dashboard
sudo chmod -R 755 /var/www/loop_dashboard
```

#### 5. Node.js 메모리 부족
```bash
# Node.js 메모리 제한 증가
export NODE_OPTIONS="--max-old-space-size=4096"

# PM2 설정에서 메모리 제한 설정
pm2 start ecosystem.config.json
```

### 지원 및 도움말

문제가 지속될 경우:
1. 프로젝트 이슈 트래커에 문제 보고
2. 로그 파일과 함께 상세한 오류 내용 제공
3. 서버 환경 정보 (OS, Node.js 버전 등) 포함

### 유용한 명령어 모음

```bash
# 전체 서비스 상태 확인
sudo systemctl status nginx loop-dashboard

# 디스크 사용량 확인
df -h

# 메모리 사용량 확인  
free -h

# 네트워크 연결 확인
sudo netstat -tulnp

# 프로세스 확인
ps aux | grep node

# 로그 파일 크기 확인
sudo du -sh /var/log/nginx/*
sudo du -sh ~/.pm2/logs/*
```

이 가이드를 따라하면 Loop Dashboard를 성공적으로 설치하고 운영할 수 있습니다. 각 단계별로 신중하게 진행하시고, 문제가 발생하면 해당 섹션의 문제 해결 가이드를 참조하세요.
