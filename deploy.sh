#!/bin/bash

# Loop Dashboard 프로덕션 배포 스크립트

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 Loop Dashboard 프로덕션 배포를 시작합니다..."

# 현재 디렉터리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json이 없습니다. 프로젝트 루트에서 실행해주세요."
    exit 1
fi

# 환경 변수 설정
export NODE_ENV=production

echo "📦 의존성 설치 중..."
yarn install --frozen-lockfile

echo "🔨 프로덕션 빌드 생성 중..."
yarn build

echo "📊 빌드 결과:"
ls -la build/

echo "🧪 빌드 파일 검증 중..."
if [ ! -f "build/index.html" ]; then
    echo "❌ 빌드가 실패했습니다. index.html이 생성되지 않았습니다."
    exit 1
fi

echo "✅ 빌드가 성공적으로 완료되었습니다!"

# PM2로 프로세스 관리 (설치되어 있다면)
if command -v pm2 &> /dev/null; then
    echo "🔄 PM2로 서버 재시작 중..."
    
    # 기존 프로세스 중지
    pm2 stop loop-dashboard-prod 2>/dev/null || true
    pm2 delete loop-dashboard-prod 2>/dev/null || true
    
    # 새 프로세스 시작
    pm2 start ecosystem.config.json
    pm2 save
    
    echo "📊 PM2 프로세스 상태:"
    pm2 status
    
else
    echo "⚠️  PM2가 설치되어 있지 않습니다. 수동으로 서버를 시작해주세요:"
    echo "   yarn serve"
fi

echo "🌐 배포 정보:"
echo "   - 로컬 서버: http://localhost:3001"
echo "   - 프로덕션 도메인: https://cloop.kro.kr"
echo "   - 헬스체크: http://localhost:3001/health"

echo "🎉 배포가 완료되었습니다!"

# 서버 상태 확인
echo "🔍 서버 상태 확인 중..."
sleep 2

# 헬스체크
if curl -f http://localhost:3001/health &>/dev/null; then
    echo "✅ 서버가 정상적으로 실행되고 있습니다."
else
    echo "⚠️  서버 상태를 확인할 수 없습니다. 수동으로 확인해주세요."
fi
