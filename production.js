/* =====================================================
   ON AIR بالعافيةِ
   PRODUCTION + DELIVERABLES JAVASCRIPT
===================================================== */

"use strict";


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


    productionDays.forEach(
        day => {

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
                day.classList.contains(
                    "open"
                );


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

        }
    );

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


    /*
     * اقفل الأيام المفتوحة فقط.
     * مفيش داعي لتغيير الـ DOM لو الحالة
     * بالفعل false.
     */

    allDays.forEach(
        day => {

            if (
                day === selectedDay &&
                !isOpen
            ) {

                return;

            }


            if (
                !day.classList.contains(
                    "open"
                )
            ) {

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


                return;

            }


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

        }
    );


    /*
     * افتح اليوم المختار.
     */

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


    if (!deliverableLinks.length) {
        return;
    }


    deliverableLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    /*
                     * EMPTY / PLACEHOLDER LINK
                     */

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

        }
    );

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
        item.dataset.status ===
        "available"
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


    deliverables.forEach(
        item => {

            const status =
                item.getAttribute(
                    "data-status"
                );


            /*
             * REMOVE OLD STATES
             */

            item.classList.remove(
                "locked",
                "coming-soon",
                "available"
            );


            /*
             * APPLY CURRENT STATE
             */

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

        }
    );

}


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


    /*
     * CREATE ON FIRST USE ONLY
     */

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


    /*
     * CONTENT
     */

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


    /*
     * SHOW
     */

    notification.classList.remove(
        "is-visible"
    );


    requestAnimationFrame(
        () => {

            notification.classList.add(
                "is-visible"
            );

        }
    );


    /*
     * AUTO HIDE
     */

    clearTimeout(
        notification._hideTimer
    );


    notification._hideTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "is-visible"
                );

            },
            3200
        );

}


/* =====================================================
   DELIVERABLE INTERACTION
===================================================== */

function initDeliverableInteraction() {

    /*
     * Event delegation:
     * listener واحد بدل listener لكل item.
     */

    document.addEventListener(
        "click",
        handleDeliverableClick
    );

}


/* =====================================================
   DELIVERABLE CLICK HANDLER
===================================================== */

function handleDeliverableClick(
    event
) {

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
        status !== "locked" &&
        status !== "coming-soon"
    ) {

        return;

    }


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


    /*
     * REDUCED MOTION
     */

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


    /*
     * لو IntersectionObserver
     * غير متاح، نعرض القسم مباشرة.
     */

    if (
        !("IntersectionObserver" in window)
    ) {

        section.classList.remove(
            "production-scroll-hidden"
        );


        section.classList.add(
            "production-visible"
        );


        return;

    }


    /*
     * OBSERVER
     */

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


                        section.classList.remove(
                            "production-scroll-hidden"
                        );


                        section.classList.add(
                            "production-visible"
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
                    "0px 0px -40px 0px"
            }
        );


    observer.observe(
        section
    );

}


/* =====================================================
   COMING SOON FILES
===================================================== */

function initComingSoonFiles() {

    const comingSoonMessage =
        document.getElementById(
            "oaComingSoon"
        );


    if (!comingSoonMessage) {
        return;
    }


    /*
     * FILES
     */

    const comingSoonItems =
        document.querySelectorAll(
            ".oa-file-row:not(.secret)"
        );


    comingSoonItems.forEach(
        item => {

            const state =
                item.querySelector(
                    ".oa-file-state"
                );


            if (!state) {
                return;
            }


            const text =
                state.getAttribute(
                    "data-ar"
                );


            if (
                text !== "قريبًا"
            ) {

                return;

            }


            item.style.cursor =
                "pointer";


            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    showComingSoonMessage(
                        comingSoonMessage,
                        item
                    );

                }
            );

        }
    );


    /*
     * PRODUCTION STATUS
     */

    const comingSoonStages =
        document.querySelectorAll(
            ".oa-status-row:not(.clickable)"
        );


    comingSoonStages.forEach(
        item => {

            const state =
                item.querySelector(
                    ".oa-status-state"
                );


            if (!state) {
                return;
            }


            const text =
                state.getAttribute(
                    "data-ar"
                );


            if (
                text !== "قريبًا"
            ) {

                return;

            }


            item.style.cursor =
                "pointer";


            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    showComingSoonMessage(
                        comingSoonMessage,
                        item
                    );

                }
            );

        }
    );

}


/* =====================================================
   COMING SOON MESSAGE
===================================================== */

function showComingSoonMessage(
    messageElement,
    sourceElement
) {

    messageElement.classList.add(
        "show"
    );


    clearTimeout(
        sourceElement._comingSoonTimer
    );


    sourceElement._comingSoonTimer =
        setTimeout(
            () => {

                messageElement.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =====================================================
   PRODUCTION READY
===================================================== */

function initProductionReady() {

    window.addEventListener(
        "load",
        () => {

            document.body.classList.add(
                "production-ready"
            );

        },
        {
            once: true
        }
    );

}


/* =====================================================
   INITIALIZE PRODUCTION
===================================================== */

function initProduction() {

    initProductionJournal();

    initDeliverables();

    initDeliverableStatus();

    initDeliverableInteraction();

    initProductionReveal();

    initComingSoonFiles();

    initProductionReady();

}


/* =====================================================
   SINGLE DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initProduction,
    {
        once: true
    }
);