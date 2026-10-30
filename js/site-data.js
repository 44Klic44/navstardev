/* ==========================================================
   ДАННЫЕ САЙТА
   Это единственный файл, который нужно править, чтобы
   менять фото, видео, тексты и добавлять новые работы.
   Логика сайта лежит в js/main.js, трогать её не нужно.
   ========================================================== */

/* ---------- 1. Основные настройки ---------- */

const siteSettings = {
  // Ссылка формы заявок (сервис Formspree). Заявки приходят на почту,
  // указанную при создании формы на formspree.io
  formEndpoint: "https://formspree.io/f/xoejzrbv",

  // Запасная почта: показывается, если отправка заявки не удалась
  contactEmail: "stance_srt@mail.ru",

  // Фото первого экрана
  heroPhoto:
    "https://static.tildacdn.com/tild3230-3665-4830-a338-363761623436/DSC07389.jpg",
  heroPhotoMobile:
    "https://static.tildacdn.com/tila3061-3163-4562-a466-643631663731/DSC08832_1.jpg",

  // Фоновое видео блока «Обо мне». Положите файл в папку assets.
  // Чтобы убрать блок с сайта, оставьте пустые кавычки: ""
  aboutVideo: "assets/bg.mp4",

  // Заставка, пока видео не загрузилось (необязательно). Например: "assets/bg.jpg"
  aboutVideoPoster: "",

  // Текст поверх видео: слова проявляются по мере прокрутки
  aboutText:
    "Меня зовут Роман. Фотографирую машины — дрифт, тюнинг, соревнования, ночные съёмки. Просто люблю это дело. Если нужна съёмка — заполни форму ниже.",
};

/* ---------- 2. Услуги ---------- */

const services = [
  {
    title: "Дрифт и соревнования",
    text: "Динамика, дым, скорость. Съёмка заездов и этапов, репортаж и серия лучших кадров.",
  },
  {
    title: "Тюнинг и детали",
    text: "Крупные детали, диски, свет, посадка. Для владельцев, студий и проектов.",
  },
  {
    title: "Ночные съёмки",
    text: "Город, неон, длинные выдержки. Атмосферные кадры вашего авто после заката.",
  },
  {
    title: "Съёмка на заказ",
    text: "Выезд на любую локацию, rolling shot, обход машины, фото и вертикальное видео.",
  },
];

/* ---------- 3. Работы ----------
   Как добавить новую работу:
   1. Скопируйте один блок createWork({ ... }), вместе с запятой в конце.
   2. Поменяйте название, категорию, год и описание.
   3. В photos вставьте ссылки на фото, по одной на строку.
      Первое фото становится обложкой (или укажите cover: "ссылка").
   Страница работы, ссылка на неё и номер создаются сами. */

