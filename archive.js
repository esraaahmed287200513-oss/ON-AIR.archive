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

        const arabicText = element.getAttribute("data-ar");
        const englishText = element.getAttribute("data-en");

        if (language === "ar") {

            element.textContent = arabicText;

        } else {

            element.textContent = englishText;

        }

    });

}


/* -----------------------------------------------------
   SET LANGUAGE
----------------------------------------------------- */

function setLanguage(language) {

    if (language !== "ar" && language !== "en") {
        language = "ar";
    }


    /* HTML LANGUAGE */

    document.documentElement.lang = language;


    /* HTML DIRECTION */

    document.documentElement.dir =
        language === "ar" ? "rtl" : "ltr";


    /* BODY STATE */

    document.body.setAttribute(
        "data-language",
        language
    );


    /* UPDATE TEXT */

    updateLanguageContent(language);
      
    /* UPDATE PRODUCTION DAYS */

if (typeof renderProductionDays === "function") {
    renderProductionDays();
}

    /* UPDATE BUTTONS */

    languageButtons.forEach(button => {

        const isActive =
            button.dataset.lang === language;

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            isActive ? "true" : "false"
        );

    });


    /* SAVE LANGUAGE */

    try {

        localStorage.setItem(
            "onAirLanguage",
            language
        );

    } catch (error) {

        console.warn(
            "ON AIR: Could not save language preference."
        );

    }

}


/* -----------------------------------------------------
   INITIALIZE LANGUAGE
----------------------------------------------------- */

function initLanguage() {

    if (!languageButtons.length) {
        return;
    }


    languageButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const language =
                    button.dataset.lang;

                setLanguage(language);

            }
        );

    });


    let savedLanguage = "ar";


    try {

        const storedLanguage =
            localStorage.getItem(
                "onAirLanguage"
            );

        if (
            storedLanguage === "ar" ||
            storedLanguage === "en"
        ) {

            savedLanguage = storedLanguage;

        }

    } catch (error) {

        savedLanguage = "ar";

    }


    setLanguage(savedLanguage);

}


/* =====================================================
   ARCHIVE REVEAL SYSTEM
===================================================== */

function initArchiveReveal() {

    const revealElements = document.querySelectorAll(
        [
            ".archive-label",
            ".archive-file",
            ".archive-logo",
            ".archive-line",
            ".archive-intro-label",
            ".archive-intro-title",
            ".archive-intro-line",
            ".archive-intro-description",
            ".archive-meta",
            ".team-identity-logo",
            ".team-identity-label",
            ".team-identity-title",
            ".team-identity-line",
            ".team-identity-footer",
            ".production-header",
            ".production-panel",
            ".production-footer"
        ].join(",")
    );


    if (!revealElements.length) {
        return;
    }


    /* -------------------------------------------------
       INITIAL STATE
    ------------------------------------------------- */

    revealElements.forEach(element => {

        element.classList.add(
            "archive-reveal"
        );

    });


    /* -------------------------------------------------
       REDUCED MOTION
    ------------------------------------------------- */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        revealElements.forEach(element => {

            element.classList.add(
                "archive-visible"
            );

        });

        return;

    }


    /* -------------------------------------------------
       INTERSECTION OBSERVER
    ------------------------------------------------- */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "archive-visible"
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );


    revealElements.forEach(element => {

        observer.observe(element);

    });

}


/* =====================================================
   CINEMATIC ARCHIVE PARALLAX
===================================================== */

