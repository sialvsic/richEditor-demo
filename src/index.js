import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.min.css";

var MediumEditorMultiPlaceholders = MediumEditor.Extension.extend({
  name: "multi_placeholder",
  init: function() {
    this.placeholderElements = [];
    this.initPlaceholders(this.placeholders, this.placeholderElements);
    this.watchChanges();
  },

  initPlaceholders: function(placeholders, elements) {
    this.getEditorElements().forEach(function(editor) {
      this.placeholders.map(function(placeholder) {
        // Create the placeholder element
        var el = document.createElement(placeholder.tag);
        el.appendChild(document.createElement("br"));
        el.setAttribute("data-placeholder", placeholder.text);
        elements.push(el); //push into placeholderElements

        // Append it to Medium Editor element
        editor.appendChild(el);
        this.updatePlaceholder(el, placeholder.text);
      }, this);
    }, this);
  },

  watchChanges: function() {
    console.log("watchChanges");
    this.subscribe("editableInput", this.updateAllPlaceholders.bind(this));
    this.subscribe(
      "externalInteraction",
      this.updateAllPlaceholders.bind(this)
    );
  },

  destroy: function() {
    console.log("destroy");
    this.getEditorElements().forEach(function(editor) {
      editor.querySelectorAll("[data-placeholder]").map(function(el) {
        el.removeAttribute("data-placeholder");
      }, this);
    }, this);
  },

  showPlaceholder: function(el, text) {
    if (el) {
      el.setAttribute("data-placeholder", text);
      el.classList.add("medium-editor-placeholder");
    }
  },

  hidePlaceholder: function(el) {
    if (el) {
      el.classList.remove("medium-editor-placeholder");
    }
  },

  updatePlaceholder: function(el, text) {
    // if one of these element ('img, blockquote, ul, ol') are found inside the given element, we won't display the placeholder
    if (el.textContent === "") {
      return this.showPlaceholder(el, text);
    }
    this.hidePlaceholder(el);
  },

  removeEmptyPlaceHolder: function() {
    console.log("remove the first two title");

    this.getEditorElements().forEach((editor, index) => {
      Array.from(editor.children).forEach((child, subIndex) => {
        if (subIndex <= this.placeholders.length - 1) {
          child.removeAttribute("data-placeholder");
          child.classList.remove("medium-editor-placeholder");
        }
      });
    });
  },

  updateAllPlaceholders: function() {
    console.log("editableInput");
    console.log(this.getEditorElements());

    this.getEditorElements().forEach((editor, index) => {
      //遍历循环每一个子节点
      Array.from(editor.children).forEach((child, subIndex) => {
        if (subIndex <= this.placeholders.length - 1) {
          let node = child;

          if (!node) {
            return;
          }

          //如果内容为空
          if (node.textContent === "") {
            this.showPlaceholder(node, this.placeholders[subIndex].text);
          } else {
            //如果内容不为空
            this.hidePlaceholder(node);
            node.removeAttribute("data-placeholder");
          }

          // this.placeholders.map(placeholder => {

          // });
        } else if (subIndex === this.placeholders.length) {
          //clear the first two title
          this.removeEmptyPlaceHolder();
          //clear current title
          child.removeAttribute("data-placeholder");
          child.classList.remove("medium-editor-placeholder");
        } else {
          // debugger;
          child.removeAttribute("data-placeholder");
          child.classList.remove("medium-editor-placeholder");
        }
      });
    });

    // this.placeholderElements.map(function(el) {
    //   this.updatePlaceholder(el);
    // }, this);
  }
});

const elements = document.querySelectorAll(".editable");

const editor = new MediumEditor(elements, {
  placeholder: false,
  // placeholder: {
  //   /* This example includes the default options for placeholder,
  //      if nothing is passed this is what it used */
  //   text: "Type your text",
  //   hideOnClick: true
  // }
  extensions: {
    multi_placeholder: new MediumEditorMultiPlaceholders({
      placeholders: [
        {
          tag: "p",
          text: "Title"
        },
        {
          tag: "p",
          text: "Tell your story..."
        }
      ]
    })
  }
});
