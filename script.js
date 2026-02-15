/**
 * ULTIMATE KNOWLEDGE QUIZ - Main Application Logic
 * Handles: category selection, name entry, quiz flow, timer, results, leaderboard
 * No frameworks - vanilla JavaScript only.
 */

// ========== STATE ==========
let chosenCategory = null;       // e.g. 'science', 'mixed'
let chosenCategoryLabel = '';   // Display name e.g. 'Science'
let playerName = '';
let currentQuestions = [];      // Array of question objects for this round (shuffled, 10 per game)
let currentQuestionIndex = 0;
let score = 0;
let quizStartTime = 0;          // Date.now() when quiz starts (for time-taken display)
let answered = false;

// DOM element refs (set once on load)
let elements = {};

// Category key -> display label
const CATEGORY_LABELS = {
    science: 'Science',
    mathematics: 'Mathematics',
    computer: 'Computer',
    english: 'English',
    socialStudies: 'Social Studies',
    football: 'Football',
    cricket: 'Cricket',
    basketball: 'Basketball',
    olympics: 'Olympics',
    sportsGeneral: 'Sports General',
    nepal: 'Nepal',
    nepalHistory: "Nepal's History",
    nepalGeography: 'Nepal Geography',
    nepalCulture: 'Nepal Culture',
    nepalFestivals: 'Nepal Festivals',
    geography: 'Geography',
    literature: 'Literature',
    music: 'Music',
    worldHistory: 'World History',
    artMovies: 'Art & Movies',
    nature: 'Nature',
    space: 'Space',
    general: 'General Knowledge',
    currentAffairs: 'Current Affairs',
    mixed: 'Mixed Challenge'
};

// ========== DARK MODE ==========
const THEME_KEY = 'ultimateQuizTheme';

function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    cacheElements();
    bindEvents();
    renderLeaderboardTable('all'); // So leaderboard is ready when opened
});

/** Store frequently used DOM elements for easier access */
function cacheElements() {
    elements = {
        homeScreen: document.getElementById('homeScreen'),
        nameScreen: document.getElementById('nameScreen'),
        quizScreen: document.getElementById('quizScreen'),
        resultScreen: document.getElementById('resultScreen'),
        leaderboardScreen: document.getElementById('leaderboardScreen'),
        playerNameInput: document.getElementById('playerNameInput'),
        chosenCategoryName: document.getElementById('chosenCategoryName'),
        startQuizBtn: document.getElementById('startQuizBtn'),
        backFromNameBtn: document.getElementById('backFromNameBtn'),
        quizPlayerName: document.getElementById('quizPlayerName'),
        quizCategoryName: document.getElementById('quizCategoryName'),
        currentQuestionNum: document.getElementById('currentQuestionNum'),
        totalQuestions: document.getElementById('totalQuestions'),
        quizScore: document.getElementById('quizScore'),
        progressBar: document.getElementById('progressBar'),
        resultTimeTaken: document.getElementById('resultTimeTaken'),
        questionText: document.getElementById('questionText'),
        optionsContainer: document.getElementById('optionsContainer'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        resultPlayerName: document.getElementById('resultPlayerName'),
        resultCategoryName: document.getElementById('resultCategoryName'),
        resultScore: document.getElementById('resultScore'),
        resultTotal: document.getElementById('resultTotal'),
        resultPercent: document.getElementById('resultPercent'),
        motivationalMessage: document.getElementById('motivationalMessage'),
        playAgainBtn: document.getElementById('playAgainBtn'),
        changeCategoryBtn: document.getElementById('changeCategoryBtn'),
        viewLeaderboardBtn: document.getElementById('viewLeaderboardBtn'),
        leaderboardBody: document.getElementById('leaderboardBody'),
        noScoresMsg: document.getElementById('noScoresMsg'),
        leaderboardBackBtn: document.getElementById('leaderboardBackBtn'),
        clearLeaderboardBtn: document.getElementById('clearLeaderboardBtn'),
        confettiContainer: document.getElementById('confettiContainer')
    };
}

/** Attach all click and input events */
function bindEvents() {
    // Dark mode toggle
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Home: category cards
    document.querySelectorAll('.category-card').forEach(function (card) {
        card.addEventListener('click', function () {
            var cat = card.getAttribute('data-category');
            selectCategory(cat);
        });
    });

    // Name screen
    elements.backFromNameBtn.addEventListener('click', goToHome);
    elements.startQuizBtn.addEventListener('click', startQuizFromName);
    elements.playerNameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') startQuizFromName();
    });

    // Result screen
    elements.playAgainBtn.addEventListener('click', playAgain);
    elements.changeCategoryBtn.addEventListener('click', changeCategory);
    elements.viewLeaderboardBtn.addEventListener('click', openLeaderboard);

    // Leaderboard
    elements.leaderboardBackBtn.addEventListener('click', goToHome);
    if (elements.clearLeaderboardBtn) {
        elements.clearLeaderboardBtn.addEventListener('click', clearLeaderboard);
    }
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderLeaderboardTable(btn.getAttribute('data-filter'));
        });
    });
}

