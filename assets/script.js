// LIFF初始化與會員驗證
const LIFF_ID = '2007823594-naDVG5p5';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzDpt-n3G6kUWwBrGmTxCwvuVaOM7ABaMdC_IyoyEOGIUC42PTvSUtnRrPsxOitYtPA/exec';

let profile = null;

async function initLiff() {
  await liff.init({ liffId: LIFF_ID });
  if (!liff.isLoggedIn()) {
    liff.login();
    return false;
  }
  profile = await liff.getProfile();
  return true;
}

async function checkMemberStatus() {
  try {
    const response = await fetch(`${GAS_URL}?action=checkMember&userId=${profile.userId}`);
    return await response.json();
  } catch (error) {
    console.error('檢查會員失敗:', error);
    return { exists: false };
  }
}

async function redirectIfNotMember() {
  const isInitialized = await initLiff();
  if (!isInitialized) return;
  
  const memberStatus = await checkMemberStatus();
  const isRegisterPage = window.location.pathname.includes('register.html');
  
  if (!memberStatus.exists && !isRegisterPage) {
    window.location.href = 'register.html';
  } else if (memberStatus.exists && isRegisterPage) {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('alreadyMember').style.display = 'block';
  }
  
  return memberStatus;
}

// 頁面初始化
document.addEventListener('DOMContentLoaded', async () => {
  await redirectIfNotMember();
  
  // 返回按鈕事件
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => liff.closeWindow());
  }
});
