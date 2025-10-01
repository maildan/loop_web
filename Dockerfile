# 멀티 스테이지 빌드
FROM node:18-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN yarn build

# 프로덕션 스테이지
FROM node:18-alpine AS production

# 작업 디렉터리 설정
WORKDIR /app

# 프로덕션 의존성만 설치
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

# 빌드된 파일과 서버 파일 복사
COPY --from=builder /app/build ./build
COPY server.js ./
COPY ecosystem.config.json ./

# 로그 디렉터리 생성
RUN mkdir -p logs

# 포트 노출
EXPOSE 3001

# 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# 서버 시작
CMD ["node", "server.js"]
