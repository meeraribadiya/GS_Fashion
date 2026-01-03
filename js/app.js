document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader - Removed as requested

    // 2. Mobile Menu
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2b. Smooth scroll with navbar offset
    const navbar = document.querySelector('.navbar');
    const navHeight = navbar ? navbar.offsetHeight : 0;
    function animateSection(el){
        if (!el) return;
        el.classList.remove('clicked-reveal');
        // force reflow to restart animation
        // eslint-disable-next-line no-unused-expressions
        el.offsetHeight;
        el.classList.add('clicked-reveal');
        const onEnd = () => { el.classList.remove('clicked-reveal'); el.removeEventListener('animationend', onEnd); };
        el.addEventListener('animationend', onEnd);
    }

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const y = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                window.scrollTo({ top: y, behavior: 'smooth' });
                animateSection(targetEl);
                // close mobile menu after click
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = menuBtn && menuBtn.querySelector('i');
                    if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
                }
            }
        });
    });

    // 3. Render Hero Slider (guarded if hero container exists)
    const heroContainer = document.getElementById('hero-slider');
    const heroFigureImg = document.getElementById('hero-figure-img');
    if (heroContainer) {
        if (typeof HERO_IMAGES !== 'undefined' && HERO_IMAGES.length > 0) {
            HERO_IMAGES.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = "images/" + imgSrc;
                img.classList.add('hero-slide');
                if (index === 0) img.classList.add('active');
                heroContainer.appendChild(img);
            });
            // Center figure uses first image
            if (heroFigureImg) {
                heroFigureImg.src = "images/" + HERO_IMAGES[0];
            }

            // Auto slide
            let currentSlide = 0;
            const slides = document.querySelectorAll('.hero-slide');
            if (slides.length > 1) {
                setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 5000);
            }
        } else {
            // Fallback if no hero images
            heroContainer.innerHTML = '<div style="width:100%; height:100%; background:#ddd; display:flex; justify-content:center; align-items:center;">Add images to /images/hero/</div>';
            if (heroFigureImg) {
                heroFigureImg.src = 'https://via.placeholder.com/380x480?text=GS+Fashion';
            }
        }
    }

    // 4. Render Products
    const productGrid = document.getElementById('product-grid');
    const tabs = document.querySelectorAll('.tab-btn');

    // Default configuration for categories
    const CATEGORY_CONFIG = {
        kurtis: { sizes: "S, M, L, XL, XXL", desc: "Elegant ethnic wear designed for comfort and style. Premium fabric quality." },
        tops: { sizes: "XS, S, M, L", desc: "Trendy western tops perfect for casual outings and office wear." },
        pants: { sizes: "28, 30, 32, 34", desc: "Comfortable and stylish bottom wear to match your outfit." },
        dupatta: { sizes: "Free Size", desc: "Beautifully crafted dupattas to complete your traditional look." }
    };

    function getPrettyName(product) {
        const PRETTY_LABELS = {kurtis:'Kurti', tops:'Top', pants:'Pant', dupatta:'Dupatta Pair'};
        if (product.displayName) return product.displayName;
        const catLabel = PRETTY_LABELS[product.category] || 'Product';
        if (/^(kurtis|tops|pants|dupatta)[0-9]+$/i.test(product.name || '')) {
            return `${catLabel} Design`;
        }
        if (!product.name) return catLabel;
        return product.name;
    }

    function renderProducts(categoryFilter = 'all') {
        productGrid.innerHTML = '';
        
        // Use PRODUCTS from the new scanner script
        if (typeof PRODUCTS === 'undefined') {
            // Fallback to old CATALOG if PRODUCTS is missing (backward compatibility)
            if (typeof CATALOG !== 'undefined') {
                 window.PRODUCTS = CATALOG;
            } else {
                productGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;"><h2>Welcome Admin!</h2><p>No products found yet.</p><p>1. Add images to the <b>images</b> folder.</p><p>2. Double-click <b>Admin_Panel.bat</b> to update.</p></div>';
                return;
            }
        }

        let productsToShow = [];
        
        if (categoryFilter === 'all') {
            Object.keys(PRODUCTS).forEach(cat => {
                productsToShow = [...productsToShow, ...PRODUCTS[cat]];
            });
        } else if (PRODUCTS[categoryFilter]) {
            productsToShow = PRODUCTS[categoryFilter];
        }

        if (productsToShow.length === 0) {
             productGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;"><p>No products in this category yet.</p></div>';
            return;
        }

        productsToShow.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Determine details
            const config = CATEGORY_CONFIG[product.category] || { sizes: "Standard", desc: "Quality Fashion Product" };
            const displayDesc = product.desc || config.desc;
            
            const prettyName = getPrettyName(product);

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="images/${product.image}" alt="${prettyName}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=Image+Not+Found'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${prettyName}</h3>
                    <p class="product-category">${product.category}</p>
                    <button class="btn-primary" style="padding: 5px 15px; font-size: 0.9rem;">View Details</button>
                </div>
            `;

            // Click event for Modal
            card.addEventListener('click', () => {
                openModal(product, config);
            });

            productGrid.appendChild(card);
        });
    }

    // Initial Render
    renderProducts();

    // Filter Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProducts(tab.dataset.category);
        });
    });

    // 5. Modal Logic
    const modal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalSizes = document.getElementById('modal-sizes');
    const modalDesc = document.getElementById('modal-desc');
    const modalWaBtn = document.getElementById('modal-wa-btn');

    function openModal(product, config) {
        modalImg.src = `images/${product.image}`;
        // Handle fallback for modal image too
        modalImg.onerror = function() { this.src = 'https://via.placeholder.com/300x400?text=Image+Not+Found'; };
        
        modalTitle.textContent = getPrettyName(product);
        modalCategory.textContent = product.category;
        modalSizes.textContent = product.sizes || config.sizes;
        modalDesc.textContent = product.desc || config.desc;
        
        // WhatsApp Link construction
        const message = `Hi, I am interested in ${getPrettyName(product)} (${product.category}). Is this available?`;
        modalWaBtn.href = `https://wa.me/918140224241?text=${encodeURIComponent(message)}`;
        
        modal.style.display = 'flex';
        // Small delay for transition
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModelFunc() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    closeModal.addEventListener('click', closeModelFunc);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModelFunc();
        }
    });

    // 6. Reveal-on-scroll animations
    const revealTargets = document.querySelectorAll('header.hero, section.section, .footer');
    revealTargets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // optional: unobserve once revealed
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => io.observe(el));
});
