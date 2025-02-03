"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "../_providers/UserProvider";

import { PlantDetectResult } from "@/app/types";
import TextArea from "./TextArea";
import Image from "next/image";
import Loading from "./Loading";
import LoadingSkeleton from "./Skeletons/PlantDetectSkeleton";

const skeletonDiv = (
  <>
    <LoadingSkeleton />
    <LoadingSkeleton />
    <LoadingSkeleton />
    <LoadingSkeleton />
  </>
);

export default function UploadForm() {
  const router = useRouter();
  const user = useContext(UserContext);
  const [loadingResult, setLoadingResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [detectChecked, setDetectChecked] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [plantDetectResults, setPlantDetectResults] = useState<
    PlantDetectResult[]
  >([]);
  const [bodyText, setBodyText] = useState<string>("");

  const handleFileSelect = (formData: FormData) => {
    if (!user) router.push("/login");

    postUpload(formData);
  };

  const detectPlants = async (formData: FormData) => {
    setLoadingResult(true);
    setPlantDetectResults([]);

    const plantDetectionResponse = await fetch(`/api/plant-detection`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => res.success)
      .catch((error) => error);

    const plantResults = plantDetectionResponse.results;
    console.log(plantResults);
    for (let i = 0; i < plantResults.length; i++) {
      console.log(plantResults[i]);
    }
    setPlantDetectResults(plantResults);

    setLoadingResult(false);
  };

  const postUpload = async (formData: FormData) => {
    // setLoading(true);
    const files = formData.getAll("files");

    if (files.length > 10) {
      alert("Maximum of 10 images/videos allowed.");
      setLoading(false);
      return;
    }

    if (detectChecked) detectPlants(formData);

    const maxUploadSize = 2000 * 1024 * 1024;
    for (let file of files) {
      file = file as File;
      if (file.size > maxUploadSize) {
        alert("File size of 500MB exceeded.");
        setLoading(false);
        return;
      }
    }

    formData.append("user_id", user!.id);
  };

  const handleCheckbox = (e: any) => {
    setDetectChecked(!detectChecked);
    console.log(e.target);
  };

  return (
    <div
      className={`grid grid-cols-5 gap-4 shadow bg-white p-8 rounded-lg h-[656px] max-h-[565px] ${
        (loadingResult || plantDetectResults.length !== 0) && "col-cols-5"
      } transition-all duration-300`}
    >
      <form
        action={handleFileSelect}
        className="col-span-2 bg-white p-4 rounded-md shadow shadow-slate-400 text-left px-8"
      >
        <label>
          <span>Upload a photo</span>
          <input
            type="file"
            name="files"
            accept="image/jpeg,video/*,image/png"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            multiple
            required
          />
        </label>
        <label className="block cursor-pointer mb-4">
          <span>Plant Detection</span>
          <input
            type="checkbox"
            value=""
            className="appearance-none sr-only peer inline-block leading-tight"
            onChange={handleCheckbox}
            checked={detectChecked}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700  peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
          <p className="text-sm">
            <span className="text-black opacity-50 outline-none">
              <span className="mr-1">&#x24D8;</span>Will detect the plant species
            </span>
          </p>
        </label>

        <label className="block text-left w-[100%]">
          <span>Title</span>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="title"
            placeholder="Title"
            maxLength={50}
            required
          />
        </label>

        {/* <label>
          <span>Body</span>
          <textarea
            name="body"
            rows={5}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Body"
            required
          />
        </label> */}

        <label>
          <span>Body</span>
          <TextArea
            textValue={bodyText}
            setTextValue={setBodyText}
            name="body"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Body"
            required={true}
          />
        </label>
        <button
          type="submit"
          className="inline-block right-0 text-center border-2 text-green-700 border-green-700 rounded-md mx-auto p-2 hover:bg-green-600 hover:text-white transition disabled:text-gray-500 disabled:border-gray-300 disabled:bg-slate-200"
          disabled={loading}
        >
          Create post
        </button>
        {loading && <Loading />}
      </form>
      <div className="col-span-1 flex flex-col justify-center items-center">
        {loadingResult ? (
          <>
            <Loading />
            <p>Analyzing...</p>
          </>
        ) : (
          plantDetectResults.length !== 0 && (
            <h1 className="text-lg pl-4">Select a match</h1>
          )
        )}
      </div>
      <div className="col-span-2 overflow-scroll p-4 border-l-[1px] border-l-slate-400 border-opacity-30">
        {loadingResult && skeletonDiv}

        {plantDetectResults.length !== 0 &&
          plantDetectResults.map((result: any, index: number) => {
            return (
              <div
                className={` text-black p-4 rounded-md shadow-md text-left px-4 mb-4 shadow-slate-400 hover:bg-slate-200 transition duration-150 flex flex-row hover:cursor-pointer ${
                  selectedCard === index ? "bg-slate-200" : ""
                }`}
                key={JSON.stringify(result)}
                onClick={() => setSelectedCard(index)}
              >
                <Image
                  src={`${result.images[0].url.o}`}
                  alt={`${result.species.scientificName}`}
                  style={{
                    maxWidth: "50%",
                    height: "auto",
                  }}
                  width="100"
                  height="100"
                  className="rounded-md h-auto inline-block w-[100px]"
                />
                <div className="flex-grow text-left flex flex-col pl-4">
                  <span>
                    {result.species.commonNames.length !== 0
                      ? `${result.species.scientificName}, or "${result.species.commonNames[0]}"`
                      : `${result.species.scientificName}`}
                  </span>
                  <p>Some information about the plant...</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
