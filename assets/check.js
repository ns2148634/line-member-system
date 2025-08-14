// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: "2007823594-naDVG5p5" });
  loadMyBookings();
});

// 載入預約記錄
async function loadMyBookings() {
  try {
    const profile = await liff.getProfile();
    const response = await fetch('您的GAS_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getMyBookings',
        userId: profile.userId
      })
    });
    
    const data = await response.json();
    displayBookings(data.bookings);
  } catch (err) {
    console.error(err);
    document.getElementById('bookingList').innerHTML = 
      '<p>載入失敗，請稍後再試</p>';
  }
}

// 顯示預約記錄
function displayBookings(bookings) {
  const container = document.getElementById('bookingList');
  
  if (bookings.length === 0) {
    container.innerHTML = '<p>您尚未有任何預約</p>';
    return;
  }

  container.innerHTML = bookings.map(booking => `
    <div class="booking-card">
      <p><strong>日期：</strong>${booking.date}</p>
      <p><strong>時段：</strong>${booking.time}</p>
      <p><strong>狀態：</strong>${booking.status}</p>
      <button class="cancel-btn" 
              onclick="cancelBooking('${booking.id}')">
        取消預約
      </button>
    </div>
  `).join('');
}

// 取消預約
async function cancelBooking(bookingId) {
  if (!confirm('確定要取消此預約嗎？')) return;

  try {
    const response = await fetch('您的GAS_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'cancelBooking',
        bookingId: bookingId
      })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('已取消預約');
      loadMyBookings(); // 刷新列表
    } else {
      alert(result.error || '取消失敗');
    }
  } catch (err) {
    alert('網路錯誤，請重試');
  }
}
