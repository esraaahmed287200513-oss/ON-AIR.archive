/* =========================================================
   ON AIR — LEAVE YOUR MARK
   SUPABASE + APPROVAL + DRAGGABLE NOTES
========================================================= */

"use strict";

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://tthojxggagdfywhfzttf.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_dkq5F1nnGa3kWFFZVijueA_tUYoQdTq";

const stickySupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   CONFIG
========================================================= */

const MAX_MESSAGE_LENGTH = 180;
const MAX_NAME_LENGTH = 40;

const NOTE_COLORS = [
    "navy",
    "cream",
    "beige",
    "dark"
];

const ROTATIONS = [
    -3.2,
    2.4,
    -1.8,
    3.1,
    -2.1,
    1.4,
    -3.8,
    2.8
];


/* =========================================================
   DOM
========================================================= */

const section =
    document.getElementById("leaveMarkSection");

const notesContainer =
    document.getElementById("stickyNotesContainer");

const emptyState =
    document.getElementById("stickyWallEmpty");

const formPanel =
    document.getElementById("leaveNotePanel");

const openButton =
    document.getElementById("leaveNoteButton");

const closeButton =
    document.getElementById("closeNotePanel");

const form =
    document.getElementById("stickyNoteForm");

const nameInput =
    document.getElementById("stickyName");

const messageInput =
    document.getElementById("stickyMessage");

const colorInput =
    document.getElementById("stickyColor");

const submitButton =
    document.getElementById("stickySubmit");

const statusElement =
    document.getElementById("stickyFormStatus");

const counter =
    document.getElementById("stickyCounter");

const honeypot =
    document.getElementById("stickyWebsite");


/* =========================================================
   STATUS
========================================================= */

function showStatus(message, type = "") {

    if (!statusElement) return;

    statusElement.textContent = message;

    statusElement.className =
        "sticky-form-status";

    if (type) {
        statusElement.classList.add(type);
    }
}


/* =========================================================
   COUNTER
========================================================= */

function updateCounter() {

    if (!messageInput || !counter) return;

    counter.textContent =
        `${messageInput.value.length}/${MAX_MESSAGE_LENGTH}`;
}


/* =========================================================
   LANGUAGE
========================================================= */

function getCurrentLanguage() {

    const lang =
        document.documentElement
            .getAttribute("lang") || "ar";

    return lang.toLowerCase().startsWith("en")
        ? "en"
        : "ar";
}


function updateStickyLanguage() {

    const language =
        getCurrentLanguage();

    document
        .querySelectorAll(
            "#leaveMarkSection [data-ar][data-en]"
        )
        .forEach(element => {

            element.textContent =
                element.dataset[language];

        });

    if (section) {

        section.dir =
            language === "ar"
                ? "rtl"
                : "ltr";
    }
}


const languageObserver =
    new MutationObserver(
        updateStickyLanguage
    );

languageObserver.observe(
    document.documentElement,
    {
        attributes: true,
        attributeFilter: ["lang"]
    }
);


/* =========================================================
   SECTION REVEAL
   لا تظهر في أول فتح الموقع
========================================================= */

if (section) {

    section.classList.add(
        "sticky-section-hidden"
    );

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    section.classList.add(
                        "is-visible"
                    );

                    sectionObserver.unobserve(
                        section
                    );

                });

            },
            {
                threshold: 0.08,
                rootMargin:
                    "0px 0px -80px 0px"
            }
        );

    sectionObserver.observe(section);
}


/* =========================================================
   FORM OPEN
========================================================= */

function openNotePanel() {

    if (!formPanel) return;

    formPanel.classList.add("is-open");

    formPanel.setAttribute(
        "aria-hidden",
        "false"
    );

    setTimeout(() => {
        nameInput?.focus();
    }, 250);
}


/* =========================================================
   FORM CLOSE
========================================================= */

function closeNotePanel() {

    if (!formPanel) return;

    formPanel.classList.remove("is-open");

    formPanel.setAttribute(
        "aria-hidden",
        "true"
    );
}


openButton?.addEventListener(
    "click",
    openNotePanel
);

closeButton?.addEventListener(
    "click",
    closeNotePanel
);


formPanel?.addEventListener(
    "click",
    event => {

        if (
            event.target === formPanel
        ) {
            closeNotePanel();
        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeNotePanel();
        }

    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================================
   POSITIONS
========================================================= */

function getSavedPositions() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "onairStickyPositions"
            ) || "{}"
        );

    } catch {

        return {};

    }
}


function savePosition(note, id) {

    const saved =
        getSavedPositions();

    saved[id] = {

        left:
            note.style.left,

        top:
            note.style.top

    };

    localStorage.setItem(
        "onairStickyPositions",
        JSON.stringify(saved)
    );
}


