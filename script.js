// hand_detection.jsに必要なvideo要素を作成
let videoElement = document.createElement("video");
videoElement.id = "input_video";
videoElement.style.display = "none";

// hand_detection.jsに必要なcanvas要素を作成
let canvasElement = document.createElement("canvas");
canvasElement.id = "output_canvas";
canvasElement.width = "160";
canvasElement.height = "120";
canvasElement.style = "position:fixed; top:0; right:0; z-index:10000;";

// video要素とcanvas要素をHTMLに追加
document.body.appendChild(videoElement);
document.body.appendChild(canvasElement);

let libraryPaths = [
  "resources/drawing_utils.js",
  "resources/hands.js",
  "resources/camera_utils.js",
  "hand_detection.js",
];
// ライブラリとhand_detection.jsをHTMLに追加
for (const libraryPath of libraryPaths) {
  const library = document.createElement("script");
  library.setAttribute("src", chrome.runtime.getURL(libraryPath));
  document.head.appendChild(library);
}

// popupのトグル情報ををhand_detection.jsに送る用のHTML要素を生成
let enableToggleElement = document.createElement("p");
enableToggleElement.id = "enableToggle";
chrome.storage.local.get("enableToggle", function (value) {
  enableToggleElement.setAttribute("value", value.enableToggle);
});
document.body.appendChild(enableToggleElement);

// popupのトグル情報ををhand_detection.jsに送る用のHTML要素を生成
let videoToggleElement = document.createElement("p");
videoToggleElement.id = "videoToggle";
chrome.storage.local.get("videoToggle", function (value) {
  videoToggleElement.setAttribute("value", value.videoToggle);
});
document.body.appendChild(videoToggleElement);

// popupのトグル情報をhand_detection.jsに送る
chrome.storage.onChanged.addListener(function (changes, ns) {
  if (changes.enableToggle) {
    enableToggleElement.setAttribute("value", changes.enableToggle.newValue);
  } else if (changes.videoToggle) {
    videoToggleElement.setAttribute("value", changes.videoToggle.newValue);
  }
  // console.log(changes);
});

// hand_detection.jsの動作情報をbackgroundに送るためのHTML要素
let moveMessageElement = document.createElement("p");
moveMessageElement.id = "moveMessage";
document.body.appendChild(moveMessageElement);

// hand_detection.jsの情報をbackgroundに送る
const observer = new MutationObserver((records) => {
  const moveMessage = moveMessageElement.getAttribute("value");
  const getMessage = function () {
    return moveMessage;
  };

  chrome.runtime.sendMessage(getMessage(), function (response) {
    return true;
  });
});
// DOMの変化を監視
observer.observe(moveMessageElement, {
  attributes: true,
});
