const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

// Simple in-memory cache for GitHub releases
let latestReleaseCache = { data: null, ts: 0 };
const RELEASE_CACHE_MS = 10 * 60 * 1000; // 10 minutes

// 보안 헤더 설정
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com"]
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

// Latest GitHub release proxy (caches for 10 minutes)
app.get('/api/releases/latest', async (req, res) => {
  try {
    const now = Date.now();
    if (latestReleaseCache.data && now - latestReleaseCache.ts < RELEASE_CACHE_MS) {
      res.set('Cache-Control', 'public, max-age=300');
      return res.status(200).json(latestReleaseCache.data);
    }

    const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'loop-web' };
    if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;

    const fetchFn = typeof fetch === 'function' ? fetch : (await import('node-fetch')).default;
    const ghRes = await fetchFn('https://api.github.com/repos/maildan/loop/releases/latest', { headers });
    if (!ghRes.ok) {
      return res.status(ghRes.status).json({ error: 'Failed to fetch latest release' });
    }
    const data = await ghRes.json();
    const simplified = {
      version: data.tag_name,
      name: data.name,
      notes: data.body || '',
      published_at: data.published_at,
      assets: Array.isArray(data.assets) ? data.assets.map(a => ({
        name: a.name,
        url: a.browser_download_url,
        size: a.size,
        content_type: a.content_type
      })) : []
    };
    latestReleaseCache = { data: simplified, ts: now };
    res.set('Cache-Control', 'public, max-age=300');
    return res.status(200).json(simplified);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch latest release' });
  }
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
