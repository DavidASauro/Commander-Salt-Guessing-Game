"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
interface Image {
  name: string;
  imageUrl: string;
  saltLevel: string;
}

const ImageFetcher = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [canSwapImageHigher, setCanSwapImageHigher] = useState(false);
  const [canSwapImageLower, setCanSwapImageLower] = useState(false);

  const checkWhichIsTrue = (images: Image[]) => {
    const salt1 = Number(images[0].saltLevel);
    const salt2 = Number(images[1].saltLevel);

    console.log(`Image 1: ${images[0].name} - Salt: ${salt1}`);
    console.log(`Image 2: ${images[1].name} - Salt: ${salt2}`);

    if (salt2 > salt1) {
      setCanSwapImageLower(false);
      setCanSwapImageHigher(true);
      console.log("SALT2 > SALT1");
    } else {
      setCanSwapImageHigher(false);
      setCanSwapImageLower(true);
      console.log("SALT1 > SALT2");
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
      console.log("TRUE HIGHER");
      fetchNewImage();
    } else {
      console.log("FALSE HIGHER");
      fetchInitialImages();
    }
  };

  const handleButtonClickLower = () => {
    if (canSwapImageLower) {
      console.log("TRUE LOWER");
      fetchNewImage();
    } else {
      console.log("FALSE LOWER");
      fetchInitialImages();
    }
  };

  return (
    <div className="game-container bg-gray-800 flex-col justify-center items-center h-screen">
      <div className="bg-gray-800 cards-container flex justify-center items-center h-screen">
        <div className="leftCard">
          <Image
            src={images[0].imageUrl}
            alt={images[0].name}
            width={500}
            height={500}
          ></Image>
          <p>{images[0].saltLevel}</p>
        </div>
        <div className="vs-logo">
          <Image
            src="/combat.png"
            alt="SOMETHING"
            width={150}
            height={150}
          ></Image>
        </div>
        <div className="rightCard ">
          <Image
            src={images[1].imageUrl}
            alt={images[1].name}
            width={500}
            height={500}
          ></Image>
          <p>{images[1].saltLevel}</p>
        </div>
        <div className="nextCard"></div>
      </div>
      <div className="bg-white buttons-container flex justify-center items-center">
        <button onClick={handleButtonClickHigher}>Higher</button>
        <button onClick={handleButtonClickLower}>Lower</button>
      </div>
      <div className="scoreBoard flex-col">Current Score</div>
    </div>
  );
};
export default ImageFetcher;