// ========== SCREEN NAVIGATION ==========
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(function (s) {
        s.classList.remove('active');
    });
    var screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
}

function goToHome() {
    chosenCategory = null;
    chosenCategoryLabel = '';
    playerName = '';
    elements.playerNameInput.value = '';
    showScreen('homeScreen');
}

/** User clicked a category on home screen */
function selectCategory(categoryKey) {
    chosenCategory = categoryKey;
    chosenCategoryLabel = CATEGORY_LABELS[categoryKey] || categoryKey;
    elements.chosenCategoryName.textContent = chosenCategoryLabel;
    showScreen('nameScreen');
    elements.playerNameInput.value = playerName || '';
    elements.playerNameInput.focus();
}

/** Start quiz from name entry (after clicking Start Quiz) */
function startQuizFromName() {
    playerName = (elements.playerNameInput.value || '').trim();
    if (!playerName) {
        alert('Please enter your name.');
        elements.playerNameInput.focus();
        return;
    }
    if (!chosenCategory) {
        alert('Please choose a category from the home screen.');
        return;
    }

    // Build question set: shuffled so each game has different order & selection (no repeating pattern)
    currentQuestions = getQuestionsForCategory(chosenCategory);
    if (currentQuestions.length === 0) {
        alert('No questions available for this category.');
        return;
    }

    currentQuestionIndex = 0;
    score = 0;
    quizStartTime = Date.now();  // Record start time for "time taken" on result screen
    showScreen('quizScreen');
    elements.quizPlayerName.textContent = playerName;
    elements.quizCategoryName.textContent = chosenCategoryLabel;
    elements.totalQuestions.textContent = currentQuestions.length;
    loadQuestion();
}

/** Get 10 questions for category. Shuffled each time so questions/order don't repeat. */
function getQuestionsForCategory(categoryKey) {
    if (categoryKey === 'mixed') {
        var all = [];
        Object.keys(quizData).forEach(function (key) {
            (quizData[key] || []).forEach(function (q) {
                all.push(q);
            });
        });
        return shuffleArray(all).slice(0, 10);
    }
    var list = quizData[categoryKey];
    if (!Array.isArray(list)) return [];
    // Shuffle and take first 10 so each game has different questions in different order
    return shuffleArray(list).slice(0, 10);
}

/** Fisher–Yates shuffle */
function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
}

// ========== QUIZ FLOW ==========
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        finishQuiz();
        return;
    }

    answered = false;

    var q = currentQuestions[currentQuestionIndex];
    elements.currentQuestionNum.textContent = currentQuestionIndex + 1;
    elements.quizScore.textContent = score;
    elements.questionText.textContent = q.question;
    elements.feedbackMessage.textContent = '';
    elements.feedbackMessage.className = 'feedback-message';

    // Progress bar
    var pct = (currentQuestionIndex / currentQuestions.length) * 100;
    elements.progressBar.style.width = pct + '%';

    // Shuffle options so correct answer appears randomly in position 1–4
    var shuffledOptions = shuffleArray(q.options.slice());
    elements.optionsContainer.innerHTML = '';
    shuffledOptions.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', function () { selectOption(opt); });
        elements.optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedOptionText) {
    if (answered) return;
    answered = true;

    var q = currentQuestions[currentQuestionIndex];
    var isCorrect = selectedOptionText === q.answer;

    if (isCorrect) {
        score++;
        elements.quizScore.textContent = score;
    }

    highlightOptionsByText(q.answer, isCorrect ? null : selectedOptionText);
    if (isCorrect) {
        elements.feedbackMessage.textContent = 'Correct!';
        elements.feedbackMessage.className = 'feedback-message correct-msg';
    } else {
        elements.feedbackMessage.textContent = 'Wrong. Correct: ' + q.answer;
        elements.feedbackMessage.className = 'feedback-message incorrect-msg';
    }
    disableAllOptions();

    setTimeout(nextQuestion, 1000);
}

function highlightOptionsByText(correctText, incorrectText) {
    var buttons = elements.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(function (btn) {
        var text = (btn.textContent || '').trim();
        if (text === correctText) btn.classList.add('correct');
        else if (incorrectText && text === incorrectText) btn.classList.add('incorrect');
    });
}

