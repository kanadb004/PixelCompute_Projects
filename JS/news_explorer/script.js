let allNews = newsData || [];
let displayedCount = 7;
let selectedCategories = new Set(['all']);
let searchTerm = '';
let debounceTimer = null;
const debounceDelay = 300;

let newsGrid;
let searchInput;
let showMoreBtn;
let tagButtons;

function parseDate(dateStr) {
  const [datePart, timePart] = dateStr.split(', ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function sortNewsByDate() {
  allNews.sort((a, b) => {
    const dateA = parseDate(a.dateAndTime);
    const dateB = parseDate(b.dateAndTime);
    return dateB - dateA;
  });
}

function getFilteredNews() {
  let filtered = allNews;

  if (!selectedCategories.has('all')) {
    filtered = filtered.filter((article) =>
      selectedCategories.has(article.category)
    );
  }

  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchTerm(text) {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  return text.replace(
    regex,
    '<span class="search-highlight">$1</span>'
  );
}

function createNewsCard(article, index) {
  const card = document.createElement('article');
  card.className = index < displayedCount ? 'news-card visible' : 'news-card hidden';

  const highlightedTitle = highlightSearchTerm(article.title);
  const highlightedContent = highlightSearchTerm(article.content);

  card.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">${highlightedTitle}</h2>
      <div class="card-date">${article.dateAndTime}</div>
    </div>
    <div class="card-content">
      <p class="card-text">${highlightedContent}</p>
    </div>
  `;

  return card;
}

function updateShowMoreButton(filteredCount) {
  if (displayedCount >= filteredCount) {
    showMoreBtn.classList.add('hidden');
  } else {
    showMoreBtn.classList.remove('hidden');
  }
}

function updateTagButtons() {
  tagButtons.forEach((btn) => {
    const category = btn.dataset.category;
    if (selectedCategories.has(category)) {
      btn.classList.add('tag-active');
    } else {
      btn.classList.remove('tag-active');
    }
  });
}

function render() {
  const filtered = getFilteredNews();

  newsGrid.innerHTML = '';

  if (filtered.length === 0) {
    newsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No articles found.</p>';
    showMoreBtn.classList.add('hidden');
    return;
  }

  filtered.forEach((article, index) => {
    const card = createNewsCard(article, index);
    newsGrid.appendChild(card);
  });

  updateShowMoreButton(filtered.length);
}

function handleSearch(e) {
  searchTerm = e.target.value;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayedCount = 7;
    render();
  }, debounceDelay);
}

function handleShowMore() {
  const filtered = getFilteredNews();
  displayedCount = filtered.length;
  render();
}

function handleTagClick(e) {
  const category = e.target.dataset.category;

  if (category === 'all') {
    selectedCategories.clear();
    selectedCategories.add('all');
  } else {
    selectedCategories.delete('all');
    selectedCategories.has(category)
      ? selectedCategories.delete(category)
      : selectedCategories.add(category);

    if (selectedCategories.size === 0) {
      selectedCategories.add('all');
    }
  }

  displayedCount = 7;
  updateTagButtons();
  render();
}

function initializeDOM() {
  newsGrid = document.getElementById('newsGrid');
  searchInput = document.getElementById('searchInput');
  showMoreBtn = document.getElementById('showMoreBtn');
  tagButtons = document.querySelectorAll('.tag-button');
}

function attachEventListeners() {
  searchInput.addEventListener('input', handleSearch);
  showMoreBtn.addEventListener('click', handleShowMore);
  tagButtons.forEach((btn) => {
    btn.addEventListener('click', handleTagClick);
  });
}

function initializeApp() {
  initializeDOM();
  attachEventListeners();
  sortNewsByDate();
  render();
}

document.addEventListener('DOMContentLoaded', initializeApp);
