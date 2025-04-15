// DOM Elements
const showLoginBtn = document.getElementById('showLoginBtn');
const showSignupBtn = document.getElementById('showSignupBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const closeSignupBtn = document.getElementById('closeSignupBtn');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const dashboard = document.getElementById('dashboard');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const calendarGrid = document.getElementById('calendarGrid');
const currentMonth = document.getElementById('currentMonth');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const inspiration = document.getElementById('inspiration');
const periodStatus = document.getElementById('periodStatus');
const cyclePhase = document.getElementById('cyclePhase');
const cycleSettingsForm = document.getElementById('cycleSettingsForm');

// Quotes and messages
const inspirationalMessages = [
    "Your body's rhythm is a beautiful dance of nature. Honor it with love and care.",
    "Every phase of your cycle brings its own unique power and beauty.",
    "Self-care isn't selfish, it's necessary. Be gentle with yourself today.",
    "The most powerful relationship you will ever have is the relationship with yourself.",
    "Listen to your body, it whispers so you don't have to hear it scream.",
    "You are not defined by your cycle, but empowered by understanding it.",
    "Embrace the ebb and flow of your beautiful journey.",
    "The more you understand your body, the more you can honor its needs.",
    "Your cycle is not a weakness, but a source of feminine strength and wisdom.",
    "Tuning into your body's rhythm is a profound act of self-love."
];

// Current user data
let currentUser = null;
let displayDate = new Date();
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

// Event Listeners
showLoginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
showSignupBtn.addEventListener('click', () => signupModal.style.display = 'flex');
getStartedBtn.addEventListener('click', () => signupModal.style.display = 'flex');
closeLoginBtn.addEventListener('click', () => loginModal.style.display = 'none');
closeSignupBtn.addEventListener('click', () => signupModal.style.display = 'none');
switchToSignup.addEventListener('click', () => {
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
});
switchToLogin.addEventListener('click', () => {
    signupModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        loginUser(user);
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Signup Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const lastPeriod = document.getElementById('lastPeriod').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    const periodLength = parseInt(document.getElementById('periodLength').value);
    
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    
    if (users.some(user => user.email === email)) {
        alert('Email already registered. Please login instead.');
        return;
    }
    
    // Create new user with proper date handling
    const lastPeriodDate = new Date(lastPeriod);
    lastPeriodDate.setHours(0, 0, 0, 0); // Normalize to midnight
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        cycleData: {
            lastPeriod: lastPeriodDate,
            cycleLength,
            periodLength
        }
    };
    
    users.push(newUser);
    localStorage.setItem('flowUsers', JSON.stringify(users));
    localStorage.setItem('flowLoggedInUser', newUser.id);
    
    loginUser(newUser);
});

// Logout Button
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('flowLoggedInUser');
    dashboard.style.display = 'none';
    document.querySelector('nav').style.display = 'block';
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.features').style.display = 'block';
});

