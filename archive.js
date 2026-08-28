/* =====================================================
   ON AIR بالعافيةِ
   ARCHIVE — MAIN JAVASCRIPT
   ===================================================== */

"use strict";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initLanguage();
    initArchiveReveal();
    initArchiveParallax();
    initArchiveInteractions();
    initReducedMotion();

});


/* =====================================================
   LANGUAGE SYSTEM
===================================================== */

const languageButtons = document.querySelectorAll(
    ".language button[data-lang]"
);


/* -----------------------------------------------------
   UPDATE TRANSLATABLE CONTENT
----------------------------------------------------- */

function updateLanguageContent(language) {

    const elements = document.querySelectorAll(
        "[data-ar][data-en]"
    );

    elements.forEach(element => {

        const arabicText =
            element.getAttribute("data-ar");

        const englishText =
            element.getAttribute("data-en");


        if (language === "ar") {

            element.textContent =
                arabicText;

        } else {

            element.textContent =
                englishText;

        }

    });
/* =====================================================
   REFRESH PRODUCTION DAYS LANGUAGE
===================================================== */

if (
    typeof renderOATimeline === "function" &&
    typeof renderOADay === "function" &&
    document.getElementById("oaDaysTrack")
) {
    renderOATimeline();
    renderOADay(
        oaActiveDay,
        oaActivePhoto
    );
}

}


/* -----------------------------------------------------
   SET LANGUAGE
----------------------------------------------------- */

function setLanguage(language) {

    if (
        language !== "ar" &&
        language !== "en"
    ) {

        language = "ar";

    }


    document.documentElement.lang =
        language;


    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    document.body.classList.toggle(
        "lang-en",
        language === "en"
    );


    document.body.classList.toggle(
        "lang-ar",
        language === "ar"
    );


    updateLanguageContent(
        language
    );


    languageButtons.forEach(button => {

        const active =
            button.dataset.lang ===
            language;


        button.classList.toggle(
            "active",
            active
        );


        button.setAttribute(
            "aria-pressed",
            String(active)
        );

    });


    try {

        localStorage.setItem(
            "onair-language",
            language
        );

    } catch (error) {

        /* Storage unavailable */

    }

}


/* -----------------------------------------------------
   INITIALIZE LANGUAGE
----------------------------------------------------- */

function initLanguage() {

    if (!languageButtons.length) {
        return;
    }


    let savedLanguage = "ar";


    try {

        savedLanguage =
            localStorage.getItem(
                "onair-language"
            ) || "ar";

    } catch (error) {

        savedLanguage = "ar";

    }


    setLanguage(
        savedLanguage
    );


    languageButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setLanguage(
                    button.dataset.lang
                );

            }
        );

    });

}


/* =====================================================
   ARCHIVE REVEAL
===================================================== */

function initArchiveReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal, .archive-reveal, [data-reveal]"
        );


    if (!elements.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        elements.forEach(element => {

            element.classList.add(
                "visible",
                "is-visible",
                "revealed"
            );

        });

        return;

    }


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {

            element.classList.add(
                "visible",
                "is-visible",
                "revealed"
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {

                        return;

                    }


                    entry.target.classList.add(
                        "visible",
                        "is-visible",
                        "revealed"
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.08,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    elements.forEach(element => {

        observer.observe(
            element
        );

    });

}


/* =====================================================
   ARCHIVE PARALLAX
===================================================== */

function initArchiveParallax() {

    const background =
        document.querySelector(
            ".archive-background"
        );


    const grid =
        document.querySelector(
            ".archive-grid"
        );


    if (
        !background &&
        !grid
    ) {

        return;

    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {

        return;

    }


    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let frame = null;


    function animate() {

        frame = null;


        currentX +=
            (targetX - currentX) *
            0.08;


        currentY +=
            (targetY - currentY) *
            0.08;


        if (background) {

            background.style.transform =
                `translate3d(${currentX}px, ${currentY}px, 0)`;

        }


        if (grid) {

            grid.style.transform =
                `translate3d(${currentX * 0.35}px, ${currentY * 0.35}px, 0)`;

        }


        if (
            Math.abs(
                targetX - currentX
            ) > 0.05 ||
            Math.abs(
                targetY - currentY
            ) > 0.05
        ) {

            frame =
                requestAnimationFrame(
                    animate
                );

        }

    }


    document.addEventListener(
        "mousemove",
        event => {

            const width =
                window.innerWidth;

            const height =
                window.innerHeight;


            if (
                !width ||
                !height
            ) {

                return;

            }


            targetX =
                (
                    event.clientX /
                    width -
                    0.5
                ) * 8;


            targetY =
                (
                    event.clientY /
                    height -
                    0.5
                ) * 8;


            if (
                frame === null
            ) {

                frame =
                    requestAnimationFrame(
                        animate
                    );

            }

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "blur",
        () => {

            targetX = 0;
            targetY = 0;


            if (
                frame === null
            ) {

                frame =
                    requestAnimationFrame(
                        animate
                    );

            }

        },
        {
            passive: true
        }
    );

}


/* =====================================================
   ARCHIVE INTERACTIONS
===================================================== */

function initArchiveInteractions() {

    const elements =
        document.querySelectorAll(
            "a, button, [role='button']"
        );


    if (!elements.length) {
        return;
    }


    elements.forEach(element => {

        element.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;

                }


                if (
                    element.getAttribute(
                        "role"
                    ) === "button"
                ) {

                    event.preventDefault();

                    element.click();

                }

            }
        );

    });

}


/* =====================================================
   REDUCED MOTION
===================================================== */

function initReducedMotion() {

    const mediaQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    function update() {

        document.documentElement.classList.toggle(
            "reduce-motion",
            mediaQuery.matches
        );

    }


    update();


    if (
        typeof mediaQuery.addEventListener ===
        "function"
    ) {

        mediaQuery.addEventListener(
            "change",
            update
        );

    } else if (
        typeof mediaQuery.addListener ===
        "function"
    ) {

        mediaQuery.addListener(
            update
        );

    }

}
/* =====================================================
   ARCHIVE SCROLL PROGRESS
===================================================== */

function initScrollProgress() {

    const archive =
        document.querySelector(
            ".archive-page"
        );

    if (!archive) {
        return;
    }


    let ticking = false;


    function updateScrollState() {

        ticking = false;


        const rect =
            archive.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        const total =
            archive.offsetHeight -
            viewportHeight;


        if (total <= 0) {
            return;
        }


        const progress =
            Math.min(
                Math.max(
                    -rect.top / total,
                    0
                ),
                1
            );


        document.documentElement.style.setProperty(
            "--archive-scroll-progress",
            progress.toFixed(4)
        );

    }


    window.addEventListener(
        "scroll",
        () => {

            if (ticking) {
                return;
            }


            ticking = true;


            requestAnimationFrame(
                updateScrollState
            );

        },
        {
            passive: true
        }
    );


    updateScrollState();

}


/* =====================================================
   IMAGE LOAD HANDLING
===================================================== */

function initImageLoading() {

    const images =
        document.querySelectorAll(
            "img"
        );


    if (!images.length) {
        return;
    }


    images.forEach(
        image => {

            if (image.complete) {

                image.classList.add(
                    "image-loaded"
                );

                return;

            }


            image.addEventListener(
                "load",
                () => {

                    image.classList.add(
                        "image-loaded"
                    );

                },
                {
                    once: true,
                    passive: true
                }
            );


            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-error"
                    );

                },
                {
                    once: true,
                    passive: true
                }
            );

        }
    );

}


/* =====================================================
   ON AIR — PRODUCTION DAYS
===================================================== */

