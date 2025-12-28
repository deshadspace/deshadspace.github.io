// ========================================
// DeshadSpace 2.0 - Enhanced JavaScript
// Next-Level Interactions + Alien Invasion Easter Egg
// ========================================

// ========================================
// Mobile Detection
// ========================================
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
};

const isDesktop = window.innerWidth >= 1024 && !isTouchDevice();

// ========================================
// Enhanced Rocket Cursor (Desktop Only) + Alien Invasion
// ========================================
if (isDesktop) {
    const rocket = document.getElementById('rocket');
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let invasionStarted = false;
    let rocketAlive = true;
    let hoverTimer;
    const aliens = [];
    const alienBullets = [];
    const rocketBullets = [];
    
    if (rocket) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            if (rocketAlive) {
                // Update rocket position
                rocket.style.left = x + 'px';
                rocket.style.top = y + 'px';
                
                // Calculate rotation
                const deltaX = x - lastX;
                const deltaY = y - lastY;
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                rocket.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;
            }
            
            lastX = x;
            lastY = y;
            
            // Enhanced trail with random variation
            if (Math.random() > 0.7) {
                const trail = document.createElement('div');
                trail.className = 'trail';
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                trail.style.left = (x + offsetX) + 'px';
                trail.style.top = (y + offsetY) + 'px';
                document.body.appendChild(trail);
                
                setTimeout(() => trail.remove(), 600);
            }
        });

        // Alien Invasion Easter Egg (INDEX PAGE ONLY)
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Hover detection to start invasion
            heroSection.addEventListener('mouseenter', () => { 
                hoverTimer = setTimeout(startInvasion, 30000); 
            });
            heroSection.addEventListener('mouseleave', () => { 
                clearTimeout(hoverTimer); 
            });

            // Start invasion
            function startInvasion() {
                if (invasionStarted) return;
                invasionStarted = true;
                spawnAliens(7);
                requestAnimationFrame(updateAliens);
            }

            // Spawn aliens
            function spawnAliens(count) {
                for (let i = 0; i < count; i++) {
                    const alien = document.createElement('img');
                    alien.src = 'images/alien.png'; 
                    alien.className = 'alien';
                    alien.style.width = '30px';
                    alien.style.height = '30px';
                    alien.style.position = 'absolute';
                    alien.style.top = Math.random() * window.innerHeight / 2 + 'px';
                    alien.style.left = Math.random() * window.innerWidth + 'px';
                    alien.style.zIndex = '9998';
                    document.body.appendChild(alien);

                    aliens.push({
                        el: alien,
                        dx: (Math.random() * 2 - 1) * 2,
                        dy: (Math.random() * 2 - 1) * 2
                    });
                }
            }

            // Update aliens and bullets
            function updateAliens() {
                aliens.forEach((alienObj, idx) => {
                    const { el } = alienObj;
                    let top = parseFloat(el.style.top);
                    let left = parseFloat(el.style.left);

                    top += alienObj.dy;
                    left += alienObj.dx;

                    // Bounce edges
                    if (top < 0 || top > window.innerHeight-30) alienObj.dy *= -1;
                    if (left < 0 || left > window.innerWidth-30) alienObj.dx *= -1;

                    el.style.top = top + 'px';
                    el.style.left = left + 'px';

                    // Random shooting
                    if (Math.random() < 0.02 && rocketAlive) shootAlienBullet(el);
                });

                // Update alien bullets
                alienBullets.forEach((b, idx) => {
                    b.el.style.top = parseFloat(b.el.style.top) + b.vy + 'px';
                    b.el.style.left = parseFloat(b.el.style.left) + b.vx + 'px';

                    if (rocketAlive) {
                        const rRect = rocket.getBoundingClientRect();
                        const bRect = b.el.getBoundingClientRect();
                        if (!(bRect.right < rRect.left || bRect.left > rRect.right ||
                              bRect.bottom < rRect.top || bRect.top > rRect.bottom)) {
                            
                            rocket.style.display = 'none';
                            rocketAlive = false;
                        }
                    }

                    if (parseFloat(b.el.style.top) < 0 || parseFloat(b.el.style.top) > window.innerHeight ||
                        parseFloat(b.el.style.left) < 0 || parseFloat(b.el.style.left) > window.innerWidth) {
                        b.el.remove();
                        alienBullets.splice(idx,1);
                    }
                });

                // Update rocket bullets
                rocketBullets.forEach((b, idx) => {
                    b.el.style.left = parseFloat(b.el.style.left) + b.dx + 'px';
                    b.el.style.top = parseFloat(b.el.style.top) + b.dy + 'px';

                    aliens.forEach((alienObj, aIdx) => {
                        const aRect = alienObj.el.getBoundingClientRect();
                        const bRect = b.el.getBoundingClientRect();
                        if (!(bRect.right < aRect.left || bRect.left > aRect.right ||
                              bRect.bottom < aRect.top || bRect.top > aRect.bottom)) {
                            alienObj.el.remove();
                            aliens.splice(aIdx,1);
                            b.el.remove();
                            rocketBullets.splice(idx,1);
                        }
                    });

                    if (parseFloat(b.el.style.left) < 0 || parseFloat(b.el.style.left) > window.innerWidth ||
                        parseFloat(b.el.style.top) < 0 || parseFloat(b.el.style.top) > window.innerHeight) {
                        b.el.remove();
                        rocketBullets.splice(idx,1);
                    }
                });

                requestAnimationFrame(updateAliens);
            }

            // Alien shooting toward rocket
            function shootAlienBullet(alienEl) {
                const bullet = document.createElement('div');
                bullet.className = 'bullet';
                bullet.style.position = 'absolute';
                bullet.style.width = '6px';
                bullet.style.height = '6px';
                bullet.style.background = 'rgb(108, 255, 2)';
                bullet.style.borderRadius = '50%';
                bullet.style.pointerEvents = 'none';
                bullet.style.zIndex = '9998';
                document.body.appendChild(bullet);

                const aRect = alienEl.getBoundingClientRect();
                const startX = aRect.left + aRect.width/2;
                const startY = aRect.top + aRect.height/2;
                bullet.style.left = startX + 'px';
                bullet.style.top = startY + 'px';

                const rRect = rocket.getBoundingClientRect();
                const dx = (rRect.left + rRect.width/2) - startX;
                const dy = (rRect.top + rRect.height/2) - startY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const speed = 4;

                alienBullets.push({ el: bullet, vx: dx/dist*speed, vy: dy/dist*speed });

                // Fade bullet after 3s
                setTimeout(() => bullet.style.opacity = '0', 0);
                setTimeout(() => bullet.remove(), 3000);
            }

            // Rocket shooting toward mouse click
            document.addEventListener('click', (e) => {
                if (!invasionStarted || !rocketAlive) return;

                const rRect = rocket.getBoundingClientRect();
                const startX = rRect.left + rRect.width/2;
                const startY = rRect.top + rRect.height/2;

                const bullet = document.createElement('div');
                bullet.className = 'bullet';
                bullet.style.position = 'absolute';
                bullet.style.width = '6px';
                bullet.style.height = '6px';
                bullet.style.background = 'rgb(108, 255, 2)';
                bullet.style.borderRadius = '50%';
                bullet.style.pointerEvents = 'none';
                bullet.style.zIndex = '9998';
                bullet.style.left = startX + 'px';
                bullet.style.top = startY + 'px';
                document.body.appendChild(bullet);

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const speed = 6;

                rocketBullets.push({ el: bullet, dx: dx/dist*speed, dy: dy/dist*speed });

                // Fade bullet after 3s
                setTimeout(() => bullet.style.opacity = '0', 0);
                setTimeout(() => bullet.remove(), 3000);
            });
        }
    }
}

// ========================================
// Mobile Navigation Toggle
// ========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.querySelector('nav');
let lastScroll = 0;

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// ========================================
// Magnetic Button Effect (Desktop Only)
// ========================================
if (isDesktop) {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ========================================
// 3D Card Tilt Effect (Desktop Only)
// ========================================
if (isDesktop) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ========================================
// Smooth Scroll to Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Skill Bars Animation on Scroll
// ========================================
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
            
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ========================================
// Active Navigation Link Based on Scroll
// ========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight : 0) - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (navLink) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ========================================
// Parallax Effect on Hero (Desktop Only)
// ========================================
if (isDesktop) {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
}

// ========================================
// Console Easter Egg
// ========================================
console.log('%c🚀 DeshadSpace 2.0', 'color: #00bcd4; font-size: 24px; font-weight: bold;');
console.log('%cExploring Space, Code, and Beyond', 'color: #ff9800; font-size: 14px;');
console.log('%c\nInterested in collaboration? Let\'s connect!', 'color: #cccccc; font-size: 12px;');
console.log('%cGitHub: https://github.com/deshadspace', 'color: #00bcd4; font-size: 12px;');
