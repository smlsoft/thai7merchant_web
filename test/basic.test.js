import { mount } from '@vue/test-utils'
import Hello from './Hello.vue'

test('mount component', async () => {
  expect(Hello).toBeTruthy()

  const wrapper = mount(Hello, {
    props: {
        textContent: "ABC",
    },
  })

  expect(wrapper.text()).toContain('ABC')


})
