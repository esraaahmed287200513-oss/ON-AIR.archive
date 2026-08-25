/* =========================================================
   ON AIR — FINAL PERFORMANCE FIX
   ---------------------------------------------------------
   This file must load BEFORE archive.js
   and AFTER Supabase.
   ========================================================= */

(() => {
    "use strict";

    if (window.__ON_AIR_PERFORMANCE_FIXED__) return;

    window.__ON_AIR_PERFORMANCE_FIXED__ = true;


    /* =====================================================
       1. REPLACE THE INFINITE PARALLAX
       ===================================================== */

    window.initArchiveParallax = function () {

        const archive =
            document.querySelector(".archive-page");

        const background =
            document.querySelector(".archive-background");

        const grid =
            document.querySelector(".archive-grid");


        if (!archive) return;


        /*
         * No parallax on touch/mobile devices.
         * This removes unnecessary work completely.
         */

        const desktop =
            window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches;


        if (!desktop) {

            if (background) {
                background.style.transform =
                    "translate3d(0,0,0) scale(1)";
            }

            if (grid) {
                grid.style.transform =
                    "translate3d(0,0,0)";
            }

            return;
        }


        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let frame = null;


        function render() {

            frame = null;


            currentX +=
                (targetX - currentX) * 0.10;

            currentY +=
                (targetY - currentY) * 0.10;


            if (background) {

                background.style.transform =
                    `translate3d(
                        ${currentX * 8}px,
                        ${currentY * 8}px,
                        0
                    ) scale(1.025)`;

            }


            if (grid) {

                grid.style.transform =
                    `translate3d(
                        ${currentX * 3}px,
                        ${currentY * 3}px,
                        0
                    )`;

            }


            const moving =
                Math.abs(targetX - currentX) > 0.002 ||
                Math.abs(targetY - currentY) > 0.002;


            if (moving) {

                frame =
                    requestAnimationFrame(render);

            }

        }


        function requestRender() {

            if (frame) return;

            frame =
                requestAnimationFrame(render);

        }


        archive.addEventListener(
            "mousemove",
            event => {

                targetX =
                    (event.clientX /
                        window.innerWidth) - 0.5;

                targetY =
                    (event.clientY /
                        window.innerHeight) - 0.5;


                requestRender();

            },
            {
                passive: true
            }
        );


        archive.addEventListener(
            "mouseleave",
            () => {

                targetX = 0;
                targetY = 0;

                requestRender();

            },
            {
                passive: true
            }
        );

    };


    /* =====================================================
       2. DISABLE THE OLD CONTINUOUS SCROLL RAF
       ===================================================== */

    /*
     * archive.js has its own scroll-progress RAF.
     * We keep the progress bar visually functional,
     * but throttle calculations to one update/frame.
     */

    window.__ON_AIR_SCROLL_PATCH__ = true;


    /* =====================================================
       3. OPTIMIZE GLOBAL MOUSE CURSOR
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            const cursor =
                document.getElementById(
                    "customMicCursor"
                );


            if (!cursor) return;


            /*
             * The original site moves the cursor with
             * every mouse event.

             * We hide the original visual on mobile.
             */

            if (
                window.matchMedia(
                    "(hover: none)"
                ).matches
            ) {

                cursor.style.display =
                    "none";

                return;

            }


            let x = 0;
            let y = 0;

            let cursorFrame = null;


            document.addEventListener(
                "mousemove",
                event => {

                    x = event.clientX;
                    y = event.clientY;


                    if (cursorFrame) return;


                    cursorFrame =
                        requestAnimationFrame(
                            () => {

                                cursorFrame = null;


                                cursor.style.transform =
                                    `translate3d(
                                        ${x}px,
                                        ${y}px,
                                        0
                                    )`;

                            }
                        );

                },
                {
                    passive: true
                }
            );

        },
        {
            once: true
        }
    );


    /* =====================================================
       4. STOP CSS ANIMATIONS WHEN TAB IS HIDDEN
       ===================================================== */

    const visibilityStyle =
        document.createElement("style");


    visibilityStyle.textContent = `

        html.oa-hidden * {
            animation-play-state: paused !important;
        }

        @media (max-width: 768px) {

            .archive-background,
            .archive-grid {

                transform:
                    translate3d(0,0,0) !important;

                will-change: auto !important;

            }

        }

    `;


    document.head.appendChild(
        visibilityStyle
    );


    document.addEventListener(
        "visibilitychange",
        () => {

            document.documentElement.classList.toggle(
                "oa-hidden",
                document.hidden
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       5. IMAGE DECODING
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            document
                .querySelectorAll("img")
                .forEach(
                    (image, index) => {

                        image.decoding =
                            "async";


                        /*
                         * Don't lazy-load the first
                         * few images because they're
                         * part of the opening experience.
                         */

                        if (
                            index > 5 &&
                            !image.hasAttribute(
                                "loading"
                            )
                        ) {

                            image.loading =
                                "lazy";

                        }

                    }
                );

        },
        {
            once: true
        }
    );


    /* =====================================================
       6. VIDEO SAFETY
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            document
                .querySelectorAll("video")
                .forEach(
                    video => {

                        if (
                            !video.hasAttribute(
                                "preload"
                            )
                        ) {

                            video.preload =
                                "metadata";

                        }


                        if (
                            "IntersectionObserver"
                            in window
                        ) {

                            const observer =
                                new IntersectionObserver(
                                    entries => {

                                        entries.forEach(
                                            entry => {

                                                if (
                                                    !entry.isIntersecting &&
                                                    !video.paused
                                                ) {

                                                    video.pause();

                                                }

                                            }
                                        );

                                    },
                                    {
                                        rootMargin:
                                            "300px"
                                    }
                                );


                            observer.observe(
                                video
                            );

                        }

                    }
                );

        },
        {
            once: true
        }
    );


    /* =====================================================
       7. REDUCE EXPENSIVE BLUR ON SMALL SCREENS
       ===================================================== */

    const mobileStyle =
        document.createElement("style");


    mobileStyle.textContent = `

        @media (max-width: 768px) {

            .sticky-notes-wall,
            .sticky-wall,
            .archive-glass,
            .glass-card {

                -webkit-backdrop-filter:
                    none !important;

                backdrop-filter:
                    none !important;

            }

        }

        @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {

                animation-duration:
                    0.001ms !important;

                animation-iteration-count:
                    1 !important;

                transition-duration:
                    0.001ms !important;

                scroll-behavior:
                    auto !important;

            }

        }

    `;


    document.head.appendChild(
        mobileStyle
    );


    /* =====================================================
       READY
       ===================================================== */

    console.log(
        "ON AIR — Performance system active."
    );

})();