const productionDays = [

    /* =====================================================
       DAY 01
    ====================================================== */

    {
        number: "01",

        titleAr: "اليوم الأول",
        titleEn: "DAY ONE",

        status: "open",

        statusAr: "مفتوح",
        statusEn: "OPEN",

        dateAr: "29 يونيو 2026",
        dateEn: "29 JUNE 2026",

        images: [
            "images/meeting2.png.jpeg",
            "images/meeting3.png.jpeg"
        ],

        descriptionAr:
            "أول خطوة في طريق الحكاية. بداية التحضير، أول اجتماع، وأول لحظة حسّينا فيها إن المشروع بقى حقيقي.",

        descriptionEn:
            "The first step into the story. The beginning of preparation, the first meeting, and the moment the project started to feel real.",

        eventsAr: [
            "أول اجتماع للفريق",
            "تحديد المهام الأساسية",
            "مناقشة فكرة الفيلم",
            "بداية الحكاية"
        ],

        eventsEn: [
            "First team meeting",
            "Defining the main roles",
            "Discussing the film idea",
            "The beginning of the story"
        ]
    },


    /* =====================================================
       DAY 02
    ====================================================== */

    {
        number: "02",

        titleAr: "اليوم الثاني",
        titleEn: "DAY TWO",

        status: "open",

        statusAr: "مفتوح",
        statusEn: "OPEN",

        dateAr: "7 يوليو 2026",
        dateEn: "7 JULY 2026",

        images: [
            "images/meeting1.png.jpeg"
        ],

        descriptionAr:
            "يوم جديد من التحضير. تفاصيل أكتر، قرارات أكتر، والحكاية بدأت تاخد شكلها.",

        descriptionEn:
            "Another day of preparation. More details, more decisions, and the story began to take shape.",

        eventsAr: [
            "معلومات وبحث عن الفكرة",
            "تجهيز خطة الفيلم",
            "بداية كتابة السيناريو"
        ],

        eventsEn: [
            "Researching the idea",
            "Preparing the film plan",
            "Beginning the screenplay"
        ]
    },


    /* =====================================================
       DAY 03
    ====================================================== */

    {
        number: "03",

        titleAr: "اليوم الثالث",
        titleEn: "DAY THREE",

        status: "locked",

        statusAr: "قريبًا",
        statusEn: "COMING SOON",

        dateAr: "قريبًا",
        dateEn: "COMING SOON",

        images: [
            "/images/day-03.jpg"
        ],

        descriptionAr:
            "التفاصيل الصغيرة بدأت تصنع الصورة الكبيرة.",

        descriptionEn:
            "The smallest details began shaping the bigger picture.",

        eventsAr: [
            "مراجعة المشاهد",
            "تجهيز الأدوات",
            "مراجعة خطة التصوير"
        ],

        eventsEn: [
            "Reviewing the scenes",
            "Preparing the equipment",
            "Reviewing the shooting plan"
        ]
    },


    /* =====================================================
       DAY 04
    ====================================================== */

    {
        number: "04",

        titleAr: "اليوم الرابع",
        titleEn: "DAY FOUR",

        status: "locked",

        statusAr: "مغلق",
        statusEn: "LOCKED",

        dateAr: "",
        dateEn: "",

        images: [],

        descriptionAr: "",
        descriptionEn: "",

        eventsAr: [],
        eventsEn: []
    },


    /* =====================================================
       DAY 05
    ====================================================== */

    {
        number: "05",

        titleAr: "اليوم الخامس",
        titleEn: "DAY FIVE",

        status: "locked",

        statusAr: "مغلق",
        statusEn: "LOCKED",

        dateAr: "",
        dateEn: "",

        images: [],

        descriptionAr: "",
        descriptionEn: "",

        eventsAr: [],
        eventsEn: []
    },


    /* =====================================================
       DAY 06
    ====================================================== */

    {
        number: "06",

        titleAr: "اليوم السادس",
        titleEn: "DAY SIX",

        status: "locked",

        statusAr: "مغلق",
        statusEn: "LOCKED",

        dateAr: "",
        dateEn: "",

        images: [],

        descriptionAr: "",
        descriptionEn: "",

        eventsAr: [],
        eventsEn: []
    }

];


/* =====================================================
   PRODUCTION DAYS STATE
===================================================== */

let oaActiveDay = 0;

let oaActivePhoto = 0;


/* =====================================================
   PRODUCTION DAYS LANGUAGE
===================================================== */

function oaDaysLanguage() {

    return document.documentElement.lang === "en"
        ? "en"
        : "ar";

}


/* =====================================================
   RENDER FEATURED DAY
===================================================== */

