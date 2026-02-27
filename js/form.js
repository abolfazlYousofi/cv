// Form Handling Module with Language Support

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.init();
        this.initLanguageSupport(); // اضافه کردن پشتیبانی زبان
    }
    
    init() {
        this.inputs = this.form.querySelectorAll('input, textarea, select');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.loadingSpinner = this.submitBtn?.querySelector('.spinner');
        
        this.bindEvents();
        this.initValidation();
        this.initAutoSave();
        this.trackFieldInteractions();
    }
    
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input events
        this.inputs.forEach(input => {
            input.addEventListener('input', () => this.handleInputChange(input));
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('focus', () => this.clearError(input));
        });
        
        // Reset form
        const resetBtn = this.form.querySelector('button[type="reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }
        
        // Language change event listener
        document.addEventListener('languageChange', (e) => {
            this.updateFormLanguage(e.detail.lang);
        });
    }
    
    initLanguageSupport() {
        // ترجمه‌های فرم
        this.translations = {
            en: {
                required: (field) => `${field} is required`,
                email: 'Please enter a valid email address',
                phone: 'Please enter a valid phone number',
                minLength: (min) => `Must be at least ${min} characters`,
                maxLength: (max) => `Must be less than ${max} characters`,
                pattern: 'Invalid format',
                submit: 'Submit',
                sending: 'Sending...',
                success: 'Message sent successfully!',
                error: 'Please fix the errors in the form',
                failed: 'Failed to send message. Please try again.',
                restored: 'Form data restored from previous session'
            },
            fa: {
                required: (field) => `${field} الزامی است`,
                email: 'لطفاً یک ایمیل معتبر وارد کنید',
                phone: 'لطفاً یک شماره تلفن معتبر وارد کنید',
                minLength: (min) => `حداقل ${min} کاراکتر باید باشد`,
                maxLength: (max) => `باید کمتر از ${max} کاراکتر باشد`,
                pattern: 'فرمت نامعتبر',
                submit: 'ارسال',
                sending: 'در حال ارسال...',
                success: 'پیام با موفقیت ارسال شد!',
                error: 'لطفاً خطاهای فرم را برطرف کنید',
                failed: 'ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.',
                restored: 'داده‌های فرم از جلسه قبل بازیابی شد'
            }
        };
        
        // بارگذاری زبان ذخیره شده
        this.currentLang = localStorage.getItem('preferred-language') || 'en';
        this.updateFormLanguage(this.currentLang);
    }
    
    updateFormLanguage(lang) {
        this.currentLang = lang;
        
        // به‌روزرسانی متن دکمه ارسال
        if (this.submitBtn) {
            const submitText = this.submitBtn.querySelector('.submit-text');
            if (submitText) {
                submitText.textContent = this.translations[lang].submit;
            }
        }
        
        // به‌روزرساری پیام‌های خطا
        this.updateErrorMessages();
        
        // به‌روزرسانی placeholderها
        this.inputs.forEach(input => {
            if (input.hasAttribute(`data-placeholder-${lang}`)) {
                const placeholder = input.getAttribute(`data-placeholder-${lang}`);
                input.setAttribute('placeholder', placeholder);
            }
        });
    }
    
    updateErrorMessages() {
        // به‌روزرسانی تمام پیام‌های خطای موجود
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            const field = element.closest('.form-group')?.querySelector('input, textarea, select');
            if (field) {
                this.validateField(field);
            }
        });
    }
    
    initValidation() {
        // Custom validation rules - اکنون از ترجمه استفاده می‌کند
        this.rules = {
            required: {
                test: (value) => value.trim().length > 0,
                message: (field) => {
                    const fieldLabel = field.getAttribute('data-label') || 
                                     field.previousElementSibling?.textContent || 
                                     field.getAttribute('placeholder') || 
                                     field.getAttribute('name');
                    return this.translations[this.currentLang].required(fieldLabel);
                }
            },
            email: {
                test: (value) => {
                    if (!value) return true;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                },
                message: this.translations[this.currentLang].email
            },
            phone: {
                test: (value) => {
                    if (!value) return true;
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    return phoneRegex.test(value.replace(/\D/g, ''));
                },
                message: this.translations[this.currentLang].phone
            },
            minLength: (min) => ({
                test: (value) => value.length >= min,
                message: this.translations[this.currentLang].minLength(min)
            }),
            maxLength: (max) => ({
                test: (value) => value.length <= max,
                message: this.translations[this.currentLang].maxLength(max)
            }),
            pattern: (pattern, customMessage) => ({
                test: (value) => {
                    if (!value) return true;
                    return new RegExp(pattern).test(value);
                },
                message: customMessage || this.translations[this.currentLang].pattern
            })
        };
    }
    
    handleInputChange(input) {
        // Auto-save
        this.autoSave();
        
        // Real-time validation
        if (input.hasAttribute('data-validate')) {
            this.validateField(input);
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const validationRules = this.getValidationRules(field);
        
        // Clear previous errors
        this.clearError(field);
        
        // Check each rule
        for (const rule of validationRules) {
            if (!rule.test(value)) {
                this.showError(field, typeof rule.message === 'function' ? rule.message(field) : rule.message);
                return false;
            }
        }
        
        // Mark as valid
        this.markAsValid(field);
        return true;
    }
    
    getValidationRules(field) {
        const rules = [];
        
        // Required rule
        if (field.hasAttribute('required')) {
            rules.push(this.rules.required);
        }
        
        // Type-specific rules
        switch (field.type) {
            case 'email':
                rules.push(this.rules.email);
                break;
            case 'tel':
                rules.push(this.rules.phone);
                break;
        }
        
        // Custom data attributes
        if (field.hasAttribute('data-min-length')) {
            const min = parseInt(field.getAttribute('data-min-length'));
            rules.push(this.rules.minLength(min));
        }
        
        if (field.hasAttribute('data-max-length')) {
            const max = parseInt(field.getAttribute('data-max-length'));
            rules.push(this.rules.maxLength(max));
        }
        
        if (field.hasAttribute('data-pattern')) {
            const pattern = field.getAttribute('data-pattern');
            const message = field.getAttribute('data-pattern-message');
            rules.push(this.rules.pattern(pattern, message));
        }
        
        return rules;
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup?.querySelector('.error-message');
        
        if (!errorElement && formGroup) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            formGroup.classList.add('error');
        }
        
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement?.id || '');
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup?.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = '';
            formGroup.classList.remove('error');
        }
        
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }
    
    markAsValid(field) {
        const formGroup = field.closest('.form-group');
        formGroup?.classList.remove('error');
        formGroup?.classList.add('valid');
        field.setAttribute('aria-invalid', 'false');
    }
    
    validateForm() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            this.showNotification(this.translations[this.currentLang].error, 'error');
            return;
        }
        
        // Show loading state with language support
        this.setLoading(true);
        
        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Submit to API
            const response = await this.submitToAPI(data);
            
            if (response.success) {
                this.showNotification(this.translations[this.currentLang].success, 'success');
                this.form.reset();
                this.clearAutoSave();
            } else {
                throw new Error(response.message || this.translations[this.currentLang].failed);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification(
                error.message || this.translations[this.currentLang].failed,
                'error'
            );
            
        } finally {
            // Hide loading state
            this.setLoading(false);
        }
    }
    
    async submitToAPI(data) {
        // Replace with your actual API endpoint
        const apiUrl = this.form.getAttribute('action') || 'https://api.example.com/contact';
        const method = this.form.getAttribute('method') || 'POST';
        
        const response = await fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    setLoading(isLoading) {
        if (this.submitBtn) {
            this.submitBtn.disabled = isLoading;
            this.submitBtn.classList.toggle('loading', isLoading);
            
            // Update button text during loading
            const submitText = this.submitBtn.querySelector('.submit-text');
            if (submitText) {
                submitText.textContent = isLoading 
                    ? this.translations[this.currentLang].sending
                    : this.translations[this.currentLang].submit;
            }
            
            if (this.loadingSpinner) {
                this.loadingSpinner.style.display = isLoading ? 'block' : 'none';
            }
        }
    }
    
    showNotification(message, type = 'info') {
        // Use the global notification function if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: ${this.currentLang === 'fa' ? '20px' : 'auto'};
            left: ${this.currentLang === 'fa' ? 'auto' : '20px'};
            background: ${type === 'success' ? '#10b981' : 
                         type === 'error' ? '#ef4444' : 
                         type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            text-align: ${this.currentLang === 'fa' ? 'right' : 'left'};
            direction: ${this.currentLang === 'fa' ? 'rtl' : 'ltr'};
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Auto-save functionality
    initAutoSave() {
        // Load saved data
        this.loadAutoSave();
        
        // Save on page unload
        window.addEventListener('beforeunload', () => this.autoSave());
        
        // Auto-save interval
        this.autoSaveInterval = setInterval(() => this.autoSave(), 30000); // هر 30 ثانیه
    }
    
    autoSave() {
        const formData = {};
        
        this.inputs.forEach(input => {
            if (input.name && !input.disabled) {
                formData[input.name] = input.value;
            }
        });
        
        localStorage.setItem(`form_${this.form.id}_autosave`, JSON.stringify(formData));
    }
    
    loadAutoSave() {
        const savedData = localStorage.getItem(`form_${this.form.id}_autosave`);
        
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                
                this.inputs.forEach(input => {
                    if (input.name && formData[input.name] !== undefined) {
                        input.value = formData[input.name];
                    }
                });
                
                // Show restore notification
                this.showNotification(this.translations[this.currentLang].restored, 'info');
                
            } catch (error) {
                console.error('Failed to load auto-saved data:', error);
            }
        }
    }
    
    clearAutoSave() {
        localStorage.removeItem(`form_${this.form.id}_autosave`);
        clearInterval(this.autoSaveInterval);
    }
    
    handleReset() {
        this.clearAutoSave();
        this.inputs.forEach(input => this.clearError(input));
        
        // Re-init auto-save after reset
        this.initAutoSave();
    }
    
    // Form analytics
    trackFieldInteractions() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.trackEvent('field_focus', {
                    field: input.name || input.id,
                    form: this.form.id,
                    language: this.currentLang
                });
            });
            
            input.addEventListener('blur', () => {
                this.trackEvent('field_blur', {
                    field: input.name || input.id,
                    form: this.form.id,
                    language: this.currentLang,
                    value_length: input.value.length
                });
            });
        });
        
        // Track form submission attempts
        this.form.addEventListener('submit', () => {
            this.trackEvent('form_submit_attempt', {
                form: this.form.id,
                language: this.currentLang,
                valid: this.validateForm()
            });
        });
    }
    
    trackEvent(eventName, data) {
        // Implement your analytics tracking here
        if (console && console.log) {
            console.log(`[Form Analytics] Event: ${eventName}`, data);
        }
        
        // Example with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Send to your custom analytics endpoint
        this.sendAnalyticsData(eventName, data);
    }
    
    async sendAnalyticsData(eventName, data) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventName,
                    data: data,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            // Silent fail for analytics
        }
    }
    
    // Utility methods
    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData);
    }
    
    setFormData(data) {
        Object.keys(data).forEach(key => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
    
    destroy() {
        // Cleanup event listeners
        this.form.removeEventListener('submit', this.handleSubmit);
        this.inputs.forEach(input => {
            input.removeEventListener('input', this.handleInputChange);
            input.removeEventListener('blur', this.validateField);
            input.removeEventListener('focus', this.clearError);
        });
        
        // Clear auto-save interval
        clearInterval(this.autoSaveInterval);
        
        // Remove from global forms array
        const index = FormHandler.forms.indexOf(this);
        if (index > -1) {
            FormHandler.forms.splice(index, 1);
        }
    }
}

// Global forms registry
FormHandler.forms = [];

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[id]');
    
    forms.forEach(form => {
        const handler = new FormHandler(form.id);
        FormHandler.forms.push(handler);
    });
});

// Global form functions
window.FormHandler = FormHandler;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}