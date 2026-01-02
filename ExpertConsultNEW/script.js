// ========================================
// EXPERTCONSULT - SCRIPT.JS COMPLET
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================
    // LOADER
    // ========================================
    const loader = document.querySelector('.page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });

    // ========================================
    // CURSOR PERSONNALISÉ
    // ========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateOutline);
        };
        
        animateOutline();
        
        // Agrandissement du curseur au survol des liens
        const clickables = document.querySelectorAll('a, button, .service-card, .expert-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(2)';
                cursorOutline.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
            });
        });
    }

    // ========================================
    // NAVBAR STICKY
    // ========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========================================
    // MENU MOBILE
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
        });
        
        // Fermer le menu en cliquant sur un lien
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
            });
        });
    }

    // ========================================
    // PARTICULES CANVAS (HERO)
    // ========================================
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let particlesArray = [];
        const numberOfParticles = 80;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Connecter les particules proches
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i + 1; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 600})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        init();
        animate();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });
    }

    // ========================================
    // COMPTEURS ANIMÉS (STATS)
    // ========================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                
                const updateCounter = () => {
                    const current = parseFloat(counter.innerText.replace(/[^0-9.]/g, ''));
                    const increment = target / speed;
                    
                    if (current < target) {
                        counter.innerText = Math.min(Math.ceil(current + increment), target).toLocaleString();
                        setTimeout(updateCounter, 1);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));

    // ========================================
    // GESTION VIDÉO
    // ========================================
    const playBtn = document.getElementById('playBtn');
    const video = document.getElementById('presentationVideo');
    
    if(playBtn && video) {
        playBtn.addEventListener('click', () => {
            video.play();
            video.controls = true;
            playBtn.style.display = 'none';
        });
        
        video.addEventListener('pause', () => {
            if (!video.seeking && video.paused && video.currentTime !== 0) {
                video.controls = false;
                playBtn.style.display = 'flex';
            }
        });
        
        video.addEventListener('ended', () => {
            video.controls = false;
            playBtn.style.display = 'flex';
        });
    }

    // ========================================
    // CHATBOT
    // ========================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const quickReplies = document.querySelectorAll('.quick-reply');
    
    if (chatbotToggle && chatbotWindow) {
        // Ouvrir/fermer le chatbot
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                chatbotInput.focus();
                // Masquer le badge
                const badge = chatbotToggle.querySelector('.chatbot-badge');
                if (badge) badge.style.display = 'none';
            }
        });
        
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
        
        // Réponses automatiques du bot
        const botResponses = {
            'consultation gratuite': "Parfait ! Pour bénéficier d'une consultation gratuite, veuillez remplir le formulaire de contact en bas de page. Un de nos experts vous contactera dans les 24h. 😊",
            'services': "Nous offrons plusieurs services :\n• Marketing Digital 📱\n• Rédaction de contenu ✍️\n• Design Graphique 🎨\n• SEO & Référencement 🔍\n\nLequel vous intéresse ?",
            'comment ça marche': "C'est très simple :\n1️⃣ Remplissez le formulaire de contact\n2️⃣ Un expert vous contacte sous 24h\n3️⃣ Première consultation gratuite\n4️⃣ Nous créons votre stratégie personnalisée",
            'tarifs': "Nos tarifs sont personnalisés selon vos besoins. La première consultation est gratuite ! Contactez-nous pour un devis adapté à votre projet. 💼",
            'default': "Merci pour votre message ! Un de nos experts va vous répondre rapidement. En attendant, vous pouvez remplir le formulaire de contact pour une consultation gratuite. 😊"
        };
        
        // Fonction pour ajouter un message
        const addMessage = (text, isUser = false) => {
            // Supprimer les quick replies s'ils existent
            const existingQuickReplies = chatbotMessages.querySelector('.quick-replies');
            if (existingQuickReplies) {
                existingQuickReplies.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = isUser ? 'user-message' : 'bot-message';
            
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = `
                ${!isUser ? `<div class="message-avatar"><img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Bot"></div>` : ''}
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${time}</span>
                </div>
            `;
            
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };
        
        // Fonction pour obtenir une réponse du bot
        const getBotResponse = (message) => {
            message = message.toLowerCase();
            
            if (message.includes('consultation') || message.includes('gratuit')) {
                return botResponses['consultation gratuite'];
            } else if (message.includes('service')) {
                return botResponses['services'];
            } else if (message.includes('marche') || message.includes('fonctionne')) {
                return botResponses['comment ça marche'];
            } else if (message.includes('tarif') || message.includes('prix') || message.includes('coût')) {
                return botResponses['tarifs'];
            } else {
                return botResponses['default'];
            }
        };
        
        // Envoyer un message
        const sendMessage = () => {
            const message = chatbotInput.value.trim();
            if (message) {
                addMessage(message, true);
                chatbotInput.value = '';
                
                // Simuler une réponse du bot après un délai
                setTimeout(() => {
                    const response = getBotResponse(message);
                    addMessage(response);
                }, 1000);
            }
        };
        
        chatbotSend.addEventListener('click', sendMessage);
        
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Quick replies
        quickReplies.forEach(reply => {
            reply.addEventListener('click', () => {
                const message = reply.getAttribute('data-message');
                addMessage(message, true);
                
                setTimeout(() => {
                    const response = getBotResponse(message);
                    addMessage(response);
                }, 1000);
            });
        });
    }

    // ========================================
    // FORMULAIRE DE CONTACT
    // ========================================
    const form = document.getElementById('consultationForm');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            
            // Animation de succès
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Envoyé avec succès !</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #4cd964, #5ac777)';
            
            // Notification personnalisée
            showNotification(`Merci ${name} ! Votre demande concernant "${subject}" a été envoyée. Un expert vous contactera sous 24h à ${email}.`, 'success');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        });
    }

    // ========================================
    // NEWSLETTER
    // ========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            showNotification(`Merci ! Vous êtes maintenant inscrit à notre newsletter avec l'email : ${email}`, 'success');
            newsletterForm.reset();
        });
    }

    // ========================================
    // SYSTÈME DE NOTIFICATIONS
    // ========================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? '#4cd964' : '#5945fd'};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            font-size: 14px;
            animation: slideInRight 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}" style="font-size: 24px;"></i>
                <p style="margin: 0; line-height: 1.5;">${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }

    // ========================================
    // CARTE INTERACTIVE (LEAFLET)
    // ========================================
    const mapElement = document.getElementById('map');
    if (mapElement && typeof L !== 'undefined') {
        // Coordonnées de Paris, Champs-Élysées
        const map = L.map('map').setView([48.8698, 2.3078], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background: linear-gradient(135deg, #5945fd, #7d6ffe); width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(89, 69, 253, 0.5);"><i class="fas fa-building" style="color: white; transform: rotate(45deg); font-size: 18px;"></i></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        const marker = L.marker([48.8698, 2.3078], { icon: customIcon }).addTo(map);
        marker.bindPopup('<b>ExpertConsult</b><br>123 Avenue des Champs-Élysées<br>Paris, France').openPopup();
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // ANIMATIONS AU SCROLL (INTERSECTION OBSERVER)
    // ========================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .expert-card, .testimonial-card, .stat-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(el => observer.observe(el));
    };
    
    animateOnScroll();

    // ========================================
    // EFFET PARALLAXE
    // ========================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ========================================
    // TYPING EFFECT
    // ========================================
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const texts = ['consultants experts', 'stratèges digitaux', 'experts certifiés'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }

    // ========================================
    // CONSOLE MESSAGE
    // ========================================
    console.log('%c👋 Bienvenue sur ExpertConsult !', 'color: #5945fd; font-size: 20px; font-weight: bold;');
    console.log('%cVous cherchez des experts ? Vous êtes au bon endroit ! 🚀', 'color: #7d6ffe; font-size: 14px;');
});

// ========================================
// ANIMATIONS CSS SUPPLÉMENTAIRES
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(500px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);