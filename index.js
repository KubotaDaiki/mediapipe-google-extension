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

let pElement = document.createElement("p");
pElement.id = "move_message";
pElement.style = "display:none;";

// video要素とcanvas要素をHTMLに追加
document.body.appendChild(videoElement);
document.body.appendChild(canvasElement);
document.body.appendChild(pElement);

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

setInterval(function () {
  moveMessage = document.getElementById("move_message");
  if (moveMessage.textContent) {
    const getMessage = function () {
      return moveMessage.textContent;
    };

    chrome.runtime.sendMessage(getMessage(), function (response) {
      return true;
    });
    moveMessage.textContent = "";
  }
}, 10);

let switching = -1;
setInterval(function () {
  chrome.storage.local.get("enableToggle", function (value) {
    let value_data = value.enableToggle;

    if (value_data != switching) {
      if (value_data == 1) {
        sessionStorage.setItem("sessionEnableToggle", "1");
        switching = 1;
        console.log("val1");
      } else if (value_data == 0) {
        sessionStorage.setItem("sessionEnableToggle", "0");
        switching = 0;
        console.log("val0");
      }
    }
    // console.log(value_data);
  });
}, 1000);
