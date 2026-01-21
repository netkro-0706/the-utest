// Honeypot 필드 감지 및 제출 버튼 비활성화
const honeypotField = document.getElementById('website');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const form = document.getElementById('uniForm');

honeypotField.addEventListener('input', function () {
  if (this.value.trim() !== '') {
    // honeypot 필드에 값이 입력되면 제출 버튼 비활성화
    submitBtn.disabled = true;
  } else {
    // 값이 비어있으면 제출 버튼 활성화
    submitBtn.disabled = false;
  }
});

// Other 라디오 버튼 선택 시 텍스트 입력 필드 표시/숨김
const otherReasonRadio = document.getElementById('returnReasonOther');
const otherReasonInput = document.getElementById('otherReasonInput');
const otherReasonText = document.getElementById('otherReasonText');
const returnReasonRadios = form.querySelectorAll('input[name="returnReason"]');

returnReasonRadios.forEach((radio) => {
  radio.addEventListener('change', function () {
    if (this.value === 'other') {
      otherReasonInput.style.display = 'block';
      otherReasonText.required = true;
    } else {
      otherReasonInput.style.display = 'none';
      otherReasonText.required = false;
      otherReasonText.value = '';
    }
  });
});

// Clear 버튼 클릭 시 폼 전체 초기화
clearBtn.addEventListener('click', function () {
  form.reset();
  // 라디오 버튼과 체크박스도 명시적으로 초기화
  const radioButtons = form.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.checked = false;
  });
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  // Other 텍스트 입력 필드 숨김
  otherReasonInput.style.display = 'none';
  otherReasonText.required = false;
});

// 폼 제출 처리
document.getElementById('uniForm').addEventListener('submit', function (e) {
  // honeypot 필드에 값이 있으면 제출 방지
  if (honeypotField.value.trim() !== '') {
    e.preventDefault();
    alert('Spam detected. Submission is not allowed.');
    return false;
  }

  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  // honeypot 필드는 출력에서 제외
  delete data.website;
  console.log('Form submitted:', data);
  alert('Form submitted! Please check the console.');
});
