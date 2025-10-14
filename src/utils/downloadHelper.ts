// Robust download helper for GitHub Releases
export type ReleaseAsset = {
  name: string;
  url: string;
  size?: number;
  content_type?: string;
};

export type ReleaseData = {
  version: string;
  assets: ReleaseAsset[];
};

export type DetectedPlatform = {
  os: 'windows' | 'macos' | 'linux' | 'unknown';
  arch: 'arm64' | 'x64' | 'unknown';
};

/**
 * Detect user's OS and architecture from browser
 */
export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === 'undefined') {
    return { os: 'unknown', arch: 'unknown' };
  }

  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || '').toLowerCase();

  // Detect OS
  let os: DetectedPlatform['os'] = 'unknown';
  if (/win/.test(platform) || /windows/.test(ua)) {
    os = 'windows';
  } else if (/mac/.test(platform) || /macintosh|mac os x|darwin/.test(ua)) {
    os = 'macos';
  } else if (/linux/.test(platform) || /linux|x11|ubuntu|debian/.test(ua)) {
    os = 'linux';
  }

  // Detect architecture
  let arch: DetectedPlatform['arch'] = 'unknown';
  
  // Check for ARM (Apple Silicon, ARM64)
  if (/arm64|aarch64/.test(ua) || (/mac/.test(platform) && /apple/.test(ua))) {
    arch = 'arm64';
  }
  // Check for x64/x86_64
  else if (/x86_64|x64|amd64|win64|wow64/.test(ua) || /intel/.test(ua)) {
    arch = 'x64';
  }
  // Default to x64 for desktop platforms
  else if (os === 'windows' || os === 'macos' || os === 'linux') {
    arch = 'x64';
  }

  console.log('[downloadHelper] Detected platform:', { os, arch, ua: navigator.userAgent });
  return { os, arch };
}

/**
 * Fetch latest release from server proxy or GitHub API
 */
export async function fetchLatestRelease(): Promise<ReleaseData | null> {
  // Try server proxy first
  try {
    const res = await fetch('/api/releases/latest');
    if (res.ok) {
      const data = await res.json();
      console.log('[downloadHelper] Fetched from proxy:', data);
      return {
        version: data.version,
        assets: (data.assets || []).map((a: any) => ({
          name: a.name,
          url: a.url || a.browser_download_url,
          size: a.size,
          content_type: a.content_type
        }))
      };
    }
  } catch (e) {
    console.warn('[downloadHelper] Proxy failed:', e);
  }

  // Fallback to GitHub API
  try {
    const gh = await fetch('https://api.github.com/repos/maildan/loop/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!gh.ok) {
      console.error('[downloadHelper] GitHub API failed:', gh.status);
      return null;
    }
    const data = await gh.json();
    console.log('[downloadHelper] Fetched from GitHub:', data);
    return {
      version: data.tag_name,
      assets: (data.assets || []).map((a: any) => ({
        name: a.name,
        url: a.browser_download_url,
        size: a.size,
        content_type: a.content_type
      }))
    };
  } catch (e) {
    console.error('[downloadHelper] GitHub API error:', e);
    return null;
  }
}

/**
 * Select best asset for given platform
 * Priority: dmg > exe > AppImage > zip (as fallback)
 */
export function selectAssetForPlatform(
  assets: ReleaseAsset[],
  platform: DetectedPlatform
): string | null {
  if (!assets || assets.length === 0) {
    console.warn('[downloadHelper] No assets available');
    return null;
  }

  console.log('[downloadHelper] Selecting asset for:', platform);
  console.log('[downloadHelper] Available assets:', assets.map(a => a.name));

  const lowerAssets = assets.map(a => ({
    ...a,
    lower: a.name.toLowerCase()
  }));

  // Define priority patterns per platform
  const patterns: string[][] = [];

  if (platform.os === 'macos') {
    // macOS: prioritize DMG, then ZIP
    if (platform.arch === 'arm64') {
      patterns.push(
        ['mac', 'arm64', '.dmg'],
        ['mac', 'arm', '.dmg'],
        ['macos', 'arm64', '.dmg'],
        ['.dmg', 'arm64'],
        ['.dmg', 'mac'],
        ['mac', 'arm64', '.zip'],
        ['mac', 'arm', '.zip'],
        ['.zip', 'arm64', 'mac'],
        ['.zip', 'mac']
      );
    } else {
      patterns.push(
        ['mac', 'x64', '.dmg'],
        ['mac', 'intel', '.dmg'],
        ['macos', 'x64', '.dmg'],
        ['.dmg', 'x64'],
        ['.dmg', 'mac'],
        ['mac', 'x64', '.zip'],
        ['mac', 'intel', '.zip'],
        ['.zip', 'x64', 'mac'],
        ['.zip', 'mac']
      );
    }
  } else if (platform.os === 'windows') {
    // Windows: prioritize Setup EXE first, then regular EXE, then ZIP
    patterns.push(
      ['web', 'setup', '.exe'],
      ['setup', '.exe'],
      ['-setup-', '.exe'],
      ['win', 'setup', '.exe'],
      ['windows', 'setup', '.exe'],
      ['win', '.exe'],
      ['windows', '.exe'],
      ['.exe'],
      ['win', 'x64', '.zip'],
      ['windows', 'x64', '.zip'],
      ['.zip', 'win'],
      ['.zip', 'windows']
    );
  } else if (platform.os === 'linux') {
    // Linux: prioritize AppImage, then deb
    patterns.push(
      ['.appimage'],
      ['linux', '.appimage'],
      ['.deb'],
      ['linux', '.deb'],
      ['.tar.gz', 'linux'],
      ['.zip', 'linux']
    );
  }

  // Try each pattern in order
  for (const pattern of patterns) {
    const match = lowerAssets.find(a =>
      pattern.every(token => a.lower.includes(token))
    );
    if (match) {
      console.log('[downloadHelper] Selected asset:', match.name, 'for pattern:', pattern);
      return match.url;
    }
  }

  // Fallback: return first asset
  console.warn('[downloadHelper] No matching asset, using first:', assets[0]?.name);
  return assets[0]?.url || null;
}

/**
 * Main download function: detect platform, fetch release, select asset, open download
 */
export async function downloadLatestRelease(): Promise<boolean> {
  const platform = detectPlatform();
  
  if (platform.os === 'unknown') {
    console.error('[downloadHelper] Could not detect OS');
    alert('죄송합니다. 운영체제를 감지할 수 없습니다. 다운로드 페이지에서 수동으로 선택해주세요.');
    return false;
  }

  const release = await fetchLatestRelease();
  if (!release) {
    console.error('[downloadHelper] Could not fetch release');
    alert('최신 버전을 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
    return false;
  }

  const assetUrl = selectAssetForPlatform(release.assets, platform);
  if (!assetUrl) {
    console.error('[downloadHelper] No suitable asset found');
    alert('적합한 다운로드 파일을 찾을 수 없습니다. 다운로드 페이지를 확인해주세요.');
    return false;
  }

  console.log('[downloadHelper] Opening download:', assetUrl);
  window.open(assetUrl, '_blank');
  return true;
}
