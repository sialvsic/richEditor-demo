import MediumEditor from "medium-editor";

export const defaultText = "Tell your story...";
export const MediumEditorMultiPlaceholders = MediumEditor.Extension.extend({
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
    this.subscribe("editableInput", this.updateAllPlaceholders.bind(this));
    this.subscribe(
      "externalInteraction",
      this.updateAllPlaceholders.bind(this)
    );
  },

  destroy: function() {
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

  setPlaceholder: function(el, text) {
    if (el) {
      el.setAttribute("data-placeholder", text);
      el.classList.add("medium-editor-placeholder");
    }
  },

  hidePlaceholder: function(el) {
    if (el) {
      el.removeAttribute("data-placeholder");
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
    this.getEditorElements().forEach(editor => {
      Array.from(editor.children).forEach((child, subIndex) => {
        if (subIndex <= this.placeholders.length - 1) {
          child.removeAttribute("data-placeholder");
          child.classList.remove("medium-editor-placeholder");
        }
      });
    });
  },

  updateAllPlaceholders: function() {
    this.getEditorElements().forEach(editor => {
      //遍历循环每一个子节点

      const children = Array.from(editor.children);
      const length = children.length;
      children.forEach((child, subIndex) => {
        if (length == 1) {
          if (child.textContent == "") {
            this.setPlaceholder(child, defaultText);
          } else {
            this.hidePlaceholder(child);
          }
          return;
        }
        if (subIndex < this.placeholders.length) {
          if (!child) {
            return;
          }
          //如果内容为空
          if (child.textContent === "") {
            this.showPlaceholder(child, this.placeholders[subIndex].text);
          } else {
            //如果内容不为空
            this.hidePlaceholder(child);
          }
        } else if (subIndex === this.placeholders.length) {
          //clear the defined Place title
          this.removeEmptyPlaceHolder();
          //clear current title
          this.hidePlaceholder(child);
        } else {
          this.hidePlaceholder(child);
        }
      });
    });
  }
});
