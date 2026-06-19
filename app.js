// ===== FOOTER INTERACTIVE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Smooth Hover Ripple Effect on Columns ---
    const columns = document.querySelectorAll('.col1, .col2, .col3');

    columns.forEach(col => {
        col.addEventListener('mouseenter', (e) => {
            col.style.transition = 'transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        });

        col.addEventListener('click', (e) => {
            createRipple(col, e);
        });
    });

    function createRipple(element, event) {
        const existing = element.querySelector('.ripple');
        if (existing) existing.remove();

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(233, 69, 96, 0.15);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnim 0.6s ease forwards;
            pointer-events: none;
            z-index: 0;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
    }

    // Inject ripple keyframe
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnim {
            to { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // --- 2. Category Links — Active Highlight on Click ---
    const categoryLinks = document.querySelectorAll('.col3 ul li a');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // prevent empty href navigation

            // Remove active from others
            categoryLinks.forEach(l => {
                l.style.color = '';
                l.style.fontWeight = '';
            });

            // Highlight clicked
            link.style.color = '#4fc3f7';
            link.style.fontWeight = '600';

            // Flash animation feedback
            link.animate([
                { opacity: 0.4, transform: 'scale(0.97)' },
                { opacity: 1, transform: 'scale(1)' }
            ], { duration: 250, easing: 'ease-out' });

            console.log(`Category selected: ${link.textContent.trim()}`);
        });
    });

    // --- 3. Gmail Link — Copy to Clipboard on Click ---
    const gmailLink = document.querySelector('.col2 a');

    if (gmailLink) {
        gmailLink.addEventListener('click', (e) => {
            e.preventDefault();

            const email = gmailLink.textContent.trim();

            navigator.clipboard.writeText(email).then(() => {
                showToast('📋 Email copied to clipboard!');
            }).catch(() => {
                showToast('📧 ' + email);
            });
        });
    }

    // --- 4. Toast Notification ---
    function showToast(message) {
        const existing = document.querySelector('.footer-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.classList.add('footer-toast');
        toast.textContent = message;

        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: linear-gradient(135deg, #1a1a2e, #0f3460);
            color: #eceff1;
            font-family: 'Outfit', sans-serif;
            font-size: 0.9rem;
            padding: 12px 28px;
            border-radius: 50px;
            border: 1px solid rgba(233,69,96,0.4);
            box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(233,69,96,0.2);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            white-space: nowrap;
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // --- 5. Copyright Year Auto-Update ---
    const copyright = document.querySelector('footer > p');
    if (copyright) {
        const currentYear = new Date().getFullYear();
        copyright.innerHTML = `&copy; copyrights@${currentYear}`;
    }

    // --- 6. Scroll Reveal on Footer Columns ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    columns.forEach(col => {
        col.style.animationPlayState = 'paused';
        observer.observe(col);
    });

    console.log('✅ Footer JS loaded successfully.');
});
