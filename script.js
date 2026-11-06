Let defaultStudents = [
    { id: “STU001”, name: “Rahul Sharma”, subject: “Web Development”, status: “Present” },
    { id: “STU002”, name: “Amit Verma”, subject: “Java Programming”, status: “Absent” },
    { id: “STU003”, name: “Priya Rai”, subject: “Data Structures”, status: “Present” },
    { id: “STU004”, name: “Neha Tomar”, subject: “Web Development”, status: “Present” }
];

Let students = JSON.parse(localStorage.getItem(‘studentAttendanceData’)) || defaultStudents;

If (!localStorage.getItem(‘studentAttendanceData’)) {
    localStorage.setItem(‘studentAttendanceData’, JSON.stringify(students));
}

displayDate();
updateLockMessage();
displayStudents(); 
updateDashboard();

// Check every minute
setInterval(function() {
    updateLockMessage();
    displayStudents();
}, 60000);

Let students =
    JSON.parse(localStorage.getItem(“students”)) || [];

Let attendance =
    JSON.parse(localStorage.getItem(“attendance”)) || [];


// ===============================
// SAVE DATA
// ===============================

Function saveData() {

    localStorage.setItem(
        “students”,
        JSON.stringify(students)
    );

    localStorage.setItem(
        “attendance”,
        JSON.stringify(attendance)
    );
}


// ===============================
// CURRENT DATE
// ===============================

Function getToday() {

    Const now = new Date();

    Const year =
        Now.getFullYear();

    Const month =
        String(now.getMonth() + 1).padStart(2, “0”);

    Const day =
        String(now.getDate()).padStart(2, “0”);

    Return `${year}-${month}-${day}`;
}


Function displayDate() {

    Const date = new Date();

    Document.getElementById(“currentDate”).innerText =
        Date.toLocaleDateString(“en-IN”, {
            Day: “2-digit”,
            Month: “long”,
            Year: “numeric”
        });
}


// ===============================
// 6 PM LOCK
// ===============================

Function isAttendanceLocked() {

    Return new Date().getHours() >= 18;
}


Function updateLockMessage() {

    Const message =
        Document.getElementById(“lockMessage”);

    If (isAttendanceLocked()) {

        Message.innerText =
            “🔒 Attendance updating is closed after 6:00 PM.”;

    } else {

        Message.innerText =
            “Attendance can be updated until 6:00 PM.”;
    }
}


// ===============================
// ADD STUDENT
// ===============================

Function addStudent() {

    Const name =
        Document.getElementById(“studentName”)
        .value.trim();

    Const roll =
        Document.getElementById(“rollNumber”)
        .value.trim();


    If (name === “” || roll === “”) {

        Alert(
            “Please enter student name and roll number.”
        );

        Return;
    }


    Const alreadyExists =
        Students.some(function(student) {

            Return student.roll.toLowerCase()
                === roll.toLowerCase();

        });


    If (alreadyExists) {

        Alert(
            “This roll number already exists.”
        );

        Return;
    }


    Students.push({

        Id: Date.now(),

        Name: name,

        Roll: roll

    });


    saveData();


    document.getElementById(“studentName”).value = “”;

    document.getElementById(“rollNumber”).value = “”;


    displayStudents();

    updateDashboard();


    alert(
        “Student added successfully!”
    );
}


// ===============================
// SELECTED SUBJECT
// ===============================

Function getSelectedSubject() {

    Return document.getElementById(
        “subjectSelect”
    ).value;
}


// ===============================
// MARK ATTENDANCE
// ===============================

