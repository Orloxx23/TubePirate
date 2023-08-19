import ytdl from "ytdl-core";

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    const videoUrl = url;

    const info = await ytdl.getInfo(videoUrl);

    res.status(200).json(info);
  } catch (error) {}
}
