import {
  HandLandmarker,
  FilesetResolver,
} from "chrome-extension://cljpmlcbcbegfdiceefolbifhbngoefm/resources/tasks-vision@0.10.0.js";

const init = async () => {
  const video = document.getElementById("input_video");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error("Error accessing the camera: ", error);
      });
  } else {
    alert("Sorry, your browser does not support the camera API.");
  }

  const vision = await FilesetResolver.forVisionTasks(
    // path/to/wasm/root
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "chrome-extension://cljpmlcbcbegfdiceefolbifhbngoefm/resources/hand_landmarker.task", //.taskファイルを指定する
      delegate: "CPU", //CPU or GPUで処理するかを指定する
    },
    numHands: 1, //認識できる手の数
  });

  await handLandmarker.setOptions({ runningMode: "video" });

  let lastVideoTime = -1;

  let prevX = null;
  let prevY = null;
  const threshold = 0.01;
  const distThreshold = 0.05;

  const renderLoop = () => {
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    let startTimeMs = performance.now();
    if (video.currentTime > 0 && video.currentTime !== lastVideoTime) {
      const results = handLandmarker.detectForVideo(video, startTimeMs);
      lastVideoTime = video.currentTime;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        video,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });

          const tip0 = landmarks[5];
          const tip1 = landmarks[6];
          const tip2 = landmarks[7];

          const angle =
            (((tip0.x - tip1.x) * (tip2.x - tip1.x) +
              (tip0.y - tip1.y) * (tip2.y - tip1.y) +
              (tip0.z - tip1.z) * (tip2.z - tip1.z)) /
              (Math.sqrt(
                (tip0.x - tip1.x) ** 2 +
                  (tip0.y - tip1.y) ** 2 +
                  (tip0.z - tip1.z) ** 2
              ) *
                Math.sqrt(
                  (tip2.x - tip1.x) ** 2 +
                    (tip2.y - tip1.y) ** 2 +
                    (tip2.z - tip1.z) ** 2
                ))) *
            -1;
          const radian = Math.acos(angle);
          const degree = radian * (180 / Math.PI);

          if (degree > 60) {
            prevX = null;
            prevY = null;
            console.log("手が閉じています");
          } else {
            console.log("手が空いています");
            if (prevX && prevY) {
              const x_dist = landmarks[0].x - prevX;
              const y_dist = landmarks[0].y - prevY;
              console.log(x_dist);
              if (x_dist < -1 * threshold) {
                console.log("手が右に移動しました");
              } else if (x_dist > threshold) {
                console.log("手が左に移動しました");
              }

              if (y_dist < -1 * distThreshold) {
                console.log("手が上に移動しました");
              } else if (y_dist > distThreshold) {
                console.log("手が下に移動しました");
              }
            }

            prevX = landmarks[0].x;
            prevY = landmarks[0].y;
          }
        }
      }
      canvasCtx.restore();
    }

    requestAnimationFrame(() => {
      renderLoop();
    });
  };

  renderLoop();
};

init();