function renderOADay(
    dayIndex,
    photoIndex = 0
) {

    const day =
        productionDays[dayIndex];


    if (!day) {
        return;
    }


    const lang =
        oaDaysLanguage();


    const title =
        lang === "en"
            ? day.titleEn
            : day.titleAr;


    const status =
        lang === "en"
            ? day.statusEn
            : day.statusAr;


    const date =
        lang === "en"
            ? day.dateEn
            : day.dateAr;


    const description =
        lang === "en"
            ? day.descriptionEn
            : day.descriptionAr;


    const events =
        lang === "en"
            ? day.eventsEn
            : day.eventsAr;


    oaActiveDay =
        dayIndex;


    oaActivePhoto =
        day.images.length
            ? Math.min(
                photoIndex,
                day.images.length - 1
            )
            : 0;


    /* =================================================
       MAIN IMAGE
    ================================================= */

    const mainImage =
        document.getElementById(
            "oaDaysMainImage"
        );


    if (mainImage) {

        mainImage.classList.add(
            "oa-days-image-changing"
        );


        /*
         * نحفظ الـ timeout في العنصر نفسه
         * عشان لو المستخدم ضغط بسرعة
         * مانعملش عدة تغييرات متراكمة.
         */

        clearTimeout(
            mainImage._oaImageTimer
        );


        mainImage._oaImageTimer =
            setTimeout(
                () => {

                    if (!day.images.length) {
                        return;
                    }


                    mainImage.src =
                        day.images[
                            oaActivePhoto
                        ];


                    mainImage.alt =
                        title;


                    mainImage.classList.remove(
                        "oa-days-image-changing"
                    );

                },
                120
            );

    }


    /* =================================================
       SAFE TEXT UPDATE
    ================================================= */

    const current =
        document.getElementById(
            "oaDaysCurrent"
        );

    if (current) {
        current.textContent =
            day.number;
    }


    const number =
        document.getElementById(
            "oaDaysNumber"
        );

    if (number) {
        number.textContent =
            day.number;
    }
const dayWatermark =
    document.getElementById(
        "oaDaysWatermark"
    );

if (dayWatermark) {
    dayWatermark.textContent =
        `DAY ${day.number}`;
}
const featured =
    document.querySelector(
        ".oa-days-featured"
    );

if (featured) {
    featured.dataset.dayWatermark =
        `DAY ${day.number}`;
}

    const titleElement =
        document.getElementById(
            "oaDaysTitle"
        );

    if (titleElement) {
        titleElement.textContent =
            title;
    }


    const statusElement =
        document.getElementById(
            "oaDaysStatus"
        );

    if (statusElement) {
        statusElement.textContent =
            status;
    }


    const dateElement =
        document.getElementById(
            "oaDaysDate"
        );

    if (dateElement) {

        dateElement.textContent =
            date ||
            (
                lang === "en"
                    ? "COMING SOON"
                    : "قريبًا"
            );

    }


    const descriptionElement =
        document.getElementById(
            "oaDaysDescription"
        );

    if (descriptionElement) {

        descriptionElement.textContent =
            description ||
            (
                lang === "en"
                    ? "Details will be added to the archive soon."
                    : "تفاصيل اليوم هتظهر هنا لما يحين وقته."
            );

    }


    const indexElement =
        document.getElementById(
            "oaDaysIndex"
        );

    if (indexElement) {

        indexElement.textContent =
            `${day.number} / ${String(
                productionDays.length
            ).padStart(2, "0")}`;

    }


    const totalElement =
        document.getElementById(
            "oaDaysTotal"
        );

    if (totalElement) {

        totalElement.textContent =
            String(
                productionDays.length
            ).padStart(2, "0");

    }


    const frameElement =
        document.getElementById(
            "oaDaysFrame"
        );

    if (frameElement) {

        frameElement.textContent =
            String(
                oaActivePhoto + 1
            ).padStart(3, "0");

    }


    /* =================================================
       EVENTS
    ================================================= */

    const eventsContainer =
        document.getElementById(
            "oaDaysEvents"
        );


    if (eventsContainer) {

        /*
         * استخدام fragment يمنع repaint
         * مع كل <li> يتم إضافته.
         */

        const fragment =
            document.createDocumentFragment();


        events.forEach(
            eventText => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    eventText;


                fragment.appendChild(
                    li
                );

            }
        );


        eventsContainer.replaceChildren(
            fragment
        );

    }


    /* =================================================
       GALLERY
    ================================================= */

    renderOAGallery(
        day
    );


    /* =================================================
       TIMELINE STATE
    ================================================= */

    renderOATimelineState();

}
/* =====================================================
   RENDER GALLERY
===================================================== */

