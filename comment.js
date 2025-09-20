// GitHub API 호출 함수 (댓글을 추가하는 부분)
async function sendCommentToGitHub(username, comment) {
    const repoOwner = 'runelt'; // 레포지토리 소유자
    const repoName = 'star'; // 레포지토리 이름
    const issueNumber = '1'; // 댓글을 추가할 이슈 번호 (예시로 1번을 사용)
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}/comments`;

    const githubToken = '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'; // GitHub Personal Access Token

    const commentData = {
        body: `아이디: ${username}\n댓글: ${comment}`
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            console.log('댓글이 GitHub에 성공적으로 추가되었습니다.');
        } else {
            console.error('GitHub API 요청 실패:', response.statusText);
            alert('댓글 추가 실패. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('GitHub API 요청 중 오류 발생:', error);
        alert('GitHub API 요청 중 오류가 발생했습니다.');
    }
}


