// Initialize AOS Library
document.addEventListener('DOMContentLoaded', function() {
    // Check if AOS exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }

    // Variables
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navbar = document.querySelector('.navbar');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialNavDots = document.querySelectorAll('.testimonial-nav span');
    const modalTriggers = document.querySelectorAll('a[href="#login"], a[href="#signup"]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    // Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Smooth Scrolling for Internal Links
    document.querySelectorAll('a[href^="#"]:not([href="#login"]):not([href="#signup"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
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
    
    // Testimonial Slider
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        if (!testimonialSlider) return;
        
        testimonialSlider.style.transform = `translateX(-${index * 100}%)`;
        
        testimonialNavDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Testimonial Navigation
    testimonialNavDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });
    
    // Auto Testimonial Slider
    setInterval(() => {
        if (!testimonialSlider) return;
        
        currentTestimonial = (currentTestimonial + 1) % testimonialNavDots.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Modal Handling
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetModal = this.getAttribute('href').substring(1);
            const modal = document.getElementById(`${targetModal}Modal`);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Calendar Interaction
    const days = document.querySelectorAll('.days .day');
    
    days.forEach(day => {
        day.addEventListener('click', function() {
            if (!this.classList.contains('prev-month') && !this.classList.contains('next-month')) {
                this.classList.toggle('period');
            }
        });
    });
    
    // Form Submissions
    const contactForm = document.getElementById('contactForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement your form submission logic here
            // For demo purposes, just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement your login logic here
            // For demo purposes, just show an alert
            alert('Login functionality would be implemented here.');
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement your signup logic here
            // For demo purposes, just show an alert
            alert('Sign up functionality would be implemented here.');
        });
    }
    
    // Parallax Effect for Sections
    window.addEventListener('scroll', function() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        parallaxSections.forEach(section => {
            const scrollPosition = window.pageYOffset;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in view
            if (scrollPosition + window.innerHeight > sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                const yPos = -(scrollPosition - sectionTop) / 5;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
    
    // Calendar Functionality
    const prevMonthBtn = document.querySelector('.calendar-controls span:first-child');
    const nextMonthBtn = document.querySelector('.calendar-controls span:last-child');
    const calendarMonth = document.querySelector('.calendar-header h3');
    
    // Define months for calendar
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let currentMonth = 3; // April (0-indexed)
    let currentYear = 2025;
    
    if (prevMonthBtn && nextMonthBtn && calendarMonth) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            calendarMonth.textContent = `${months[currentMonth]} ${currentYear}`;
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            calendarMonth.textContent = `${months[currentMonth]} ${currentYear}`;
        });
    }
    
    // Initialize contact form animations
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (input) {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    group.classList.remove('focused');
                }
            });
            
            // Check on page load if input already has value
            if (input.value.trim() !== '') {
                group.classList.add('focused');
            }
        }
    });
});