function renderOAGallery(day) {

    const gallery =
        document.getElementById(
            "oaDaysThumbs"
        );


    if (!gallery) {
        return;
    }


    const images =
        day.images || [];


    /*
     * لو مفيش صور
     */

    if (!images.length) {

        gallery.replaceChildren();

        return;

    }


    /*
     * نبني الـ thumbnails مرة واحدة
     * باستخدام DocumentFragment.
     */

    const fragment =
        document.createDocumentFragment();


    images.forEach(
        (src, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "oa-days-thumb";


            button.dataset.index =
                String(index);


            button.setAttribute(
                "aria-label",
                `Photo ${index + 1}`
            );


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                src;


            image.alt =
                "";


            image.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            image.decoding =
                "async";


            button.appendChild(
                image
            );


            /*
             * listener واحد لكل thumbnail
             */

            button.addEventListener(
                "click",
                () => {

                    changeOAPhoto(
                        index
                    );

                }
            );


            fragment.appendChild(
                button
            );

        }
    );


    gallery.replaceChildren(
        fragment
    );


    updateOAGalleryState();

}


/* =====================================================
   UPDATE GALLERY STATE
===================================================== */

function updateOAGalleryState() {

    const thumbnails =
        document.querySelectorAll(
            "#oaDaysThumbs .oa-days-thumb"
        );


    thumbnails.forEach(
        (thumbnail, index) => {

            thumbnail.classList.toggle(
                "active",
                index === oaActivePhoto
            );

        }
    );


    const day =
        productionDays[
            oaActiveDay
        ];


    if (!day) {
        return;
    }


    const counter =
        document.getElementById(
            "oaDaysPhotoCounter"
        );


    if (
        counter &&
        day.images &&
        day.images.length
    ) {

        counter.textContent =
            `${String(
                oaActivePhoto + 1
            ).padStart(2, "0")} / ${String(
                day.images.length
            ).padStart(2, "0")}`;

    }

}


/* =====================================================
   CHANGE PHOTO
===================================================== */

function changeOAPhoto(
    photoIndex
) {

    const day =
        productionDays[
            oaActiveDay
        ];


    if (
        !day ||
        !day.images ||
        !day.images.length
    ) {

        return;

    }


    const image =
        document.getElementById(
            "oaDaysMainImage"
        );


    if (!image) {
        return;
    }


    oaActivePhoto =
        Math.max(
            0,
            Math.min(
                photoIndex,
                day.images.length - 1
            )
        );


    clearTimeout(
        image._oaPhotoTimer
    );


    image.classList.add(
        "oa-days-image-changing"
    );


    image._oaPhotoTimer =
        setTimeout(
            () => {

                image.src =
                    day.images[
                        oaActivePhoto
                    ];


                image.alt =
                    oaDaysLanguage() === "en"
                        ? day.titleEn
                        : day.titleAr;


                image.classList.remove(
                    "oa-days-image-changing"
                );


            },
            120
        );


    const frame =
        document.getElementById(
            "oaDaysFrame"
        );


    if (frame) {

        frame.textContent =
            String(
                oaActivePhoto + 1
            ).padStart(
                3,
                "0"
            );

    }


    updateOAGalleryState();

}


/* =====================================================
   PHOTO CONTROLS
===================================================== */

function initOAPhotoControls() {

    const previous =
        document.getElementById(
            "oaDaysPhotoPrev"
        );


    const next =
        document.getElementById(
            "oaDaysPhotoNext"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            () => {

                const day =
                    productionDays[
                        oaActiveDay
                    ];


                if (
                    !day ||
                    !day.images ||
                    day.images.length < 2
                ) {

                    return;

                }


                let index =
                    oaActivePhoto - 1;


                if (
                    index < 0
                ) {

                    index =
                        day.images.length - 1;

                }


                changeOAPhoto(
                    index
                );

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            () => {

                const day =
                    productionDays[
                        oaActiveDay
                    ];


                if (
                    !day ||
                    !day.images ||
                    day.images.length < 2
                ) {

                    return;

                }


                let index =
                    oaActivePhoto + 1;


                if (
                    index >=
                    day.images.length
                ) {

                    index = 0;

                }


                changeOAPhoto(
                    index
                );

            }
        );

    }

}


