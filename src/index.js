import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.min.css";
import {
  MediumEditorMultiPlaceholders,
  defaultText
} from "./MediumEditorMultiPlaceholders";

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
    })
  }
});
