const { jsPDF } = window.jspdf;

        document.getElementById('themeToggle').addEventListener('change', function () {
            document.body.classList.toggle('dark-mode', this.checked);
        });

        document.addEventListener("DOMContentLoaded", loadTableFromLocalStorage);

        function sortLinks() {
            const input = document.getElementById("linkInput").value.trim();
            if (!input) {
                alert("Please paste the link first");
                return;
            }

            const lines = input.split("\n").filter(link => link.trim() !== "");
            const tableBody = document.querySelector("#linkTable tbody");

            lines.forEach(link => {
                if (!checkDuplicate(link)) {
                    const appName = new URL(link).hostname.replace('www.', '').split('.')[0];
                    const shortenedLink = shortenUrl(link);
                    addTableRow(appName, link, shortenedLink);
                }
            });

            document.getElementById("linkInput").value = "";
            saveTableToLocalStorage();
        }

        function shortenUrl(link) {
            const urlObj = new URL(link);
            const host = urlObj.hostname.replace('www.', '');
            return `${host}`;
        }

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

        function addTableRow(appName, link, shortenedLink) {
            const tableBody = document.querySelector("#linkTable tbody");
            const row = `<tr>
                            <td>${appName}</td>
                            <td><a href="${link}" target="_blank">${shortenedLink}</a></td>
                            <td contenteditable="true" onblur="updateComment(this)"></td>
                            <td><span class="delete-btn" onclick="deleteRow(this)">&#10060;</span></td>
                        </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
        }

        function updateComment(td) {
            saveTableToLocalStorage();
        }

        function deleteRow(button) {
            button.parentElement.parentElement.remove();
            saveTableToLocalStorage();
        }

        function saveTableToLocalStorage() {
            const tableData = [];
            document.querySelectorAll("#linkTable tbody tr").forEach(tr => {
                const appName = tr.cells[0].innerText;
                const link = tr.cells[1].querySelector("a").href;
                const comment = tr.cells[2].innerText;
                tableData.push({ appName, link, comment });
            });
            localStorage.setItem("linkTableData", JSON.stringify(tableData));
        }

        function loadTableFromLocalStorage() {
            const tableData = JSON.parse(localStorage.getItem("linkTableData") || "[]");
            tableData.forEach(({ appName, link, comment }) => {
                const shortenedLink = shortenUrl(link);
                addTableRow(appName, link, shortenedLink);
            });
        }

        function downloadPDF() {
            const doc = new jsPDF();
            doc.text("Linkoo! - Sorted Links", 10, 10);

            const rows = [];
            document.querySelectorAll("#linkTable tbody tr").forEach(tr => {
                rows.push([tr.cells[0].innerText, tr.cells[1].querySelector("a").href, tr.cells[2].innerText]);
            });

            doc.autoTable({
                head: [['App Name', 'Link', 'Comments']],
                body: rows
            });

            doc.save("linkoo_sorted_links.pdf");
        }