function initArchiveParallax() {

    const archive =
        document.querySelector(
            ".archive-page"
        );

    const background =
        document.querySelector(
            ".archive-background"
        );

    const grid =
        document.querySelector(
            ".archive-grid"
        );


    if (!archive) {
        return;
    }


    /* -------------------------------------------------
       DESKTOP ONLY
    ------------------------------------------------- */

    const desktopQuery =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );


    if (!desktopQuery.matches) {
        return;
    }


    let animationFrame = null;

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;


    /* -------------------------------------------------
       UPDATE PARALLAX
    ------------------------------------------------- */

    function updateParallax() {

        currentX +=
            (mouseX - currentX) * 0.08;

        currentY +=
            (mouseY - currentY) * 0.08;


        if (background) {

            background.style.transform =
                `
                translate(
                    ${currentX * 8}px,
                    ${currentY * 8}px
                )
                scale(1.025)
                `;

        }


        if (grid) {

            grid.style.transform =
                `
                translate(
                    ${currentX * 3}px,
                    ${currentY * 3}px
                )
                `;

        }


        animationFrame =
            requestAnimationFrame(
                updateParallax
            );

    }


    /* -------------------------------------------------
       MOUSE MOVE
    ------------------------------------------------- */

    archive.addEventListener(
        "mousemove",
        event => {

            mouseX =
                (event.clientX /
                    window.innerWidth) - 0.5;

            mouseY =
                (event.clientY /
                    window.innerHeight) - 0.5;

        }
    );


    /* -------------------------------------------------
       MOUSE LEAVE
    ------------------------------------------------- */

    archive.addEventListener(
        "mouseleave",
        () => {

            mouseX = 0;
            mouseY = 0;

        }
    );


    /* -------------------------------------------------
       START
    ------------------------------------------------- */

    animationFrame =
        requestAnimationFrame(
            updateParallax
        );


    /* -------------------------------------------------
       CLEANUP ON PAGE HIDDEN
    ------------------------------------------------- */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                animationFrame
            ) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame = null;

            } else if (
                !document.hidden &&
                !animationFrame
            ) {

                animationFrame =
                    requestAnimationFrame(
                        updateParallax
                    );

            }

        }
    );


    /* -------------------------------------------------
       MOBILE / RESIZE
    ------------------------------------------------- */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth <= 700
            ) {

                if (background) {
                    background.style.transform =
                        "translate(0, 0) scale(1)";
                }

                if (grid) {
                    grid.style.transform =
                        "translate(0, 0)";
                }

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

    /* -------------------------------------------------
       PRESS KIT
    ------------------------------------------------- */

    const pressKit =
        document.querySelector(
            ".deliverable-link"
        );


    if (pressKit) {

        pressKit.addEventListener(
            "click",
            event => {

                const href =
                    pressKit.getAttribute("href");


                /*
                 * Don't allow "#" to jump
                 * to the top of the page.
                 */

                if (
                    !href ||
                    href === "#"
                ) {

                    event.preventDefault();

                    showArchiveMessage(
                        "PRESS KIT",
                        "ملف الصحافة سيكون متاحًا قريبًا."
                    );

                }

            }
        );

    }


    /* -------------------------------------------------
       LOCKED DELIVERABLES
    ------------------------------------------------- */

    const lockedItems =
        document.querySelectorAll(
            ".deliverable-item.locked"
        );


    lockedItems.forEach(item => {

        item.setAttribute(
            "tabindex",
            "0"
        );


        item.setAttribute(
            "role",
            "button"
        );


        item.addEventListener(
            "click",
            () => {

                showArchiveMessage(
                    "LOCKED",
                    "هذا الملف غير متاح حاليًا."
                );

            }
        );


        item.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    showArchiveMessage(
                        "LOCKED",
                        "هذا الملف غير متاح حاليًا."
                    );

                }

            }
        );

    });

}


/* =====================================================
   ARCHIVE MESSAGE
===================================================== */

