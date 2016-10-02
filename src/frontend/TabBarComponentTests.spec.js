const TabBarComponent = require('./TabBarComponent.vue');

describe('TabBarComponent', () => {
  it('should have access to the TabModule', () => {
    const store = new Vuex.Store({
      modules: {
        TabModule: {
          state: {
            tabs:[{
              request: {
                verb: 'get',
                headers: [{
                  attribute: 'Content-Type',
                  value: 'application/json'
                },
                {
                  attribute: 'Authorization',
                  value: 'Basic QXV0b1RyYWRlcjp5UlZTbmQ0Tko5cEt2UHJn'
                },
                {
                  attribute: '',
                  value: ''
                }      ],
                url: 'http://google.com',
                body: '',
                displayValue: ''
              },
              response: {
                error: {},
                response: {},
                body: "",
                displayValue: ''
              }
            }],
            currentTabIndex:1
          }
        }
      }
    });
    const Ctor = Vue.extend(TabBarComponent);
    const vm = new Ctor({ store });
    expect(vm.currentTabIndex).toBe(1);
    expect(vm.tabs.length).toBe(1);
    expect(typeof vm.changeTab).toBe('function');
    expect(typeof vm.addTab).toBe('function');
    expect(typeof vm.removeTab).toBe('function');
  })
})
