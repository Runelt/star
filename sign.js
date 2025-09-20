// 회원가입 시 GitHub Issue에 유저 정보 저장
document.getElementById('signup-btn').addEventListener('click', async () => {
    const username = await customPrompt('사용할 아이디를 입력하세요');
    if (!username) return;
    const password = await customPrompt('비밀번호를 입력하세요', true);
    if (!password) return;
    const passwordConfirm = await customPrompt('비밀번호를 다시 입력하세요', true);
    if (!passwordConfirm) return;
    if (password !== passwordConfirm) {
        showCustomAlert('비밀번호가 일치하지 않습니다');
        return;
    }

    // GitHub Issue에 아이디와 비밀번호를 댓글로 저장
    const issueTitle = `회원가입: ${username}`;
    const issueBody = `아이디: ${username}\n비밀번호: ${password}`;

    await createGitHubIssueWithComment(issueTitle, issueBody, username, password);
    showCustomAlert('회원가입 완료! 로그인 해주세요.');
});

// GitHub Issue 생성 함수 (댓글 포함)
async function createGitHubIssueWithComment(title, body, username, password) {
    const repoOwner = 'runelt'; // GitHub 사용자 이름
    const repoName = 'star'; // 레포지토리 이름

    const issueUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    // Issue 생성
    const issueData = {
        title: title,
        body: body,
    };

    const response = await fetch(issueUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(issueData),
    });

    const issue = await response.json();

    if (response.ok) {
        // Issue 생성 성공, 댓글 추가
        const commentUrl = issue.comments_url; // 생성된 Issue의 댓글 URL
        const commentData = {
            body: `아이디: ${username}\n비밀번호: ${password}`, // 댓글로 유저 정보 저장
        };

        // 댓글 추가
        await fetch(commentUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(commentData),
        });

        console.log('Issue와 댓글 생성 성공');
    } else {
        console.error('Failed to create issue', issue);
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
        showCustomAlert(`환영합니다, ${username}님!`, () => location.href = 'index.html');
    } else {
        showCustomAlert('아이디 또는 비밀번호가 틀렸습니다');
    }
});

// GitHub Issue에서 아이디와 비밀번호 확인 함수 (댓글 포함)
async function checkGitHubIssueForLogin(username, password) {
    const repoOwner = 'runelt'; // GitHub 사용자 이름
    const repoName = 'star'; // 레포지토리 이름

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    // 모든 Issue 조회
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    const issues = await response.json();
    if (response.ok) {
        // 모든 이슈를 확인하여 해당 유저 정보가 있는지 체크
        for (let issue of issues) {
            const issueTitle = issue.title;
            const commentsUrl = issue.comments_url; // 댓글 URL

            if (issueTitle.includes(`회원가입: ${username}`)) {
                // 해당 Issue에 댓글을 확인
                const commentsResponse = await fetch(commentsUrl, {
                    method: 'GET',
                    headers: headers,
                });

                const comments = await commentsResponse.json();
                for (let comment of comments) {
                    const commentBody = comment.body;

                    // 댓글에서 아이디와 비밀번호 확인
                    if (commentBody.includes(`아이디: ${username}`) && commentBody.includes(`비밀번호: ${password}`)) {
                        return true; // 로그인 성공
                    }
                }
            }
        }
    } else {
        console.error('Failed to fetch issues', issues);
    }

    return false; // 일치하는 아이디 또는 비밀번호가 없으면
}



