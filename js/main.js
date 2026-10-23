/* ==========================================================
   ONEROMAN — логика сайта

   Данные (работы, тексты, ссылки) лежат в js/site-data.js,
   поэтому здесь ничего менять не нужно.

   Содержание:
    1. Вспомогательные функции
    2. Анимации появления
    3. Меню
    4. Первый экран и прокрутка
    5. Видео-блок «Обо мне»
    6. Каталог работ и услуги
    7. Страница работы
    8. Галерея-мозаика
    9. Просмотр фото (lightbox)
   10. Форма заявки
   ========================================================== */


/* ---------- 1. Вспомогательные функции ---------- */

const $  = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = matchMedia("(min-width: 821px)");

// Если фото не загрузилось, показываем тёмную заглушку вместо значка ошибки
function hideBrokenImage(event) {
  event.target.onerror = null;
  event.target.removeAttribute("src");
  event.target.style.background = "#111";
}


/* ---------- 2. Анимации появления ---------- */

// Разбивает заголовок на слова и буквы, чтобы буквы появлялись по очереди
function splitIntoLetters(element) {
  const text = element.textContent;
  let letterIndex = 0;

  element.setAttribute("aria-label", text);   // для скринридеров читаем целую фразу
  element.innerHTML = "";

  text.split(" ").forEach((wordText) => {
    const word = document.createElement("span");
    word.className = "split-word";
    word.setAttribute("aria-hidden", "true");

    [...wordText].forEach((character) => {
      const letter = document.createElement("span");
      letter.className = "split-letter";
      letter.style.setProperty("--letter-index", letterIndex++);
      letter.textContent = character;
      word.appendChild(letter);
    });

    element.appendChild(word);
    element.appendChild(document.createTextNode(" "));
  });
}

// Следит за элементами и добавляет им класс is-visible, когда они попадают в экран.
// Параметр root нужен для страницы работы: она прокручивается внутри себя.
function createRevealObserver(root = null) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { root, threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
}

const pageRevealObserver = createRevealObserver();

function watchRevealElements() {
  $$(".reveal:not(.is-visible), [data-split-text]:not(.is-visible)")
    .forEach((element) => pageRevealObserver.observe(element));
}

$$("[data-split-text]").forEach(splitIntoLetters);


/* ---------- 3. Меню ---------- */

const menuToggle = $("#menu-toggle");

function setMenuOpen(isOpen) {
  document.body.classList.toggle("menu-is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!document.body.classList.contains("menu-is-open"));
});

// После выбора пункта меню закрываем
$$(".fullscreen-menu__link").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});


/* ---------- 4. Первый экран и прокрутка ---------- */

const siteHeader  = $("#site-header");
const heroContent = $("#hero-content");
const heroPhoto   = $("#hero-photo");

const heroSourceMobile = document.getElementById("hero-source-mobile");
if (heroSourceMobile && siteSettings.heroPhotoMobile) {
  heroSourceMobile.srcset = siteSettings.heroPhotoMobile;
}

heroPhoto.src = siteSettings.heroPhoto;
heroPhoto.onerror = hideBrokenImage;

// Всё, что зависит от прокрутки страницы
function handleScroll() {
  // Шапка получает тёмную подложку, когда страница сдвинулась
  siteHeader.classList.toggle("is-solid", window.scrollY > 40);

  // Логотип на первом экране плавно уходит вверх и растворяется
  if (!prefersReducedMotion) {
    const fade = clamp(window.scrollY / (window.innerHeight * 0.7), 0, 1);
    heroContent.style.opacity = 1 - fade;
    heroContent.style.transform = `translateY(${-fade * 50}px)`;
  }

  updateAboutTextReveal();
}

let isScrollFrameQueued = false;
window.addEventListener("scroll", () => {
  if (isScrollFrameQueued) return;
  isScrollFrameQueued = true;
  requestAnimationFrame(() => {
    handleScroll();
    isScrollFrameQueued = false;
  });
}, { passive: true });
window.addEventListener("resize", handleScroll);


/* ---------- 5. Видео-блок «Обо мне» ---------- */

const aboutSection = $("#about");
const aboutVideo   = $("#about-video");
const aboutText    = $("#about-text");

