// Tema claro/escuro
const themeToggle = document.getElementById('theme-toggle');
const THEME_STORAGE_KEY = 'portfolio-theme';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

applyTheme(getPreferredTheme());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem(THEME_STORAGE_KEY, next);
    });
}

// Navegação Mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Scroll suave e highlight de navegação
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Animação das barras de habilidade
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillProgress = entry.target;
            const width = skillProgress.getAttribute('data-width');
            skillProgress.style.width = `${width}%`;
            skillObserver.unobserve(skillProgress);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-progress').forEach(progress => {
    skillObserver.observe(progress);
});

// Animação de entrada para elementos
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Aplicar animação de fade-in com efeito cascata por grupo
['.project-card', '.skill-category', '.stat-item'].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        const delay = index * 0.12;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
        fadeObserver.observe(el);
    });
});

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Adicionar classe active ao link de navegação atual
function setActiveNavLink() {
    const currentSection = window.location.hash || '#inicio';
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Inicializar
setActiveNavLink();
highlightNav();

// Copiar email ao clicar
const emailLink = document.getElementById('email-link');
const emailText = document.getElementById('email-text');

if (emailLink) {
    emailLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailLink.getAttribute('data-email');
        
        try {
            await navigator.clipboard.writeText(email);
            
            // Feedback visual
            const originalText = emailText.textContent;
            emailText.textContent = TRANSLATIONS[currentLanguage]['contact.copied'];
            emailLink.style.borderColor = 'var(--color-accent)';
            emailLink.style.background = 'rgba(59, 130, 246, 0.1)';
            
            // Restaurar após 2 segundos
            setTimeout(() => {
                emailText.textContent = originalText;
                emailLink.style.borderColor = '';
                emailLink.style.background = '';
            }, 2000);
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = email;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Feedback visual
            const originalText = emailText.textContent;
            emailText.textContent = TRANSLATIONS[currentLanguage]['contact.copied'];
            emailLink.style.borderColor = 'var(--color-accent)';
            emailLink.style.background = 'rgba(59, 130, 246, 0.1)';
            
            setTimeout(() => {
                emailText.textContent = originalText;
                emailLink.style.borderColor = '';
                emailLink.style.background = '';
            }, 2000);
        }
    });
}

// Abas de habilidades (Backend/Frontend no mesmo card)
document.querySelectorAll('.skill-category-tabs').forEach(category => {
    const tabButtons = category.querySelectorAll('.skill-tab-btn');
    const tabPanels = category.querySelectorAll('.skill-tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));

            tabPanels.forEach(panel => {
                const isTarget = panel.getAttribute('data-tab-panel') === target;
                panel.hidden = !isTarget;

                if (isTarget) {
                    panel.querySelectorAll('.skill-progress').forEach(bar => {
                        bar.style.width = `${bar.getAttribute('data-width')}%`;
                    });
                }
            });
        });
    });
});

// Carrossel de projetos
const carouselTrack = document.querySelector('.carousel-track');
const carouselPrev = document.querySelector('.carousel-arrow-prev');
const carouselNext = document.querySelector('.carousel-arrow-next');
const carouselDotsContainer = document.getElementById('projects-dots');

if (carouselTrack && carouselDotsContainer) {
    const carouselCards = Array.from(carouselTrack.children);

    carouselCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Ir para o projeto ${index + 1}`);
        dot.addEventListener('click', () => {
            carouselCards[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
        carouselDotsContainer.appendChild(dot);
    });

    const carouselDots = Array.from(carouselDotsContainer.children);

    function getCurrentCardIndex() {
        const trackLeft = carouselTrack.scrollLeft;
        let closestIndex = 0;
        let closestDistance = Infinity;
        carouselCards.forEach((card, index) => {
            const distance = Math.abs(card.offsetLeft - carouselTrack.offsetLeft - trackLeft);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        return closestIndex;
    }

    function updateCarouselUI() {
        const currentIndex = getCurrentCardIndex();
        carouselDots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));

        const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth - 1;
        if (carouselPrev) carouselPrev.disabled = carouselTrack.scrollLeft <= 0;
        if (carouselNext) carouselNext.disabled = carouselTrack.scrollLeft >= maxScroll;
    }

    function scrollByCard(direction) {
        const card = carouselCards[0];
        const gap = parseFloat(window.getComputedStyle(carouselTrack).columnGap) || 0;
        carouselTrack.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
    }

    if (carouselPrev) carouselPrev.addEventListener('click', () => scrollByCard(-1));
    if (carouselNext) carouselNext.addEventListener('click', () => scrollByCard(1));

    let scrollTimeout;
    carouselTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateCarouselUI, 100);
    });

    window.addEventListener('resize', updateCarouselUI);
    updateCarouselUI();
}

// Tradução (PT/EN/ES)
const LANG_STORAGE_KEY = 'portfolio-lang';
let currentLanguage = 'pt';

function getPreferredLanguage() {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;

    const browserLang = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    return TRANSLATIONS[browserLang] ? browserLang : 'pt';
}

function applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLanguage = lang;

    const dict = TRANSLATIONS[lang];
    document.documentElement.lang = LANGUAGE_META[lang].htmlLang;
    document.title = dict['meta.title'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });

    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.setAttribute('aria-label', dict['projects.dotAria'].replace('{n}', index + 1));
    });

    const langCurrent = document.getElementById('lang-current');
    if (langCurrent) langCurrent.textContent = LANGUAGE_META[lang].code;

    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-lang') === lang);
    });

    localStorage.setItem(LANG_STORAGE_KEY, lang);
}

const langToggle = document.getElementById('lang-toggle');
const langMenu = document.getElementById('lang-menu');

if (langToggle && langMenu) {
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langMenu.classList.toggle('open');
        langToggle.setAttribute('aria-expanded', String(isOpen));
    });

    langMenu.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            applyLanguage(option.getAttribute('data-lang'));
            langMenu.classList.remove('open');
            langToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target) && e.target !== langToggle) {
            langMenu.classList.remove('open');
            langToggle.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            langMenu.classList.remove('open');
            langToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

applyLanguage(getPreferredLanguage());

// Prevenir comportamento padrão de outros links vazios
document.querySelectorAll('a[href="#"]:not(#email-link)').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

