/*import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import fs from "fs";
import cp from "child_process";
import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { url } = req.query;

  // Get the video info to extract the title
  const videoInfo = await ytdl.getInfo(url);
  const videoTitle = videoInfo.videoDetails.title;

  const audio = ytdl(url, { quality: "highestaudio" });
  const video = ytdl(url, { quality: "highestvideo" });

  const audioStream = audio.pipe(fs.createWriteStream("audio.aac"));
  const videoStream = video.pipe(fs.createWriteStream("video.mp4"));

  await Promise.all([
    new Promise((resolve) => audioStream.on("finish", resolve)),
    new Promise((resolve) => videoStream.on("finish", resolve)),
  ]);

  const mergedFilePath = `${videoTitle}.mp4`;

  const ffmpegPath = require("ffmpeg-static");
  const ffmpegProcess = cp.spawn(ffmpegPath, [
    "-i",
    "audio.aac",
    "-i",
    "video.mp4",
    "-c:v",
    "copy",
    mergedFilePath,
  ]);

  await new Promise((resolve, reject) => {
    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg process exited with code ${code}`));
      }
    });
  });

  // Upload the merged file to Firebase Storage
  const storageRef = ref(storage, "videos/" + mergedFilePath);
  const mergedFileBuffer = fs.readFileSync(mergedFilePath);

  let downloadUrl = "";
  try {
    await uploadBytes(storageRef, mergedFileBuffer).then(async () => {
      console.log("Uploaded a blob or file!");
      await getDownloadURL(storageRef).then((url) => {
        console.log("File available at", url);
        downloadUrl = url;
      });
    });
    console.log("File uploaded to Firebase Storage");

    // Clean up temporary files
    fs.unlinkSync("audio.aac");
    fs.unlinkSync("video.mp4");
    fs.unlinkSync(mergedFilePath);

    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    try {
      fs.unlinkSync("audio.aac");
      fs.unlinkSync("video.mp4");
      fs.unlinkSync(mergedFilePath);
    } catch (error) {}
    res
      .status(500)
      .json({ error: "An error occurred while uploading the file." });
  }
}*/

import fs from "fs";
import cp from "child_process";
import ytdl from "ytdl-core";
import { join } from "path";

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    // Get the video info to extract the title
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;

    const audio = ytdl(url, { quality: "highestaudio" });
    const video = ytdl(url, { quality: "highestvideo" });

    const audioStream = audio.pipe(fs.createWriteStream("audio.aac"));
    const videoStream = video.pipe(fs.createWriteStream("video.mp4"));

    await Promise.all([
      new Promise((resolve) => audioStream.on("finish", resolve)),
      new Promise((resolve) => videoStream.on("finish", resolve)),
    ]);

    const mergedFilePath = `${videoTitle}.mp4`;

    const ffmpegPath = require("ffmpeg-static");
    const ffmpegProcess = cp.spawn(ffmpegPath, [
      "-i",
      "audio.aac",
      "-i",
      "video.mp4",
      "-c:v",
      "copy",
      mergedFilePath,
    ]);

    await new Promise((resolve, reject) => {
      ffmpegProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ffmpeg process exited with code ${code}`));
        }
      });
    });

    // Create a direct download link
    const downloadUrl = `/api/getVideo?filename=${encodeURIComponent(
      mergedFilePath
    )}`;

    // Clean up temporary files
    fs.unlinkSync("audio.aac");
    fs.unlinkSync("video.mp4");
    setTimeout(() => {
      fs.unlinkSync(mergedFilePath);
    }, 3000);

    // Return the direct download link
    console.log(downloadUrl);
    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    try {
      fs.unlinkSync("audio.aac");
      fs.unlinkSync("video.mp4");
      fs.unlinkSync(mergedFilePath);
    } catch (error) {}
    res
      .status(500)
      .json({ error: "An error occurred while uploading the file." });
  }
}
