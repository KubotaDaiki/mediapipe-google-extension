// main.jsで拡張機能のリソースにアクセスできるよう、パスをストレージに格納
sessionStorage.setItem("extension_root_path", chrome.runtime.getURL("/"));

// video要素を作成
let videoElement = document.createElement("video");
videoElement.id = "input_video";
videoElement.style.display = "none";

// canvas要素を作成
let canvasElement = document.createElement("canvas");
canvasElement.id = "output_canvas";
canvasElement.width = "160";
canvasElement.height = "120";
canvasElement.style = "position:fixed; top:0; right:0; z-index:10000;";

// video要素とcanvas要素をHTMLに追加
document.body.appendChild(videoElement);
document.body.appendChild(canvasElement);

// サイトのheadを取得
const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;

// ライブラリをhtmlに挿入
const library1 = document.createElement("script");
library1.setAttribute(
  "src",
  chrome.runtime.getURL("resources/drawing_utils.js")
);
head.insertBefore(library1, head.lastChild);

const library2 = document.createElement("script");
library2.setAttribute("src", chrome.runtime.getURL("resources/hands.js"));
head.insertBefore(library2, head.lastChild);

const library3 = document.createElement("script");
library3.setAttribute(
  "src",
  chrome.runtime.getURL("resources/vision_bundle.js")
);
library3.setAttribute("type", "modele");
head.insertBefore(library3, head.lastChild);

// main.js（手の形状認識を行うscript）をhtmlに挿入
const mainScript = document.createElement("script");
mainScript.setAttribute("type", "module");
mainScript.setAttribute("src", chrome.runtime.getURL("main.js"));
head.insertBefore(mainScript, head.lastChild);

// main.jsの動作情報をbackground.jsに流す
setInterval(function () {
  const moveMessage = sessionStorage.getItem("move_message");
  if (moveMessage) {
    const getMessage = function () {
      return moveMessage;
    };

    chrome.runtime.sendMessage(getMessage(), function (response) {
      return true;
    });
    sessionStorage.setItem("move_message", "");
  }
}, 10);

// popup.jsの情報をmain.jsに流す
let switching = -1;
setInterval(function () {
  chrome.storage.local.get("enableToggle", function (value) {
    let value_data = value.enableToggle;

    if (value_data != switching) {
      sessionStorage.setItem("sessionEnableToggle", value_data);
      switching = value_data;
    }
  });
}, 500);
