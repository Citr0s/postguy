module.exports = {
  setupEditor: (editorName, readOnly) => {
    var editor = ace.edit(editorName);
    editor.setTheme('ace/theme/github');
    editor.getSession().setMode("ace/mode/json");
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(true);
    editor.resize();
    editor.setBehavioursEnabled(true);
    editor.getSession().setUseWrapMode(true);
    return editor;
  }
}