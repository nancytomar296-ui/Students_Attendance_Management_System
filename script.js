let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


// ============================
// SAVE DATA
// ============================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// ============================
// TODAY DATE
// ============================

function getToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ============================
// ADD STUDENT
// ============================

function addStudent() {

    const rollInput =
        document.getElementById(
            "studentRoll"
        );

    const nameInput =
        document.getElementById(
            "studentName"
        );


    const roll =
        rollInput.value.trim();

    const name =
        nameInput.value.trim();


    if (roll === "") {

        alert(
            "Please enter roll number."
        );

        return;

    }


    if (name === "") {

        alert(
            "Please enter student name."
        );

        return;

    }


    // SAME ROLL NUMBER CHECK

    const exists =
        students.some(
            function(student) {

                return String(
                    student.roll
                ).toLowerCase()
                ===
                roll.toLowerCase();

            }
        );


    if (exists) {

        alert(
            "This roll number already exists."
        );

        return;

    }


    // SAME NAME IS ALLOWED

    students.push({

        roll: roll,

        name: name,

        attendance: {}

    });


    saveStudents();


    rollInput.value = "";

    nameInput.value = "";


    displayStudents();


    alert(
        "Student added successfully."
    );

}


// ============================
// DISPLAY STUDENTS
// ============================

