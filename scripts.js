// scripts.js

const API_BASE_URL = "https://leaf-sense-api-716993595320.asia-southeast2.run.app";

const articleForm = document.getElementById('article-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const plantTypeInput = document.getElementById('plant-type');
const imageInput = document.getElementById('image');
const articlesList = document.getElementById('articles-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let editIndex = null;
let editId = null;

// Fetch all articles from the API
async function fetchArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        console.log('Fetched articles:', data); // Debugging
        renderArticles(data.data); // Access the `data` property containing the articles array
    } catch (error) {
        console.error(error);
    }
}

// Render articles in the DOM
function renderArticles(articles) {
    articlesList.innerHTML = '';
    if (!Array.isArray(articles)) {
        console.error('Expected an array but got:', articles);
        return;
    }

    articles.forEach((article) => {
        console.log('Article data:', article);
        const articleItem = document.createElement('div');
        articleItem.className = 'article-item';

        const imageUrl = article.imageUrl || 'default-image.jpg'; // Fallback if no image
        articleItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <p><strong>Plant Type:</strong> ${article.plantType}</p>
            <img src="${imageUrl}" alt="${article.title}" style="max-width: 200px; display: block;">
            <div class="article-actions">
                <button onclick="editArticle(${JSON.stringify(article).replace(/"/g, '&quot;')})">Edit</button>
                <button onclick="deleteArticle('${article.id}')">Hapus</button>
            </div>
        `;

        articlesList.appendChild(articleItem);
    });
}

// Add or update article
async function submitArticle(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('content', contentInput.value);
    formData.append('plantType', plantTypeInput.value);
    formData.append('image', imageInput.files[0]);

    try {
        const url = editId ? `${API_BASE_URL}/articles/${editId}` : `${API_BASE_URL}/articles`;
        const method = editId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            body: formData,
        });

        if (!response.ok) throw new Error(`Failed to ${editId ? 'update' : 'add'} article`);
        resetForm();
        fetchArticles();
    } catch (error) {
        console.error(error);
    }
}

// Edit article
function editArticle(article) {
    titleInput.value = article.title;
    contentInput.value = article.content;
    plantTypeInput.value = article.plantType;

    formTitle.textContent = 'Edit Artikel';
    submitBtn.textContent = 'Update';
    cancelBtn.style.display = 'inline';

    editId = article.id;
}

// Delete article
async function deleteArticle(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete article');
        fetchArticles();
    } catch (error) {
        console.error(error);
    }
}

// Reset the form
function resetForm() {
    articleForm.reset();
    formTitle.textContent = 'Tambah Artikel';
    submitBtn.textContent = 'Tambah';
    cancelBtn.style.display = 'none';
    editId = null;
}

articleForm.addEventListener('submit', submitArticle);
cancelBtn.addEventListener('click', resetForm);

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

fetchArticles();