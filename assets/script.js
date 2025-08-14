// 配置区（🚨请替换为您的实际值）
const CONFIG = {
  LIFF_ID: '2007823594-naDVG5p5', // 您的LIFF ID
  GAS_URL: 'https://script.google.com/macros/s/您的GAS部署ID/exec'
};

// 全局变量
let userId = null;

// 初始化LIFF
async function initLiff() {
  try {
    await liff.init({ liffId: CONFIG.LIFF_ID });
    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      const profile = await liff.getProfile();
      userId = profile.userId;
      setupEventListeners();
    }
  } catch (err) {
    console.error('LIFF初始化失败:', err);
    alert('系統初始化失敗，請稍後再試');
  }
}

// 设置事件监听
function setupEventListeners() {
  // 注册表单提交
  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch(CONFIG.GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'register',
          userId: userId,
          data: Object.fromEntries(formData)
        })
      });
      const result = await response.json();
      alert(result.success ? '操作成功！' : `錯誤: ${result.error || '未知錯誤'}`);
    } catch (err) {
      alert('網絡請求失敗');
    }
  });
}

// 启动应用
document.addEventListener('DOMContentLoaded', initLiff);