function resetform() {
    window.location.reload();
  }

document.getElementById('fetch-posts').addEventListener('click', displayData);

async function fetchUserData() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return await response.json();
}

async function fetchPostData() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch post data');
    }
    return await response.json();
}

async function fetchComments(postId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch comments');
    }
    return await response.json();
}

async function displayData() {
    const postsContainer = document.getElementById('posts-container');
    const loadingIndicator = document.getElementById('loading');
    const errorIndicator = document.getElementById('error');

    postsContainer.innerHTML = '';
    loadingIndicator.style.display = 'block';
    errorIndicator.textContent = '';

    try {
        const [users, posts] = await Promise.all([fetchUserData(), fetchPostData()]);

        const userMap = new Map();
        users.forEach(user => userMap.set(user.id, user));

        loadingIndicator.style.display = 'none';

        posts.forEach(post => {
            const user = userMap.get(post.userId);
            const postContent = document.createElement('div');
            postContent.className = 'post-container';
            postContent.innerHTML = `
            <br>    
            <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>User:</strong> ${user.name}</p>
                <p><strong>Email:</strong>${user.email}</p>
            `;
            postContent.addEventListener('click', () => displayPostDetails(post.id, postContent));
            postsContainer.appendChild(postContent);
        });
    } catch (error) {
        loadingIndicator.style.display = 'none';
        errorIndicator.textContent = error.message;
    }
}

async function displayPostDetails(postId, postElement) {
    const comments = await fetchComments(postId);
    let commentsHTML = '<div class="comments"><h3>Comments:</h3>';
    comments.forEach(comment => {
        commentsHTML += `
            <div class="comment">
                <p><strong>${comment.name}</strong> (${comment.email})</p>
                <p>${comment.body}</p>
            </div>
        `;
    });
    commentsHTML += '</div>';
    postElement.innerHTML += commentsHTML;
    postElement.removeEventListener('click', () => displayPostDetails(postId, postElement));
}

