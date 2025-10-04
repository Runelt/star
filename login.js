const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = {
    login: document.getElementById('login-tab'),
    admin: document.getElementById('admin-tab'),
    home: document.getElementById('home-tab')
};

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        Object.keys(tabContents).forEach(k => tabContents[k].style.display = 'none');
        tabContents[tab].style.display = 'block';
    });
});

// 기본 관리자 계정
const adminAccount = { username: 'admin', password: 'admin123' };

// Gist URL 확인 필요
const usersGistUrl = 'https://gist.githubusercontent.com/Runelt/7d391bd9279f03ddf247b71c4a3f8f23/raw/dcb863e008245520aa11ceeb43388f2c398b7935/users.json'; 

// 유저 데이터 가져오기
async function fetchUsers() {
    try {
        const response = await fetch(usersGistUrl);
        const data = await response.json();
        console.log(data); // 데이터 구조 확인
        
        // JSON 파일이 'users.json'에 포함된 경우
        const usersJson = JSON.parse(atob(data.files['users.json'].content));  
        console.log(usersJson);  // 제대로 파싱된 JSON 확인
        return usersJson.users;
    } catch (error) {
        console.error('유저 데이터를 가져오는 중 오류 발생:', error);
        return [];
    }
}

// 로그인 처리 함수
async function handleLogin(isAdmin = false) {
    const username = document.getElementById(isAdmin ? 'admin-username' : 'username').value.trim();
    const password = document.getElementById(isAdmin ? 'admin-password' : 'password').value.trim();

    if (isAdmin) {
        // 관리자 로그인
        if (username === adminAccount.username && password === adminAccount.password) {
            localStorage.setItem('currentAdmin', username);
            showCustomAlert('로그인 성공', () => location.href = 'index.html');
        } else {
            showCustomAlert('관리자 아이디 또는 비밀번호가 틀렸습니다');
        }
    } else {
        // 일반 사용자 로그인
        const users = await fetchUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', username);
            showCustomAlert(`환영합니다, ${username}님`, () => location.href = 'index.html');
        } else {
            showCustomAlert('아이디 또는 비밀번호가 틀렸습니다');
        }
    }
}

// 로그인 버튼 이벤트 리스너
document.getElementById('login-btn').addEventListener('click', () => handleLogin(false));  // 일반 로그인
document.getElementById('admin-login-btn').addEventListener('click', () => handleLogin(true));  // 관리자 로그인

// 커스텀 알림창
function showCustomAlert(message, callback) {
    const overlay = document.getElementById('customAlertOverlay');
    const msgElem = document.getElementById('customAlertMessage');
    const inputElem = document.getElementById('customAlertInput');
    const btn = document.getElementById('customAlertBtn');
    msgElem.textContent = message;
    inputElem.style.display = 'none';
    inputElem.value = '';
    overlay.style.display = 'flex';
    btn.onclick = () => {
        overlay.style.display = 'none';
        if (callback) callback();
    };
}

function customPrompt(message, password = false) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customAlertOverlay');
        const msgElem = document.getElementById('customAlertMessage');
        const inputElem = document.getElementById('customAlertInput');
        const btn = document.getElementById('customAlertBtn');
        msgElem.textContent = message;
        inputElem.style.display = 'block';
        inputElem.type = password ? 'password' : 'text';
        inputElem.value = '';
        overlay.style.display = 'flex';
        inputElem.focus();
        btn.onclick = () => {
            overlay.style.display = 'none';
            resolve(inputElem.value.trim());
        };
    });
}

// 회원 가입 알림
document.getElementById('signup').addEventListener('click', async () => {
    const username = showCustomAlert('회원가입은 디스코드로 문의해주세요');
})


