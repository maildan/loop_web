#!/bin/bash

# CloudFlare CDN 상태 확인 및 테스트 스크립트
# Loop Dashboard CloudFlare 설정 검증

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="cloop.kro.kr"
WWW_DOMAIN="www.cloop.kro.kr"

echo -e "${BLUE}🌐 CloudFlare CDN 상태를 확인합니다...${NC}"
echo -e "${YELLOW}📍 테스트 도메인: $DOMAIN${NC}"
echo -e "${YELLOW}💡 참고: 도메인이 CloudFlare에 설정되지 않았다면 일부 테스트가 실패할 수 있습니다${NC}"
echo ""

# 1. DNS 전파 확인
echo -e "${BLUE}📡 DNS 전파 상태 확인${NC}"
echo -e "${YELLOW}메인 도메인 ($DOMAIN):${NC}"
if MAIN_IP=$(dig +short A $DOMAIN 2>/dev/null); then
    if [ ! -z "$MAIN_IP" ]; then
        echo "$MAIN_IP"
        echo -e "${GREEN}✅ DNS 응답 정상${NC}"
    else
        echo -e "${RED}❌ DNS 응답 없음${NC}"
    fi
else
    echo -e "${RED}❌ DNS 조회 실패${NC}"
fi

echo -e "${YELLOW}www 서브도메인 ($WWW_DOMAIN):${NC}"
if WWW_IP=$(dig +short A $WWW_DOMAIN 2>/dev/null); then
    if [ ! -z "$WWW_IP" ]; then
        echo "$WWW_IP"
        echo -e "${GREEN}✅ DNS 응답 정상${NC}"
    else
        echo -e "${YELLOW}⚠️  www 서브도메인 DNS 응답 없음${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  www 서브도메인 DNS 조회 실패${NC}"
fi
echo ""

# 2. SSL 인증서 확인
echo -e "${BLUE}🔒 SSL 인증서 확인${NC}"
echo -e "${YELLOW}SSL 정보:${NC}"
if timeout 10 bash -c "</dev/tcp/$DOMAIN/443" 2>/dev/null; then
    SSL_INFO=$(echo | timeout 10 openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null)
    if [ ! -z "$SSL_INFO" ]; then
        echo "$SSL_INFO"
        echo -e "${GREEN}✅ SSL 인증서가 올바르게 설정됨${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL 인증서 정보를 가져올 수 없음${NC}"
    fi
else
    echo -e "${RED}❌ 도메인에 연결할 수 없음 (포트 443)${NC}"
    echo -e "${YELLOW}💡 도메인이 CloudFlare에 설정되지 않았거나 DNS가 전파되지 않았을 수 있습니다${NC}"
fi
echo ""

# 3. CloudFlare 연결 확인
echo -e "${BLUE}☁️  CloudFlare 연결 확인${NC}"
if CF_RAY=$(curl -s -I --connect-timeout 10 --max-time 15 https://$DOMAIN 2>/dev/null | grep -i cf-ray | cut -d' ' -f2 | tr -d '\r'); then
    if [ ! -z "$CF_RAY" ]; then
        echo -e "${GREEN}✅ CloudFlare를 통해 연결됨 (CF-Ray: $CF_RAY)${NC}"
    else
        echo -e "${RED}❌ CloudFlare 연결 실패 - CF-Ray 헤더 없음${NC}"
        echo -e "${YELLOW}💡 도메인이 CloudFlare를 통해 프록시되지 않고 있습니다${NC}"
    fi
else
    echo -e "${RED}❌ 도메인 연결 실패${NC}"
    echo -e "${YELLOW}💡 DNS 설정을 확인하거나 CloudFlare 설정을 검토해주세요${NC}"
fi
echo ""

# 4. 캐시 상태 확인
echo -e "${BLUE}💾 캐시 상태 확인${NC}"
if CACHE_STATUS=$(curl -s -I --connect-timeout 10 --max-time 15 https://$DOMAIN 2>/dev/null | grep -i cf-cache-status | cut -d' ' -f2 | tr -d '\r'); then
    if [ ! -z "$CACHE_STATUS" ]; then
        echo -e "${GREEN}✅ 캐시 상태: $CACHE_STATUS${NC}"
        case "$CACHE_STATUS" in
            "HIT") echo -e "${GREEN}  🎯 캐시 히트 - 최적화됨${NC}" ;;
            "MISS") echo -e "${YELLOW}  🔄 캐시 미스 - 처음 요청${NC}" ;;
            "DYNAMIC") echo -e "${BLUE}  ⚡ 동적 콘텐츠${NC}" ;;
            "BYPASS") echo -e "${YELLOW}  ⏭️  캐시 우회${NC}" ;;
        esac
    else
        echo -e "${YELLOW}⚠️  캐시 정보 없음${NC}"
    fi
else
    echo -e "${RED}❌ 캐시 정보 확인 실패${NC}"
fi
echo ""

