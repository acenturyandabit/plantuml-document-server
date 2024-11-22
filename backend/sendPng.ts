import axios from "axios";
import { Buffer } from "buffer";
import encodeAsPlantuml from "./encodeAsPlantuml";
import express from "express";
const plantUMLServerUrl = "http://localhost:8080/svg/"; // Change to your PlantUML server URL

export const sendPng = async (res: express.Response, data: string) => {
  if (!data) {
    res.status(400).json({ error: 'The "data" field is required.' });
  }
  try {
    // Encode the data for PlantUML
    const encodedData = encodeAsPlantuml(data);
    console.log(`${plantUMLServerUrl}${encodedData}`);
    const response = await axios.get(`${plantUMLServerUrl}${encodedData}`, {
      responseType: "arraybuffer",
    });
    res.send(getImageFromResponse(response));
  } catch (error) {
    res.status(500).json({ error: "Failed to generate UML diagram.", errorImage: getImageFromResponse(error.response) });
  }
};

const getImageFromResponse = (response) => {
  return response.data;
}