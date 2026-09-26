import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "contestants.json");

export interface Contestant {
  name: string;
  email: string;
  phone: string;
  paymentId: string;
  amount: number;
  date: string;
}

export function saveContestant(data: Contestant) {
  let existingData: Contestant[] = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Error reading file", err);
  }

  existingData.push(data);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
}

export function getContestants(): Contestant[] {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Error reading file", err);
  }
  return [];
}