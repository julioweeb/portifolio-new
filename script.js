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

// Aplicar animação de fade-in aos elementos
document.querySelectorAll('.project-card, .skill-category, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
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
            emailText.textContent = 'Copiado!';
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
            emailText.textContent = 'Copiado!';
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

// Prevenir comportamento padrão de outros links vazios
document.querySelectorAll('a[href="#"]:not(#email-link)').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

