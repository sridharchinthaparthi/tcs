/**
 * Main application logic handling dynamic views, state, theming, and data fetching
 */

class App {
    constructor() {
        this.state = {
            currentView: 'home',
            currentCategory: null,
            questions: [],
            currentPage: 1,
            questionsPerPage: 5,
            searchQuery: '',
            darkMode: false,
            progress: {}, // Initialize empty to ensure answers erase on reload/refresh
            timer: 0,
            timerInterval: null
        };

        this.cache = {};

        this.init();
    }

    init() {
        this.initTheme();
        this.bindEvents();
        this.renderView('home');
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.state.darkMode = true;
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            document.querySelector('.sun-icon').style.display = 'none';
            document.querySelector('.moon-icon').style.display = 'block';
        }
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.state.darkMode = !this.state.darkMode;
            if (this.state.darkMode) {
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
                document.querySelector('.sun-icon').style.display = 'none';
                document.querySelector('.moon-icon').style.display = 'block';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('theme-dark');
                document.body.classList.add('theme-light');
                document.querySelector('.sun-icon').style.display = 'block';
                document.querySelector('.moon-icon').style.display = 'none';
                localStorage.setItem('theme', 'light');
            }
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                if (view) this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.state.currentView = view;

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            }
        });

        this.renderView(view);
    }

    openCategory(categoryId) {
        this.state.currentCategory = categoryId;
        this.state.currentPage = 1;
        this.state.searchQuery = '';
        this.switchView('practice');
    }

    async renderView(view) {
        const mainContent = document.getElementById('view-container');

        if (view === 'home') {
            // Un-hide initial HTML structures since they exist in index.html initially.
            // If they were wiped, we rebuild.
            this.renderHome(mainContent);
        } else if (view === 'practice') {
            await this.renderPractice(mainContent);
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    renderHome(container) {
        container.innerHTML = `
            <section class="hero-section">
                <div class="container hero-content">
                    <h1 class="hero-title">Prepare for TCS NQT with <span class="highlight">1000+ Practice Questions</span></h1>
                    <p class="hero-subtitle">Master aptitude, reasoning, verbal ability, and coding challenges with detailed step-by-step solutions designed to boost your placement success.</p>
                    <div class="hero-cta">
                        <button class="btn btn-primary btn-large" onclick="app.switchView('practice')">Start Practicing Now</button>
                    </div>
                </div>
            </section>

            <section class="stats-section">
                <div class="container stats-grid">
                    <div class="stat-card">
                        <h3 class="stat-number">1000+</h3>
                        <p class="stat-label">Practice Questions</p>
                    </div>
                    <div class="stat-card">
                        <h3 class="stat-number">100%</h3>
                        <p class="stat-label">Detailed Solutions</p>
                    </div>
                    <div class="stat-card">
                        <h3 class="stat-number">5</h3>
                        <p class="stat-label">Core Modules</p>
                    </div>
                    <div class="stat-card">
                        <h3 class="stat-number">IT</h3>
                        <p class="stat-label">Placement Focused</p>
                    </div>
                </div>
            </section>

            <section class="features-section" id="categories-preview">
                <div class="container">
                    <h2 class="section-title">Comprehensive Practice Modules</h2>
                    <div class="features-grid">
                        <div class="feature-card" onclick="app.openCategory('numerical')">
                            <div class="feature-icon bg-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                            </div>
                            <h3>Numerical Ability</h3>
                            <p>Numerical ability, percentages, ratios, probability, and pure math concepts.</p>
                        </div>
                        <div class="feature-card" onclick="app.openCategory('reasoning')">
                            <div class="feature-icon bg-purple">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            </div>
                            <h3>Logical Reasoning</h3>
                            <p>Logical thinking, pattern recognition, data interpretation, and deductions.</p>
                        </div>
                        <div class="feature-card" onclick="app.openCategory('verbal')">
                            <div class="feature-icon bg-green">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                            </div>
                            <h3>Verbal Ability</h3>
                            <p>Reading comprehension, vocabulary, grammar corrections, and synonyms.</p>
                        </div>
                        <div class="feature-card" onclick="app.openCategory('programming')">
                            <div class="feature-icon bg-orange">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                            </div>
                            <h3>Programming MCQs</h3>
                            <p>C/C++, Java, Python fundamentals, output predictions, and pseudocode.</p>
                        </div>
                        <div class="feature-card" onclick="app.openCategory('coding')">
                            <div class="feature-icon bg-red">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
                            </div>
                            <h3>Coding Challenges</h3>
                            <p>Hands-on coding problems with optimal solutions and time complexities.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async renderPractice(container) {
        // Set default category
        if (!this.state.currentCategory) {
            this.state.currentCategory = 'numerical';
        }

        container.innerHTML = `
            <div class="container">
                <div class="practice-layout">
                    <!-- Sidebar Navigation -->
                    <aside class="sidebar">
                        <ul class="category-nav">
                            <li class="${this.state.currentCategory === 'numerical' ? 'active' : ''}" onclick="app.openCategory('numerical')">Numerical Ability</li>
                            <li class="${this.state.currentCategory === 'reasoning' ? 'active' : ''}" onclick="app.openCategory('reasoning')">Logical Reasoning</li>
                            <li class="${this.state.currentCategory === 'verbal' ? 'active' : ''}" onclick="app.openCategory('verbal')">Verbal Ability</li>
                            <li class="${this.state.currentCategory === 'programming' ? 'active' : ''}" onclick="app.openCategory('programming')">Programming MCQs</li>
                            <li class="${this.state.currentCategory === 'coding' ? 'active' : ''}" onclick="app.openCategory('coding')">Coding Challenges</li>
                        </ul>
                        <div class="session-timer mt-4" style="margin-top: 2rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
                            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-tertiary);">Session Time</span>
                            <div id="timer-display" style="font-size: 1.5rem; font-weight: bold; font-family: var(--font-heading); color: var(--primary-color);">00:00:00</div>
                        </div>
                    </aside>
                    
                    <!-- Main Quiz Content Area -->
                    <div class="practice-content">
                        <div class="content-header">
                            <h2 style="text-transform: capitalize;">${this.state.currentCategory} Practice</h2>
                            <div class="controls">
                                <input type="text" id="searchInput" class="search-input" placeholder="Search questions..." value="${this.state.searchQuery}">
                            </div>
                        </div>
                        <div id="questions-container">
                            <div style="text-align: center; padding: 3rem;">
                                <div class="spinner" style="border: 4px solid var(--border-color); border-top: 4px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: auto;"></div>
                            </div>
                        </div>
                        <div id="pagination-container" class="pagination"></div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        `;

        this.startTimer();
        await this.loadCategoryData(this.state.currentCategory);

        // Search listener
        const searchInput = document.getElementById('searchInput');
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.state.searchQuery = e.target.value.toLowerCase();
                this.state.currentPage = 1;
                this.renderQuestions();
            }, 300);
        });
    }

    startTimer() {
        if (!this.state.timerInterval) {
            this.state.timerInterval = setInterval(() => {
                this.state.timer++;
                const display = document.getElementById('timer-display');
                if (display) {
                    const hrs = Math.floor(this.state.timer / 3600);
                    const mins = Math.floor((this.state.timer % 3600) / 60);
                    const secs = this.state.timer % 60;
                    display.innerText = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }
    }

    async loadCategoryData(category) {
        try {
            if (!this.cache[category]) {
                const fileMap = {
                    'numerical': 'data_3f9a7b2c',
                    'reasoning': 'data_8e4d1f5a',
                    'verbal': 'data_c2b5e8a1',
                    'programming': 'data_5a1f8e4d',
                    'coding': 'data_7b2c3f9a'
                };
                const fileName = fileMap[category] || category;


                const response = await fetch(`data/${fileName}.json`);
                if (!response.ok) throw new Error("Data not found");

                const obscuredText = await response.text();
                const base64Str = obscuredText.split('').reverse().join('');
                const jsonStr = decodeURIComponent(escape(atob(base64Str)));

                const data = JSON.parse(jsonStr);
                this.cache[category] = data;
            }

            const categoryData = this.cache[category];
            this.state.questions = Array.isArray(categoryData) ? categoryData : (categoryData.questions || []);

            this.renderQuestions();
        } catch (e) {
            console.error(e);
            document.getElementById('questions-container').innerHTML = `
                <div style="padding: 2rem; background: var(--error-bg); color: var(--error-color); border-radius: var(--radius-md);">
                    <strong>Error loading data.</strong> Please make sure you are running a local server to fetch JSON files, or deploy to a web environment.
                </div>
            `;
        }
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');

        let filtered = this.state.questions || [];
        if (this.state.searchQuery) {
            filtered = filtered.filter(q => {
                const searchStr = (q.question || q.title || q.problem_statement || '').toLowerCase();
                return searchStr.includes(this.state.searchQuery);
            });
        }

        if (filtered.length === 0) {
            container.innerHTML = '<p>No questions found matching your criteria.</p>';
            document.getElementById('pagination-container').innerHTML = '';
            return;
        }

        // Render all filtered questions, no pagination slicing
        const currentQuestions = filtered;

        container.innerHTML = currentQuestions.map(q => {
            const isAnswered = this.state.progress[this.state.currentCategory]?.[q.id];

            if (this.state.currentCategory === 'coding') {
                const solHtml = q.solutions ? Object.entries(q.solutions).map(([lang, sol]) => `
                    <div style="margin-bottom: 1.5rem;">
                        <h5 style="text-transform: capitalize; margin-bottom: 0.5rem; color: var(--primary-color);">${lang}</h5>
                        <pre style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm); white-space: pre-wrap; word-wrap: break-word;"><code>${sol.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                        ${sol.explanation ? `<p style="margin-top: 0.5rem; font-size: 0.9rem;"><strong>Explanation:</strong> ${sol.explanation}</p>` : ''}
                        ${sol.time_complexity ? `<p style="font-size: 0.9rem;"><strong>Time Complexity:</strong> ${sol.time_complexity} &bull; <strong>Space:</strong> ${sol.space_complexity}</p>` : ''}
                    </div>
                `).join('') : '<p>No solution available.</p>';

                return `
                <div class="question-card" id="q-${q.id}">
                    <div class="question-meta">
                        ${q.difficulty ? `<span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span>` : ''}
                        ${q.subcategory ? `<span class="badge category">${q.subcategory}</span>` : ''}
                        <span>Problem ${q.id}</span>
                    </div>
                    <div class="question-text">
                        <h3 style="margin-bottom: 1rem;">${q.title}</h3>
                        <p style="margin-bottom: 1rem;">${(q.problem_statement || '').replace(/\n/g, '<br>')}</p>
                        ${q.input_format ? `<p><strong>Input Format:</strong> ${q.input_format}</p>` : ''}
                        ${q.output_format ? `<p><strong>Output Format:</strong> ${q.output_format}</p>` : ''}
                        ${q.sample_input ? `<div style="margin-top: 1rem;"><strong>Sample Input:</strong><pre style="background: var(--bg-secondary); padding: 0.5rem; border-radius: var(--radius-sm); white-space: pre-wrap; word-wrap: break-word;">${q.sample_input}</pre></div>` : ''}
                        ${q.sample_output ? `<div style="margin-top: 0.5rem;"><strong>Sample Output:</strong><pre style="background: var(--bg-secondary); padding: 0.5rem; border-radius: var(--radius-sm); white-space: pre-wrap; word-wrap: break-word;">${q.sample_output}</pre></div>` : ''}
                    </div>
                    
                    <button class="btn btn-primary" onclick="app.toggleSolution('${q.id}')" style="margin-top: 1.5rem;">
                        ${isAnswered ? 'Hide Solution' : 'View Solution'}
                    </button>

                    <div class="solution-box ${isAnswered ? 'show' : ''}" id="sol-${q.id}" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                        <h4 style="margin-bottom: 1rem;">Solution</h4>
                        <div class="solution-content">
                            ${solHtml}
                        </div>
                    </div>
                </div>
                `;
            }

            // Normalize options and answer formats
            const isObjectOptions = q.options && !Array.isArray(q.options);
            const optionsEntries = q.options ? (isObjectOptions ? Object.entries(q.options) : q.options.map((opt, idx) => [idx, opt])) : [];
            const correctAnswer = q.correct_answer !== undefined ? q.correct_answer : q.answer;

            let explanationText = '';
            if (q.explanation) {
                if (typeof q.explanation === 'object') {
                    explanationText = `<strong>Short:</strong> ${q.explanation.short || ''}<br><br><strong>Detailed:</strong><br>${(q.explanation.detailed || '').replace(/\n/g, '<br>')}`;
                    if (q.pro_tip) explanationText += `<br><br><strong>Pro Tip:</strong> ${q.pro_tip}`;
                } else {
                    explanationText = q.explanation;
                }
            } else {
                explanationText = 'The correct answer is ' + (isObjectOptions ? correctAnswer : String.fromCharCode(65 + parseInt(correctAnswer))) + '.';
            }

            return `
            <div class="question-card" id="q-${q.id}">
                <div class="question-meta">
                    ${q.difficulty ? `<span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span>` : ''}
                    ${q.topic ? `<span class="badge category">${q.topic}</span>` : ''}
                    <span>Q${q.id}</span>
                </div>
                <div class="question-text">${q.question.replace(/\n/g, '<br>')}</div>
                <ul class="options-list">
                    ${optionsEntries.map(([key, opt]) => {
                const isSelected = isAnswered && String(isAnswered.selected) === String(key);
                const isCorrectOption = isAnswered && String(key) === String(correctAnswer);
                const isWrongOption = isSelected && !isAnswered.isCorrect;

                let classes = 'option-item';
                if (isSelected) classes += ' selected';
                if (isCorrectOption) classes += ' correct';
                if (isWrongOption) classes += ' wrong';

                const safeCorrect = typeof correctAnswer === 'string' ? `'${correctAnswer.replace(/'/g, "\\'")}'` : correctAnswer;
                const safeKey = typeof key === 'string' ? `'${key.replace(/'/g, "\\'")}'` : key;

                return `
                        <li class="${classes}" onclick="app.handleAnswer('${q.id}', ${safeKey}, ${safeCorrect})">
                            ${isObjectOptions ? `<strong>${key}.</strong> ` : `${String.fromCharCode(65 + parseInt(key))}. `} ${opt}
                        </li>
                        `;
            }).join('')}
                </ul>
                <div class="solution-box ${isAnswered ? 'show' : ''}" id="sol-${q.id}">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Solution</h4>
                    <p>${explanationText}</p>
                </div>
            </div>
            `;
        }).join('');

        this.renderPagination(1); // Clears the pagination container
    }

    // Renamed from selectOption to handleAnswer as per diff
    handleAnswer(questionId, selectedValue, correctValue) {
        // Prevent re-answering
        if (this.state.progress[this.state.currentCategory]?.[questionId]) return;

        const isCorrect = String(selectedValue) === String(correctValue);

        if (!this.state.progress[this.state.currentCategory]) {
            this.state.progress[this.state.currentCategory] = {};
        }

        this.state.progress[this.state.currentCategory][questionId] = {
            selected: selectedValue,
            correct: correctValue,
            isCorrect: isCorrect
        };

        this.saveProgress();
        this.renderQuestions(); // Re-render to show colors and solution
    }

    toggleSolution(questionId) {
        if (!this.state.progress[this.state.currentCategory]) {
            this.state.progress[this.state.currentCategory] = {};
        }

        const isAnswered = this.state.progress[this.state.currentCategory][questionId];

        if (isAnswered && isAnswered.viewed) { // If solution was viewed, hide it
            delete this.state.progress[this.state.currentCategory][questionId].viewed;
            if (Object.keys(this.state.progress[this.state.currentCategory][questionId]).length === 0) {
                delete this.state.progress[this.state.currentCategory][questionId];
            }
        } else { // If not answered or not viewed, show it
            this.state.progress[this.state.currentCategory][questionId] = { ...(isAnswered || {}), viewed: true };
        }

        this.saveProgress();
        this.renderQuestions();
    }

    saveProgress() {
        // Progress persistence removed per user request so MCQs completely reset on refresh
    }

    renderPagination() {
        // Pagination removed per requirements
    }
}

// Initialize and attach to global window to allow inline onclick handlers
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

    // Security: Block exact shortcuts
    document.addEventListener('contextmenu', e => e.preventDefault()); // Block right click
    document.addEventListener('keydown', e => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U') // View Source
        ) {
            e.preventDefault();
        }
    });
});
