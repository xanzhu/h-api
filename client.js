document.addEventListener("DOMContentLoaded", () => {
  const farmName = document.getElementById("farmName");
  const searchBtn = document.getElementById("searchBtn");
  const bulkBtn = document.getElementById("bulkBtn");
  const tableData = document.getElementById("tableData");
  let data = "";

  loadData();
  hideTable();

  // Boolean to check data is loaded
  let dataLoaded = false;

  bulkBtn.addEventListener("click", () => {
    if (dataLoaded) {
      displayData();
      tableData.style.display = "block";
    } else {
      alert("Still loading data please wait :)");
    }
  });

  // Load data from /api
  function loadData() {
    fetch("/api")
      .then((res) => res.text())
      .then((resData) => {
        data = resData.replace(/[\[\]\$\"\]]/g, "");
        dataLoaded = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Display Bulk data into table
  function displayData() {
    const tbody = tableData.querySelector("tbody");
    tbody.innerHTML = "";

    const rows = data.split(",");
    const headerRow = rows.slice(0, 3);

    const thead = document.createElement("thead");
    const headerRowElement = document.createElement("tr");

    headerRow.forEach((cell) => {
      const th = document.createElement("th");
      th.textContent = cell.trim();
      headerRowElement.appendChild(th);
    });

    thead.appendChild(headerRowElement);
    tableData.appendChild(thead);

    // DEBUG: Limit rows for testing (max 95k~)
    const limitRows = 10000;

    for (let i = 3; i < limitRows; i += 3) {
      const col = rows.slice(i, i + 3);

      const tr = document.createElement("tr");
      col.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell ? cell.trim() : "";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    }
  }

  // Search function
  function displayBestScore(name) {
    const tbody = tableData.querySelector("tbody");
    tbody.innerHTML = "";

    const rows = data.split(",");
    const headerRow = rows.slice(0, 3);

    // Display the title with the name
    const titleRow = document.createElement("tr");
    const titleCell = document.createElement("td");
    titleCell.colSpan = 3;
    titleCell.textContent = `Best Score for Farm ID: ${name}`;
    titleRow.appendChild(titleCell);
    tbody.appendChild(titleRow);

    let bestID = "";
    let bestScore = -Infinity;

    for (let i = 3; i < rows.length; i += 3) {
      const columns = rows.slice(i, i + 3);
      const rowName = columns[0].trim().toLowerCase();

      if (rowName.includes(name)) {
        const score = parseFloat(columns[2]);

        if (!isNaN(score) && score > bestScore) {
          bestScore = score;
          bestID = columns[1];
        }
      }
    }

    // Display Rows
    const bestScoreRow = document.createElement("tr");
    const farmNameCell = document.createElement("td");
    const towerCell = document.createElement("td");
    const rssiCell = document.createElement("td");

    // Assign Cells
    farmNameCell.textContent = name;
    towerCell.textContent = bestID;
    rssiCell.textContent = bestScore;

    // Add cells to the row
    bestScoreRow.appendChild(farmNameCell);
    bestScoreRow.appendChild(towerCell);
    bestScoreRow.appendChild(rssiCell);

    // Add to Table
    tbody.appendChild(bestScoreRow);
  }

  // Search function
  searchBtn.addEventListener("click", () => {
    const searchInput = farmName.value;

    if (searchInput.trim() === "") {
      alert("Please enter a Farm ID!");
    } else {
      displayBestScore(searchInput);
      tableData.style.display = "block";

      // Clear field on search
      farmName.value = "";
    }
  });

  function hideTable() {
    tableData.style.display = "none";
  }
});
