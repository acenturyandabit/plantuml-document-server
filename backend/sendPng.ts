import axios from "axios";
import { Buffer } from "buffer";
import encodeAsPlantuml from "./encodeAsPlantuml";
import express from "express";
const plantUMLServerUrl = "http://localhost:8080/png/"; // Change to your PlantUML server URL

export const sendPng = async (res: express.Response, data: string) => {
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