Function markAttendance(
    studentId,
    status
) {

    If (isAttendanceLocked()) {

        Alert(
            “Attendance cannot be updated after 6:00 PM.”
        );

        Return;
    }


    Const subject =
        getSelectedSubject();


    if (subject === “”) {

        alert(
            “Please select a subject first.”
        );

        Return;
    }


    Const date =
        getToday();


    const existingIndex =
        attendance.findIndex(function(record) {

            return (
                record.studentId === studentId &&
                record.subject === subject &&
                record.date === date
            );

        });


    If (existingIndex !== -1) {

        Attendance[existingIndex].status =
            Status;

    } else {

        Attendance.push({

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

Function displayStudents() {

    Const list =
        Document.getElementById(“studentList”);


    Const search =
        Document.getElementById(“searchStudent”)
        .value
        .toLowerCase()
        .trim();


    Const filtered =
        Students.filter(function(student) {

            Return (
                Student.name
                    .toLowerCase()
                    .includes(search)



                Student.roll
                    .toLowerCase()
                    .includes(search)
            );

        });


    If (filtered.length === 0) {

        List.innerHTML = `
            <div class=”empty”>
                No students found.
            </div>
        `;

        Return;
    }


    List.innerHTML = “”;


    Const subject =
        getSelectedSubject();

    const today =
        getToday();


    filtered.forEach(function(student) {

        let todayStatus = “”;


        if (subject !== “”) {

            const record =
                attendance.find(function(item) {

                    return (
                        item.studentId === student.id &&
                        item.subject === subject &&
                        item.date === today
                    );

                });


            If (record) {

                todayStatus =
                    record.status;
            }
        }


        Const row =
            Document.createElement(“div”);

        Row.className =
            “student-row”;


        Row.innerHTML = `

            <div class=”student-top”>

                <div class=”student-info”>

                    <h3>
                        👤 ${escapeHTML(student.name)}
                    </h3>

                    <p>
                        Roll No:
                        ${escapeHTML(student.roll)}
                    </p>

                    ${
                        Subject
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


                <div class=”attendance-buttons”>

                    <button
                        Class=”present-btn ${
                            todayStatus === “Present”
                            ? “active”
                            : “”
                        }”
                        Onclick=”markAttendance(
                            ${student.id},
                            ‘Present’
                        )”
                        ${
                            isAttendanceLocked()
                            ? “disabled”
                            : “”
                        }
                    >
                        ✓ Present
                    </button>


                    <button
                        Class=”absent-btn ${
                            todayStatus === “Absent”
                            ? “active”
                            : “”
                        }”
                        Onclick=”markAttendance(
                            ${student.id},
                            ‘Absent’
                        )”
                        ${
                            isAttendanceLocked()
                            ? “disabled”
                            : “”
                        }
                    >
                        ✕ Absent
                    </button>


                    <button
                        Class=”delete-btn”
                        Onclick=”deleteStudent(
                            ${student.id}
                        )”
                    >
                        Delete
                    </button>

                </div>

            </div>


            <div class=”attendance-details”>

                ${getStudentAttendanceDetails(
                    Student.id
                )}

            </div>
        `;


        List.appendChild(row);

    });
}


// ===============================
// STUDENT ATTENDANCE DETAILS
// ===============================

Function getStudentAttendanceDetails(
    studentId
) {

    Const records =
        Attendance.filter(function(record) {

            Return record.studentId === studentId;

        });


    If (records.length === 0) {

        Return `
            <p>
                📊 No attendance recorded yet.
            </p>
        `;
    }


    Let total = records.length;


    Let present =
        Records.filter(function(record) {

            Return record.status === “Present”;

        }).length;


    Const overall =
        Math.round(
            (present / total) * 100
        );


    Let html = `

        <p>
            <strong>Overall Attendance:</strong>

            <span class=”${
                Overall < 75
                ? “warning”
                : “good”
            }”>

                ${overall}%

            </span>
        </p>
    `;


    Const subjects = {};


    Records.forEach(function(record) {

        If (!subjects[record.subject]) {

            Subjects[record.subject] = {

                Total: 0,

                Present: 0

            };
        }


        Subjects[record.subject].total++;


        If (record.status === “Present”) {

            Subjects[record.subject].present++;

        }

    });


    For (
        Let subject in subjects
    ) {

        Const subjectTotal =
            Subjects[subject].total;

        Const subjectPresent =
            Subjects[subject].present;


        Const percentage =
            Math.round(
                (
                    subjectPresent
                    /
                    subjectTotal
                ) * 100
            );


        Html += `

            <div class=”subject-line”>

                <span>
                    ${escapeHTML(subject)}
                </span>

                <span class=”${
                    Percentage < 75
                    ? “warning”
                    : “good”
                }”>

                    ${percentage}%

                    ${
                        Percentage < 75
                        ? “ ⚠️”
                        : “”
                    }

                </span>

            </div>

        `;

    }


    If (overall < 75) {

        Html += `

            <p class=”warning”>
                ⚠️ Warning: Overall attendance is below 75%.
            </p>

        `;

    }


    Return html;
}


// ===============================
// DELETE STUDENT
// ===============================

Function deleteStudent(studentId) {

    Const student =
        Students.find(function(item) {

            Return item.id === studentId;

        });


    If (!student) {
        Return;
    }


    Const confirmDelete =
        Confirm(
            “Delete “ +
            Student.name +
            “ and all attendance records?”
        );


    If (!confirmDelete) {
        Return;
    }


    Students =
        Students.filter(function(item) {

            Return item.id !== studentId;

        });


    Attendance =
        Attendance.filter(function(record) {

            Return record.studentId !== studentId;

        });


    saveData();

    displayStudents();

    updateDashboard();
}


// ===============================
// DASHBOARD
// ===============================

Function updateDashboard() {

    Document.getElementById(
        “totalStudents”
    ).innerText =
        Students.length;


    Document.getElementById(
        “totalClasses”
    ).innerText =
        Attendance.length;


    Let totalPresent = 0;


    Attendance.forEach(function(record) {

        If (record.status === “Present”) {

            totalPresent++;

        }

    });


    Let percentage = 0;


    If (attendance.length > 0) {

        Percentage =
            Math.round(
                (
                    totalPresent
                    /
                    Attendance.length
                ) * 100
            );
    }


    Document.getElementById(
        “overallAttendance”
    ).innerText =
        Percentage + “%”;
}


// ===============================
// SECURITY
// ===============================

Function escapeHTML(value) {

    Return String(value)

        .replace(/&/g, “&amp;”)

        .replace(/</g, “&lt;”)

        .replace(/>/g, “&gt;”)

        .replace(/”/g, “&quot;”)

        .replace(/’/g, “&#039;”);
}


// ===============================
// SUBJECT CHANGE
// ===============================

Document.getElementById(
    “subjectSelect”
).addEventListener(
    “change”,
    Function() {

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


     
