// Salon Booking System
class SalonBookingSystem {
    constructor() {
        this.appointments = this.loadAppointments();
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initScrollEffects();
        this.initBookingSystem();
        this.initAnimations();
        this.renderAppointments();
    }

    // Mobile Menu Toggle
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navItems = document.querySelectorAll('.nav-links a');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    // Smooth scrolling for navigation links
    initSmoothScrolling() {
        const navItems = document.querySelectorAll('.nav-links a, .cta-button[href^="#"]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Add scroll effect to header
    initScrollEffects() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // Initialize animations
    initAnimations() {
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

        // Observe service cards and appointment cards for animation
        const animatedElements = document.querySelectorAll('.service-card, .appointment-card');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });

        // Add shimmer effect for placeholders
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shimmer {
                0% { background-position: -40px 0; }
                100% { background-position: 40px 0; }
            }
        `;
        document.head.appendChild(style);

        const imagePlaceholders = document.querySelectorAll('.image-placeholder, .map-placeholder');
        imagePlaceholders.forEach(placeholder => {
            placeholder.style.backgroundImage = 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)';
            placeholder.style.backgroundSize = '20px 20px';
            placeholder.style.animation = 'shimmer 1.5s infinite';
        });
    }

    // Initialize booking system
    initBookingSystem() {
        this.initModal();
        this.initServiceBooking();
        this.initGeneralBooking();
        this.initFormValidation();
        this.setMinDate();
    }

    // Initialize modal functionality
    initModal() {
        const modal = document.getElementById('booking-modal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.querySelector('.cancel-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeModal();
            }
        });
    }

    // Initialize service-specific booking
    initServiceBooking() {
        const serviceButtons = document.querySelectorAll('.book-service-btn');
        serviceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceCard = e.target.closest('.service-card');
                const serviceName = serviceCard.dataset.service;
                const servicePrice = serviceCard.dataset.price;
                
                this.openModal(serviceName, servicePrice);
            });
        });
    }

    // Initialize general booking button
    initGeneralBooking() {
        const generalBookingBtn = document.getElementById('book-general-appointment');
        if (generalBookingBtn) {
            generalBookingBtn.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Hero CTA button
        const heroCTA = document.querySelector('.hero .cta-button');
        if (heroCTA && heroCTA.getAttribute('href') === '#contact') {
            heroCTA.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }
    }

    // Initialize form validation and submission
    initFormValidation() {
        const form = document.getElementById('booking-form');
        const serviceSelect = document.getElementById('selected-service');
        const estimatedPrice = document.getElementById('estimated-price');

        // Update price when service changes
        if (serviceSelect) {
            serviceSelect.addEventListener('change', (e) => {
                const selectedOption = e.target.selectedOptions[0];
                const price = selectedOption ? selectedOption.dataset.price || '0' : '0';
                estimatedPrice.textContent = price;
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
    }

    // Set minimum date to today
    setMinDate() {
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    // Open modal with optional pre-filled service
    openModal(serviceName = '', servicePrice = '') {
        const modal = document.getElementById('booking-modal');
        const serviceSelect = document.getElementById('selected-service');
        const estimatedPrice = document.getElementById('estimated-price');

        if (serviceName && serviceSelect) {
            serviceSelect.value = serviceName;
            estimatedPrice.textContent = servicePrice;
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('booking-form');
        if (form) {
            form.reset();
            document.getElementById('estimated-price').textContent = '0';
            this.removeMessages();
        }
    }

    // Handle form submission
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const appointmentData = {
            id: Date.now().toString(),
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            customerPhone: formData.get('customerPhone'),
            selectedService: formData.get('selectedService'),
            appointmentDate: formData.get('appointmentDate'),
            appointmentTime: formData.get('appointmentTime'),
            specialRequests: formData.get('specialRequests'),
            price: document.getElementById('estimated-price').textContent,
            status: 'Confirmed',
            bookedAt: new Date().toISOString()
        };

        // Validate form
        if (!this.validateForm(appointmentData)) {
            return;
        }

        // Check for conflicts
        if (this.hasTimeConflict(appointmentData)) {
            this.showMessage('This time slot is already booked. Please choose a different time.', 'error');
            return;
        }

        // Save appointment
        this.saveAppointment(appointmentData);
        this.showMessage('Appointment booked successfully! We will contact you soon to confirm.', 'success');
        
        setTimeout(() => {
            this.closeModal();
            this.renderAppointments();
            // Smooth scroll to appointments section
            document.getElementById('appointments').scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    }

    // Validate form data
    validateForm(data) {
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'selectedService', 'appointmentDate', 'appointmentTime'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showMessage(`Please fill in all required fields.`, 'error');
                return false;
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.customerEmail)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        // Validate phone (basic)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.customerPhone)) {
            this.showMessage('Please enter a valid phone number.', 'error');
            return false;
        }

        // Validate date (not in the past)
        const appointmentDate = new Date(data.appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (appointmentDate < today) {
            this.showMessage('Please select a future date.', 'error');
            return false;
        }

        return true;
    }

    // Check for time conflicts
    hasTimeConflict(newAppointment) {
        return this.appointments.some(appointment => 
            appointment.appointmentDate === newAppointment.appointmentDate &&
            appointment.appointmentTime === newAppointment.appointmentTime &&
            appointment.status !== 'Cancelled'
        );
    }

    // Save appointment to localStorage
    saveAppointment(appointment) {
        this.appointments.push(appointment);
        localStorage.setItem('salonAppointments', JSON.stringify(this.appointments));
    }

    // Load appointments from localStorage
    loadAppointments() {
        const stored = localStorage.getItem('salonAppointments');
        return stored ? JSON.parse(stored) : [];
    }

    // Cancel appointment
    cancelAppointment(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'Cancelled';
                localStorage.setItem('salonAppointments', JSON.stringify(this.appointments));
                this.renderAppointments();
                this.showMessage('Appointment cancelled successfully.', 'success');
            }
        }
    }

    // Render appointments list
    renderAppointments() {
        const appointmentsList = document.getElementById('appointments-list');
        if (!appointmentsList) return;

        const activeAppointments = this.appointments.filter(apt => apt.status !== 'Cancelled');

        if (activeAppointments.length === 0) {
            appointmentsList.innerHTML = '<p class="no-appointments">No appointments booked yet. Book your first appointment below!</p>';
            return;
        }

        const appointmentsHTML = activeAppointments
            .sort((a, b) => new Date(a.appointmentDate + ' ' + a.appointmentTime) - new Date(b.appointmentDate + ' ' + b.appointmentTime))
            .map(appointment => this.createAppointmentHTML(appointment))
            .join('');

        appointmentsList.innerHTML = appointmentsHTML;

        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-appointment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appointmentId = e.target.dataset.appointmentId;
                this.cancelAppointment(appointmentId);
            });
        });
    }

    // Create HTML for a single appointment
    createAppointmentHTML(appointment) {
        const date = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const time = this.formatTime(appointment.appointmentTime);

        return `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-info">
                        <h3>${appointment.selectedService}</h3>
                        <p class="appointment-status status-${appointment.status.toLowerCase()}">${appointment.status}</p>
                    </div>
                    <button class="cancel-appointment-btn" data-appointment-id="${appointment.id}">Cancel</button>
                </div>
                <div class="appointment-details">
                    <div class="detail-item">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">${date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time</span>
                        <span class="detail-value">${time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Customer</span>
                        <span class="detail-value">${appointment.customerName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Price</span>
                        <span class="detail-value">$${appointment.price}</span>
                    </div>
                </div>
                ${appointment.specialRequests ? `
                    <div class="special-requests">
                        <span class="detail-label">Special Requests:</span>
                        <p>${appointment.specialRequests}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Format time for display
    formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Show success/error messages
    showMessage(message, type) {
        this.removeMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        const form = document.getElementById('booking-form');
        form.insertBefore(messageDiv, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeMessages();
        }, 5000);
    }

    // Remove existing messages
    removeMessages() {
        document.querySelectorAll('.success-message, .error-message').forEach(msg => {
            msg.remove();
        });
    }
}

// Initialize the booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SalonBookingSystem();
});