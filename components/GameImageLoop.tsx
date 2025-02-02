"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
interface Image {
  name: string;
  imageUrl: string;
  saltLevel: string;
}

const resetImageCache = async () => {
  try {
    const response = await fetch("/api/reset-cache", { method: "POST" });
    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
    } else {
      console.log(data.message);
    }
  } catch (err) {
    console.error("Error resetting cache:", err);
  }
};

const ImageFetcher = () => {
  const [highScore, setHighScore] = useState<number>(0);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [canSwapImageHigher, setCanSwapImageHigher] = useState(false);
  const [canSwapImageLower, setCanSwapImageLower] = useState(false);

  const checkWhichIsTrue = (images: Image[]) => {
    const salt1 = Number(images[0].saltLevel);
    const salt2 = Number(images[1].saltLevel);

    if (salt2 > salt1) {
      setCanSwapImageLower(false);
      setCanSwapImageHigher(true);
    } else {
      setCanSwapImageHigher(false);
      setCanSwapImageLower(true);
    }
  };

  //fetching a new image from the api "fetch-card"
  const fetchNewImage = async () => {
    try {
      const response = await fetch("/api/fetch-card");
      const data = await response.json();

      if (response.ok) {
        setImages((prevImages) => [
          { ...prevImages[1] },
          {
            name: data.name,
            imageUrl: data.imageUrl,
            saltLevel: data.cardSalt,
          },
        ]);
        //checkWhichIsTrue(images);
      } else {
        console.error("Failed to fetch new image");
        alert("Failed to load new image. Please try again");
      }
    } catch (err) {
      console.error("Error fetching new image: ", err);
      alert("An error occurred while fetching the new image. Please try again");
    }
  };
  //Fetching the initial two images on component mount

  const fetchInitialImages = async () => {
    try {
      const initialImages: Image[] = [];
      for (let i = 0; i < 2; i++) {
        const response = await fetch("/api/fetch-card");
        const data = await response.json();
        if (response.ok) {
          initialImages.push({
            name: data.name,
            imageUrl: data.imageUrl,
            saltLevel: data.cardSalt,
          });
        } else {
          console.error("Failed to fetch image");
        }
      }
      setImages(initialImages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching initial images: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (images.length === 2) {
      checkWhichIsTrue(images);
    }
  }, [images]);

  useEffect(() => {
    fetchInitialImages();
  }, []);

  if (loading) {
    return <div>Loading images...</div>;
  }

  const handleButtonClickHigher = () => {
    if (canSwapImageHigher) {
      setHighScore(highScore + 1);
      fetchNewImage();
    } else {
      setHighScore(0);
      resetImageCache();
      fetchInitialImages();
    }
  };

  const handleButtonClickLower = () => {
    if (canSwapImageLower) {
      setHighScore(highScore + 1);
      fetchNewImage();
    } else {
      setHighScore(0);
      resetImageCache();
      fetchInitialImages();
    }
  };

  return (
    <div className="game-container bg-gray-800 flex justify-center items-center h-screen">
      <div className="bg-gray-800 cards-container flex justify-center items-center h-screen">
        <div className="leftCard">
          <Image
            src={images[0].imageUrl}
            alt={images[0].name}
            width={500}
            height={500}
          ></Image>
          <p className="text-cyan-50 flex justify-center font-bold text-2xl font-sans">
            Salt Score: {images[0].saltLevel}
          </p>
        </div>
        <div className="vs-logo">
          <Image
            src={"/vs.png"}
            alt="Versus Image"
            width={200}
            height={200}
          ></Image>
        </div>
        <div className="rightCard flex mb-6 ">
          <Image
            src={images[1].imageUrl}
            alt={images[1].name}
            width={500}
            height={500}
          ></Image>
        </div>
        <div className="scoreBoard">
          <div className="buttons-container flex flex-col">
            <button
              className=" bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={handleButtonClickHigher}
            >
              Higher
            </button>
            <button
              className="bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={handleButtonClickLower}
            >
              Lower
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageFetcher;
