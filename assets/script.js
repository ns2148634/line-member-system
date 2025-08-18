const LIFF_ID = '2007823594-naDVG5p5';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzDpt-n3G6kUWwBrGmTxCwvuVaOM7ABaMdC_IyoyEOGIUC42PTvSUtnRrPsxOitYtPA/exec';

let profile = null;
let memberData = null;

// 初始化LIFF
async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
      liff.login();
      return false;
    }
    profile = await liff.getProfile();
    return true;
  } catch (err) {
    showError('LINE初始化失敗', err);
    return false;
  }
}

// 檢查會員狀態
async function checkMemberStatus() {
  try {
    const response = await fetch(`${GAS_URL}?action=checkMember&userId=${profile.userId}`);
    return await response.json();
  } catch (err) {
    showError('檢查會員失敗', err);
    return { exists: false };
  }
}

// 頁面初始化
async function initPage() {
  showLoading();
  try {
    const isLIFFReady = await initLiff();
    if (!isLIFFReady) return;

    const status = await checkMemberStatus();
    handleMemberStatus(status);
  } finally {
    hideLoading();
  }
}

// 顯示錯誤訊息
function showError(title, error) {
  console.error(title, error);
  alert(`${title}\n${error.message}`);
}

// 載入動畫控制
function showLoading() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  `);
}

function hideLoading() {
  const loader = document.querySelector('.loading-overlay');
  if (loader) loader.remove();
}

// 啟動頁面
document.addEventListener('DOMContentLoaded', initPage);
