/* =========================================================
   ON AIR — LEAVE YOUR MARK
   SUPABASE + APPROVAL + DRAGGABLE NOTES
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
    2.8,
    -1.1,
    3.5
];


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

const status =
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
   SECTION REVEAL
   السكشن يبدأ hidden
========================================================= */

if (section) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        section.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            section
                        );
                    }

                });

            },
            {
                threshold: .12
            }
        );

    observer.observe(section);
}


/* =========================================================
   LANGUAGE
========================================================= */

function getCurrentLanguage() {

    return (
        document.documentElement
            .getAttribute("lang") || "ar"
    ).toLowerCase()
        .startsWith("en")
        ? "en"
        : "ar";
}


function updateStickyLanguage() {

    const language =
        getCurrentLanguage();

    document
        .querySelectorAll(
            "[data-ar][data-en]"
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


/* watch language changes */

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

updateStickyLanguage();


/* =========================================================
   FORM OPEN / CLOSE
========================================================= */

function openNotePanel() {

    if (!formPanel) return;

    formPanel.classList.add(
        "is-open"
    );

    formPanel.setAttribute(
        "aria-hidden",
        "false"
    );

    setTimeout(() => {

        nameInput?.focus();

    }, 300);
}


function closeNotePanel() {

    if (!formPanel) return;

    formPanel.classList.remove(
        "is-open"
    );

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
            event.target ===
            formPanel
        ) {
            closeNotePanel();
        }

    }
);


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {
            closeNotePanel();
        }

    }
);


/* =========================================================
   COUNTER
========================================================= */

function updateCounter() {

    if (!messageInput || !counter)
        return;

    const length =
        messageInput.value.length;

    counter.textContent =
        `${length}/${MAX_MESSAGE_LENGTH}`;

}


messageInput?.addEventListener(
    "input",
    updateCounter
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
   POSITION STORAGE
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


function savePosition(
    note,
    id
) {

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

    const note =
        document.createElement("article");

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


    const saved =
        getSavedPositions();


    const defaultPositions = [

        ["4%", "12%"],
        ["27%", "7%"],
        ["51%", "18%"],
        ["76%", "10%"],
        ["13%", "53%"],
        ["38%", "62%"],
        ["64%", "50%"],
        ["84%", "62%"]

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


    note.style.setProperty(
        "--x",
        position.left
    );

    note.style.setProperty(
        "--y",
        position.top
    );

    note.style.setProperty(
        "--r",
        `${ROTATIONS[
            index %
            ROTATIONS.length
        ]}deg`
    );


    note.innerHTML = `

        <div class="sticky-pin">
        </div>

        <div class="sticky-paper-content">

            <p>
                ${escapeHTML(
                    data.message
                )}
            </p>

        </div>

        <div class="sticky-author">
            — ${escapeHTML(data.name)}
        </div>

    `;


    /* entrance */

    note.style.opacity = "0";

    note.style.transform =
        `
        translate3d(
            0,
            30px,
            0
        )
        rotate(
            ${ROTATIONS[
                index %
                ROTATIONS.length
            ]}deg
        )
        scale(.94)
        `;


    notesContainer.appendChild(
        note
    );


    requestAnimationFrame(() => {

        setTimeout(() => {

            note.style.transition =
                `
                opacity .8s ease,
                transform .9s
                cubic-bezier(
                    .16,
                    1,
                    .3,
                    1
                ),
                box-shadow .3s ease,
                filter .3s ease
                `;

            note.style.opacity = "1";

            note.style.transform =
                `
                translate3d(
                    0,
                    0,
                    0
                )
                rotate(
                    ${ROTATIONS[
                        index %
                        ROTATIONS.length
                    ]}deg
                )
                scale(1)
                `;

        }, index * 100);

    });


    makeDraggable(
        note,
        data.id
    );


    return note;
}


/* =========================================================
   DRAG
========================================================= */

function makeDraggable(
    note,
    id
) {

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;


    note.addEventListener(
        "pointerdown",
        event => {

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


            const leftPercent =
                (
                    left /
                    rect.width
                ) * 100;


            const topPercent =
                (
                    top /
                    rect.height
                ) * 100;


            note.style.left =
                `${leftPercent}%`;

            note.style.top =
                `${topPercent}%`;

        }
    );


    function stopDragging(
        event
    ) {

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

function renderNotes(
    notes
) {

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

    }

    catch (error) {

        console.error(
            "Sticky Notes:",
            error
        );

        notesContainer.innerHTML = "";

        emptyState?.classList.remove(
            "is-hidden"
        );

    }
}

async function submitStickyNote(event) {
    event.preventDefault();

    if (honeypot && honeypot.value.trim() !== "") {
        return;
    }

    const name = stickyName.value.trim();
    const message = stickyMessage.value.trim();
    const color = stickyColor.value;

    if (!name) {
        showStickyStatus("اكتب اسمك الأول.", "error");
        stickyName.focus();
        return;
    }

    if (!message) {
        showStickyStatus("اكتب الجملة اللي عايز تسيبها.", "error");
        stickyMessage.focus();
        return;
    }

    if (name.length > MAX_NAME_LENGTH) {
        showStickyStatus(
            `الاسم لازم يكون أقل من ${MAX_NAME_LENGTH} حرف.`,
            "error"
        );
        return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        showStickyStatus(
            `الجملة طويلة جدًا. الحد الأقصى ${MAX_MESSAGE_LENGTH} حرف.`,
            "error"
        );
        return;
    }

    if (!NOTE_COLORS.includes(color)) {
        showStickyStatus("اختار لون الملاحظة.", "error");
        return;
    }

    stickySubmit.disabled = true;
    stickySubmit.classList.add("is-loading");

    showStickyStatus("بنراجع كلمتك...");

    try {

        const { data, error } = await stickySupabase
            .from("sticky_notes")
            .insert({
                name: name.slice(0, MAX_NAME_LENGTH),
                message: message.slice(0, MAX_MESSAGE_LENGTH),
                color: color,
                approved: false
            })
            .select()
            .single();

        if (error) {
            console.error("SUPABASE INSERT ERROR:", error);
            throw error;
        }

        console.log("NOTE SAVED:", data);

        stickyForm.reset();

        stickyColor.value = "cream";

        updateCounter();

        showStickyStatus(
            "وصلت كلمتك ، هنراجعها قبل ما تظهر في الأرشيف.",
            "success"
        );

        setTimeout(() => {
            showStickyStatus("");
        }, 5000);

    } catch (error) {

        console.error("Sticky Note Error:", error);

        showStickyStatus(
            "حصلت مشكلة في حفظ الرسالة.",
            "error"
        );

    } finally {

        stickySubmit.disabled = false;
        stickySubmit.classList.remove("is-loading");
    }
}



/* =========================================================
   STATUS
========================================================= */

function showStatus(
    message,
    type = ""
) {

    if (!status)
        return;

    status.textContent =
        message;

    status.className =
        "sticky-form-status";

    if (type) {

        status.classList.add(
            type
        );

    }
}


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

            /*
                Reload because the new message
                might still be unapproved.
            */

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
        payload => {

            /*
                This is what makes a moderator
                approval appear automatically.
            */

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

        loadStickyNotes();

    }
);