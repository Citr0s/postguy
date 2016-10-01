const Vue = require('vue/dist/vue.js');
const MainPanelComponent = require('./MainPanelComponent.vue');

describe('MainPanelComponent', function() {
  it('should add a new header with blank inputs', function() {
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: {},
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }}).$mount();
    vm.addHeader();
    expect(vm.tab.request.headers.length).toBe(1);
  })
  it('should remove the specified header', function() {
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [{
          attribute: 'Content-Type',
          value: 'application/json'
        },
        {
          attribute: 'Authorization',
          value: ''
        }],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: {},
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }}).$mount();
    vm.removeHeader(1);
    const headersCount = vm.tab.request.headers.length;
    expect(headersCount).toBe(1);
    expect((vm.tab.request.headers[headersCount -1]).attribute).toBe('Content-Type');
  })
  it('should hide the remove button for the last result', function() {
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [{
          attribute: 'Content-Type',
          value: 'application/json'
        },
        {
          attribute: 'Authorization',
          value: ''
        }],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: {},
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }}).$mount();
    const buttons = vm.$el.querySelectorAll('.remove');
    const lastButton = buttons[buttons.length - 1];
    expect(lastButton.parentElement.parentElement.style.display).toBe('none');
  })
  it('should insert a new attribute when the last header is being edited', function() {
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [{
          attribute: 'Content-Type',
          value: 'application/json'
        },
        {
          attribute: 'Authorization',
          value: ''
        }],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: {},
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }}).$mount();
    const beforeCount = vm.tab.request.headers.length;
    vm.onTextInput(1);
    const afterCount = vm.tab.request.headers.length;
    expect(afterCount).toBe(beforeCount + 1);
    expect(vm.tab.request.headers[afterCount - 1].attribute).toBe('');
    expect(vm.tab.request.headers[afterCount - 1].value).toBe('');
  })
  it('should call the add new line function when an attribute is modified', function() {
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [{
          attribute: 'Content-Type',
          value: 'application/json'
        },
        {
          attribute: 'Authorization',
          value: ''
        }],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: {},
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }}).$mount();
    const spy = spyOn(vm, 'onTextInput');
    const attributeEl = vm.$el.querySelector('.attribute');
    const e = new Event('input');
    attributeEl.dispatchEvent(e);
    expect(spy).toHaveBeenCalled();
  })
  it('should call the add new line function when a value is modified', function() {
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [{
          attribute: 'Content-Type',
          value: 'application/json'
        },
        {
          attribute: 'Authorization',
          value: ''
        }],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: {},
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }}).$mount();
    const spy = spyOn(vm, 'onTextInput');
    const attributeEl = vm.$el.querySelector('.value');
    const e = new Event('input');
    attributeEl.dispatchEvent(e);
    expect(spy).toHaveBeenCalled();
  })
})