function showArchiveMessage(
    title,
    message
) {

    let notification =
        document.querySelector(
            ".archive-notification"
        );


    /* -------------------------------------------------
       CREATE
    ------------------------------------------------- */

    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.className =
            "archive-notification";


        notification.innerHTML = `
            <div class="archive-notification-inner">
                <span class="archive-notification-title"></span>
                <span class="archive-notification-message"></span>
            </div>
        `;


        document.body.appendChild(
            notification
        );

    }


    /* -------------------------------------------------
       CONTENT
    ------------------------------------------------- */

    const titleElement =
        notification.querySelector(
            ".archive-notification-title"
        );

    const messageElement =
        notification.querySelector(
            ".archive-notification-message"
        );


    if (titleElement) {
        titleElement.textContent = title;
    }


    if (messageElement) {
        messageElement.textContent = message;
    }


    /* -------------------------------------------------
       SHOW
    ------------------------------------------------- */

    notification.classList.remove(
        "is-visible"
    );


    requestAnimationFrame(() => {

        notification.classList.add(
            "is-visible"
        );

    });


    /* -------------------------------------------------
       AUTO HIDE
    ------------------------------------------------- */

    clearTimeout(
        notification._hideTimer
    );


    notification._hideTimer =
        setTimeout(() => {

            notification.classList.remove(
                "is-visible"
            );

        }, 3200);

}


/* =====================================================
   REDUCED MOTION
===================================================== */

function initReducedMotion() {

    const motionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    function updateMotion() {

        document.documentElement.classList.toggle(
            "reduce-motion",
            motionQuery.matches
        );

    }


    updateMotion();


    if (
        typeof motionQuery.addEventListener ===
        "function"
    ) {

        motionQuery.addEventListener(
            "change",
            updateMotion
        );

    } else {

        motionQuery.addListener(
            updateMotion
        );

    }

}


/* =====================================================
   PAGE LOADED
===================================================== */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);


/* =====================================================
   IMAGE LOAD HANDLING
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const images =
            document.querySelectorAll(
                "img"
            );


        images.forEach(image => {

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
                    once: true
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
                    once: true
                }
            );

        });

    }
);


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


        ticking = false;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateScrollState
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );


    updateScrollState();

}


document.addEventListener(
    "DOMContentLoaded",
    initScrollProgress
);


/* =====================================================
   DEBUG
===================================================== */

console.log(
    "ON AIR — Archive JS loaded successfully."
);


/* =====================================================
   ON AIR — PRODUCTION DAYS ARCHIVE
   CINEMATIC DIARY — AR / EN
===================================================== */

