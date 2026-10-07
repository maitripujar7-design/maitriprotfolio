/**
 * Portfolio JavaScript Logic
 * - Vertical Sidebar Navigation with Glassmorphism
 * - Active Section Scroll Spy (IntersectionObserver)
 * - Mobile Drawer Toggle, Backdrop, & Keyboard Navigation
 * - System theme detection & animated night mode toggle switch
 * - Interactive AI Portfolio Assistant Chat
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initVerticalNav();
    initMobileSidebar();
    initTechLabExplorer();
    initJourneyTimeline();
    initProjectGalaxy();
    initInteractiveChat();
    initTestimonialsCarousel();
    initFloatingAI();
    initContactForm();
    initBackToTop();
    initCurrentYear();
});

/**
 * Initializes Night Mode Toggle Switch
 * Detects system color scheme preference and remembers user override in localStorage
 */
function initThemeToggle() {
    const themeCheckbox = document.getElementById('theme-toggle-checkbox');
    const htmlElement = document.documentElement;

    // Check saved theme in localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');

    // System preference query
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Determine initial theme:
    let initialTheme = 'dark';
    if (savedTheme) {
        initialTheme = savedTheme;
    } else if (systemPrefersDark.matches) {
        initialTheme = 'dark';
    } else {
        initialTheme = 'light';
    }

    applyTheme(initialTheme);

    // Sync switch checkbox state (checked = light, unchecked = dark)
    if (themeCheckbox) {
        themeCheckbox.checked = initialTheme === 'light';

        // Listen for user toggle interaction
        themeCheckbox.addEventListener('change', () => {
            const newTheme = themeCheckbox.checked ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    // Listen for OS/system theme changes
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            const autoTheme = e.matches ? 'dark' : 'light';
            applyTheme(autoTheme);
            if (themeCheckbox) {
                themeCheckbox.checked = autoTheme === 'light';
            }
        }
    });

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
    }
}

/**
 * Initializes Vertical Navigation & Active Section Scroll Spy
 * Automatically highlights the currently active section in the vertical sidebar
 */
function initVerticalNav() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('section[id]');

    if (!sidebarLinks.length || !sections.length) return;

    // Click handler for smooth scrolling & immediate active state update
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });

                    // Set active link immediately
                    setActiveLink(link.getAttribute('data-section'));

                    // Close mobile sidebar if open
                    closeMobileSidebar();
                }
            }
        });
    });

    // IntersectionObserver to highlight currently visible section
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                setActiveLink(currentId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    function setActiveLink(sectionId) {
        sidebarLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
}

/**
 * Initializes Mobile Drawer Sidebar & Backdrop
 * Transforms fixed sidebar into a slide-out drawer on tablet/mobile screens
 */
function initMobileSidebar() {
    const mobileTrigger = document.getElementById('mobile-menu-trigger');
    const sidebar = document.getElementById('sidebar-nav');
    const backdrop = document.getElementById('sidebar-backdrop');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (!mobileTrigger || !sidebar) return;

    // Open sidebar
    mobileTrigger.addEventListener('click', () => {
        openMobileSidebar();
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }

    // Click on backdrop to close
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeMobileSidebar();
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeMobileSidebar();
        }
    });
}

function openMobileSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    const backdrop = document.getElementById('sidebar-backdrop');
    const mobileTrigger = document.getElementById('mobile-menu-trigger');

    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    if (mobileTrigger) mobileTrigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll while open
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    const backdrop = document.getElementById('sidebar-backdrop');
    const mobileTrigger = document.getElementById('mobile-menu-trigger');

    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    if (mobileTrigger) mobileTrigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

/**
 * Helper to escape HTML and format bold and line breaks for futuristic chat bubbles
 */
function formatChatBubble(text) {
    if (!text) return '';
    let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    // Bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Markdown links: [text](url)
    escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--neon-cyan); font-weight:700; text-decoration:underline;">$1</a>');
    // Line breaks
    escaped = escaped.replace(/\n/g, '<br>');
    return escaped;
}

/**
 * Shared Knowledge Base for both in-page Chat section and floating 'Meet My Portfolio AI'
 * Answers specifically: Resume, About, Skills, Projects, MindCare, SIH 2026, Education, and Contact
 */
