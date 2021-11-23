// 获取模式数据
window.addEventListener("load", function () {
  chrome.storage.sync.get("mode", ({ mode }) => {
    window.tyt_tool_box_mode = mode;
    // 修改模式展示
    document.querySelector("#mode").checked = mode;
  });
});

// 执行脚本按钮
document.querySelector("#execute").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    files: ["content.js"],
  });
  // 关闭popup
  window.close();
});

// 切换模式按钮
document.querySelector("#mode").addEventListener("change", async (e) => {
  // 保存模式数据
  chrome.storage.sync.set({ mode: e.target.checked });
  // 修改注入页面的模式数据
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    func: setPageMode,
    args: [e.target.checked],
  });
});

function setPageMode(mode) {
  window.tyt_tool_box_mode = mode;
}
