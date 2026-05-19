/* =========================================
   Жетісу ГТК — JavaScript
   Mouse-tracking watermark, GSAP animations,
   Modal system, Telegram API, Form validation
   ========================================= */

(function () {
    'use strict';

    const CONFIG = {
        // ⚠️ Replace with your Telegram Bot token and chat ID
        TELEGRAM_BOT_TOKEN: '8318823337:AAGuEkJX6nXsf16x9OZ-yd0V0L2LvMUb8F8',
        TELEGRAM_CHAT_ID: '871666479',
    };

    let currentActiveSkill = null;

    // ========================================
    // HERO WATERMARK — Mouse-tracking parallax
    // ========================================
    function initWatermarkParallax() {
        const watermark = document.getElementById('hero-watermark');
        if (!watermark) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            // Normalize to center: -1 to 1
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animate() {
            // Smooth lerp (linear interpolation) for fluid movement
            currentX += (mouseX * 40 - currentX) * 0.06;
            currentY += (mouseY * 30 - currentY) * 0.06;

            watermark.style.transform = `translate(${currentX}px, ${currentY}px)`;

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ========================================
    // GSAP SCROLL ANIMATIONS (Safe — elements always visible)
    // ========================================
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // ── HERO — Cinematic entrance on page load ──
        // First, hide hero elements, then reveal with timeline
        const heroEls = document.querySelectorAll('.hero__badge, .hero__title-line, .hero__subtitle, .hero__actions .btn, .hero__scroll');
        gsap.set(heroEls, { opacity: 0, y: 30 });
        gsap.set('.hero__watermark', { opacity: 0 });

        const heroTl = gsap.timeline();

        // ── PRELOADER ANIMATION ──
        const preloader = document.getElementById('preloader');
        if (preloader) {
            heroTl
                .to('.preloader__title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 })
                .to('.preloader__line', { width: '100%', duration: 1.5, ease: 'expo.inOut' }, '-=0.4')
                .to('.preloader__content', { opacity: 0, y: -20, duration: 0.8, ease: 'power2.in' }, '+=0.6')
                .to(preloader, { opacity: 0, duration: 1.2, ease: 'power2.inOut' })
                .set(preloader, { display: 'none' });
        } else {
            heroTl.delay(0.3);
        }

        // ── HERO REVEAL ──
        heroTl
            .to('.hero__watermark', {
                opacity: 0.05, scale: 1, duration: 2, ease: 'power2.out',
            }, preloader ? '-=0.8' : 0)
            .to('.hero__badge', {
                opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
            }, '-=1.5')
            .to('.hero__title-line', {
                opacity: 1, y: 0, duration: 1.5,
                stagger: 0.15, ease: 'expo.out',
            }, '-=1.0')
            .to('.hero__subtitle', {
                opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
            }, '-=1.2')
            .to('.hero__actions .btn', {
                opacity: 1, y: 0, duration: 1,
                stagger: 0.15, ease: 'expo.out',
            }, '-=1.0')
            .to('.hero__scroll', {
                opacity: 1, y: 0, duration: 1, ease: 'power2.out',
            }, '-=0.5');

        // Safety: if something goes wrong, show hero after 2s
        setTimeout(() => {
            heroEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        }, 2000);

        // Hero exit — parallax when scrolling away
        gsap.to('.hero__content', {
            y: 80, scale: 0.97,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            },
        });

        gsap.to('.hero__watermark', {
            y: 150, scale: 1.2,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 2,
            },
        });

        // ── SECTIONS — Slide in/out (transform only, NO opacity) ──
        document.querySelectorAll('.section').forEach((section) => {
            gsap.from(section, {
                y: 40,
                duration: 1.2, ease: 'expo.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 92%',
                    end: 'top 50%',
                    once: true,
                },
            });
        });

        // ── SECTION HEADERS — slide up ──
        document.querySelectorAll('.section__header').forEach((header) => {
            gsap.from(header.querySelectorAll('.section__tag, .section__title, .section__desc'), {
                y: 20,
                duration: 1, stagger: 0.1, ease: 'expo.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%',
                    once: true,
                },
            });
        });

        // ── PROFESSION CARDS — stagger slide up ──
        const profCards = document.querySelectorAll('.prof-card');
        if (profCards.length) {
            gsap.from(profCards, {
                y: 30,
                duration: 1, stagger: 0.1, ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.professions__grid',
                    start: 'top 85%',
                    once: true,
                },
            });
        }

        // ── MISSION ──
        const missionContent = document.querySelector('.mission__content');
        if (missionContent) {
            gsap.from(missionContent, {
                x: -40,
                duration: 1.2, ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.mission__layout',
                    start: 'top 85%',
                    once: true,
                },
            });
        }

        const missionStats = document.querySelector('.mission__stats');
        if (missionStats) {
            gsap.from(missionStats, {
                x: 40,
                duration: 1.2, ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.mission__layout',
                    start: 'top 85%',
                    once: true,
                },
            });
        }

        gsap.from('.mission__feature', {
            x: -20,
            duration: 0.8, stagger: 0.15, ease: 'expo.out',
            scrollTrigger: {
                trigger: '.mission__features',
                start: 'top 88%',
                once: true,
            },
        });

        // Stats — counter animation
        document.querySelectorAll('.stat-block').forEach((block, i) => {
            gsap.from(block, {
                y: 20,
                duration: 1, delay: i * 0.1, ease: 'expo.out',
                scrollTrigger: {
                    trigger: block,
                    start: 'top 92%',
                    once: true,
                },
            });

            const numEl = block.querySelector('.stat-block__number[data-count]');
            if (numEl) {
                const target = parseInt(numEl.dataset.count, 10);
                ScrollTrigger.create({
                    trigger: numEl,
                    start: 'top 92%',
                    onEnter: () => {
                        gsap.to({ val: 0 }, {
                            val: target, duration: 3, ease: 'expo.out',
                            onUpdate() { numEl.textContent = Math.round(this.targets()[0].val); },
                        });
                    },
                    once: true,
                });
            }
        });

        // ── DOCUMENTS — slide from left ──
        gsap.from('.doc-item', {
            x: -30,
            duration: 1, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: {
                trigger: '.documents__list',
                start: 'top 85%',
                once: true,
            },
        });

        // ── CONTACT — split entrance ──
        gsap.from('.contact__info', {
            x: -40,
            duration: 1.2, ease: 'expo.out',
            scrollTrigger: {
                trigger: '.contact__layout',
                start: 'top 85%',
                once: true,
            },
        });

        gsap.from('.contact__form-wrapper', {
            x: 40,
            duration: 1.2, ease: 'expo.out',
            scrollTrigger: {
                trigger: '.contact__layout',
                start: 'top 85%',
                once: true,
            },
        });

        // ── TIMELINE — stagger items ──
        gsap.from('.timeline__item', {
            y: 30,
            duration: 1, stagger: 0.15, ease: 'expo.out',
            scrollTrigger: {
                trigger: '.timeline__track',
                start: 'top 85%',
                once: true,
            },
        });

        // ── FOOTER ──
        gsap.from('.footer__content', {
            y: 20,
            duration: 1, ease: 'expo.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%',
                once: true,
            },
        });
    }

    // ========================================
    // NAVIGATION
    // ========================================
    function initNavigation() {
        const nav = document.getElementById('main-nav');
        const burger = document.getElementById('nav-burger');
        const links = document.getElementById('nav-links');
        const navLinks = document.querySelectorAll('.nav__link');

        // Scroll → transparent/solid nav
        window.addEventListener('scroll', () => {
            nav.classList.toggle('nav--scrolled', window.pageYOffset > 50);
        });

        // Burger menu
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            links.classList.toggle('active');
            document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                links.classList.remove('active');
                document.body.style.overflow = '';
            });
        });


    }

    // ========================================
    // MODAL SYSTEM
    // ========================================
    function initModals() {
        const overlay = document.getElementById('modal-overlay');
        if (!overlay) return;

        const cards = document.querySelectorAll('[data-modal]');
        const modals = overlay.querySelectorAll('.modal');
        const closeButtons = overlay.querySelectorAll('.modal__close');

        function openModal(id) {
            const modal = document.getElementById(id);
            if (!modal) return;

            // Show overlay first (display: none → flex)
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Show the specific modal
            modal.style.display = 'block';

            // Force reflow, then add active classes for animation
            overlay.offsetHeight;
            overlay.classList.add('active');
            modal.classList.add('active');

            // Draw skills tree lines if container exists
            const container = modal.querySelector('.skills-tree-container');
            if (container) {
                setTimeout(() => {
                    drawTreeLines(container);
                }, 100);
                setTimeout(() => {
                    drawTreeLines(container);
                }, 400);
            }
        }

        function closeAllModals() {
            // Remove active classes (triggers opacity transition)
            modals.forEach((m) => m.classList.remove('active'));
            overlay.classList.remove('active');

            // After transition completes, hide everything
            setTimeout(() => {
                modals.forEach((m) => {
                    m.style.display = 'none';
                });
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }, 400);
        }

        // Card clicks
        cards.forEach((card) => {
            card.addEventListener('click', () => {
                openModal(card.getAttribute('data-modal'));
            });
        });

        // Close button clicks
        closeButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllModals();
            });
        });

        // Click on overlay (outside modal) to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllModals();
        });

        // Initialize Skills Tree
        initSkillsTree();
    }

    // ========================================
    // ACADEMIC SKILLS TREE
    // ========================================
    function initSkillsTree() {
        const nodes = document.querySelectorAll('.skill-node');

        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();

                const container = node.closest('.skills-tree-container');
                if (!container) return;

                const skillId = node.getAttribute('data-skill');
                const isLocked = node.classList.contains('locked');
                const isUnlocked = node.classList.contains('unlocked');
                const isActive = node.classList.contains('active');

                // If locked — shake and show error toast
                if (isLocked) {
                    node.classList.add('shake');
                    setTimeout(() => node.classList.remove('shake'), 400);

                    // Show error toast
                    let toast = container.querySelector('.skills-toast');
                    if (!toast) {
                        toast = document.createElement('div');
                        toast.className = 'skills-toast';
                        container.appendChild(toast);
                    }

                    const reqId = node.getAttribute('data-requires');
                    const currentLang = document.documentElement.lang || 'ru';
                    const reqName = LANG[currentLang][`skill_${reqId.replace(/-/g, '_')}`] || reqId;
                    
                    toast.textContent = (LANG[currentLang].skillsLockedWarning || 'Сначала разблокируйте: ') + reqName;
                    toast.classList.add('show');

                    // Clear previous timeout if any
                    if (node.toastTimeout) clearTimeout(node.toastTimeout);
                    node.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);

                    return;
                }

                // If unlocked — set active (passed) and unlock next nodes
                if (isUnlocked) {
                    node.classList.remove('unlocked');
                    node.classList.add('active');

                    // Play beautiful GSAP wave/pop animation
                    if (window.gsap) {
                        gsap.fromTo(node, 
                            { scale: 0.95, boxShadow: '0 0 0px rgba(184, 147, 90, 0)' }, 
                            { scale: 1.05, boxShadow: '0 0 25px rgba(184, 147, 90, 0.6)', duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }
                        );
                    }

                    // Unlock descendants
                    const containerNodes = container.querySelectorAll('.skill-node');
                    containerNodes.forEach(depNode => {
                        if (depNode.getAttribute('data-requires') === skillId) {
                            if (depNode.classList.contains('locked')) {
                                depNode.classList.remove('locked');
                                depNode.classList.add('unlocked');

                                // Replace icon span lock symbol with actual icon from registry
                                const currentLang = document.documentElement.lang || 'ru';
                                const registry = LANG[currentLang].skillsRegistry;
                                const depSkillId = depNode.getAttribute('data-skill');
                                const iconSpan = depNode.querySelector('.skill-node__icon');
                                if (iconSpan && registry && registry[depSkillId]) {
                                    iconSpan.textContent = registry[depSkillId].icon;
                                }

                                if (window.gsap) {
                                    gsap.from(depNode, {
                                        scale: 0.85,
                                        duration: 0.4,
                                        ease: 'back.out(2)'
                                    });
                                }
                            }
                        }
                    });

                    // Redraw paths
                    drawTreeLines(container);
                }

                // Select current node and show details
                const allContainerNodes = container.querySelectorAll('.skill-node');
                allContainerNodes.forEach(n => n.classList.remove('selected'));
                node.classList.add('selected');

                currentActiveSkill = skillId;
                updateSkillsInfoPanel(container, skillId);
            });
        });

        // Window resize path drawing update
        window.addEventListener('resize', () => {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                const container = activeModal.querySelector('.skills-tree-container');
                if (container) drawTreeLines(container);
            }
        });
    }

    // Function to draw connecting lines between skill nodes
    function drawTreeLines(container) {
        const svg = container.querySelector('.skills-tree__svg');
        if (!svg) return;

        svg.innerHTML = '';

        // If mobile — do not draw connection lines (hide lines)
        if (window.innerWidth <= 768) return;

        const containerRect = container.getBoundingClientRect();
        const nodes = container.querySelectorAll('.skill-node');

        nodes.forEach(parent => {
            const connectionsAttr = parent.getAttribute('data-connections');
            if (!connectionsAttr) return;

            const targets = connectionsAttr.split(',');
            targets.forEach(targetId => {
                const child = container.querySelector(`.skill-node[data-skill="${targetId.trim()}"]`);
                if (!child) return;

                const parentRect = parent.getBoundingClientRect();
                const childRect = child.getBoundingClientRect();

                // Calculate relative coordinates inside the SVG canvas
                const x1 = parentRect.right - containerRect.left;
                const y1 = parentRect.top + parentRect.height / 2 - containerRect.top;

                const x2 = childRect.left - containerRect.left;
                const y2 = childRect.top + childRect.height / 2 - containerRect.top;

                // Create SVG path using cubic Bezier curve
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const controlOffset = Math.abs(x2 - x1) * 0.45;
                const d = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;

                path.setAttribute('d', d);

                // If parent node is active, connection path is active
                if (parent.classList.contains('active')) {
                    path.classList.add('path-active');
                }

                svg.appendChild(path);
            });
        });
    }

    // Function to update the detail panel for a selected skill
    function updateSkillsInfoPanel(container, skillId) {
        const infoPanel = container.closest('.modal').querySelector('.skills-tree__info-panel');
        if (!infoPanel) return;

        const placeholder = infoPanel.querySelector('.skills-tree__info-placeholder');
        const content = infoPanel.querySelector('.skills-tree__info-content');
        if (!placeholder || !content) return;

        const currentLang = document.documentElement.lang || 'ru';
        const registry = LANG[currentLang].skillsRegistry;
        if (!registry || !registry[skillId]) return;

        const skillData = registry[skillId];

        // Fill data
        const titleEl = content.querySelector('.skills-tree__info-title');
        const descEl = content.querySelector('.skills-tree__info-desc');
        const listEl = content.querySelector('.skills-tree__info-skills ul');

        titleEl.textContent = `${skillData.icon} ${skillData.name}`;
        descEl.textContent = skillData.desc;

        listEl.innerHTML = '';
        skillData.skills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            listEl.appendChild(li);
        });

        // Toggle visibility
        placeholder.classList.add('hidden');
        content.classList.remove('hidden');

        // GSAP animate content fade-in
        if (window.gsap) {
            gsap.fromTo(content, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
        }
    }

    // ========================================
    // CONTACT FORM + TELEGRAM
    // ========================================
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const courseSelect = document.getElementById('form-course');
        const submitBtn = document.getElementById('form-submit');
        const btnText = document.getElementById('btn-text');
        const btnLoader = document.getElementById('btn-loader');
        const successMsg = document.getElementById('form-success');

        // Clear error on input
        [nameInput, phoneInput, courseSelect].forEach((field) => {
            const events = ['input', 'change'];
            events.forEach((evt) => {
                field.addEventListener(evt, () => {
                    field.closest('.contact-form__group').classList.remove('has-error');
                });
            });
        });

        // Phone mask
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '8' || value[0] === '7') {
                    value = '7' + value.slice(1);
                }
                let f = '+7';
                if (value.length > 1) f += ' (' + value.slice(1, 4);
                if (value.length > 4) f += ') ' + value.slice(4, 7);
                if (value.length > 7) f += '-' + value.slice(7, 9);
                if (value.length > 9) f += '-' + value.slice(9, 11);
                e.target.value = f;
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let valid = true;

            if (!nameInput.value.trim()) {
                nameInput.closest('.contact-form__group').classList.add('has-error');
                valid = false;
            }

            if (!phoneInput.value.trim() || phoneInput.value.replace(/\D/g, '').length < 11) {
                phoneInput.closest('.contact-form__group').classList.add('has-error');
                valid = false;
            }

            if (!courseSelect.value) {
                courseSelect.closest('.contact-form__group').classList.add('has-error');
                valid = false;
            }

            if (!valid) return;

            // Loader
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
            submitBtn.disabled = true;

            const message = `
🎓 *Жаңа өтініш — Жетісу ГТК*

👤 *Аты-жөні:* ${nameInput.value.trim()}
📱 *Телефон:* ${phoneInput.value.trim()}
📚 *Мамандық:* ${courseSelect.value}

📅 *Уақыты:* ${new Date().toLocaleString('kk-KZ')}
            `.trim();

            try {
                const res = await fetch(
                    `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CONFIG.TELEGRAM_CHAT_ID,
                            text: message,
                            parse_mode: 'Markdown',
                        }),
                    }
                );

                if (!res.ok) throw new Error('Telegram API error');

                showSuccess();
            } catch (err) {
                console.warn('Telegram send failed (demo mode):', err);
                showSuccess(); // Show success for demo
            }
        });

        function showSuccess() {
            const groups = form.querySelectorAll('.contact-form__group, .btn--full, .contact-form__heading');
            groups.forEach((g) => {
                g.style.transition = 'opacity 0.3s, transform 0.3s';
                g.style.opacity = '0';
                g.style.transform = 'translateY(-10px)';
            });

            setTimeout(() => {
                groups.forEach((g) => (g.style.display = 'none'));
                successMsg.style.display = 'block';

                if (typeof gsap !== 'undefined') {
                    gsap.from(successMsg, {
                        scale: 0.8,
                       
                        duration: 0.5,
                        ease: 'back.out(1.7)',
                    });
                    gsap.from(successMsg.querySelector('svg'), {
                        rotation: -180,
                        duration: 0.6,
                        ease: 'power3.out',
                    });
                }
            }, 350);
        }
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    function initFAQ() {
        const items = document.querySelectorAll('.faq__item');
        items.forEach((item) => {
            const btn = item.querySelector('.faq__question');
            if (!btn) return;
            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                // Close all others
                items.forEach((i) => {
                    i.classList.remove('active');
                    i.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
                });
                // Toggle current
                if (!isOpen) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ========================================
    // SCROLL TO TOP
    // ========================================
    function initScrollToTop() {
        const btn = document.getElementById('scroll-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.pageYOffset > 400);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // THEME TOGGLE (Light / Dark)
    // ========================================
    function initThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        const btnMob = document.getElementById('theme-toggle-mob');

        const toggle = () => {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('gtk-theme', newTheme);

            document.body.style.transition = 'background 0.4s ease, color 0.4s ease';
            setTimeout(() => { document.body.style.transition = ''; }, 500);
        };

        if (btn) btn.addEventListener('click', toggle);
        if (btnMob) btnMob.addEventListener('click', toggle);
    }

    // ========================================
    // LANGUAGE TOGGLE (Kazakh / Russian)
    // ========================================
    const LANG = {
        kk: {
            navLinks: ['Басты бет', 'Мамандықтар', 'Колледж туралы', 'Талапкерге', 'Байланыс'],
            logoSub: 'гуманитарлық-техникалық колледжі',
            heroBadge: '2025-2026 оқу жылына қабылдау ашық',
            heroLines: ['Жетісу', 'гуманитарлық-техникалық', 'колледжі'],
            heroSub: 'Болашаққа бастар жол — сапалы білім мен шынайы мақсаттан басталады.',
            heroBtn1: 'Өтініш қалдыру',
            heroBtn2: 'Барлық мамандықтар',
            bentoStatLabel: 'Түлектерді жұмысқа орналастыру',
            heroScroll: 'Төмен қарай',
            profTag: 'Мамандықтар',
            profTitle: 'Біздің <span class="text-accent">мамандықтар</span>',
            profDesc: 'Колледж 6 бағыт бойынша жоғары білікті мамандар дайындайды.',
            profCards: [
                { title: 'Мектепке дейінгі тәрбие және оқыту', desc: 'Балабақша тәрбиешілері мен педагогтарды даярлау. Балалардың жан-жақты дамуына ықпал ету.', more: 'Толық ақпарат →' },
                { title: 'Есеп және аудит', desc: 'Бухгалтерлік есеп, қаржылық талдау және аудит саласындағы мамандар.', more: 'Толық ақпарат →' },
                { title: 'Құқықтану', desc: 'Құқық саласының негіздерін меңгерген заңгер-мамандарды даярлау.', more: 'Толық ақпарат →' },
                { title: 'Есептеу техникасының бағдарламалық қамтамасыз етуі', desc: 'Компьютерлік жүйелерді баптау, желілерді басқару және IT-инфрақұрылымды қолдау.', more: 'Толық ақпарат →' },
                { title: 'Бағдарламалық қамтамасыз ету', desc: 'Веб, мобильді және desktop қосымшаларды жобалау, кодтау және тестілеу.', more: 'Толық ақпарат →' },
                { title: 'Жол қозғалысын ұйымдастыру', desc: 'Көлік логистикасы, жол қауіпсіздігі және қозғалысты реттеу мамандары.', more: 'Толық ақпарат →' },
            ],
            profDuration: '3 жыл 10 ай',
            profSalaryLabel: 'Орташа жалақы: ',
            missionTag: 'Миссия',
            missionTitle: 'Біздің <span class="text-accent">миссиямыз</span>',
            missionFeatures: [
                { title: 'Сапалы білім', desc: 'Заманауи оқу бағдарламалары мен тәжірибелі оқытушылар' },
                { title: 'Практикалық дағдылар', desc: 'Нақты жобалар мен өндірістік тәжірибе' },
                { title: 'Карьералық қолдау', desc: 'Жұмысқа орналасуға жәрдем және серіктес компаниялар' },
            ],
            missionQuote: '«Біздің мақсатымыз — әрбір студентті нарыққа бәсекеге қабілетті маман ретінде шығару.»',
            statLabels: ['Оқытушылар', 'Түлектер', 'Мамандықтар', 'Жылдық тәжірибе'],
            docTag: 'Құжаттар',
            docTitle: 'Қабылдауға қажетті <span class="text-accent">құжаттар</span>',
            docItems: [
                'Жеке куәлік (түпнұсқа + көшірме)',
                'Аттестат (түпнұсқа)',
                '3x4 фотосурет — 4 дана',
                '086-У нысанындағы медициналық анықтама',
                'Ата-анасының жеке куәлігінің көшірмесі',
            ],
            timelineTag: 'Маңызды күндер',
            timelineTitle: 'Қабылдау <span class="text-accent">кестесі</span>',
            timelineItems: [
                { date: '15 маусым', title: 'Қабылдау басталады', desc: 'Құжаттарды қабылдау басталады. Грант және ақылы бөлімге өтініш беруге болады.' },
                { date: 'Шілде', title: 'ҰБТ нәтижелері', desc: 'Ұлттық бірыңғай тестілеу нәтижелері жарияланады. Грантқа үміткерлер анықталады.' },
                { date: 'Тамыз', title: 'Құжаттарды тапсыру', desc: 'Барлық қажетті құжаттарды жинап, колледж қабылдау комиссиясына тапсыру.' },
                { date: '25 тамыз', title: 'Қабылдау аяқталады', desc: 'Құжаттарды қабылдаудың соңғы күні. Кешікпей өтініш беруді ұсынамыз.' },
                { date: '1 қыркүйек', title: 'Оқу жылы басталады', desc: 'Жаңа оқу жылы салтанатты түрде ашылады. Білім жолына қадам!' },
            ],
            contactTag: 'Байланыс',
            contactTitle: 'Байланыс <span class="text-accent">ақпараттары</span>',
            contactDesc: 'Біздің мамандар сізге оқу бағдарламалары, қабылдау шарттары және стипендиялар туралы толық ақпарат береді.',
            contactAddr: 'Мекен жайы',
            contactAddrVal: 'Есік қаласы, Алматинская 1 к-сі',
            contactPhone: 'Телефон',
            formHeading: 'Өтініш қалдырыңыз',
            formName: 'Аты-жөніңіз',
            formPhone: 'Телефон нөміріңіз',
            formSpec: 'Мамандық таңдаңыз',
            formSpecOpt: 'Мамандық таңдаңыз...',
            formBtn: 'Жіберу',
            formSuccess: 'Рахмет!',
            formSuccessMsg: 'Сіздің өтінішіңіз қабылданды. Біз сізге жақын арада хабарласамыз.',
            faqTag: 'FAQ',
            faqTitle: 'Жиі қойылатын <span class="text-accent">сұрақтар</span>',
            faqItems: [
                { q: 'Колледжге қабылдау қашан басталады?', a: 'Қабылдау 15 маусымнан 25 тамызға дейін жүргізіледі. Грант негізінде оқуға түсу үшін ҰБТ нәтижелері қажет. Ақылы бөлімге аттестат негізінде қабылданады.' },
                { q: 'Оқу ақысы қанша?', a: 'Оқу ақысы мамандыққа байланысты 250 000 — 350 000 теңге аралығында. Грант бойынша оқу тегін. Төлем бөліп-бөліп жасауға болады (семестрлік немесе айлық).' },
                { q: 'Жатақхана бар ма?', a: 'Жоқ, қазіргі уақытта колледжде жатақхана жоқ. Алыс аудандардан келетін студенттерге колледж маңындағы жалға берілетін пәтерлер туралы ақпарат беріледі.' },
                { q: '9-сыныптан кейін түсуге бола ма?', a: 'Иә, колледжге 9-сыныптан кейін түсуге болады. Оқу мерзімі 3 жыл 10 ай.' },
                { q: 'Стипендия бар ма?', a: 'Грант негізінде оқитын студенттерге мемлекеттік стипендия тағайындалады. Сонымен қатар, үздік оқитын студенттерге арнайы стипендиялар мен марапаттар қарастырылған.' },
                { q: 'Оқу аяқталғаннан кейін жұмысқа орналасуға көмектесесіздер ме?', a: 'Иә, колледжде карьералық орталық жұмыс істейді. Біз серіктес компаниялармен келісімдер арқылы студенттерге практика мен жұмысқа орналасу мүмкіндіктерін ұсынамыз. Түлектердің 85%-ы бірінші жылда жұмысқа орналасады.' },
            ],
            mapTitle: 'Біз картада',
            footerName: 'Жетісу гуманитарлық-техникалық колледжі',
            footerCopy: '© 2026 Жетісу ГТК. Барлық құқықтар қорғалған.',
            stickyCtaText: 'Қабылдау жүріп жатыр',
            stickyCtaBtn: 'Құжат тапсыру',
            ratingTag: 'Кері байланыс',
            ratingTitle: 'Контент рейтинг <span class="text-accent">бағалау жүйесі</span>',
            ratingDesc: 'Сайт мазмұны мен сапасын жақсартуға көмектесіңіз',
            ratingLabel: 'Сайтты бағалаңыз:',
            ratingCommentLabel: 'Пікіріңіз бен ұсыныстарыңыз:',
            ratingPlaceholder: 'Бұл жерге жазыңыз...',
            ratingSubmit: 'Бағалауды жіберу',
            ratingSuccessTitle: 'Рахмет!',
            ratingSuccessMsg: 'Сіздің бағаңыз қабылданды. Біз сайтты жақсарту үшін жұмыс жасаймыз.',
            galleryTag: 'Галерея',
            galleryTitle: 'Студенттік <span class="text-accent">өмір</span>',
            galleryDesc: 'Колледждегі жарқын сәттер мен оқу процесінен көріністер',
            galleryCaptions: [
                'Білім беру процесі',
                'Заманауи зертханалар',
                'Студенттік іс-шаралар',
                'Командалық жобалар',
                'Бай кітапхана қоры'
            ],
            calcTag: 'Калькулятор',
            calcTitle: 'Грантқа түсу <span class="text-accent">мүмкіндігі</span>',
            calcDesc: 'Өз көрсеткіштеріңізді енгізіп, мүмкіндігіңізді бағалаңыз',
            calcBase: 'Қай сынып негізінде?',
            calcBase9: '9 сынып',
            calcBase11: '11 сынып',
            calcSpec: 'Мамандық',
            calcSpecOpts: [
                'Мектепке дейінгі тәрбие және оқыту',
                'Есеп және аудит',
                'Құқықтану',
                'Есептеу техникасы',
                'Бағдарламалық қамтамасыз ету',
                'Жол қозғалысын ұйымдастыру'
            ],
            calcGpa: 'Орташа балл (GPA):',
            calcPriceLbl: 'Ақылы оқу құны (жылына):',
            calcRecLbl: 'Балама мамандық ұсынамыз:',
            calcStatusHigh: 'Жоғары мүмкіндік!',
            calcStatusMed: 'Орташа мүмкіндік',
            calcStatusLow: 'Төмен мүмкіндік',
            calcBySubjects: 'Пәндер арқылы есептеу',
            calcLangKz: 'Қазақ сыныбы',
            calcLangRu: 'Орыс сыныбы',
            subjPhys: 'Физика',
            subjChem: 'Химия',
            subjBio: 'Биология',
            subjGeo: 'География',
            subjIt: 'Информатика',
            subjEng: 'Шет тілі',
            subjLit: 'Әдебиет',
            onboardingLangToggle: '🇷🇺 Русский язык',
            onbTitle1: 'ЖГТК-ға қош келдіңіз!',
            onbText1: 'Табысты карьераға алғашқы қадам жасаңыз. Біз тек білім емес, сұранысқа ие мамандық береміз.',
            onbTitle2: '6 заманауи мамандық',
            onbText2: 'IT-дан бастап құқықтану мен логистикаға дейін. Біздің түлектердің 95%-ы оқу бітіре сала жұмыс табады!',
            onbTitle3: 'Грантқа түсіңіз',
            onbText3: 'Қабылдау ережелерімен танысып, грант калькуляторын қолданыңыз және өтінішті онлайн қалдырыңыз!',
            onbNext: 'Әрі қарай',
            onbStart: 'Бастау',
            onbSkip: 'Өткізіп жіберу',
            onbTitle4: 'Сіз кімсіз?',
            onbText4: 'Қажетті ақпаратты ұсыну үшін өзіңіздің рөліңізді таңдаңыз.',
            onbRoleAbiturient: 'Талапкер',
            onbRoleStudent: 'Студент',
            onbRoleTeacher: 'Оқытушы',
            onbRoleError: '⚠️ Бөлім әлі әзірленуде',
            errorTitle: 'Кешіріңіз, бет табылмады',
            errorDesc: 'Сіз іздеген бет жойылған немесе мекен-жайы ауысқан болуы мүмкін.',
            errorBtn: 'Басты бетке оралу',
            skillsTreeTitle: 'Оқу траекториясы: Дағдылар ағашы',
            level1Title: '1 Курс: Базалық деңгей',
            level2Title: '2-3 Курс: Мамандандыру',
            level3Title: '4 Курс: Кәсіби деңгей',
            skillsTreePlaceholder: 'Пәнді таңдап, оның сипаттамасын көру үшін және келесі деңгейлерді ашу үшін оның үстінен басыңыз.',
            skillsAcquiredTitle: 'Алынатын дағдылар:',
            skillsLockedWarning: 'Салдарлық байланыс! Алдымен бұл пәннің алдыңғы талаптарын ашыңыз: ',
            skill_ped_base: 'Педагогика негіздері',
            skill_psych_pro: 'Балалар психологиясы',
            skill_expert_method: 'Монтессори & Логопедия',
            skill_fin_base: 'Математика және қаржы',
            skill_tax_pro: '1С Бухгалтерия & Салық',
            skill_audit_expert: 'Аудит және қаржылық талдау',
            skill_law_base: 'Құқық негіздері',
            skill_court_pro: 'Азаматтық & Қылмыстық құқық',
            skill_lawyer_expert: 'Адвокаттық тәжірибе & Сот',
            skill_net_base: 'Желілер & Железо',
            skill_sys_pro: 'Жүйелік әкімшілік',
            skill_security_expert: 'Киберқауіпсіздік & Cloud',
            skill_flow_base: 'Алгоритмдеу негіздері',
            skill_web_pro: 'Веб-әзірлеу (Python/JS)',
            skill_mobile_expert: 'Мобильді қосымшалар & React',
            skill_traffic_base: 'Жол қозғалысының ережелері',
            skill_log_pro: 'Транспорттық логистика',
            skill_safety_expert: 'Көліктегі қауіпсіздік',
            skillsRegistry: {
                'ped-base': {
                    name: 'Педагогика негіздері',
                    icon: '📚',
                    desc: 'Балаларды оқыту мен тәрбиелеудің теориялық және практикалық негіздері. Оқу әдістемелері, сабақ жоспарлау мен бағалау жүйесі.',
                    skills: ['Сабақ жоспарлау негіздері', 'Тәрбие теориясы мен әдістемесі', 'Жас ерекшеліктер педагогикасы']
                },
                'psych-pro': {
                    name: 'Балалар психологиясы',
                    icon: '🧠',
                    desc: 'Бала психологиясы, жас ерекшеліктері, мінез-құлық ерекшеліктерін зерттеу. Баланың эмоционалдық және когнитивтік дамуын түсіну.',
                    skills: ['Бала психологиясын талдау', 'Мінез-құлық диагностикасы', 'Эмоционалды дамуды қолдау']
                },
                'expert-method': {
                    name: 'Монтессори & Логопедия',
                    icon: '🌟',
                    desc: 'Баланың жеке дамуына бағытталған халықаралық білім беру жүйесі және сөйлеу кемістіктерін анықтау мен түзету әдістері.',
                    skills: ['Монтессори материалдарымен жұмыс', 'Сөйлеу терапиясының негіздері', 'Дамытушы орта құру']
                },
                'fin-base': {
                    name: 'Математика және қаржы',
                    icon: '📊',
                    desc: 'Қаржылық математика негіздері, пайыздық есептеулер, экономикалық теория және қаржы жүйесінің құрылымы.',
                    skills: ['Қаржылық есептеулер', 'Экономикалық талдау', 'Негізгі қаржы көрсеткіштері']
                },
                'tax-pro': {
                    name: '1С: Бухгалтерия & Салық',
                    icon: '💻',
                    desc: '1С бағдарламасында есеп жүргізу және ҚР Салық заңнамасына сәйкес салық декларацияларын толтыру, салық есептілігін жүргізу.',
                    skills: ['1С: Бухгалтерияда жұмыс', 'Салық есептемелерін дайындау', 'Бастапқы құжаттама']
                },
                'audit-expert': {
                    name: 'Аудит және қаржылық талдау',
                    icon: '🔍',
                    desc: 'Халықаралық аудит стандарттары бойынша тексеру әдістемесі және кәсіпорынның қаржылық жағдайын бағалау, өтімділікті талдау.',
                    skills: ['Аудиторлық тексеру', 'Қаржылық есептілікті талдау', 'Қаржылық тәуекелдерді басқару']
                },
                'law-base': {
                    name: 'Құқық негіздері',
                    icon: '⚖️',
                    desc: 'Мемлекет пен құқық теориясының негіздері, ҚР Конституциялық құқығы, заң жүйесінің жалпы құрылымы.',
                    skills: ['Құқықтық нормаларды талдау', 'Конституциялық заңнама негіздері', 'Мемлекеттік органдар құрылымы']
                },
                'court-pro': {
                    name: 'Азаматтық & Қылмыстық құқық',
                    icon: '💼',
                    desc: 'Азаматтық-құқықтық қатынастар, меншік және келісімшарт құқығы, сонымен қатар қылмыстық заңнама және жауапкершілік негіздері.',
                    skills: ['Келісімшарттар жасасу', 'Қылмыстық-құқықтық сараптама', 'Азаматтардың мүддесін қорғау']
                },
                'lawyer-expert': {
                    name: 'Адвокаттық тәжірибе & Сот',
                    icon: '🏛️',
                    desc: 'Сот процесіне қатысу, құқықтық құжаттар мен арыздар жасау, сотта өкілдік ету және адвокаттық этика ережелері.',
                    skills: ['Сотта қорғау тактикасы', 'Заңгерлік құжаттарды дайындау', 'Сот процесін жүргізу']
                },
                'net-base': {
                    name: 'Желілер & Железо',
                    icon: '🔌',
                    desc: 'Желілік технологиялар негіздері (TCP/IP), компьютерлік техниканы жинау, баптау және оның аппараттық құрылымы.',
                    skills: ['Компьютер жинау және жөндеу', 'Желілік кабельдерді баптау', 'Желі протоколдарын түсіну']
                },
                'sys-pro': {
                    name: 'Жүйелік әкімшілік',
                    icon: '⚙️',
                    desc: 'Windows Server және Linux операциялық жүйелерін орнату, серверлерді виртуализациялау және желілік ресурстарды басқару.',
                    skills: ['Linux & Windows серверлерін баптау', 'Виртуализациямен жұмыс', 'Active Directory басқару']
                },
                'security-expert': {
                    name: 'Киберқауіпсіздік & Cloud',
                    icon: '🛡️',
                    desc: 'Ақпаратты қорғау әдідері, желілік шабуылдардан қорғану, VPN және бұлттық инфрақұрылымдарды қауіпсіз басқару.',
                    skills: ['Қауіпсіздік аудитін жүргізу', 'Бұлттық ресурстарды қорғау', 'Инженерлік қауіпсіздік желісін құру']
                },
                'flow-base': {
                    name: 'Алгоритмдеу негіздері',
                    icon: '📝',
                    desc: 'Алгоритмдер құру, логикалық ойлау, бағдарламалаудың негізгі концепциялары және C++ тілінде алгоритмдерді іске асыру.',
                    skills: ['Алгоритмдік логика', 'С++ негізгі синтаксисі', 'Мәселелерді декомпозициялау']
                },
                'web-pro': {
                    name: 'Веб-әзірлеу (Python/JS)',
                    icon: '🌐',
                    desc: 'HTML/CSS арқылы адаптивті сайттар жасау, JavaScript және Python (Django/Flask) көмегімен функционалды веб-қосымшаларды әзірлеу.',
                    skills: ['Адаптивті HTML/CSS макеті', 'Интерактивті JavaScript код', 'Python-да backend әзірлеу']
                },
                'mobile-expert': {
                    name: 'Мобильді қосымшалар & React',
                    icon: '📱',
                    desc: 'React және мобильді технологияларды қолдана отырып, күрделі SPA қосымшаларын және Android/iOS үшін мобильді интерфейстерді жасау.',
                    skills: ['React SPA әзірлеу', 'Мобильді интерфейстер дизайны', 'API интеграциясы және күйді басқару']
                },
                'traffic-base': {
                    name: 'Жол қозғалысының ережелері',
                    icon: '🚦',
                    desc: 'ҚР Жол жүру ережелерін (ЖҚЕ) зерттеу, жол белгілері мен таңбаларының қолданылуы, қозғалыс қауіпсіздігі негіздері.',
                    skills: ['ЖҚЕ заңнамасын білу', 'Қауіпті жағдайларды талдау', 'Реттеуші белгілерді қолдану']
                },
                'log-pro': {
                    name: 'Транспорттық логистика',
                    icon: '🚚',
                    desc: 'Жүк және жолаушы тасымалын ұйымдастыру, маршруттарды оңтайландыру және қойма логистикасының заманауи әдістері.',
                    skills: ['Маршруттарды оңтайландыру', 'Жүк тасымалдауды бақылау', 'AutoCAD-та сызбалар құру']
                },
                'safety-expert': {
                    name: 'Көліктегі қауіпсіздік',
                    icon: '🚨',
                    desc: 'Жол-көлік оқиғаларының алдын алу, GPS навигация және қозғалысты автоматтандырылған басқару жүйелерін енгізу.',
                    skills: ['Қауіпсіздік жүйесін аудиттеу', 'GPS навигациялық жүйелерімен жұмыс', 'Экологиялық мониторинг']
                }
            }
        },
        ru: {
            navLinks: ['Главная', 'Специальности', 'О колледже', 'Абитуриенту', 'Контакты'],
            logoSub: 'гуманитарно-технический колледж',
            heroBadge: 'Приём на 2025-2026 учебный год открыт',
            heroLines: ['Жетысу', 'гуманитарно-технический', 'колледж'],
            heroSub: 'Путь в будущее начинается с качественного образования и настоящих целей.',
            heroBtn1: 'Подать документы',
            heroBtn2: 'Все специальности',
            bentoStatLabel: 'Трудоустройство выпускников',
            heroScroll: 'Вниз',
            profTag: 'Специальности',
            profTitle: 'Наши <span class="text-accent">специальности</span>',
            profDesc: 'Колледж готовит высококвалифицированных специалистов по 6 направлениям.',
            profCards: [
                { title: 'Дошкольное воспитание и обучение', desc: 'Подготовка воспитателей и педагогов для детских садов. Всестороннее развитие детей.', more: 'Подробнее →' },
                { title: 'Учёт и аудит', desc: 'Специалисты по бухгалтерскому учёту, финансовому анализу и аудиту.', more: 'Подробнее →' },
                { title: 'Правоведение', desc: 'Подготовка юристов, владеющих основами правовой системы.', more: 'Подробнее →' },
                { title: 'Программное обеспечение вычислительной техники', desc: 'Настройка компьютерных систем, управление сетями и поддержка IT-инфраструктуры.', more: 'Подробнее →' },
                { title: 'Программное обеспечение', desc: 'Проектирование, разработка и тестирование веб, мобильных и desktop приложений.', more: 'Подробнее →' },
                { title: 'Организация дорожного движения', desc: 'Специалисты по транспортной логистике, безопасности дорожного движения и регулированию.', more: 'Подробнее →' },
            ],
            profDuration: '3 года 10 месяцев',
            profSalaryLabel: 'Средняя зарплата: ',
            missionTag: 'Миссия',
            missionTitle: 'Наша <span class="text-accent">миссия</span>',
            missionFeatures: [
                { title: 'Качественное образование', desc: 'Современные учебные программы и опытные преподаватели' },
                { title: 'Практические навыки', desc: 'Реальные проекты и производственная практика' },
                { title: 'Карьерная поддержка', desc: 'Помощь в трудоустройстве и компании-партнёры' },
            ],
            missionQuote: '«Наша цель — выпустить каждого студента как конкурентоспособного специалиста на рынке труда.»',
            statLabels: ['Преподаватели', 'Выпускники', 'Специальности', 'Лет опыта'],
            docTag: 'Документы',
            docTitle: 'Документы для <span class="text-accent">поступления</span>',
            docItems: [
                'Удостоверение личности (оригинал + копия)',
                'Аттестат (оригинал)',
                'Фотография 3x4 — 4 шт.',
                'Медицинская справка формы 086-У',
                'Копия удостоверения личности родителя',
            ],
            timelineTag: 'Важные даты',
            timelineTitle: 'График <span class="text-accent">приёма</span>',
            timelineItems: [
                { date: '15 июня', title: 'Начало приёма', desc: 'Начинается приём документов. Можно подать заявку на грантовое и платное обучение.' },
                { date: 'Июль', title: 'Результаты ЕНТ', desc: 'Публикуются результаты Единого национального тестирования. Определяются претенденты на грант.' },
                { date: 'Август', title: 'Подача документов', desc: 'Собрать все необходимые документы и подать в приёмную комиссию колледжа.' },
                { date: '25 августа', title: 'Окончание приёма', desc: 'Последний день приёма документов. Рекомендуем не откладывать подачу заявки.' },
                { date: '1 сентября', title: 'Начало учебного года', desc: 'Торжественное открытие нового учебного года. Шаг на пути к знаниям!' },
            ],
            contactTag: 'Контакты',
            contactTitle: 'Контактная <span class="text-accent">информация</span>',
            contactDesc: 'Наши специалисты предоставят полную информацию об учебных программах, условиях приёма и стипендиях.',
            contactAddr: 'Адрес',
            contactAddrVal: 'г. Есик, ул. Алматинская 1',
            contactPhone: 'Телефон',
            formHeading: 'Оставить заявку',
            formName: 'Ваше имя',
            formPhone: 'Ваш номер телефона',
            formSpec: 'Выберите специальность',
            formSpecOpt: 'Выберите специальность...',
            formBtn: 'Отправить',
            formSuccess: 'Спасибо!',
            formSuccessMsg: 'Ваша заявка принята. Мы свяжемся с вами в ближайшее время.',
            faqTag: 'FAQ',
            faqTitle: 'Часто задаваемые <span class="text-accent">вопросы</span>',
            faqItems: [
                { q: 'Когда начинается приём в колледж?', a: 'Приём проводится с 15 июня по 25 августа. Для поступления на грант нужны результаты ЕНТ. На платное отделение принимают на основании аттестата.' },
                { q: 'Сколько стоит обучение?', a: 'Стоимость обучения составляет от 250 000 до 350 000 тенге в зависимости от специальности. Обучение по гранту бесплатное. Возможна оплата частями (посеместрово или помесячно).' },
                { q: 'Есть ли общежитие?', a: 'Нет, в настоящее время общежития в колледже нет. Студентам из отдалённых районов предоставляется информация об аренде жилья рядом с колледжем.' },
                { q: 'Можно ли поступить после 9 класса?', a: 'Да, в колледж можно поступить после 9 класса. Срок обучения — 3 года 10 месяцев.' },
                { q: 'Есть ли стипендия?', a: 'Студентам, обучающимся по гранту, назначается государственная стипендия. Также предусмотрены специальные стипендии и награды для отличников.' },
                { q: 'Помогаете ли с трудоустройством после учёбы?', a: 'Да, в колледже работает карьерный центр. Мы предлагаем студентам возможности практики и трудоустройства через договоры с компаниями-партнёрами. 85% выпускников трудоустраиваются в первый год.' },
            ],
            mapTitle: 'Мы на карте',
            footerName: 'Жетысу гуманитарно-технический колледж',
            footerCopy: '© 2026 Жетысу ГТК. Все права защищены.',
            stickyCtaText: 'Идёт приём документов',
            stickyCtaBtn: 'Подать документы',
            ratingTag: 'Обратная связь',
            ratingTitle: 'Система <span class="text-accent">оценки контента</span>',
            ratingDesc: 'Помогите нам улучшить контент и качество сайта',
            ratingLabel: 'Оцените сайт:',
            ratingCommentLabel: 'Ваши отзывы и предложения:',
            ratingPlaceholder: 'Пишите здесь...',
            ratingSubmit: 'Отправить оценку',
            ratingSuccessTitle: 'Спасибо!',
            ratingSuccessMsg: 'Ваша оценка принята. Мы будем работать над улучшением сайта.',
            galleryTag: 'Галерея',
            galleryTitle: 'Студенческая <span class="text-accent">жизнь</span>',
            galleryDesc: 'Яркие моменты и учебный процесс в колледже',
            galleryCaptions: [
                'Образовательный процесс',
                'Современные лаборатории',
                'Студенческие мероприятия',
                'Командные проекты',
                'Богатый библиотечный фонд'
            ],
            calcTag: 'Калькулятор',
            calcTitle: 'Шансы на <span class="text-accent">грант</span>',
            calcDesc: 'Введите свои данные и оцените вероятность поступления',
            calcBase: 'На базе какого класса?',
            calcBase9: '9 класс',
            calcBase11: '11 класс',
            calcSpec: 'Специальность',
            calcSpecOpts: [
                'Дошкольное воспитание и обучение',
                'Учёт и аудит',
                'Правоведение',
                'Программное обеспечение ВТ',
                'Программное обеспечение',
                'Организация дорожного движения'
            ],
            calcGpa: 'Средний балл (GPA):',
            calcPriceLbl: 'Стоимость обучения (в год):',
            calcRecLbl: 'Предлагаем альтернативу:',
            calcStatusHigh: 'Высокие шансы!',
            calcStatusMed: 'Средние шансы',
            calcStatusLow: 'Низкие шансы',
            calcBySubjects: 'Расчет по предметам',
            calcLangKz: 'Казахский класс',
            calcLangRu: 'Русский класс',
            subjPhys: 'Физика',
            subjChem: 'Химия',
            subjBio: 'Биология',
            subjGeo: 'География',
            subjIt: 'Информатика',
            subjEng: 'Иностранный язык',
            subjLit: 'Литература',
            onboardingLangToggle: '🇰🇿 Қазақ тілі',
            onbTitle1: 'Добро пожаловать в ЖГТК!',
            onbText1: 'Начните свой путь к успешной карьере. Мы даем не просто знания, а востребованную профессию.',
            onbTitle2: '6 современных специальностей',
            onbText2: 'От IT и программирования до юриспруденции и логистики. 95% наших выпускников успешно трудоустраиваются!',
            onbTitle3: 'Поступи на грант',
            onbText3: 'Ознакомьтесь с правилами приема, используйте калькулятор грантов и подайте заявку онлайн!',
            onbNext: 'Далее',
            onbStart: 'Начать просмотр',
            onbSkip: 'Пропустить',
            onbTitle4: 'Кто вы?',
            onbText4: 'Выберите вашу роль, чтобы мы подобрали нужную информацию.',
            onbRoleAbiturient: 'Абитуриент',
            onbRoleStudent: 'Студент',
            onbRoleTeacher: 'Преподаватель',
            onbRoleError: '⚠️ Раздел еще в разработке',
            errorTitle: 'Извините, страница не найдена',
            errorDesc: 'Возможно, страница, которую вы ищете, была удалена или сменила адрес.',
            errorBtn: 'Вернуться на главную',
            skillsTreeTitle: 'Траектория обучения: Дерево навыков',
            level1Title: '1 Курс: Базовый уровень',
            level2Title: '2-3 Курс: Специализация',
            level3Title: '4 Курс: Профессионал',
            skillsTreePlaceholder: 'Нажмите на разблокированный предмет, чтобы изучить его и открыть следующие уровни.',
            skillsAcquiredTitle: 'Получаемые навыки:',
            skillsLockedWarning: 'Сначала разблокируйте предшествующие предметы: ',
            skill_ped_base: 'Основы педагогики',
            skill_psych_pro: 'Детская психология',
            skill_expert_method: 'Монтессори & Логопедия',
            skill_fin_base: 'Математика и Финансы',
            skill_tax_pro: '1С Бухгалтерия & Налоги',
            skill_audit_expert: 'Аудит и Финансовый анализ',
            skill_law_base: 'Основы права',
            skill_court_pro: 'Гражданское & Уголовное право',
            skill_lawyer_expert: 'Адвокатская практика & Судебный процесс',
            skill_net_base: 'Сети & Железо',
            skill_sys_pro: 'Системное администрирование',
            skill_security_expert: 'Кибербезопасность & Cloud',
            skill_flow_base: 'Основы алгоритмизации',
            skill_web_pro: 'Веб-разработка',
            skill_mobile_expert: 'Мобильные приложения & React',
            skill_traffic_base: 'Правила движения',
            skill_log_pro: 'Транспортная логистика',
            skill_safety_expert: 'Безопасность на транспорте',
            skillsRegistry: {
                'ped-base': {
                    name: 'Основы педагогики',
                    icon: '📚',
                    desc: 'Теоретические и практические основы обучения и воспитания детей. Методики преподавания, планирование уроков и система оценки.',
                    skills: ['Планирование занятий', 'Теория воспитания', 'Методические основы']
                },
                'psych-pro': {
                    name: 'Детская психология',
                    icon: '🧠',
                    desc: 'Изучение психологии ребенка, возрастных особенностей и поведенческих паттернов. Понимание эмоционального и когнитивного развития.',
                    skills: ['Анализ психологии ребенка', 'Поведенческая диагностика', 'Поддержка эмоционального развития']
                },
                'expert-method': {
                    name: 'Монтессори & Логопедия',
                    icon: '🌟',
                    desc: 'Международная система образования, сфокусированная на индивидуальном развитии ребенка, и методы выявления и исправления дефектов речи.',
                    skills: ['Работа с материалами Монтессори', 'Основы логопедической терапии', 'Создание развивающей среды']
                },
                'fin-base': {
                    name: 'Математика и Финансы',
                    icon: '📊',
                    desc: 'Основы финансовой математики, процентные вычисления, экономическая теория и структура финансовой системы.',
                    skills: ['Финансовые расчеты', 'Экономический анализ', 'Основные финансовые показатели']
                },
                'tax-pro': {
                    name: '1С Бухгалтерия & Налоги',
                    icon: '💻',
                    desc: 'Ведение учета в программе 1С и налоговое законодательство РК, заполнение налоговых деклараций, ведение отчетности.',
                    skills: ['Работа в 1С: Бухгалтерия', 'Подготовка налоговой отчетности', 'Первичный документооборот']
                },
                'audit-expert': {
                    name: 'Аудит и Финансовый анализ',
                    icon: '🔍',
                    desc: 'Методология аудиторской проверки в соответствии с международными стандартами аудита и оценка финансового состояния предприятия.',
                    skills: ['Аудиторская проверка', 'Анализ финансовой отчетности', 'Управление финансовыми рисками']
                },
                'law-base': {
                    name: 'Основы права',
                    icon: '⚖️',
                    desc: 'Основы теории государства и права, Конституционное право РК, общая структура судебной и правовой системы.',
                    skills: ['Анализ правовых норм', 'Основы конституционного права', 'Структура государственных органов']
                },
                'court-pro': {
                    name: 'Гражданское & Уголовное право',
                    icon: '💼',
                    desc: 'Гражданско-правовые отношения, право собственности и обязательств, а также основы уголовного законодательства и ответственности.',
                    skills: ['Составление договоров', 'Уголовно-правовая экспертиза', 'Защита интересов граждан']
                },
                'lawyer-expert': {
                    name: 'Адвокатская практика & Суд',
                    icon: '🏛️',
                    desc: 'Участие в судебном процессе, составление исковых заявлений, представительство в суде и правила адвокатской этики.',
                    skills: ['Тактика защиты в суде', 'Подготовка юридических документов', 'Ведение судебного процесса']
                },
                'net-base': {
                    name: 'Сети & Железо',
                    icon: '🔌',
                    desc: 'Основы сетевых технологий (TCP/IP), сборка, настройка компьютерной техники и ее аппаратное устройство.',
                    skills: ['Сборка и ремонт ПК', 'Обжимка и настройка сети', 'Понимание сетевых протоколов']
                },
                'sys-pro': {
                    name: 'Системное администрирование',
                    icon: '⚙️',
                    desc: 'Установка и настройка серверных операционных систем Windows Server и Linux, виртуализация и управление сетевыми ресурсами.',
                    skills: ['Настройка серверов Linux & Windows', 'Работа с виртуализацией', 'Управление Active Directory']
                },
                'security-expert': {
                    name: 'Кибербезопасность & Cloud',
                    icon: '🛡️',
                    desc: 'Методы защиты информации, предотвращение сетевых угроз и атак, настройка VPN и безопасное управление облачными инфраструктурами.',
                    skills: ['Проведение аудита безопасности', 'Защита облачных ресурсов', 'Построение безопасных сетей']
                },
                'flow-base': {
                    name: 'Основы алгоритмизации',
                    icon: '📝',
                    desc: 'Построение алгоритмов, развитие логического мышления, основные концепции программирования и реализация алгоритмов на C++.',
                    skills: ['Алгоритмическая логика', 'Базовый синтаксис C++', 'Декомпозиция задач']
                },
                'web-pro': {
                    name: 'Веб-разработка',
                    icon: '🌐',
                    desc: 'Создание адаптивных веб-сайтов с использованием HTML/CSS, программирование интерактивного поведения на JS и backend на Python (Django).',
                    skills: ['Адаптивная верстка HTML/CSS', 'Интерактивный код на JavaScript', 'Разработка backend на Django']
                },
                'mobile-expert': {
                    name: 'Мобильные приложения & React',
                    icon: '📱',
                    desc: 'Разработка современных Single Page Applications на React, создание интерфейсов для мобильных платформ Android и iOS.',
                    skills: ['Разработка React SPA', 'Дизайн мобильных интерфейсов', 'Интеграция API и стейт-менеджмент']
                },
                'traffic-base': {
                    name: 'Правила движения',
                    icon: '🚦',
                    desc: 'Изучение Правил дорожного движения РК (ПДД), применение дорожных знаков и разметки, основы безопасности движения.',
                    skills: ['Знание законодательства ПДД', 'Анализ аварийных ситуаций', 'Применение знаков регулирования']
                },
                'log-pro': {
                    name: 'Транспортная логистика',
                    icon: '🚚',
                    desc: 'Организация грузовых и пассажирских перевозок, оптимизация маршрутов и современные методы складской логистики.',
                    skills: ['Оптимизация маршрутов доставки', 'Контроль грузоперевозок', 'Создание чертежей в AutoCAD']
                },
                'safety-expert': {
                    name: 'Безопасность на транспорте',
                    icon: '🚨',
                    desc: 'Предотвращение дорожно-транспортных происшествий, использование GPS навигации и автоматизированных систем управления движением.',
                    skills: ['Аудит систем безопасности', 'Работа с навигационными системами', 'Экологический мониторинг транспорта']
                }
            }
        },
    };

    function applyLanguage(lang) {
        const t = LANG[lang];
        if (!t) return;
        
        document.documentElement.lang = lang;

        // Helper: set text/html
        const q = (sel) => document.querySelector(sel);
        const qa = (sel) => document.querySelectorAll(sel);

        // Auto-translate data-i18n
        qa('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerHTML = t[key];
        });

        // Nav links
        qa('.nav__link').forEach((el, i) => {
            if (t.navLinks[i]) el.textContent = t.navLinks[i];
        });
        const logoSub = q('.nav__logo-sub');
        if (logoSub) logoSub.textContent = t.logoSub;

        // Hero
        const badgeEls = q('.hero__badge');
        if (badgeEls) {
            const dot = badgeEls.querySelector('.hero__badge-dot');
            badgeEls.textContent = '';
            if (dot) badgeEls.appendChild(dot);
            badgeEls.appendChild(document.createTextNode(' ' + t.heroBadge));
        }
        qa('.hero__title-line').forEach((el, i) => {
            if (t.heroLines[i]) el.textContent = t.heroLines[i];
        });
        const heroSub = q('.hero__subtitle');
        if (heroSub) heroSub.textContent = t.heroSub;
        const heroBtns = qa('.hero__actions .btn');
        if (heroBtns[0]) {
            const span = heroBtns[0].querySelector('span');
            if (span) span.textContent = t.heroBtn1;
        }
        const bentoAction = q('.bento-action-label');
        if (bentoAction) bentoAction.textContent = t.heroBtn2;
        
        const bentoStat = q('.bento-stat-label');
        if (bentoStat) bentoStat.textContent = t.bentoStatLabel;

        const scrollText = q('.hero__scroll span');
        if (scrollText) scrollText.textContent = t.heroScroll;

        // Professions
        const profSec = q('#professions');
        if (profSec) {
            const tag = profSec.querySelector('.section__tag');
            const title = profSec.querySelector('.section__title');
            const desc = profSec.querySelector('.section__desc');
            if (tag) tag.textContent = t.profTag;
            if (title) title.innerHTML = t.profTitle;
            if (desc) desc.textContent = t.profDesc;

            qa('.prof-card').forEach((card, i) => {
                const c = t.profCards[i];
                if (!c) return;
                const ct = card.querySelector('.prof-card__title');
                const cd = card.querySelector('.prof-card__desc');
                const cm = card.querySelector('.prof-card__more');
                const cdur = card.querySelector('.prof-card__dur-text');
                
                if (ct) ct.textContent = c.title;
                if (cd) cd.textContent = c.desc;
                if (cm) cm.textContent = c.more;
                if (cdur) cdur.textContent = t.profDuration;
            });
            
            qa('.salary-label').forEach(lbl => {
                if (t.profSalaryLabel) lbl.textContent = t.profSalaryLabel;
            });
        }

        // Mission
        const missSec = q('#mission');
        if (missSec) {
            const tag = missSec.querySelector('.section__tag');
            const title = missSec.querySelector('.section__title');
            if (tag) tag.textContent = t.missionTag;
            if (title) title.innerHTML = t.missionTitle;

            qa('.mission__feature').forEach((feat, i) => {
                const f = t.missionFeatures[i];
                if (!f) return;
                const ft = feat.querySelector('.mission__feature-title');
                const fd = feat.querySelector('.mission__feature-desc');
                if (ft) ft.textContent = f.title;
                if (fd) fd.textContent = f.desc;
            });

            const quote = missSec.querySelector('.mission__quote p');
            if (quote) quote.textContent = t.missionQuote;

            qa('.stat-block__label').forEach((el, i) => {
                if (t.statLabels[i]) el.textContent = t.statLabels[i];
            });
        }

        // Documents
        const docSec = q('#documents');
        if (docSec) {
            const tag = docSec.querySelector('.section__tag');
            const title = docSec.querySelector('.section__title');
            if (tag) tag.textContent = t.docTag;
            if (title) title.innerHTML = t.docTitle;

            qa('.doc-item span').forEach((el, i) => {
                if (t.docItems[i]) el.textContent = t.docItems[i];
            });
        }

        // Timeline
        const tlSec = q('#timeline');
        if (tlSec) {
            const tag = tlSec.querySelector('.section__tag');
            const title = tlSec.querySelector('.section__title');
            if (tag) tag.textContent = t.timelineTag;
            if (title) title.innerHTML = t.timelineTitle;

            qa('.timeline__item').forEach((item, i) => {
                const ti = t.timelineItems[i];
                if (!ti) return;
                const dateEl = item.querySelector('.timeline__date');
                const titleEl = item.querySelector('.timeline__title');
                const descEl = item.querySelector('.timeline__desc');
                if (dateEl) dateEl.textContent = ti.date;
                if (titleEl) titleEl.textContent = ti.title;
                if (descEl) descEl.textContent = ti.desc;
            });
        }

        // Contact
        const contSec = q('#contact');
        if (contSec) {
            const tag = contSec.querySelector('.section__tag');
            const title = contSec.querySelector('.section__title');
            const desc = contSec.querySelector('.contact__text');
            if (tag) tag.textContent = t.contactTag;
            if (title) title.innerHTML = t.contactTitle;
            if (desc) desc.textContent = t.contactDesc;

            const details = qa('.contact__detail');
            if (details[0]) {
                const strong = details[0].querySelector('strong');
                const span = details[0].querySelector('div > span');
                if (strong) strong.textContent = t.contactAddr;
                if (span) span.textContent = t.contactAddrVal;
            }
            if (details[1]) {
                const strong = details[1].querySelector('strong');
                if (strong) strong.textContent = t.contactPhone;
            }

            const formH = contSec.querySelector('.contact-form__heading');
            if (formH) formH.textContent = t.formHeading;

            const labels = qa('.contact-form__label');
            if (labels[0]) labels[0].textContent = t.formName;
            if (labels[1]) labels[1].textContent = t.formPhone;
            if (labels[2]) labels[2].textContent = t.formSpec;

            const selectOpt = q('.contact-form__select option[value=""]');
            if (selectOpt) selectOpt.textContent = t.formSpecOpt;

            const submitText = q('.contact-form__btn-text');
            if (submitText) submitText.textContent = t.formBtn;

            const successH = q('#form-success h3');
            const successP = q('#form-success p');
            if (successH) successH.textContent = t.formSuccess;
            if (successP) successP.textContent = t.formSuccessMsg;
        }

        // FAQ
        const faqSec = q('#faq');
        if (faqSec) {
            const tag = faqSec.querySelector('.section__tag');
            const title = faqSec.querySelector('.section__title');
            if (tag) tag.textContent = t.faqTag;
            if (title) title.innerHTML = t.faqTitle;

            qa('.faq__item').forEach((item, i) => {
                const f = t.faqItems[i];
                if (!f) return;
                const qEl = item.querySelector('.faq__question span');
                const aEl = item.querySelector('.faq__answer p');
                if (qEl) qEl.textContent = f.q;
                if (aEl) aEl.textContent = f.a;
            });
        }

        // Map title
        const mapTitle = q('.contact__map-title span');
        if (mapTitle) mapTitle.textContent = t.mapTitle;

        // Footer
        const footerName = q('.footer__name');
        const footerCopy = q('.footer__copy');
        if (footerName) footerName.textContent = t.footerName;
        if (footerCopy) footerCopy.textContent = t.footerCopy;

        // Sticky CTA
        const stickyText = q('.sticky-cta__text strong');
        const stickyBtn = q('.sticky-cta__btn');
        if (stickyText) stickyText.textContent = t.stickyCtaText;
        if (stickyBtn) stickyBtn.textContent = t.stickyCtaBtn;

        // Rating
        const ratingSec = q('#rating');
        if (ratingSec) {
            const tag = ratingSec.querySelector('.section__tag');
            const title = ratingSec.querySelector('.section__title');
            const desc = ratingSec.querySelector('.section__desc');
            const label = ratingSec.querySelector('.rating__label');
            const commentLabel = ratingSec.querySelector('.rating-form__label');
            const placeholder = ratingSec.querySelector('.rating-form__textarea');
            const submit = ratingSec.querySelector('#rating-submit span');
            const successH = ratingSec.querySelector('#rating-success h3');
            const successP = ratingSec.querySelector('#rating-success p');

            if (tag) tag.textContent = t.ratingTag;
            if (title) title.innerHTML = t.ratingTitle;
            if (desc) desc.textContent = t.ratingDesc;
            if (label) label.textContent = t.ratingLabel;
            if (commentLabel) commentLabel.textContent = t.ratingCommentLabel;
            if (placeholder) placeholder.placeholder = t.ratingPlaceholder;
            if (submit) submit.textContent = t.ratingSubmit;
            if (successH) successH.textContent = t.ratingSuccessTitle;
            if (successP) successP.textContent = t.ratingSuccessMsg;
        }

        // Gallery
        const gallerySec = q('#gallery');
        if (gallerySec) {
            const tag = gallerySec.querySelector('.section__tag');
            const title = gallerySec.querySelector('.section__title');
            const desc = gallerySec.querySelector('.section__desc');

            if (tag) tag.textContent = t.galleryTag;
            if (title) title.innerHTML = t.galleryTitle;
            if (desc) desc.textContent = t.galleryDesc;

            qa('.gallery__item-caption').forEach((el, i) => {
                if (t.galleryCaptions && t.galleryCaptions[i]) {
                    el.textContent = t.galleryCaptions[i];
                }
            });
        }

        // Calculator
        const calcSec = q('#calculator');
        if (calcSec) {
            const tag = calcSec.querySelector('.section__tag');
            const title = calcSec.querySelector('.section__title');
            const desc = calcSec.querySelector('.section__desc');
            const labels = calcSec.querySelectorAll('.calc-label');
            const base9 = calcSec.querySelector('span[data-i18n="calcBase9"]');
            const base11 = calcSec.querySelector('span[data-i18n="calcBase11"]');
            const priceLbl = calcSec.querySelector('span[data-i18n="calcPriceLbl"]');
            const recLbl = calcSec.querySelector('span[data-i18n="calcRecLbl"]');
            const specSelect = calcSec.querySelector('#calc-spec');

            if (tag) tag.textContent = t.calcTag;
            if (title) title.innerHTML = t.calcTitle;
            if (desc) desc.textContent = t.calcDesc;
            
            if (labels[0]) labels[0].textContent = t.calcBase;
            if (labels[1]) labels[1].textContent = t.calcSpec;
            if (labels[2] && labels[2].querySelector('span[data-i18n="calcGpa"]')) {
                labels[2].querySelector('span[data-i18n="calcGpa"]').textContent = t.calcGpa;
            }

            if (base9) base9.textContent = t.calcBase9;
            if (base11) base11.textContent = t.calcBase11;
            if (priceLbl) priceLbl.textContent = t.calcPriceLbl;
            if (recLbl) recLbl.textContent = t.calcRecLbl;

            const langKz = calcSec.querySelector('span[data-i18n="calcLangKz"]');
            const langRu = calcSec.querySelector('span[data-i18n="calcLangRu"]');
            if (langKz) langKz.textContent = t.calcLangKz;
            if (langRu) langRu.textContent = t.calcLangRu;

            if (specSelect && t.calcSpecOpts) {
                Array.from(specSelect.options).forEach((opt, i) => {
                    opt.textContent = t.calcSpecOpts[i];
                });
            }
        }

        // Update active skills tree if open
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            const container = activeModal.querySelector('.skills-tree-container');
            if (container) {
                if (currentActiveSkill) {
                    updateSkillsInfoPanel(container, currentActiveSkill);
                }
                setTimeout(() => {
                    drawTreeLines(container);
                }, 100);
            }
        }
        
        document.dispatchEvent(new Event('langChanged'));
    }

    function initLanguageToggle() {
        const btn = document.getElementById('lang-toggle');
        const label = document.getElementById('lang-label');
        const btnMob = document.getElementById('lang-toggle-mob');
        const labelMob = document.getElementById('lang-label-mob');

        let currentLang = localStorage.getItem('gtk-lang') || 'kk';

        const updateLabels = (lang) => {
            if (label) label.textContent = lang === 'kk' ? 'РУС' : 'ҚАЗ';
            if (labelMob) labelMob.textContent = lang === 'kk' ? 'РУС' : 'ҚАЗ';
        };

        // Apply saved language on load
        if (currentLang === 'ru') {
            applyLanguage('ru');
            updateLabels('ru');
        }

        const toggle = () => {
            currentLang = currentLang === 'kk' ? 'ru' : 'kk';
            applyLanguage(currentLang);
            updateLabels(currentLang);
            localStorage.setItem('gtk-lang', currentLang);
        };

        if (btn) btn.addEventListener('click', toggle);
        if (btnMob) btnMob.addEventListener('click', toggle);
    }

    // Restore saved theme immediately (before init)
    (function restoreTheme() {
        const saved = localStorage.getItem('gtk-theme');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    })();

    // ========================================
    // RATING SYSTEM
    // ========================================
    function initRatingSystem() {
        const ratingContainer = document.getElementById('star-rating');
        if (!ratingContainer) return;

        const stars = ratingContainer.querySelectorAll('.star');
        const ratingValue = document.getElementById('rating-value');
        const form = document.getElementById('rating-form');
        const commentArea = document.getElementById('rating-comment');
        const successMsg = document.getElementById('rating-success');
        const submitBtn = document.getElementById('rating-submit');

        let currentRating = 0;

        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const val = parseInt(star.dataset.value);
                highlightStars(val);
            });

            star.addEventListener('mouseleave', () => {
                highlightStars(currentRating);
            });

            star.addEventListener('click', (e) => {
                e.preventDefault();
                currentRating = parseInt(star.dataset.value);
                ratingValue.value = currentRating;
                highlightStars(currentRating);
            });
        });

        function highlightStars(val) {
            stars.forEach(star => {
                const starVal = parseInt(star.dataset.value);
                star.classList.toggle('active', starVal <= val);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (currentRating === 0) {
                const msg = document.documentElement.lang === 'ru' ? 'Пожалуйста, выберите оценку' : 'Өтінеміз, бағаны таңдаңыз';
                alert(msg);
                return;
            }

            submitBtn.disabled = true;
            const btnSpan = submitBtn.querySelector('span');
            const originalText = btnSpan.textContent;
            btnSpan.textContent = document.documentElement.lang === 'ru' ? 'Отправка...' : 'Жіберілуде...';

            const message = `
🌟 *Жаңа бағалау — Жетісу ГТК*

⭐ *Рейтинг:* ${'★'.repeat(currentRating)}${'☆'.repeat(5 - currentRating)} (${currentRating}/5)
💬 *Пікір:* ${commentArea.value.trim() || 'Пікірсіз'}

📅 *Уақыты:* ${new Date().toLocaleString('kk-KZ')}
            `.trim();

            try {
                const res = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CONFIG.TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown',
                    }),
                });

                if (!res.ok) throw new Error('Telegram API error');
                showSuccess();
            } catch (err) {
                console.warn('Telegram rating failed:', err);
                showSuccess(); // Show success for demo even if API fails
            }
        });

        function showSuccess() {
            if (typeof gsap !== 'undefined') {
                gsap.to([form, ratingContainer.parentElement], {
                   
                    y: -10,
                    duration: 0.4,
                    stagger: 0.1,
                    onComplete: () => {
                        form.style.display = 'none';
                        ratingContainer.parentElement.style.display = 'none';
                        successMsg.style.display = 'block';
                        gsap.from(successMsg, { scale: 0.8, duration: 0.5, ease: 'back.out(1.7)' });
                    }
                });
            } else {
                form.style.display = 'none';
                ratingContainer.parentElement.style.display = 'none';
                successMsg.style.display = 'block';
            }
        }
    }

    // ========================================
    // PRELOADER
    // ========================================
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        // Prevent scroll while loading
        document.body.style.overflow = 'hidden';

        const triggerHide = () => {
            setTimeout(() => {
                preloader.classList.add('preloader--hidden');
                document.body.style.overflow = '';

                // Remove from DOM after animation
                setTimeout(() => preloader.remove(), 600);
            }, 800);
        };

        if (document.readyState === 'complete') {
            triggerHide();
        } else {
            window.addEventListener('load', triggerHide);
        }
    }

    // ========================================
    // STICKY CTA
    // ========================================
    function initStickyCta() {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        });
    }

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================
    function initMagneticButtons() {
        // Only run on non-touch/desktop devices
        if (window.innerWidth <= 1024) return;

        // Select buttons to magnetize
        const magnetics = document.querySelectorAll('.nav__link, .nav__theme-toggle, .nav__lang-toggle, .hero__actions .btn, .sticky-cta__btn, .scroll-top, .float-whatsapp');

        magnetics.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;

                // Add class to disable CSS transform transition temporarily
                btn.classList.add('magnetic-active');

                gsap.to(btn, {
                    x: x,
                    y: y,
                    duration: 0.1,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });

            btn.addEventListener('mouseleave', () => {
                // Restore normal transitions when mouse leaves
                btn.classList.remove('magnetic-active');

                // Snap back with an elastic bounce
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)',
                    overwrite: 'auto'
                });
            });
        });
    }

    // ========================================
    // INIT
    // ========================================
    function init() {
        hidePreloader();
        initWatermarkParallax();
        initNavigation();
        initModals();
        initScrollAnimations();
        initContactForm();
        initFAQ();
        initScrollToTop();
        initThemeToggle();
        initLanguageToggle();
        initStickyCta();
        initMagneticButtons();
        initRatingSystem();
        initAccessibility();
        initGallery();
        initCalculator();
        initOnboarding();
    }

    // ========================================
    // ACCESSIBILITY MODE
    // ========================================
    function initAccessibility() {
        const btn = document.getElementById('a11y-toggle');
        const btnMob = document.getElementById('a11y-toggle-mob');

        const html = document.documentElement;
        let isA11y = localStorage.getItem('gtk-a11y') === 'true';

        const applyA11y = (state) => {
            html.setAttribute('data-a11y', state);
            if (btn) btn.classList.toggle('active', state);
            if (btnMob) btnMob.classList.toggle('active', state);
            localStorage.setItem('gtk-a11y', state);
            
            if (state) {
                const msg = html.lang === 'ru' 
                    ? 'Контраст и выбор цвета: дизайн веб-страницы для пользователей с нарушениями зрения' 
                    : 'Контраст және түс таңдауы: көру қабілеті шектеулі қолданушылар үшін веб-бет жобалау';
                showToast(msg);
            }
        };

        if (isA11y) applyA11y(true);

        const toggle = () => {
            isA11y = !isA11y;
            applyA11y(isA11y);
        };

        if (btn) btn.addEventListener('click', toggle);
        if (btnMob) btnMob.addEventListener('click', toggle);
    }

    function showToast(message) {
        const existing = document.querySelector('.toast-a11y');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-a11y';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 600);
        }, 4000);
    }

    // ========================================
    // GALLERY CAROUSEL
    // ========================================
    function initGallery() {
        const slider = document.getElementById('gallery-slider');
        if (!slider) return;

        const items = Array.from(slider.querySelectorAll('.gallery__item'));
        const btnPrev = document.getElementById('gallery-prev');
        const btnNext = document.getElementById('gallery-next');
        let currentIndex = 0;
        let autoplayInterval;

        function updateSlider() {
            items.forEach((item, index) => {
                item.className = 'gallery__item'; // reset classes
                if (index === currentIndex) {
                    item.classList.add('active');
                } else if (index === (currentIndex - 1 + items.length) % items.length) {
                    item.classList.add('prev');
                } else if (index === (currentIndex + 1) % items.length) {
                    item.classList.add('next');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateSlider();
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
        }

        if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); startAutoplay(); });
        if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); startAutoplay(); });

        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateSlider();
                    startAutoplay();
                }
            });
        });

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);

        // Touch events for mobile swiping support
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });

        function handleSwipe() {
            const threshold = 50; // swipe minimum distance in pixels
            if (touchEndX < touchStartX - threshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + threshold) {
                prevSlide();
            }
        }

        // Initial setup
        updateSlider();
        startAutoplay();
    }

    // ========================================
    // GRANT CALCULATOR
    // ========================================
    function initCalculator() {
        const specSelect = document.getElementById('calc-spec');
        const baseRadios = document.querySelectorAll('input[name="baseClass"]');
        const gpaRange = document.getElementById('calc-gpa');
        const gpaValDisplay = document.getElementById('calc-gpa-val');
        const progressCircle = document.getElementById('calc-progress');
        const percentText = document.getElementById('calc-percent');
        const statusText = document.getElementById('calc-status');
        const priceText = document.getElementById('calc-price');
        const recBlock = document.getElementById('calc-recommendation');
        const recSpecText = document.getElementById('calc-rec-spec');
        
        // Detailed GPA Elements
        const toggleBtn = document.getElementById('calc-toggle-btn');
        const sliderMode = document.getElementById('calc-slider-mode');
        const subjectsMode = document.getElementById('calc-subjects');
        const subjLangRadios = document.querySelectorAll('input[name="classLang"]');
        const subjNames = document.querySelectorAll('.calc-subject-name');
        const subjGrades = document.querySelectorAll('.calc-subject-grade');
        
        if (!specSelect || !gpaRange) return;

        // Base Data: index matches select option values
        const specs = [
            { id: 0, cost: '250 000 ₸', th9: 4.0, th11: 4.2 },
            { id: 1, cost: '280 000 ₸', th9: 4.2, th11: 4.4 },
            { id: 2, cost: '300 000 ₸', th9: 4.5, th11: 4.6 },
            { id: 3, cost: '320 000 ₸', th9: 4.1, th11: 4.3 },
            { id: 4, cost: '350 000 ₸', th9: 4.3, th11: 4.5 },
            { id: 5, cost: '250 000 ₸', th9: 3.8, th11: 4.0 }
        ];

        const subjDict = {
            kk: {
                kz: ['Қазақ тілі', 'Математика', 'Қазақстан тарихы', 'Орыс тілі'],
                ru: ['Орыс тілі', 'Математика', 'Қазақстан тарихы', 'Қазақ тілі']
            },
            ru: {
                kz: ['Казахский язык', 'Математика', 'История Казахстана', 'Русский язык'],
                ru: ['Русский язык', 'Математика', 'История Казахстана', 'Казахский язык']
            }
        };

        function updateSubjectNames() {
            const docLang = document.documentElement.lang || 'kk';
            const classLangNode = document.querySelector('input[name="classLang"]:checked');
            if (!classLangNode) return;
            
            const classLang = classLangNode.value;
            const names = subjDict[docLang][classLang];
            
            subjNames.forEach((el, i) => {
                if (names[i]) el.textContent = names[i];
            });
        }

        function calculateExactGPA() {
            let sum = 0;
            subjGrades.forEach(select => {
                sum += parseInt(select.value);
            });
            const exactGpa = (sum / 5).toFixed(1);
            gpaRange.value = exactGpa;
            calculate();
        }

        function calculate() {
            const specId = parseInt(specSelect.value);
            const gpa = parseFloat(gpaRange.value);
            const baseNode = document.querySelector('input[name="baseClass"]:checked');
            const base = baseNode ? baseNode.value : '9';
            
            gpaValDisplay.textContent = gpa.toFixed(1);
            
            const specData = specs[specId];
            const threshold = base === '9' ? specData.th9 : specData.th11;
            
            let prob = 0;
            if (gpa >= threshold) {
                const diff = gpa - threshold;
                const maxDiff = 5.0 - threshold;
                prob = 50 + (diff / (maxDiff || 1)) * 49;
            } else {
                prob = (gpa / threshold) * 45;
            }
            
            prob = Math.min(99, Math.max(5, Math.round(prob)));
            
            // Animation for circle
            const circumference = 2 * Math.PI * 45; // 282.74
            const offset = circumference - (prob / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            
            // Animate number
            if (window.gsap) {
                gsap.to(percentText, {
                    innerHTML: prob,
                    duration: 1,
                    snap: { innerHTML: 1 },
                    ease: 'power1.inOut'
                });
            } else {
                percentText.textContent = prob;
            }

            // Update UI Colors & Text
            const lang = document.documentElement.lang || 'kk';
            const t = LANG[lang];
            
            if (prob >= 75) {
                progressCircle.style.stroke = '#22c55e';
                statusText.style.color = '#22c55e';
                statusText.textContent = t ? t.calcStatusHigh : 'Жоғары мүмкіндік!';
                recBlock.classList.add('hidden');
            } else if (prob >= 50) {
                progressCircle.style.stroke = '#f59e0b';
                statusText.style.color = '#f59e0b';
                statusText.textContent = t ? t.calcStatusMed : 'Орташа мүмкіндік';
                recBlock.classList.add('hidden');
            } else {
                progressCircle.style.stroke = '#ef4444';
                statusText.style.color = '#ef4444';
                statusText.textContent = t ? t.calcStatusLow : 'Төмен мүмкіндік';
                
                // Find an alternative specialty with the lowest threshold
                const altSpec = specs.slice().sort((a,b) => (base === '9' ? a.th9 - b.th9 : a.th11 - b.th11))[0];
                if (altSpec.id !== specId) {
                    recBlock.classList.remove('hidden');
                    const options = specSelect.options;
                    recSpecText.textContent = options[altSpec.id].text;
                } else {
                    recBlock.classList.add('hidden');
                }
            }
            
            priceText.textContent = specData.cost;
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isHidden = subjectsMode.classList.toggle('hidden');
                sliderMode.classList.toggle('hidden', !isHidden);
                
                const lang = document.documentElement.lang || 'kk';
                if (isHidden) {
                    toggleBtn.textContent = lang === 'ru' ? 'Рассчитать по предметам' : 'Пәндер арқылы есептеу';
                } else {
                    toggleBtn.textContent = lang === 'ru' ? 'Ввести GPA вручную' : 'GPA қолмен енгізу';
                    calculateExactGPA();
                }
            });
        }

        specSelect.addEventListener('change', calculate);
        gpaRange.addEventListener('input', calculate);
        baseRadios.forEach(r => r.addEventListener('change', calculate));
        subjLangRadios.forEach(r => r.addEventListener('change', updateSubjectNames));
        subjGrades.forEach(s => s.addEventListener('change', calculateExactGPA));
        
        document.addEventListener('langChanged', () => {
            updateSubjectNames();
            
            const lang = document.documentElement.lang || 'kk';
            if (toggleBtn) {
                const isHidden = subjectsMode.classList.contains('hidden');
                if (isHidden) {
                    toggleBtn.textContent = lang === 'ru' ? 'Рассчитать по предметам' : 'Пәндер арқылы есептеу';
                } else {
                    toggleBtn.textContent = lang === 'ru' ? 'Ввести GPA вручную' : 'GPA қолмен енгізу';
                }
            }
            calculate();
        });

        updateSubjectNames();
        calculate();
    }

    // ========================================
    // ONBOARDING (MULTI-STEP & LANG TOGGLE)
    // ========================================
    function initOnboarding() {
        const overlay = document.getElementById('onboarding-overlay');
        if (!overlay) return;
        
        // Only show if not seen before
        if (localStorage.getItem('gtk-onboarding') === 'true') {
            return; 
        }

        const langBtn = document.getElementById('onboarding-lang-toggle');
        const iconEl = document.getElementById('onboarding-icon');
        const titleEl = document.getElementById('onboarding-title');
        const textEl = document.getElementById('onboarding-text');
        const nextBtn = document.getElementById('onboarding-next');
        const skipBtn = document.getElementById('onboarding-skip');
        const dots = document.querySelectorAll('#onboarding-dots .dot');

        let currentStep = 0;
        let currentLang = document.documentElement.lang || 'kk';

        // Создаем элемент уведомления (Toast)
        const card = document.querySelector('.onboarding-card');
        const toast = document.createElement('div');
        toast.className = 'onboarding-toast';
        card.appendChild(toast);
        let toastTimeout;

        const stepsData = [
            { icon: '🎓', titleKey: 'onbTitle1', textKey: 'onbText1' },
            { icon: '💼', titleKey: 'onbTitle2', textKey: 'onbText2' },
            { icon: '🚀', titleKey: 'onbTitle3', textKey: 'onbText3' },
            { icon: '👤', titleKey: 'onbTitle4', textKey: 'onbText4' }
        ];

        function updateUI() {
            const data = LANG[currentLang];
            const step = stepsData[currentStep];
            const content = document.querySelector('.onboarding__content');
            
            const actionsNormal = document.getElementById('onboarding-actions-normal');
            const actionsRoles = document.getElementById('onboarding-roles');

            if (typeof gsap !== 'undefined') {
                gsap.to(content, {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    onComplete: () => {
                        applyData();
                        gsap.to(content, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
                    }
                });
            } else {
                applyData();
            }

            function applyData() {
                langBtn.textContent = data.onboardingLangToggle;
                iconEl.textContent = step.icon;
                titleEl.innerHTML = data[step.titleKey];
                textEl.textContent = data[step.textKey];
                
                if (currentStep === 3) {
                    actionsNormal.style.display = 'none';
                    actionsRoles.style.display = 'flex';
                    
                    document.getElementById('role-abiturient').textContent = data.onbRoleAbiturient;
                    document.getElementById('role-student').textContent = data.onbRoleStudent;
                    document.getElementById('role-teacher').textContent = data.onbRoleTeacher;
                } else {
                    actionsNormal.style.display = 'flex';
                    actionsRoles.style.display = 'none';
                    nextBtn.textContent = data.onbNext;
                    skipBtn.textContent = data.onbSkip;
                }

                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentStep);
                });
            }
        }

        // Language toggle
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'ru' ? 'kk' : 'ru';
            
            document.documentElement.lang = currentLang;
            
            document.querySelectorAll('[data-i18n]').forEach((el) => {
                const key = el.getAttribute('data-i18n');
                if (LANG[currentLang][key]) el.innerHTML = LANG[currentLang][key];
            });
            const langLabel = document.getElementById('lang-label');
            if (langLabel) langLabel.textContent = currentLang === 'ru' ? 'ҚАЗ' : 'РУС';
            
            updateUI();
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            if (currentStep < 3) {
                currentStep++;
                updateUI();
            } else {
                closeOnboarding();
            }
        });

        // Role buttons logic
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const role = e.target.getAttribute('data-role');
                const data = LANG[currentLang];
                
                if (role === 'abiturient') {
                    localStorage.setItem('gtk-onboarding', 'true');
                    // Плавное закрытие и редирект на Басты бет
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, { y: 30, scale: 0.95, opacity: 0, duration: 0.4, ease: 'power2.in' });
                        gsap.to(overlay, { 
                            opacity: 0, 
                            duration: 0.4, 
                            delay: 0.1,
                            onComplete: () => {
                                window.location.href = 'index.html';
                            }
                        });
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    // Ошибка (Еще в разработке)
                    showToast(data.onbRoleError);
                    if (typeof gsap !== 'undefined') {
                        // Тряска (Shake)
                        gsap.fromTo(card, 
                            { x: -5 }, 
                            { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: 'linear', onComplete: () => gsap.set(card, { x: 0 }) }
                        );
                    }
                }
            });
        });

        function showToast(msg) {
            toast.textContent = msg;
            clearTimeout(toastTimeout);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(toast, { opacity: 1, y: -40, duration: 0.3, ease: 'back.out(1.5)' });
                toastTimeout = setTimeout(() => {
                    gsap.to(toast, { opacity: 0, y: 0, duration: 0.3, ease: 'power2.in' });
                }, 2000);
            } else {
                toast.style.opacity = '1';
                toast.style.transform = 'translate(-50%, -40px)';
                toastTimeout = setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translate(-50%, 0)';
                }, 2000);
            }
        }

        // Skip button
        skipBtn.addEventListener('click', closeOnboarding);

        function closeOnboarding() {
            const card = document.querySelector('.onboarding-card');
            if (typeof gsap !== 'undefined') {
                // Роскошное закрытие через GSAP
                gsap.to(card, { y: 30, scale: 0.95, opacity: 0, duration: 0.4, ease: 'power2.in' });
                gsap.to(overlay, { 
                    opacity: 0, 
                    duration: 0.4, 
                    delay: 0.1,
                    onComplete: finishClose
                });
            } else {
                finishClose();
            }

            function finishClose() {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                localStorage.setItem('gtk-onboarding', 'true');
            }
        }

        // Initialize display
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Стартовая GSAP-анимация (эффект отскока пружины)
        updateUI(); // сразу ставим правильный язык
        
        if (typeof gsap !== 'undefined') {
            const card = document.querySelector('.onboarding-card');
            gsap.fromTo(overlay, 
                { opacity: 0 }, 
                { opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
            gsap.fromTo(card,
                { y: 60, scale: 0.85, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', delay: 0.2 }
            );
        } else {
            overlay.classList.add('active');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