/* =========================================================
   CREATE NOTE
========================================================= */

function createStickyNote(
    data,
    index
) {

    if (!notesContainer)
        return null;

    const note =
        document.createElement("article");

    const color =
        NOTE_COLORS.includes(data.color)
            ? data.color
            : "navy";

    note.className =
        `onair-sticky-note sticky-note-${color}`;

    note.dataset.id =
        data.id;

    const saved =
        getSavedPositions();

    const defaultPositions = [

        ["7%", "18%"],
        ["29%", "10%"],
        ["52%", "23%"],
        ["76%", "13%"],

        ["18%", "58%"],
        ["43%", "68%"],
        ["68%", "55%"],
        ["86%", "72%"]

    ];

    const position =
        saved[data.id]
            ? saved[data.id]
            : {

                left:
                    defaultPositions[
                        index %
                        defaultPositions.length
                    ][0],

                top:
                    defaultPositions[
                        index %
                        defaultPositions.length
                    ][1]

            };


    note.style.left =
        position.left;

    note.style.top =
        position.top;

    note.style.setProperty(
        "--r",
        `${ROTATIONS[
            index % ROTATIONS.length
        ]}deg`
    );


    note.innerHTML = `

        <div class="sticky-pin"></div>

        <div class="sticky-paper-content">

            <p>
                ${escapeHTML(data.message)}
            </p>

        </div>

        <div class="sticky-author">

            — ${escapeHTML(data.name)}

        </div>

    `;


    note.style.opacity = "0";


    notesContainer.appendChild(note);


    requestAnimationFrame(() => {

        setTimeout(() => {

            note.classList.add(
                "is-visible"
            );

        }, index * 80);

    });


    makeDraggable(
        note,
        data.id
    );

    return note;
}


/* =========================================================
   DRAG — DESKTOP MOUSE
========================================================= */

function makeDraggable(note, id) {

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;


    note.addEventListener(
        "pointerdown",
        event => {

            /*
             * الموبايل لا يسحب النوتة.
             * ده مقصود عشان الـ scroll ما يعلقش.
             */

            if (
                event.pointerType === "touch"
            ) {
                return;
            }


            if (
                event.button !== undefined &&
                event.button !== 0
            ) {
                return;
            }


            dragging = true;

            note.classList.add(
                "is-dragging"
            );

            note.setPointerCapture(
                event.pointerId
            );


            const containerRect =
                notesContainer
                    .getBoundingClientRect();

            const noteRect =
                note.getBoundingClientRect();


            startX =
                event.clientX;

            startY =
                event.clientY;


            startLeft =
                noteRect.left -
                containerRect.left;

            startTop =
                noteRect.top -
                containerRect.top;


            event.preventDefault();

        }
    );


    note.addEventListener(
        "pointermove",
        event => {

            if (!dragging)
                return;


            const rect =
                notesContainer
                    .getBoundingClientRect();


            let left =
                startLeft +
                (
                    event.clientX -
                    startX
                );


            let top =
                startTop +
                (
                    event.clientY -
                    startY
                );


            const maxLeft =
                rect.width -
                note.offsetWidth;

            const maxTop =
                rect.height -
                note.offsetHeight;


            left =
                Math.max(
                    0,
                    Math.min(
                        left,
                        maxLeft
                    )
                );


            top =
                Math.max(
                    0,
                    Math.min(
                        top,
                        maxTop
                    )
                );


            note.style.left =
                `${(left / rect.width) * 100}%`;

            note.style.top =
                `${(top / rect.height) * 100}%`;

        }
    );


    function stopDragging(event) {

        if (!dragging)
            return;

        dragging = false;

        note.classList.remove(
            "is-dragging"
        );


        try {

            note.releasePointerCapture(
                event.pointerId
            );

        } catch {}


        savePosition(
            note,
            id
        );

    }


    note.addEventListener(
        "pointerup",
        stopDragging
    );

    note.addEventListener(
        "pointercancel",
        stopDragging
    );
}


/* =========================================================
   RENDER
========================================================= */

function renderNotes(notes) {

    if (!notesContainer)
        return;


    notesContainer.innerHTML = "";


    if (
        !notes ||
        !notes.length
    ) {

        emptyState?.classList.remove(
            "is-hidden"
        );

        return;
    }


    emptyState?.classList.add(
        "is-hidden"
    );


    notes.forEach(
        (note, index) => {

            createStickyNote(
                note,
                index
            );

        }
    );
}


/* =========================================================
   LOAD APPROVED NOTES ONLY
========================================================= */

