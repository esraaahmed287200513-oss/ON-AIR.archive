/* =====================================================
   ON AIR — MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   PAGE LOADER
===================================================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.classList.add("hidden");

        document.body.classList.add("page-loaded");

    }, 1800);

});


/* =====================================================
   LANGUAGE SWITCHER
===================================================== */

const languageButtons =
    document.querySelectorAll(".language button");

function translateTeamSection(language) {

    const teamSection =
        document.querySelector("#teamCrewArchive");

    if (!teamSection) return;

    const translatableElements =
        teamSection.querySelectorAll(
            "[data-ar][data-en]"
        );

    translatableElements.forEach(element => {

        const translatedText =
            element.dataset[language];

        if (translatedText !== undefined) {
            element.textContent = translatedText;
        }

    });

}


languageButtons.forEach(button => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const selectedLanguage =
            button.dataset.lang;


        /* ACTIVE BUTTON */

        languageButtons.forEach(btn => {

            btn.classList.remove("active");

            btn.setAttribute(
                "aria-pressed",
                "false"
            );

        });


        button.classList.add("active");

        button.setAttribute(
            "aria-pressed",
            "true"
        );


        /* PAGE LANGUAGE */

        if (selectedLanguage === "ar") {

            document.documentElement.lang = "ar";
            document.documentElement.dir = "rtl";

        } else {

            document.documentElement.lang = "en";
            document.documentElement.dir = "ltr";

        }


        /* TEAM / CREW TRANSLATION */

        translateTeamSection(
            selectedLanguage
        );

    });

});

/* =====================================================
   INITIAL TEAM LANGUAGE
===================================================== */

const initialLanguage =
    document.documentElement.lang === "en"
        ? "en"
        : "ar";

translateTeamSection(
    initialLanguage
);




/* =====================================================
   CINEMATIC BACKGROUND MOVEMENT
===================================================== */

const hero =
    document.querySelector(".hero");

const background =
    document.querySelector(".hero-background");

if (hero && background) {

    hero.addEventListener("mousemove", (event) => {

        if (
            window.matchMedia("(hover: none)").matches
        ) {
            return;
        }

        const x =
            (event.clientX / window.innerWidth) - 0.5;

        const y =
            (event.clientY / window.innerHeight) - 0.5;

        background.style.transform =
            `translate(${x * 8}px, ${y * 8}px) scale(1.02)`;

    });

    hero.addEventListener("mouseleave", () => {

        background.style.transform =
            "translate(0, 0) scale(1)";

    });

}


/* =====================================================
   RESET BACKGROUND ON MOBILE
===================================================== */

window.addEventListener("resize", () => {

    if (
        window.innerWidth <= 700 &&
        background
    ) {

        background.style.transform =
            "translate(0, 0) scale(1)";

    }

});


/* =====================================================
   CAMERA TRANSITION
   CLICK ANYWHERE → CAMERA FLASH → SOUND → ARCHIVE
===================================================== */

let transitionStarted = false;


/* -----------------------------------------------------
   CREATE CAMERA SOUND USING WEB AUDIO
----------------------------------------------------- */

function playCameraSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        const audioContext =
            new AudioContext();


        /* =========================
           FOCUS BEEP
        ========================== */

        const focusOsc =
            audioContext.createOscillator();

        const focusGain =
            audioContext.createGain();

        focusOsc.type = "sine";

        focusOsc.frequency.setValueAtTime(
            1100,
            audioContext.currentTime
        );

        focusGain.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );

        focusGain.gain.exponentialRampToValueAtTime(
            0.12,
            audioContext.currentTime + 0.015
        );

        focusGain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.08
        );

        focusOsc.connect(focusGain);

        focusGain.connect(audioContext.destination);

        focusOsc.start();

        focusOsc.stop(
            audioContext.currentTime + 0.09
        );


        /* =========================
           CAMERA SHUTTER
        ========================== */

        setTimeout(() => {

            const duration = 0.16;

            const bufferSize =
                audioContext.sampleRate * duration;

            const buffer =
                audioContext.createBuffer(
                    1,
                    bufferSize,
                    audioContext.sampleRate
                );

            const data =
                buffer.getChannelData(0);


            for (let i = 0; i < bufferSize; i++) {

                const envelope =
                    Math.pow(
                        1 - i / bufferSize,
                        3
                    );

                data[i] =
                    (Math.random() * 2 - 1) *
                    envelope;

            }


            const noise =
                audioContext.createBufferSource();

            noise.buffer = buffer;


            const filter =
                audioContext.createBiquadFilter();

            filter.type = "lowpass";

            filter.frequency.value = 2500;


            const gain =
                audioContext.createGain();

            gain.gain.setValueAtTime(
                0.65,
                audioContext.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + duration
            );


            noise.connect(filter);

            filter.connect(gain);

            gain.connect(
                audioContext.destination
            );

            noise.start();

        }, 100);

    } catch (error) {

        console.log(
            "Camera sound unavailable."
        );

    }

}


/* -----------------------------------------------------
   CREATE CAMERA FLASH
----------------------------------------------------- */

function createCameraFlash() {

    const flash =
        document.createElement("div");

    flash.className =
        "camera-flash";


    flash.innerHTML = `
        <div class="camera-focus-frame"></div>

        <div class="camera-flash-text">
            FRAME CAPTURED
        </div>
    `;


    document.body.appendChild(flash);


    requestAnimationFrame(() => {

        flash.classList.add("active");

    });


    setTimeout(() => {

        flash.classList.add("fade");

    }, 180);


    setTimeout(() => {

        flash.remove();

    }, 700);

}


/* -----------------------------------------------------
   CAMERA SHAKE
----------------------------------------------------- */

function cameraShake() {

    document.body.classList.add(
        "camera-shake"
    );

    setTimeout(() => {

        document.body.classList.remove(
            "camera-shake"
        );

    }, 180);

}


/* -----------------------------------------------------
   GO TO ARCHIVE
----------------------------------------------------- */

function enterArchive() {

    if (transitionStarted) return;

    transitionStarted = true;


    /* CAMERA SOUND */

    playCameraSound();


    /* CAMERA FLASH */

    createCameraFlash();


    /* CAMERA MOVEMENT */

    cameraShake();


    /* WAIT FOR THE SHOT */

    setTimeout(() => {

        document.body.classList.add(
            "page-transition-out"
        );

    }, 280);


    /* OPEN ARCHIVE */

    setTimeout(() => {

        window.location.href =
            "archive.html";

    }, 650);

}



/* =====================================================
   ENTER BUTTON
   ===================================================== */

const enterButton =
    document.getElementById("enterExperience");

if (enterButton) {

    enterButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            enterArchive();

        }
    );

}
