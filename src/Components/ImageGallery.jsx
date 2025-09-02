"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImageGallery({ images = [], productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedIndex]}
          alt={productName}
          width={600}
          height={600}
          className="h-full w-full object-cover object-center transition-all duration-500"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 p-2">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`h-20 w-20 overflow-hidden rounded-md bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all ${
              selectedIndex === i ? "ring-2 ring-blue-600" : ""
            }`}
          >
            {
            <Image
              src={img}
              alt={`${productName} ${i + 1}`}
              width={80}
              height={80}
              className="h-full w-full object-cover object-center"
            />
            }
          </div>
        ))}
      </div>
    </div>
  );
}
