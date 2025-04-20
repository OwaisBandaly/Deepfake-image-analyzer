import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const url = "https://deepfake-image-analyzer.onrender.com";

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult("");
      setConfidence("");
      setAnimatedConfidence(0);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

    setResult("");
    setConfidence("");
    setAnimatedConfidence(0);
  };

  const cancelImage = (e) => {
    e.preventDefault();

    setImage(null);
    setPreview("");
    setResult("");
    setConfidence("");
    setLoading(false);
    setAnimatedConfidence(0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        `${url}/analyze`,
        formData
      );
      console.log(response);

      setResult(response.data.result);
      setConfidence(response.data.confidence);

      let start = 0;
      const target = response.data.confidence;

      const interval = setInterval(() => {
        if (start < target) {
          start++;
          setAnimatedConfidence(start);
        } else {
          clearInterval(interval);
        }
      }, 10);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-stone-100 h-screen text-slate-900">
        <div className="absolute w-[500px] h-[500px] bg-cyan-700 opacity-15 scale-120 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-green-500 opacity-15 scale-120 rounded-full blur-3xl bottom-[-120px] right-[150px]"></div>

        <div className="fixed top-4 right-6 group cursor-pointer z-50">
          <div className="text-cyan-600 text-2xl">
            <img
              src="/assets/info.png"
              alt="info"
              className="w-8 opacity-90"
            />
          </div>

          <div className="absolute top-10 right-0 w-[250px] p-3 bg-white shadow-xl rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-300 text-sm text-gray-800">
            <strong>Model:</strong> Deep-Fake-Detector-Model
            <br />
            <strong>How it works:</strong>
            <br />
            Detects subtle inconsistencies in AI-generated images using a
            trained deep learning model.
          </div>
        </div>

        <div className="flex flex-col justify-center items-center max-w-[50vw] mx-auto">
          <div className="flex flex-row">
            <h2 className="mt-8 font-bold text-3xl text-center text-slate-900">
              <span className="underline italic decoration-fuchsia-800 decoration-wavy decoration-2 underline-offset-4">
                Deepfake
              </span>{" "}
              Image Analyzer
            </h2>
          </div>

          <p className="text-center text-slate-800 my-2 font-semibold">
            Upload. Analyze. Reveal the Truth.
          </p>

          {preview && (
            <div className="relative w-[400px] h-[400px] rounded-xl my-5 overflow-hidden shadow-2xl">
              <img
                src={preview}
                title={image?.name}
                className={
                  !loading
                    ? "h-full w-full object-cover opacity-100"
                    : "h-full w-full object-cover opacity-80 blur-[1.5px]"
                }
                alt="preview"
              />

              {loading && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}

          {result && !loading && (
            <div className="text-center w-full z-40">
              <h3 className="text-xl font-bold mb-2">Result: {result}</h3>

              <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full z-40 h-6 overflow-hidden">
                <div
                  className={"bar" + (result === "Fake" ? " bg-red-500" : " bg-green-500")}
                  style={{ width: `${animatedConfidence}%` }}
                >
                  {animatedConfidence}%
                </div>
              </div>
            </div>
          )}

          {!preview ? (
            <div
              className={`border-2  ${
                isDragging ? "border-fuchsia-800" : "border-slate-900"
              } border-dashed py-3 px-8 scale-120 my-8 font-bold rounded-xl flex flex-col items-center justify-center transition-colors duration-300`}
            >
              <img src="/assets/icon.png" alt="" className="w-[3rem]" />
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="cursor-pointer "
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden "
                  onChange={handleImageChange}
                />
                Drag & Drop Image or Click to Upload
              </label>
              <p className="text-sm text-gray-500 mb-2 font-medium">
                Files supported: JPG, PNG
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 z-10 mt-6">
              <button
                className="bg-cyan-700 py-1 px-4 rounded-lg text-white font-semibold text-lg cursor-pointer"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
              <label
                className="bg-red-700 py-1 px-4 rounded-lg text-white font-semibold text-lg cursor-pointer"
                onClick={cancelImage}
              >
                Cancel
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
