// Imports
const express = require("express");
const Papa = require("papaparse");
const path = require("path");

// Configure localhost port
const port = 3000;

// Halter Lambda API!
const halterApi = "https://api.onizmx.com/lambda/tower_stream";

// Express configurations
const app = express();
app.use(express.static(path.join(__dirname)));

// Set default route for express
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Establish connection to API vis /api
app.get("/api", (req, res) => {
  loadAPI().then((data) => {
    if (Array.isArray(data)) {
      res.json(data);
    } else {
      res.status(500).json({ error: "Invalid data." });
    }
  });
});

app.listen(port, () => {
  console.log(`Server established at: http://localhost:${port}`);
});

// LoadAPI Function
async function loadAPI() {
  try {
    // Establish connection to API
    const response = await fetch(halterApi);
    if (!response.ok) {
      throw new Error("Connection failed!");
    }

    // List Files found in array
    const arrayItems = await response.json();
    console.log("Files found: ", arrayItems);

    if (arrayItems.length === 0) {
      console.log("No Files found!");
      return [];
    }

    // Load object from array (files 0 - 5)
    const selectedObj = arrayItems[0];
    const fileRes = await fetch(selectedObj);

    if (!fileRes.ok) {
      throw new Error(`Failed to fetch CSV data. Status: ${fileRes.status}`);
    }
    console.log(`File selected: ${selectedObj}`);

    // Process file using papa (csv)
    const fileData = await fileRes.text();
    const fileProcess = Papa.parse(fileData);

    // DEBUG: Print csv lines to console
    console.log(fileProcess.data);

    return fileProcess.data;
  } catch (error) {
    console.error("loadAPI:", error);

    throw error;
  }
}
