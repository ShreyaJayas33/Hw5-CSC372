/*
  Name: Shreya Jayas
  Date: 03/20/2025
  CSC 372-01

  This script fetches repository data from the GitHub API and dynamically 
  generates a gallery of repositories based on the user's input.
*/

if (typeof GITHUB_TOKEN === 'undefined') {
    const GITHUB_TOKEN = window.GITHUB_TOKEN;
}

const repoGallery = document.getElementById('repo-gallery');
const usernameInput = document.getElementById('username');
const searchButton = document.getElementById('searchButton');

/**
 * Fetches repositories from GitHub API based on the username.
 * @param {string} username - GitHub username.
 */
async function fetchRepos(username = 'ShreyaJayas33') {
    username = username.trim() || 'ShreyaJayas33'; // Ensure a valid username

    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=20&sort=updated`;

    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } : {};

    try {
        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const repos = await response.json();
        displayRepos(repos);
    } catch (error) {
        repoGallery.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

/**
 * Displays repository data in the gallery.
 * @param {Array} repos - List of repository objects.
 */
async function displayRepos(repos) {
    repoGallery.innerHTML = ''; // Clear previous results

    if (repos.length === 0) {
        repoGallery.innerHTML = '<p class="error">No repositories found.</p>';
        return;
    }

    for (const repo of repos) {
        const repoUrl = repo.html_url;
        const createdAt = new Date(repo.created_at).toLocaleDateString();
        const updatedAt = new Date(repo.updated_at).toLocaleDateString();
        const languages = await fetchLanguages(repo.languages_url);
        const commits = await fetchCommits(repo.commits_url.replace('{/sha}', ''));

        // Create repository card
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        // Repository Title with GitHub Icon
        const repoTitle = document.createElement('h3');
        const repoLink = document.createElement('a');
        repoLink.href = repoUrl;
        repoLink.target = "_blank";
        repoLink.innerHTML = `<img src="gitlogo.png" alt="GitHub Logo" width="20" height="20" style="margin-right: 8px;"> ${repo.name}`;
        repoTitle.appendChild(repoLink);

        // Repository Details
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

        // Append all elements to the card
        repoCard.append(repoTitle, description, createdDate, updatedDate, languagesInfo, commitsInfo, watchersInfo);

        // Append the card to the gallery
        repoGallery.appendChild(repoCard);
    }
}

/**
 * Fetches languages used in a repository.
 * @param {string} url - API URL for repository languages.
 */
async function fetchLanguages(url) {
    try {
        const response = await fetch(url, { headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {} });
        const data = await response.json();
        return Object.keys(data).join(', ') || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

/**
 * Fetches the number of commits in a repository.
 * @param {string} url - API URL for repository commits.
 */
async function fetchCommits(url) {
    try {
        const response = await fetch(url, { headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {} });
        const commits = await response.json();
        return commits.length || 'Unknown';
    } catch {
        return 'Unknown';
    }
}

// Load default profile on page load
document.addEventListener('DOMContentLoaded', () => fetchRepos());

// Handle search button click
searchButton.addEventListener('click', () => {
    fetchRepos(usernameInput.value.trim());
});

// Handle Enter key search
usernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchRepos(usernameInput.value.trim());
    }
});
