import Tesseract from 'tesseract.js';
import * as faceapi from 'face-api.js';

// Load models from a CDN
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;
  
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    modelsLoaded = true;
    console.log("FaceAPI models loaded");
  } catch (error) {
    console.error("Error loading FaceAPI models:", error);
    throw error;
  }
};

export const extractTextFromImage = async (imageUrl: string) => {
  try {
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: m => console.log(m)
    });
    return result.data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};

export const detectFaceAndDescriptor = async (imageElement: HTMLImageElement | HTMLVideoElement) => {
  if (!modelsLoaded) await loadModels();
  
  const detection = await faceapi.detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceDescriptor();
    
  return detection;
};

export const compareFaces = (descriptor1: Float32Array, descriptor2: Float32Array) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  // Distance < 0.6 is generally considered a match. Lower is better.
  // Convert to accuracy percentage (approximate)
  // 0.0 -> 100%
  // 0.6 -> 50%
  // 1.0 -> 0%
  const accuracy = Math.max(0, 100 - (distance * 100));
  return { isMatch: distance < 0.6, score: Math.round(accuracy), distance };
};

// Helper to parse OCR text into structured data (Basic heuristic)
export const parseVoterIDText = (text: string) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Very basic heuristics - in a real app this would be robust regex
  // Looking for common patterns in ID cards
  
  let id = "UNKNOWN";
  let name = "UNKNOWN";
  let dob = "UNKNOWN";
  let address = "UNKNOWN";
  
  // Try to find patterns
  // ID usually contains capital letters and numbers
  const idRegex = /[A-Z]{3,}[0-9]{5,}/;
  
  // Date format
  const dateRegex = /\d{2}[-/]\d{2}[-/]\d{4}/;

  for (const line of lines) {
    if (line.match(idRegex) && id === "UNKNOWN") {
      id = line.match(idRegex)?.[0] || id;
    }
    if (line.match(dateRegex) && dob === "UNKNOWN") {
      dob = line.match(dateRegex)?.[0] || dob;
    }
    if (line.toLowerCase().includes("name") || line.toLowerCase().includes("voter")) {
      // Assuming name is on the next line or same line
      const nameParts = line.replace(/name|voter|:/gi, '').trim();
      if (nameParts.length > 2) name = nameParts;
    }
  }
  
  // Fallback: If heuristic failed, take the first few lines as best guess
  if (name === "UNKNOWN" && lines.length > 1) name = lines[1]; 
  
  return { id, name, dob, address: "Extracted from ID" };
};