// Текст делим на слова: каждое слово проявляется отдельно
aboutText.innerHTML = siteSettings.aboutText
  .split(" ")
  .map((word) => `<span class="about-video__word">${word}</span>`)
  .join(" ");
const aboutWords = [...aboutText.children];

// Чем ниже прокрутили, тем больше слов становятся чёткими.
// На компьютере проявление идёт быстрее, чем на телефоне.
function updateAboutTextReveal() {
  if (aboutSection.hidden) return;

  const textTop = aboutText.getBoundingClientRect().top;
  const revealDistance = window.innerHeight * (isDesktop.matches ? 0.28 : 0.42);
  const progress = clamp((window.innerHeight * 0.95 - textTop) / revealDistance, 0, 1);
  const wordsRevealed = progress * aboutWords.length;

  aboutWords.forEach((word, index) => {
    const visibility = clamp(wordsRevealed - index, 0, 1);
    word.style.opacity = 0.18 + 0.82 * visibility;
    word.style.filter = `blur(${3 * (1 - visibility)}px)`;
  });
}

// Видео подключается, только если оно указано в настройках.
// Грузится, когда блок приближается к экрану, и ставится на паузу, когда уходит.
function setupAboutVideo() {
  const videoUrl = siteSettings.aboutVideo;

  if (!videoUrl) {
    $("#menu-about-link").remove();   // нет видео: убираем и пункт меню
    return;
  }

  aboutSection.hidden = false;
  if (siteSettings.aboutVideoPoster) aboutVideo.poster = siteSettings.aboutVideoPoster;

  // Если файл не найден или не воспроизводится, просто прячем блок
  aboutVideo.addEventListener("error", () => { aboutSection.hidden = true; });

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!aboutVideo.getAttribute("src")) aboutVideo.src = videoUrl;
        if (!prefersReducedMotion) aboutVideo.play().catch(() => {});
      } else {
        aboutVideo.pause();
      }
    });
  }, { rootMargin: "500px 0px" });

  videoObserver.observe(aboutSection);
}

setupAboutVideo();


/* ---------- 6. Каталог работ и услуги ---------- */

function renderWorkCards() {
  const grid = $("#works-grid");
  $("#works-count").textContent = String(works.length).padStart(2, "0") + " проектов";

  works.forEach((work, index) => {
    const card = document.createElement("a");
    card.className = "work-card reveal";
    card.href = "#/work/" + work.slug;
    card.style.setProperty("--delay", (index % 2) * 120 + "ms");   // правая колонка чуть позже левой
    card.setAttribute("aria-label", "Открыть работу " + work.title);

    card.innerHTML = `
      <div class="work-card__image">
        <img src="${work.cover}" alt="${work.title}" loading="lazy">
        <span class="work-card__number">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="work-card__info">
        <h3 class="work-card__title">${work.title}</h3>
        <span class="caption">${work.category}</span>
      </div>`;

    card.querySelector("img").onerror = hideBrokenImage;
    grid.appendChild(card);
  });
}

function renderServices() {
  $("#services-list").innerHTML = services.map((service, index) => `
    <div class="service reveal">
      <span class="caption">0${index + 1}</span>
      <h3 class="service__title">${service.title}</h3>
      <p class="service__text">${service.text}</p>
    </div>`).join("");
}

renderWorkCards();
renderServices();
watchRevealElements();
handleScroll();


/* ---------- 7. Страница работы ----------
   Адрес вида  #/work/название  открывает работу поверх сайта.
   Благодаря этому работает кнопка «Назад» и можно делиться ссылкой. */

const projectPage = $("#project-page");
let currentWorkIndex = -1;
let galleryResizeObserver = null;

