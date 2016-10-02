const TabModule = require('./TabModule.js');

describe('TabModuleTests', () => {
  describe('Getters', () => {
    it('should return the current tab', () => {
      const state = {
        currentTabIndex: 1,
        tabs: [
          {
            request: {
              verb: 'post',
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
          },
          {
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
          }
        ]
      }
      const currentTab = TabModule.getters.currentTab(state);
      expect(currentTab).toEqual({
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
      });
    });
    it('should return the number of tabs', () => {
      const state = {
        currentTabIndex: 1,
        tabs: [
          {
            request: {
              verb: 'post',
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
          },
          {
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
          }
        ]
      }
      const noOfTabs = TabModule.getters.noOfTabs(state);
      expect(noOfTabs).toBe(2);
    });
  });
  describe('Actions', () => {
    it('should be able to change tab', () => {
      const spy = jasmine.createSpy();
      TabModule.actions.changeTab({ commit: spy }, 1);
      expect(spy.calls.count()).toEqual(1);
      expect(spy).toHaveBeenCalledWith("CHANGE_TAB", 1);
    });
    it('should be able to add a tab', () => {
      const commitSpy = jasmine.createSpy();
      const dispatchSpy = jasmine.createSpy();
      const mockState = {
        tabs: [{
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
        currentTabIndex: 0
      };
      TabModule.actions.addTab({ commit: commitSpy, dispatch: dispatchSpy, state: mockState });
      expect(commitSpy.calls.count()).toEqual(1);
      expect(commitSpy.calls.argsFor(0)).toEqual(["ADD_TAB"]);
      expect(dispatchSpy.calls.count()).toEqual(1);
      expect(dispatchSpy).toHaveBeenCalledWith("changeTab", 0);
    });
    it('should remove a tab and change to it if it\'s not the last tab', () => {
      const mockState = {
        tabs: [{}],
        currentTabIndex: 0
      };
      const dispatchSpy = jasmine.createSpy();
      const commitSpy = jasmine.createSpy();
      TabModule.actions.removeTab( { dispatch: dispatchSpy, commit: commitSpy, state: mockState}, 1 );
      expect(commitSpy.calls.count()).toBe(1);
      expect(commitSpy).toHaveBeenCalledWith("REMOVE_TAB", 1);
      expect(dispatchSpy.calls.count()).toBe(1);
      expect(dispatchSpy).toHaveBeenCalledWith("changeTab", 0);
    });
    it('should add a new tab if the last tab is removed', () => {
      const mockState = {
        tabs: [],
        currentTabIndex: 0
      };
      const dispatchSpy = jasmine.createSpy();
      const commitSpy = jasmine.createSpy();
      TabModule.actions.removeTab({ dispatch: dispatchSpy, commit: commitSpy, state: mockState}, 1 );
      expect(commitSpy.calls.count()).toBe(1);
      expect(commitSpy).toHaveBeenCalledWith("REMOVE_TAB", 1);
      expect(dispatchSpy.calls.count()).toBe(1);
      expect(dispatchSpy).toHaveBeenCalledWith("addTab");
    });
  });
  describe('Mutations', () => {
    it('should update the request verb', () => {
      const mockRequest = {
        verb: 'post'
      };
      TabModule.mutations.UPDATE_VERB({}, { request: mockRequest, newverb: "POST" });
      expect(mockRequest.verb).toBe("POST");
    });
    it('should update a header value', () => {
      const mockHeader = {
        attribute: "attr",
        value: "value"
      };
      TabModule.mutations.UPDATE_HEADER_VALUE({}, { header: mockHeader, value: "newval" });
      expect(mockHeader.value).toBe("newval");
    });
    it('should update a header attribute', () => {
      const mockHeader = {
        attribute: "attr",
        value: "value"
      };
      TabModule.mutations.UPDATE_HEADER_ATTRIBUTE({}, { header: mockHeader, attribute: "newattr"})
      expect(mockHeader.attribute).toBe("newattr");
    });
    it('should update the current tab url', () => {
      const mockTab = {
        request: {
          url: 'something'
        }
      };
      TabModule.mutations.UPDATE_URL({}, { tab: mockTab, newurl: "something else" });
      expect(mockTab.request.url).toBe("something else");
    });
    it('should change the current tab index', () => {
      const mockState = {
        currentTabIndex: 0
      };
      TabModule.mutations.CHANGE_TAB(mockState, 1);
      expect(mockState.currentTabIndex).toBe(1);
    });
    it('should remove the specified tab', () => {
      const mockState = {
        tabs:[0,1]
      };
      TabModule.mutations.REMOVE_TAB(mockState, 0);
      expect(mockState.tabs).toEqual([1]);
    });
    it('should add a new blank tab', () => {
      const mockState = {
        tabs:[]
      };
      TabModule.mutations.ADD_TAB(mockState);
      expect(mockState.tabs).toEqual([{
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
        },
        response: {
          statusCode: "",
          body: "",
          timeTaken: 0,
          responseSize: 0
        }
      }]);
    });
  });
});
