/**
 * 인증 관련 서비스
 */

// 로그아웃 처리 함수
export const logout = (): void => {
  // 1. 로컬 스토리지의 인증 토큰 제거
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // 2. 쿠키 제거 (만약 쿠키를 사용하는 경우)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });

  // 3. 로그인 페이지로 리다이렉트
  window.location.href = '/login';
};
