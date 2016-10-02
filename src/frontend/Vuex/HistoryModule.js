module.exports = {
  state:{
    logs:[]
  },
  mutations: {
    DELETE_HISTORY (state, index) {
      state.logs.splice(index, 1);
    },
    ADD_HISTORY (state, { request, response }) {
      state.logs.push({ request, response });
    }
  }
}
