async function t() {
  return (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0];
}

chrome.runtime.onMessage.addListener(function (info, sendResponse) {
  (async function () {
    const tab = await t();
    const arrowDown = {
      type: "keyDown",
      key: "ArrowDown",
      code: "ArrowDown",
      windowsVirtualKeyCode: 40,
      nativeVirtualKeyCode: 40,
      macCharCode: 40,
    };
    const arrowUp = {
      type: "keyDown",
      key: "ArrowUp",
      code: "ArrowUp",
      windowsVirtualKeyCode: 38,
      nativeVirtualKeyCode: 38,
      macCharCode: 38,
    };

    chrome.debugger.attach({ tabId: tab.id }, "1.3");
    if (info == "0") {
      chrome.debugger.sendCommand(
        { tabId: tab.id },
        "Input.dispatchKeyEvent",
        arrowUp
      );
    } else {
      chrome.debugger.sendCommand(
        { tabId: tab.id },
        "Input.dispatchKeyEvent",
        arrowDown
      );
    }
  })();
});
