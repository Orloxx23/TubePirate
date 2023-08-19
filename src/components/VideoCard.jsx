import React from "react";
import { toast } from "sonner";

export default function VideoCard({ videoInfo }) {
  const [loading, setLoading] = React.useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);

  const apiURL = "https://tubepirateapi-buuc-dev.fl0.io";

  const phrasesArray = [
    "Loading the visual treasure!",
    "Uncovering a video on the high seas...",
    "In search of excitement, loading video!",
    "Arr matey! A video be in sight!",
    "Preparing the cannon of entertainment...",
  ];

  const secondsToHMS = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const pad = (num) => (num < 10 ? `0${num}` : num);

    return `${pad(h)}:${pad(m)}:${pad(s - 1)}`;
  };

  const showPhrase = () => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % phrasesArray.length
      );
    }, 10000);
    return () => clearInterval(interval);
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiURL}/api/download?url=${videoInfo.url}`
      );

      if (response.ok) {
        const res = await response.json();
        console.log(apiURL + res.downloadUrl);
        const a = document.createElement("a");
        a.href = apiURL + res.downloadUrl;
        a.download = `${videoInfo.title}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const img = videoInfo.thumbnail;
        const text = `HEY! the video has been downloaded.`;
        const notification = new Notification("TubePirate", {
          body: text,
          icon: img,
        });
      } else {
        console.error("Error al descargar el archivo.");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const handleClick = async () => {
    showPhrase();
    toast.promise(handleDownload, {
      loading: "Processing...",
      success: "Downloaded!",
      error: "Error",
    });
  };

  return (
    <div className="bg-white rounded-sm shadow-xl lg:w-[900px] flex mt-5 md:mt-10 text-black">
      <img
        src={videoInfo.thumbnail}
        className="object-cover w-1/3"
        draggable="false"
      />
      <div className="flex flex-col justify-between w-full p-2 md:p-4">
        <div className="w-full">
          <h1 className="font-bold text-sm md:text-2xl">{videoInfo.title}</h1>
          <p className="text-xs md:text-xl">
            {videoInfo.author} | {secondsToHMS(videoInfo.duration)}
          </p>
        </div>
        <button
          onClick={handleClick}
          disabled={loading}
          type="button"
          className="text-white bg-[#6c35de] justify-center hover:bg-[#a364ff] disabled:bg-[#6d35de73] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs md:text-sm px-5 py-1 md:py-2.5 text-center mr-2 inline-flex items-center cursor-pointer"
        >
          {loading && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          {loading ? phrasesArray[currentPhraseIndex] : "Download"}
        </button>
      </div>
    </div>
  );
}
