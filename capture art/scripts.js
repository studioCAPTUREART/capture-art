document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Custom Cursor Removed


    // 3. Navbar and Mobile Menu
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('is-active');
        mobileOverlay.classList.toggle('active');
        if (mobileOverlay.classList.contains('active')) {
            lenis.stop(); // Prevent scrolling when menu is open
        } else {
            lenis.start();
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
            // Lenis handles anchor jumping smoothly
        });
    });

    // 4. Removed Vanta.js Background for static image


    // 5. Visualizer Removed


    // 6. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Reveal
    const tl = gsap.timeline();
    tl.from('.soundwave-header', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from('.line-wrap .line', { y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out" }, "-=0.4")
      .from('.fade-up', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.6");

    // Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Trigger when top of element hits 85% of viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Removed Parallax Section Logic as elements are not present

    // Count Up Animation
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                let startValue = { val: 0 };
                gsap.to(startValue, {
                    val: target,
                    duration: 2,
                    ease: "power1.out",
                    onUpdate: () => {
                        counter.innerHTML = Math.ceil(startValue.val);
                    }
                });
            }
        });
    });

    // Expanding Cards
    const expandCards = document.querySelectorAll('.expand-card');
    expandCards.forEach(card => {
        card.addEventListener('click', () => {
            const wasActive = card.classList.contains('active');
            expandCards.forEach(c => c.classList.remove('active'));
            if (!wasActive || window.innerWidth > 992) {
                card.classList.add('active');
                
                // On mobile, scroll to the card nicely
                if (window.innerWidth <= 992) {
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            }
        });
    });

    // Work Showcase — Tab Switching
    const workTabs = document.querySelectorAll('.work-tab');
    const workPanels = document.querySelectorAll('.work-panel');

    workTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            workTabs.forEach(t => t.classList.remove('active'));
            workPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetPanel = document.getElementById('panel-' + category);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // Work Showcase — Click-to-Play (thumbnail → iframe)
    document.querySelectorAll('.video-card[data-video-id]').forEach(card => {
        const triggerPlay = () => {
            const videoId = card.getAttribute('data-video-id');
            const thumbWrap = card.querySelector('.video-thumb-wrap');
            if (!videoId || !thumbWrap || thumbWrap.querySelector('iframe')) return;

            // Hide thumbnail elements
            const thumb = thumbWrap.querySelector('.video-thumb');
            const overlay = thumbWrap.querySelector('.video-thumb-overlay');
            const badge = thumbWrap.querySelector('.vid-number');
            if (thumb) thumb.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
            if (badge) badge.style.display = 'none';

            // Inject iframe
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.title = 'YouTube Video';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            thumbWrap.appendChild(iframe);
        };

        card.addEventListener('click', triggerPlay);
        
        // Prevent bubbling for the external link
        const ytLink = card.querySelector('.yt-link');
        if (ytLink) {
            ytLink.addEventListener('click', (e) => e.stopPropagation());
        }
    });

    // Founder Flip Cards — Mobile tap-to-flip support
    document.querySelectorAll('.founder-full-flip').forEach(flipCard => {
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('flipped');
        });
    });
});

// Toggle Languages Feature
function toggleLanguages(containerId) {
    const container = document.getElementById(containerId);
    const hiddenChips = container.querySelectorAll('.lang-chip.hidden, .lang-chip.visible');
    const btn = container.nextElementSibling;
    const btnText = btn.querySelector('span');

    hiddenChips.forEach(chip => {
        if (chip.classList.contains('hidden')) {
            chip.classList.remove('hidden');
            chip.classList.add('visible');
            gsap.from(chip, { opacity: 0, scale: 0.8, duration: 0.3, stagger: 0.05 });
        } else {
            chip.classList.add('hidden');
            chip.classList.remove('visible');
        }
    });

    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        btnText.innerText = 'Show More';
    } else {
        btn.classList.add('active');
        btnText.innerText = 'Show Less';
    }
}
