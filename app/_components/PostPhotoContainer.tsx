"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-regular-svg-icons";

export default function PostPhotoContainer({
  images,
  handleImageIndexChange,
  currentImageIndex,
}: {
  images: Array<string>;
  handleImageIndexChange: Function;
  currentImageIndex: number;
}) {
  return (
    <div
      className={`relative ${
        images.length > 1 ? "h-[600px]" : ""
      } overflow-auto flex items-center justify-center rounded-md bg-background`}
    >
      {images![currentImageIndex].endsWith("-video") ? (
        <video
          width="600"
          className="rounded-md mx-auto border-2 border-border overflow-hidden max-h-full"
          controls
          key={images[currentImageIndex]}
        >
          <source
            src={
              `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                images![currentImageIndex]
              }` || ""
            }
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          src={
            `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
              images![currentImageIndex]
            }` || ""
          }
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "auto",
          }}
          height="0"
          width="1000"
          alt="A really pretty flower..."
          className="rounded-md mx-auto border-2 border-border block"
        />
      )}

      {images.length > 1 && currentImageIndex > 0 && (
        <button
          className="absolute cursor-pointer left-2"
          onClick={() => {
            handleImageIndexChange(-1);
          }}
        >
          <FontAwesomeIcon
            icon={faSquareCaretLeft}
            className="opacity-75 text-gray-200"
            size="2x"
          />
        </button>
      )}
      {images.length > 1 && currentImageIndex < images.length - 1 && (
        <button
          className="absolute cursor-pointer right-2"
          onClick={() => {
            handleImageIndexChange(1);
          }}
        >
          <FontAwesomeIcon
            icon={faSquareCaretRight}
            className="opacity-75 text-gray-200"
            size="2x"
          />
        </button>
      )}
    </div>
  );
}