const productionDays = [

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


    {
        number: "03",

        titleAr: "اليوم الثالث",
        titleEn: "DAY THREE",

        status: "open",

        statusAr: "مفتوح",
        statusEn: "OPEN",

        dateAr: "قريباً",
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
   RENDER PRODUCTION DAYS
===================================================== */

function renderProductionDays() {

    const grid =
        document.getElementById(
            "productionDaysGrid"
        );

    if (!grid) return;


    const language =
        document.documentElement.lang === "en"
            ? "en"
            : "ar";


    /* -----------------------------------------------
       CLEAR CURRENT DAYS
    ----------------------------------------------- */

    grid.innerHTML = "";


    productionDays.forEach(function (day, dayIndex) {

        const card =
            document.createElement("article");


        card.className =
            "production-day-card " +
            (day.status === "locked"
                ? "locked"
                : "");


        card.dataset.day =
            day.number;


        /* =================================================
           LANGUAGE DATA
        ================================================= */

        const title =
            language === "en"
                ? day.titleEn
                : day.titleAr;


        const status =
            language === "en"
                ? day.statusEn
                : day.statusAr;


        const date =
            language === "en"
                ? day.dateEn
                : day.dateAr;


        const description =
            language === "en"
                ? day.descriptionEn
                : day.descriptionAr;


        const events =
            language === "en"
                ? day.eventsEn
                : day.eventsAr;


        /* =================================================
           LOCKED DAYS
        ================================================= */

        if (day.status === "locked") {

            card.innerHTML = `

                <div class="day-card-top">

                    <span class="day-status">
                        ${status}
                    </span>

                    <span class="day-number">
                        ${day.number}
                    </span>

                </div>


                <h3 class="day-title">
                    ${title}
                </h3>


                <div class="locked-content">

                    <div class="lock-icon">
                        🔒
                    </div>

                    <span>
                        ${
                            language === "en"
                                ? "COMING SOON"
                                : "قريبًا"
                        }
                    </span>

                </div>

            `;

        }


        /* =================================================
           OPEN DAYS
        ================================================= */

        else {

            /* ---------------------------------------------
               EVENTS
            --------------------------------------------- */

            const eventsHTML =
                events
                    .map(function (event) {

                        return `
                            <li>
                                ${event}
                            </li>
                        `;

                    })
                    .join("");


            /* ---------------------------------------------
               IMAGES
               EVERY IMAGE IS RENDERED
            --------------------------------------------- */

            const imagesHTML =
                day.images
                    .map(function (image, imageIndex) {

                        return `

                            <div
                                class="
                                    day-image-wrapper
                                    day-photo-${imageIndex + 1}
                                "
                            >

                                <img
                                    class="day-image"
                                    src="${image}"
                                    alt="${title}"
                                    loading="lazy"
                                >


                                <div class="day-image-frame">

                                    <span>
                                        ON AIR | بِالعَافيَه
                                    </span>

                                </div>

                            </div>

                        `;

                    })
                    .join("");


            /* ---------------------------------------------
               CARD
            --------------------------------------------- */

            card.innerHTML = `

                <div class="day-card-top">

                    <span class="day-status">
                        ${status}
                    </span>


                    <span class="day-number">
                        ${day.number}
                    </span>


                    <div class="day-date">

                        <span class="day-date-icon">
                            ▣
                        </span>

                        <span>
                            ${date}
                        </span>

                    </div>

                </div>


                <h3 class="day-title">
                    ${title}
                </h3>


                <div class="day-images">

                    ${imagesHTML}

                </div>


                <p class="day-description">
                    ${description}
                </p>


                <ul class="day-events">

                    ${eventsHTML}

                </ul>

            `;

        }


        /* =================================================
           ADD CARD
        ================================================= */

        grid.appendChild(card);


        /* =================================================
           CINEMATIC STAGGER
        ================================================= */

        card.style.setProperty(
            "--day-index",
            dayIndex
        );

    });


    /* =====================================================
       REINITIALIZE SCROLL REVEAL
    ===================================================== */

    initProductionDayReveal();

}


/* =====================================================
   PRODUCTION DAYS — SCROLL REVEAL
   ONE DAY AT A TIME
===================================================== */

function initProductionDayReveal() {

    const cards =
        document.querySelectorAll(
            ".production-day-card"
        );


    if (!cards.length) return;


    /* -----------------------------------------------
       REDUCED MOTION
    ----------------------------------------------- */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        cards.forEach(function (card) {

            card.classList.add(
                "is-visible"
            );

        });

        return;

    }


    /* -----------------------------------------------
       OBSERVER
    ----------------------------------------------- */

    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },

            {
                threshold: 0.18,

                rootMargin:
                    "0px 0px -12% 0px"
            }

        );


    cards.forEach(function (card) {

        observer.observe(card);

    });

}


/* =====================================================
   INITIALIZE PRODUCTION DAYS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderProductionDays();

    }
);

/* =====================================================
   ON AIR — CREW
===================================================== */


/* =====================================================
   CREW CARD FLIP
===================================================== */

document.querySelectorAll(".crew-card").forEach((card) => {

    card.addEventListener("click", (event) => {

        /*
         * لو المستخدم ضغط على Portfolio
         * ما نقلبش الكارت.
         */

        if (
            event.target.closest(".portfolio-link")
        ) {
            return;
        }

        card.classList.toggle("is-flipped");

    });

});


/* =====================================================
   CREW SCROLL REVEAL
===================================================== */

const crewRevealElements =
    document.querySelectorAll(".crew-section .reveal");


const crewObserver =
    new IntersectionObserver(

        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12,

            rootMargin:
                "0px 0px -70px 0px"
        }

    );


