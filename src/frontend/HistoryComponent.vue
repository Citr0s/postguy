<template>
  <ul>
    <li class="loggedRequest" v-for="(log, index) in logs" v-on:click="loadHistory(log)">
      <div id="verb" v-bind:class="[log.request.verb]">{{log.request.verb}}</div>
      <div id="url">{{log.request.url}}</div>
      <button id="remove" type="button" v-on:click="deleteHistory(index)">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </button>
    </li>
  </ul>
</template>
<style>
</style>
<script>
  module.exports = {
    computed: {
      ...Vuex.mapState({
        logs: state => state.HistoryModule.logs
      }),
      ...Vuex.mapGetters(['currentTab'])
    },
    methods: {
      deleteHistory (index) {
        this.$store.commit("DELETE_HISTORY", index);
      },
      loadHistory (log) {
        this.$store.commit("LOAD_RESPONSE", { tab: this.currentTab, response: log.response });
        this.$store.commit("LOAD_REQUEST", { tab: this.currentTab, request: log.request });
      }
    }
}

</script>
