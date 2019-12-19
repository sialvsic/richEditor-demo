import MediumEditor from "medium-editor";

const MediumMenuInsert = MediumEditor.Extension.extend({
  name: "menuInsert",

  init() {
    console.log("menuInsert");
    this.showInsert();
    // if (this.getEditorElements().length < 1) {
    //   return;
    // }

    // if (!this.getEditorElements()[0].children.length) {
    //   this.getEditorElements()[0].focus();
    // } else {
    //   this.base.selectElement(this.getEditorElements()[0].children[0]);
    //   MediumEditor.selection.clearSelection(document, true);
    // }
    this.watchChanges();
  },

  showInsert: function() {
    //遍历查找有没有insert的dom，如果没有的化就是插入，如果有忽略

    let el = document.createElement("div");
    let span = document.createElement("span");
    span.innerText = "img";
    el.classList.add("medium-insert-menu");
    el.setAttribute("contenteditable", false);

    el.appendChild(span);
    this.getEditorElements()[0].appendChild(el);
  },

  watchChanges: function() {
    this.subscribe("editableInput", this.updateInsertStatus.bind(this));
    // this.subscribe(
    //   "externalInteraction",
    //   this.updateAllPlaceholders.bind(this)
    // );
  },

  updateInsertStatus: function() {
    console.log("updateInsertStatus");
  }
});

export default MediumMenuInsert;
