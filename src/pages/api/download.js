import ytdl from "ytdl-core";

export default async (req, res) => {
  if (req.method === "GET") {
    const { videoUrl } = req.query;

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing videoUrl parameter" });
    }

    try {
      const info = await ytdl.getInfo(videoUrl);
      let videoFormats = ytdl.filterFormats(info.formats, "audioandvideo");
      const format = ytdl.chooseFormat(videoFormats, { quality: "highest" });

      // Ensure the selected format is MP4
      if (format.container !== "mp4") {
        return res.status(400).json({ error: "Selected format is not MP4" });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${info.videoDetails.title}.${format.container}"`
      );
      res.setHeader("Content-Type", format.mimeType);

      ytdl(videoUrl, { format }).pipe(res);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while processing the request" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
