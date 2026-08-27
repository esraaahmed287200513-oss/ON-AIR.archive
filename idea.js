/* =========================================================
   ON AIR بِالعَافيَه
   IDEA PAGE
   LIGHTWEIGHT CINEMATIC MOTION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const background =
        document.querySelector(".idea-bg");

    if (!background) return;


    /* =====================================================
       VERY SUBTLE CAMERA MOVEMENT
    ====================================================== */

    let ticking = false;

    function moveBackground() {

        const scrollY = window.scrollY;

        background.style.transform =
            `scale(1.025) translateY(${scrollY * 0.012}px)`;

        ticking = false;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    moveBackground
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       INITIAL POSITION
    ====================================================== */

    background.style.transform =
        "scale(1.025) translateY(0)";
});