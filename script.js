// =====================================================
// 1. DATA & STATE INITIALIZATION (सबसे ऊपर)
// =====================================================

// मॉक डेटा का सही स्ट्रक्चर (ताकि App के roll और id फ़ील्ड्स मैच करें)
const defaultStudents = [
    { id: 1001, name: "Rahul Sharma", roll: "BCA-001" },
    { id: 1002, name: "Amit Verma", roll: "BCA-002" },
    { id: 1003, name: "Priya Rai", roll: "BCA-003" },
    { id: 1004, name: "Neha Tomar", roll: "BCA-004" }
];

// लोकल स्टोरेज से डेटा निकालें
let students = JSON.parse(localStorage.getItem("students"));

// बुलेटप्रूफ फिक्स: अगर लोकल स्टोरेज में डेटा बिल्कुल नहीं है या खाली '[]' है
if (!students || students.length === 0) {
    students = defaultStudents; // जबरदस्ती मॉक डेटा डालें
    localStorage.setItem("students", JSON.stringify(students)); // मेमोरी में सेव करें
}

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

// =====================================================
// 2. SAVE DATA TO LOCAL STORAGE
// =====================================================
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// =====================================================
// 3. CURRENT DATE LOGIC
// =====================================================
function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function displayDate() {
    const date = new Date();
    const element = document.getElementById("currentDate");
    if (element) {
        element.innerText = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }
}

// =====================================================
// 4. 6 PM LOCK LOGIC
// =====================================================
function isAttendanceLocked() {
    return new Date().getHours() >= 18;
}

function updateLockMessage() {
    const message = document.getElementById("lockMessage");
    if (message) {
        if (isAttendanceLocked()) {
            message.innerText = "🔒 Attendance updating is closed after 6:00 PM.";
        } else {
            message.innerText = "Attendance can be updated until 6:00 PM.";
        }
    }
}

// =====================================================
// 5. ADD NEW STUDENT
// =====================================================
function addStudent() {
    const nameInput = document.getElementById("studentName");
    const rollInput = document.getElementById("rollNumber");

    if (!nameInput || !rollInput) return;

    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();

    if (name === "" || roll === "") {
        alert("Please enter student name and roll number.");
        return;
    }

    const alreadyExists = students.some(function(student) {
        return student.roll && student.roll.toLowerCase() === roll.toLowerCase();
    });

    if (alreadyExists) {
        alert("This roll number already exists.");
        return;
    }

    students.push({
        id: Date.now(),
        name: name,
        roll: roll
    });

    saveData();

    nameInput.value = "";
    rollInput.value = "";

    displayStudents();
    updateDashboard();

    alert("Student added successfully!");
}

// =====================================================
// 6. SELECTED SUBJECT
// =====================================================
function getSelectedSubject() {
    const element = document.getElementById("subjectSelect");
    return element ? element.value : "";
}

