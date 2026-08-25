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

const DEFAULT_POSITIONS = [
    ["7%", "18%"],
    ["29%", "10%"],
    ["52%", "23%"],
    ["76%", "13%"],

    ["18%", "58%"],
    ["43%", "68%"],
    ["68%", "55%"],
    ["86%", "72%"]
];

const STORAGE_KEY =
    "onairStickyPositions";


/* =========================================================
   DOM
========================================================= */

const section =
    document.getElementById(
        "leaveMarkSection"
    );

const notesContainer =
    document.getElementById(
        "stickyNotesContainer"
    );

const emptyState =
    document.getElementById(
        "stickyWallEmpty"
    );

const formPanel =
    document.getElementById(
        "leaveNotePanel"
    );

const openButton =
    document.getElementById(
        "leaveNoteButton"
    );

const closeButton =
    document.getElementById(
        "closeNotePanel"
    );

const form =
    document.getElementById(
        "stickyNoteForm"
    );

const nameInput =
    document.getElementById(
        "stickyName"
    );

const messageInput =
    document.getElementById(
        "stickyMessage"
    );

const colorInput =
    document.getElementById(
        "stickyColor"
    );

const submitButton =
    document.getElementById(
        "stickySubmit"
    );

const statusElement =
    document.getElementById(
        "stickyFormStatus"
    );

const counter =
    document.getElementById(
        "stickyCounter"
    );

const honeypot =
    document.getElementById(
        "stickyWebsite"
    );


/* =========================================================
   STATE
========================================================= */

let savedPositions = {};

let languageObserver = null;

let sectionObserver = null;

let stickyChannel = null;


/* =========================================================
   LOAD SAVED POSITIONS ONCE
========================================================= */

function loadSavedPositions() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            savedPositions = {};

            return;

        }


        const parsed =
            JSON.parse(saved);


        if (
            parsed &&
            typeof parsed === "object"
        ) {

            savedPositions =
                parsed;

        } else {

            savedPositions = {};

        }

    } catch {

        savedPositions = {};

    }

}


/* =========================================================
   SAVE ALL POSITIONS
========================================================= */

function persistPositions() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                savedPositions
            )
        );

    } catch {

        /*
         * localStorage ممكن يكون مقفول
         * في بعض المتصفحات.
         */

    }

}


/* =========================================================
   STATUS
========================================================= */

function showStatus(
    message,
    type = ""
) {

    if (!statusElement) {
        return;
    }


    statusElement.textContent =
        message;


    statusElement.className =
        "sticky-form-status";


    if (type) {

        statusElement.classList.add(
            type
        );

    }

}


/* =========================================================
   COUNTER
========================================================= */

function updateCounter() {

    if (
        !messageInput ||
        !counter
    ) {

        return;

    }


    counter.textContent =
        `${messageInput.value.length}/${MAX_MESSAGE_LENGTH}`;

}


/* =========================================================
   LANGUAGE
========================================================= */

function getCurrentLanguage() {

    const lang =
        document.documentElement
            .getAttribute("lang") ||
        "ar";


    return lang
        .toLowerCase()
        .startsWith("en")
        ? "en"
        : "ar";

}


/* =========================================================
   UPDATE STICKY LANGUAGE
========================================================= */

function updateStickyLanguage() {

    const language =
        getCurrentLanguage();


    const elements =
        document.querySelectorAll(
            "#leaveMarkSection [data-ar][data-en]"
        );


    elements.forEach(
        element => {

            const value =
                element.dataset[
                    language
                ];


            if (
                value !== undefined
            ) {

                element.textContent =
                    value;

            }

        }
    );


    if (section) {

        section.dir =
            language === "ar"
                ? "rtl"
                : "ltr";

    }

}


/* =========================================================
   LANGUAGE OBSERVER
========================================================= */

function initLanguageObserver() {

    if (!document.documentElement) {
        return;
    }


    if (
        !("MutationObserver" in window)
    ) {

        return;

    }


    languageObserver =
        new MutationObserver(
            updateStickyLanguage
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

}


/* =========================================================
   SECTION REVEAL
   لا تظهر في أول فتح الموقع
========================================================= */

function initSectionReveal() {

    if (!section) {
        return;
    }


    section.classList.add(
        "sticky-section-hidden"
    );


    /*
     * Reduced motion
     */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        section.classList.add(
            "is-visible"
        );

        section.classList.remove(
            "sticky-section-hidden"
        );

        return;

    }


    /*
     * Fallback
     */

    if (
        !("IntersectionObserver" in window)
    ) {

        section.classList.add(
            "is-visible"
        );

        section.classList.remove(
            "sticky-section-hidden"
        );

        return;

    }


    sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        section.classList.add(
                            "is-visible"
                        );


                        sectionObserver.unobserve(
                            section
                        );

                    }
                );

            },
            {
                threshold: 0.08,

                rootMargin:
                    "0px 0px -80px 0px"
            }
        );


    sectionObserver.observe(
        section
    );

}


