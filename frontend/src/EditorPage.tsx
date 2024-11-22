import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { ReactSvgPanZoomLoader } from "react-svg-pan-zoom-loader";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";

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
  }, []);

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
            const errorMessage = await response.json();
            setImageUrl(errorMessage.errorImage);
            console.log(errorMessage.errorImage);
          } else {
            const blob = await response.text();
            setImageUrl(blob);
          }
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

  const halfPartStyle = {
    flex: 1,
    padding: "20px",
  };

  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);
  const width = 700;
  const height = 700;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{id}</h1>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div style={halfPartStyle}>
          <Editor
            height="90vh"
            defaultLanguage="plantuml"
            defaultValue={text}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            onChange={() => setText(editorRef.current?.getValue() || "")}
          />
        </div>
        <div style={halfPartStyle}>
          <div style={{ marginTop: "20px" }}>
            <ReactSvgPanZoomLoader
              svgXML={imageUrl}
              render={(content: string) => (
                <UncontrolledReactSVGPanZoom width={width} height={height}>
                  <svg width={width} height={height}>
                    {content}
                  </svg>
                </UncontrolledReactSVGPanZoom>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
