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

// Current user data (in a real app, this would come from a database)
let currentUser = null;
let displayDate = new Date();
const today = new Date();

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
    
    // In a real app, you would verify credentials with a server
    // For demo purposes, we'll just check local storage
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
    
    // In a real app, you would send this data to a server
    // For demo purposes, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered. Please login instead.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        cycleData: {
            lastPeriod: new Date(lastPeriod),
            cycleLength,
            periodLength
        }
    };
    
    users.push(newUser);
    localStorage.setItem('flowUsers', JSON.stringify(users));
    
    // Log user in
    loginUser(newUser);
});

// Logout Button
logoutBtn.addEventListener('click', () => {
    currentUser = null;
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
    
    const lastPeriod = document.getElementById('updateLastPeriod').value;
    const cycleLength = parseInt(document.getElementById('updateCycleLength').value);
    const periodLength = parseInt(document.getElementById('updatePeriodLength').value);
    
    if (!currentUser) return;
    
    // Update user data
    currentUser.cycleData = {
        lastPeriod: lastPeriod ? new Date(lastPeriod) : currentUser.cycleData.lastPeriod,
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
    const lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    const cycleLength = currentUser.cycleData.cycleLength;
    const periodLength = currentUser.cycleData.periodLength;
    
    // Calculate days since last period
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const dayInCycle = (daysSinceLastPeriod % cycleLength) + 1;
    
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
        
        // Check if it's today
        if (today.getDate() === day && 
            today.getMonth() === displayDate.getMonth() && 
            today.getFullYear() === displayDate.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Calculate periods and fertile days
        const timeDiff = currentDate.getTime() - lastPeriod.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength;
        
        // Apply phase styling
        if (cycleDay < periodLength) {
            dayElement.classList.add('period-day');
            const cycleNumber = Math.floor(daysDiff / cycleLength) + 1;
            const periodDay = cycleDay + 1;
            dayElement.title = `Period Day ${periodDay} (Cycle #${cycleNumber})`;
            dayElement.addEventListener('click', () => showCyclePhaseInfo('period', periodDay));
        } 
        else if (cycleDay === cycleLength - 14) {
            dayElement.classList.add('ovulation-day');
            dayElement.title = 'Estimated Ovulation Day';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('ovulation'));
        } 
        else if (cycleDay >= cycleLength - 18 && cycleDay <= cycleLength - 12) {
            dayElement.classList.add('fertile-day');
            dayElement.title = 'Fertile Window';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('fertile'));
        } 
        else if (cycleDay >= periodLength && cycleDay < cycleLength - 14) {
            dayElement.classList.add('follicular-day');
            dayElement.title = 'Follicular Phase';
            dayElement.addEventListener('click', () => showCyclePhaseInfo('follicular'));
        } 
        else {
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
    
    // Phase-specific content
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
    // Remove existing legend if it exists
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
    // Remove existing tips if they exist
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

// Additional features
function trackSymptom(symptomType, severity) {
    if (!currentUser) return;
    
    if (!currentUser.symptoms) {
        currentUser.symptoms = [];
    }
    
    const symptom = {
        date: new Date(),
        type: symptomType,
        severity: severity
    };
    
    currentUser.symptoms.push(symptom);
    
    // Update in storage
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
}

function trackMood(moodType, notes) {
    if (!currentUser) return;
    
    if (!currentUser.moods) {
        currentUser.moods = [];
    }
    
    const mood = {
        date: new Date(),
        type: moodType,
        notes: notes
    };
    
    currentUser.moods.push(mood);
    
    // Update in storage
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
}

function setReminder(daysBeforePeriod) {
    if (!currentUser) return;
    
    alert(`Reminder set! You will be notified ${daysBeforePeriod} days before your expected period.`);
}

function exportCycleData() {
    if (!currentUser) return;
    
    const cycleData = {
        user: currentUser.name,
        email: currentUser.email,
        lastPeriod: currentUser.cycleData.lastPeriod,
        cycleLength: currentUser.cycleData.cycleLength,
        periodLength: currentUser.cycleData.periodLength,
        symptoms: currentUser.symptoms || [],
        moods: currentUser.moods || []
    };
    
    const dataStr = JSON.stringify(cycleData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `flow_data_${currentUser.name}.json`);
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
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
                lastPeriod: new Date(2025, 3, 5), // April 5, 2025
                cycleLength: 28,
                periodLength: 5
            }
        };
        users.push(demoUser);
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
});

// Helper Functions
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
