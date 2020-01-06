import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.min.css";

import MediumEditorMultiPlaceholders, {
  defaultText
} from "./MediumEditorMultiPlaceholders";
import MediumEditorAutofocus from "./MediumEditorAutoFocus";

const elements = document.querySelectorAll(".editable");

const editor = new MediumEditor(elements, {
  placeholder: false,
  extensions: {
    multi_placeholder: new MediumEditorMultiPlaceholders({
      placeholders: [
        {
          tag: "p",
          text: "Title"
        },
        {
          tag: "p",
          text: defaultText
        }
      ]
    }),
    autofocus: new MediumEditorAutofocus()
  }
});

console.log(editor);
const firstEditor = editor.elements[0];

let el = document.createElement("div");
let span = document.createElement("span");
span.innerText = "x";
firstEditor.appendChild(span);

editor.addElements(el);

function hideInsert() {
  const rootEditor = firstEditor;
  const insertMenuNode = rootEditor.querySelector(".medium-insert-menu");
  const tooltipNode = rootEditor.querySelector(".inline-tooltip-menu");
  if (insertMenuNode && insertMenuNode.length !== 0) {
    insertMenuNode.classList.remove("show");
    tooltipNode.classList.remove("open");
  }
}

function elementIsNotInEditor(node) {
  if (!node) {
    return true;
  }

  while (node.parentElement !== null) {
    if (node.classList.value.includes("medium-editor-element")) {
      return false;
    }
    node = node.parentElement;
  }
}

document.addEventListener("click", e => {
  if (elementIsNotInEditor(e.target)) {
    hideInsert();
  }
});

function showInsert() {
  const targetNode = window.getSelection().focusNode;
  // console.log(targetNode);

  if (!targetNode || targetNode.nodeType === 3) {
    hideInsert();
    return;
  }

  //过滤点击为编辑器
  if (targetNode.className.includes("medium-editor-element")) {
    return;
  }

  const position = {
    top: targetNode.offsetTop
  };

  //遍历查找有没有insert的dom，如果没有的话就是插入，如果有忽略
  const rootEditor = firstEditor;
  const insertMenuNode = rootEditor.querySelector(".medium-insert-menu");
  const tooltipNode = rootEditor.querySelector(".inline-tooltip-menu");

  if (insertMenuNode && insertMenuNode.length !== 0) {
    //如果隐藏则显示
    if (insertMenuNode.classList.value.indexOf("show") === -1) {
      insertMenuNode.classList.add("show");
    }

    //需要先关闭tooltip
    tooltipNode.classList.remove("open");
    insertMenuNode.style = `top: ${position.top}px`;
  } else {
    let el = document.createElement("div");
    let span = document.createElement("span");
    span.innerText = "x";

    //inline tooltip menu
    let inline = document.createElement("div");
    inline.classList.add("inline-tooltip-menu");

    //创建image选项
    const inlineMenuImage = document.createElement("button");
    inlineMenuImage.innerText = "image";
    inline.appendChild(inlineMenuImage);

    //创建search选项
    const inlineMenuSearch = document.createElement("button");
    inlineMenuSearch.innerText = "Search";
    inline.appendChild(inlineMenuSearch);

    //创建video选项
    const inlineMenuVideo = document.createElement("button");
    inlineMenuVideo.innerText = "Video";
    inline.appendChild(inlineMenuVideo);

    //创建newLine选项
    const inlineMenuNewLine = document.createElement("button");
    inlineMenuNewLine.innerText = "newLine";
    inline.appendChild(inlineMenuNewLine);

    //创建Embed选项
    const inlineMenuEmbed = document.createElement("button");
    inlineMenuEmbed.innerText = "Embed";
    inline.appendChild(inlineMenuEmbed);

    el.classList.add("medium-insert-menu");
    el.setAttribute("contenteditable", false);

    inline.addEventListener("click", event => {
      console.log("tooltip click");
      event.stopPropagation();
    });

    el.addEventListener("click", event => {
      console.log("click");

      //
      const node = document.querySelector(".inline-tooltip-menu");
      if (node.classList.value.includes("open")) {
        node.classList.remove("open");
      } else {
        node.classList.add("open");
      }

      event.stopPropagation();
    });

    // const div = `<div style=''> this is </div>`;
    el.appendChild(span);
    el.appendChild(inline);

    rootEditor.appendChild(el);

    if (
      insertMenuNode &&
      insertMenuNode.classList.value.indexOf("show") === -1
    ) {
      insertMenuNode.classList.add("show");
      insertMenuNode.style = `top: ${position.top}px`;
    }
  }
}

editor.subscribe("editableKeyup", function(event, editable) {
  console.log("editableKeyup");
  showInsert();
});

editor.subscribe("editableClick", function(event, editable) {
  console.log("editableClick");

  showInsert();
});

window.editor = editor;