# 5. 압축 확인
echo -e "${BLUE}🗜️  압축 확인${NC}"
if CONTENT_ENCODING=$(curl -s -I -H "Accept-Encoding: gzip, br" --connect-timeout 10 --max-time 15 https://$DOMAIN 2>/dev/null | grep -i content-encoding | cut -d' ' -f2 | tr -d '\r'); then
    if [ ! -z "$CONTENT_ENCODING" ]; then
        echo -e "${GREEN}✅ 압축 방식: $CONTENT_ENCODING${NC}"
        case "$CONTENT_ENCODING" in
            "br") echo -e "${GREEN}  🚀 Brotli 압축 - 최고 효율${NC}" ;;
            "gzip") echo -e "${GREEN}  📦 Gzip 압축 - 표준 효율${NC}" ;;
        esac
    else
        echo -e "${YELLOW}⚠️  압축 정보 없음${NC}"
    fi
else
    echo -e "${RED}❌ 압축 정보 확인 실패${NC}"
fi
echo ""

# 6. 성능 테스트
echo -e "${BLUE}⚡ 성능 테스트${NC}"
echo -e "${YELLOW}응답 시간 측정:${NC}"
if curl -w "DNS lookup: %{time_namelookup}s\nConnect: %{time_connect}s\nSSL: %{time_appconnect}s\nFirst byte: %{time_starttransfer}s\nTotal: %{time_total}s\n" -o /dev/null -s --connect-timeout 10 --max-time 30 https://$DOMAIN 2>/dev/null; then
    echo -e "${GREEN}✅ 응답 시간 측정 완료${NC}"
else
    echo -e "${RED}❌ 성능 테스트 실패 - 연결 시간 초과${NC}"
fi
echo ""

# 7. 정적 파일 캐시 테스트
echo -e "${BLUE}📁 정적 파일 캐시 테스트${NC}"
# 빌드된 파일 확인
if [ -f "/Users/user/loop/loop_3_web/build/static/css/main.*.css" ]; then
    CSS_FILE=$(ls /Users/user/loop/loop_3_web/build/static/css/main.*.css 2>/dev/null | head -1 | xargs basename)
    if [ ! -z "$CSS_FILE" ]; then
        STATIC_CACHE=$(curl -s -I --connect-timeout 10 --max-time 15 https://$DOMAIN/static/css/$CSS_FILE 2>/dev/null | grep -i cf-cache-status | cut -d' ' -f2 | tr -d '\r' || echo "확인 실패")
        echo -e "${YELLOW}CSS 파일 ($CSS_FILE) 캐시 상태: $STATIC_CACHE${NC}"
    else
        echo -e "${YELLOW}⚠️  빌드된 CSS 파일을 찾을 수 없음${NC}"
    fi
else
    # 기본 파일로 테스트
    STATIC_CACHE=$(curl -s -I --connect-timeout 10 --max-time 15 https://$DOMAIN/static/css/main.css 2>/dev/null | grep -i cf-cache-status | cut -d' ' -f2 | tr -d '\r' || echo "파일 없음")
    echo -e "${YELLOW}CSS 파일 캐시 상태: $STATIC_CACHE${NC}"
fi
echo ""

# 8. 보안 헤더 확인
echo -e "${BLUE}🛡️  보안 헤더 확인${NC}"
if HEADERS=$(curl -s -I --connect-timeout 10 --max-time 15 https://$DOMAIN 2>/dev/null); then
    echo "$HEADERS" | grep -i "strict-transport-security" > /dev/null && echo -e "${GREEN}✅ HSTS 설정됨${NC}" || echo -e "${YELLOW}⚠️  HSTS 미설정${NC}"
    echo "$HEADERS" | grep -i "x-frame-options" > /dev/null && echo -e "${GREEN}✅ X-Frame-Options 설정됨${NC}" || echo -e "${YELLOW}⚠️  X-Frame-Options 미설정${NC}"
    echo "$HEADERS" | grep -i "x-content-type-options" > /dev/null && echo -e "${GREEN}✅ X-Content-Type-Options 설정됨${NC}" || echo -e "${YELLOW}⚠️  X-Content-Type-Options 미설정${NC}"
    echo "$HEADERS" | grep -i "content-security-policy" > /dev/null && echo -e "${GREEN}✅ CSP 설정됨${NC}" || echo -e "${YELLOW}⚠️  CSP 미설정${NC}"
    echo "$HEADERS" | grep -i "referrer-policy" > /dev/null && echo -e "${GREEN}✅ Referrer-Policy 설정됨${NC}" || echo -e "${YELLOW}⚠️  Referrer-Policy 미설정${NC}"
else
    echo -e "${RED}❌ 보안 헤더 확인 실패${NC}"
fi
echo ""

echo ""
echo -e "${GREEN}🎉 CloudFlare CDN 상태 확인이 완료되었습니다!${NC}"
echo ""
echo -e "${BLUE}📊 추가 성능 테스트 도구:${NC}"
echo -e "${YELLOW}- PageSpeed Insights: https://pagespeed.web.dev/?url=https://$DOMAIN${NC}"
echo -e "${YELLOW}- GTmetrix: https://gtmetrix.com/?url=https://$DOMAIN${NC}"
echo -e "${YELLOW}- WebPageTest: https://www.webpagetest.org/?url=https://$DOMAIN${NC}"
echo -e "${YELLOW}- CloudFlare Analytics: https://dash.cloudflare.com/analytics${NC}"
