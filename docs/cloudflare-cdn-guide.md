# 🌐 CloudFlare CDN 설정 가이드

## 목차
- [CloudFlare CDN 개요](#cloudflare-cdn-개요)
- [사전 준비사항](#사전-준비사항)
- [CloudFlare 계정 설정](#cloudflare-계정-설정)
- [DNS 설정](#dns-설정)
- [SSL/TLS 설정](#ssltls-설정)
- [성능 최적화](#성능-최적화)
- [보안 설정](#보안-설정)
- [캐시 설정](#캐시-설정)
- [자동 설정 스크립트](#자동-설정-스크립트)
- [모니터링 및 분석](#모니터링-및-분석)
- [문제 해결](#문제-해결)

## CloudFlare CDN 개요

CloudFlare는 전 세계적으로 분산된 CDN(Content Delivery Network) 서비스로, 다음과 같은 이점을 제공합니다:

### 주요 기능
- **전역 CDN**: 200개 이상의 도시에 분산된 엣지 서버
- **DDoS 보호**: 자동 DDoS 공격 차단
- **SSL/TLS**: 무료 SSL 인증서 제공
- **성능 최적화**: 자동 압축, 이미지 최적화, 캐싱
- **보안 기능**: WAF(Web Application Firewall), Bot 관리
- **분석**: 실시간 트래픽 및 성능 분석

### Loop Dashboard에 대한 이점
- **로딩 속도 향상**: React 앱의 정적 파일 캐싱
- **글로벌 접근성**: 전 세계 어디서나 빠른 접속
- **대역폭 절약**: 원본 서버 부하 감소
- **보안 강화**: 자동 보안 위협 차단
- **SSL 간소화**: 무료 SSL 인증서 자동 관리

## 사전 준비사항

### 필수 사항
1. **CloudFlare 계정**: [cloudflare.com](https://www.cloudflare.com) 가입
2. **도메인 소유권**: `cloop.kro.kr` 도메인 관리 권한
3. **서버 IP**: 실제 서버의 공인 IP 주소
4. **API 토큰**: CloudFlare API 접근 권한

### 도메인 네임서버 변경 준비
- 현재 DNS 공급자 정보 확인
- DNS 레코드 목록 백업
- TTL 설정 확인 (전환 시간 단축을 위해)

## CloudFlare 계정 설정

### 1. 도메인 추가

#### CloudFlare 대시보드에서 도메인 추가
1. CloudFlare 대시보드 로그인
2. "사이트 추가" 클릭
3. 도메인 입력: `cloop.kro.kr`
4. 플랜 선택 (Free 플랜으로 시작 가능)

#### DNS 레코드 스캔
```
CloudFlare가 자동으로 기존 DNS 레코드를 스캔합니다.
확인 후 누락된 레코드가 있다면 수동으로 추가하세요.
```

### 2. 네임서버 변경

#### CloudFlare 네임서버 정보 확인
```
예시 네임서버:
- blake.ns.cloudflare.com
- olga.ns.cloudflare.com
```

#### 도메인 등록업체에서 네임서버 변경
1. 도메인 등록업체 관리 패널 접속
2. DNS 관리 또는 네임서버 설정 메뉴
3. CloudFlare 네임서버로 변경
4. 변경 사항 저장

#### 변경 확인
```bash
# DNS 전파 확인
dig NS cloop.kro.kr
nslookup -type=NS cloop.kro.kr

# 온라인 도구 사용
# https://www.whatsmydns.net/
```

## DNS 설정

### 1. A 레코드 설정

#### 메인 도메인
```
Type: A
Name: cloop.kro.kr (또는 @)
Content: YOUR_SERVER_IP
TTL: Auto
Proxy: ✅ Proxied (오렌지 클라우드)
```

#### www 서브도메인
```
Type: A
Name: www
Content: YOUR_SERVER_IP
TTL: Auto
Proxy: ✅ Proxied
```

### 2. CNAME 레코드 (선택사항)

#### API 서브도메인
```
Type: CNAME
Name: api
Content: cloop.kro.kr
TTL: Auto
Proxy: ✅ Proxied
```

### 3. Proxy 상태 설정
- **Proxied (오렌지 클라우드)**: CloudFlare를 통해 프록시됨
- **DNS Only (회색 클라우드)**: DNS만 제공, CDN 기능 없음

## SSL/TLS 설정

### 1. SSL/TLS 암호화 모드

#### Flexible SSL (권장 - 시작용)
```
브라우저 ↔ CloudFlare: HTTPS
CloudFlare ↔ 원본 서버: HTTP
```

**설정 방법:**
1. SSL/TLS 탭 → 개요
2. 암호화 모드: "Flexible" 선택

#### Full SSL (보안 강화)
```
브라우저 ↔ CloudFlare: HTTPS
CloudFlare ↔ 원본 서버: HTTPS (자체 서명 인증서 허용)
```

#### Full (strict) SSL (최고 보안)
```
브라우저 ↔ CloudFlare: HTTPS
CloudFlare ↔ 원본 서버: HTTPS (유효한 인증서 필요)
```

### 2. Always Use HTTPS
```
모든 HTTP 요청을 HTTPS로 자동 리디렉션
```

**설정:**
1. SSL/TLS 탭 → Edge Certificates
2. "Always Use HTTPS" 활성화

### 3. HSTS (HTTP Strict Transport Security)
```
브라우저가 항상 HTTPS로만 연결하도록 강제
```

**설정:**
1. SSL/TLS 탭 → Edge Certificates
2. "HTTP Strict Transport Security (HSTS)" 활성화
3. Max Age: 6 months
4. Include subdomains: 활성화
5. No-Sniff header: 활성화

## 성능 최적화

### 1. Auto Minify
JavaScript, CSS, HTML 파일 자동 압축

**설정:**
1. Speed 탭 → Optimization
2. Auto Minify 섹션에서 JavaScript, CSS, HTML 체크

### 2. Brotli
고효율 압축 알고리즘

**설정:**
1. Speed 탭 → Optimization
2. "Brotli" 활성화

### 3. Polish (이미지 최적화)
이미지 자동 압축 및 최적화

**설정:**
1. Speed 탭 → Optimization
2. Polish: "Lossy" 선택 (품질 vs 크기 균형)

### 4. WebP
WebP 형식으로 이미지 자동 변환

**설정:**
1. Speed 탭 → Optimization
2. "WebP" 활성화

### 5. Mirage
느린 네트워크에서 이미지 로딩 최적화

**설정:**
1. Speed 탭 → Optimization
2. "Mirage" 활성화

### 6. Rocket Loader
JavaScript 로딩 최적화 (주의: 일부 앱에서 문제 발생 가능)

**설정:**
1. Speed 탭 → Optimization
2. "Rocket Loader" - 테스트 후 활성화 결정

## 보안 설정

### 1. Security Level
공격 차단 강도 설정

**옵션:**
- **Off**: 보안 기능 비활성화
- **Essentially Off**: 매우 낮은 보안
- **Low**: 낮은 보안 (정상 트래픽 대부분 허용)
- **Medium**: 중간 보안 (권장)
- **High**: 높은 보안 (일부 정상 트래픽도 차단 가능)
- **I'm Under Attack**: 최고 보안 (DDoS 공격 시 사용)

### 2. Bot Fight Mode
봇 트래픽 자동 차단

**설정:**
1. Security 탭 → Bots
2. "Bot Fight Mode" 활성화

### 3. Browser Integrity Check
브라우저 무결성 검사

**설정:**
1. Security 탭 → Settings
2. "Browser Integrity Check" 활성화

## 캐시 설정

### 1. 캐시 레벨

#### 옵션
- **No Query String**: 쿼리 문자열 무시하고 캐시
- **Ignore Query String**: 쿼리 문자열 완전 무시
- **Standard**: 기본 캐시 동작
- **Aggressive**: 적극적 캐시 (권장)

### 2. Page Rules (페이지 규칙)

#### 정적 파일 캐시 규칙
```
URL: cloop.kro.kr/static/*
설정:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 year
```

#### JavaScript 파일 캐시
```
URL: cloop.kro.kr/*.js
설정:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

#### CSS 파일 캐시
```
URL: cloop.kro.kr/*.css
설정:
- Cache Level: Cache Everything  
- Edge Cache TTL: 1 month
```

#### API 엔드포인트 캐시 제외
```
URL: cloop.kro.kr/api/*
설정:
- Cache Level: Bypass
```

### 3. Cache Purge
캐시 삭제

#### 전체 캐시 삭제
```bash
# CloudFlare 대시보드에서:
Caching 탭 → Configuration → Purge Everything
```

#### 선택적 캐시 삭제
```bash
# 특정 URL 캐시 삭제
Caching 탭 → Configuration → Custom Purge
```

## 자동 설정 스크립트

### 1. 환경 설정

#### .env.cloudflare 파일 생성
```bash
cp .env.cloudflare.example .env.cloudflare
```

#### 필수 정보 입력
```bash
# CloudFlare API 설정
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ZONE_ID=your_zone_id_here
CLOUDFLARE_EMAIL=your_email@example.com

# 도메인 설정
DOMAIN=cloop.kro.kr
WWW_DOMAIN=www.cloop.kro.kr
SERVER_IP=YOUR_SERVER_IP
```

### 2. API 토큰 생성

#### CloudFlare 대시보드에서:
1. 프로필 → API Tokens
2. "Create Token" 클릭
3. "Custom token" 선택
4. 권한 설정:
   - Zone → Zone Settings → Edit
   - Zone → Zone → Read  
   - Zone → DNS → Edit
   - Zone → Page Rules → Edit

### 3. Zone ID 확인

#### CloudFlare 대시보드에서:
1. 도메인 선택
2. 오른쪽 사이드바에서 "Zone ID" 복사

### 4. 스크립트 실행

#### 전체 설정 실행
```bash
# 스크립트 실행 권한 확인
chmod +x setup-cloudflare.sh

# 전체 설정 실행
./setup-cloudflare.sh
```

#### 부분 설정 실행
```bash
# DNS 레코드만 설정
./setup-cloudflare.sh --dns-only

# 보안 설정만 적용
./setup-cloudflare.sh --security

# 성능 설정만 적용  
./setup-cloudflare.sh --performance

# 캐시 규칙만 설정
./setup-cloudflare.sh --cache

# 현재 상태 확인
./setup-cloudflare.sh --status
```

## 모니터링 및 분석

### 1. Analytics 대시보드

#### 트래픽 분석
- **Requests**: 총 요청 수
- **Bandwidth**: 대역폭 사용량
- **Unique Visitors**: 순 방문자 수
- **Page Views**: 페이지 뷰

#### 성능 분석
- **Cache Ratio**: 캐시 적중률
- **Response Time**: 응답 시간
- **Origin Response Time**: 원본 서버 응답 시간

### 2. Security 이벤트

#### 보안 이벤트 모니터링
- **Threats Blocked**: 차단된 위협
- **Challenge Solved**: 해결된 챌린지
- **Bot Traffic**: 봇 트래픽

### 3. Performance Insights

#### Core Web Vitals
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay  
- **CLS**: Cumulative Layout Shift

### 4. Real User Monitoring (RUM)

#### 실제 사용자 성능 데이터
- **Page Load Time**: 페이지 로딩 시간
- **DNS Lookup Time**: DNS 조회 시간
- **Connection Time**: 연결 시간

## 문제 해결

### 1. DNS 전파 지연

#### 증상
- 도메인이 여전히 이전 서버를 가리킴
- "DNS_PROBE_FINISHED_NXDOMAIN" 오류

#### 해결 방법
```bash
# DNS 캐시 플러시 (Windows)
ipconfig /flushdns

# DNS 캐시 플러시 (macOS)
sudo dscacheutil -flushcache

# DNS 캐시 플러시 (Linux)
sudo systemctl flush-dns
```

#### 확인 도구
- [WhatsMyDNS.net](https://www.whatsmydns.net/)
- [DNS Checker](https://dnschecker.org/)

### 2. SSL 인증서 문제

#### 증상
- "Your connection is not private" 오류
- SSL 인증서 만료 경고

#### 해결 방법
1. CloudFlare SSL 모드 확인
2. Origin Certificate 설치 (Full SSL 사용 시)
3. SSL 설정 재확인

#### Origin Certificate 생성
1. SSL/TLS → Origin Server
2. "Create Certificate" 클릭
3. 생성된 인증서를 서버에 설치

### 3. 캐시 관련 문제

#### 증상
- 업데이트된 내용이 반영되지 않음
- 오래된 파일이 계속 로딩됨

#### 해결 방법
```bash
# 캐시 삭제
1. CloudFlare 대시보드 → Caching
2. "Purge Everything" 또는 "Custom Purge"
3. 특정 파일 또는 태그별 삭제
```

#### 개발 모드 활성화
```bash
# 임시로 캐시 비활성화 (3시간)
1. Quick Actions → "Development Mode" 활성화
```

### 4. 성능 문제

#### 증상
- 사이트 로딩 속도 느림
- 높은 Origin 서버 응답 시간

#### 해결 방법
1. **캐시 설정 최적화**
   - Page Rules 재검토
   - Cache Level 조정

2. **압축 설정 확인**
   - Auto Minify 활성화
   - Brotli 압축 활성화

3. **이미지 최적화**
   - Polish 설정 활성화
   - WebP 변환 활성화

### 5. 보안 문제

#### 증상
- 정상 트래픽이 차단됨
- 높은 Challenge Rate

#### 해결 방법
1. **Security Level 조정**
   - High → Medium으로 변경
   - WAF 규칙 검토

2. **IP 허용 목록 설정**
   - 신뢰할 수 있는 IP 추가
   - Bot Fight Mode 예외 설정

### 6. API 오류

#### 증상
- CloudFlare API 호출 실패
- 403 Forbidden 오류

#### 해결 방법
1. **API 토큰 확인**
   - 권한 범위 검토
   - 토큰 만료 확인

2. **Zone ID 확인**
   - 올바른 Zone ID 사용
   - API 호출 URL 검증

#### API 테스트
```bash
# Zone 정보 확인
curl -X GET "https://api.cloudflare.com/client/v4/zones/ZONE_ID" \
     -H "Authorization: Bearer API_TOKEN" \
     -H "Content-Type: application/json"
```

## 마무리

### 설정 완료 후 확인사항

1. **DNS 전파 확인**: 전 세계적으로 DNS가 올바르게 전파되었는지 확인
2. **SSL 인증서**: HTTPS 접속이 정상적으로 작동하는지 확인
3. **캐시 동작**: 정적 파일이 올바르게 캐시되는지 확인
4. **성능 테스트**: PageSpeed Insights, GTmetrix 등으로 성능 측정
5. **보안 테스트**: 정상 트래픽이 차단되지 않는지 확인

### 지속적인 관리

1. **정기적인 모니터링**: Analytics 대시보드 확인
2. **보안 업데이트**: 새로운 위협에 대한 규칙 업데이트
3. **성능 최적화**: 캐시 규칙 및 설정 지속적 개선
4. **백업**: DNS 설정 및 페이지 규칙 정기 백업

### 유용한 링크

- [CloudFlare 대시보드](https://dash.cloudflare.com/)
- [CloudFlare API 문서](https://api.cloudflare.com/)
- [CloudFlare 커뮤니티](https://community.cloudflare.com/)
- [CloudFlare 상태 페이지](https://www.cloudflarestatus.com/)
- [CloudFlare 학습 센터](https://www.cloudflare.com/learning/)

이제 CloudFlare CDN이 Loop Dashboard와 완전히 통합되어, 전 세계 어디서나 빠르고 안전한 접속이 가능합니다! 🌐✨

## 실시간 성능 모니터링

### CloudFlare 상태 모니터링
개발 환경에서 실시간 CDN 성능을 모니터링할 수 있습니다:

```typescript
import { CloudFlareStatus } from './components/ui/CloudFlareStatus';

// App.tsx에서 사용
function App() {
  return (
    <div>
      {/* 앱 컨텐츠 */}
      <CloudFlareStatus />
    </div>
  );
}
```

### 성능 메트릭 수집
```typescript
import CloudFlareOptimizer from './utils/cloudflareOptimizer';

const cfOptimizer = new CloudFlareOptimizer({
  cdnEnabled: true,
  debug: true
});

// 성능 보고서 생성
const report = cfOptimizer.generateReport();
console.log('Performance Metrics:', report.performance);
console.log('Cache Stats:', report.cache);
```

### Service Worker 캐시 통계
Service Worker가 자동으로 캐시 히트/미스를 추적하고 CloudFlare Optimizer에 전달합니다:

- **캐시 히트율**: 캐시된 요청의 비율
- **로드 시간**: 페이지 로딩 시간
- **대역폭 사용량**: 초당 데이터 전송량
- **요청 수**: 총 리소스 요청 수

### 실시간 상태 표시기
개발 모드에서 화면 우하단에 CloudFlare 상태 위젯이 표시됩니다:

- 🟢 **CDN Active**: CloudFlare CDN이 활성화됨
- 📊 **Cache Hit Rate**: 실시간 캐시 적중률
- ⚡ **Load Time**: 페이지 로딩 시간
- 🌐 **Bandwidth**: 네트워크 사용량
