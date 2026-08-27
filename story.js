/* =========================================================
   ON AIR بِالعَافيَه — SCRIPT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LANGUAGE TOGGLE
    ===================================================== */

    const langButtons =
        document.querySelectorAll(".lang");

    langButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const lang =
                button.dataset.lang;

            langButtons.forEach((btn) => {

                const isActive =
                    btn === button;

                btn.classList.toggle(
                    "active",
                    isActive
                );

                btn.setAttribute(
                    "aria-pressed",
                    isActive
                        ? "true"
                        : "false"
                );

            });


            if (lang === "en") {

                document.documentElement.lang =
                    "en";

                document.documentElement.dir =
                    "ltr";

            } else {

                document.documentElement.lang =
                    "ar";

                document.documentElement.dir =
                    "rtl";
            }

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealItems =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealItems.forEach((item) => {

            revealObserver.observe(item);

        });

    } else {

        revealItems.forEach((item) => {

            item.classList.add(
                "is-visible"
            );

        });

    }


    /* =====================================================
       FINAL SCRIPT VIEWER
    ===================================================== */

    const viewer =
        document.getElementById(
            "scriptViewer"
        );

    const openButton =
        document.querySelector(
            "[data-open-script]"
        );

    const closeButton =
        document.querySelector(
            "[data-close-script]"
        );


    function openViewer() {

        if (!viewer) {
            return;
        }

        viewer.classList.add("open");

        viewer.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "viewer-open"
        );


        if (closeButton) {

            closeButton.focus();

        }

    }


    function closeViewer() {

        if (!viewer) {
            return;
        }

        viewer.classList.remove("open");

        viewer.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "viewer-open"
        );


        if (openButton) {

            openButton.focus();

        }

    }


    if (openButton) {

        openButton.addEventListener(
            "click",
            openViewer
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeViewer
        );

    }


    if (viewer) {

        viewer.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === viewer
                ) {

                    closeViewer();

                }

            }
        );

    }


    /* =====================================================
       ESC TO CLOSE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                viewer &&
                viewer.classList.contains("open")
            ) {

                closeViewer();

            }

        }
    );

});