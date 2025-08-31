// Simple form validation and submission

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    

});

// Smooth scrolling functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Uzbek phone number validation - accepts various formats
function validateUzbekPhone(phone) {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +, check if it's a valid Uzbek number
    if (cleanPhone.startsWith('+')) {
        // Should be +998 followed by 9 digits
        if (cleanPhone.length === 13 && cleanPhone.startsWith('+998')) {
            const operatorCode = cleanPhone.substring(4, 6);
            const validCodes = ['90', '91', '93', '94', '95', '97', '99'];
            return validCodes.includes(operatorCode);
        }
        return false;
    }
    
    // If no +, should be 9-12 digits (Uzbek numbers)
    if (cleanPhone.length >= 9 && cleanPhone.length <= 12) {
        // Check if it's a valid Uzbek operator code
        let operatorCode;
        if (cleanPhone.length === 9) {
            operatorCode = cleanPhone.substring(0, 2);
        } else if (cleanPhone.length === 10) {
            operatorCode = cleanPhone.substring(0, 2);
        } else if (cleanPhone.length === 11) {
            operatorCode = cleanPhone.substring(0, 2);
        } else if (cleanPhone.length === 12) {
            operatorCode = cleanPhone.substring(0, 2);
        }
        
        const validCodes = ['90', '91', '93', '94', '95', '97', '99'];
        return validCodes.includes(operatorCode);
    }
    
    return false;
}

// Format phone number as user types - no auto-adding +998
function formatPhoneNumber(input) {
    let value = input.value;
    
    // Don't auto-add +998, let user type freely
    // Just allow digits, spaces, and + symbol
    value = value.replace(/[^\d\s+]/g, '');
    
    input.value = value;
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    
    // Add phone formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !phone || !message) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            // Uzbek phone validation
            if (!validateUzbekPhone(phone)) {
                showNotification('Пожалуйста, введите корректный узбекский номер телефона', 'error');
                return;
            }
            
            // Show loading message
            showNotification('Отправляем заявку...', 'info');
            
            // Send to Telegram Bot (recommended approach)
            sendToTelegram(name, phone, message);
            
            // Also send to email as backup
            sendToEmail(name, phone, message);
        });
    }
});

// Send form data to Telegram Bot
function sendToTelegram(name, phone, message) {
    const botToken = '8294746672:AAERdu7nkiXnK-lag1U1rL-O1NamORdGGvs';
    const chatId = '653776241'; // Your personal Telegram user ID
    
    const text = `🔔 Новая заявка с сайта Gellion Prime

👤 Имя: ${name}
📱 Телефон: ${phone}
💬 Сообщение: ${message}

⏰ Время: ${new Date().toLocaleString('ru-RU')}`;

    console.log('Sending to Telegram:', { botToken, chatId, text });

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        })
    })
    .then(response => {
        console.log('Telegram response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Telegram response data:', data);
        if (data.ok) {
            showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            console.error('Telegram API error:', data);
            throw new Error(`Telegram API error: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Error sending to Telegram:', error);
        showNotification('Ошибка отправки. Попробуйте позже.', 'error');
    });
}

// Send form data to email (using EmailJS or similar service)
function sendToEmail(name, phone, message) {
    // Using EmailJS as an example
    // You'll need to sign up at emailjs.com and configure it
    
    const templateParams = {
        to_name: 'Gellion Prime',
        from_name: name,
        from_phone: phone,
        message: message,
        reply_to: 'info@gellionprime.uz'
    };
    
    // This is a placeholder - you'll need to configure EmailJS
    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
    //     .then(function(response) {
    //         console.log('SUCCESS!', response.status, response.text);
    //     }, function(error) {
    //         console.log('FAILED...', error);
    //     });
    
    // For now, just show success message
    showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
    document.getElementById('contactForm').reset();
}

// Telegram link function
function openTelegram() {
    window.open('https://t.me/GELLION_PRIME', '_blank');
}

// Phone link function
function callPhone() {
    window.open('tel:+998909357769', '_self');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-top: 1px solid #e5e7eb;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .step, .contact-item, .stat-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        }
    }
    
    updateCounter();
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.textContent);
            if (!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter, target);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-item h3');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