function disableAllOptions() {
    elements.optionsContainer.querySelectorAll('.option-btn').forEach(function (btn) {
        btn.disabled = true;
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// ========== RESULT SCREEN ==========
function finishQuiz() {
    showScreen('resultScreen');

    var total = currentQuestions.length;
    var pct = total > 0 ? Math.round((score / total) * 100) : 0;

    // Time taken (from quiz start to now)
    var elapsedMs = Date.now() - quizStartTime;
    var elapsedSec = Math.floor(elapsedMs / 1000);
    var minutes = Math.floor(elapsedSec / 60);
    var seconds = elapsedSec % 60;
    var timeStr = minutes > 0 ? minutes + ' min ' + seconds + ' sec' : seconds + ' sec';
    if (elements.resultTimeTaken) elements.resultTimeTaken.textContent = 'Time taken: ' + timeStr;

    elements.resultPlayerName.textContent = playerName;
    elements.resultCategoryName.textContent = chosenCategoryLabel;
    elements.resultScore.textContent = score;
    elements.resultTotal.textContent = total;
    elements.resultPercent.textContent = pct + '%';

    var message = '';
    if (pct >= 90) message = 'Quiz Master!';
    else if (pct >= 70) message = 'Excellent!';
    else if (pct >= 50) message = 'Good Effort!';
    else message = 'Keep Practicing!';
    elements.motivationalMessage.textContent = message;

    saveToLeaderboard(playerName, score, total, chosenCategory);
    if (pct >= 70) runConfetti();
}

function runConfetti() {
    var container = elements.confettiContainer;
    container.innerHTML = '';
    var colors = ['#0d9488', '#14b8a6', '#059669', '#0ea5e9', '#d97706'];
    var count = 50;
    for (var i = 0; i < count; i++) {
        var piece = document.createElement('div');
        piece.style.cssText = 'position:absolute;width:10px;height:10px;background:' + colors[i % colors.length] + ';border-radius:2px;left:' + Math.random() * 100 + 'vw;top:-20px;animation:confettiFall ' + (2 + Math.random() * 2) + 's linear forwards;animation-delay:' + Math.random() * 0.5 + 's;';
        container.appendChild(piece);
    }
    // Add keyframes inline if not in CSS (we'll add to CSS)
    setTimeout(function () {
        container.innerHTML = '';
    }, 4000);
}

function playAgain() {
    currentQuestionIndex = 0;
    score = 0;
    elements.playerNameInput.value = playerName;
    showScreen('nameScreen');
    elements.chosenCategoryName.textContent = chosenCategoryLabel;
}

function changeCategory() {
    goToHome();
}

function openLeaderboard() {
    showScreen('leaderboardScreen');
    document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
    });
    renderLeaderboardTable('all');
}

/** Clear all leaderboard data after confirmation */
function clearLeaderboard() {
    if (!confirm('Are you sure you want to clear all leaderboard scores? This cannot be undone.')) {
        return;
    }
    localStorage.removeItem(LEADERBOARD_KEY);
    renderLeaderboardTable('all');
}

// ========== LEADERBOARD (localStorage) ==========
const LEADERBOARD_KEY = 'ultimateQuizLeaderboard';

function saveToLeaderboard(name, score, total, category) {
    var list = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    list.push({
        name: name,
        score: score,
        total: total,
        category: category,
        date: new Date().toLocaleDateString()
    });
    list.sort(function (a, b) {
        var pa = (a.total > 0) ? (a.score / a.total) * 100 : 0;
        var pb = (b.total > 0) ? (b.score / b.total) * 100 : 0;
        if (pb !== pa) return pb - pa;
        return b.score - a.score;
    });
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
}

function getLeaderboard(filter) {
    var list = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    // Sort by score percentage then by score (highest first)
    list.sort(function (a, b) {
        var pa = (a.total > 0) ? (a.score / a.total) * 100 : 0;
        var pb = (b.total > 0) ? (b.score / b.total) * 100 : 0;
        if (pb !== pa) return pb - pa;
        return b.score - a.score;
    });

    if (filter === 'all') return list.slice(0, 10);

    var filtered = list.filter(function (entry) {
        var c = (entry.category || '').toLowerCase();
        if (filter === 'science') return c === 'science';
        if (filter === 'sports') return c === 'football' || c === 'cricket';
        if (filter === 'math') return c === 'mathematics';
        return true;
    });
    return filtered.slice(0, 10);
}

function renderLeaderboardTable(filter) {
    var data = getLeaderboard(filter);
    var tbody = elements.leaderboardBody;
    var noScores = elements.noScoresMsg;
    var tableWrapper = tbody.closest('.table-wrapper');

    tbody.innerHTML = '';
    if (data.length === 0) {
        noScores.classList.add('visible');
        if (tableWrapper) tableWrapper.style.display = 'none';
        return;
    }
    noScores.classList.remove('visible');
    if (tableWrapper) tableWrapper.style.display = '';
    data.forEach(function (entry, i) {
        var tr = document.createElement('tr');
        var catLabel = CATEGORY_LABELS[entry.category] || entry.category || '—';
        tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + escapeHtml(entry.name) + '</td><td>' + escapeHtml(catLabel) + '</td><td class="score-cell">' + entry.score + '/' + (entry.total || '?') + '</td><td>' + escapeHtml(entry.date || '') + '</td>';
        tbody.appendChild(tr);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
