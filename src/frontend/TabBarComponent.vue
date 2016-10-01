<template>
  <div class="tabbarcomponent">
    <div id="tabBar">
      <ul class="nav nav-tabs">
        <li role="presentation" v-for="(tab, index) in store.tabs" v-on:click="changeTab(index)" v-bind:class="{'active': index === store.currentTabIndex}">
          <a>
            <input id="title" v-model="tab.request.url" v-bind:placeholder="'Tab ' + (index + 1)" disabled>
            <button id="removeTab" type="button" v-on:click="removeTab(index)">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>
          </a>
        </li>
        <li role="presentation" class="active">
          <a v-on:click="addTab()">
            <button id="addTab" type="button">
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </button>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss">
  .tabbarcomponent {
    #tabBar{
      color:#ccc;
      margin-bottom:15px;

      input,
      button{
        border:none;
        background-color:transparent;
        color: rgba(255, 255, 255, 0.3);
      }

      a{
        background-color: rgba(0, 0, 0, 0.1);
      }

      a:hover{
        background-color:rgba(0, 0, 0, 0.2);
        border-color:transparent;
      }

      .active{
        border-bottom: 1px solid #333;
      }

      li{
        a{
          border-left:none;
        }

        &.active{
          a{
            border-bottom:none;

            &:last-of-type{
              margin-left: 2px;
            }
          }

          input,
          button{
            color: white;
          }
        }
      }
    }
  }
</style>
<script>
  module.exports = {
    name: 'TabBarComponent',
    data () {
      return {
        store: require('./state.js').store
      }
    },
    methods: {
      changeTab (index) {
        this.store.currentTabIndex = index;
      },
      removeTab (index) {
        this.store.tabs.splice(index, 1);
        if (this.store.tabs.length === 0)
          this.addTab();
        this.store.currentTabIndex = this.store.tabs.length - 1;
      },
      addTab () {
        this.store.tabs.push({
          request: {
            verb: 'get',
            headers: [
              {
                attribute: '',
                value: ''
              }
            ],
            url: '',
            body: '',
            displayValue: ''
          },
          response: {
            error: {},
            response: {},
            body: "",
            displayValue: ''
          }
        });
        this.store.currentTabIndex = this.store.tabs.length - 1;
      }
    }
  }
</script>