function openWorkFromAddress() {
  const match = location.hash.match(/^#\/work\/(.+)$/);
  const workIndex = match
    ? works.findIndex((work) => work.slug === decodeURIComponent(match[1]))
    : -1;

  // В адресе нет работы: закрываем страницу работы
  if (workIndex < 0) {
    closeProjectPage();
    return;
  }

  const work = works[workIndex];
  const nextWork = works[(workIndex + 1) % works.length];
  currentWorkIndex = workIndex;

  projectPage.innerHTML = `
    <div class="project-page__bar">
      <a href="#works" class="caption">← Все работы</a>
      <span class="caption">${String(workIndex + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}</span>
    </div>

    <div class="project-info">
      <h1 class="project-info__title" data-split-text>${work.title}</h1>
      <div class="project-meta">
        <div><span class="caption">Категория</span><b>${work.category}</b></div>
        <div><span class="caption">Год</span><b>${work.year}</b></div>
        <div><span class="caption">Кадров</span><b>${work.photos.length}</b></div>
      </div>
      <p class="project-info__description">${work.description || ""}</p>
    </div>

    <div class="photo-gallery-wrap"><div class="photo-gallery" id="photo-gallery"></div></div>

    <div class="project-nav">
      <a href="#works">← Назад</a>
      <a href="#/work/${nextWork.slug}">${nextWork.title} →</a>
    </div>`;

  const title = projectPage.querySelector("[data-split-text]");
  splitIntoLetters(title);

  buildGallery($("#photo-gallery"), work);

  // Появление элементов работает внутри прокручиваемой страницы работы
  const revealObserver = createRevealObserver(projectPage);
  projectPage.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  setTimeout(() => title.classList.add("is-visible"), 150);

  projectPage.scrollTop = 0;
  document.body.classList.add("is-locked");
  projectPage.classList.add("is-open");
  document.title = work.title + " — ONEROMAN";
}

function closeProjectPage() {
  if (!projectPage.classList.contains("is-open")) return;

  projectPage.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  document.title = "ONEROMAN — автофотограф";
  currentWorkIndex = -1;

  if (galleryResizeObserver) galleryResizeObserver.disconnect();
}

window.addEventListener("hashchange", openWorkFromAddress);
openWorkFromAddress();   // если сайт открыли сразу по ссылке на работу


/* ---------- 8. Галерея-мозаика ----------
   Фото выстраиваются рядами разной высоты: в одном ряду два-три кадра,
   в другом больше. У каждого ряда высота подбирается так, чтобы ряд
   ровно занимал всю ширину. Высота ряда никогда не больше targetHeight,
   поэтому слишком больших фото на экране не бывает. */

function buildGallery(gallery, work) {
  const items = work.photos.map((photoUrl, photoIndex) => {
    const item = document.createElement("button");
    item.className = "photo-gallery__item reveal";
    item.type = "button";
    item.setAttribute("aria-label", "Открыть фото " + (photoIndex + 1));
    item.aspectRatio = 1.5;   // примерная пропорция, пока фото не загрузилось

    const image = document.createElement("img");
    image.src = photoUrl;
    image.alt = `${work.title} — кадр ${photoIndex + 1}`;
    image.loading = "lazy";
    image.onerror = hideBrokenImage;

    // Когда фото загрузилось, узнаём его настоящую пропорцию и перестраиваем мозаику
    image.addEventListener("load", () => {
      item.aspectRatio = image.naturalWidth / image.naturalHeight;
      layoutGallery(gallery, items);
    });

    item.appendChild(image);
    item.addEventListener("click", () => openLightbox(photoIndex));
    gallery.appendChild(item);
    return item;
  });

  layoutGallery(gallery, items);

  // Перестраиваем мозаику, если изменилась ширина окна
  if (galleryResizeObserver) galleryResizeObserver.disconnect();
  // (реагируем только на изменение ширины, высота меняется от самой мозаики)
  let lastWidth = gallery.clientWidth;
  galleryResizeObserver = new ResizeObserver(() => {
    if (gallery.clientWidth === lastWidth) return;
    lastWidth = gallery.clientWidth;
    layoutGallery(gallery, items);
  });
  galleryResizeObserver.observe(gallery);
}

function layoutGallery(gallery, items) {
  const galleryWidth = gallery.clientWidth;
  if (!galleryWidth) return;

  const gap = parseFloat(getComputedStyle(gallery).columnGap) || 10;

  // Желаемая (максимальная) высота ряда зависит от ширины экрана
  const targetHeight = galleryWidth > 1100 ? 360 : galleryWidth > 700 ? 300 : 200;

  let row = [];
  let ratioSum = 0;   // сумма пропорций (ширина / высота) фото в текущем ряду

  items.forEach((item) => {
    row.push(item);
    ratioSum += item.aspectRatio;

    // Хватает ли фото, чтобы заполнить ряд по ширине при желаемой высоте?
    const rowWidthAtTarget = ratioSum * targetHeight + gap * (row.length - 1);
    if (rowWidthAtTarget >= galleryWidth) {
      sizeRow(row, ratioSum, galleryWidth, gap, targetHeight, true);
      row = [];
      ratioSum = 0;
    }
  });

  // Последний неполный ряд не растягиваем: фото остаются нормального размера
  if (row.length) sizeRow(row, ratioSum, galleryWidth, gap, targetHeight, false);
}

// Задаёт размеры фото одного ряда
function sizeRow(row, ratioSum, galleryWidth, gap, targetHeight, fillWholeWidth) {
  const totalGap = gap * (row.length - 1);
  const rowHeight = fillWholeWidth
    ? (galleryWidth - totalGap) / ratioSum   // высота, при которой ряд ровно по ширине
    : targetHeight;

  row.forEach((item) => {
    item.style.height = rowHeight + "px";
    item.style.width = Math.floor(item.aspectRatio * rowHeight * 100) / 100 + "px";
  });
}


/* ---------- 9. Просмотр фото (lightbox) ---------- */

const lightbox = $("#lightbox");
const lightboxImage = $("#lightbox-image");
let lightboxPhotoIndex = 0;

function openLightbox(photoIndex) {
  lightboxPhotoIndex = photoIndex;
  showLightboxPhoto();
  lightbox.classList.add("is-open");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
}

function showLightboxPhoto() {
  const work = works[currentWorkIndex];
  const photoCount = work.photos.length;

  // Листаем по кругу: после последнего фото снова первое
  lightboxPhotoIndex = (lightboxPhotoIndex + photoCount) % photoCount;

  lightboxImage.src = work.photos[lightboxPhotoIndex];
  lightboxImage.alt = `${work.title} — кадр ${lightboxPhotoIndex + 1}`;
  $("#lightbox-counter").textContent = `${lightboxPhotoIndex + 1} / ${photoCount}`;
}

function stepLightbox(direction) {
  lightboxPhotoIndex += direction;
  showLightboxPhoto();
}

$("#lightbox-close").addEventListener("click", closeLightbox);
$("#lightbox-prev").addEventListener("click", () => stepLightbox(-1));
$("#lightbox-next").addEventListener("click", () => stepLightbox(1));

// Клик по тёмному фону закрывает просмотр
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Свайп пальцем влево/вправо листает фото
let swipeStartX = 0;
lightbox.addEventListener("touchstart", (event) => {
  swipeStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  const swipeDistance = event.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(swipeDistance) > 50) stepLightbox(swipeDistance < 0 ? 1 : -1);
});