const works = [
  createWork({
    title: "GARAGE FEST",
    category: "Автовыставка · RDS · Гонки",
    year: "2025",
    description: "",
    photos: `
      https://static.tildacdn.com/tild6261-3333-4564-b134-646638396534/DSC07346.jpg
      https://static.tildacdn.com/tild3265-3539-4330-a362-343861323361/DSC07347.jpg
      https://static.tildacdn.com/tild3262-6231-4739-b631-353763353035/DSC07352_1.jpg
      https://static.tildacdn.com/tild6234-6535-4336-b638-333864336663/DSC07373.jpg
      https://static.tildacdn.com/tild3230-3665-4830-a338-363761623436/DSC07389.jpg
      https://static.tildacdn.com/tild3161-6666-4331-b664-396633663562/DSC06877.jpg
      https://static.tildacdn.com/tild6335-6664-4635-a564-343530306465/DSC07400.jpg
      https://static.tildacdn.com/tild3363-3235-4630-b131-626132316231/DSC07423.jpg
      https://static.tildacdn.com/tild6437-6564-4538-b833-393637623930/DSC06880.jpg
      https://static.tildacdn.com/tild6631-6330-4863-b439-666338636566/DSC07343.jpg
      https://static.tildacdn.com/tild3363-3134-4834-a365-633136333565/DSC06884.jpg
      https://static.tildacdn.com/tild3566-6635-4663-b262-356438646236/DSC07303.jpg
      https://static.tildacdn.com/tild3439-3063-4266-b430-646361616138/DSC07297.jpg
    `,
  }),

  createWork({
    title: "TSUNAMI PICNIC", 

    category: "Автофестиваль",
    year: "2026",
    description: "Автовыставка и дрифт",
    photos: `
      https://static.tildacdn.com/tild3636-3636-4264-b232-333336613864/DSC06480.jpg
      https://static.tildacdn.com/tild3530-3438-4434-b236-383539343736/DSC06468.jpg
      https://static.tildacdn.com/tild3038-6437-4231-b632-313364623539/DSC06470.jpg
      https://static.tildacdn.com/tild6136-6161-4134-b538-306339366635/DSC06479.jpg
      https://static.tildacdn.com/tild6432-6236-4031-a430-643962306663/DSC06485.jpg
      https://static.tildacdn.com/tild6536-6237-4232-b863-663931633063/DSC06551.jpg
      https://static.tildacdn.com/tild3666-3162-4434-a339-623239326531/DSC06569.jpg
      https://static.tildacdn.com/tild6334-3963-4564-b338-333735313537/DSC06574.jpg
      https://static.tildacdn.com/tild3566-3363-4537-a361-313862303036/DSC06397.jpg
      https://static.tildacdn.com/tild3463-3166-4833-b365-316562303535/DSC06469.jpg
    `,
  }),

  createWork({
    title: "BMW F32",
    category: "Улица",
    year: "2026",
    description: "Съёмка в тёмном стиле на локации старого завода",
    photos: `
      https://static.tildacdn.com/tild3362-3335-4236-b264-653132343763/DSC07973.jpg
      https://static.tildacdn.com/tild3763-3834-4364-a263-353430393261/DSC07982.jpg
      https://static.tildacdn.com/tild3462-6335-4461-a566-653937643739/DSC07978.jpg
      https://static.tildacdn.com/tild3061-6231-4131-a337-663334373336/DSC07977.jpg
      https://static.tildacdn.com/tild3636-3134-4365-a430-376134313366/DSC07965.jpg
      https://static.tildacdn.com/tild6263-3839-4734-a133-393364643366/DSC07975.jpg
      https://static.tildacdn.com/tild3766-3736-4434-a538-323433663938/DSC09648_.webp
      https://static.tildacdn.com/tild3635-3761-4231-a362-653231626238/DSC09599_1_1_.webp
      https://static.tildacdn.com/tild3261-6435-4539-b331-343266643164/DSC09656_.webp
      https://static.tildacdn.com/tild6563-3939-4763-b639-663633623362/DSC09660_2_.webp
      https://static.tildacdn.com/tild6634-6433-4731-b664-626139316639/DSC09662_.webp
      https://static.tildacdn.com/tild6662-3033-4563-b635-613832303933/DSC09672_.webp
      https://static.tildacdn.com/tild6437-3239-4538-a234-343666396264/DSC09700_.webp
      https://static.tildacdn.com/tild3663-3065-4637-b537-636637353935/DSC09738_1_1_.webp
      https://static.tildacdn.com/tild3839-3834-4065-a266-636333373233/DSC09750_.webp
      https://static.tildacdn.com/tild3462-3066-4637-b162-326238643862/DSC09583_3_.webp
      https://static.tildacdn.com/tild3332-3439-4238-a664-643330323961/DSC09581_2_.webp
      https://static.tildacdn.com/tild3139-3330-4633-b231-383061623065/DSC09580_1_1_.webp
      https://static.tildacdn.com/tild3162-3036-4633-a566-373965623061/BMW___.webp
      https://static.tildacdn.com/tild6665-3038-4466-b761-313864646335/_5_.webp
    `,
  }),

  createWork({
    title: "YUKA DRIVE",
    category: "Автоспорт · Дрифт",
    year: "2026",
    description:
      "YUKA DRIVE GYMKHANA АВТОСПОРТИВНЫЕ соревнования в атмосфере летнего фестиваля",
    photos: `
      https://static.tildacdn.com/tild6439-3337-4634-a463-363937396436/DSC04113_1.jpg
      https://static.tildacdn.com/tild6239-3862-4661-b363-623563383831/DSC01266_1.jpg
      https://static.tildacdn.com/tild3236-6365-4963-b033-366533616230/DSC00017.jpg
      https://static.tildacdn.com/tild6134-3365-4333-a439-343533323262/DSC01244.jpg
      https://static.tildacdn.com/tild3666-3833-4030-a431-356266666134/DSC04077_1.jpg
      https://static.tildacdn.com/tild6465-6162-4131-b538-363035346236/DSC01530.jpg
      https://static.tildacdn.com/tild3666-6566-4438-b930-623235333833/DSC00358_2.jpg
      https://static.tildacdn.com/tild6561-6466-4134-b937-366335386566/DSC03995_1.jpg
      https://static.tildacdn.com/tild6665-3631-4339-b366-333766646563/DSC04005_2.jpg
      https://static.tildacdn.com/tild3562-3431-4731-b633-633737333533/DSC04014_1.jpg
      https://static.tildacdn.com/tild3838-3636-4162-b665-326161326262/DSC01068.jpg
    `,
  }),

  createWork({
    title: "TOYOTA CHASER",
    category: "Тюнинг",
    year: "2026",
    description: "Автовыставка Drift Expo",
    photos: `
      https://static.tildacdn.com/tild6265-3232-4961-b837-376337663230/DSC09924_1.jpg
      https://static.tildacdn.com/tild3632-3762-4031-b466-383536346166/DSC09917.jpg
      https://static.tildacdn.com/tild3164-3962-4633-b636-613734373637/DSC09915.jpg
      https://static.tildacdn.com/tild3738-3465-4234-a164-393261346666/DSC09926.jpg
      https://static.tildacdn.com/tild6663-6465-4464-a261-386666303330/DSC09927.jpg
      https://static.tildacdn.com/tild3064-6133-4539-b265-643630376265/DSC09931.jpg
      https://static.tildacdn.com/tild3535-3564-4336-a163-333661353032/DSC09946.jpg
      https://static.tildacdn.com/tild3562-3936-4331-a464-386133363236/DSC09951.jpg
      https://static.tildacdn.com/tild6237-6261-4236-b462-666162633531/DSC09920.jpg
    `,
  }),

  createWork({
    title: "Nissan Silvia",
    category: "Тюнинг · Детали",
    year: "2026",
    description:
      "Детали, которые делают машину уникальной: хром, карбон, посадка.",
    photos: `
      https://static.tildacdn.com/tild3466-6663-4738-b965-326263316132/DSC08058_.webp
      https://static.tildacdn.com/tild3635-3530-4032-b136-366334393861/DSC08082_.webp
      https://static.tildacdn.com/tild6665-3835-4465-a662-383039626361/DSC08062_.webp
      https://static.tildacdn.com/tild6662-6665-4234-b664-313638393162/DSC08063_.webp
      https://static.tildacdn.com/tild3162-6230-4434-a262-363535396537/DSC08065_.webp
      https://static.tildacdn.com/tild6334-3934-4638-b234-373337323564/DSC08069_.webp
      https://static.tildacdn.com/tild6433-3733-4265-a135-663837366230/DSC08080_.webp
    `,
  }),
];

/* ---------- Служебная функция (её можно не трогать) ----------
   Превращает список ссылок из текста в массив, выбирает обложку
   и делает из названия адрес страницы работы. */
function createWork(work) {
  work.photos = work.photos
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  work.cover = work.cover || work.photos[0];

  work.slug =
    work.slug ||
    work.title
      .toLowerCase()
      .replace(/[^a-z0-9а-я]+/gi, "-")
      .replace(/^-|-$/g, "");

  return work;
}
