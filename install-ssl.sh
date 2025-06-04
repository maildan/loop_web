#!/bin/bash

# SSL 인증서 설치 스크립트
# cloop.kro.kr 도메인용 Let's Encrypt 인증서 설치

echo "🔐 SSL 인증서 설치를 시작합니다..."

# 필요한 디렉터리 생성
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/letsencrypt

# Certbot 설치 (Ubuntu/Debian)
if command -v apt-get &> /dev/null; then
    echo "📦 Certbot 설치 중..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
elif command -v yum &> /dev/null; then
    # CentOS/RHEL
    echo "📦 Certbot 설치 중 (CentOS/RHEL)..."
    sudo yum install -y certbot python3-certbot-nginx
elif command -v brew &> /dev/null; then
    # macOS
    echo "📦 Certbot 설치 중 (macOS)..."
    brew install certbot
fi

# Nginx 중지 (인증서 발급을 위해)
echo "🛑 Nginx 중지 중..."
sudo systemctl stop nginx 2>/dev/null || true

# SSL 인증서 발급
echo "🔐 SSL 인증서 발급 중..."
sudo certbot certonly \
  --standalone \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d cloop.kro.kr \
  -d www.cloop.kro.kr

# Nginx 설정 파일 복사
echo "📋 Nginx 설정 복사 중..."
sudo cp nginx.conf /etc/nginx/sites-available/cloop.kro.kr
sudo ln -sf /etc/nginx/sites-available/cloop.kro.kr /etc/nginx/sites-enabled/

# 기본 사이트 비활성화
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
echo "🧪 Nginx 설정 테스트 중..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 설정이 올바릅니다."
    
    # Nginx 시작
    echo "🚀 Nginx 시작 중..."
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    echo "🎉 SSL 인증서 설치가 완료되었습니다!"
    echo "📍 사이트 주소: https://cloop.kro.kr"
    
    # 인증서 자동 갱신 설정
    echo "🔄 SSL 인증서 자동 갱신 설정 중..."
    (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx") | sudo crontab -
    
else
    echo "❌ Nginx 설정에 오류가 있습니다. 설정을 확인해주세요."
    exit 1
fi

echo "📊 SSL 인증서 상태:"
sudo certbot certificates
