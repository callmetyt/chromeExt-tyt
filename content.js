(() => {
  // 一些常量
  const DELAY = 100;
  const FOCUS_CLASSNAME = "tyt-focus-box";
  // 节流函数
  const thorret = (fn, delay) => {
    let timer = null;
    return (...args) => {
      if (!timer) {
        fn(args);
        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
        }, delay);
      }
    };
  };
  // 标识节点
  function changeCurNode(node) {
    if (node) {
      node.classList.add(FOCUS_CLASSNAME);
    }
    if (lastNode) {
      lastNode.classList.remove(FOCUS_CLASSNAME);
    }
    lastNode = node;
  }
  // 文本粘贴函数
  async function tryToCopy(text) {
    // 尝试系统粘贴板
    await navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("复制成功！");
      })
      .catch(() => {
        alert(
          "写入系统粘贴板失败，请手动粘贴此处文本(已在开发者工具台中打印)",
          text
        );
        // 控制台打印
        console.log(
          "————————————————————————已选定的文本(如下)————————————————————————"
        );
        console.log(text);
        console.log(
          "————————————————————————已选定的文本(如上)————————————————————————"
        );
      });
  }

  // 保存上一节点
  let lastNode = null;
  // MouseMove事件
  const handleMouseMove = thorret((e) => {
    const node = e[0].target;
    // 标识节点
    changeCurNode(node);
  }, DELAY);
  // MouseClick事件
  const handleMouseClick = async (e) => {
    const node = e.target;
    // 移除MouseMove事件
    document.body.removeEventListener("mousemove", handleMouseMove);
    // 标识节点
    changeCurNode(node);
    // 根据mode进行复制
    if (window?.tyt_tool_box_mode) {
      // 多元素文本
      const keyClass = node.classList[0]; // 选取元素的class作为整体查询key
      // 查询所有节点并且拼接innerText
      const text = Array.of(
        ...document.querySelectorAll(`.${keyClass}`)
      ).reduce((pre, cur) => {
        return pre + cur.innerText;
      }, "");
      await tryToCopy(text);
    } else {
      // 单元素文本
      await tryToCopy(node.innerText);
    }
    // 最后移除点击事件
    // changeCurNode(null);
    document.body.removeEventListener("click", handleMouseClick);
  };
  // 监听相应事件
  document.body.addEventListener("mousemove", handleMouseMove);
  document.body.addEventListener("click", handleMouseClick);
})();
