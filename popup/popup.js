//スイッチの外枠とスイッチの要素を取得
const switchOuter = document.querySelector(".switch_outer");
const toggleSwitch = document.querySelector(".toggle_switch");

//enableToggleが1の場合はトグルをあらかじめONにしておく
chrome.storage.local.get("enableToggle", function (value) {
  let value_data = value.enableToggle;
  if (value_data == 1) {
    switchOuter.classList.toggle("active");
    toggleSwitch.classList.toggle("active");
  }
});

switchOuter.addEventListener("click", () => {
  chrome.storage.local.get("enableToggle", function (value) {
    let value_data = value.enableToggle;
    let set_data = -1;
    if (value_data == 1) {
      set_data = 0;
    } else {
      set_data = 1;
    }
    chrome.storage.local.set({ enableToggle: set_data }, function () {});
    console.log(set_data);
  });
  // activeクラスを追加/削除
  switchOuter.classList.toggle("active");
  toggleSwitch.classList.toggle("active");
});
