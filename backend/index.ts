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
import axios from "axios";
import { Buffer } from "buffer";
import encodeAsPlantuml from "./encodeAsPlantuml";
import path from "path";
import fs from "fs";

const app = express();
const port = 3039;
const plantUMLServerUrl = "http://localhost:8080/png/"; // Change to your PlantUML server URL

app.use(bodyParser.json());

// Directory to store files
const FILE_DIR = path.join(__dirname, "files");

// Endpoint to get the contents of a file
app.get("/get-file/:filename", (req, res) => {
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
app.post("/generate-uml/:filename", async (req, res) => {
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

const sendPng = async (res: express.Response, data: string) => {
  if (!data) {
    res.status(400).json({ error: 'The "data" field is required.' });
  }
  try {
    // Encode the data for PlantUML
    const encodedData = encodeAsPlantuml(data);

    console.log(`${plantUMLServerUrl}${encodedData}`);

    // Send the request to the PlantUML server
    const response = await axios.get(`${plantUMLServerUrl}${encodedData}`, {
      responseType: "arraybuffer",
    });

    // Convert the response data to base64
    const base64Image = Buffer.from(response.data).toString("base64");

    // Return the image as an HTML img tag
    const imgTag = `data:image/png;base64,${base64Image}`;
    res.send(imgTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate UML diagram." });
  }
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
