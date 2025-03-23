const { jsPDF } = window.jspdf

// Load saved data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTableFromLocalStorage()
  loadThemeFromLocalStorage()
})

// Theme toggle handling
document.getElementById('themeToggle').addEventListener('change', function () {
  document.body.classList.toggle('dark-mode', this.checked)
  localStorage.setItem('darkMode', this.checked)
})

// Function to sort links
function sortLinks () {
  const input = document.getElementById('linkInput').value.trim()
  if (!input) {
    alert('Please paste the link first')
    return
  }

  const lines = input.split('\n').filter(link => link.trim() !== '')
  const tableBody = document.querySelector('#linkTable tbody')

  lines.forEach(link => {
    if (!checkDuplicate(link)) {
      const appName = new URL(link).hostname.replace('www.', '').split('.')[0]
      const shortenedLink = shortenUrl(link)
      addTableRow(appName, link, shortenedLink, '')
    }
  })

  document.getElementById('linkInput').value = ''
  saveTableToLocalStorage()
}

// Function to shorten URLs
function shortenUrl (link) {
  return new URL(link).hostname.replace('www.', '')
}

// Check if the link already exists
function checkDuplicate (link) {
  let isDuplicate = false
  document.querySelectorAll('#linkTable tbody tr').forEach(row => {
    const existingLink = row.cells[1].querySelector('a').href
    if (existingLink === link) {
      isDuplicate = true
      row.classList.add('highlight')
      setTimeout(() => row.classList.remove('highlight'), 2000)
    }
  })
  if (isDuplicate) alert('The link already exists!')
  return isDuplicate
}

// Add a new row to the table
function addTableRow (appName, link, shortenedLink, comment) {
  const tableBody = document.querySelector('#linkTable tbody')
  const row = `<tr>
                    <td>${appName}</td>
                    <td><a href="${link}" target="_blank">${shortenedLink}</a></td>
                    <td contenteditable="true" onblur="updateComment(this)">${comment}</td>
                    <td><span class="delete-btn" onclick="deleteRow(this)">&#10060;</span></td>
                </tr>`
  tableBody.insertAdjacentHTML('beforeend', row)
}

// Update comment on blur
function updateComment (td) {
  saveTableToLocalStorage()
}

// Delete row from the table
function deleteRow (button) {
  button.parentElement.parentElement.remove()
  saveTableToLocalStorage()
}

// Save table data to local storage
function saveTableToLocalStorage () {
  const tableData = []
  document.querySelectorAll('#linkTable tbody tr').forEach(tr => {
    const appName = tr.cells[0].innerText
    const link = tr.cells[1].querySelector('a').href
    const comment = tr.cells[2].innerText
    tableData.push({ appName, link, comment })
  })
  localStorage.setItem('linkTableData', JSON.stringify(tableData))
}

// Load table from local storage
function loadTableFromLocalStorage () {
  const tableData = JSON.parse(localStorage.getItem('linkTableData') || '[]')
  tableData.forEach(({ appName, link, comment }) => {
    const shortenedLink = shortenUrl(link)
    addTableRow(appName, link, shortenedLink, comment)
  })
}

// Load theme from local storage
function loadThemeFromLocalStorage () {
  const darkMode = JSON.parse(localStorage.getItem('darkMode'))
  document.body.classList.toggle('dark-mode', darkMode)
  document.getElementById('themeToggle').checked = darkMode
}

// Generate and download PDF
function downloadPDF () {
  const doc = new jsPDF()
  const header = 'Linkoo! - Sorted Links'
  doc.text(header, 10, 10)

  const rows = []
  document.querySelectorAll('#linkTable tbody tr').forEach(tr => {
    const appName = tr.cells[0].innerText
    const link = tr.cells[1].querySelector('a').href
    const shortenedLink = shortenUrl(link)
    const comment = tr.cells[2].innerText
    rows.push([appName, { content: shortenedLink, link: link }, comment])
  })

  doc.autoTable({
    head: [['App Name', 'Shortened Link', 'Comments']],
    body: rows,
    didDrawCell: function (data) {
      if (data.column.index === 1 && data.cell.section === 'body') {
        const link = document
          .querySelectorAll('#linkTable tbody tr')
          [data.row.index].cells[1].querySelector('a').href
        doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, {
          url: link
        })
      }
    }
  })

  doc.save(`${header.replace(/\s+/g, '_')}.pdf`)
}

// Event listener for download PDF button
document.getElementById('downloadPDFBtn').addEventListener('click', downloadPDF)
