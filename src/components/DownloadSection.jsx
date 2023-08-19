import React from "react";
import VideoCard from "./VideoCard";

export default function DownloadSection() {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [videoInfo, setVideoInfo] = React.useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);

    await fetch(`/api/videoInfo?url=${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        const _videoInfo = {
          title: data.videoDetails.title,
          author: data.videoDetails.author.name,
          thumbnail: data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url,
          duration: data.videoDetails.lengthSeconds,
          url: data.videoDetails.video_url,
        };
        setVideoInfo(_videoInfo);
      });
    });

    setUrl("");
    setLoading(false);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen px-4 md:px-20 lg:px-40 pt-[15rem] lg:pt-[17rem] md:pt-[18rem] flex flex-col items-center text-white">
      <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl brand">Youtube Downloader</h1>
      <p className="text-white/60 text-sm md:text-base">a safe and easy Youtube video downloader</p>

      <form onSubmit={handleSubmit}>
        <div className="bg-white overflow-hidden rounded-sm pl-4 lg:w-[900px] flex mt-8 md:mt-16">
          <input
            type="url"
            placeholder="Paste your link here"
            className="text-black border-none outline-none bg-transparent w-full"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            type="submit"
            value={loading ? "Wait 🏴‍☠️" : "Download"}
            disabled={loading || !url}
            className="bg-[#6c35de] p-4 cursor-pointer w-52 disabled:bg-[#6d35de8e] font-bold duration-300"
          />
        </div>
      </form>

      {videoInfo.title && <VideoCard videoInfo={videoInfo} />}
    </div>
  );
}
