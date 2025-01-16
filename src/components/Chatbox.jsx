import { useEffect, useRef, useState } from "react";
import InputField from "./InputField";
import QuestionCard from "./QuestionCard";
import ToggleButton from "./ToggleButton";
import secondaryLogo from "/src/assets/secondary_logo.png";
import axios from "axios";
import { SuggestedQuestions } from "../data/SuggestedQuestion";
import PdfResponseTab from "./PdfResponseTab";
import FileUploader from "./FileUploader";
import {
  ContentCopy,
  DeleteOutlined,
  DocumentScannerOutlined,
  LightbulbOutlined,
  RestartAlt,
} from "@mui/icons-material";
import { openAiData } from "../data/fileData";

const apiUrl =
  "https://func-openai-search-horizontal-oab6ubcanjfby-a3dq.azurewebsites.net/api/chat";
// const apiUrl =
//   "https://raw.githubusercontent.com/tejasghlade/json_data_api_test/main/zim_demo_get_api";

const Chatbot = () => {
  const [AiChating, setAiChating] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [pdfUploadActive, setPdfUploadActive] = useState(false);
  const [activePdfViewCitationName, setActivePdfViewCitationName] =
    useState(null);
  const [PdfResponseTabActiveId, setPdfResponseTabActiveId] = useState(null);
  const [pdfResponseActive, setPdfResponseActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // const addValueToAiChating = async () => {
  //   const myHeaders = new Headers();

  //   // simulateLoading();

  //   // todo :: extract pdf files
  //   function extractPDFFilesFromDataPoints(dataPoints) {
  //     const pdfFiles = [];
  //     const regex = /[^ ]+\.pdf/g; // Updated regex to match PDF file names even with spaces

  //     dataPoints?.forEach((dataPoint) => {
  //       const matches = dataPoint.match(regex);

  //       if (matches) {
  //         pdfFiles.push(...matches);
  //       }
  //     });

  //     return pdfFiles;
  //   }

  //   if (textFieldValue.trim() === "") {
  //     return; // Don't add empty values
  //   }

  //   // Define the POST data
  //   // const postData = {
  //   //   history: [
  //   //     {
  //   //       user: textFieldValue,
  //   //     },
  //   //   ],
  //   //   approach: "rrr",
  //   //   overrides: {},
  //   //   index: "zim-index",
  //   //   industry: "default",
  //   //   container: "zim-container",
  //   //   enableExternalDomain: false,
  //   // };

  //   const raw = JSON.stringify({
  //     history: [
  //       {
  //         user: "What is zim?",
  //       },
  //     ],
  //     approach: "rrr",
  //     overrides: {},
  //     index: "prod-responsibleai-search",
  //     industry: "default",
  //     container: "knowledge-base-responsibleai",
  //     enableExternalDomain: false,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     // mode: 'no-cors', // Set the mode to 'no-cors'
  //     redirect: "follow",
  //   };

  //   // Define the API endpoint
  //   // const apiUrl = "https://func-openai-search-002.azurewebsites.net/api/chat";

  //   // Send a POST request
  //   await axios
  //     .get(apiUrl, requestOptions)
  //     .then(async (response) => {
  //       // Handle the response data
  //       // console.log("Response data:", response.data);

  //       const newId = response ? AiChating.length + 1 : 100;

  //       // Log the contents of data_points
  //       // console.log("Data Points:", response?.data?.data_points);

  //       // Extract and log the PDF files

  //       // console.log("PDF Files:", pdfFiles);

  //       const newEntry = {
  //         id: newId,
  //         prompt: textFieldValue,
  //         response: await response?.json(),
  //         // response: openAiData?.questions
  //         //   ?.filter((file) => file.question == textFieldValue)
  //         //   .map((item) => item.response)[0],
  //       };

  //       (newEntry["pdfFiles"] = await extractPDFFilesFromDataPoints(
  //         newEntry?.response?.data_points
  //       )),
  //         // console.log(newEntry?.pdfFiles);
  //         // Update AiChating with the newEntry
  //         setAiChating([...AiChating, newEntry]);
  //       setTextFieldValue(""); // Clear the text field after adding the value
  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       console.error("An error occurred:", error);
  //     });
  // };

  openAiData.questions.filter((file) => file.question === textFieldValue);

  // todo ::  fetch from local

  console.log(AiChating);

  function onPdfActiveResponse(id, tabId) {
    const idObject = {
      id: id,
      tabId: tabId,
    };

    console.log();
    setPdfResponseTabActiveId(idObject);
    onPdfReferenceOpen();
  }

  function onCopy(prompt) {
    setTextFieldValue(prompt);
  }

  function onRepeat(prompt) {
    setTextFieldValue(prompt);
    // handleClick();
  }

  function onClearChat() {
    setAiChating([]);
    setPdfResponseTabActiveId(null);
    setPdfUploadActive(false);
    setPdfResponseActive(false);
  }

  function onPdfReferenceOpen() {
    setPdfResponseActive(true);
  }

  // Example usage:

  // function onCopy() {}
  // function onRefetch() {}
  // function onShowThoughtProcess() {}
  // function onShowSupportingContent() {}
  // function onShowCitationPdf() {}
  // function onClearChat() {}

  // const pdfLinks = text.match(/\[.*?\.pdf\]/g);

  // todo :: extract pdf files
  function extractPDFFilesFromDataPoints(dataPoints) {
    const pdfNames = dataPoints
      .map((item) => {
        const colonIndex = item.indexOf(":");
        if (colonIndex !== -1) {
          return item.substring(0, colonIndex).trim();
        }
        return null;
      })
      .filter(Boolean);

    return pdfNames;
  }

  const handleClick = async () => {
    try {
      setLoading(true);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        history: [
          {
            user: textFieldValue,
          },
        ],
        approach: "rrr",
        overrides: {},
        index: "prod-responsibleai-search",
        industry: "default",
        container: "knowledge-base-responsibleai",
        enableExternalDomain: false,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const newId = result ? AiChating.length + 1 : 100;
      const newEntry = {
        id: newId,
        prompt: textFieldValue,
        response: result,
      };

      newEntry["pdfFiles"] = extractPDFFilesFromDataPoints(
        newEntry.response.data_points
      );
      setAiChating([...AiChating, newEntry]);
      setLoading(false);
      setTextFieldValue("");
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  };
  const firstElementRef = useRef();
  const secondElementRef = useRef();

  useEffect(() => {
    const firstElement = firstElementRef.current;
    const secondElement = secondElementRef.current;

    const handleResize = () => {
      if (firstElement && secondElement) {
        const firstElementHeight = firstElement.clientHeight;
        secondElement.style.height = `${firstElementHeight}px`;
      }
    };

    handleResize(); // Set initial height on mount

    // Listen for changes in the first element's height
    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up the event listener on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex  w-full justify-center flex-row  items-start gap-5 ps-3">
      <div
        ref={firstElementRef}
        className="!min-w-[70%] !max-w-[70%]  bg-opacity-80 bg-slate-900 rounded-2xl shadow border-[2px] border-white  "
      >
        <div className="flex  justify-center flex-col items-center gap-5 p-5">
          {AiChating.length === 0 && (
            <div className="flex   justify-center flex-col items-center gap-5 ">
              <img
                className="h-16 w-16"
                src={secondaryLogo}
                alt="secondary logo"
              />
              <div className=" text-center font-magistralBold text-white text-4xl  ">
                {/* Shipping Companion */}
                Zim International Shipping & Cargo
              </div>
              <div className="text-center font-magistral text-white text-2xl  ">
                Ask me something
              </div>

              {/* todo :: suggesting qustions  */}

              {!pdfUploadActive && AiChating.length === 0 && (
                <div className="flex gap-4">
                  {SuggestedQuestions.map((ques) => (
                    <QuestionCard
                      key={ques.id}
                      question={ques.question}
                      value={textFieldValue}
                      setValue={setTextFieldValue}
                      submitFunction={handleClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/*  todo :: chatting responses */}

          {/* chatting */}
          {AiChating?.map((chat) => (
            <>
              <div className="bg-neutral-200 w-[70%] rounded-lg self-end p-3">
                <div className="flex justify-end gap-2">
                  <ContentCopy
                    onClick={() => onCopy(chat?.prompt)}
                    className="cursor-pointer"
                    fontSize="small"
                  />
                  <RestartAlt
                    type="submit"
                    onClick={() => onRepeat(chat?.prompt)}
                    className="cursor-pointer"
                    fontSize="small"
                  />
                </div>
                <div className=" text-black p-3 text-md font-bold font-magistral tracking-widest ">
                  {chat?.prompt}
                </div>
              </div>
              <div className="bg-neutral-200 w-[95%] rounded-lg self-start p-3">
                {/* Generating answer */}
                <div className="flex justify-end gap-2 ">
                  <LightbulbOutlined
                    onClick={() => onPdfActiveResponse(chat?.id, 0)}
                    className="cursor-pointer "
                    fontSize="small"
                  />
                  <DocumentScannerOutlined
                    onClick={() => onPdfActiveResponse(chat?.id, 1)}
                    className="cursor-pointer"
                    fontSize="small"
                  />
                </div>

                <div className=" text-black p-3 text-md font-bold font-magistral tracking-widest ">
                  {/* <DotLoader /> */}
                  {chat?.response?.answer
                    ? chat?.response?.answer
                    : "Generate response ..."}
                  {/* {chat?.response?.answer} */}
                  {/* {chat?.answer} */}
                  {/* {JSON.stringify(chat)} */}

                  {/* {!loading && chat?.response?.answer} */}
                  {/* {!loading &&
                    !chat?.response?.answer &&
                    "I'm sorry, but I can't answer the questions which are not related to the document. As an AI language model, I don't have access to information unless you provide it to me. How may I assist you with enterprise documents?"} */}
                </div>
                <div className="flex gap-2 px-3 flex-wrap">
                  <span className="font-bold text-sm">Citations :</span>

                  {chat?.pdfFiles?.map((item, index) => (
                    <div
                      onClick={() => {
                        setActivePdfViewCitationName(item);
                        onPdfActiveResponse(chat?.id, 2);
                      }}
                      key={index}
                      className="bg-blue-200 text-sm font-bold font-magistral tracking-widest  px-3 rounded hover:underline cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                  {/* <div className="bg-blue-200 px-3 rounded hover:underline">
                    1. English Leaflet - Farm pond-3.pdf
                  </div>
                  <div className="bg-blue-200 px-3 rounded hover:underline">
                    1. English Leaflet - Farm pond-3.pdf
                  </div> */}
                </div>
              </div>
            </>
          ))}

          {/* FIle uploader  */}

          {/* Second file uploader */}
          {pdfUploadActive && <FileUploader />}

          {/* inputs */}
          {/* <span>{textFieldValue}</span> */}
          <InputField
            loading={loading}
            value={textFieldValue}
            setValue={setTextFieldValue}
            submitFunction={handleClick}
          />

          {/* <button className="text-white bg-red-500 p-5" onClick={handleClick}>
            Add Value
          </button> */}
          {/* toggle */}
          <div className="w-full flex justify-between items-center">
            <ToggleButton
              value={pdfUploadActive}
              setValue={setPdfUploadActive}
            />

            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={onClearChat}
            >
              <DeleteOutlined fontSize="medium" className="!fill-white" />
              <span className="text-white font-magistral text-sm tracking-widest font-bold">
                Clear Chat
              </span>
            </div>
            {/* <ToggleSwitch checked={pdfUploadActive} label="Toggle me" onChange={setPdfUploadActive} /> */}
          </div>
        </div>
      </div>

      {pdfResponseActive && (
        <div
          ref={secondElementRef}
          className="!w-[30%]     bg-opacity-80 bg-slate-900 rounded-2xl shadow border-[2px]  border-white "
        >
          <PdfResponseTab
            activeIds={PdfResponseTabActiveId}
            activePdf={activePdfViewCitationName}
            response={AiChating}
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
