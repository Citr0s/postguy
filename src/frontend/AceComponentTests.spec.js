const Vue = require('vue/dist/vue.js');
const AceComponent = require('./AceComponent.vue');

describe('AceComponent', function() {
  it('should convert the editor into an ace editor when mounted', function() {
    const vm = new Vue(AceComponent).$mount();
    expect(vm.$refs.editor.classList.contains('ace_editor')).toBe(true);
  })
  it('should set the editor as readonly by default', function() {
    const vm = new Vue(AceComponent).$mount();
    expect(vm._editor.getReadOnly()).toBe(true);
  })
  it('should set the value to blank by default', function() {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor().$mount();
    expect(vm.value).toBe('');
  })
  it('should set the editor to editable when the prop is set', function() {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ propsData: { readonly: false } }).$mount();
    expect(vm._editor.getReadOnly()).toBe(false);
  })
  it('should set the value when the prop is set', function() {
    const Ctor = Vue.extend(AceComponent);
    const vm = new Ctor({ propsData: { value: 'something' } }).$mount();
    expect(vm.value).toBe('something');
  })
})