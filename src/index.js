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

const firstEditor = editor.elements[0];

function hideInsert() {
  const rootEditor = firstEditor;
  const insertMenuNode = rootEditor.querySelector(".medium-insert-menu");
  if (insertMenuNode.length !== 0) {
    insertMenuNode && insertMenuNode.classList.remove("show");
  }
}

function elementIsNotInEditor(ele) {
  const array = Array.from(ele);
  for (let index = 0; index < array.length; index++) {
    if (
      array[index].classList &&
      array[index].classList.value.includes("medium-editor-element")
    ) {
      return false;
    }
  }
  return true;
}

document.addEventListener("click", e => {
  if (elementIsNotInEditor(e.path)) {
    hideInsert();
  }
});

function showInsert() {
  const targetNode = window.getSelection().focusNode;
  console.log(targetNode);

  if (!targetNode || targetNode.nodeType === 3) {
    hideInsert();
    return;
  }

  //临时过滤点击为编辑器
  if (targetNode.className.includes("medium-editor-element")) {
    return;
  }

  const position = {
    top: targetNode.offsetTop
  };

  //遍历查找有没有insert的dom，如果没有的话就是插入，如果有忽略
  const rootEditor = firstEditor;
  const insertMenuNode = rootEditor.querySelector(".medium-insert-menu");

  if (insertMenuNode && insertMenuNode.length !== 0) {
    //如果隐藏则显示
    if (insertMenuNode.classList.value.indexOf("show") === -1) {
      insertMenuNode.classList.add("show");
    }
    insertMenuNode.style = `top: ${position.top}px`;
  } else {
    let el = document.createElement("div");
    let span = document.createElement("span");
    span.innerText = "img";

    el.classList.add("medium-insert-menu");
    el.setAttribute("contenteditable", false);

    el.appendChild(span);
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
  showInsert();
});

editor.subscribe("editableClick", function(event, editable) {
  showInsert();
});

window.editor = editor;
