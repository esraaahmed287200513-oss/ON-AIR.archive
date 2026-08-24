/* =====================================================
   ON AIR بالعافيةِ
   PRODUCTION + DELIVERABLES JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initProductionJournal();
    initDeliverables();
    initDeliverableStatus();

});


/* =====================================================
   PRODUCTION JOURNAL
===================================================== */

function initProductionJournal() {

    const productionDays =
        document.querySelectorAll(
            ".production-day"
        );


    if (!productionDays.length) {
        return;
    }


    productionDays.forEach(day => {

        const button =
            day.querySelector(
                ".day-header"
            );


        if (!button) {
            return;
        }


        /* -------------------------------------------------
           ACCESSIBILITY
        ------------------------------------------------- */

        button.setAttribute(
            "role",
            "button"
        );


        button.setAttribute(
            "tabindex",
            "0"
        );


        const isInitiallyOpen =
            day.classList.contains("open");


        button.setAttribute(
            "aria-expanded",
            isInitiallyOpen
                ? "true"
                : "false"
        );


        /* -------------------------------------------------
           CLICK
        ------------------------------------------------- */

        button.addEventListener(
            "click",
            () => {

                toggleProductionDay(
                    day,
                    productionDays
                );

            }
        );


        /* -------------------------------------------------
           KEYBOARD
        ------------------------------------------------- */

        button.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    toggleProductionDay(
                        day,
                        productionDays
                    );

                }

            }
        );

    });

}


/* =====================================================
   TOGGLE PRODUCTION DAY
===================================================== */

function toggleProductionDay(
    selectedDay,
    allDays
) {

    const isOpen =
        selectedDay.classList.contains(
            "open"
        );


    /* -------------------------------------------------
       CLOSE ALL
    ------------------------------------------------- */

    allDays.forEach(day => {

        day.classList.remove(
            "open"
        );


        const button =
            day.querySelector(
                ".day-header"
            );


        if (button) {

            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    /* -------------------------------------------------
       OPEN SELECTED
    ------------------------------------------------- */

    if (!isOpen) {

        selectedDay.classList.add(
            "open"
        );


        const button =
            selectedDay.querySelector(
                ".day-header"
            );


        if (button) {

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }

}


/* =====================================================
   DELIVERABLES
===================================================== */

function initDeliverables() {

    const deliverableLinks =
        document.querySelectorAll(
            ".deliverable-link"
        );


    deliverableLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                /* -------------------------------------------------
                   EMPTY / PLACEHOLDER LINK
                ------------------------------------------------- */

                if (
                    !href ||
                    href === "#" ||
                    href.trim() === ""
                ) {

                    event.preventDefault();

                    handleLockedDeliverable(
                        link
                    );

                }

            }
        );

    });

}


/* =====================================================
   LOCKED DELIVERABLE
===================================================== */

function handleLockedDeliverable(
    element
) {

    const item =
        element.closest(
            ".deliverable-item"
        );


    if (
        item &&
        item.dataset.status === "available"
    ) {

        return;

    }


    showProductionNotification(
        "LOCKED",
        "هذا الملف غير متاح حاليًا."
    );

}


/* =====================================================
   DELIVERABLE STATUS
===================================================== */

function initDeliverableStatus() {

    const deliverables =
        document.querySelectorAll(
            ".deliverable-item"
        );


    if (!deliverables.length) {
        return;
    }


    deliverables.forEach(item => {

        const status =
            item.getAttribute(
                "data-status"
            );


        /* -------------------------------------------------
           REMOVE OLD STATES
        ------------------------------------------------- */

        item.classList.remove(
            "locked",
            "coming-soon",
            "available"
        );


        /* -------------------------------------------------
           APPLY CURRENT STATE
        ------------------------------------------------- */

        switch (status) {

            case "locked":

                item.classList.add(
                    "locked"
                );

                item.setAttribute(
                    "aria-disabled",
                    "true"
                );

                break;


            case "coming-soon":

                item.classList.add(
                    "coming-soon"
                );

                item.setAttribute(
                    "aria-disabled",
                    "true"
                );

                break;


            case "available":

                item.classList.add(
                    "available"
                );

                item.removeAttribute(
                    "aria-disabled"
                );

                break;


            default:

                break;

        }

    });

}


