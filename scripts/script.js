/*
  Name: Shreya Jayas
  Date: 03/20/2025
  CSC 372-01

  This script fetches repository data from the GitHub API and dynamically 
  generates a gallery of repositories based on the user's input.
*/

const repoGallery = document.getElementById('repo-gallery');
const usernameInput = document.getElementById('username');

async function fetchRepos(username) {
    if (!username) {
        username = usernameInput.value.trim(); // Get input from search field
    }
    if (!username) {
        username = 'ShreyaJayas33'; // Default username
    }

    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=20&sort=updated`;

    try {
        const response = await fetch(apiUrl);
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

        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        const repoTitle = document.createElement('h3');
        const repoLink = document.createElement('a');
        repoLink.href = repoUrl;
        repoLink.target = "_blank";
        repoLink.innerHTML = `<img src="gitlogo.png" alt="GitHub Logo" width="20" height="20" style="margin-right: 8px;"> ${repo.name}`;
        repoTitle.appendChild(repoLink);

        const description = document.createElement('p');
        description.textContent = repo.description || 'No description';

        const createdDate = document.createElement('p');
        createdDate.innerHTML = `<strong>Created:</strong> ${createdAt}`;

        const updatedDate = document.createElement('p');
        updatedDate.innerHTML = `<strong>Updated:</strong> ${updatedAt}`;

        const languagesInfo = document.createElement('p');
        languagesInfo.innerHTML = `<strong>Languages:</strong> ${languages}`;

        const commitsInfo = document.createElement('p');
        commitsInfo.innerHTML = `<strong>Commits:</strong> ${commits}`;

        const watchersInfo = document.createElement('p');
        watchersInfo.innerHTML = `<strong>Watchers:</strong> ${repo.watchers}`;

        repoCard.appendChild(repoTitle);
        repoCard.appendChild(description);
        repoCard.appendChild(createdDate);
        repoCard.appendChild(updatedDate);
        repoCard.appendChild(languagesInfo);
        repoCard.appendChild(commitsInfo);
        repoCard.appendChild(watchersInfo);

        repoGallery.appendChild(repoCard);
    }
}

async function fetchLanguages(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return Object.keys(data).join(', ') || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

async function fetchCommits(url) {
    try {
        const response = await fetch(url);
        const commits = await response.json();
        return commits.length || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

// Load default profile on page load
document.addEventListener('DOMContentLoaded', () => fetchRepos('ShreyaJayas33'));

// Handle search button click
document.getElementById('searchButton').addEventListener('click', () => {
    fetchRepos(usernameInput.value.trim());
});

// Handle Enter key search
usernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && usernameInput.value.trim() !== '') {
        fetchRepos(usernameInput.value.trim());
    }
});
