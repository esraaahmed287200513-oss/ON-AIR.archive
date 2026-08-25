/* =========================================================
   ON AIR — PERFORMANCE CORE
   Safe performance layer
   Does NOT change design / colors / layout / sticky notes
========================================================= */

"use strict";

(() => {

    /* =====================================================
       PREVENT DOUBLE INITIALIZATION
    ===================================================== */

    if (window.__ON_AIR_PERFORMANCE_CORE__) {
        return;
    }

    window.__ON_AIR_PERFORMANCE_CORE__ = true;


    /* =====================================================
       SHARED STATE
    ===================================================== */

    const state = {
        scrollFrame: null,
        cursorFrame: null,
        resizeFrame: null,
        visibility: !document.hidden
    };


    /* =====================================================
       DEVICE DETECTION
    ===================================================== */

    const isTouchDevice = window.matchMedia(
        "(hover: none), (pointer: coarse)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       REDUCED MOTION
       Respect OS accessibility preference
    ===================================================== */

    if (prefersReducedMotion) {

        document.documentElement.classList.add(
            "reduce-motion"
        );

    }


    /* =====================================================
       PAGE VISIBILITY
       Stop expensive visual work when tab is hidden
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            state.visibility = !document.hidden;

            document.documentElement.classList.toggle(
                "oa-page-hidden",
                document.hidden
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       IMAGE OPTIMIZATION
       No visual change
    ===================================================== */

    function optimizeImages() {

        const images = document.querySelectorAll("img");

        images.forEach((image, index) => {

            if (!image.hasAttribute("decoding")) {
                image.decoding = "async";
            }

            /*
             * Keep opening / first images eager.
             * Lazy-load only images further down.
             */

            if (
                index > 5 &&
                !image.hasAttribute("loading")
            ) {
                image.loading = "lazy";
            }

            /*
             * Preserve the site's existing image
             * loaded / error states.
             */

            if (image.complete) {

                image.classList.add(
                    "image-loaded"
                );

            } else {

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

        });

    }


    /* =====================================================
       VIDEO OPTIMIZATION
       Preserve visual behavior
    ===================================================== */

    function optimizeVideos() {

        const videos =
            document.querySelectorAll("video");

        if (!videos.length) {
            return;
        }

        if (
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        videos.forEach(video => {

            if (!video.hasAttribute("preload")) {
                video.preload = "metadata";
            }

            const observer =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(entry => {

                            if (!entry.isIntersecting) {

                                /*
                                 * Only pause videos that are
                                 * already playing.
                                 */

                                if (!video.paused) {
                                    video.pause();
                                }

                            }

                        });

                    },
                    {
                        rootMargin: "400px 0px"
                    }
                );

            observer.observe(video);

        });

    }


    /* =====================================================
       ARCHIVE PARALLAX SAFETY
       Does not replace archive.js parallax.
       It only prevents unnecessary work on touch devices.
    ===================================================== */

    function protectParallax() {

        if (isTouchDevice) {
            return;
        }

        const archive =
            document.querySelector(
                ".archive-page"
            );

        if (!archive) {
            return;
        }

        /*
         * Mark the archive as GPU-friendly.
         * No visual properties are changed.
         */

        const background =
            document.querySelector(
                ".archive-background"
            );

        const grid =
            document.querySelector(
                ".archive-grid"
            );

        if (background) {

            background.style.willChange =
                "transform";

        }

        if (grid) {

            grid.style.willChange =
                "transform";

        }

    }


    /* =====================================================
       CUSTOM CURSOR PERFORMANCE
       Only handles cursor if it exists.
       Does not change its CSS appearance.
    ===================================================== */

    function optimizeCursor() {

        if (isTouchDevice) {
            return;
        }

        const cursor =
            document.querySelector(
                "#customMicCursor"
            );

        if (!cursor) {
            return;
        }

        /*
         * We do NOT create another cursor system.
         *
         * archive.js already owns cursor behavior.
         * We only promote the existing element.
         */

        cursor.style.willChange =
            "transform";

        cursor.style.pointerEvents =
            "none";

    }


    /* =====================================================
       SCROLL PERFORMANCE
       Shared passive listener.
       Does not interfere with existing behavior.
    ===================================================== */

    function initScrollPerformance() {

        let lastScrollY =
            window.scrollY;

        window.addEventListener(
            "scroll",
            () => {

                lastScrollY =
                    window.scrollY;

                if (state.scrollFrame !== null) {
                    return;
                }

                state.scrollFrame =
                    requestAnimationFrame(() => {

                        state.scrollFrame =
                            null;

                        /*
                         * Intentionally lightweight.
                         *
                         * Do NOT force layout here.
                         * Do NOT query dozens of elements.
                         */

                        document.documentElement
                            .style.setProperty(
                                "--oa-scroll-y",
                                String(lastScrollY)
                            );

                    });

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       RESIZE PERFORMANCE
       Avoid repeated layout calculations
    ===================================================== */

    function initResizePerformance() {

        window.addEventListener(
            "resize",
            () => {

                if (state.resizeFrame !== null) {
                    return;
                }

                state.resizeFrame =
                    requestAnimationFrame(() => {

                        state.resizeFrame =
                            null;

                        document.documentElement
                            .classList.add(
                                "oa-resized"
                            );

                        /*
                         * Remove helper class after
                         * the resize frame settles.
                         */

                        requestAnimationFrame(() => {

                            document.documentElement
                                .classList.remove(
                                    "oa-resized"
                                );

                        });

                    });

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       INTERSECTION OBSERVER HELPERS
       Avoid unnecessary observers
    ===================================================== */

    function optimizeRevealElements() {

        if (
            prefersReducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const elements =
            document.querySelectorAll(
                ".archive-reveal"
            );

        if (!elements.length) {
            return;
        }

        /*
         * IMPORTANT:
         *
         * Do not add another reveal observer.
         *
         * archive.js already owns reveal animations.
         *
         * This function intentionally does nothing
         * beyond detecting whether the system exists.
         */

    }


    /* =====================================================
       STICKY NOTES PROTECTION
       IMPORTANT:
       We do NOT modify their design or behavior.
    ===================================================== */

    function protectStickyNotes() {

        const notes =
            document.querySelector(
                "#stickyNotesWall, .sticky-notes-wall, .sticky-notes"
            );

        if (!notes) {
            return;
        }

        /*
         * Promote the existing wall without
         * changing dimensions / colors / animation.
         */

        notes.style.contain =
            "layout style paint";

    }


    /* =====================================================
       EVENT DELEGATION SAFETY
       Prevent duplicate initialization flags
    ===================================================== */

    function markInitialized() {

        document.documentElement
            .setAttribute(
                "data-oa-performance",
                "ready"
            );

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function init() {

        if (
            document.documentElement
                .hasAttribute(
                    "data-oa-performance"
                )
        ) {
            return;
        }

        optimizeImages();

        optimizeVideos();

        protectParallax();

        optimizeCursor();

        initScrollPerformance();

        initResizePerformance();

        optimizeRevealElements();

        protectStickyNotes();

        markInitialized();

    }


    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }


    /* =====================================================
       CLEANUP
       Prevent stuck RAF callbacks
    ===================================================== */

    window.addEventListener(
        "pagehide",
        () => {

            if (
                state.scrollFrame !== null
            ) {

                cancelAnimationFrame(
                    state.scrollFrame
                );

                state.scrollFrame =
                    null;

            }

            if (
                state.cursorFrame !== null
            ) {

                cancelAnimationFrame(
                    state.cursorFrame
                );

                state.cursorFrame =
                    null;

            }

            if (
                state.resizeFrame !== null
            ) {

                cancelAnimationFrame(
                    state.resizeFrame
                );

                state.resizeFrame =
                    null;

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       DEBUG
    ===================================================== */

    window.__ON_AIR_PERFORMANCE_READY__ =
        true;

})();