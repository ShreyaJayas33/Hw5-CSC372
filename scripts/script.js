const GITHUB_TOKEN = window.GITHUB_TOKEN;

const repoGallery = document.getElementById('repo-gallery');
const usernameInput = document.getElementById('username');

async function fetchRepos(username = 'ShreyaJayas33') {
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=20&sort=updated`;

    const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json'
    };

    try {
        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error('User not found or rate limit exceeded');

        const repos = await response.json();
        displayRepos(repos);
    } catch (error) {
        repoGallery.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function displayRepos(repos) {
    repoGallery.innerHTML = '';
    for (const repo of repos) {
        const repoUrl = repo.html_url;
        const createdAt = new Date(repo.created_at).toLocaleDateString();
        const updatedAt = new Date(repo.updated_at).toLocaleDateString();
        const languages = await fetchLanguages(repo.languages_url);
        const commits = await fetchCommits(repo.commits_url.replace('{/sha}', ''));

        const repoCard = `
        <div class="repo-card">
            <h3>
                <a href="${repoUrl}" target="_blank">
                    <img src="gitlogo.png" alt="GitHub Logo" width="20" height="20" style="margin-right: 8px;"> 
                    ${repo.name}
                </a>
            </h3>
            <p>${repo.description || 'No description'}</p>
            <p><strong>Created:</strong> ${createdAt}</p>
            <p><strong>Updated:</strong> ${updatedAt}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Commits:</strong> ${commits}</p>
            <p><strong>Watchers:</strong> ${repo.watchers}</p>
        </div>
    `;
    
        repoGallery.innerHTML += repoCard;
    }
}

async function fetchLanguages(url) {
    try {
        const response = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
        const data = await response.json();
        return Object.keys(data).join(', ') || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

async function fetchCommits(url) {
    try {
        const response = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
        const commits = await response.json();
        return commits.length || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

// Load default profile on page load
document.addEventListener('DOMContentLoaded', () => fetchRepos());

// Handle Enter key search
usernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && usernameInput.value.trim() !== '') {
        fetchRepos(usernameInput.value.trim());
    }
});