crewRevealElements.forEach((element) => {

    crewObserver.observe(element);

});
document.addEventListener("DOMContentLoaded", () => {

    const micCursor = document.getElementById("customMicCursor");

    if (!micCursor) return;

    /* حركة الميكروفون مع الماوس */
    document.addEventListener("mousemove", (e) => {

        micCursor.style.left = `${e.clientX}px`;
        micCursor.style.top = `${e.clientY}px`;

        micCursor.classList.remove("hidden");

    });

    /* إخفاء الميكروفون لما الماوس يخرج من الصفحة */
    document.addEventListener("mouseleave", () => {

        micCursor.classList.add("hidden");

    });

    document.addEventListener("mouseenter", () => {

        micCursor.classList.remove("hidden");

    });

    /* تأثير عند الضغط */
    document.addEventListener("mousedown", () => {

        micCursor.classList.add("clicking");

    });

    document.addEventListener("mouseup", () => {

        micCursor.classList.remove("clicking");

    });

    /* تكبير الميكروفون فوق العناصر القابلة للضغط */
    const interactiveElements = document.querySelectorAll(
        "a, button, input, textarea, select, .card, .archive-card"
    );

    interactiveElements.forEach((element) => {

        element.addEventListener("mouseenter", () => {

            micCursor.classList.add("hover");

        });

        element.addEventListener("mouseleave", () => {

            micCursor.classList.remove("hover");

        });

    });

});
/* =========================================================
   ON AIR — LEAVE YOUR MARK
   STICKY NOTE COMMUNITY WALL
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       SUPABASE CONFIGURATION
       
       IMPORTANT:
       Replace these two values with your own Supabase
       project URL and ANON KEY.
    ====================================================== */

    const SUPABASE_URL =
        "YOUR_SUPABASE_PROJECT_URL";

    const SUPABASE_ANON_KEY =
        "YOUR_SUPABASE_ANON_KEY";


    let supabaseClient = null;


    /* =====================================================
       INITIALIZE SUPABASE
    ====================================================== */

    function initSupabase() {

        if (
            SUPABASE_URL.includes("YOUR_") ||
            SUPABASE_ANON_KEY.includes("YOUR_")
        ) {
            console.warn(
                "ON AIR Sticky Wall: Supabase is not configured yet."
            );

            return null;
        }


        if (
            typeof window.supabase === "undefined"
        ) {
            console.warn(
                "ON AIR Sticky Wall: Supabase library is missing."
            );

            return null;
        }


        try {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_ANON_KEY
                );

            return supabaseClient;

        } catch (error) {

            console.error(
                "ON AIR Sticky Wall: Supabase initialization failed.",
                error
            );

            return null;

        }

    }


    /* =====================================================
       DOM
    ====================================================== */

    const modal =
        document.getElementById(
            "stickyModal"
        );

    const openButton =
        document.getElementById(
            "openStickyNote"
        );

    const closeButton =
        document.getElementById(
            "closeStickyNote"
        );

    const backdrop =
        document.getElementById(
            "stickyModalBackdrop"
        );

    const form =
        document.getElementById(
            "stickyNoteForm"
        );

    const messageInput =
        document.getElementById(
            "stickyMessageInput"
        );

    const nameInput =
        document.getElementById(
            "stickyNameInput"
        );

    const websiteInput =
        document.getElementById(
            "stickyWebsite"
        );

    const characterCount =
        document.getElementById(
            "stickyCharacterCount"
        );

    const submitButton =
        document.getElementById(
            "stickySubmitButton"
        );

    const formStatus =
        document.getElementById(
            "stickyFormStatus"
        );

    const notesContainer =
        document.getElementById(
            "stickyNotesContainer"
        );

    const loading =
        document.getElementById(
            "stickyLoading"
        );

    const emptyState =
        document.getElementById(
            "stickyEmpty"
        );

    const notesCount =
        document.getElementById(
            "stickyNotesCount"
        );


    if (
        !modal ||
        !openButton ||
        !closeButton ||
        !form ||
        !messageInput ||
        !nameInput ||
        !notesContainer
    ) {
        return;
    }


    /* =====================================================
       CONFIG
    ====================================================== */

    const MAX_MESSAGE_LENGTH = 180;

    const MAX_NAME_LENGTH = 35;

    const STORAGE_KEY =
        "onAirStickyNotes";

    const LAST_SUBMISSION_KEY =
        "onAirStickyLastSubmission";


    const COLORS = [
        "sticky-note-teal",
        "sticky-note-cream",
        "sticky-note-beige",
        "sticky-note-dark",
        "sticky-note-red"
    ];


    /* =====================================================
       LANGUAGE HELPER
    ====================================================== */

    function currentLanguage() {

        return (
            document.documentElement.lang === "en"
            ? "en"
            : "ar"
        );

    }


    /* =====================================================
       TRANSLATION
    ====================================================== */

    function translate(ar, en) {

        return currentLanguage() === "en"
            ? en
            : ar;

    }


    /* =====================================================
       MODAL OPEN
    ====================================================== */

    function openModal() {

        modal.classList.add(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "sticky-modal-open"
        );


        setTimeout(() => {

            messageInput.focus();

        }, 300);

    }


    /* =====================================================
       MODAL CLOSE
    ====================================================== */

    function closeModal() {

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "sticky-modal-open"
        );

        clearStatus();

    }


    openButton.addEventListener(
        "click",
        openModal
    );


    closeButton.addEventListener(
        "click",
        closeModal
    );


    backdrop?.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "is-open"
                )
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       CHARACTER COUNTER
    ====================================================== */

    function updateCharacterCount() {

        const length =
            messageInput.value.length;

        characterCount.textContent =
            length;

        if (
            length >
            MAX_MESSAGE_LENGTH
        ) {

            characterCount.style.color =
                "var(--red)";

        } else {

            characterCount.style.color =
                "";

        }

    }


    messageInput.addEventListener(
        "input",
        updateCharacterCount
    );


    /* =====================================================
       STATUS
    ====================================================== */

    function clearStatus() {

        formStatus.textContent = "";

        formStatus.className =
            "sticky-form-status";

    }


    function showStatus(
        type,
        ar,
        en
    ) {

        formStatus.textContent =
            translate(ar, en);

        formStatus.className =
            `sticky-form-status ${type}`;

    }


    /* =====================================================
       SUBMIT STATE
    ====================================================== */

    function setSubmitting(
        isSubmitting
    ) {

        if (
            isSubmitting
        ) {

            submitButton.classList.add(
                "loading"
            );

            submitButton.disabled =
                true;

            submitButton.querySelector(
                ".sticky-submit-text"
            ).textContent =
                translate(
                    "جاري تثبيت الرسالة...",
                    "PINNING YOUR NOTE..."
                );

        } else {

            submitButton.classList.remove(
                "loading"
            );

            submitButton.disabled =
                false;

            submitButton.querySelector(
                ".sticky-submit-text"
            ).textContent =
                translate(
                    "ثبّت رسالتي على الحائط",
                    "PIN MY NOTE TO THE WALL"
                );

        }

    }


    /* =====================================================
       BASIC VALIDATION
    ====================================================== */

    function validateMessage(
        message
    ) {

        const clean =
            message.trim();


        if (
            clean.length < 2
        ) {

            return {
                valid: false,
                ar: "اكتبي رسالة أطول شوية.",
                en: "Write a slightly longer message."
            };

        }


        if (
            clean.length >
            MAX_MESSAGE_LENGTH
        ) {

            return {
                valid: false,
                ar: "الرسالة طويلة زيادة.",
                en: "Your message is too long."
            };

        }


        return {
            valid: true
        };

    }


    /* =====================================================
       RATE LIMIT
       
       One submission per 60 seconds per browser.
    ====================================================== */

    function isRateLimited() {

        try {

            const last =
                Number(
                    localStorage.getItem(
                        LAST_SUBMISSION_KEY
                    )
                );


            if (!last) {
                return false;
            }


            const elapsed =
                Date.now() - last;


            return (
                elapsed <
                60 * 1000
            );

        } catch {

            return false;

        }

    }


    function saveSubmissionTime() {

        try {

            localStorage.setItem(
                LAST_SUBMISSION_KEY,
                String(Date.now())
            );

        } catch {}

    }


    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearStatus();


            /* HONEYPOT */

            if (
                websiteInput &&
                websiteInput.value.trim()
            ) {

                return;

            }


            const message =
                messageInput.value.trim();

            const name =
                nameInput.value.trim();


            /* VALIDATE */

            const validation =
                validateMessage(
                    message
                );


            if (
                !validation.valid
            ) {

                showStatus(
                    "error",
                    validation.ar,
                    validation.en
                );

                return;

            }


            if (
                name.length >
                MAX_NAME_LENGTH
            ) {

                showStatus(
                    "error",
                    "الاسم طويل زيادة.",
                    "Your name is too long."
                );

                return;

            }


            if (
                isRateLimited()
            ) {

                showStatus(
                    "error",
                    "استني دقيقة قبل ما تبعت رسالة تانية.",
                    "Please wait a minute before sending another note."
                );

                return;

            }


            setSubmitting(true);


            try {

                const client =
                    initSupabase();


                /* =========================================
                   SUPABASE MODE
                ========================================== */

                if (client) {

                    const {
                        error
                    } =
                        await client
                            .from(
                                "sticky_notes"
                            )
                            .insert({
                                message:
                                    message,

                                name:
                                    name ||
                                    null,

                                approved:
                                    false
                            });


                    if (error) {

                        throw error;

                    }


                    saveSubmissionTime();


                    form.reset();

                    updateCharacterCount();


                    showStatus(
                        "success",
                        "وصلت! رسالتك دخلت المراجعة وهتظهر بعد الموافقة.",
                        "Got it! Your note is waiting for approval."
                    );


                    setTimeout(() => {

                        closeModal();

                    }, 2200);


                    return;

                }


                /* =========================================
                   LOCAL FALLBACK
                ========================================== */

                saveLocalNote({
                    message,
                    name
                });


                saveSubmissionTime();


                form.reset();

                updateCharacterCount();


                showStatus(
                    "success",
                    "رسالتك اتثبتت على الجهاز ده.",
                    "Your note was saved on this device."
                );


                setTimeout(() => {

                    closeModal();

                }, 1800);


            } catch (error) {

                console.error(
                    "ON AIR Sticky Wall submission error:",
                    error
                );


                showStatus(
                    "error",
                    "حصلت مشكلة. جربي تاني.",
                    "Something went wrong. Please try again."
                );

            } finally {

                setSubmitting(false);

            }

        }
    );


    /* =====================================================
       LOCAL STORAGE
    ====================================================== */

    function getLocalNotes() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!raw) {
                return [];
            }


            const parsed =
                JSON.parse(raw);


            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch {

            return [];

        }

    }


    function saveLocalNote(
        note
    ) {

        const notes =
            getLocalNotes();


        notes.push({
            id:
                `local-${Date.now()}`,

            message:
                note.message,

            name:
                note.name || null,

            created_at:
                new Date().toISOString()
        });


        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(notes)
            );

        } catch {}


        renderUserNote(
            note
        );

        updateCount();

    }


    /* =====================================================
       LOAD SUPABASE NOTES
    ====================================================== */

    async function loadSupabaseNotes() {

        const client =
            initSupabase();


        if (!client) {

            loadLocalNotes();

            finishLoading();

            return;

        }


        try {

            const {
                data,
                error
            } =
                await client
                    .from(
                        "sticky_notes"
                    )
                    .select(
                        "id,message,name,created_at"
                    )
                    .eq(
                        "approved",
                        true
                    )
                    .order(
                        "created_at",
                        {
                            ascending: true
                        }
                    )
                    .limit(100);


            if (error) {

                throw error;

            }


            data.forEach(
                note => {

                    renderUserNote(
                        note
                    );

                }
            );


            updateCount();


        } catch (error) {

            console.error(
                "ON AIR Sticky Wall load error:",
                error
            );


            loadLocalNotes();

        } finally {

            finishLoading();

        }

    }


    /* =====================================================
       LOCAL LOAD
    ====================================================== */

    function loadLocalNotes() {

        const notes =
            getLocalNotes();


        notes.forEach(
            note => {

                renderUserNote(
                    note
                );

            }
        );


        updateCount();

    }


    /* =====================================================
       FINISH LOADING
    ====================================================== */

    function finishLoading() {

        if (!loading) {
            return;
        }


        loading.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       RANDOM NOTE STYLE
    ====================================================== */

    function randomBetween(
        min,
        max
    ) {

        return (
            Math.random() *
            (max - min)
        ) + min;

    }


    function getNoteStyle() {

        return {

            x:
                randomBetween(
                    10,
                    90
                ),

            y:
                randomBetween(
                    20,
                    82
                ),

            rotation:
                randomBetween(
                    -5,
                    5
                ),

            color:
                COLORS[
                    Math.floor(
                        Math.random() *
                        COLORS.length
                    )
                ]

        };

    }


    /* =====================================================
       CREATE NOTE
    ====================================================== */

    function renderUserNote(
        note
    ) {

        if (
            !note ||
            !note.message
        ) {

            return;

        }


        const style =
            getNoteStyle();


        const article =
            document.createElement(
                "article"
            );


        article.className =
            `onair-sticky-note user-sticky-note ${style.color}`;


        article.style.setProperty(
            "--x",
            `${style.x}%`
        );


        article.style.setProperty(
            "--y",
            `${style.y}%`
        );


        article.style.setProperty(
            "--r",
            `${style.rotation}deg`
        );


        article.dataset.userNote =
            "true";


        article.dataset.noteId =
            note.id || "";


        const pin =
            document.createElement(
                "span"
            );

        pin.className =
            "sticky-pin";


        const content =
            document.createElement(
                "div"
            );

        content.className =
            "sticky-paper-content";


        const paragraph =
            document.createElement(
                "p"
            );

        paragraph.textContent =
            note.message;


        content.appendChild(
            paragraph
        );


        article.appendChild(
            pin
        );


        article.appendChild(
            content
        );


        if (note.name) {

            const author =
                document.createElement(
                    "span"
                );

            author.className =
                "sticky-author";

            author.textContent =
                `— ${note.name}`;

            article.appendChild(
                author
            );

        } else {

            const author =
                document.createElement(
                    "span"
                );

            author.className =
                "sticky-author";

            author.textContent =
                "— ANONYMOUS";

            article.appendChild(
                author
            );

        }


        notesContainer.appendChild(
            article
        );

    }


    /* =====================================================
       COUNT
    ====================================================== */

    function updateCount() {

        const userNotes =
            notesContainer.querySelectorAll(
                "[data-user-note='true']"
            ).length;


        const total =
            userNotes;


        if (notesCount) {

            notesCount.textContent =
                String(total).padStart(
                    3,
                    "0"
                ) +
                (
                    currentLanguage() === "en"
                    ? " NOTES"
                    : " رسالة"
                );

        }


        if (emptyState) {

            emptyState.hidden =
                total > 0;

        }

    }


    /* =====================================================
       LANGUAGE CHANGE OBSERVER
       
       Your existing archive.js changes language
       dynamically. We watch the HTML lang attribute.
    ====================================================== */

    const languageObserver =
        new MutationObserver(
            () => {

                updateCount();

                updateCharacterCount();

            }
        );


    languageObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: [
                "lang"
            ]
        }
    );


    /* =====================================================
       INIT
    ====================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            initSupabase();

            updateCharacterCount();

            loadSupabaseNotes();

        }
    );


})();