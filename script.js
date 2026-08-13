let students =
    JSON.parse(localStorage.getItem("students")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];


// ===============================
// SAVE DATA
// ===============================

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// ===============================
// CURRENT DATE
// ===============================

function getToday() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function displayDate() {

    const date = new Date();

    document.getElementById("currentDate").innerText =
        date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
}


// ===============================
// 6 PM LOCK
// ===============================

function isAttendanceLocked() {

    return new Date().getHours() >= 18;
}


function updateLockMessage() {

    const message =
        document.getElementById("lockMessage");

    if (isAttendanceLocked()) {

        message.innerText =
            "🔒 Attendance updating is closed after 6:00 PM.";

    } else {

        message.innerText =
            "Attendance can be updated until 6:00 PM.";
    }
}


// ===============================
// ADD STUDENT
// ===============================

function addStudent() {

    const name =
        document.getElementById("studentName")
        .value.trim();

    const roll =
        document.getElementById("rollNumber")
        .value.trim();


    if (name === "" || roll === "") {

        alert(
            "Please enter student name and roll number."
        );

        return;
    }


    const alreadyExists =
        students.some(function(student) {

            return student.roll.toLowerCase()
                === roll.toLowerCase();

        });


    if (alreadyExists) {

        alert(
            "This roll number already exists."
        );

        return;
    }


    students.push({

        id: Date.now(),

        name: name,

        roll: roll

    });


    saveData();


    document.getElementById("studentName").value = "";

    document.getElementById("rollNumber").value = "";


    displayStudents();

    updateDashboard();


    alert(
        "Student added successfully!"
    );
}


// ===============================
// SELECTED SUBJECT
// ===============================

function getSelectedSubject() {

    return document.getElementById(
        "subjectSelect"
    ).value;
}


// ===============================
// MARK ATTENDANCE
// ===============================