/* =====================================================
   PRODUCTION TIMELINE
===================================================== */

function renderOATimeline() {

    const track =
        document.getElementById(
            "oaDaysTrack"
        );


    if (!track) {
        return;
    }


    const lang =
        oaDaysLanguage();


    const fragment =
        document.createDocumentFragment();


    productionDays.forEach(
        (day, index) => {

            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "oa-days-timeline-item";


            item.dataset.index =
                String(index);


            /*
             * IMAGE
             */

            if (
                day.images &&
                day.images.length
            ) {

                const wrapper =
                    document.createElement(
                        "span"
                    );


                wrapper.className =
                    "oa-days-timeline-image";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    day.images[0];


                image.alt =
                    "";


                image.loading =
                    "lazy";


                image.decoding =
                    "async";


                wrapper.appendChild(
                    image
                );


                item.appendChild(
                    wrapper
                );

            }


            /*
             * NUMBER
             */

            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "oa-days-timeline-number";


            number.textContent =
                day.number;


            item.appendChild(
                number
            );


            /*
             * TEXT
             */

            const copy =
                document.createElement(
                    "span"
                );


            copy.className =
                "oa-days-timeline-copy";


            const label =
                document.createElement(
                    "small"
                );

              label.textContent =
                day.number;

            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                lang === "en"
                    ? day.titleEn
                    : day.titleAr;


            const date =
                document.createElement(
                    "em"
                );


            date.textContent =
                (
                    lang === "en"
                        ? day.dateEn
                        : day.dateAr
                ) ||
                (
                    lang === "en"
                        ? "COMING SOON"
                        : "قريبًا"
                );


            copy.appendChild(
                label
            );


            copy.appendChild(
                title
            );


            copy.appendChild(
                date
            );


            item.appendChild(
                copy
            );


            /*
             * STATUS DOT
             */

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "oa-days-timeline-dot";


            item.appendChild(
                dot
            );


            /*
             * SINGLE EVENT LISTENER
             */

            item.addEventListener(
                "click",
                () => {

                    if (
                        day.status ===
                        "locked"
                    ) {

                        const lang =
                            oaDaysLanguage();


                        showArchiveMessage(
                            lang === "en"
                                ? "COMING SOON"
                                : "قريبًا",

                            lang === "en"
                                ? "We’re just getting started… this day hasn’t arrived yet."
                                : "لسه بنبدأ… اليوم ده لسه ما وصلش."
                        );


                        return;

                    }


                    selectOADay(
                        index
                    );

                }
            );


            fragment.appendChild(
                item
            );

        }
    );


    /*
     * DOM update مرة واحدة
     */

    track.replaceChildren(
        fragment
    );


    renderOATimelineState();

}


/* =====================================================
   TIMELINE ACTIVE STATE
===================================================== */

function renderOATimelineState() {

    const items =
        document.querySelectorAll(
            ".oa-days-timeline-item"
        );


    items.forEach(
        (item, index) => {

            item.classList.toggle(
                "active",
                index === oaActiveDay
            );

        }
    );

}


/* =====================================================
   SELECT PRODUCTION DAY
===================================================== */

function selectOADay(
    index
) {

    const day =
        productionDays[
            index
        ];


    if (
        !day ||
        day.status === "locked"
    ) {

        return;

    }


    /*
     * مفيش داعي نعيد رسم نفس اليوم.
     */

    if (
        index === oaActiveDay
    ) {

        return;

    }


    oaActiveDay =
        index;


    oaActivePhoto =
        0;


    const featured =
        document.querySelector(
            ".oa-days-featured"
        );


    if (!featured) {

        renderOADay(
            index,
            0
        );

        return;

    }


    featured.classList.add(
        "oa-days-changing"
    );


    clearTimeout(
        featured._oaDayTimer
    );


    featured._oaDayTimer =
        setTimeout(
            () => {

                renderOADay(
                    index,
                    0
                );


                featured.classList.remove(
                    "oa-days-changing"
                );


            },
            160
        );


    const selected =
        document.querySelector(
            `.oa-days-timeline-item[data-index="${index}"]`
        );


    if (selected) {

        selected.scrollIntoView({
            behavior:
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth",

            block: "nearest",

            inline: "center"
        });

    }

}


