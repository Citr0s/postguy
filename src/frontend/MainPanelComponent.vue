<template>
  <div class="mainpanelcomponent">
    <div id="headerBar">
      <div class="header row" v-for="(header, index) in tab.request.headers">
        <div class="col-md-4">
          <div class="form-group">
            <input type="text" placeholder="attribute" :value="header.attribute" @input="onAttributeEdit(index, $event)" class="attribute form-control">
          </div>
        </div>
        <div class="col-md-7">
          <div class="form-group">
            <input type="text" placeholder="value" :value="header.value" @input="onValueEdit(index, $event)" class="value form-control">
          </div>
        </div>
        <div v-show="index != tab.request.headers.length-1" class="col-md-1">
          <div class="form-group" style="text-align:center;">
            <button type="button" v-on:click="removeHeader(index)" class="btn btn-default remove">
              <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
              </button>
          </div>
        </div>
      </div>
    </div>
    <div class="editors row">
      <ace-component v-model="tab.request.body" :readonly="false" class="requestEditor col-md-6"></ace-component>
      <ace-component v-model="tab.response.body" class="responseEditor col-md-6"></ace-component>
    </div>
  </div>
</template>
<style>
  .mainpanelcomponent {
    .editors {
      width:100%;
      display: inline-block;
    }
  }
</style>
<script>
  module.exports = {
    name: 'MainPanelComponent',
    props: ['tab'],
    methods: {
      onTextInput (index) {
        if (index === this.tab.request.headers.length - 1) {
          this.addHeader();
        }
      },
      removeHeader (index) {
        this.$store.commit("REMOVE_HEADER", { tab: this.tab, index });
      },
      onValueEdit (index, e) {
        this.onTextInput(index);
        this.$store.commit("UPDATE_HEADER_VALUE", { header: this.tab.request.headers[index], value: e.target.value })
      },
      onAttributeEdit (index, e) {
        this.onTextInput(index);
        this.$store.commit("UPDATE_HEADER_ATTRIBUTE", { header: this.tab.request.headers[index], attribute: e.target.value })
      },
      addHeader () {
        this.$store.commit("ADD_HEADER", { tab: this.tab });
      }
    },
    components: {
      "AceComponent": require('./AceComponent.vue')
    }
  }
</script>
