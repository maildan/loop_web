import React, { useCallback, useMemo, useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  type ReleaseAsset = { name: string; url: string };
  const [downloading, setDownloading] = useState(false);

  const client = useMemo(() => {
    const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '').toLowerCase();
    const platform = (typeof navigator !== 'undefined' ? navigator.platform : '' as any)?.toString().toLowerCase() || '';
    const isMac = /mac/.test(platform) || /mac os/.test(ua) || /darwin/.test(ua);
    const isWin = /win/.test(platform) || /windows/.test(ua);
    const isLinux = /linux|x11|ubuntu/.test(platform) || /linux|x11|ubuntu/.test(ua);
    const isArm = /arm|aarch64|apple/.test(ua);
    const isX64 = /x86_64|win64|x64|amd64|intel/.test(ua);
    const arch = isArm ? 'arm64' : isX64 ? 'x64' : 'x64';
    return { isMac, isWin, isLinux, arch: arch as 'arm64' | 'x64' };
  }, []);

  async function fetchLatestRelease(): Promise<{ version: string; assets: ReleaseAsset[] } | null> {
    try {
      const res = await fetch('/api/releases/latest');
      if (res.ok) {
        const data = await res.json();
        return { version: data.version, assets: (data.assets || []).map((a: any) => ({ name: a.name, url: a.url || a.browser_download_url })) };
      }
    } catch {}
    try {
      const gh = await fetch('https://api.github.com/repos/maildan/loop/releases/latest', { headers: { Accept: 'application/vnd.github+json' } });
      if (!gh.ok) return null;
      const data = await gh.json();
      return { version: data.tag_name, assets: (data.assets || []).map((a: any) => ({ name: a.name, url: a.browser_download_url })) };
    } catch {
      return null;
    }
  }

  function buildCombos(os: 'mac' | 'win' | 'linux', arch: 'arm64' | 'x64') {
    const combos: string[][] = [];
    if (os === 'mac') {
      if (arch === 'arm64') combos.push(['mac', 'arm64', 'dmg'], ['mac', 'arm64', 'zip'], ['mac', 'arm64']);
      else combos.push(['mac', 'x64', 'dmg'], ['mac', 'intel', 'dmg'], ['mac', 'x64', 'zip'], ['mac', 'intel', 'zip'], ['mac', 'x64'], ['mac', 'intel']);
      combos.push(['dmg'], ['zip', 'mac'], ['mac']);
    } else if (os === 'win') {
      combos.push(['win', '.exe'], ['windows', '.exe'], ['win', 'x64'], ['windows', 'x64'], ['win', 'zip'], ['windows', 'zip'], ['win']);
    } else {
      combos.push(['linux', 'appimage'], ['linux', 'deb'], ['linux']);
    }
    return combos;
  }

  function selectAsset(assets: ReleaseAsset[], os: 'mac' | 'win' | 'linux', arch: 'arm64' | 'x64') {
    const lower = assets.map(a => ({ ...a, lower: a.name.toLowerCase() }));
    for (const combo of buildCombos(os, arch)) {
      const hit = lower.find(a => combo.every(c => a.lower.includes(c)));
      if (hit) return hit.url;
    }
    return null;
  }

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const data = await fetchLatestRelease();
      if (!data) return;
      const os: 'mac' | 'win' | 'linux' = client.isMac ? 'mac' : client.isWin ? 'win' : 'linux';
      const url = selectAsset(data.assets, os, client.arch) || data.assets[0]?.url;
      if (url) window.open(url, '_blank');
    } finally {
      setDownloading(false);
    }
  }, [client, downloading]);

  return (
    <Section id="home" padding="xl" className="min-h-screen flex items-center">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            쓰고 , 다듬고 ,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              다시
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            작가의 가장 자연스러운 과정을 Loop가 가장 매끄럽게 이어갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3" onClick={handleDownload} disabled={downloading}>
              Loop 다운로드
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              자세히 보기
            </Button>
          </div>

          {/* Platform logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-medium text-muted-foreground">지원 플랫폼:</div>
            <div className="flex flex-wrap justify-center gap-6">
              <span className="text-sm bg-muted px-3 py-1 rounded-full">Windows</span>
              <span className="text-sm bg-muted px-3 py-1 rounded-full">MacOS</span>
              <span className="text-sm bg-muted px-3 py-1 rounded-full">추후 준비 중..</span>
              
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
      </Container>
    </Section>
  );
};