/* =====================================================
   DAY NAVIGATION
===================================================== */

function initOADayNavigation() {

    const previous =
        document.getElementById(
            "oaDaysPrev"
        );


    const next =
        document.getElementById(
            "oaDaysNext"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            () => {

                let index =
                    oaActiveDay - 1;


                while (
                    index >= 0 &&
                    productionDays[index].status ===
                    "locked"
                ) {

                    index--;

                }


                if (
                    index >= 0
                ) {

                    selectOADay(
                        index
                    );

                }

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            () => {

                let index =
                    oaActiveDay + 1;


                while (
                    index <
                    productionDays.length &&
                    productionDays[index].status ===
                    "locked"
                ) {

                    index++;

                }


                if (
                    index <
                    productionDays.length
                ) {

                    selectOADay(
                        index
                    );

                }

            }
        );

    }

}


/* =====================================================
   CREW
===================================================== */

function initCrew() {

    const cards =
        document.querySelectorAll(
            ".crew-card"
        );


    if (!cards.length) {
        return;
    }


    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

                    /*
                     * روابط البورتفوليو تفضل روابط
                     * عادية وما تقلبش الكارت.
                     */

                    if (
                        event.target.closest(
                            ".portfolio-link"
                        )
                    ) {

                        return;

                    }


                    card.classList.toggle(
                        "is-flipped"
                    );

                }
            );

        }
    );


    /*
     * Crew reveal
     */

    const reveal =
        document.querySelectorAll(
            ".crew-section .reveal"
        );


    if (!reveal.length) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        reveal.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    if (
        !("IntersectionObserver" in window)
    ) {

        reveal.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target.classList.add(
                            "visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -70px 0px"
            }
        );


    reveal.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/* =====================================================
   CUSTOM MIC CURSOR
===================================================== */

function initCustomMicCursor() {

    const cursor =
        document.getElementById(
            "customMicCursor"
        );


    if (!cursor) {
        return;
    }


    /*
     * مفيش custom cursor للموبايل.
     */

    if (
        window.matchMedia(
            "(hover: none), (pointer: coarse)"
        ).matches
    ) {

        cursor.classList.add(
            "hidden"
        );

        return;

    }


    let mouseX = 0;
    let mouseY = 0;

    let frame = null;


    function updateCursor() {

        frame = null;


        cursor.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    }


    document.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;


            mouseY =
                event.clientY;


            if (
                frame !== null
            ) {

                return;

            }


            frame =
                requestAnimationFrame(
                    updateCursor
                );


            cursor.classList.remove(
                "hidden"
            );

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "mouseleave",
        () => {

            cursor.classList.add(
                "hidden"
            );

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "mouseenter",
        () => {

            cursor.classList.remove(
                "hidden"
            );

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "mousedown",
        () => {

            cursor.classList.add(
                "clicking"
            );

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            cursor.classList.remove(
                "clicking"
            );

        },
        {
            passive: true
        }
    );


    /*
     * Event delegation
     * بدل ما نضيف listeners لكل عنصر.
     */

    const interactiveSelector =
        [
            "a",
            "button",
            "input",
            "textarea",
            "select",
            "[role='button']"
        ].join(",");


    document.addEventListener(
        "mouseover",
        event => {

            const target =
                event.target.closest(
                    interactiveSelector
                );


            if (!target) {
                return;
            }


            cursor.classList.add(
                "hover"
            );

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "mouseout",
        event => {

            const target =
                event.target.closest(
                    interactiveSelector
                );


            if (!target) {
                return;
            }


            if (
                target.contains(
                    event.relatedTarget
                )
            ) {

                return;

            }


            cursor.classList.remove(
                "hover"
            );

        },
        {
            passive: true
        }
    );

}


/* =====================================================
   ARCHIVE INITIALIZATION
===================================================== */

function initArchive() {

    /*
     * Production Days
     */

    renderOATimeline();


    renderOADay(
        0,
        0
    );


    /*
     * Controls
     */

    initOAPhotoControls();

    initOADayNavigation();


    /*
     * Crew
     */

    initCrew();


    /*
     * Cursor
     */

    initCustomMicCursor();

}


/* =====================================================
   SINGLE DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initArchive,
    {
        once: true
    }
);