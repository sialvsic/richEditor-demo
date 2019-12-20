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

$(function() {
  $(".editable").mediumInsert({
    editor: editor
  });
});

window.editor = editor;
