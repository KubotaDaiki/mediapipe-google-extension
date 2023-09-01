const video = document.getElementById("input_video");
const canvas = document.getElementById("output_canvas");
const ctx = canvas.getContext("2d");
const videoToggle = document.getElementById("videoToggle");
const enableToggle = document.getElementById("enableToggle");

// canvasを左右反転
ctx.scale(-1, 1);
ctx.translate(-canvas.width, 0);

const config = {
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
};
const hands = new Hands(config);
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 160,
  height: 120,
});

let prevX = null;
let prevY = null;

// 手の移動における閾値
const threshold = 0.1;
const distThreshold = 0.5;

hands.onResults((results) => {
  const vToggle = videoToggle.getAttribute("value");
  if (vToggle == 1) {
    hideCanvas();
  } else {
    showCanvas();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log(results.image);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach((landmarks) => {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 1,
      });
      const degree = calculateDegree(landmarks);
      if (degree > 60) {
        prevX = null;
        prevY = null;
        // console.log("手が閉じています");
      } else {
        // console.log("手が空いています");
        if (prevX && prevY) {
          const x_dist = landmarks[0].x - prevX;
          const y_dist = landmarks[0].y - prevY;
          // console.log(x_dist);
          if (x_dist < -1 * threshold) {
            // console.log("手が右に移動しました");
            sessionStorage.setItem("move_message", "0");
          } else if (x_dist > threshold) {
            // console.log("手が左に移動しました");
            sessionStorage.setItem("move_message", "1");
          }

          if (y_dist < -1 * distThreshold) {
            // console.log("手が上に移動しました");
          } else if (y_dist > distThreshold) {
            // console.log("手が下に移動しました");
          }
        }

        prevX = landmarks[0].x;
        prevY = landmarks[0].y;
      }
    });
  }
});

// ベクトル間の角度を計算する関数
function calculateDegree(landmarks) {
  const tip0 = landmarks[5];
  const tip1 = landmarks[6];
  const tip2 = landmarks[7];

  const angle =
    (((tip0.x - tip1.x) * (tip2.x - tip1.x) +
      (tip0.y - tip1.y) * (tip2.y - tip1.y) +
      (tip0.z - tip1.z) * (tip2.z - tip1.z)) /
      (Math.sqrt(
        (tip0.x - tip1.x) ** 2 + (tip0.y - tip1.y) ** 2 + (tip0.z - tip1.z) ** 2
      ) *
        Math.sqrt(
          (tip2.x - tip1.x) ** 2 +
            (tip2.y - tip1.y) ** 2 +
            (tip2.z - tip1.z) ** 2
        ))) *
    -1;
  const radian = Math.acos(angle);
  const degree = radian * (180 / Math.PI);
  return degree;
}

// オブザーバーの作成
const observer = new MutationObserver((records) => {
  if (enableToggle.getAttribute("value") == 1) {
    showCanvas();
    camera.start();
  } else {
    camera.stop();
    // 即座にcanvasを消すとなんか上書きされて正常に動作しないので0.1秒おく（多分camera.stopのせい）
    setTimeout(function () {
      hideCanvas();
    }, 100);
  }
});
// 監視の開始
observer.observe(enableToggle, {
  attributes: true,
});

function showCanvas() {
  canvas.setAttribute(
    "style",
    "position:fixed; top:0; right:0; z-index:10000;"
  );
}

function hideCanvas() {
  canvas.setAttribute("style", "visibility:hidden;");
}
