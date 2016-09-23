module.exports = {
  setupEditor: function (editorName, readOnly) {
    var editor = ace.edit(editorName);
    editor.setTheme('ace/theme/monokai');
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(true);
    editor.resize();
    editor.setBehavioursEnabled(true);
    var session = editor.getSession();
    session.setUseWrapMode(true);
    session.setMode("ace/mode/json");
    return editor;
  }
};
