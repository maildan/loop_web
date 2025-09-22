const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// 보안 헤더 설정
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Gzip 압축 활성화
app.use(compression());

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1y', // 1년 캐싱
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // HTML 파일은 캐싱하지 않음
    if (path.extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    // JS, CSS 파일은 장기 캐싱
    else if (['.js', '.css', '.woff', '.woff2', '.ttf', '.eot'].includes(path.extname(filePath))) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1년
    }
    // 이미지 파일 캐싱
    else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'].includes(path.extname(filePath))) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30일
    }
  }
}));

// SPA 라우팅을 위한 fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 서버 시작
app.listen(PORT, HOST, () => {
  console.log(`🚀 Production server running at http://${HOST}:${PORT}`);
  console.log(`📊 Build size optimization:`);
  console.log(`   - Code splitting: ✅ Enabled`);
  console.log(`   - Gzip compression: ✅ Enabled`);
  console.log(`   - Static caching: ✅ Enabled`);
  console.log(`   - Security headers: ✅ Enabled`);
});

// 우아한 종료 처리
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