/* =========================================================
   FORM OPEN
========================================================= */

function openNotePanel() {

    if (!formPanel) {
        return;
    }


    formPanel.classList.add(
        "is-open"
    );


    formPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    window.setTimeout(
        () => {

            if (nameInput) {

                nameInput.focus();

            }

        },
        250
    );

}


/* =========================================================
   FORM CLOSE
========================================================= */

function closeNotePanel() {

    if (!formPanel) {
        return;
    }


    formPanel.classList.remove(
        "is-open"
    );


    formPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   FORM EVENTS
========================================================= */

function initFormEvents() {

    if (openButton) {

        openButton.addEventListener(
            "click",
            openNotePanel
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeNotePanel
        );

    }


    if (formPanel) {

        formPanel.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    formPanel
                ) {

                    closeNotePanel();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeNotePanel();

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =========================================================
   CREATE NOTE
========================================================= */

function createStickyNote(
    data,
    index
) {

    if (!notesContainer) {
        return null;
    }


    const note =
        document.createElement(
            "article"
        );


    const color =
        NOTE_COLORS.includes(
            data.color
        )
            ? data.color
            : "navy";


    note.className =
        `onair-sticky-note sticky-note-${color}`;


    note.dataset.id =
        data.id;


    /*
     * Position
     */

    const saved =
        savedPositions[
            data.id
        ];


    const defaultPosition =
        DEFAULT_POSITIONS[
            index %
            DEFAULT_POSITIONS.length
        ];


    const position =
        saved || {
            left:
                defaultPosition[0],

            top:
                defaultPosition[1]
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


    /*
     * Content
     */

    const pin =
        document.createElement(
            "div"
        );


    pin.className =
        "sticky-pin";


    const paper =
        document.createElement(
            "div"
        );


    paper.className =
        "sticky-paper-content";


    const message =
        document.createElement(
            "p"
        );


    message.textContent =
        data.message || "";


    paper.appendChild(
        message
    );


    const author =
        document.createElement(
            "div"
        );


    author.className =
        "sticky-author";


    author.textContent =
        `— ${data.name || ""}`;


    note.appendChild(
        pin
    );


    note.appendChild(
        paper
    );


    note.appendChild(
        author
    );


    /*
     * Initial state
     */

    note.style.opacity =
        "0";


    notesContainer.appendChild(
        note
    );


    /*
     * Reveal
     */

    requestAnimationFrame(
        () => {

            const delay =
                index * 80;


            window.setTimeout(
                () => {

                    note.classList.add(
                        "is-visible"
                    );

                },
                delay
            );

        }
    );


    /*
     * Drag
     */

    makeDraggable(
        note,
        data.id
    );


    return note;

}


/* =========================================================
   DRAG
   DESKTOP POINTER ONLY
========================================================= */

function makeDraggable(
    note,
    id
) {

    if (
        !note ||
        !notesContainer
    ) {

        return;

    }


    let dragging =
        false;


    let pointerId =
        null;


    let startX =
        0;


    let startY =
        0;


    let startLeft =
        0;


    let startTop =
        0;


    let containerWidth =
        0;


    let containerHeight =
        0;


    let noteWidth =
        0;


    let noteHeight =
        0;


    let pendingX =
        0;


    let pendingY =
        0;


    let dragFrame =
        null;


    /*
     * APPLY DRAG POSITION
     */

    function updateDragPosition() {

        dragFrame =
            null;


        if (!dragging) {
            return;
        }


        let left =
            startLeft +
            (
                pendingX -
                startX
            );


        let top =
            startTop +
            (
                pendingY -
                startY
            );


        const maxLeft =
            Math.max(
                0,
                containerWidth -
                noteWidth
            );


        const maxTop =
            Math.max(
                0,
                containerHeight -
                noteHeight
            );


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


        /*
         * DOM write فقط داخل RAF
         */

        if (containerWidth > 0) {

            note.style.left =
                `${(
                    left /
                    containerWidth
                ) * 100}%`;

        }


        if (containerHeight > 0) {

            note.style.top =
                `${(
                    top /
                    containerHeight
                ) * 100}%`;

        }

    }


    /*
     * POINTER DOWN
     */

    function handlePointerDown(
        event
    ) {

        /*
         * الموبايل لا يسحب النوتة.
         * ده مقصود عشان الـ scroll ما يعلقش.
         */

        if (
            event.pointerType ===
            "touch"
        ) {

            return;

        }


        if (
            event.button !== undefined &&
            event.button !== 0
        ) {

            return;

        }


        const containerRect =
            notesContainer
                .getBoundingClientRect();


        const noteRect =
            note.getBoundingClientRect();


        dragging =
            true;


        pointerId =
            event.pointerId;


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


        containerWidth =
            containerRect.width;


        containerHeight =
            containerRect.height;


        noteWidth =
            noteRect.width;


        noteHeight =
            noteRect.height;


        pendingX =
            event.clientX;


        pendingY =
            event.clientY;


        note.classList.add(
            "is-dragging"
        );


        try {

            note.setPointerCapture(
                event.pointerId
            );

        } catch {}


        event.preventDefault();

    }


    /*
     * POINTER MOVE
     */

    function handlePointerMove(
        event
    ) {

        if (
            !dragging ||
            event.pointerId !== pointerId
        ) {

            return;

        }


        pendingX =
            event.clientX;


        pendingY =
            event.clientY;


        /*
         * RAF يمنع عشرات/مئات
         * عمليات DOM في الثانية.
         */

        if (
            dragFrame === null
        ) {

            dragFrame =
                requestAnimationFrame(
                    updateDragPosition
                );

        }

    }


    /*
     * STOP DRAG
     */

    function stopDragging(
        event
    ) {

        if (
            !dragging ||
            event.pointerId !== pointerId
        ) {

            return;

        }


        /*
         * آخر position
         */

        pendingX =
            event.clientX;


        pendingY =
            event.clientY;


        if (
            dragFrame === null
        ) {

            dragFrame =
                requestAnimationFrame(
                    updateDragPosition
                );

        }


        dragging =
            false;


        note.classList.remove(
            "is-dragging"
        );


        try {

            note.releasePointerCapture(
                event.pointerId
            );

        } catch {}


        /*
         * حفظ آخر مكان
         */

        window.setTimeout(
            () => {

                savePosition(
                    note,
                    id
                );

            },
            0
        );


        pointerId =
            null;

    }


    /*
     * CANCEL
     */

    function cancelDragging(
        event
    ) {

        if (
            !dragging ||
            event.pointerId !== pointerId
        ) {

            return;

        }


        dragging =
            false;


        note.classList.remove(
            "is-dragging"
        );


        if (
            dragFrame !== null
        ) {

            cancelAnimationFrame(
                dragFrame
            );

            dragFrame =
                null;

        }


        try {

            note.releasePointerCapture(
                event.pointerId
            );

        } catch {}


        pointerId =
            null;

    }


    note.addEventListener(
        "pointerdown",
        handlePointerDown
    );


    note.addEventListener(
        "pointermove",
        handlePointerMove
    );


    note.addEventListener(
        "pointerup",
        stopDragging
    );


    note.addEventListener(
        "pointercancel",
        cancelDragging
    );

}


/* =========================================================
   SAVE POSITION
========================================================= */

function savePosition(
    note,
    id
) {

    if (
        !note ||
        !id
    ) {

        return;

    }


    savedPositions[id] = {

        left:
            note.style.left,

        top:
            note.style.top

    };


    persistPositions();

}


/* =========================================================
   RENDER
========================================================= */

function renderNotes(
    notes
) {

    if (!notesContainer) {
        return;
    }


    /*
     * Clear old notes
     */

    notesContainer.replaceChildren();


    /*
     * EMPTY
     */

    if (
        !notes ||
        !notes.length
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "is-hidden"
            );

        }


        return;

    }


    /*
     * HAS NOTES
     */

    if (emptyState) {

        emptyState.classList.add(
            "is-hidden"
        );

    }


    /*
     * Create notes
     */

    const fragment =
        document.createDocumentFragment();


    /*
     * createStickyNote يحتاج
     * notesContainer فعليًا للإضافة،
     * لذلك نستخدمه مباشرة.
     */

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

    if (!notesContainer) {
        return;
    }


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


        if (error) {
            throw error;
        }


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

async function submitStickyNote(
    event
) {

    event.preventDefault();


    /*
     * Honeypot
     */

    if (
        honeypot &&
        honeypot.value.trim() !== ""
    ) {

        return;

    }


    const name =
        nameInput?.value.trim() ||
        "";


    const message =
        messageInput?.value.trim() ||
        "";


    const color =
        colorInput?.value ||
        "navy";


    /*
     * NAME
     */

    if (!name) {

        showStatus(
            "اكتبي اسمك الأول.",
            "error"
        );


        nameInput?.focus();


        return;

    }


    /*
     * MESSAGE
     */

    if (!message) {

        showStatus(
            "اكتبي الرسالة اللي عايزة تسيبيها.",
            "error"
        );


        messageInput?.focus();


        return;

    }


    /*
     * NAME LENGTH
     */

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


    /*
     * MESSAGE LENGTH
     */

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


    /*
     * COLOR
     */

    if (
        !NOTE_COLORS.includes(
            color
        )
    ) {

        showStatus(
            "اختاري لون الرسالة.",
            "error"
        );


        return;

    }


    if (!submitButton) {
        return;
    }


    /*
     * LOCK SUBMIT
     */

    submitButton.disabled =
        true;


    submitButton.classList.add(
        "is-loading"
    );


    showStatus(
        "بنحفظ كلمتك في الأرشيف..."
    );


    try {

        const {
            error
        } =
            await stickySupabase
                .from("sticky_notes")
                .insert({
                    name:
                        name.slice(
                            0,
                            MAX_NAME_LENGTH
                        ),

                    message:
                        message.slice(
                            0,
                            MAX_MESSAGE_LENGTH
                        ),

                    color:
                        color,

                    approved:
                        false
                });


        if (error) {

            console.error(
                "SUPABASE INSERT ERROR:",
                error
            );


            throw error;

        }


        /*
         * RESET FORM
         */

        form?.reset();


        if (colorInput) {

            colorInput.value =
                "navy";

        }


        /*
         * RESET COLOR UI
         */

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


        /*
         * SUCCESS
         */

        showStatus(
            getCurrentLanguage() === "en"
                ? "Your message was received and is waiting for approval."
                : "وصلت رسالتك، وهتظهر بعد الموافقة عليها.",
            "success"
        );


        /*
         * CLOSE PANEL
         */

        window.setTimeout(
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

function initSubmit() {

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        submitStickyNote
    );

}


/* =========================================================
   COLOR PICKER
========================================================= */

function initColorPicker() {

    const buttons =
        document.querySelectorAll(
            ".sticky-color-option"
        );


    if (!buttons.length) {
        return;
    }


    buttons.forEach(
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


                    if (colorInput) {

                        colorInput.value =
                            color;

                    }


                    buttons.forEach(
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

}


/* =========================================================
   REALTIME
========================================================= */

function initRealtime() {

    stickyChannel =
        stickySupabase
            .channel(
                "approved-sticky-notes"
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "INSERT",

                    schema:
                        "public",

                    table:
                        "sticky_notes"
                },
                payload => {

                    if (
                        payload.new?.approved ===
                        true
                    ) {

                        loadStickyNotes();

                    }

                }
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "UPDATE",

                    schema:
                        "public",

                    table:
                        "sticky_notes"
                },
                payload => {

                    /*
                     * نعيد التحميل فقط لو حالة
                     * approval اتغيرت أو النوتة
                     * نفسها بقت approved.
                     */

                    if (
                        payload.new?.approved ===
                        true ||
                        payload.old?.approved ===
                        true
                    ) {

                        loadStickyNotes();

                    }

                }
            )
            .subscribe();

}


/* =========================================================
   INITIALIZATION
========================================================= */

function initStickyNotes() {

    /*
     * Positions
     */

    loadSavedPositions();


    /*
     * UI
     */

    updateCounter();

    updateStickyLanguage();


    /*
     * Section
     */

    initSectionReveal();


    /*
     * Language
     */

    initLanguageObserver();


    /*
     * Form
     */

    initFormEvents();

    initSubmit();

    initColorPicker();


    /*
     * Data
     */

    loadStickyNotes();


    /*
     * Realtime
     */

    initRealtime();

}


/* =========================================================
   SINGLE DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initStickyNotes,
    {
        once: true
    }
);