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
import PlantInfoCard from "./PlantInfoCard";

type UploadFormState = {
  files: File[];
  title: string;
  body: string;
  detect: boolean;
};

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
  const [formState, setFormState] = useState<UploadFormState>({
    files: [],
    title: "",
    body: "",
    detect: false,
  });
  const [hideDetectionDiv, setHideDetectionDiv] = useState<boolean>(true);
  const [loadingResult, setLoadingResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [plantDetectResults, setPlantDetectResults] = useState<any>([]);
  const [plantDetailError, setPlantDetailError] = useState<string>("");
  const [plantDetails, setPlantDetails] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      setHideDetectionDiv(false);

      setFormState((prev) => ({
        ...prev,
        files: Array.from(files),
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormState((prev) => ({
        ...prev,
        detect: checked,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    const data = new FormData();

    formState.files.forEach((file) => {
      data.append("files", file);
    });

    data.append("title", formState.title);
    data.append("body", formState.body);

    await postUpload(data);
  };

  const detectPlants = async () => {
    setLoadingResult(true);
    setPlantDetectResults([]);

    console.log(formState);

    const formData = new FormData();
    formState.files.forEach((file) => {
      formData.append("files", file);
    })

    const plantDetectionResponse = await fetch(`/api/plant-detection`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => res.success)
      .catch((error) => error);

      console.log(plantDetectionResponse);

    const plantResults = plantDetectionResponse.results;
    //console.log(plantResults);
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

    setLoading(true);
    setPlantDetails(null);

    const response = await fetch(`/api/openai`, {
      method: "POST",
      body: JSON.stringify({
        plant: plantDetectResults[selectedCard].species.scientificName,
      }),
    })
      .then((res) => res.json())
      .catch((e) => console.log(e));

    if (response.error) return;

    const plantDetailsResponse = response.success;
    setPlantDetails(JSON.parse(plantDetailsResponse));
    setLoading(false);
  };

  const postUpload = async (formData: FormData) => {
    setLoading(true);
    const originalFiles = formData.getAll("files") as File[];

    console.log(originalFiles);
    console.log(formData);

    // Filter out the empty file - if no file is uploaded, an empty octet-stream gets uploaded, so filtering and checking if length === 0 is needed
    const files = originalFiles.filter((file) => file.size !== 0);

    if (files.length > 10) {
      alert("Maximum of 10 images/videos allowed.");
      setLoading(false);
      return;
    }

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
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex flex-row justify-between w-full shadow-lg bg-surface border border-border p-8 rounded-xl max-h-[656px] transition-all duration-300`}
      >
        <form
          onSubmit={handleSubmit}
          className=" bg-surface p-6 rounded-xl text-left transition-all duration-300"
        >
          <label className="block mb-4">
            <span className="text-text font-medium">Upload a photo</span>
            <input
              type="file"
              name="files"
              onChange={handleChange}
              accept="image/jpeg,video/*,image/png"
              className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 file:rounded-full file:shadow-md file:bg-primary file:border-0 file:text-white file:text-sm file:py-2 file:px-4 file:font-sans hover:file:bg-primaryDark cursor-pointer transition-all duration-300"
              multiple
            />
          </label>
          <label
            className={`block mb-4 ${hideDetectionDiv ? "h-0 hidden" : ""} transition`}
          >
            <span className="text-text font-medium">Plant Detection</span>
            <input
              type="checkbox"
              value=""
              className="appearance-none sr-only peer"
              onChange={handleChange}
              checked={formState.detect}
            />
            <div className="relative w-11 h-6 bg-border rounded-full peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:bg-primary transition">
              <div
                className={`absolute top-0.5 left-1 bg-background border border-border rounded-full h-5 w-5 transition-all ${formState.detect ? "translate-x-5 border-primary" : ""}`}
              ></div>
            </div>
            <p className="text-sm mt-1">
              <span className="text-muted outline-hidden">
                <span className="mr-1">&#x24D8;</span>Will detect the plant
                species in future releases
              </span>
            </p>
          </label>
          <label className="block text-left w-full mb-4">
            <span className="text-text font-medium">Title</span>
            <input
              className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary transition"
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="Title"
              maxLength={50}
              required
            />
          </label>
          <label className="block text-left w-full mb-4">
            <span className="text-text font-medium">Body</span>
            <TextArea
              textValue={formState.body}
              setTextValue={(val: string) =>
                setFormState((prev) => ({ ...prev, body: val }))
              }
              name="body"
              className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary transition"
              placeholder="Body"
              required={true}
            />
          </label>
          <div className="flex flex-row justify-between">
            <button
              onClick={() => detectPlants()}
              className=" text-center bg-primary text-white border border-primary rounded-md px-6 py-2 font-semibold hover:bg-primaryDark hover:text-white transition disabled:text-muted disabled:border-border disabled:bg-surface"
              disabled={loading}
              hidden={!formState.detect}
            >
              Identify plants
            </button>
            <button
              type="submit"
              className=" text-center bg-primaryDark text-white border border-primaryDark rounded-md px-6 py-2 font-semibold hover:bg-primary hover:border-primary hover:text-white transition disabled:text-muted disabled:border-border disabled:bg-surface"
            >
              Create post
            </button>
            {/* {loading && <Loading />} */}
          </div>
        </form>
        {(loadingResult || plantDetectResults.length !== 0) && (
          <div className="flex flex-col justify-center items-center">
            {loadingResult || loading ? (
              <>
                <Loading />
                <p className="text-muted mt-2">Analyzing...</p>
              </>
            ) : (
              plantDetectResults.length !== 0 && (
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-lg text-text font-semibold mb-2">
                    Select a card
                  </h1>
                  <button
                    onClick={retrievePlantDetails}
                    className="p-2 bg-primary text-white rounded-md border border-primary hover:bg-primaryDark transition duration-150 disabled:bg-primary/50 disabled:border-primary/50 disabled:hover:bg-primary/50"
                    disabled={
                      plantDetails !== null &&
                      selectedCard !== null &&
                      plantDetectResults[selectedCard].species
                        .scientificNameWithoutAuthor ===
                        plantDetails.genus + " " + plantDetails.species
                    }
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
          <div className="overflow-scroll p-4 border-l border-border w-[33%]">
            {loadingResult && skeletonDiv}

            {plantDetectResults.length !== 0 &&
              plantDetectResults.map((result: any, index: number) => {
                return (
                  <div
                    className={`bg-surface text-text p-4 rounded-md shadow-md text-left mb-4 border border-border flex flex-row hover:bg-primary/10 transition duration-150 cursor-pointer ${
                      selectedCard === index
                        ? "bg-primaryDark border-primary ring-2 ring-primaryDark"
                        : ""
                    }`}
                    key={result.gbif.id}
                    onClick={() =>
                      selectedCard === index
                        ? setSelectedCard(null)
                        : setSelectedCard(index)
                    }
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
                    <div className="grow text-left flex flex-col pl-4">
                      <span className="font-semibold">
                        {result.species.commonNames.length !== 0
                          ? `"${result.species.commonNames[0]}" - ${result.species.scientificNameWithoutAuthor}`
                          : `${result.species.scientificNameWithoutAuthor}`}
                      </span>
                      <p className="text-muted">
                        Some information about the plant...
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {loading && (
        <div className="w-full shadow-lg bg-surface border border-border p-8 rounded-xl">
          <span>Retrieving plant details...</span>
        </div>
      )}
      {plantDetails && (
        <div className="w-full">
          <PlantInfoCard plant={plantDetails} />
          {/* <p>{JSON.stringify(plantDetails)}</p> */}
        </div>
      )}
    </div>
  );
}
