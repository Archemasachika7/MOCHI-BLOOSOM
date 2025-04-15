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
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        cycleData: {
            lastPeriod: new Date(lastPeriod),
            cycleLength,
            periodLength
        }
    };
    
    users.push(newUser);
    localStorage.setItem('flowUsers', JSON.stringify(users));
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
    
    currentUser.cycleData = {
        lastPeriod: lastPeriod ? new Date(lastPeriod) : currentUser.cycleData.lastPeriod,
        cycleLength: cycleLength || currentUser.cycleData.cycleLength,
        periodLength: periodLength || currentUser.cycleData.periodLength
    };
    
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
    
    updateCycleInfo();
    renderCalendar();
    alert('Your cycle settings have been updated!');
});

// Login User Function
function loginUser(user) {
    currentUser = user;
    userName.textContent = user.name;
    
    document.getElementById('updateLastPeriod').valueAsDate = new Date(currentUser.cycleData.lastPeriod);
    document.getElementById('updateCycleLength').value = currentUser.cycleData.cycleLength;
    document.getElementById('updatePeriodLength').value = currentUser.cycleData.periodLength;
    
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
    document.querySelector('nav').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.features').style.display = 'none';
    dashboard.style.display = 'block';
    
    inspiration.textContent = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
    
    updateCycleInfo();
    renderCalendar();
}

// Update Cycle Info
function updateCycleInfo() {
    if (!currentUser) return;
    
    const lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    const cycleLength = currentUser.cycleData.cycleLength;
    const periodLength = currentUser.cycleData.periodLength;
    
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
    const dayInCycle = ((daysSinceLastPeriod - 1) % cycleLength) + 1;
    
    if (dayInCycle <= periodLength) {
        periodStatus.textContent = `You're on day ${dayInCycle} of your period.`;
        cyclePhase.textContent = "You're currently menstruating. Be gentle with yourself.";
    } else {
        const nextPeriodDay = cycleLength - dayInCycle + 1;
        periodStatus.textContent = `Your next period is expected in ${nextPeriodDay} days.`;
        
        if (dayInCycle >= cycleLength - 14 && dayInCycle <= cycleLength - 10) {
            cyclePhase.textContent = "You're in your fertile window. Take extra care today.";
        } else if (dayInCycle === cycleLength - 14) {
            cyclePhase.textContent = "Today is likely your ovulation day. Notice how you feel.";
        } else if (dayInCycle > periodLength && dayInCycle < cycleLength - 14) {
            cyclePhase.textContent = "You're in your follicular phase. A good time for new beginnings.";
        } else {
            cyclePhase.textContent = "You're in your luteal phase. Practice self-care and reflection.";
        }
    }
}

// Render Calendar (FIXED DATE CALCULATION)
function renderCalendar() {
    if (!currentUser) return;
    
    while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }
    
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    currentMonth.textContent = `${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
    
    const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
    const lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    const cycleLength = currentUser.cycleData.cycleLength;
    const periodLength = currentUser.cycleData.periodLength;
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        
        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        const daysDiff = Math.floor((currentDate - lastPeriod) / (1000 * 60 * 60 * 24));
        const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength + 1;
        
        if (daysDiff >= 0) {
            if (cycleDay <= periodLength) {
                dayElement.classList.add('period-day');
                dayElement.title = `Period Day ${cycleDay}`;
            } else if (cycleDay === cycleLength - 14) {
                dayElement.classList.add('ovulation-day');
                dayElement.title = 'Estimated Ovulation Day';
            } else if (cycleDay >= cycleLength - 18 && cycleDay <= cycleLength - 12) {
                dayElement.classList.add('fertile-day');
                dayElement.title = 'Fertile Window';
            }
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Add legend
    const existingLegend = document.querySelector('.cycle-phase-legend');
    if (existingLegend) existingLegend.remove();
    
    const legendContainer = document.createElement('div');
    legendContainer.className = 'cycle-phase-legend';
    legendContainer.innerHTML = `
        <div class="legend-item">
            <div class="legend-color legend-period"></div>
            <span>Period</span>
        </div>
        <div class="legend-item">
            <div class="legend-color legend-ovulation"></div>
            <span>Ovulation</span>
        </div>
        <div class="legend-item">
            <div class="legend-color legend-fertile"></div>
            <span>Fertile Window</span>
        </div>
    `;
    document.querySelector('.calendar-container').appendChild(legendContainer);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUserId = localStorage.getItem('flowLoggedInUser');
    if (loggedInUserId) {
        const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
        const user = users.find(u => u.id === loggedInUserId);
        if (user) loginUser(user);
    }
    
    // Demo data
    const users = JSON.parse(localStorage.getItem('flowUsers')) || [];
    if (users.length === 0) {
        users.push({
            id: 'demo123',
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password',
            cycleData: {
                lastPeriod: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
                cycleLength: 28,
                periodLength: 5
            }
        });
        localStorage.setItem('flowUsers', JSON.stringify(users));
    }
});
