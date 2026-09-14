/**
 * RAZZ MOBILES - Application Logic
 * Interactive Search, Filters, Modals, Booking & WhatsApp Integration
 * High-Resolution Local Photography Integration
 * Kanchipuram, Tamil Nadu
 */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentBrand = 'all';
  let currentCondition = 'all';
  let currentSort = 'featured';
  let currentSearchQuery = '';
  let currentAccessoryCategory = 'all';
  let uploadedFile = null;
  let selectedRating = 5;

  // Cache DOM Elements
  const phonesGrid = document.getElementById('phones-grid');
  const accessoriesGrid = document.getElementById('accessories-grid');
  const servicesGrid = document.getElementById('services-grid');
  const reviewsGrid = document.getElementById('reviews-grid');

  const searchInput = document.getElementById('phone-search');
  const brandPills = document.querySelectorAll('.brand-pill');
  const conditionSelect = document.getElementById('condition-filter');
  const sortSelect = document.getElementById('sort-filter');
  const accessoryPills = document.querySelectorAll('.acc-pill');

  const bookingForm = document.getElementById('service-booking-form');
  const serviceSelect = document.getElementById('booking-service');
  const bookingDateInput = document.getElementById('booking-date');
  const phoneInput = document.getElementById('booking-phone');
  const fileInput = document.getElementById('device-photo-input');
  const uploadWrapper = document.getElementById('image-upload-area');
  const previewStrip = document.getElementById('file-preview-strip');
  const previewFileName = document.getElementById('preview-file-name');
  const fileRemoveBtn = document.getElementById('file-remove-btn');

  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link');

  // Modals
  const specModal = document.getElementById('spec-modal');
  const reviewModal = document.getElementById('review-modal');
  const successModal = document.getElementById('success-modal');

  // Setup Date Minimum (today)
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  // =========================================================================
  // 1. Render Smartphones Catalog with Real Product Photos
  // =========================================================================
  function renderPhones() {
    if (!phonesGrid) return;

    let list = [...RAZZ_DATA.smartphones];

    // Filter by Brand
    if (currentBrand !== 'all') {
      list = list.filter(item => item.brand.toLowerCase() === currentBrand.toLowerCase());
    }

    // Filter by Condition
    if (currentCondition !== 'all') {
      list = list.filter(item => item.condition.toLowerCase() === currentCondition.toLowerCase());
    }

    // Filter by Search Query
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.processor.toLowerCase().includes(q) ||
        item.storage.toLowerCase().includes(q)
      );
    }

    // Sort
    if (currentSort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    // Empty state
    if (list.length === 0) {
      phonesGrid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3>No Smartphones Found</h3>
          <p>We couldn't find any phone matching "${currentSearchQuery}". Try clearing filters or search for another brand like Apple, Samsung, or OnePlus.</p>
          <button class="btn btn-secondary" onclick="resetPhoneFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    phonesGrid.innerHTML = list.map(phone => {
      const formattedPrice = Number(phone.price).toLocaleString('en-IN');
      const formattedOriginalPrice = Number(phone.originalPrice).toLocaleString('en-IN');
      const discountPercent = Math.round(((phone.originalPrice - phone.price) / phone.originalPrice) * 100);
      const isUsed = phone.condition.toLowerCase().includes('used');

      const waText = encodeURIComponent(
        `Hello RAZZ Mobiles, I'm interested in buying ${phone.name} (${phone.ram} / ${phone.storage}) priced at ₹${formattedPrice}. Is this model currently available at your Kanchipuram store?`
      );
      const waUrl = `https://wa.me/${RAZZ_DATA.storeInfo.whatsapp}?text=${waText}`;

      return `
        <article class="product-card" data-id="${phone.id}">
          <div class="product-badges-top">
            <span class="badge-tag badge-highlight">${phone.badge}</span>
            <span class="badge-tag badge-condition ${isUsed ? 'used' : 'brand-new'}">
              ${phone.condition}
            </span>
          </div>

          <div class="device-photo-card-wrap">
            <img src="${phone.image}" alt="${phone.name} smartphone at RAZZ MOBILES Kanchipuram" loading="lazy" onerror="this.src='assets/images/hero_phones.jpg'">
            <div class="device-photo-overlay-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              </svg>
              <span>${phone.brand} Official</span>
            </div>
          </div>

          <div class="product-info-body">
            <span class="product-brand-name">${phone.brand}</span>
            <h3 class="product-title">${phone.name}</h3>

            <div class="product-specs-list">
              <div class="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
                <span>${phone.ram} RAM</span>
              </div>
              <div class="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <span>${phone.storage}</span>
              </div>
              <div class="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span title="${phone.camera}">${phone.camera.split('+')[0]}</span>
              </div>
              <div class="spec-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="6" width="18" height="12" rx="2"></rect>
                  <line x1="23" y1="11" x2="23" y2="13"></line>
                </svg>
                <span>${phone.battery.split('(')[0]}</span>
              </div>
            </div>

            <div class="product-pricing-row">
              <span class="price-current">₹${formattedPrice}</span>
              <span class="price-original">₹${formattedOriginalPrice}</span>
              <span class="discount-badge">${discountPercent}% OFF</span>
            </div>

            <div class="product-actions-group">
              <button class="btn btn-secondary btn-sm" onclick="openPhoneModal('${phone.id}')">
                View Details
              </button>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Enquire
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // =========================================================================
  // 2. Render Accessories Catalog with Real Product Photos
  // =========================================================================
  function renderAccessories() {
    if (!accessoriesGrid) return;

    let list = [...RAZZ_DATA.accessories];

    if (currentAccessoryCategory !== 'all') {
      list = list.filter(item => item.category === currentAccessoryCategory);
    }

    accessoriesGrid.innerHTML = list.map(item => {
      const formattedPrice = Number(item.price).toLocaleString('en-IN');
      const formattedOriginal = Number(item.originalPrice).toLocaleString('en-IN');

      const waText = encodeURIComponent(
        `Hello RAZZ Mobiles Kanchipuram, I would like to buy the accessory: ${item.name} (Price: ₹${formattedPrice}). Do you have stock available?`
      );
      const waUrl = `https://wa.me/${RAZZ_DATA.storeInfo.whatsapp}?text=${waText}`;

      return `
        <div class="accessory-card">
          <div class="acc-photo-wrap">
            <img src="${item.image}" alt="${item.name} accessory at RAZZ MOBILES" loading="lazy" onerror="this.src='assets/images/acc_case.jpg'">
          </div>

          <div class="acc-header">
            <span class="acc-brand-badge">${item.brand}</span>
            <span class="acc-badge-floating">${item.badge}</span>
          </div>

          <h3 class="acc-title">${item.name}</h3>
          <p class="acc-desc">${item.description}</p>
          <div class="acc-warranty-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            ${item.warranty}
          </div>

          <div class="acc-footer">
            <div class="product-pricing-row" style="margin: 0;">
              <span class="price-current">₹${formattedPrice}</span>
              <span class="price-original">₹${formattedOriginal}</span>
            </div>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Enquire
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 3. Render Service & Repair Offerings with Process Photos
  // =========================================================================
  function renderServices() {
    if (!servicesGrid) return;

    servicesGrid.innerHTML = RAZZ_DATA.services.map(srv => {
      const formattedPrice = Number(srv.startingPrice).toLocaleString('en-IN');
      return `
        <div class="service-card" id="service-card-${srv.id}">
          ${srv.popular ? '<span class="service-popular-badge">Popular Choice</span>' : ''}

          <div class="service-photo-wrap">
            <img src="${srv.image}" alt="${srv.name} in Kanchipuram" loading="lazy" onerror="this.src='assets/images/repair_lab.jpg'">
          </div>

          <div class="service-header-row">
            <div class="service-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${getServiceIconSvg(srv.icon)}
              </svg>
            </div>
            <h3 class="service-title">${srv.name}</h3>
          </div>

          <div class="service-meta-row">
            <span class="service-time-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${srv.time}
            </span>
            <span class="service-warranty-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              ${srv.warranty}
            </span>
          </div>

          <p class="service-desc">${srv.description}</p>

          <div class="service-symptoms-box">
            <span class="symptoms-label">Common Symptoms</span>
            <ul class="symptoms-list">
              ${srv.symptoms.slice(0, 3).map(sym => `<li>${sym}</li>`).join('')}
            </ul>
          </div>

          <div class="service-footer">
            <div class="service-price-block">
              <span class="service-price-label">Starts From</span>
              <span class="service-price-val">₹${formattedPrice}</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="selectServiceForBooking('${srv.name}')">
              Book Service
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function getServiceIconSvg(iconName) {
    switch (iconName) {
      case 'smartphone':
        return '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>';
      case 'battery-charging':
        return '<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5z"></path><line x1="21" y1="10" x2="21" y2="14"></line><polygon points="10 5 6 12 11 12 8 19 14 11 10 11"></polygon>';
      case 'zap':
        return '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>';
      case 'volume-2':
        return '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      case 'camera':
        return '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>';
      case 'droplet':
        return '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>';
      case 'cpu':
        return '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>';
      case 'hard-drive':
        return '<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line>';
      default:
        return '<circle cx="12" cy="12" r="10"></circle>';
    }
  }

  // =========================================================================
  // 4. Render Customer Reviews
  // =========================================================================
  function renderReviews() {
    if (!reviewsGrid) return;

    let allReviews = [...RAZZ_DATA.reviews];
    try {
      const stored = localStorage.getItem('razz_user_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          allReviews = [...parsed, ...allReviews];
        }
      }
    } catch (e) {
      console.warn('Could not read user reviews from storage');
    }

    reviewsGrid.innerHTML = allReviews.map(rev => {
      const initials = rev.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const starsHtml = Array.from({ length: 5 }).map((_, i) => {
        return `
          <svg viewBox="0 0 24 24" fill="${i < rev.rating ? '#7C3AED' : '#DDD6FE'}">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        `;
      }).join('');

      return `
        <div class="review-card">
          <div class="review-top-row">
            <div class="star-rating">${starsHtml}</div>
            <span class="review-date">${rev.date}</span>
          </div>

          <p class="review-text">"${rev.comment}"</p>

          <div class="reviewer-meta">
            <div class="reviewer-avatar">${initials}</div>
            <div class="reviewer-info">
              <strong>${rev.name}</strong>
              <span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${rev.location} • ${rev.service || 'Verified Customer'}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 5. Booking Form Handlers
  // =========================================================================
  window.selectServiceForBooking = function(serviceName) {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase().split(' ')[0])) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }

    showToast(`Selected "${serviceName}". Please fill device details.`);
  };

  // Indian Phone Validation
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      const isValid = /^[6-9]\d{9}$/.test(e.target.value);
      if (e.target.value.length === 10 && !isValid) {
        phoneInput.classList.add('is-invalid');
      } else {
        phoneInput.classList.remove('is-invalid');
      }
    });
  }

  // Device Image Drag & Drop Preview
  if (uploadWrapper && fileInput) {
    uploadWrapper.addEventListener('click', () => fileInput.click());

    uploadWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadWrapper.style.borderColor = 'var(--primary)';
      uploadWrapper.style.background = 'var(--bg-surface-elevated)';
    });

    uploadWrapper.addEventListener('dragleave', () => {
      uploadWrapper.style.borderColor = '';
      uploadWrapper.style.background = '';
    });

    uploadWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadWrapper.style.borderColor = '';
      uploadWrapper.style.background = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    uploadedFile = file;
    if (previewStrip && previewFileName) {
      previewFileName.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
      previewStrip.classList.add('active');
    }
  }

  if (fileRemoveBtn) {
    fileRemoveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedFile = null;
      if (fileInput) fileInput.value = '';
      if (previewStrip) previewStrip.classList.remove('active');
    });
  }

  // Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('booking-name').value.trim();
      const phone = phoneInput.value.trim();
      const brand = document.getElementById('booking-brand').value;
      const model = document.getElementById('booking-model').value.trim();
      const service = serviceSelect.value;
      const issue = document.getElementById('booking-issue').value.trim();
      const date = bookingDateInput.value;
      const timeSlot = document.getElementById('booking-time').value;

      if (!/^[6-9]\d{9}$/.test(phone)) {
        phoneInput.classList.add('is-invalid');
        phoneInput.focus();
        showToast('Please enter a valid 10-digit Indian mobile number.');
        return;
      }

      const refCode = 'RAZZ-' + Math.floor(1000 + Math.random() * 9000);

      document.getElementById('conf-ref-code').textContent = refCode;
      document.getElementById('conf-customer').textContent = `${name} (${phone})`;
      document.getElementById('conf-device').textContent = `${brand} ${model}`;
      document.getElementById('conf-service').textContent = service;
      document.getElementById('conf-datetime').textContent = `${date} at ${timeSlot}`;

      const waSummary = encodeURIComponent(
        `Hello RAZZ MOBILES Kanchipuram,\n\nI have booked a service appointment:\n` +
        `• Booking ID: ${refCode}\n` +
        `• Customer Name: ${name}\n` +
        `• Mobile: ${phone}\n` +
        `• Device: ${brand} ${model}\n` +
        `• Service Requested: ${service}\n` +
        `• Problem Note: ${issue || 'Routine service'}\n` +
        `• Appointment: ${date} (${timeSlot})\n\n` +
        `Please confirm my slot. Thank you!`
      );
      document.getElementById('conf-whatsapp-btn').href = `https://wa.me/${RAZZ_DATA.storeInfo.whatsapp}?text=${waSummary}`;

      bookingForm.reset();
      if (previewStrip) previewStrip.classList.remove('active');
      uploadedFile = null;

      openModal(successModal);
    });
  }

  // =========================================================================
  // 6. Modal Functions (Specifications, Reviews, Success)
  // =========================================================================
  window.openPhoneModal = function(phoneId) {
    const phone = RAZZ_DATA.smartphones.find(p => p.id === phoneId);
    if (!phone) return;

    const formattedPrice = Number(phone.price).toLocaleString('en-IN');
    const formattedOriginalPrice = Number(phone.originalPrice).toLocaleString('en-IN');
    const discountPercent = Math.round(((phone.originalPrice - phone.price) / phone.originalPrice) * 100);

    const waText = encodeURIComponent(
      `Hello RAZZ Mobiles, I'm interested in ${phone.name} (RAM: ${phone.ram}, Storage: ${phone.storage}) priced at ₹${formattedPrice}. Could you share in-store availability and EMI/Exchange offers?`
    );
    const waUrl = `https://wa.me/${RAZZ_DATA.storeInfo.whatsapp}?text=${waText}`;

    document.getElementById('modal-phone-title').textContent = phone.name;
    document.getElementById('modal-phone-subtitle').textContent = `${phone.brand} • ${phone.condition} • ${phone.badge}`;
    document.getElementById('modal-phone-price').textContent = `₹${formattedPrice}`;
    document.getElementById('modal-phone-original').textContent = `₹${formattedOriginalPrice}`;
    document.getElementById('modal-phone-discount').textContent = `${discountPercent}% OFF`;

    document.getElementById('modal-specs-body').innerHTML = `
      <div class="modal-phone-img-box">
        <img src="${phone.image}" alt="${phone.name}" onerror="this.src='assets/images/hero_phones.jpg'">
      </div>

      <table class="specs-table">
        <tbody>
          <tr>
            <td>Processor</td>
            <td><strong>${phone.processor}</strong></td>
          </tr>
          <tr>
            <td>Display</td>
            <td>${phone.display}</td>
          </tr>
          <tr>
            <td>RAM & Storage</td>
            <td>${phone.ram} RAM | ${phone.storage} Internal Storage</td>
          </tr>
          <tr>
            <td>Camera System</td>
            <td>${phone.camera}</td>
          </tr>
          <tr>
            <td>Battery & Power</td>
            <td>${phone.battery}</td>
          </tr>
          <tr>
            <td>Color Options</td>
            <td>${phone.color}</td>
          </tr>
          <tr>
            <td>Warranty</td>
            <td><strong>${phone.warranty}</strong></td>
          </tr>
          <tr>
            <td>Exchange Offer</td>
            <td>Get up to ₹15,000 instant exchange value for your old smartphone at our Kanchipuram store.</td>
          </tr>
        </tbody>
      </table>
    `;

    document.getElementById('modal-whatsapp-cta').href = waUrl;
    openModal(specModal);
  };

  window.openReviewModal = function() {
    openModal(reviewModal);
  };

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeMobileDrawer();
    }
  });

  // Star Rating Selector in Review Modal
  const starIcons = document.querySelectorAll('.star-pick');
  starIcons.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val, 10);
      starIcons.forEach(s => {
        s.classList.toggle('hovered', parseInt(s.dataset.val, 10) <= val);
      });
    });

    star.addEventListener('mouseleave', () => {
      starIcons.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val, 10);
      starIcons.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.val, 10) <= selectedRating);
      });
    });
  });

  // Review Form Submission
  const reviewForm = document.getElementById('write-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rev-author-name').value.trim();
      const loc = document.getElementById('rev-author-loc').value.trim() || 'Kanchipuram';
      const comment = document.getElementById('rev-author-comment').value.trim();
      const service = document.getElementById('rev-author-service').value;

      if (!name || !comment) {
        showToast('Please fill in your name and review message.');
        return;
      }

      const newReview = {
        id: 'rev-user-' + Date.now(),
        name: name,
        location: loc,
        rating: selectedRating,
        date: 'Just now',
        comment: comment,
        verified: true,
        service: service
      };

      try {
        const stored = JSON.parse(localStorage.getItem('razz_user_reviews') || '[]');
        stored.unshift(newReview);
        localStorage.setItem('razz_user_reviews', JSON.stringify(stored));
      } catch (err) {
        console.warn('Storage error', err);
      }

      closeAllModals();
      reviewForm.reset();
      renderReviews();
      showToast('Thank you! Your review has been posted successfully.');
    });
  }

  // =========================================================================
  // 7. Search and Filter Event Listeners
  // =========================================================================
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderPhones();
    });
  }

  brandPills.forEach(pill => {
    pill.addEventListener('click', () => {
      brandPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentBrand = pill.dataset.brand;
      renderPhones();
    });
  });

  if (conditionSelect) {
    conditionSelect.addEventListener('change', (e) => {
      currentCondition = e.target.value;
      renderPhones();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderPhones();
    });
  }

  window.resetPhoneFilters = function() {
    currentBrand = 'all';
    currentCondition = 'all';
    currentSort = 'featured';
    currentSearchQuery = '';
    if (searchInput) searchInput.value = '';
    if (conditionSelect) conditionSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'featured';
    brandPills.forEach(p => {
      p.classList.toggle('active', p.dataset.brand === 'all');
    });
    renderPhones();
  };

  accessoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      accessoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentAccessoryCategory = pill.dataset.category;
      renderAccessories();
    });
  });

  // =========================================================================
  // 8. Mobile Navigation Drawer
  // =========================================================================
  function openMobileDrawer() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.add('active');
      mobileDrawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.remove('active');
      mobileDrawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Sticky Header & Active Nav on Scroll
  const headerWrapper = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (headerWrapper) {
      headerWrapper.classList.toggle('scrolled', window.scrollY > 20);
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Toast Helper Function
  window.showToast = function(msg) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast-alert';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${msg}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  };

  // Initial Data Renders
  renderPhones();
  renderAccessories();
  renderServices();
  renderReviews();
});
