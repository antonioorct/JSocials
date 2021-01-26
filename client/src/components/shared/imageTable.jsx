import React, { useEffect, useState } from "react";

import Image from "react-bootstrap/Image";
import { useParams } from "react-router-dom";

import { getImages } from "../../services/postService";

export default function ImageTable({ userId, setSelectedPost }) {
  const [images, setImages] = useState([]);
  const [display, setDisplay] = useState(<div />);

  const params = useParams();

  useEffect(() => {
    fetchAndSetImages();
  }, []);

  const fetchAndSetImages = async () => {
    const imgs = await getImages(userId);

    setImages(imgs);
  };

  useEffect(() => {
    let displayArray = [],
      tempArray = [];

    images.forEach((img, index) => {
      tempArray.push(
        <Image
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedPost(images[index])}
          className="col-4"
          src={"img/" + img.imagePath}
          key={index}
        />
      );

      if ((index + 1) % 3 === 0) {
        displayArray.push(<div className="row">{tempArray}</div>);

        tempArray = [];
      }
    });
    if (tempArray.length !== 0)
      displayArray.push(<div className="row">{tempArray}</div>);

    setDisplay(displayArray);
  }, [images]);

  return display;
}
