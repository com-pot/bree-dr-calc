import tippy from "tippy.js";

const TippyDirective = {
  beforeMount(el: Element, binding: any) {
    el.classList.add('term')

    tippy(el, {
      content: binding.value,
    })
  },
}

export default TippyDirective