// Calendar Navigation
prevMonth.addEventListener('click', () => {
    displayDate.setMonth(displayDate.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener('click', () => {
    displayDate.setMonth(displayDate.getMonth() + 1);
    renderCalendar();
});

// Cycle Settings Form
cycleSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const lastPeriodInput = document.getElementById('updateLastPeriod').value;
    const cycleLength = parseInt(document.getElementById('updateCycleLength').value);
    const periodLength = parseInt(document.getElementById('updatePeriodLength').value);
    
    if (!currentUser) return;
    
    // Update user data with proper date handling
    let lastPeriodDate = currentUser.cycleData.lastPeriod;
    if (lastPeriodInput) {
        lastPeriodDate = new Date(lastPeriodInput);
        lastPeriodDate.setHours(0, 0, 0, 0);
    }
    
    currentUser.cycleData = {
        lastPeriod: lastPeriodDate,
        cycleLength: cycleLength || currentUser.cycleData.cycleLength,
        periodLength: periodLength || currentUser.cycleData.periodLength
    };
    
    // Update in storage
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
    
    // Refresh data display
    updateCycleInfo();
    renderCalendar();
    
    alert('Your cycle settings have been updated!');
});

// Functions
function loginUser(user) {
    currentUser = user;
    userName.textContent = user.name;
    
    // Ensure proper date handling
    if (typeof currentUser.cycleData.lastPeriod === 'string') {
        currentUser.cycleData.lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    }
    currentUser.cycleData.lastPeriod.setHours(0, 0, 0, 0);
    
    // Fill in cycle settings form
    document.getElementById('updateLastPeriod').valueAsDate = new Date(currentUser.cycleData.lastPeriod);
    document.getElementById('updateCycleLength').value = currentUser.cycleData.cycleLength;
    document.getElementById('updatePeriodLength').value = currentUser.cycleData.periodLength;
    
    // Hide login modal and show dashboard
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
    document.querySelector('nav').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    dashboard.style.display = 'block';
    
    // Show a random inspirational message
    inspiration.textContent = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
    
    // Initialize dashboard
    initializeDashboard();
}

function updateCycleInfo() {
    if (!currentUser) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    lastPeriod.setHours(0, 0, 0, 0);
    const cycleLength = currentUser.cycleData.cycleLength;
    const periodLength = currentUser.cycleData.periodLength;
    
    // Calculate days since last period
    const timeDiff = today - lastPeriod;
    const daysSinceLastPeriod = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const dayInCycle = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength + 1;
    
    // Calculate days until next period
    const daysUntilNextPeriod = cycleLength - dayInCycle + 1;
    
    // Update period status text
    if (dayInCycle <= periodLength) {
        periodStatus.textContent = `You're on day ${dayInCycle} of your period.`;
    } else {
        periodStatus.textContent = `Your next period is expected in ${daysUntilNextPeriod} days.`;
    }
    
    // Determine cycle phase
    if (dayInCycle <= periodLength) {
        cyclePhase.textContent = "You're currently menstruating. Be gentle with yourself.";
    } else if (dayInCycle >= cycleLength - 14 && dayInCycle <= cycleLength - 10) {
        cyclePhase.textContent = "You're in your fertile window. Take extra care today.";
    } else if (dayInCycle === cycleLength - 14) {
        cyclePhase.textContent = "Today is likely your ovulation day. Notice how you feel.";
    } else if (dayInCycle > periodLength && dayInCycle < cycleLength - 14) {
        cyclePhase.textContent = "You're in your follicular phase. A good time for new beginnings.";
    } else {
        cyclePhase.textContent = "You're in your luteal phase. Practice self-care and reflection.";
    }
}

function renderCalendar() {
    if (!currentUser) return;
    
    // Clear previous calendar days (except headers)
    while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }
    
    // Update month/year display
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    currentMonth.textContent = `${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
    
    // Get first day of month and number of days in month
    const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
    
    // Get last period date from user data
    const lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    lastPeriod.setHours(0, 0, 0, 0);
    const cycleLength = currentUser.cycleData.cycleLength;
    const periodLength = currentUser.cycleData.periodLength;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Fill in days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        currentDate.setHours(0, 0, 0, 0);
        
        // Check if it's today
        if (today.getDate() === day && 
            today.getMonth() === displayDate.getMonth() && 
            today.getFullYear() === displayDate.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Calculate days difference
        const timeDiff = currentDate - lastPeriod;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        // Calculate cycle day (1 to cycleLength) with proper modulo handling
        const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength + 1;
        
        // Apply phase styling
        if (daysDiff >= 0 && cycleDay <= periodLength) {
            dayElement.classList.add('period-day');
            const cycleNumber = Math.floor(daysDiff / cycleLength) + 1;
            dayElement.title = `Period Day ${cycleDay} (Cycle #${cycleNumber})`;
            dayElement.addEventListener('click', () => showCyclePhaseInfo('period', cycleDay));
        }
        else if (daysDiff >= 0 && cycleDay === cycleLength - 14) {
            dayElement.classList.add('ovulation-day');
            dayElement.title = 'Estimated Ovulation Day';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('ovulation'));
        } 
        else if (daysDiff >= 0 && cycleDay >= cycleLength - 18 && cycleDay <= cycleLength - 12) {
            dayElement.classList.add('fertile-day');
            dayElement.title = 'Fertile Window';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('fertile'));
        } 
        else if (daysDiff >= 0 && cycleDay > periodLength && cycleDay < cycleLength - 14) {
            dayElement.classList.add('follicular-day');
            dayElement.title = 'Follicular Phase';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('follicular'));
        } 
        else if (daysDiff >= 0) {
            dayElement.classList.add('luteal-day');
            dayElement.title = 'Luteal Phase';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('luteal'));
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Add legend after calendar renders
    addCalendarLegend();
}

function showCyclePhaseInfo(phaseType, phaseDay = null) {
    const infoModal = document.createElement('div');
    infoModal.className = 'cycle-info-modal';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => infoModal.remove();
    
    const content = document.createElement('div');
    content.className = 'cycle-info-content';
    
    let title = '';
    let description = '';
    let tips = '';
    
    switch(phaseType) {
        case 'period':
            title = `Menstruation Phase - Day ${phaseDay}`;
            description = 'During your period, the lining of your uterus is being shed. This is a time when you may experience various symptoms such as cramping, fatigue, and mood changes.';
            tips = '<strong>Self-care tips:</strong><br>• Stay hydrated<br>• Use heat therapy for cramps<br>• Gentle exercise can help with blood flow<br>• Rest when you need to<br>• Consider anti-inflammatory foods';
            break;
        case 'ovulation':
            title = 'Ovulation Day';
            description = 'Ovulation is when your ovary releases an egg, which typically happens around the middle of your cycle. This is your most fertile time.';
            tips = '<strong>Things to note:</strong><br>• Peak fertility window<br>• May experience mild pain on one side<br>• Energy levels are often higher<br>• Libido may increase';
            break;
        case 'fertile':
            title = 'Fertile Window';
            description = 'Your fertile window includes several days before ovulation and about 24 hours after. Sperm can survive for up to 5 days in the female reproductive tract.';
            tips = '<strong>What to know:</strong><br>• High chance of pregnancy if unprotected sex occurs<br>• Cervical mucus becomes clearer and more stretchy<br>• Good time for creative projects';
            break;
        case 'follicular':
            title = 'Follicular Phase';
            description = 'The follicular phase starts with your period and continues until ovulation. During this time, follicles in your ovaries mature, and estrogen levels begin to rise.';
            tips = '<strong>Lifestyle tips:</strong><br>• Good time to start new projects<br>• Energy typically increases after period ends<br>• Strength training can be especially effective';
            break;
        case 'luteal':
            title = 'Luteal Phase';
            description = 'The luteal phase occurs after ovulation and before your next period. Progesterone rises, which can cause premenstrual symptoms for some.';
            tips = '<strong>Self-care suggestions:</strong><br>• Focus on completing projects<br>• Gentle exercise like yoga<br>• Extra self-care may be needed<br>• Mindfulness practices can help';
            break;
    }
    
    content.innerHTML = `
        <h3>${title}</h3>
        <p class="phase-description">${description}</p>
        <div class="phase-tips">${tips}</div>
    `;
    
    infoModal.appendChild(closeBtn);
    infoModal.appendChild(content);
    document.body.appendChild(infoModal);
}

