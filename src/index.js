import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.min.css";

import "medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css";
import MediumEditorMultiPlaceholders, {
  defaultText
} from "./MediumEditorMultiPlaceholders";
import MediumEditorAutofocus from "./MediumEditorAutoFocus";
// import MediumEditorMenuInsert from "./MediumEditorMenuInsert";
// import "medium-editor-insert-plugin/dist/js/medium-editor-insert-plugin.min.js";

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
    // menuInsert: new MediumEditorMenuInsert()
  }
});

function hideInsert() {
  const rootEditor = editor.elements[0];
  if (rootEditor.querySelectorAll(".medium-insert-menu").length !== 0) {
    const node = rootEditor.querySelectorAll(".medium-insert-menu")[0];
    node.classList.remove("show");
  }
}

function showInsert() {
  const targetNode = window.getSelection().focusNode;

  if (!targetNode || targetNode.nodeType === 3) {
    hideInsert();
    return;
  }

  //临时过滤点击为编辑器
  if (
    //纯文本节点
    targetNode.nodeType !== 3 &&
    targetNode.className.includes("medium-editor-element")
  ) {
    return;
  }

  const position = {
    top: targetNode.offsetTop
  };

  //遍历查找有没有insert的dom，如果没有的化就是插入，如果有忽略

  const rootEditor = editor.elements[0];

  if (rootEditor.querySelectorAll(".medium-insert-menu").length !== 0) {
    //如果隐藏则显示
    const node = rootEditor.querySelectorAll(".medium-insert-menu")[0];

    if (node.classList.value.indexOf("show") === -1) {
      node.classList.add("show");
    }
    node.style = `top: ${position.top}px`;
  } else {
    let el = document.createElement("div");
    let span = document.createElement("span");
    span.innerText = "img";
    el.classList.add("medium-insert-menu");
    el.classList.add("test");
    el.setAttribute("contenteditable", false);

    el.appendChild(span);
    rootEditor.appendChild(el);

    const node = rootEditor.querySelectorAll(".medium-insert-menu")[0];

    if (node.classList.value.indexOf("show") === -1) {
      node.classList.add("show");
      node.style = `top: ${position.top}px`;
    }
  }
}

// editor.subscribe("editableInput", function(event, editable) {
//   // Do some work
//   console.log("Do some work");
//   // showInsert();
// });

editor.subscribe("editableKeyup", function(event, editable) {
  // appendFirst();
  showInsert();
});

editor.subscribe("editableClick", function(event, editable) {
  showInsert();
});

window.editor = editor;
