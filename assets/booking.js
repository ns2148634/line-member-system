// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: "2007823594-naDVG5p5" });
  
  // 設置日期選擇器範圍（當天~30天內）
  const dateInput = document.getElementById('bookingDate');
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  dateInput.min = today;
  dateInput.max = maxDate.toISOString().split('T')[0];
  dateInput.value = today;

  // 監聽日期變化
  dateInput.addEventListener('change', loadTimeSlots);
  await loadTimeSlots();
});

// 加載可預約時段
async function loadTimeSlots() {
  const date = document.getElementById('bookingDate').value;
  const profile = await liff.getProfile();
  
  try {
    // 獲取已預約時段
    const bookedSlots = await fetch('您的GAS_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getBookedSlots',
        date: date
      })
    }).then(res => res.json());

    // 生成所有時段（10:30~21:00，每30分鐘）
    const container = document.getElementById('timeSlots');
    container.innerHTML = '';
    
    for (let hour = 10; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // 跳過21:00之後的時段
        if (hour === 21 && minute > 0) continue;
        
        const time = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`;
        const isBooked = bookedSlots.includes(time);

        const slot = document.createElement('div');
        slot.className = `time-slot ${isBooked ? 'booked' : ''}`;
        slot.textContent = time;
        
        if (!isBooked) {
          slot.onclick = () => bookSlot(date, time, profile);
        }
        
        container.appendChild(slot);
      }
    }
  } catch (err) {
    console.error(err);
    alert('加載時段失敗');
  }
}

// 預約時段
async function bookSlot(date, time, profile) {
  if (!confirm(`確認預約 ${date} ${time} 時段？`)) return;

  try {
    const response = await fetch('您的GAS_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createBooking',
        date: date,
        time: time,
        userId: profile.userId,
        name: profile.displayName
      })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('預約成功！');
      loadTimeSlots(); // 刷新時段顯示
    } else {
      alert(result.error || '預約失敗');
    }
  } catch (err) {
    alert('網路錯誤，請重試');
  }
}
