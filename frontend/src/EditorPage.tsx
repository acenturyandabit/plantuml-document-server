import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default () => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/get-file/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setText(data.contents);
      });
  },[]);

  useEffect(() => {
    const fetchImage = async () => {
      if (text) {
        try {
          const response = await fetch(`/api/generate-uml/${id}`, { 
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: text }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const blob = await response.text();
          setImageUrl(blob);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchImage();
    }, 300); // Adjust delay as needed

    return () => clearTimeout(delayDebounceFn); // Cleanup
  }, [text]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Text to Image Converter</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here..."
      />
      <div style={{ marginTop: "20px" }}>
        {imageUrl && (
          <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%" }} />
        )}
      </div>
    </div>
  );
};
