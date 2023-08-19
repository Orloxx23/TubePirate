import fs from "fs";
import { join } from "path";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default function handler(req, res) {
  try {
    const { filename } = req.query;
    const filePath = join(process.cwd(), filename);

    // Stream the file for download
    const fileStream = fs.createReadStream(filePath);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while downloading the file." });
  }
}