async function loadStickyNotes() {

    if (!notesContainer)
        return;


    try {

        const {
            data,
            error
        } =
            await stickySupabase
                .from("sticky_notes")
                .select(
                    "id,name,message,color,created_at"
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
                .limit(60);


        if (error)
            throw error;


        renderNotes(
            data || []
        );


    } catch (error) {

        console.error(
            "SUPABASE LOAD ERROR:",
            error
        );

        renderNotes([]);

    }
}


/* =========================================================
   SUBMIT
   الرسالة تدخل Supabase كـ approved:false
========================================================= */

async function submitStickyNote(event) {

    event.preventDefault();


    if (
        honeypot &&
        honeypot.value.trim() !== ""
    ) {
        return;
    }


    const name =
        nameInput?.value.trim() || "";

    const message =
        messageInput?.value.trim() || "";

    const color =
        colorInput?.value || "navy";


    if (!name) {

        showStatus(
            "اكتبي اسمك الأول.",
            "error"
        );

        nameInput?.focus();

        return;
    }


    if (!message) {

        showStatus(
            "اكتبي الرسالة اللي عايزة تسيبيها.",
            "error"
        );

        messageInput?.focus();

        return;
    }


    if (
        name.length >
        MAX_NAME_LENGTH
    ) {

        showStatus(
            `الاسم لازم يكون أقل من ${MAX_NAME_LENGTH} حرف.`,
            "error"
        );

        return;
    }


    if (
        message.length >
        MAX_MESSAGE_LENGTH
    ) {

        showStatus(
            `الرسالة طويلة جدًا. الحد الأقصى ${MAX_MESSAGE_LENGTH} حرف.`,
            "error"
        );

        return;
    }


    if (
        !NOTE_COLORS.includes(color)
    ) {

        showStatus(
            "اختاري لون الرسالة.",
            "error"
        );

        return;
    }


    if (!submitButton)
        return;


    submitButton.disabled =
        true;

    submitButton.classList.add(
        "is-loading"
    );


    showStatus(
        "بنحفظ كلمتك في الأرشيف..."
    );


    try {

        const { error } = await stickySupabase
    .from("sticky_notes")
    .insert({
        name: name.slice(0, MAX_NAME_LENGTH),
        message: message.slice(0, MAX_MESSAGE_LENGTH),
        color: color,
        approved: false
    });

     if (error) {
         console.error(
             "SUPABASE INSERT ERROR:",
             error
         );

       throw error;
     }


      console.log(
    "NOTE WAITING FOR APPROVAL"
);    
   

        form?.reset();


        if (colorInput) {
            colorInput.value =
                "navy";
        }


        document
            .querySelectorAll(
                ".sticky-color-option"
            )
            .forEach(
                button => {

                    button.classList.toggle(
                        "is-selected",
                        button.dataset.color ===
                        "navy"
                    );

                }
            );


        updateCounter();


        showStatus(
            getCurrentLanguage() === "en"
                ? "Your message was received and is waiting for approval."
                : "وصلت رسالتك، وهتظهر بعد الموافقة عليها.",
            "success"
        );


        setTimeout(
            closeNotePanel,
            1800
        );


    } catch (error) {

        console.error(
            "STICKY NOTE ERROR:",
            error
        );


        showStatus(
            getCurrentLanguage() === "en"
                ? "We couldn't save your message. Check the database policy."
                : "الرسالة ما اتحفظتش. راجعي إعدادات Supabase.",
            "error"
        );


    } finally {

        submitButton.disabled =
            false;

        submitButton.classList.remove(
            "is-loading"
        );

    }
}


/* =========================================================
   FORM SUBMIT
========================================================= */

form?.addEventListener(
    "submit",
    submitStickyNote
);


/* =========================================================
   COLOR PICKER
========================================================= */

document
    .querySelectorAll(
        ".sticky-color-option"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const color =
                        button.dataset.color;


                    if (
                        !NOTE_COLORS.includes(
                            color
                        )
                    ) {
                        return;
                    }


                    colorInput.value =
                        color;


                    document
                        .querySelectorAll(
                            ".sticky-color-option"
                        )
                        .forEach(
                            item => {

                                item.classList.toggle(
                                    "is-selected",
                                    item === button
                                );

                            }
                        );

                }
            );

        }
    );


/* =========================================================
   REALTIME
========================================================= */

stickySupabase
    .channel(
        "approved-sticky-notes"
    )
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "sticky_notes"
        },
        payload => {

            if (
                payload.new?.approved === true
            ) {

                loadStickyNotes();

            }

        }
    )
    .on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "sticky_notes"
        },
        () => {

            loadStickyNotes();

        }
    )
    .subscribe();


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCounter();

        updateStickyLanguage();

        loadStickyNotes();

    }
);