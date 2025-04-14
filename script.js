// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navbar = document.querySelector('.navbar');
const authModal = document.getElementById('auth-modal') || createAuthModal();
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const authSwitch = document.getElementById('switch-auth');
const authButtons = document.querySelector('.auth-buttons');
const days = document.querySelectorAll('.day');
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonialNav = document.querySelectorAll('.testimonial-nav span');
const contactForm = document.getElementById('contactForm');

// Create auth modal if it doesn't exist
function createAuthModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-content">
            <span class="close-auth">&times;</span>
            <h2 id="auth-title">Login</h2>
            <form class="auth-form" id="auth-form">
                <input type="email" id="auth-email" placeholder="Email" required>
                <input type="password" id="auth-password" placeholder="Password" required>
                <button type="submit" id="auth-submit">Login</button>
            </form>
            <p class="auth-switch">Don't have an account? <span id="switch-auth">Sign up</span></p>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// Mobile Menu Toggle
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#login' || this.getAttribute('href') === '#signup') return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Auth State Listener
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        authButtons.innerHTML = `
            <div class="user-profile">
                <span class="user-email">${user.email}</span>
                <button class="logout-btn">Logout</button>
            </div>
        `;
        loadUserData(user.uid);
    } else {
        // No user signed in
        authButtons.innerHTML = `
            <a href="#login" class="btn btn-outline">Login</a>
            <a href="#signup" class="btn btn-primary">Sign Up</a>
        `;
    }
});

// Auth Modal Toggle
function toggleAuthModal(isLogin = true) {
    authTitle.textContent = isLogin ? 'Login' : 'Sign Up';
    authSubmit.textContent = isLogin ? 'Login' : 'Sign Up';
    authSwitch.textContent = isLogin ? 'Sign up' : 'Login';
    authModal.style.display = 'block';
}

// Close Modal
document.querySelector('.close-auth')?.addEventListener('click', () => {
    authModal.style.display = 'none';
});

// Switch Between Login/Signup
authSwitch?.addEventListener('click', () => {
    const isLogin = authTitle.textContent === 'Login';
    toggleAuthModal(!isLogin);
});

// Auth Form Submission
authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const isLogin = authTitle.textContent === 'Login';
    
    try {
        if (isLogin) {
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            await auth.createUserWithEmailAndPassword(email, password);
        }
        authModal.style.display = 'none';
    } catch (error) {
        alert(error.message);
    }
});

// Logout
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('logout-btn')) {
        auth.signOut();
    }
});

// Login/Signup Links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href="#login"]')) {
        e.preventDefault();
        toggleAuthModal(true);
    } else if (e.target.matches('a[href="#signup"]')) {
        e.preventDefault();
        toggleAuthModal(false);
    }
});

// Load User Data
async function loadUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            const data = doc.data().periodData;
            updateCalendarWithData(data);
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error loading user data:", error);
        return null;
    }
}

// Update Calendar with Saved Data
function updateCalendarWithData(data) {
    if (!data) return;
    
    days.forEach(day => {
        if (day.classList.contains('prev-month') || day.classList.contains('next-month')) return;
        
        const date = day.textContent;
        day.classList.remove('period');
        if (data[date] && data[date].type === 'period') {
            day.classList.add('period');
        }
    });
}

// Save Period Data
async function savePeriodData(userId, data) {
    try {
        await db.collection('users').doc(userId).set({
            periodData: data
        }, { merge: true });
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Calendar Day Click Handler
days.forEach(day => {
    day.addEventListener('click', async function() {
        const user = auth.currentUser;
        if (!user) {
            toggleAuthModal(true);
            return;
        }
        
        if (this.classList.contains('prev-month') || this.classList.contains('next-month')) return;
        
        const date = this.textContent;
        const periodData = await loadUserData(user.uid) || {};
        
        if (!periodData[date]) {
            periodData[date] = { type: 'period' };
            this.classList.add('period');
        } else {
            delete periodData[date];
            this.classList.remove('period');
        }
        
        await savePeriodData(user.uid, periodData);
    });
});

// Testimonial Slider
let currentTestimonial = 0;
function showTestimonial(index) {
    testimonialSlider.style.transform = `translateX(-${index * 100}%)`;
    testimonialNav.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
}

testimonialNav.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// Auto Testimonial Slider
setInterval(() => {
    const nextTestimonial = (currentTestimonial + 1) % testimonialNav.length;
    showTestimonial(nextTestimonial);
}, 5000);

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });
}
