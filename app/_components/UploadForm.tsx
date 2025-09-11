"use client";

import "@/app/globals.css";

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
  const [plantDetailError, setPlantDetailError] = useState<string>("");

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

  const retrievePlantDetails = async () => {
    if (plantDetectResults.length === 0 || selectedCard === null) {
      setPlantDetailError("Select a plant card");
      return;
    }

    const response = await fetch(`/api/openai`, {
      method: "POST",
      body: JSON.stringify({
        plant: plantDetectResults[selectedCard].species.scientificName,
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    if (response.error) return;

    const parsedResult = response.success;
    console.log(parsedResult);
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

    //upload the post
    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
  }).then((res) => res.json());

    if (response.error) {
      alert("Error uploading post. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
  }

  const handleCheckbox = (e: any) => {
    setDetectChecked(!detectChecked);
  };

  return (
    <div
      className={`grid gap-4 shadow-lg bg-surface border border-border p-8 rounded-xl min-h-[656px] transition-all duration-300 ${
        loadingResult || plantDetectResults.length !== 0
          ? "grid-cols-5"
          : "grid-cols-2"
      }`}
    >
      <form
        action={handleFileSelect}
        className="col-span-2 bg-surface p-6 rounded-xl text-left transition-all duration-300"
      >
        <label className="block mb-4">
          <span className="text-text font-medium">Upload a photo</span>
          <input
            type="file"
            name="files"
            accept="image/jpeg,video/*,image/png"
            className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 file:rounded-full file:shadow-md file:bg-primary file:border-0 file:text-white file:text-sm file:py-2 file:px-4 file:font-sans hover:file:bg-primaryDark cursor-pointer transition"
            multiple
            required
          />
        </label>
        <label className="block cursor-pointer mb-4">
          <span className="text-text font-medium">Plant Detection</span>
          <input
            type="checkbox"
            value=""
            disabled
            className="appearance-none sr-only peer"
            onChange={handleCheckbox}
            checked={detectChecked}
          />
          <div className="relative w-11 h-6 bg-border rounded-full peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:bg-primary transition">
            <div className={`absolute top-0.5 left-1 bg-background border border-border rounded-full h-5 w-5 transition-all ${detectChecked ? 'translate-x-5 border-primary' : ''}`}></div>
          </div>
          <p className="text-sm mt-1">
            <span className="text-muted outline-none">
              <span className="mr-1">&#x24D8;</span>Will detect the plant species in future releases
            </span>
          </p>
        </label>
        <label className="block text-left w-full mb-4">
          <span className="text-text font-medium">Title</span>
          <input
            className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            type="text"
            name="title"
            placeholder="Title"
            maxLength={50}
            required
          />
        </label>
        <label className="block text-left w-full mb-4">
          <span className="text-text font-medium">Body</span>
          <TextArea
            textValue={bodyText}
            setTextValue={setBodyText}
            name="body"
            className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            placeholder="Body"
            required={true}
          />
        </label>
        <button
          type="submit"
          className="inline-block text-center bg-primary text-white border border-primary rounded-md px-6 py-2 font-semibold hover:bg-primaryDark hover:text-white transition disabled:text-muted disabled:border-border disabled:bg-surface mt-2"
          disabled={loading}
        >
          Create post
        </button>
        {loading && <Loading />}
      </form>
      {(loadingResult || plantDetectResults.length !== 0) && (
        <div className="col-span-1 flex flex-col justify-center items-center">
          {loadingResult ? (
            <>
              <Loading />
              <p className="text-muted mt-2">Analyzing...</p>
            </>
          ) : (
            plantDetectResults.length !== 0 && (
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-lg text-text font-semibold mb-2">Select a match</h1>
                <button
                  onClick={retrievePlantDetails}
                  className="p-2 bg-primary text-white rounded-md border border-primary hover:bg-primaryDark transition duration-150"
                >
                  Retrieve details
                </button>
                <span className="text-error mt-2">{plantDetailError}</span>
              </div>
            )
          )}
        </div>
      )}
      {(loadingResult || plantDetectResults.length !== 0) && (
        <div className="col-span-2 overflow-scroll p-4 border-l border-border">
          {loadingResult && skeletonDiv}

          {plantDetectResults.length !== 0 &&
            plantDetectResults.map((result: any, index: number) => {
              return (
                <div
                  className={`bg-surface text-text p-4 rounded-md shadow-md text-left mb-4 border border-border flex flex-row hover:bg-primary/10 transition duration-150 cursor-pointer ${
                    selectedCard === index ? "bg-primary/10 border-primary" : ""
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
                    priority={index in [0, 1, 2, 3]}
                    width="100"
                    height="100"
                    className="rounded-md h-auto inline-block w-[100px]"
                  />
                  <div className="flex-grow text-left flex flex-col pl-4">
                    <span className="font-semibold">
                      {result.species.commonNames.length !== 0
                        ? `${result.species.scientificName}, or "${result.species.commonNames[0]}"`
                        : `${result.species.scientificName}`}
                    </span>
                    <p className="text-muted">Some information about the plant...</p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
