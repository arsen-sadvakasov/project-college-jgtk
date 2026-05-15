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
        gsap.set(heroEls, { opacity: 0 });
        gsap.set('.hero__watermark', { opacity: 0 });

        const heroTl = gsap.timeline({ delay: 0.2 });
        heroTl
            .to('.hero__watermark', {
                opacity: 0.04, scale: 1, duration: 1, ease: 'power2.out',
            })
            .to('.hero__badge', {
                opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)',
            }, '-=0.6')
            .to('.hero__title-line', {
                opacity: 1, y: 0, duration: 0.7,
                stagger: 0.12, ease: 'power4.out',
            }, '-=0.3')
            .to('.hero__subtitle', {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            }, '-=0.4')
            .to('.hero__actions .btn', {
                opacity: 1, y: 0, scale: 1, duration: 0.5,
                stagger: 0.1, ease: 'back.out(1.7)',
            }, '-=0.3')
            .to('.hero__scroll', {
                opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
            }, '-=0.2');

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
                y: 60,
                duration: 0.8, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 92%',
                    end: 'top 50%',
                    toggleActions: 'play reverse play reverse',
                },
            });
        });

        // ── SECTION HEADERS — slide up ──
        document.querySelectorAll('.section__header').forEach((header) => {
            gsap.from(header.querySelectorAll('.section__tag, .section__title, .section__desc'), {
                y: 30,
                duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%',
                    toggleActions: 'play reverse play reverse',
                },
            });
        });

        // ── PROFESSION CARDS — stagger slide up ──
        const profCards = document.querySelectorAll('.prof-card');
        if (profCards.length) {
            gsap.from(profCards, {
                y: 50, scale: 0.95,
                duration: 0.5, stagger: 0.07, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.professions__grid',
                    start: 'top 85%',
                    toggleActions: 'play reverse play reverse',
                },
            });
        }

        // ── MISSION ──
        const missionContent = document.querySelector('.mission__content');
        if (missionContent) {
            gsap.from(missionContent, {
                x: -60,
                duration: 0.8, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.mission__layout',
                    start: 'top 85%',
                    toggleActions: 'play reverse play reverse',
                },
            });
        }

        const missionStats = document.querySelector('.mission__stats');
        if (missionStats) {
            gsap.from(missionStats, {
                x: 60,
                duration: 0.8, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.mission__layout',
                    start: 'top 85%',
                    toggleActions: 'play reverse play reverse',
                },
            });
        }

        gsap.from('.mission__feature', {
            x: -30,
            duration: 0.5, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.mission__features',
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
            },
        });

        // Stats — counter animation
        document.querySelectorAll('.stat-block').forEach((block, i) => {
            gsap.from(block, {
                y: 30, scale: 0.9,
                duration: 0.5, delay: i * 0.08, ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: block,
                    start: 'top 92%',
                    toggleActions: 'play reverse play reverse',
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
                            val: target, duration: 2, ease: 'power2.out',
                            onUpdate() { numEl.textContent = Math.round(this.targets()[0].val); },
                        });
                    },
                    once: true,
                });
            }
        });

        // ── DOCUMENTS — slide from left ──
        gsap.from('.doc-item', {
            x: -40,
            duration: 0.4, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.documents__list',
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
            },
        });

        // ── CONTACT — split entrance ──
        gsap.from('.contact__info', {
            x: -50,
            duration: 0.7, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact__layout',
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
            },
        });

        gsap.from('.contact__form-wrapper', {
            x: 50,
            duration: 0.7, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact__layout',
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
            },
        });

        // ── TIMELINE — stagger items ──
        gsap.from('.timeline__item', {
            x: -40, scale: 0.95,
            duration: 0.5, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.timeline__track',
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
            },
        });

        // ── FOOTER ──
        gsap.from('.footer__content', {
            y: 20,
            duration: 0.5, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%',
                toggleActions: 'play reverse play reverse',
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

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
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

        // Initialize tech tag clicks
        initTechTags();
    }

    // ========================================
    // TECH TAG INFO (Clickable tags)
    // ========================================
    function initTechTags() {
        const allTags = document.querySelectorAll('.modal__tech-tag[data-info]');

        allTags.forEach((tag) => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();

                const techSection = tag.closest('.modal__tech');
                if (!techSection) return;

                const infoPanel = techSection.querySelector('.modal__tech-info');
                if (!infoPanel) return;

                const allSiblingTags = techSection.querySelectorAll('.modal__tech-tag');
                const info = tag.getAttribute('data-info');
                const tagName = tag.textContent.trim();

                // If this tag is already active — close it
                if (tag.classList.contains('active')) {
                    tag.classList.remove('active');
                    infoPanel.classList.remove('active');
                    infoPanel.innerHTML = '';
                    return;
                }

                // Deactivate all sibling tags
                allSiblingTags.forEach((t) => t.classList.remove('active'));

                // Activate this tag
                tag.classList.add('active');

                // Show info panel
                infoPanel.innerHTML = `<strong>${tagName}</strong>${info}`;
                infoPanel.classList.add('active');
            });
        });
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
                        opacity: 0,
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
        if (!btn) return;

        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('gtk-theme', newTheme);

            document.body.style.transition = 'background 0.4s ease, color 0.4s ease';
            setTimeout(() => { document.body.style.transition = ''; }, 500);
        });
    }

    // ========================================
    // LANGUAGE TOGGLE (Kazakh / Russian)
    // ========================================
    const LANG = {
        kk: {
            navLinks: ['Мамандықтар', 'Миссиямыз', 'Құжаттар', 'Байланыс'],
            logoSub: 'гуманитарлық-техникалық колледжі',
            heroBadge: '2025-2026 оқу жылына қабылдау ашық',
            heroLines: ['Жетісу', 'гуманитарлық-техникалық', 'колледжі'],
            heroSub: 'Болашаққа бастар жол — сапалы білім мен шынайы мақсаттан басталады.',
            heroBtn1: 'Құжат тапсыру',
            heroBtn2: 'Мамандықтар',
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
        },
        ru: {
            navLinks: ['Специальности', 'Наша миссия', 'Документы', 'Контакты'],
            logoSub: 'гуманитарно-технический колледж',
            heroBadge: 'Приём на 2025-2026 учебный год открыт',
            heroLines: ['Жетысу', 'гуманитарно-технический', 'колледж'],
            heroSub: 'Путь в будущее начинается с качественного образования и настоящих целей.',
            heroBtn1: 'Подать документы',
            heroBtn2: 'Специальности',
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
        },
    };

    function applyLanguage(lang) {
        const t = LANG[lang];
        if (!t) return;

        // Helper: set text/html
        const q = (sel) => document.querySelector(sel);
        const qa = (sel) => document.querySelectorAll(sel);

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
        if (heroBtns[0]) heroBtns[0].textContent = t.heroBtn1;
        if (heroBtns[1]) heroBtns[1].textContent = t.heroBtn2;
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
    }

    function initLanguageToggle() {
        const btn = document.getElementById('lang-toggle');
        const label = document.getElementById('lang-label');
        if (!btn || !label) return;

        let currentLang = localStorage.getItem('gtk-lang') || 'kk';

        // Apply saved language on load
        if (currentLang === 'ru') {
            applyLanguage('ru');
            label.textContent = 'ҚАЗ';
        }

        btn.addEventListener('click', () => {
            currentLang = currentLang === 'kk' ? 'ru' : 'kk';
            applyLanguage(currentLang);
            label.textContent = currentLang === 'kk' ? 'РУС' : 'ҚАЗ';
            localStorage.setItem('gtk-lang', currentLang);
        });
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
                    opacity: 0,
                    y: -10,
                    duration: 0.4,
                    stagger: 0.1,
                    onComplete: () => {
                        form.style.display = 'none';
                        ratingContainer.parentElement.style.display = 'none';
                        successMsg.style.display = 'block';
                        gsap.from(successMsg, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
