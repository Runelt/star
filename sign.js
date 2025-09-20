// 회원가입 시 GitHub Issue에 유저 정보 저장
document.getElementById('signup-btn').addEventListener('click', async () => {
    const username = await customPrompt('사용할 아이디를 입력하세요');
    if(!username) return;
    const password = await customPrompt('비밀번호를 입력하세요', true);
    if(!password) return;
    const passwordConfirm = await customPrompt('비밀번호를 다시 입력하세요', true);
    if(!passwordConfirm) return;
    if(password !== passwordConfirm){
        showCustomAlert('비밀번호가 일치하지 않습니다');
        return;
    }

    // GitHub Issue에 아이디와 비밀번호 저장
    const issueTitle = `회원가입: ${username}`;
    const issueBody = `아이디: ${username}\n비밀번호: ${password}`;

    await createGitHubIssue(issueTitle, issueBody);
    showCustomAlert('회원가입 완료! 로그인 해주세요.');
});

// GitHub Issue 생성 함수
async function createGitHubIssue(title, body) {
    const token = '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'; // 여기 자신의 GitHub Personal Access Token 입력
    const repoOwner = 'runelt'; // GitHub 사용자 이름
    const repoName = 'star'; // 레포지토리 이름 (여기서는 Issue를 생성할 레포지토리)
    const issueNumber = '1';

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumner}/idpasses`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    const data = {
        title: title,
        body: body,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
        console.log('Issue created successfully', result);
    } else {
        console.error('Failed to create issue', result);
    }
}

// 로그인 시 GitHub Issue에서 유저 정보 확인
document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // GitHub Issue에서 해당 아이디와 비밀번호 확인
    const isValid = await checkGitHubIssueForLogin(username, password);
    if (isValid) {
        localStorage.setItem('currentUser', username);
        showCustomAlert(`환영합니다, ${username}님!`, () => location.href='index.html');
    } else {
        showCustomAlert('아이디 또는 비밀번호가 틀렸습니다');
    }
});

// GitHub Issue에서 아이디와 비밀번호 확인 함수
async function checkGitHubIssueForLogin(username, password) {
    const token = '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'; // 자신의 GitHub Personal Access Token 입력
    const repoOwner = 'runelt'; // GitHub 사용자 이름
    const repoName = 'star'; // 레포지토리 이름 (여기서는 Issue를 확인할 레포지토리)

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    const issues = await response.json();
    if (response.ok) {
        // 모든 이슈를 확인하여 사용자 정보가 있는지 체크
        for (let issue of issues) {
            const issueTitle = issue.title;
            const issueBody = issue.body;

            if (issueTitle.includes(`회원가입: ${username}`) && issueBody.includes(`아이디: ${username}`) && issueBody.includes(`비밀번호: ${password}`)) {
                return true; // 아이디와 비밀번호가 맞는 경우
            }
        }
    } else {
        console.error('Failed to fetch issues', issues);
    }

    return false; // 일치하는 아이디 또는 비밀번호가 없으면
}