function generateBotResponse(rawQuery) {
    const query = (rawQuery || '').trim().toLowerCase();

    // 0. Resume / CV
    if (query === 'resume' || query.includes('resume') || query.includes('cv') || query.includes('curriculum vitae')) {
        return "📄 **Maitri's Resume (PDF):**\nYou can view and download her complete resume directly:\n• [Click here to open Maitri_Resume.pdf](assets/Maitri_Resume.pdf)\nYou can also click the **Resume** buttons in the Hero section and navigation sidebar!";
    }

    // 1. MindCare
    if (query === 'mindcare' || query.includes('mindcare') || query.includes('dementia') || query.includes('cognitive')) {
        return "🧠 **MindCare: AI-Based Cognitive Gaming & Memory Assistance Platform**\n• **Event:** Smart India Hackathon (SIH) 2026 Finalist\n• **Core Purpose:** Dementia care and elderly cognitive support\n• **Key Features:**\n  - Gamified neuro-cognitive stimulation & memory recall exercises\n  - Regional Indian language accessibility with voice-guided interaction\n  - Real-time caregiver telemetry tracking symptom progression and alertness.";
    }

    // 2. SIH 2026
    if (query === 'sih 2026' || query === 'sih' || query.includes('sih') || query.includes('hackathon') || query.includes('smart india')) {
        return "🏆 **Smart India Hackathon (SIH) 2026 Finalist!**\nMaitri led the frontend architecture and voice AI integration for **MindCare**, an assistive platform for seniors with dementia. Built during an intense 36-hour sprint, it stood out nationally for compassionate design, regional speech synthesis, and clinical caregiver telemetry.";
    }

    // 3. About
    if (query === 'about' || query.includes('about') || query.includes('who are you') || query.includes('who is maitri') || query.includes('bio') || query.includes('background')) {
        return "👤 **About Maitri K Pujar:**\nI am a Computer Science and Engineering student at Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru. I completed my schooling at St. Anne's School, Haveri, and Pre-University at Chetan PU College, Hubli.\nI am passionate about software engineering, AI assistive systems, clean architectural design, and creating technology that makes a positive real-world impact.";
    }

    // 4. Skills
    if (query === 'skills' || query === 'skill' || query.includes('skill') || query.includes('stack') || query.includes('tech stack') || query.includes('language') || query.includes('framework')) {
        return "💻 **Maitri's Technical Skills & Stack:**\n• **Programming Languages:** C, C++, Java, Python\n• **Web Technologies:** HTML5, CSS3, JavaScript (ES6+), React.js, Node.js, Express\n• **Databases:** MySQL, MongoDB\n• **Tools:** Git, GitHub, VS Code\n• **Core Foundations:** Data Structures & Algorithms, Computer Networks, DBMS, System Design.";
    }

    // 5. Projects
    if (query === 'projects' || query === 'project' || query.includes('project') || query.includes('built') || query.includes('work') || query.includes('galaxy') || query.includes('ninu')) {
        return "🚀 **Maitri's Featured Projects in Project Galaxy:**\n1) **MindCare** — AI-Based Cognitive Gaming & Memory Assistance Platform (SIH 2026 Finalist)\n2) **Ninu** — Modern Book Review & Reader Community Platform (Full-Stack Node.js, Express & MySQL)\nVisit the **Project Galaxy** section or click 'View Details' on any project card to inspect the full architecture, challenges, and key learnings!";
    }

    // 6. Education
    if (query === 'education' || query.includes('education') || query.includes('college') || query.includes('school') || query.includes('degree') || query.includes('study') || query.includes('ait') || query.includes('haveri') || query.includes('hubli')) {
        return "🎓 **Maitri's Educational Journey:**\n• **Engineering (Present):** Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru — B.E. in Computer Science & Engineering\n• **Pre-University Education:** Chetan PU College, Hubli\n• **High School Education:** St. Anne's School, Haveri.";
    }

    // 7. Contact / Connect / Hire
    if (query.includes('contact') || query.includes('hire') || query.includes('email') || query.includes('linkedin') || query.includes('github') || query.includes('reach') || query.includes('intern') || query.includes('job') || query.includes('opportunity')) {
        return "📬 **Let's Connect with Maitri:**\n• **Email:** [maitripujar7@gmail.com](mailto:maitripujar7@gmail.com)\n• **GitHub:** [github.com/maitripujar18-art](https://github.com/maitripujar18-art)\n• **LinkedIn:** [LinkedIn Profile](https://www.linkedin.com/in/mohith-b-y-3ba157396?utm_source=share_via&utm_content=profile&utm_medium=member_android)\nShe is actively open to software engineering internships and graduate opportunities for 2026! Feel free to leave a note in the Contact section.";
    }

    // 8. Greetings
    if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('sup') || query.includes('greetings')) {
        return "👋 Hello! I am **Maitri's Portfolio AI**. You can ask me quick questions about **About**, **Skills**, **Projects**, **MindCare**, **SIH 2026**, or **Education**! What would you like to explore?";
    }

    // Default fallback
    return "💡 Thank you for asking! Maitri is a Computer Science Engineering student passionate about software engineering, scalable cloud systems, and AI assistive technology. Feel free to click any of the quick prompt chips: **About**, **Skills**, **Projects**, **MindCare**, **SIH 2026**, or **Education**!";
}

