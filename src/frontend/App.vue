<template>
  <div id="app" v-bind:class="{'light': lightTheme}">
    <div class="sidebar">
      <div class="heading">
          {{message}}
      </div>
      <select class="title" v-model="sidebarSelection">
        <option value="history">History</option>
        <option value="collections">Collections</option>
      </select>
      <div id="content">
        <history-component  v-if="sidebarSelection === 'history'" id="requestLog">
        </history-component>
        <ul v-if="sidebarSelection === 'collections'">
          <li v-for="(index, collection) in collections">
            {{index}}
          </li>
        </ul>
      </div>
    </div>
    <div class="page">
      <div id="headerBar">
        <h1 class="topbar request-properties">
          <form id="urlbar" v-on:submit.prevent="post()">
              <div class="col-md-2 request-properties__type-wrapper">
                <div class="form-group">
                  <select :value="currentTab.request.verb" @change="updateVerb" class="form-control type-wrapper__field">
                    <option>get</option>
                    <option>post</option>
                    <option>put</option>
                    <option>patch</option>
                    <option>delete</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6 request-properties__url-wrapper">
                <div class="form-group">
                  <input id="input" type="text" placeholder="http://localhost/api" @input="updateURL" :value="currentTab.request.url" class="form-control url-wrapper__field">
                </div>
              </div>
              <div class="col-md-4 request-properties__button-wrapper" style="width: 38% !important;">
                <div class="form-group">
                  <button :disabled="isSubmitDisabled" id="submit" type="submit" class="btn btn-primary button-wrapper__field">Send</button>
                  <div :class="{'spin':submitting}" class="spacer">|</div>
                  <button type="button" v-bind:class="currentTab.statusCode" class="btn btn-primary status-wrapper__field">{{ currentTab.response.statusCode }}</button>
                  <button type="button" class="btn btn-primary time-wrapper__field">{{ currentTab.response.timeTaken != 0 ? currentTab.response.timeTaken + ' ms' : 'Time Taken'}}</button>
                  <button type="button" class="btn btn-primary time-wrapper__field">{{ currentTab.response.responseSize != 0 ? currentTab.response.responseSize + " bytes" : 'Response Size'}}</button>
                  <button type="button" class="btn btn-primary settings-wrapper__field" v-on:click="toggleLightMode()"><span class="glyphicon glyphicon-cog"></span></button>
                </div>
              </div>
          </form>
        </h1>
        <tab-bar-component :tabs="tabs"></tab-bar-component>
      </div>
      <div id="mainPanel">
        <main-panel-component :tab="currentTab"></tab-component>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
  module.exports = {
    data () {
      return {
        submitting: false,
        startTime: null
      }
    },
    computed: {
      isSubmitDisabled () {
        return this.currentTab.request.url == "" || this.submitting;
      },
      ...Vuex.mapState({
        tabs: store => store.TabModule.tabs,
        lightTheme: store => store.lightTheme,
        message: store => store.message,
        sidebarSelection: store => store.sidebarSelection
      }),
      ...Vuex.mapGetters(['currentTab'])
    },
    methods: {
      // themeEditor: function (theme) {
      //   requestEditor.setTheme('ace/theme/' + theme);
      //   responseEditor.setTheme('ace/theme/' + theme);
      // },
      post () {
        this.submitting = true;
        this.requestWithRequest(this.currentTab.request)
        .then(() => {
          this.submitting =  false;
        })
      },
      loadLoggedRequest: function (index) {
        var data = helpers.deepClone(this.logs[index]);
        this.loadTab(data);
      },
      toggleLightMode: function() {
        vm.lightTheme = !vm.lightTheme;
      },
      updateVerb (e) {
        this.$store.commit('UPDATE_VERB', { request: this.currentTab.request, newverb: e.target.value })
      },
      updateURL (e) {
        this.$store.commit('UPDATE_URL', { tab: this.currentTab, newurl: e.target.value });
      },
      ...Vuex.mapActions(['requestWithRequest'])
    },
    components: {
      "MainPanelComponent": require('./MainPanelComponent.vue'),
      "TabBarComponent": require('./TabBarComponent.vue'),
      "HistoryComponent": require('./HistoryComponent.vue')
    }
  }
</script>
