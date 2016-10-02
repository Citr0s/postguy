const AceComponent = require('./AceComponent.vue');

describe('AceComponent', () => {
  it('should convert the editor into an ace editor when mounted', function() {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ store: new Vuex.Store() }).$mount();
    expect(vm.$refs.editor.classList.contains('ace_editor')).toBe(true);
  })
  it('should set the editor as readonly by default', () => {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ store: new Vuex.Store() }).$mount();
    expect(vm._editor.getReadOnly()).toBe(true);
  })
  it('should set the value to blank by default', () => {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ store: new Vuex.Store() }).$mount();
    expect(vm.value).toBe('');
  })
  it('should set the editor to editable when the prop is set', () => {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ propsData: { readonly: false }, store: new Vuex.Store() }).$mount();
    expect(vm._editor.getReadOnly()).toBe(false);
  })
  it('should set the value when the prop is set', () => {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ propsData: { value: 'something' }, store: new Vuex.Store() }).$mount();
    expect(vm._editor.getValue()).toBe('something');
  })
  it('should update when CHANGE_TAB mutation is fired', (done) => {
    const Ctor = Vue.extend(AceComponent);
    const store = new Vuex.Store({
      mutations:{
        CHANGE_TAB: () => {}
      }
    });
    const vm = new Ctor({ propsData: { readonly: false, value: 'something' }, store }).$mount();
    vm.value = 'something else';
    vm.readonly = true;
    store.commit('CHANGE_TAB');
    Vue.nextTick(() => {
      expect(vm._editor.getValue()).toBe('something else');
      expect(vm._editor.getReadOnly()).toBe(true);
      done()
    })
  })
})
