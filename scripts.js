/* ==========================================================================
   BAWANKULE TRADERS (बावनकुले ट्रेडर्स) - JAVASCRIPT
   Description: Custom Interactive Elements for Premium Industrial Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Sticky Header & Shrink Effect
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately in case page is refreshed mid-scroll

    // 3. Mobile Hamburger Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent body scroll when menu is active on mobile
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. Scroll Spy: Highlight Active Section in Navbar
    const sections = document.querySelectorAll('section, header');
    const scrollSpy = () => {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 200; // Offset for sticky navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id') || 'home';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

    // 5. Intersection Observer for Scroll Reveal Animations
    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-delay-1, .scroll-reveal-delay-2, .scroll-reveal-delay-3'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal once only
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 6. Project Gallery Filter & Layout
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            let visibleCount = 0;

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Hide/show item with animations
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    visibleCount++;
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        // Only apply wide span when 'all' filter is active
                        if (filterValue === 'all') {
                            item.style.gridColumn = item.classList.contains('gallery-item--wide') ? 'span 2' : '';
                        } else {
                            item.style.gridColumn = '';
                        }
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    item.style.gridColumn = '';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // Match CSS transition duration
                }
            });
        });
    });

    // 7. Lightbox Gallery Modal with Navigation
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCat = document.getElementById('lightbox-cat');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryIndex = 0;
    let visibleGalleryItems = [];

    // Update list of visible items based on current active category
    const updateVisibleItems = () => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        visibleGalleryItems = Array.from(galleryItems).filter(item => {
            return activeFilter === 'all' || item.getAttribute('data-category') === activeFilter;
        });
    };

    const openLightbox = (index) => {
        updateVisibleItems();
        currentGalleryIndex = index;
        const currentItem = visibleGalleryItems[currentGalleryIndex];
        
        const imgSrc = currentItem.querySelector('img').getAttribute('src');
        const imgAlt = currentItem.querySelector('img').getAttribute('alt');
        const category = currentItem.querySelector('.category-tag').innerText;
        const title = currentItem.querySelector('h4').innerText;
        const desc = currentItem.querySelector('p').innerText;

        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt);
        lightboxCat.innerText = category;
        lightboxTitle.innerText = title;
        lightboxDesc.innerText = desc;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const showNextImage = () => {
        if (visibleGalleryItems.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryItems.length;
        openLightbox(currentGalleryIndex);
    };

    const showPrevImage = () => {
        if (visibleGalleryItems.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        openLightbox(currentGalleryIndex);
    };

    // Attach click event to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            updateVisibleItems();
            const index = visibleGalleryItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
        lightboxModal.addEventListener('click', closeLightbox);
        
        // Prevent closing when clicking content card itself
        lightboxModal.querySelector('.lightbox-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

    // 8. Custom Testimonial Slider
    const testimonialsWrapper = document.getElementById('testimonials-wrapper');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const sliderPrev = document.getElementById('slider-prev');
    const sliderNext = document.getElementById('slider-next');
    const sliderDotsContainer = document.getElementById('slider-dots');

    if (testimonialsWrapper && testimonialSlides.length > 0) {
        let currentSlideIndex = 0;
        const totalSlides = testimonialSlides.length;
        let slideInterval;

        // Generate Dots
        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDotsContainer.appendChild(dot);
        });

        const updateDots = () => {
            const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlideIndex);
            });
        };

        const goToSlide = (index) => {
            currentSlideIndex = index;
            testimonialsWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            updateDots();
            resetAutoplay();
        };

        const nextSlide = () => {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            goToSlide(currentSlideIndex);
        };

        const prevSlide = () => {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlideIndex);
        };

        if (sliderNext) sliderNext.addEventListener('click', nextSlide);
        if (sliderPrev) sliderPrev.addEventListener('click', prevSlide);

        // Autoplay Logic
        const startAutoplay = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const resetAutoplay = () => {
            clearInterval(slideInterval);
            startAutoplay();
        };

        // Pause on Hover
        testimonialsWrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
        testimonialsWrapper.addEventListener('mouseleave', startAutoplay);

        startAutoplay();
    }

    // 9. Hero Background Video – ensure autoplay works on mobile
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Some mobile browsers require a user gesture; attempt silent play on first touch
        const attemptPlay = () => {
            heroVideo.play().catch(() => { /* silent — poster image shows as fallback */ });
            document.removeEventListener('touchstart', attemptPlay);
            document.removeEventListener('click', attemptPlay);
        };
        heroVideo.play().catch(() => {
            // Autoplay blocked — wait for first interaction
            document.addEventListener('touchstart', attemptPlay, { once: true });
            document.addEventListener('click', attemptPlay, { once: true });
        });
    }

    // 10. Lead Generation Form Submission
    const leadForm = document.getElementById('lead-generation-form');
    const successAlert = document.getElementById('success-alert');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple frontend validation
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const service = document.getElementById('form-requirement').value;

            if (!name || !phone || !service) {
                alert('Please fill out all required fields.');
                return;
            }

            // Simulate form submission status change
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Submitting...</span><i class="spinner"></i>`;

            // Simulate backend delay (1.5 seconds)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Show success screen card inside the container
                successAlert.classList.add('active');
                
                // Print generated lead to console for logging/mock analytics
                console.log('--- LEAD GENERATED ---');
                console.log('Name:', name);
                console.log('Phone:', phone);
                console.log('Email:', document.getElementById('form-email').value);
                console.log('Service Requested:', service);
                console.log('Message:', document.getElementById('form-message').value);
                console.log('----------------------');

                leadForm.reset();

                // Clear success message after 7 seconds
                setTimeout(() => {
                    successAlert.classList.remove('active');
                }, 7000);

            }, 1500);
        });
    }
});

// 10. Prefill Contact Form function (Global scope for inline HTML trigger)
function prefillContactForm(serviceName) {
    const requirementSelect = document.getElementById('form-requirement');
    const contactSection = document.getElementById('contact');

    if (requirementSelect && contactSection) {
        requirementSelect.value = serviceName;
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add a temporary subtle glow to the selector to draw user's attention
        const wrapper = requirementSelect.closest('.input-wrapper');
        if (wrapper) {
            wrapper.style.boxShadow = '0 0 15px rgba(255, 107, 0, 0.6)';
            setTimeout(() => {
                wrapper.style.boxShadow = '';
            }, 1500);
        }
    }
}
