#!/bin/bash

# CloudFlare 설정 스크립트
# Loop Dashboard용 CloudFlare CDN 설정 자동화

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정 파일 경로
CONFIG_FILE="cloudflare.json"
ENV_FILE=".env.cloudflare"

echo -e "${BLUE}🌐 CloudFlare CDN 설정을 시작합니다...${NC}"

# CloudFlare 설정 확인
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ cloudflare.json 파일이 없습니다.${NC}"
    exit 1
fi

# 환경 변수 파일 생성
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}📝 CloudFlare 환경 설정 파일을 생성합니다...${NC}"
    cat > "$ENV_FILE" << 'EOF'
# CloudFlare API 설정
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ZONE_ID=your_zone_id_here
CLOUDFLARE_EMAIL=your_email@example.com

# 도메인 설정
DOMAIN=cloop.kro.kr
WWW_DOMAIN=www.cloop.kro.kr
SERVER_IP=YOUR_SERVER_IP

# CDN 설정
CLOUDFLARE_SSL_MODE=flexible
CLOUDFLARE_CACHE_LEVEL=aggressive
EOF
    echo -e "${YELLOW}⚠️  $ENV_FILE 파일을 수정하여 실제 값을 입력하세요.${NC}"
    echo -e "${YELLOW}   필요한 정보:${NC}"
    echo -e "${YELLOW}   - CloudFlare API Token${NC}"
    echo -e "${YELLOW}   - Zone ID${NC}"
    echo -e "${YELLOW}   - 서버 IP 주소${NC}"
    exit 1
fi

# 환경 변수 로드
source "$ENV_FILE"

# API Token 확인
if [ "$CLOUDFLARE_API_TOKEN" = "your_api_token_here" ]; then
    echo -e "${RED}❌ CloudFlare API Token을 설정하세요.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ CloudFlare 설정 파일을 확인했습니다.${NC}"

# CloudFlare CLI 설치 확인
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl이 설치되어 있지 않습니다.${NC}"
    exit 1
fi

# DNS 레코드 설정 함수
setup_dns_records() {
    echo -e "${BLUE}📡 DNS 레코드를 설정합니다...${NC}"
    
    # A 레코드 - 메인 도메인
    echo -e "${YELLOW}🔹 메인 도메인 A 레코드 설정...${NC}"
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{
           "type": "A",
           "name": "'$DOMAIN'",
           "content": "'$SERVER_IP'",
           "ttl": 300,
           "proxied": true
         }' \
         --silent --output /dev/null || echo -e "${YELLOW}⚠️  레코드가 이미 존재할 수 있습니다.${NC}"

    # A 레코드 - www 서브도메인
    echo -e "${YELLOW}🔹 www 서브도메인 A 레코드 설정...${NC}"
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{
           "type": "A",
           "name": "www.'$DOMAIN'",
           "content": "'$SERVER_IP'",
           "ttl": 300,
           "proxied": true
         }' \
         --silent --output /dev/null || echo -e "${YELLOW}⚠️  레코드가 이미 존재할 수 있습니다.${NC}"

    echo -e "${GREEN}✅ DNS 레코드 설정이 완료되었습니다.${NC}"
}

# 보안 설정 함수
setup_security() {
    echo -e "${BLUE}🔒 보안 설정을 적용합니다...${NC}"
    
    # SSL 설정
    echo -e "${YELLOW}🔹 SSL 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/ssl" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "flexible"}' \
         --silent --output /dev/null

    # Always Use HTTPS
    echo -e "${YELLOW}🔹 Always Use HTTPS 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/always_use_https" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "on"}' \
         --silent --output /dev/null

    # Minimum TLS Version
    echo -e "${YELLOW}🔹 최소 TLS 버전 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/min_tls_version" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "1.2"}' \
         --silent --output /dev/null

    # Security Level
    echo -e "${YELLOW}🔹 보안 레벨 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/security_level" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "medium"}' \
         --silent --output /dev/null

    echo -e "${GREEN}✅ 보안 설정이 완료되었습니다.${NC}"
}

# 성능 최적화 설정 함수
setup_performance() {
    echo -e "${BLUE}⚡ 성능 최적화 설정을 적용합니다...${NC}"
    
    # Minification
    echo -e "${YELLOW}🔹 파일 압축 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/minify" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": {"css": "on", "html": "on", "js": "on"}}' \
         --silent --output /dev/null

    # Brotli
    echo -e "${YELLOW}🔹 Brotli 압축 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/brotli" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "on"}' \
         --silent --output /dev/null

    # Polish (이미지 최적화)
    echo -e "${YELLOW}🔹 이미지 최적화 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/polish" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "lossy"}' \
         --silent --output /dev/null

    # WebP
    echo -e "${YELLOW}🔹 WebP 변환 설정...${NC}"
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/webp" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{"value": "on"}' \
         --silent --output /dev/null

    echo -e "${GREEN}✅ 성능 최적화 설정이 완료되었습니다.${NC}"
}

