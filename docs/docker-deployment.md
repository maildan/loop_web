# 🐳 Docker 배포 가이드

## 목차
- [Docker 환경 준비](#docker-환경-준비)
- [단일 컨테이너 배포](#단일-컨테이너-배포)
- [Docker Compose 배포](#docker-compose-배포)
- [프로덕션 배포](#프로덕션-배포)
- [컨테이너 관리](#컨테이너-관리)
- [문제 해결](#문제-해결)

## Docker 환경 준비

### 1. Docker 설치

#### Ubuntu/Debian
```bash
# 기존 Docker 제거
sudo apt-get remove docker docker-engine docker.io containerd runc

# 패키지 업데이트
sudo apt-get update

# 필수 패키지 설치
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Docker 공식 GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker 저장소 추가
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 재로그인 또는 다음 명령어 실행
newgrp docker
```

#### CentOS/RHEL
```bash
# 기존 Docker 제거
sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# yum-utils 설치
sudo yum install -y yum-utils

# Docker 저장소 추가
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Docker 설치
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker

# 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER
```

#### macOS
```bash
# Homebrew를 사용한 설치
brew install docker docker-compose

# 또는 Docker Desktop 다운로드
# https://www.docker.com/products/docker-desktop
```

### 2. Docker Compose 설치 (별도 설치 필요한 경우)
```bash
# 최신 버전 확인: https://github.com/docker/compose/releases
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 실행 권한 부여
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker-compose --version
```

### 3. 설치 확인
```bash
# Docker 버전 확인
docker --version
docker-compose --version

# Docker 테스트
docker run hello-world
```

## 단일 컨테이너 배포

### 1. Docker 이미지 빌드
```bash
# 프로젝트 디렉터리로 이동
cd /path/to/loop_3_web

# Docker 이미지 빌드
docker build -t loop-dashboard:latest .

# 빌드 확인
docker images | grep loop-dashboard
```

### 2. 컨테이너 실행
```bash
# 개발 환경으로 실행
docker run -d \
  --name loop-dashboard-dev \
  -p 3001:3001 \
  -e NODE_ENV=development \
  loop-dashboard:latest

# 프로덕션 환경으로 실행
docker run -d \
  --name loop-dashboard-prod \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -v $(pwd)/logs:/app/logs \
  --restart unless-stopped \
  loop-dashboard:latest
```

### 3. 컨테이너 상태 확인
```bash
# 실행 중인 컨테이너 확인
docker ps

# 컨테이너 로그 확인
docker logs loop-dashboard-prod

# 컨테이너 내부 접속
docker exec -it loop-dashboard-prod sh
```

## Docker Compose 배포

### 1. 환경 설정 파일 준비

#### .env 파일 생성
```bash
# 프로덕션 환경 변수 파일 생성
cat > .env.docker << EOF
# Docker 환경 설정
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# 도메인 설정
REACT_APP_DOMAIN=cloop.kro.kr
REACT_APP_API_URL=https://cloop.kro.kr
PUBLIC_URL=https://cloop.kro.kr

# SSL 설정
SSL_EMAIL=your-email@example.com
DOMAIN_NAME=cloop.kro.kr
EOF
```

### 2. Docker Compose 실행

#### 개발 환경
```bash
# 개발 환경 Compose 파일 생성
cat > docker-compose.dev.yml << EOF
version: '3.8'

services:
  loop-dashboard:
    build:
      context: .
      target: builder  # 개발용 스테이지
    container_name: loop-dashboard-dev
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
      - HOST=0.0.0.0
    volumes:
      - .:/app
      - /app/node_modules
      - ./logs:/app/logs
    command: yarn start
    restart: unless-stopped
EOF

# 개발 환경 실행
docker-compose -f docker-compose.dev.yml up -d
```

#### 프로덕션 환경
```bash
# 프로덕션 환경 실행 (전체 스택)
docker-compose up -d

# 백그라운드에서 실행
docker-compose up -d --build

# 특정 서비스만 실행
docker-compose up -d loop-dashboard
```

### 3. SSL 인증서 설정 (Docker Compose)

#### Let's Encrypt 인증서 초기 발급
```bash
# Certbot을 사용한 인증서 발급 스크립트
cat > init-letsencrypt.sh << 'EOF'
#!/bin/bash

domains=(cloop.kro.kr www.cloop.kro.kr)
rsa_key_size=4096
data_path="./certbot"
email="your-email@example.com"
staging=0 # Set to 1 if you're testing your setup

if [ -d "$data_path" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for $domains ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo

echo "### Requesting Let's Encrypt certificate for $domains ..."
#Join $domains to -d args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker-compose exec nginx nginx -s reload
EOF

# 스크립트 실행 권한 부여
chmod +x init-letsencrypt.sh

# 인증서 발급 실행
./init-letsencrypt.sh
```

## 프로덕션 배포

### 1. 프로덕션 최적화 Dockerfile
프로젝트의 Dockerfile은 이미 멀티 스테이지 빌드로 최적화되어 있습니다:

```dockerfile
# 현재 Dockerfile의 주요 특징:
# - 멀티 스테이지 빌드로 최종 이미지 크기 최소화
# - 보안을 위한 non-root 사용자 설정
# - 헬스체크 포함
# - 프로덕션 최적화 설정
```

### 2. 프로덕션 배포 명령어
```bash
# 프로덕션 이미지 빌드
docker-compose build --no-cache

# 프로덕션 환경 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 상태 확인
docker-compose ps
```

### 3. 무중단 배포
```bash
# 무중단 배포 스크립트
cat > deploy-docker.sh << 'EOF'
#!/bin/bash

echo "🚀 Docker 무중단 배포를 시작합니다..."

# 최신 코드 가져오기
git pull origin main

# 새 이미지 빌드
echo "📦 새 Docker 이미지 빌드 중..."
docker-compose build --no-cache loop-dashboard

# Blue-Green 배포
echo "🔄 Blue-Green 배포 실행 중..."

# 새 컨테이너 시작 (다른 포트에서)
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d loop-dashboard-staging

# 헬스체크
echo "🏥 헬스체크 대기 중..."
for i in {1..30}; do
    if curl -f http://localhost:3002/health &>/dev/null; then
        echo "✅ 새 서비스가 정상 작동합니다."
        break
    fi
    echo "⏳ 헬스체크 시도 $i/30..."
    sleep 2
done

# Nginx 설정 업데이트 (포트 전환)
echo "🔀 트래픽 전환 중..."
# 여기서 Nginx 설정을 업데이트하여 트래픽을 새 컨테이너로 전환

# 기존 컨테이너 중지
echo "🛑 기존 서비스 중지 중..."
docker-compose stop loop-dashboard

# 컨테이너 이름 변경 (옵션)
docker rename loop-dashboard-staging loop-dashboard

echo "🎉 배포가 완료되었습니다!"
EOF

chmod +x deploy-docker.sh
```

## 컨테이너 관리

### 1. 기본 관리 명령어
```bash
# 컨테이너 시작
docker-compose start

# 컨테이너 중지
docker-compose stop

# 컨테이너 재시작
docker-compose restart

# 컨테이너 삭제
docker-compose down

# 볼륨까지 삭제
docker-compose down -v

# 이미지까지 삭제
docker-compose down --rmi all
```

### 2. 로그 관리
```bash
# 모든 서비스 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs loop-dashboard

# 실시간 로그 확인
docker-compose logs -f

# 마지막 100줄만 보기
docker-compose logs --tail=100

# 로그 크기 제한 설정 (docker-compose.yml에 추가)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 3. 리소스 모니터링
```bash
# 컨테이너 리소스 사용량 확인
docker stats

# 특정 컨테이너만 확인
docker stats loop-dashboard-prod

# 디스크 사용량 확인
docker system df

# 사용하지 않는 리소스 정리
docker system prune -a
```

### 4. 백업 및 복원
```bash
# 컨테이너 데이터 백업
docker run --rm \
  -v loop_3_web_app_data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/app_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# 데이터 복원
docker run --rm \
  -v loop_3_web_app_data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar xzf /backup/app_data_20231201_143000.tar.gz -C /data

# 이미지 백업
docker save loop-dashboard:latest | gzip > loop-dashboard-backup.tar.gz

# 이미지 복원
gunzip -c loop-dashboard-backup.tar.gz | docker load
```

## 문제 해결

### 1. 일반적인 문제들

#### 컨테이너가 시작되지 않는 경우
```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs loop-dashboard

# 컨테이너 내부 확인
docker-compose exec loop-dashboard sh
```

#### 포트 충돌 문제
```bash
# 포트 사용 확인
sudo netstat -tlnp | grep :3001

# 다른 포트로 실행
docker-compose run -p 3002:3001 loop-dashboard
```

#### 이미지 빌드 실패
```bash
# 캐시 없이 빌드
docker-compose build --no-cache

# 빌드 컨텍스트 확인
docker build --progress=plain --no-cache .

# Docker 빌드 로그 상세 확인
DOCKER_BUILDKIT=1 docker build --progress=plain .
```

### 2. 성능 최적화

#### 이미지 크기 최적화
```bash
# 이미지 크기 확인
docker images | grep loop-dashboard

# 이미지 레이어 분석
docker history loop-dashboard:latest

# 멀티 스테이지 빌드 최적화 (이미 적용됨)
# - builder 스테이지에서 빌드 후 production 스테이지로 복사
# - 최종 이미지에는 런타임 파일만 포함
```

#### 컨테이너 리소스 제한
```yaml
# docker-compose.yml에 리소스 제한 추가
services:
  loop-dashboard:
    # ...
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

### 3. 보안 설정

#### 비 루트 사용자 실행 (이미 적용됨)
```dockerfile
# Dockerfile에서 이미 적용된 보안 설정:
# - 전용 사용자 계정 생성
# - 최소 권한으로 실행
# - 불필요한 패키지 제거
```

#### 시크릿 관리
```bash
# Docker Secrets 사용 (Swarm 모드)
echo "your-secret-key" | docker secret create app_secret -

# 환경 변수 파일 보안
chmod 600 .env
```

### 4. 데이터베이스 연동 (확장)
```yaml
# PostgreSQL 추가 예시
services:
  loop-dashboard:
    # ...
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/loop_db

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: loop_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 유용한 Docker 명령어 모음

```bash
# 시스템 정보
docker info
docker version

# 이미지 관리
docker images                    # 이미지 목록
docker rmi <image_id>           # 이미지 삭제
docker image prune              # 사용하지 않는 이미지 정리

# 컨테이너 관리
docker ps -a                    # 모든 컨테이너 목록
docker rm <container_id>        # 컨테이너 삭제
docker container prune          # 정지된 컨테이너 정리

# 볼륨 관리
docker volume ls                # 볼륨 목록
docker volume rm <volume_name>  # 볼륨 삭제
docker volume prune             # 사용하지 않는 볼륨 정리

# 네트워크 관리
docker network ls               # 네트워크 목록
docker network inspect bridge  # 네트워크 정보 확인

# 시스템 정리
docker system prune             # 사용하지 않는 모든 리소스 정리
docker system prune -a          # 모든 미사용 리소스 정리 (이미지 포함)
```

이 가이드를 통해 Docker를 사용한 Loop Dashboard 배포를 성공적으로 수행할 수 있습니다. 각 환경에 맞는 적절한 방법을 선택하여 사용하세요.
