const MainPanelComponent = require('./MainPanelComponent.vue');

describe('MainPanelComponent', () => {
  it('should add a new header with blank inputs', () => {
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
        body: '',
        displayValue: ''
      }
    };
    const spy = jasmine.createSpy();
    const mockStore = new Vuex.Store({
      mutations: {
        ADD_HEADER: spy
      }
    });
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore}).$mount();
    vm.addHeader();
    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalled();
  })
  it('should remove the specified header', () => {
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
        body: '',
        displayValue: ''
      }
    };
    const Ctor = Vue.extend(MainPanelComponent);
    const spy = jasmine.createSpy();
    const mockStore = new Vuex.Store({
      mutations: {
        REMOVE_HEADER: spy
      }
    });
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore }).$mount();
    vm.removeHeader(1);
    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith({}, { tab: tabTemplate, index: 1 });
  })
  it('should hide the remove button for the last result', () => {
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
        response: '',
        body: '',
        displayValue: ''
      }
    }
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: new Vuex.Store()}).$mount();
    const buttons = vm.$el.querySelectorAll('.remove');
    const lastButton = buttons[buttons.length - 1];
    expect(lastButton.parentElement.parentElement.style.display).toBe('none');
  });
  it('should emit an ADD_HEADER mutation', () => {
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
        body: '',
        displayValue: ''
      }
    };
    const spy = jasmine.createSpy();
    const mockStore = new Vuex.Store({
      mutations: {
        ADD_HEADER: spy
      }
    });
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore }).$mount();
    vm.addHeader();
    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalled();
  });
  it('should insert a new attribute when the last header is being edited', () => {
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
        body: '',
        displayValue: ''
      }
    };
    const mockStore = new Vuex.Store({
      mutations: {
        ADD_HEADER: () => {}
      }
    });
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore }).$mount();
    const spy = spyOn(vm, 'addHeader');
    vm.onTextInput(1);
    expect(spy).toHaveBeenCalled();
  });
  it('should send UPDATE_HEADER_ATTRIBUTE function when an attribute is modified', () => {
    const mockHeader = {
      attribute: 'Content-Type',
      value: 'application/json'
    };
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [
          mockHeader,
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
        body: '',
        displayValue: ''
      }
    }
    const spy = jasmine.createSpy();
    const mockStore = new Vuex.Store({
      mutations: {
        UPDATE_HEADER_ATTRIBUTE: spy
      }
    });
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore }).$mount();
    vm.onAttributeEdit(0, { target: { value: "test" }});
    expect(spy).toHaveBeenCalledWith({}, { header: mockHeader, attribute: "test" });
  });
  it('should send UPDATE_HEADER_VALUE function when a value is modified', () => {
    const mockHeader = {
      attribute: 'Content-Type',
      value: 'application/json'
    };
    const tabTemplate = {
      request: {
        verb: 'get',
        headers: [
          mockHeader,
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
        body: '',
        displayValue: ''
      }
    }
    const spy = jasmine.createSpy();
    const mockStore = new Vuex.Store({
      mutations: {
        UPDATE_HEADER_VALUE: spy
      }
    });
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore }).$mount();
    vm.onValueEdit(0, { target: { value: "test" }});
    expect(spy).toHaveBeenCalledWith({}, { header: mockHeader, value: "test" });
  });
  it('should call the add new line function when a value is modified', () => {
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
        body: '',
        displayValue: ''
      }
    };
    const mockStore = new Vuex.Store({
      mutations: {
        UPDATE_HEADER_VALUE: () => {}
      }
    });
    const Ctor = Vue.extend(MainPanelComponent);
    const vm = new Ctor({ propsData: { tab: tabTemplate }, store: mockStore }).$mount();
    const spy = spyOn(vm, 'onTextInput');
    const attributeEl = vm.$el.querySelector('.value');
    const e = new Event('input');
    attributeEl.dispatchEvent(e);
    expect(spy).toHaveBeenCalled();
  });
});
