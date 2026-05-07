// Interactive functionality for Miniversity Daycare

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with a public key
    (function() {
        emailjs.init("public_key_placeholder");
    })();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add animation on scroll
    addScrollAnimations();
    
    // Add hover effects
    addHoverEffects();
    
    // Add current year to footer if exists
    updateCurrentYear();
});

function showInterestForm() {
    const modal = document.getElementById('interestForm');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeForm() {
    const modal = document.getElementById('interestForm');
    modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
    modal.querySelector('.modal-content').style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Form data submitted:', data);
    
    // Prepare complete data
    const emailData = {
        to_email: 'Miniversitycorp@gmail.com',
        from_name: data['Parent Name'] || 'Unknown',
        child_name: data['Child Name'] || 'Not provided',
        child_age: data['Child Age'] || 'Not provided',
        phone: data['Phone Number'] || 'Not provided',
        email: data['Email'] || 'Not provided',
        program: data['program'] || 'Not selected',
        message: data['Tell us about your needs...'] || 'No additional message',
        timestamp: new Date().toISOString()
    };
    
    // Save to multiple places for reliability
    saveToLocalStorage(emailData);
    downloadAsJSON(emailData);
    downloadAsCSV(emailData);
    
    // Try all possible methods
    tryAllEmailMethods(emailData);
    
    form.reset();
    closeForm();
    
    return false;
}

function tryAllEmailMethods(data) {
    let methodSuccess = false;
    
    // Method 1: Try mailto (most compatible)
    try {
        sendEmailViaMailto(data);
        showNotification('Opening your email client... Please send the email.');
        methodSuccess = true;
    } catch (error) {
        console.log('Mailto failed:', error);
    }
    
    // Method 2: Try to copy to clipboard
    try {
        copyToClipboard(data);
        if (!methodSuccess) {
            showNotification('Form data copied to clipboard! Paste it in your email.');
        }
    } catch (error) {
        console.log('Clipboard failed:', error);
    }
    
    // Method 3: Show data in console
    console.log('=== FORM DATA ===');
    console.log(data);
    console.log('Copy this data and send it manually to: Miniversitycorp@gmail.com');
    
    // Always show final message
    if (!methodSuccess) {
        showNotification('Data saved and downloaded! Check downloads and console.');
    }
}

function downloadAsJSON(data) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour_request_${data.from_name}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAsCSV(data) {
    const csvContent = `Parent Name,Child Name,Child Age,Phone,Email,Program,Message,Timestamp
"${data.from_name}","${data.child_name}","${data.child_age}","${data.phone}","${data.email}","${data.program}","${data.message}","${data.timestamp}"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour_request_${data.from_name}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function copyToClipboard(data) {
    const text = `
TO: Miniversitycorp@gmail.com
SUBJECT: Tour Request from ${data.from_name}

New Tour Request from Miniversity Daycare Website:

Parent Name: ${data.from_name}
Child Name: ${data.child_name}
Child Age: ${data.child_age}
Phone: ${data.phone}
Email: ${data.email}
Program: ${data.program}

Additional Message:
${data.message}

---
Request sent on: ${new Date().toLocaleString()}
    `.trim();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function sendEmailViaMailto(data) {
    const subject = `Tour Request - ${data.from_name}`;
    const body = `
New Tour Request from Miniversity Daycare Website:

Parent Name: ${data.from_name}
Child Name: ${data.child_name}
Child Age: ${data.child_age}
Phone: ${data.phone}
Email: ${data.email}
Program: ${data.program}

Additional Message:
${data.message}

---
Request sent on: ${new Date().toLocaleString()}
    `.trim();
    
    const mailtoLink = `mailto:${data.to_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
}

function saveToLocalStorage(data) {
    // Save to localStorage as backup
    const requests = JSON.parse(localStorage.getItem('tourRequests') || '[]');
    requests.push({
        ...data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('tourRequests', JSON.stringify(requests));
    
    console.log('Request saved to localStorage:', data);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function addSmoothScrolling() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all line containers
    document.querySelectorAll('.line-container').forEach(el => {
        observer.observe(el);
    });
}

function addHoverEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('interestForm');
    if (event.target === modal) {
        closeForm();
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeForm();
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Function to view all tour requests (for admin)
function viewTourRequests() {
    const requests = JSON.parse(localStorage.getItem('tourRequests') || '[]');
    
    if (requests.length === 0) {
        showNotification('No tour requests found.');
        return;
    }
    
    console.log('=== ALL TOUR REQUESTS ===');
    requests.forEach((request, index) => {
        console.log(`\nRequest #${index + 1}:`);
        console.log('Parent:', request.from_name);
        console.log('Child:', request.child_name);
        console.log('Age:', request.child_age);
        console.log('Phone:', request.phone);
        console.log('Email:', request.email);
        console.log('Program:', request.program);
        console.log('Message:', request.message);
        console.log('Date:', new Date(request.timestamp).toLocaleString());
        console.log('---');
    });
    
    showNotification(`Found ${requests.length} tour request(s). Check console for details.`);
}

// Function to clear all requests (for admin)
function clearTourRequests() {
    if (confirm('Are you sure you want to clear all tour requests?')) {
        localStorage.removeItem('tourRequests');
        showNotification('All tour requests cleared.');
    }
}

// Add keyboard shortcuts for admin
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+V to view requests
    if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        viewTourRequests();
    }
    // Ctrl+Shift+C to clear requests
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearTourRequests();
    }
});
