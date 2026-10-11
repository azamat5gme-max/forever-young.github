(() => {
  'use strict';
  const photoButtons = Array.from(document.querySelectorAll('[data-photo]'));
  const dialog = document.getElementById('photo-dialog');
  const largePhoto = document.getElementById('large-photo');
  const caption = document.getElementById('photo-caption');
  const number = document.getElementById('photo-number');
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + photoButtons.length) % photoButtons.length;
    const button = photoButtons[currentPhoto];
    const original = button.querySelector('img');
    largePhoto.src = original.src;
    largePhoto.alt = original.alt;
    caption.textContent = button.closest('figure').querySelector('figcaption span').textContent + ' — пример фото';
    number.textContent = `${currentPhoto + 1} / ${photoButtons.length}`;
  }
  function closePhoto() { dialog.close(); }
  photoButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') { window.open(button.querySelector('img').src, '_blank', 'noopener'); return; }
      showPhoto(index);
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  document.getElementById('photo-close').addEventListener('click', closePhoto);
  document.getElementById('photo-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.getElementById('photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePhoto();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  document.querySelectorAll('.photo-open img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = '0';
      const tag = img.parentElement.querySelector('.photo-tag');
      tag.textContent = 'НАШЕ ФОТО СКОРО ПОЯВИТСЯ';
      img.parentElement.disabled = true;
    });
  });
  const status = document.getElementById('share-status');
  const fallback = document.getElementById('share-fallback');
  const shareUrl = document.getElementById('share-url');
  let statusTimer;
  function notify(message) {
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add('is-visible');
    statusTimer = setTimeout(() => status.classList.remove('is-visible'), 3500);
  }
  document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', async () => {
    const url = window.location.href.split('#')[0].split('?')[0];
    const data = {title: 'Forever Young — Наша компания', text: '26 друзей. Одна незабываемая компания. Знакомьтесь: Forever Young.', url};
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      notify('Ссылка скопирована. Отправь её друзьям!');
    } catch {
      shareUrl.value = url;
      fallback.hidden = false;
      shareUrl.focus();
      shareUrl.select();
    }
  }));
  document.getElementById('share-dismiss').addEventListener('click', () => { fallback.hidden = true; document.querySelector('[data-share]').focus(); });
})();