/* =====================================================
   DELIVERABLE INTERACTION
===================================================== */

document.addEventListener(
    "click",
    event => {

        const item =
            event.target.closest(
                ".deliverable-item"
            );


        if (!item) {
            return;
        }


        const status =
            item.getAttribute(
                "data-status"
            );


        if (
            status === "locked" ||
            status === "coming-soon"
        ) {

            event.preventDefault();


            const title =
                status === "coming-soon"
                    ? "COMING SOON"
                    : "LOCKED";


            const message =
                status === "coming-soon"
                    ? "هذا الملف سيكون متاحًا قريبًا."
                    : "هذا الملف غير متاح حاليًا.";


            showProductionNotification(
                title,
                message
            );

        }

    }
);


/* =====================================================
   PRODUCTION NOTIFICATION
===================================================== */

function showProductionNotification(
    title,
    message
) {

    let notification =
        document.querySelector(
            ".production-notification"
        );


    /* -------------------------------------------------
       CREATE NOTIFICATION
    ------------------------------------------------- */

    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.className =
            "production-notification";


        notification.innerHTML = `
            <div class="production-notification-inner">
                <span class="production-notification-title"></span>
                <span class="production-notification-message"></span>
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
            ".production-notification-title"
        );


    const messageElement =
        notification.querySelector(
            ".production-notification-message"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

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
   PRODUCTION SCROLL REVEAL
===================================================== */

function initProductionReveal() {

    const section =
        document.querySelector(
            "#productionSection"
        );

    if (!section) {
        return;
    }


    /* -------------------------------------------------
       REDUCED MOTION
    ------------------------------------------------- */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        section.classList.remove(
            "production-scroll-hidden"
        );

        section.classList.add(
            "production-visible"
        );

        return;
    }


    /* -------------------------------------------------
       OBSERVER
    ------------------------------------------------- */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }


                    section.classList.remove(
                        "production-scroll-hidden"
                    );

                    section.classList.add(
                        "production-visible"
                    );


                    observer.unobserve(
                        section
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    observer.observe(section);

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initProductionReveal
);


/* =====================================================
   PRODUCTION PAGE READY
===================================================== */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "production-ready"
        );

    }
);


/* =====================================================
   DEBUG
===================================================== */

console.log(
    "ON AIR — Production JS loaded successfully."
);
/* =========================================================
   ON AIR — COMING SOON FILES
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const comingSoonMessage =
        document.getElementById("oaComingSoon");

    if (!comingSoonMessage) return;


    const comingSoonItems =
        document.querySelectorAll(
            ".oa-file-row:not(.secret)"
        );


    comingSoonItems.forEach((item) => {

        const state =
            item.querySelector(".oa-file-state");

        if (!state) return;


        const text =
            state.getAttribute("data-ar");


        if (text !== "قريبًا") return;


        item.style.cursor = "pointer";


        item.addEventListener("click", (event) => {

            event.preventDefault();

            comingSoonMessage.classList.add("show");


            clearTimeout(
                item._comingSoonTimer
            );


            item._comingSoonTimer =
                setTimeout(() => {

                    comingSoonMessage.classList.remove(
                        "show"
                    );

                }, 3000);

        });

    });


    /* =========================
       PRODUCTION STATUS
    ========================= */

    const comingSoonStages =
        document.querySelectorAll(
            ".oa-status-row:not(.clickable)"
        );


    comingSoonStages.forEach((item) => {

        const state =
            item.querySelector(".oa-status-state");

        if (!state) return;


        const text =
            state.getAttribute("data-ar");


        if (text !== "قريبًا") return;


        item.style.cursor = "pointer";


        item.addEventListener("click", (event) => {

            event.preventDefault();

            comingSoonMessage.classList.add("show");


            clearTimeout(
                item._comingSoonTimer
            );


            item._comingSoonTimer =
                setTimeout(() => {

                    comingSoonMessage.classList.remove(
                        "show"
                    );

                }, 3000);

        });

    });

});