// Клавиатура: Esc закрывает по очереди (фото, страница работы, меню), стрелки листают
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("is-open")) closeLightbox();
    else if (projectPage.classList.contains("is-open")) location.hash = "#works";
    else setMenuOpen(false);
  }

  if (lightbox.classList.contains("is-open")) {
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "ArrowLeft") stepLightbox(-1);
  }
});


/* ---------- 10. Форма заявки ----------
   Заявка уходит через Formspree, и письмо приходит на почту владельца. */

const requestForm = $("#request-form");
const requestStatus = $("#request-status");
const requestSubmit = $("#request-submit");

requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(requestForm));

  // Скрытое поле заполняют только спам-боты
  if (data._gotcha) return;

  if (!data.name.trim() || !data.contact.trim() || !data.message.trim()) {
    requestStatus.textContent = "Заполните все поля.";
    return;
  }

  requestSubmit.disabled = true;
  requestStatus.textContent = "Отправляем…";

  try {
    const response = await fetch(siteSettings.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: data.name,
        contact: data.contact,
        message: data.message,
        _subject: "Заявка с сайта ONEROMAN"
      })
    });

    if (!response.ok) throw new Error("Отправка не удалась");

    requestForm.reset();
    requestStatus.textContent = "Спасибо! Заявка отправлена, скоро свяжусь с вами.";
  } catch (error) {
    requestStatus.innerHTML = `Не получилось отправить. Напишите на
      <a href="mailto:${siteSettings.contactEmail}" style="text-decoration:underline">${siteSettings.contactEmail}</a>
      или в Telegram.`;
  }

  requestSubmit.disabled = false;
});