// =====================================================
// 7. MARK ATTENDANCE (PRESENT / ABSENT)
// =====================================================
function markAttendance(studentId, status) {
    if (isAttendanceLocked()) {
        alert("Attendance cannot be updated after 6:00 PM.");
        return;
    }

    const subject = getSelectedSubject();

    if (subject === "") {
        alert("Please select a subject first.");
        return;
    }

    const date = getToday();

    const existingIndex = attendance.findIndex(function(record) {
        return (
            record.studentId === studentId &&
            record.subject === subject &&
            record.date === date
        );
    });

    if (existingIndex !== -1) {
        attendance[existingIndex].status = status;
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

// =====================================================
// 8. DISPLAY STUDENTS LIST
// =====================================================
function displayStudents() {
    const list = document.getElementById("studentList");
    if (!list) return;

    const searchInput = document.getElementById("searchStudent");
    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = students.filter(function(student) {
        const studentName = student.name ? student.name.toLowerCase() : "";
        const studentRoll = student.roll ? student.roll.toLowerCase() : "";
        return studentName.includes(search) || studentRoll.includes(search);
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty" style="text-align:center; padding: 20px; color: #7f8798;">
                No students found.
            </div>
        `;
        return;
    }

    list.innerHTML = "";
    const subject = getSelectedSubject();
    const today = getToday();

    filtered.forEach(function(student) {
        let todayStatus = "";

        if (subject !== "") {
            const record = attendance.find(function(item) {
                return (
                    item.studentId === student.id &&
                    item.subject === subject &&
                    item.date === today
                );
            });

            if (record) {
                todayStatus = record.status;
            }
        }

        const row = document.createElement("div");
        row.className = "student-row";

        // सुरक्षित रेंडरिंग के लिए roll डिफ़ॉल्ट सेट किया गया है
        const displayRoll = student.roll ? student.roll : "N/A";

        row.innerHTML = `
            <div class="student-top" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <div class="student-info">
                    <h3 style="margin: 0; font-size: 16px;">👤 ${escapeHTML(student.name)}</h3>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #7f8798;">Roll No: ${escapeHTML(displayRoll)}</p>
                    ${subject ? `<p style="margin: 4px 0 0; font-size: 12px; color: #8b5cf6;">Subject: ${escapeHTML(subject)}</p>` : `<p style="margin: 4px 0 0; font-size: 12px; color: #7f8798;">Select a subject first.</p>`}
                </div>
                <div class="attendance-buttons" style="display: flex; gap: 8px;">
                    <button class="present-btn ${todayStatus === 'Present' ? 'active' : ''}"
                        onclick="markAttendance(${student.id}, 'Present')"
                        ${isAttendanceLocked() ? 'disabled' : ''}>
                        ✓ Present
                    </button>
                    <button class="absent-btn ${todayStatus === 'Absent' ? 'active' : ''}"
                        onclick="markAttendance(${student.id}, 'Absent')"
                        ${isAttendanceLocked() ? 'disabled' : ''}>
                        ✕ Absent
                    </button>
                    <button class="delete-btn" onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </div>
            </div>
            <div class="attendance-details" style="padding: 10px 15px; background: rgba(0,0,0,0.01);">
                ${getStudentAttendanceDetails(student.id)}
            </div>
        `;
        list.appendChild(row);
    });
}

// =====================================================
// 9. GET STUDENT ATTENDANCE DETAILS (75% Check)
// =====================================================
function getStudentAttendanceDetails(studentId) {
    const records = attendance.filter(function(record) {
        return record.studentId === studentId;
    });

    if (records.length === 0) {
        return `<p style="margin: 0; font-size: 12px; color: #7f8798;">📊 No attendance recorded yet.</p>`;
    }

    let total = records.length;
    let present = records.filter(function(record) {
        return record.status === "Present";
    }).length;

    const overall = Math.round((present / total) * 100);

    let html = `
        <p style="margin: 0 0 8px; font-size: 13px;">
            <strong>Overall Attendance:</strong>
            <span class="${overall < 75 ? 'warning' : 'good'}" style="font-weight: bold; color: ${overall < 75 ? '#ef4444' : '#10b981'};">${overall}%</span>
        </p>
    `;

    const subjects = {};
    records.forEach(function(record) {
        if (!subjects[record.subject]) {
            subjects[record.subject] = { total: 0, present: 0 };
        }
        subjects[record.subject].total++;
        if (record.status === "Present") {
            subjects[record.subject].present++;
        }
    });

    for (let subject in subjects) {
        const subjectTotal = subjects[subject].total;
        const subjectPresent = subjects[subject].present;
        const percentage = Math.round((subjectPresent / subjectTotal) * 100);

        html += `
            <div class="subject-line" style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span>${escapeHTML(subject)}</span>
                <span style="color: ${percentage < 75 ? '#ef4444' : '#10b981'}; font-weight: bold;">
                    ${percentage}% ${percentage < 75 ? ' ⚠️' : ''}
                </span>
            </div>
        `;
    }

    if (overall < 75) {
        html += `<p class="warning" style="margin: 4px 0 0; font-size: 12px; color: #ef4444;">⚠️ Warning: Overall attendance is below 75%.</p>`;
    }

    return html;
}

// =====================================================
// 10. DELETE STUDENT
// =====================================================
function deleteStudent(studentId) {
    const student = students.find(function(item) {
        return item.id === studentId;
    });

    if (!student) return;

    const confirmDelete = confirm("Delete " + student.name + " and all attendance records?");
    if (!confirmDelete) return;

    students = students.filter(function(item) {
        return item.id !== studentId;
    });

    attendance = attendance.filter(function(record) {
        return record.studentId !== studentId;
    });

    saveData();
    displayStudents();
    updateDashboard();
}

// =====================================================
// 11. DASHBOARD STATS REFRESH
// =====================================================
function updateDashboard() {
    const totalStudentsEl = document.getElementById("totalStudents");
    const totalClassesEl = document.getElementById("totalClasses");
    const overallAttendanceEl = document.getElementById("overallAttendance");

    if (totalStudentsEl) totalStudentsEl.innerText = students.length;
    if (totalClassesEl) totalClassesEl.innerText = attendance.length;

    let totalPresent = 0;
    attendance.forEach(function(record) {
        if (record.status === "Present") {
            totalPresent++;
        }
    });

    let percentage = 0;
    if (attendance.length > 0) {
        percentage = Math.round((totalPresent / attendance.length) * 100);
    }

    if (overallAttendanceEl) overallAttendanceEl.innerText = percentage + "%";
}

// =====================================================
// 12. XSS PROTECTION (HTML ESCAPE)
// =====================================================
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "'");
}

// =====================================================
// 13. EVENT LISTENERS & INITIAL SETUP
// =====================================================
const subjectSelect = document.getElementById("subjectSelect");
if (subjectSelect) {
    subjectSelect.addEventListener("change", function() {
        displayStudents();
    });
}

const searchInput = document.getElementById("searchStudent");
if (searchInput) {
    searchInput.addEventListener("input", function() {
        displayStudents();
    });
}

const addBtn = document.querySelector(".add-student-btn"); 
if (addBtn) {
    addBtn.addEventListener("click", addStudent);
}

displayDate();
updateLockMessage();
displayStudents();
updateDashboard();

setInterval(function() {
    updateLockMessage();
    displayStudents();
}, 60000);
                            
