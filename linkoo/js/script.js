
const { jsPDF } = window.jspdf;

// Theme Toggle
document.getElementById('themeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode', this.checked);
});

// Load Table Data from Local Storage
document.addEventListener("DOMContentLoaded", loadTableFromLocalStorage);

// Sort Links
function sortLinks() {
    const input = document.getElementById("linkInput").value.trim();
    if (!input) {
        alert("Please paste the link first");
        return; // If textarea is empty, do not proceed
    }

    const lines = input.split("\n").filter(link => link.trim() !== "");
    const tableBody = document.querySelector("#linkTable tbody");

    lines.forEach(link => {
        if (!checkDuplicate(link)) {
            const appName = new URL(link).hostname.replace('www.', '').split('.')[0];
            addTableRow(appName, link);
        }
    });

    document.getElementById("linkInput").value = ""; // Auto-clear textarea
    saveTableToLocalStorage();
}

// Check for Duplicate Link
function checkDuplicate(link) {
    let isDuplicate = false;
    document.querySelectorAll("#linkTable tbody tr").forEach(row => {
        const existingLink = row.cells[1].querySelector("a").href;
        if (existingLink === link) {
            isDuplicate = true;
            row.classList.add('highlight');
            setTimeout(() => row.classList.remove('highlight'), 2000);
        }
    });
    if (isDuplicate) alert("The link already exists!");
    return isDuplicate;
}

// Add Row to Table
function addTableRow(appName, link) {
    const tableBody = document.querySelector("#linkTable tbody");
    const row = `<tr>
                    <td>${appName}</td>
                    <td><a href="${link}" target="_blank">${link}</a></td>
                    <td><span class="delete-btn" onclick="deleteRow(this)">&#10060;</span></td>
                </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
}

// Delete Row
function deleteRow(button) {
    button.parentElement.parentElement.remove();
    saveTableToLocalStorage();
}

// Save Table to Local Storage
function saveTableToLocalStorage() {
    const tableData = [];
    document.querySelectorAll("#linkTable tbody tr").forEach(tr => {
        const appName = tr.cells[0].innerText;
        const link = tr.cells[1].querySelector("a").href;
        tableData.push({ appName, link });
    });
    localStorage.setItem("linkTableData", JSON.stringify(tableData));
}

// Load Table from Local Storage
function loadTableFromLocalStorage() {
    const tableData = JSON.parse(localStorage.getItem("linkTableData") || "[]");
    tableData.forEach(({ appName, link }) => addTableRow(appName, link));
}

// Download Table as PDF
function downloadPDF() {
    const doc = new jsPDF();
    doc.text("Linkoo! - Sorted Links", 10, 10);

    const rows = [];
    document.querySelectorAll("#linkTable tbody tr").forEach(tr => {
        rows.push([tr.cells[0].innerText, tr.cells[1].querySelector("a").href]);
    });

    doc.autoTable({
        head: [['App Name', 'Link']],
        body: rows
    });

    doc.save("linkoo_sorted_links.pdf");
}
