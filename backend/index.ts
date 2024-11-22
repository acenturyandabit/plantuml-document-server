/*
give me a typescript ESM express app using that has a POST endpoint that takes a
json body with a 'data' field, which it forwards to a plantUML server, using
plantuml's specific base64 encoding, and then returns the result as a html
image tag

- manually change port 3000 to 3039
- Fix type error
- make it emit text
*/

import express from "express";
import bodyParser from "body-parser";

import path from "path";
import fs from "fs";
import { sendPng } from "./sendPng";

const app = express();
const port = 3039;


app.use(bodyParser.json());
app.use(express.static("static"));

// Directory to store files
const FILE_DIR = path.join(__dirname, "files");

// Endpoint to get the contents of a file
app.get("/api/get-file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(FILE_DIR, filename);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    res.json({ contents: data });
  });
});

// Endpoint to save text to a file
app.post("/api/generate-uml/:filename", async (req, res) => {
  const { filename } = req.params;
  const { data } = req.body;

  if (!data) {
    res.status(400).json({ error: "data is required" });
    return;
  }

  const filePath = path.join(FILE_DIR, filename);

  fs.writeFile(filePath, data, "utf8", async (err) => {
    if (err) {
      res.status(500).json({ error: "Error saving file" });
      return;
    }
    await sendPng(res, data);
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