function addCalendarLegend() {
    const existingLegend = document.querySelector('.cycle-phase-legend');
    if (existingLegend) existingLegend.remove();
    
    const legendContainer = document.createElement('div');
    legendContainer.className = 'cycle-phase-legend';
    
    const legendItems = [
        { class: 'legend-period', text: 'Period' },
        { class: 'legend-ovulation', text: 'Ovulation' },
        { class: 'legend-fertile', text: 'Fertile Window' },
        { class: 'legend-follicular', text: 'Follicular Phase' },
        { class: 'legend-luteal', text: 'Luteal Phase' }
    ];
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorIndicator = document.createElement('div');
        colorIndicator.className = `legend-color ${item.class}`;
        
        const text = document.createElement('span');
        text.textContent = item.text;
        
        legendItem.appendChild(colorIndicator);
        legendItem.appendChild(text);
        legendContainer.appendChild(legendItem);
    });
    
    document.querySelector('.calendar-container').appendChild(legendContainer);
}

function addCycleTips() {
    const existingTips = document.querySelector('.cycle-tips-container');
    if (existingTips) existingTips.remove();
    
    const tipsContainer = document.createElement('div');
    tipsContainer.className = 'cycle-tips-container';
    tipsContainer.innerHTML = `
        <h3 class="tips-title">Cycle Health Tips</h3>
        <div class="tips-carousel">
            <div class="tip-card">
                <h4>Period Care</h4>
                <p>Stay hydrated and consider iron-rich foods to replenish what's lost during menstruation. Heat therapy can help with cramps.</p>
            </div>
            <div class="tip-card">
                <h4>Tracking Benefits</h4>
                <p>Consistent tracking helps identify patterns in your cycle and can alert you to potential hormonal imbalances or health issues.</p>
            </div>
            <div class="tip-card">
                <h4>Cycle Syncing</h4>
                <p>Consider aligning activities with your cycle phases: high-intensity workouts during follicular phase, creative work during ovulation.</p>
            </div>
        </div>
        <button class="prev-tip">❮</button>
        <button class="next-tip">❯</button>
    `;
    
    const periodInfo = document.querySelector('.period-info');
    periodInfo.parentNode.insertBefore(tipsContainer, periodInfo.nextSibling);
    
    // Add carousel functionality
    let currentTip = 0;
    const tipCards = tipsContainer.querySelectorAll('.tip-card');
    const carousel = tipsContainer.querySelector('.tips-carousel');
    
    tipsContainer.querySelector('.prev-tip').addEventListener('click', () => {
        currentTip = (currentTip > 0) ? currentTip - 1 : tipCards.length - 1;
        carousel.scrollTo({
            left: currentTip * tipCards[0].offsetWidth,
            behavior: 'smooth'
        });
    });
    
    tipsContainer.querySelector('.next-tip').addEventListener('click', () => {
        currentTip = (currentTip < tipCards.length - 1) ? currentTip + 1 : 0;
        carousel.scrollTo({
            left: currentTip * tipCards[0].offsetWidth,
            behavior: 'smooth'
        });
    });
}

function initializeDashboard() {
    updateCycleInfo();
    renderCalendar();
    addCycleTips();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in from a previous session
    const loggedInUserId = localStorage.getItem('flowLoggedInUser');
    if (loggedInUserId) {
        const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
        const user = users.find(u => u.id === loggedInUserId);
        if (user) {
            loginUser(user);
        }
    }
    
    // For demo purposes, we'll pre-populate some user data
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    if (users.length === 0) {
        const demoUser = {
            id: 'demo123',
            name: 'Rose',
            email: 'demo@example.com',
            password: 'password',
            cycleData: {
                lastPeriod: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
                cycleLength: 28,
                periodLength: 5
            }
        };
        demoUser.cycleData.lastPeriod.setHours(0, 0, 0, 0);
        users.push(demoUser);
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
});
