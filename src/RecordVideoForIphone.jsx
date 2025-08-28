
import Webcam from "react-webcam";
import {CAMERA_STATUS, useRecordWebcam} from "react-record-webcam";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { isEmpty } from "./utils/utils";
import TailSpin from "./Loader/TailSpin";
const RecordVideoForIphone = ({
    webcamRef,
    videoURL,
    isRecording,
    loading,
    uploadingVideo,
    timer,
    startRecording = () => {},
    texto = "",
    isBlock,
    setUploadErrors,
  }) => {

    // const videoContrainsts = {
    //     playsInline: false
    // }
  
    const isButtonDisabled = useMemo(() => {
      return isRecording;
    }, [isRecording, loading]);
    
  
    const showLoadingSpin = useMemo(() => {
      return !isRecording && (loading || uploadingVideo);
    }, [isRecording, loading, uploadingVideo]);
  
    return (
      <>
        {!isEmpty(texto) && (
          <span
            style={{
              overflowWrap: "break-word",
            }}
          >
            {texto}
          </span>
        )}
        {videoURL ? (
          <video 
            src={videoURL} 
            style={{
              width: "100%",
              transform: "translateY(15px)",
              display: `${
                !isRecording
                  ? "block"
                  : "none"
              }`,
            }}
            controls
          />
        ) : (
          <Webcam ref={webcamRef}/>
        )}
        <button
          id={"button-continue-selfie-process"}
          className={`btn mt-1 ${!isButtonDisabled && "btn__solid"} `}
          style={{
            cursor: isButtonDisabled || isBlock && "not-allowed",
          }}
          onClick={() => {
            setUploadErrors(null);
            startRecording();
          }}
          disabled={
            isButtonDisabled || isBlock || showLoadingSpin
          }
        >
          {isRecording ? (
            timer
          ) : (
            <span className="flex justify-content-center align-items-center gap-sm">
              Continuar
              {showLoadingSpin || isBlock && (
                <TailSpin
                  arialLabel="loading-indicator"
                  color={"white"}
                  width={15}
                  height={15}
                  radius={1}
                />
              )}
            </span>
          )}
        </button>
      </>
    );
  };

  export default RecordVideoForIphone