/**
 * Initializes In-Page Interactive AI Assistant Chat (#chat)
 */
function initInteractiveChat() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-user-input');
    const chatMessages = document.getElementById('chat-messages');
    const promptChips = document.querySelectorAll('.chat-section .prompt-chip');

    if (!chatForm || !chatInput || !chatMessages) return;

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = chatInput.value.trim();
        if (!query) return;

        handleUserChat(query);
        chatInput.value = '';
    });

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query') || chip.textContent.trim();
            handleUserChat(query);
        });
    });

    function handleUserChat(userText) {
        appendChatMessage(userText, 'user');

        setTimeout(() => {
            const reply = generateBotResponse(userText);
            appendChatMessage(reply, 'bot');
        }, 400);
    }

    function appendChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = formatChatBubble(text);

        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/**
 * Initializes Interactive Tech Lab & Skill Explorer
 * Handles category filtering, interactive card inspection panel, and keyboard accessibility
 */
function initTechLabExplorer() {
    const filterButtons = document.querySelectorAll('.lab-filter-btn');
    const labCards = document.querySelectorAll('.lab-card');
    const panel = document.getElementById('skill-expandable-panel');
    const closeBtn = document.getElementById('panel-close-btn');

    if (!labCards.length) return;

    // 1. Category Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active state on buttons
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter cards with smooth visibility
            labCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 2. Interactive Card Inspection Panel
    labCards.forEach(card => {
        const activateCard = () => {
            // Remove previous active selection on cards
            labCards.forEach(c => c.classList.remove('active-selected'));
            card.classList.add('active-selected');

            // Extract data attributes
            const name = card.getAttribute('data-name') || card.querySelector('.card-tech-title')?.textContent;
            const category = card.getAttribute('data-category-name') || 'Technology';
            const icon = card.getAttribute('data-icon') || '💡';
            const desc = card.getAttribute('data-desc') || '';
            const topics = card.getAttribute('data-topics') || 'Core concepts and applications.';
            const app = card.getAttribute('data-app') || 'Academic coursework and projects.';

            // Populate panel fields
            const panelTitle = document.getElementById('panel-tech-title');
            const panelCategory = document.getElementById('panel-tech-category');
            const panelIcon = document.getElementById('panel-tech-icon');
            const panelDesc = document.getElementById('panel-tech-desc');
            const panelTopics = document.getElementById('panel-tech-topics');
            const panelApp = document.getElementById('panel-tech-application');

            if (panelTitle) panelTitle.textContent = name;
            if (panelCategory) panelCategory.textContent = category;
            if (panelIcon) panelIcon.textContent = icon;
            if (panelDesc) panelDesc.textContent = desc;
            if (panelTopics) panelTopics.textContent = topics;
            if (panelApp) panelApp.textContent = app;

            if (panel) {
                panel.removeAttribute('hidden');
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        };

        // Click handler
        card.addEventListener('click', activateCard);

        // Keyboard handler (Enter or Space)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateCard();
            }
        });
    });

    // Close panel button
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.setAttribute('hidden', '');
            labCards.forEach(c => c.classList.remove('active-selected'));
        });
    }
}

/**
 * Updates footer copyright year dynamically
 */
function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Initializes Interactive Timeline ("My Journey So Far")
 * Handles milestone card expansion/collapse and keyboard accessibility
 */