function markAttendance(
    studentId,
    status
) {

    if (isAttendanceLocked()) {

        alert(
            "Attendance cannot be updated after 6:00 PM."
        );

        return;
    }


    const subject =
        getSelectedSubject();


    if (subject === "") {

        alert(
            "Please select a subject first."
        );

        return;
    }


    const date =
        getToday();


    const existingIndex =
        attendance.findIndex(function(record) {

            return (
                record.studentId === studentId &&
                record.subject === subject &&
                record.date === date
            );

        });


    if (existingIndex !== -1) {

        attendance[existingIndex].status =
            status;

    } else {

        attendance.push({

            studentId: studentId,

            subject: subject,

            date: date,

            status: status

        });
    }


    saveData();

    displayStudents();

    updateDashboard();
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {

    const list =
        document.getElementById("studentList");


    const search =
        document.getElementById("searchStudent")
        .value
        .toLowerCase()
        .trim();


    const filtered =
        students.filter(function(student) {

            return (
                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.roll
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (filtered.length === 0) {

        list.innerHTML = `
            <div class="empty">
                No students found.
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    const subject =
        getSelectedSubject();

    const today =
        getToday();


    filtered.forEach(function(student) {

        let todayStatus = "";


        if (subject !== "") {

            const record =
                attendance.find(function(item) {

                    return (
                        item.studentId === student.id &&
                        item.subject === subject &&
                        item.date === today
                    );

                });


            if (record) {

                todayStatus =
                    record.status;
            }
        }


        const row =
            document.createElement("div");

        row.className =
            "student-row";


        row.innerHTML = `

            <div class="student-top">

                <div class="student-info">

                    <h3>
                        👤 ${escapeHTML(student.name)}
                    </h3>

                    <p>
                        Roll No:
                        ${escapeHTML(student.roll)}
                    </p>

                    ${
                        subject
                        ?

                        `<p>
                            Subject:
                            ${escapeHTML(subject)}
                        </p>`

                        :

                        `<p>
                            Select a subject first.
                        </p>`
                    }

                </div>


                <div class="attendance-buttons">

                    <button
                        class="present-btn ${
                            todayStatus === "Present"
                            ? "active"
                            : ""
                        }"
                        onclick="markAttendance(
                            ${student.id},
                            'Present'
                        )"
                        ${
                            isAttendanceLocked()
                            ? "disabled"
                            : ""
                        }
                    >
                        ✓ Present
                    </button>


                    <button
                        class="absent-btn ${
                            todayStatus === "Absent"
                            ? "active"
                            : ""
                        }"
                        onclick="markAttendance(
                            ${student.id},
                            'Absent'
                        )"
                        ${
                            isAttendanceLocked()
                            ? "disabled"
                            : ""
                        }
                    >
                        ✕ Absent
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteStudent(
                            ${student.id}
                        )"
                    >
                        Delete
                    </button>

                </div>

            </div>


            <div class="attendance-details">

                ${getStudentAttendanceDetails(
                    student.id
                )}

            </div>
        `;


        list.appendChild(row);

    });
}


// ===============================
// STUDENT ATTENDANCE DETAILS
// ===============================

function getStudentAttendanceDetails(
    studentId
) {

    const records =
        attendance.filter(function(record) {

            return record.studentId === studentId;

        });


    if (records.length === 0) {

        return `
            <p>
                📊 No attendance recorded yet.
            </p>
        `;
    }


    let total = records.length;


    let present =
        records.filter(function(record) {

            return record.status === "Present";

        }).length;


    const overall =
        Math.round(
            (present / total) * 100
        );


    let html = `

        <p>
            <strong>Overall Attendance:</strong>

            <span class="${
                overall < 75
                ? "warning"
                : "good"
            }">

                ${overall}%

            </span>
        </p>
    `;


    const subjects = {};


    records.forEach(function(record) {

        if (!subjects[record.subject]) {

            subjects[record.subject] = {

                total: 0,

                present: 0

            };
        }


        subjects[record.subject].total++;


        if (record.status === "Present") {

            subjects[record.subject].present++;

        }

    });


    for (
        let subject in subjects
    ) {

        const subjectTotal =
            subjects[subject].total;

        const subjectPresent =
            subjects[subject].present;


        const percentage =
            Math.round(
                (
                    subjectPresent
                    /
                    subjectTotal
                ) * 100
            );


        html += `

            <div class="subject-line">

                <span>
                    ${escapeHTML(subject)}
                </span>

                <span class="${
                    percentage < 75
                    ? "warning"
                    : "good"
                }">

                    ${percentage}%

                    ${
                        percentage < 75
                        ? " ⚠️"
                        : ""
                    }

                </span>

            </div>

        `;

    }


    if (overall < 75) {

        html += `

            <p class="warning">
                ⚠️ Warning: Overall attendance is below 75%.
            </p>

        `;

    }


    return html;
}


// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(studentId) {

    const student =
        students.find(function(item) {

            return item.id === studentId;

        });


    if (!student) {
        return;
    }


    const confirmDelete =
        confirm(
            "Delete " +
            student.name +
            " and all attendance records?"
        );


    if (!confirmDelete) {
        return;
    }


    students =
        students.filter(function(item) {

            return item.id !== studentId;

        });


    attendance =
        attendance.filter(function(record) {

            return record.studentId !== studentId;

        });


    saveData();

    displayStudents();

    updateDashboard();
}


// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

    document.getElementById(
        "totalStudents"
    ).innerText =
        students.length;


    document.getElementById(
        "totalClasses"
    ).innerText =
        attendance.length;


    let totalPresent = 0;


    attendance.forEach(function(record) {

        if (record.status === "Present") {

            totalPresent++;

        }

    });


    let percentage = 0;


    if (attendance.length > 0) {

        percentage =
            Math.round(
                (
                    totalPresent
                    /
                    attendance.length
                ) * 100
            );
    }


    document.getElementById(
        "overallAttendance"
    ).innerText =
        percentage + "%";
}


// ===============================
// SECURITY
// ===============================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ===============================
// SUBJECT CHANGE
// ===============================

document.getElementById(
    "subjectSelect"
).addEventListener(
    "change",
    function() {

        displayStudents();

    }
);


// ===============================
// INITIAL LOAD
// ===============================

displayDate();

updateLockMessage();

displayStudents();

updateDashboard();


// Check every minute

setInterval(function() {

    updateLockMessage();

    displayStudents();

}, 60000);
