import React, { useState } from "react";
import Amplify, { Storage, Predictions } from "aws-amplify";

import { Container, Row, Col } from "reactstrap";

import mic from "microphone-stream";
import awsExports from "../aws-exports";

function SearchImage(props) {
  const [searchImage, setSearchImage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  function AudioRecorder(props) {
    const [recording, setRecording] = useState(false);
    const [micStream, setMicStream] = useState();
    const [audioBuffer] = useState(
      (function () {
        let buffer = [];
        function add(raw) {
          buffer = buffer.concat(...raw);
          return buffer;
        }
        function newBuffer() {
          console.log("resetting buffer");
          buffer = [];
        }

        return {
          reset: function () {
            newBuffer();
          },
          addData: function (raw) {
            return add(raw);
          },
          getData: function () {
            return buffer;
          },
        };
      })()
    );

    async function startRecording() {
      console.log("start recording");
      audioBuffer.reset();

      window.navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          const startMic = new mic();

          startMic.setStream(stream);
          startMic.on("data", (chunk) => {
            var raw = mic.toRaw(chunk);
            if (raw == null) {
              return;
            }
            audioBuffer.addData(raw);
          });

          setRecording(true);
          setMicStream(startMic);
        });
    }

    async function stopRecording() {
      console.log("stop recording");
      const { finishRecording } = props;

      micStream.stop();
      setMicStream(null);
      setRecording(false);

      const resultBuffer = audioBuffer.getData();

      if (typeof finishRecording === "function") {
        finishRecording(resultBuffer);
      }
    }

    return (
      <div className="audioRecorder">
        <div>
          {recording && (
            <button className="btn btn-secondary" onClick={stopRecording}>
              <i className="fa fa-microphone-slash" aria-hidden="true"></i>
            </button>
          )}
          {!recording && (
            <button className="btn btn-secondary" onClick={startRecording}>
              <i className="fa fa-microphone" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    );
  }

  function convertFromBuffer(bytes) {
    setSearchImage("Converting text...");

    Predictions.convert({
      transcription: {
        source: {
          bytes,
        },
        language: "en-US",
      },
    })
      .then(({ transcription: { fullText } }) => setSearchImage(fullText))
      .catch((err) => setSearchImage(JSON.stringify(err, null, 2)));
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    props.searchImage(searchImage);
  };
  const handleOnFileChangeByImage = (e) => {
    let selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
  };
  const handleSearchSubmitByImage = (e) => {
    e.preventDefault();
    props.searchImageByImage(selectedFile);
  };

  return (
    <Container>
      <Row>
        <Col className="col-lg-4">
          <i
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <AudioRecorder finishRecording={convertFromBuffer} />
          </i>
        </Col>
        <Col className="col-lg-4">
          <form onSubmit={handleSearchSubmit} className=" form-inline ">
            <input
              // className="form-control"
              type="text"
              value={searchImage}
              onChange={({ target }) => setSearchImage(target.value)}
              placeholder="Search Here..."
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
        </Col>
        <Col className="col-lg-4 ">
          <form onSubmit={handleSearchSubmitByImage}>
            <input type="file" onChange={handleOnFileChangeByImage} />

            <button className="btn btn-primary " type="submit">
              Search by Image
            </button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchImage;