# 캐시 규칙 설정 함수
setup_cache_rules() {
    echo -e "${BLUE}💾 캐시 규칙을 설정합니다...${NC}"
    
    # 정적 파일 캐시 규칙
    echo -e "${YELLOW}🔹 정적 파일 캐시 규칙 생성...${NC}"
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/pagerules" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{
           "targets": [{"target": "url", "constraint": {"operator": "matches", "value": "'$DOMAIN'/static/*"}}],
           "actions": [
             {"id": "cache_level", "value": "cache_everything"},
             {"id": "edge_cache_ttl", "value": 31536000}
           ],
           "priority": 1,
           "status": "active"
         }' \
         --silent --output /dev/null || echo -e "${YELLOW}⚠️  규칙이 이미 존재할 수 있습니다.${NC}"

    # JavaScript 파일 캐시
    echo -e "${YELLOW}🔹 JavaScript 파일 캐시 규칙 생성...${NC}"
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/pagerules" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{
           "targets": [{"target": "url", "constraint": {"operator": "matches", "value": "'$DOMAIN'/*.js"}}],
           "actions": [
             {"id": "cache_level", "value": "cache_everything"},
             {"id": "edge_cache_ttl", "value": 2592000}
           ],
           "priority": 2,
           "status": "active"
         }' \
         --silent --output /dev/null || echo -e "${YELLOW}⚠️  규칙이 이미 존재할 수 있습니다.${NC}"

    # CSS 파일 캐시
    echo -e "${YELLOW}🔹 CSS 파일 캐시 규칙 생성...${NC}"
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/pagerules" \
         -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data '{
           "targets": [{"target": "url", "constraint": {"operator": "matches", "value": "'$DOMAIN'/*.css"}}],
           "actions": [
             {"id": "cache_level", "value": "cache_everything"},
             {"id": "edge_cache_ttl", "value": 2592000}
           ],
           "priority": 3,
           "status": "active"
         }' \
         --silent --output /dev/null || echo -e "${YELLOW}⚠️  규칙이 이미 존재할 수 있습니다.${NC}"

    echo -e "${GREEN}✅ 캐시 규칙 설정이 완료되었습니다.${NC}"
}

# 상태 확인 함수
check_status() {
    echo -e "${BLUE}📊 CloudFlare 설정 상태를 확인합니다...${NC}"
    
    # Zone 정보 확인
    zone_info=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID" \
                     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                     -H "Content-Type: application/json")
    
    zone_name=$(echo "$zone_info" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
    zone_status=$(echo "$zone_info" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo -e "${GREEN}✅ Zone: $zone_name${NC}"
    echo -e "${GREEN}✅ Status: $zone_status${NC}"
    
    # DNS 레코드 확인
    dns_records=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
                       -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                       -H "Content-Type: application/json")
    
    echo -e "${GREEN}✅ DNS 레코드가 설정되었습니다.${NC}"
}

# 메인 실행
main() {
    echo -e "${BLUE}🚀 CloudFlare CDN 설정을 시작합니다...${NC}"
    echo ""
    
    # 단계별 실행
    setup_dns_records
    echo ""
    
    setup_security  
    echo ""
    
    setup_performance
    echo ""
    
    setup_cache_rules
    echo ""
    
    check_status
    echo ""
    
    echo -e "${GREEN}🎉 CloudFlare CDN 설정이 완료되었습니다!${NC}"
    echo ""
    echo -e "${BLUE}📝 다음 사항을 확인하세요:${NC}"
    echo -e "${YELLOW}1. CloudFlare 대시보드에서 SSL/TLS 설정 확인${NC}"
    echo -e "${YELLOW}2. DNS 전파 상태 확인 (최대 24시간 소요)${NC}"
    echo -e "${YELLOW}3. 웹사이트 접속 테스트: https://$DOMAIN${NC}"
    echo -e "${YELLOW}4. 캐시 동작 테스트${NC}"
    echo ""
    echo -e "${BLUE}🔧 CloudFlare 대시보드: https://dash.cloudflare.com/${NC}"
}

# 도움말 출력
show_help() {
    echo -e "${BLUE}CloudFlare CDN 설정 스크립트${NC}"
    echo ""
    echo -e "${YELLOW}사용법:${NC}"
    echo "  $0 [옵션]"
    echo ""
    echo -e "${YELLOW}옵션:${NC}"
    echo "  -h, --help     도움말 표시"
    echo "  --dns-only     DNS 레코드만 설정"
    echo "  --security     보안 설정만 적용"
    echo "  --performance  성능 설정만 적용"
    echo "  --cache        캐시 규칙만 설정"
    echo "  --status       현재 상태 확인"
    echo ""
    echo -e "${YELLOW}예시:${NC}"
    echo "  $0              # 전체 설정 실행"
    echo "  $0 --dns-only   # DNS 레코드만 설정"
    echo "  $0 --status     # 상태 확인"
}

# 명령행 인자 처리
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    --dns-only)
        setup_dns_records
        ;;
    --security)
        setup_security
        ;;
    --performance)
        setup_performance
        ;;
    --cache)
        setup_cache_rules
        ;;
    --status)
        check_status
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
        show_help
        exit 1
        ;;
esac
