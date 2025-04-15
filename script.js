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
    updateCycleInfo();
    renderCalendar();
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
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonth.textContent = `${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
    
    // Get first day of the month
    const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const lastDay = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
    
    // Calculate cycle days
    const lastPeriod = new Date(currentUser.cycleData.lastPeriod);
    const cycleLength = currentUser.cycleData.cycleLength;
    const periodLength = currentUser.cycleData.periodLength;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Fill in days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
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
        
        // Calculate if this day is a period day, ovulation day, or fertile day
        const daysSinceLastPeriod = Math.floor((currentDate - lastPeriod) / (1000 * 60 * 60 * 24));
        const cycleDayNumber = (daysSinceLastPeriod % cycleLength) + 1;
        
        if (cycleDayNumber <= periodLength) {
            dayElement.classList.add('period-day');
            dayElement.title = `Period Day ${cycleDayNumber}`;
        } else if (cycleDayNumber === cycleLength - 14) {
            dayElement.classList.add('ovulation-day');
            dayElement.title = 'Estimated Ovulation Day';
        } else if (cycleDayNumber >= cycleLength - 16 && cycleDayNumber <= cycleLength - 11) {
            dayElement.classList.add('fertile-day');
            dayElement.title = 'Fertile Window';
        }
        
        calendarGrid.appendChild(dayElement);
    }
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

// Additional features (to be implemented)

// 1. Symptom tracking
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

// 2. Mood tracking
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

// 3. Generate reminder notifications (simulated)
function setReminder(daysBeforePeriod) {
    if (!currentUser) return;
    
    alert(`Reminder set! You will be notified ${daysBeforePeriod} days before your expected period.`);
    
    // In a real app, this would store the reminder preference and send actual notifications
}

// 4. Export cycle data
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