function initJourneyTimeline() {
    const milestoneCards = document.querySelectorAll('.journey-checkpoint-card');

    milestoneCards.forEach(card => {
        const toggleCard = (e) => {
            // Prevent event if user clicked an inner link or button
            if (e.target.closest('a') || e.target.closest('button')) return;

            const isExpanded = card.getAttribute('aria-expanded') === 'true';
            const expandable = card.querySelector('.milestone-expandable-content');

            if (expandable) {
                if (isExpanded) {
                    card.setAttribute('aria-expanded', 'false');
                    expandable.setAttribute('hidden', '');
                } else {
                    card.setAttribute('aria-expanded', 'true');
                    expandable.removeAttribute('hidden');
                }
            }
        };

        card.addEventListener('click', toggleCard);

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard(e);
            }
        });
    });
}

/**
 * Initializes Interactive Project Galaxy
 * Handles floating celestial card interactions, detail inspector modal,
 * and keyboard accessibility.
 */
function initProjectGalaxy() {
    const projectCards = document.querySelectorAll('.galaxy-card');
    const detailsButtons = document.querySelectorAll('.galaxy-details-btn');
    const modalBackdrop = document.getElementById('galaxy-modal-backdrop');
    const modalCloseBtn = document.getElementById('galaxy-modal-close');
    const modalDismissBtn = document.getElementById('galaxy-modal-dismiss-btn');

    if (!modalBackdrop) return;

    // Database of complete project details
    const projectsData = {
        mindcare: {
            title: "MindCare: AI-Based Cognitive Gaming & Memory Assistance Platform",
            subtitle: "Dementia care and elderly cognitive support • SIH 2026",
            badge: "★ Featured Project • SIH 2026 Finalist",
            category: "AI Healthcare & Assistive Tech",
            icon: "🚀",
            banner: "assets/mindcare-preview.jpg",
            fullDesc: "MindCare is an AI-powered assistive ecosystem engineered to combat the progression of cognitive decline in elderly individuals suffering from Alzheimer's and early-to-moderate dementia. The platform combines gamified neuro-cognitive stimulation (pattern recognition, spatial navigation, and daily recall puzzles) with real-time voice-driven interactions in regional Indian languages. Caregivers are equipped with a live health telemetry dashboard monitoring symptom progressions, memory score trajectories, and behavioral alertness indices to ensure proactive intervention and peace of mind.",
            role: "Lead System Designer & Frontend / AI Integration Developer. Led user-centered interface architecture, created senior-friendly high-contrast accessible UI layouts, integrated Web Speech APIs for speech synthesis/recognition in regional Indian languages, and linked neural network scoring models during the 36-hour SIH 2026 Hackathon sprint.",
            tech: [
                "Python",
                "TensorFlow AI",
                "Web Speech API",
                "React.js",
                "Node.js",
                "Express",
                "MongoDB Atlas",
                "Chart.js Telemetry",
                "WebSockets"
            ],
            challenges: "Elderly users with dementia experience heightened cognitive friction with conventional touch interfaces and complex menu hierarchies. We addressed this challenge by developing voice-driven interaction routines capable of understanding nuanced regional language accents, designing high-contrast distraction-free layouts, and keeping audio latency minimal for seamless conversational recall.",
            learnings: "Mastered empathetic accessibility principles (WCAG cognitive guidelines for seniors), integrated speech processing pipelines, learned rapid prototype scaling under hackathon pressure, and collaborated across multi-disciplinary teams bridging medical advisory concepts and full-stack software architecture.",
            link: "https://github.com/maitripujar18-art"
        },
        ninu: {
            title: "Ninu: Book Review Platform",
            subtitle: "Books, reader opinions, and community reviews",
            badge: "✦ Personal / Mini Project • Live Hub",
            category: "Full-Stack Web Platform",
            icon: "📚",
            banner: "assets/ninu-preview.jpg",
            fullDesc: "Ninu is a modern literary platform and reader community web application where book enthusiasts discover curated titles, read authentic member reviews, share personal ratings, and engage in meaningful reading discussions. Designed with an elegant glassmorphism aesthetic, Ninu offers full-text search, genre-based browsing (Fiction, Sci-Fi, Non-Fiction, Philosophy), personalized reading lists, and dynamic aggregate review scores.",
            role: "Full-Stack Developer. Architected the complete project lifecycle: modeled relational MySQL database schemas, developed secure RESTful API endpoints with Node.js/Express, implemented client-side state persistence and JWT authentication, and engineered a responsive glassmorphic frontend interface using vanilla CSS.",
            tech: [
                "JavaScript (ES6+)",
                "HTML5 & CSS3",
                "Node.js",
                "Express.js",
                "MySQL Database",
                "RESTful APIs",
                "JWT Authentication",
                "LocalStorage"
            ],
            challenges: "Engineering responsive client-side live search and multi-criteria book filtering without degrading render performance on slower devices. Additionally, aggregating weighted reader ratings while preventing duplicate submissions and ensuring flawless cross-device layout consistency.",
            learnings: "Deepened practical expertise in relational database normalization, SQL queries and indexing, RESTful API contract design, asynchronous state management in JavaScript, and crafting lightweight, responsive glassmorphism UI components without heavy third-party framework overhead.",
            link: "https://github.com/maitripujar18-art"
        }
    };

    let previousActiveElement = null;

    // Function to open the inspector modal with project data
    function openProjectModal(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        previousActiveElement = document.activeElement;

        // Populate modal fields
        const badgeEl = document.getElementById('modal-project-badge');
        const catEl = document.getElementById('modal-project-category');
        const iconEl = document.getElementById('modal-project-icon');
        const titleEl = document.getElementById('modal-project-title');
        const subEl = document.getElementById('modal-project-subtitle');
        const bannerEl = document.getElementById('modal-project-banner');
        const fullDescEl = document.getElementById('modal-project-full-desc');
        const roleEl = document.getElementById('modal-project-role');
        const techListEl = document.getElementById('modal-project-tech-list');
        const challengesEl = document.getElementById('modal-project-challenges');
        const learningsEl = document.getElementById('modal-project-learnings');
        const linkEl = document.getElementById('modal-project-external-link');

        if (badgeEl) badgeEl.textContent = data.badge;
        if (catEl) catEl.textContent = data.category;
        if (iconEl) iconEl.textContent = data.icon;
        if (titleEl) titleEl.textContent = data.title;
        if (subEl) subEl.textContent = data.subtitle;
        if (bannerEl) {
            bannerEl.src = data.banner;
            bannerEl.alt = `${data.title} preview screenshot`;
        }
        if (fullDescEl) fullDescEl.textContent = data.fullDesc;
        if (roleEl) roleEl.textContent = data.role;

        if (techListEl) {
            techListEl.innerHTML = '';
            data.tech.forEach(techItem => {
                const pill = document.createElement('span');
                pill.className = 'modal-tech-badge';
                pill.textContent = techItem;
                techListEl.appendChild(pill);
            });
        }

        if (challengesEl) challengesEl.textContent = data.challenges;
        if (learningsEl) learningsEl.textContent = data.learnings;
        if (linkEl) linkEl.href = data.link;

        // Display modal
        modalBackdrop.removeAttribute('hidden');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        // Force reflow for smooth transition
        void modalBackdrop.offsetWidth;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update card aria-expanded
        const activeCard = document.querySelector(`.galaxy-card[data-project-id="${projectId}"]`);
        if (activeCard) {
            activeCard.setAttribute('aria-expanded', 'true');
        }

        // Set focus to close button
        if (modalCloseBtn) {
            modalCloseBtn.focus();
        }
    }

    // Function to close the inspector modal
    function closeProjectModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
        modalBackdrop.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            modalBackdrop.setAttribute('hidden', '');
        }, 300);

        // Reset aria-expanded on cards
        projectCards.forEach(card => {
            card.setAttribute('aria-expanded', 'false');
        });

        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    }

    // Card click event
    projectCards.forEach(card => {
        const projectId = card.getAttribute('data-project-id');

        card.addEventListener('click', (e) => {
            // Ignore if user clicked external view link or details button
            if (e.target.closest('.galaxy-view-btn')) return;
            openProjectModal(projectId);
        });

        // Keyboard navigation (Enter / Space)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.closest('.galaxy-view-btn')) return;
                e.preventDefault();
                openProjectModal(projectId);
            }
        });
    });

    // Details button click event
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.getAttribute('data-project-target');
            if (target) {
                openProjectModal(target);
            }
        });
    });

    // Close buttons and backdrop click
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    if (modalDismissBtn) {
        modalDismissBtn.addEventListener('click', closeProjectModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeProjectModal();
        }
    });

    // Escape key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalBackdrop.hasAttribute('hidden')) {
            closeProjectModal();
        }
    });
}

