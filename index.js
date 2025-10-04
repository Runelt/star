const loginBtn = document.getElementById('login-page-btn');

function updateLoginBtn() {
    const currentUser = localStorage.getItem('currentUser');
    const currentAdmin = localStorage.getItem('currentAdmin');
    loginBtn.textContent = (currentUser || currentAdmin) ? '로그아웃' : '로그인';
}
updateLoginBtn();

loginBtn.addEventListener('click', () => {
    const currentUser = localStorage.getItem('currentUser');
    const currentAdmin = localStorage.getItem('currentAdmin');
    if (currentUser || currentAdmin) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentAdmin');
        showCustomAlert('로그아웃 되었습니다');
        updateLoginBtn();
    } else {
        window.location.href = 'login.html';
    }
});

document.getElementById('board-btn').addEventListener('click', () => {
    window.location.href = 'n.txt'
});

function showCustomAlert(msg) {
    document.getElementById('customAlertMessage').textContent = msg;
    document.getElementById('customAlertOverlay').style.display = 'flex';
}