function displayStudents(
    list = students
) {

    const container =
        document.getElementById(
            "studentList"
        );


    container.innerHTML = "";


    document.getElementById(
        "studentCount"
    ).innerText =
        list.length +
        (
            list.length === 1
                ? " Student"
                : " Students"
        );


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div>👨‍🎓</div>

                <p>
                    No students found
                </p>

            </div>

        `;

        updateDashboard();

        return;

    }


    list.forEach(
        function(student) {

            const index =
                students.indexOf(
                    student
                );


            let present = 0;

            let absent = 0;


            for (
                let date in student.attendance
            ) {

                if (
                    student.attendance[date]
                    === "Present"
                ) {

                    present++;

                }


                if (
                    student.attendance[date]
                    === "Absent"
                ) {

                    absent++;

                }

            }


            const total =
                present + absent;


            const percentage =
                total > 0
                    ? Math.round(
                        present /
                        total *
                        100
                    )
                    : 0;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "student";


            div.innerHTML = `

                <h3>
                    ${escapeHTML(
                        student.name
                    )}
                </h3>

                <p>
                    Roll Number:
                    <strong>
                        ${escapeHTML(
                            student.roll
                        )}
                    </strong>
                </p>

                <p>
                    Present:
                    ${present}
                    &nbsp; | &nbsp;
                    Absent:
                    ${absent}
                </p>

                <p>
                    Attendance:
                    <strong>
                        ${percentage}%
                    </strong>
                </p>


                <button
                    class="present-btn"
                    onclick="
                        markAttendance(
                            ${index},
                            'Present'
                        )
                    "
                >
                    ✅ Present
                </button>


                <button
                    class="absent-btn"
                    onclick="
                        markAttendance(
                            ${index},
                            'Absent'
                        )
                    "
                >
                    ❌ Absent
                </button>


                <button
                    class="report-btn"
                    onclick="
                        showReport(${index})
                    "
                >
                    📊 View Report
                </button>


                <button
                    class="delete-btn"
                    onclick="
                        deleteStudent(${index})
                    "
                >
                    🗑️ Delete
                </button>

            `;


            container.appendChild(
                div
            );

        }
    );


    updateDashboard();

    checkTime();

}


// ============================
// MARK ATTENDANCE
// ============================

function markAttendance(
    index,
    status
) {

    const today =
        getToday();


    const dateInput =
        document.getElementById(
            "attendanceDate"
        );


    // ONLY TODAY

    if (
        dateInput.value !== today
    ) {

        dateInput.value =
            today;


        alert(
            "Only today's attendance can be marked."
        );

        return;

    }


    // 6 PM LOCK

    const hour =
        new Date().getHours();


    if (hour >= 18) {

        alert(
            "Attendance is closed after 6:00 PM."
        );

        return;

    }


    students[index]
        .attendance[today] =
        status;


    saveStudents();


    displayStudents();

}


// ============================
// DELETE
// ============================

function deleteStudent(index) {

    const confirmDelete =
        confirm(
            "Do you want to delete this student?"
        );


    if (!confirmDelete) {

        return;

    }


    students.splice(
        index,
        1
    );


    saveStudents();


    displayStudents();

}


// ============================
// SEARCH
// ============================

function searchStudent() {

    const text =
        document.getElementById(
            "searchStudent"
        )
        .value
        .toLowerCase()
        .trim();


    const result =
        students.filter(
            function(student) {

                return (

                    student.name
                        .toLowerCase()
                        .includes(text)

                    ||

                    String(
                        student.roll
                    )
                    .toLowerCase()
                    .includes(text)

                );

            }
        );


    displayStudents(result);

}


// ============================
// DASHBOARD
// ============================

function updateDashboard() {

    let present = 0;

    let absent = 0;


    students.forEach(
        function(student) {

            for (
                let date in student.attendance
            ) {

                if (
                    student.attendance[date]
                    === "Present"
                ) {

                    present++;

                }


                if (
                    student.attendance[date]
                    === "Absent"
                ) {

                    absent++;

                }

            }

        }
    );


    document.getElementById(
        "totalStudents"
    ).innerText =
        students.length;


    document.getElementById(
        "totalPresent"
    ).innerText =
        present;


    document.getElementById(
        "totalAbsent"
    ).innerText =
        absent;

}
let totalPercentage = 0;
let studentsWithAttendance = 0;

students.forEach(function(student) {

    let presentDays = 0;
    let totalDays = 0;

    for (let date in student.attendance) {

        totalDays++;

        if (
            student.attendance[date]
            === "Present"
        ) {
            presentDays++;
        }

    }

    if (totalDays > 0) {

        totalPercentage +=
            (presentDays / totalDays) * 100;

        studentsWithAttendance++;

    }

});


let classAverage = 0;

if (studentsWithAttendance > 0) {

    classAverage =
        Math.round(
            totalPercentage /
            studentsWithAttendance
        );

}


document.getElementById(
    "classAverage"
).innerText =
    classAverage + "%";

// ============================
// DATE SETUP
// ============================

function setupDate() {

    const input =
        document.getElementById(
            "attendanceDate"
        );


    const today =
        getToday();


    input.value =
        today;


    input.min =
        today;


    input.max =
        today;


    document.getElementById(
        "todayText"
    ).innerText =
        formatDate(today);


    input.addEventListener(
        "change",
        function() {

            if (
                input.value !==
                getToday()
            ) {

                input.value =
                    getToday();


                alert(
                    "Only today's date is allowed."
                );

            }

        }
    );

}


// ============================
// TIME CHECK
// ============================

function checkTime() {

    const hour =
        new Date().getHours();


    const locked =
        hour >= 18;


    const buttons =
        document.querySelectorAll(
            ".present-btn, .absent-btn"
        );


    buttons.forEach(
        function(button) {

            button.disabled =
                locked;

        }
    );


    const status =
        document.getElementById(
            "attendanceStatus"
        );


    if (locked) {

        status.innerText =
            "🔒 Attendance closed after 6:00 PM.";

        status.style.background =
            "#fee2e2";

        status.style.color =
            "#991b1b";

    }
    else {

        status.innerText =
            "✅ Attendance is open until 6:00 PM.";

        status.style.background =
            "#e8f7ee";

        status.style.color =
            "#16803c";

    }

}


// ============================
// REPORT
// ============================

function showReport(index) {

    const student =
        students[index];


    let present = 0;

    let absent = 0;

    let history = "";


    const dates =
        Object.keys(
            student.attendance
        );


    dates.sort();


    dates.forEach(
        function(date) {

            const status =
                student.attendance[date];


            if (
                status === "Present"
            ) {

                present++;

            }


            if (
                status === "Absent"
            ) {

                absent++;

            }


            history += `

                <div class="history-item">

                    <span>
                        📅
                        ${formatDate(date)}
                    </span>

                    <strong>
                        ${status}
                    </strong>

                </div>

            `;

        }
    );


    const total =
        present + absent;


    const percentage =
        total > 0
            ? Math.round(
                present /
                total *
                100
            )
            : 0;
            let attendanceMessage = "";

if (total > 0 && percentage < 75) {

    attendanceMessage = `
        <div class="report-stat">
            ⚠️ <strong>Low Attendance Warning</strong>
            <br>
            Attendance is below 75%.
        </div>
    `;

}
else if (total > 0) {

    attendanceMessage = `
        <div class="report-stat">
            ✅ <strong>Attendance is Good</strong>
            <br>
            Attendance is 75% or above.
        </div>
    `;

}


    if (history === "") {

        history =
            "<p>No attendance history yet.</p>";

    }


    document.getElementById(
        "reportContent"
    ).innerHTML = `

        <div class="report-stat">

            <strong>
                Student Name
            </strong>

            <br>

            ${escapeHTML(
                student.name
            )}

        </div>


        <div class="report-stat">

            <strong>
                Roll Number
            </strong>

            <br>

            ${escapeHTML(
                student.roll
            )}

        </div>


        <div class="report-stat">

            <strong>
                Total Days
            </strong>

            <br>

            ${total}

        </div>


        <div class="report-stat">

            <strong>
                Present
            </strong>

            <br>

            ${present}

        </div>


        <div class="report-stat">

            <strong>
                Absent
            </strong>

            <br>

            ${absent}

        </div>


        <div class="report-stat">

            <strong>
                Attendance Percentage
            </strong>

            <br>

            ${percentage}%

        </div>

${attendanceMessage}
        <h3>
            Attendance History
        </h3>


        ${history}

    `;


    document.getElementById(
        "reportSection"
    )
    .classList.remove(
        "hidden"
    );

}


// ============================
// CLOSE REPORT
// ============================

function closeReport() {

    document.getElementById(
        "reportSection"
    )
    .classList.add(
        "hidden"
    );

}


// ============================
// DARK MODE
// ============================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        dark
    );


    document.getElementById(
        "darkModeBtn"
    ).innerText =
        dark
            ? "☀️"
            : "🌙";

}


// ============================
// LOAD DARK MODE
// ============================

function loadDarkMode() {

    if (
        localStorage.getItem(
            "darkMode"
        ) === "true"
    ) {

        document.body.classList.add(
            "dark"
        );


        document.getElementById(
            "darkModeBtn"
        ).innerText =
            "☀️";

    }

}


// ============================
// FORMAT DATE
// ============================

function formatDate(date) {

    const parts =
        date.split("-");


    if (
        parts.length !== 3
    ) {

        return date;

    }


    return (
        parts[2] +
        "-" +
        parts[1] +
        "-" +
        parts[0]
    );

}


// ============================
// SAFE TEXT
// ============================

function escapeHTML(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================
// START SYSTEM
// ============================

setupDate();

loadDarkMode();

displayStudents();

checkTime();


// Check every minute

setInterval(
    function() {

        checkTime();


        const input =
            document.getElementById(
                "attendanceDate"
            );


        if (input) {

            input.value =
                getToday();

        }

    },
    60000
);