// スイッチの外枠とスイッチの要素を取得
const switchOuter1 = document.querySelector("#so1");
const toggleSwitch1 = document.querySelector("#ts1");

// enableToggleが1の場合はトグルをあらかじめONにしておく
chrome.storage.local.get("enableToggle", function (value) {
  let value_data = value.enableToggle;
  if (value_data == 1) {
    switchOuter1.classList.toggle("active");
    toggleSwitch1.classList.toggle("active");
  }
});

// トグルをクリックした際に発火するイベント
switchOuter1.addEventListener("click", () => {
  chrome.storage.local.get("enableToggle", function (value) {
    let value_data = value.enableToggle;
    let set_data = -1;
    if (value_data == 1) {
      set_data = 0;
    } else {
      set_data = 1;
    }
    // hand_detection.jsへ情報を送るために、ストレージに情報をセット
    chrome.storage.local.set({ enableToggle: set_data }, function () {});
    // console.log(set_data);
  });

  // activeクラスを追加/削除
  switchOuter1.classList.toggle("active");
  toggleSwitch1.classList.toggle("active");
});

// スイッチの外枠とスイッチの要素を取得
const switchOuter2 = document.querySelector("#so2");
const toggleSwitch2 = document.querySelector("#ts2");

// videoToggleが1の場合はトグルをあらかじめONにしておく
chrome.storage.local.get("videoToggle", function (value) {
  let value_data = value.videoToggle;
  if (value_data == 1) {
    switchOuter2.classList.toggle("active");
    toggleSwitch2.classList.toggle("active");
  }
});

// トグルをクリックした際に発火するイベント
switchOuter2.addEventListener("click", () => {
  chrome.storage.local.get("videoToggle", function (value) {
    let value_data = value.videoToggle;
    let set_data = -1;
    if (value_data == 1) {
      set_data = 0;
    } else {
      set_data = 1;
    }
    // hand_detection.jsへ情報を送るために、ストレージに情報をセット
    chrome.storage.local.set({ videoToggle: set_data }, function () {});
    // console.log(set_data);
  });
  // activeクラスを追加/削除
  switchOuter2.classList.toggle("active");
  toggleSwitch2.classList.toggle("active");
});
