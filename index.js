// video要素を作成
var videoElement = document.createElement("video");
videoElement.id = "input_video";
videoElement.style.display = "none";

// canvas要素を作成
var canvasElement = document.createElement("canvas");
canvasElement.id = "output_canvas";
canvasElement.width = "1280";
canvasElement.height = "720";

// video要素とcanvas要素をHTMLに追加
document.body.appendChild(videoElement);
document.body.appendChild(canvasElement);


// サイトのheadを取得
const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;

// scriptをインジェクション

const script2 = document.createElement("script");
script2.setAttribute(
  "src",
  chrome.runtime.getURL("resources/drawing_utils.js")
);
head.insertBefore(script2, head.lastChild);

const script3 = document.createElement("script");
script3.setAttribute("src", chrome.runtime.getURL("resources/hands.js"));
head.insertBefore(script3, head.lastChild);

const script4 = document.createElement("script");
script4.setAttribute(
  "src",
  chrome.runtime.getURL("resources/vision_bundle.js")
);
script4.setAttribute("type", "modele");
head.insertBefore(script4, head.lastChild);

const script = document.createElement("script");
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("main.js"));
head.insertBefore(script, head.lastChild);
