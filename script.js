(() => {
  'use strict';
  const WHATSAPP_NUMBER = '201069727678';
  const waUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const message = link.getAttribute('data-whatsapp') || '';
    link.href = waUrl(message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
      menuButton.textContent = isOpen ? '×' : '☰';
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'فتح القائمة');
      menuButton.textContent = '☰';
    }));
  }

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;
      const data = new FormData(bookingForm);
      const message = [
        'السلام عليكم، أريد طلب صيانة.',
        `الاسم: ${data.get('name')}`,
        `رقم الموبايل: ${data.get('phone')}`,
        `نوع الجهاز: ${data.get('device')}`,
        `المنطقة / العنوان: ${data.get('area')}`,
      ].join('\n');
      window.open(waUrl(message), '_blank', 'noopener,noreferrer');
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const message = [
        'السلام عليكم، أود التواصل مع أمريكان جروب.',
        `الاسم: ${data.get('name')}`,
        `رقم الموبايل: ${data.get('phone')}`,
        `موضوع الرسالة: ${data.get('subject')}`,
        `تفاصيل الرسالة: ${data.get('message')}`,
      ].join('\n');
      window.open(waUrl(message), '_blank', 'noopener,noreferrer');
    });
  }

  const mobileNav = document.createElement('nav');
  mobileNav.className = 'app-bottom-nav';
  mobileNav.setAttribute('aria-label', 'التنقل السريع');
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const navItems = [
    { href: './index.html', page: 'index.html', label: 'الرئيسية', icon: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>' },
    { href: './services.html', page: 'services.html', label: 'خدماتنا', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
    { href: './index.html#booking-form', page: 'booking', label: 'احجز صيانة', icon: '<path d="M8 3v4m8-4v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1z"/><path d="M12 12v5m-2.5-2.5h5"/>' },
    { href: './contact.html', page: 'contact.html', label: 'اتصل بنا', icon: '<path d="M21 15.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 2.8 2 2 0 0 1 3.1.6h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7 7.8a16 16 0 0 0 6 6l.6-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.8z"/>' },
  ];
  navItems.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    const isActive = item.page === 'booking'
      ? currentFile === 'index.html' && location.hash === '#booking-form'
      : currentFile === item.page && !(item.page === 'index.html' && location.hash === '#booking-form');
    link.className = isActive ? 'active' : '';
    link.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${item.icon}</svg><span>${item.label}</span>`;
    if (isActive) link.setAttribute('aria-current', 'page');
    mobileNav.appendChild(link);
  });
  document.body.appendChild(mobileNav);

  const installBanner = document.createElement('aside');
  installBanner.className = 'install-banner';
  installBanner.setAttribute('aria-live', 'polite');
  installBanner.setAttribute('aria-label', 'تثبيت التطبيق');
  installBanner.innerHTML = '<span class="install-banner-icon" aria-hidden="true">↓</span><div class="install-banner-copy"><b>ثبّت تطبيق أمريكان جروب على موبايلك</b><small>لسهولة حجز الصيانة</small></div><button type="button" class="install-action">تثبيت</button><button type="button" class="install-dismiss" aria-label="إغلاق">×</button>';
  document.body.appendChild(installBanner);
  const installButton = installBanner.querySelector('.install-action');
  let installPrompt = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const dismissed = sessionStorage.getItem('pwa-install-dismissed') === '1';
  const showInstall = () => { if (!isStandalone && !dismissed) installBanner.classList.add('visible'); };

  if (isIOS && !isStandalone && !dismissed) {
    installBanner.querySelector('.install-banner-copy b').textContent = 'ثبّت تطبيق أمريكان جروب على موبايلك';
    installBanner.querySelector('.install-banner-copy small').textContent = 'اضغطي مشاركة ثم إضافة إلى الشاشة الرئيسية';
    installButton.textContent = 'التعليمات';
    installButton.addEventListener('click', () => {
      installBanner.querySelector('.install-banner-copy small').textContent = 'في Safari: اضغطي مشاركة ⬆ ثم «إضافة إلى الشاشة الرئيسية».';
    });
    window.setTimeout(showInstall, 1600);
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    if (!isIOS) window.setTimeout(showInstall, 1200);
  });
  installButton.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBanner.classList.remove('visible');
  });
  installBanner.querySelector('.install-dismiss').addEventListener('click', () => {
    installBanner.classList.remove('visible');
    sessionStorage.setItem('pwa-install-dismissed', '1');
  });
  window.addEventListener('appinstalled', () => installBanner.classList.remove('visible'));

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './' }).catch((error) => {
        console.warn('تعذر تسجيل Service Worker:', error);
      });
    });
  }
})();
