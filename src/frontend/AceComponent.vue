<template>
  <div class="acecomponent">
    <div class="editor" ref="editor"></div>
  </div>
</template>
<style lang="scss">
  .acecomponent {
    .editor {
      height: 30rem;
      border: 1px solid rgba(0, 0, 0, 0.15);
      width:100%;
      height:70vh;
    }
  }
</style>
<script>
  module.exports = {
    name: 'AceComponent',
    props: {
      'readonly': {
        type: Boolean,
        default: true
      },
      'value': {
        type: String,
        default: ''
      }
    },
    mounted () {
      this.$store.subscribe((mutation) => {
        if (["CHANGE_TAB", "UPDATE_RESPONSE", "LOAD_RESPONSE", "LOAD_REQUEST"].includes(mutation.type)) {
          Vue.nextTick(() => {
            this._editor.setValue(this.value);
            this._editor.setReadOnly(this.readonly);
          })
        }
      })
      const editor = this._editor = ace.edit(this.$refs.editor);
      const session = this._session = editor.getSession();
      editor.setReadOnly(this.readonly);
      editor.setValue(this.value);
      editor.setTheme('ace/theme/monokai');
      editor.setShowPrintMargin(false);
      editor.setHighlightActiveLine(true);
      editor.resize();
      editor.setBehavioursEnabled(true);
      session.setUseWrapMode(true);
      session.setMode("ace/mode/json");
      editor.on('input', () => this.$emit('input', editor.getValue()));
    }
  }
</script>
