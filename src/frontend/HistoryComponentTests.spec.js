const HistoryComponent = require('./HistoryComponent.vue');

describe('HistoryComponent', () => {
  it('should have access to the HistoryModule', () => {
    const mockLogs = [];
    const mockStore = new Vuex.Store({
      state: {
        HistoryModule: {
          logs: mockLogs
        }
      }
    });
    const Ctor = Vue.extend(HistoryComponent);
    const vm = new Ctor({ store: mockStore });
    expect(vm.logs).toBeDefined();
  });
  it('should call the DELETE_HISTORY mutation', () => {
    const spy = jasmine.createSpy();
    const mockStore = new Vuex.Store({
      mutations: {
        DELETE_HISTORY: spy
      }
    });
    const Ctor = Vue.extend(HistoryComponent);
    const vm = new Ctor({ store: mockStore });
    vm.deleteHistory(1);
    expect(spy.calls.count()).toBe(1);
    expect(spy).toHaveBeenCalledWith({}, 1);
  });
  it('should call the LOAD_REQUEST and LOAD_RESPONSE mutations', () => {
    const responseSpy = jasmine.createSpy();
    const requestSpy = jasmine.createSpy();
    const mockResponse = {};
    const mockRequest = {};
    const mockTab = {};
    const mockStore = new Vuex.Store({
      mutations: {
        LOAD_REQUEST: requestSpy,
        LOAD_RESPONSE: responseSpy
      },
      getters: {
        currentTab: () => mockTab
      }
    });
    const Ctor = Vue.extend(HistoryComponent);
    const vm = new Ctor({ store: mockStore });
    vm.loadHistory({ response: mockResponse, request: mockRequest });
    expect(responseSpy.calls.count()).toBe(1);
    expect(requestSpy.calls.count()).toBe(1);
    expect(responseSpy).toHaveBeenCalledWith({}, { tab: mockTab, response: mockResponse });
    expect(requestSpy).toHaveBeenCalledWith({}, { tab: mockTab, request: mockRequest });
  });
});