/**
 * Initializes Interactive Testimonials Carousel
 * Handles sliding transitions, autoplay with pause-on-hover, dot pagination, and touch swipe
 */
function initTestimonialsCarousel() {
    const carouselContainer = document.getElementById('testimonials-carousel');
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!carouselContainer || !track || !slides.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    const autoplayInterval = 5000; // 5 seconds

    function updateCarousel(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add('active');
                slide.removeAttribute('aria-hidden');
            } else {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            }
        });

        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }

    function nextSlide() {
        updateCarousel(currentIndex + 1);
    }

    function prevSlide() {
        updateCarousel(currentIndex - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                updateCarousel(index);
                resetAutoplay();
            }
        });
    });

    carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    function startAutoplay() {
        if (!autoplayTimer) {
            autoplayTimer = setInterval(nextSlide, autoplayInterval);
        }
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Touch Swipe Support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const threshold = 45;
        if (swipeDistance > threshold) {
            prevSlide();
        } else if (swipeDistance < -threshold) {
            nextSlide();
        }
    }

    updateCarousel(0);
    startAutoplay();
}

/**
 * Initializes Floating 'Meet My Portfolio AI' Chatbot Widget
 * Manages floating launcher, expandable widget window, quick questions, and conversation flow
 */
function initFloatingAI() {
    const launcher = document.getElementById('floating-ai-launcher');
    const widget = document.getElementById('floating-ai-widget');
    const closeBtn = document.getElementById('floating-ai-close');
    const messages = document.getElementById('floating-ai-messages');
    const form = document.getElementById('floating-ai-form');
    const input = document.getElementById('floating-ai-input');
    const chips = document.querySelectorAll('.floating-chip');

    if (!launcher || !widget) return;

    launcher.addEventListener('click', () => {
        const isHidden = widget.hasAttribute('hidden');
        if (isHidden) {
            openFloatingWidget();
        } else {
            closeFloatingWidget();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeFloatingWidget);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !widget.hasAttribute('hidden')) {
            closeFloatingWidget();
        }
    });

    function openFloatingWidget() {
        widget.removeAttribute('hidden');
        launcher.setAttribute('aria-expanded', 'true');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }

    function closeFloatingWidget() {
        widget.setAttribute('hidden', '');
        launcher.setAttribute('aria-expanded', 'false');
    }

    if (form && input && messages) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            handleFloatingChat(text);
            input.value = '';
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query') || chip.textContent.trim();
            handleFloatingChat(query);
        });
    });

    function handleFloatingChat(userText) {
        appendFloatingMessage(userText, 'user');

        setTimeout(() => {
            const reply = generateBotResponse(userText);
            appendFloatingMessage(reply, 'bot');
        }, 400);
    }

    function appendFloatingMessage(text, sender) {
        if (!messages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = formatChatBubble(text);

        msgDiv.appendChild(bubble);
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }
}

/**
 * Initializes Contact Form with validation and feedback animation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedbackBox = document.getElementById('contact-form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('sender-name');
        const emailInput = document.getElementById('sender-email');
        const messageInput = document.getElementById('sender-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            if (feedbackBox) {
                feedbackBox.className = 'form-feedback';
                feedbackBox.style.background = 'rgba(239, 68, 68, 0.15)';
                feedbackBox.style.border = '1px solid #ef4444';
                feedbackBox.style.color = '#fca5a5';
                feedbackBox.textContent = 'Please fill in all required fields (Name, Email, Message).';
                feedbackBox.removeAttribute('hidden');
            }
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Transmitting...</span>';

            setTimeout(() => {
                if (feedbackBox) {
                    feedbackBox.className = 'form-feedback success';
                    feedbackBox.style.background = '';
                    feedbackBox.style.border = '';
                    feedbackBox.style.color = '';
                    feedbackBox.innerHTML = `✓ Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been sent successfully. Maitri will get back to you at <strong>${escapeHtml(email)}</strong> soon.`;
                    feedbackBox.removeAttribute('hidden');
                }

                form.reset();
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.innerHTML = originalContent;

                feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 700);
        }
    });

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

/**
 * Initializes Back to Top button smooth scroll
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-trigger');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


