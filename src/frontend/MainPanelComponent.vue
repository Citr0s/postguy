<template>
  <div class="mainpanelcomponent">
    <div id="headerBar">
      <div class="header row" v-for="(header, index) in tab.request.headers">
        <div class="col-md-4">
          <div class="form-group">
            <input type="text" placeholder="attribute" v-model="header.attribute" @input="onTextInput(index)" class="attribute form-control">
          </div>
        </div>
        <div class="col-md-7">
          <div class="form-group">
            <input type="text" placeholder="value" v-model="header.value" @input="onTextInput(index)" class="value form-control">
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
  const bus = require('./EventBus.js')
  module.exports = {
    name: 'MainPanelComponent',
    props: ['tab'],
    watch: {
      'tab' () {
        bus.$emit('TAB_CHANGE');
      }
    },
    methods: {
      onTextInput (index) {
        if (index === this.tab.request.headers.length - 1) {
          this.addHeader();
        }
      },
      removeHeader (index) {
        this.tab.request.headers.splice(index, 1);
      },
      addHeader () {
        this.tab.request.headers.push({ attribute: '', value: '' });
      }
    },
    components: {
      "AceComponent": require('./AceComponent.vue')
    }
  }
</script>