import { computed, defineComponent, h, PropType, Slots, VNode } from "vue";
import { ListController } from "../listController";
import ComposableFilter from "./ComposableFilter.vue"
import ComposableSorting from "./ComposableSorting.vue"
import Pagination from "./Pagination.vue"

export default defineComponent({
  props: {
    ctrl: {type: Object as PropType<ListController>, required: true},
    appearance: {type: String as PropType<'list'>, default: "list"},
  },
  setup(props, {slots}) {

    const viewController = computed(() => {
      if (props.appearance !== "list") {
        console.warn(`Collection view '${props.appearance}' not supported. Using 'view'`);
      }

      return viewControllers.list
    })

    return () => {
      let elements: VNode[] = []
      pushNode(hView.optionsContainer(props.ctrl), elements)

      pushNode(viewController.value.h.body(props.ctrl, slots))

      pushNode(hView.pagination(props.ctrl))

      return elements
    }
  },
})

const viewControllers = {
  list: {
    h: {
      body(ctrl: ListController, slots: Readonly<Slots>) {

      },
    }
  }
}

const hView = {
  optionsContainer: (ctrl: ListController) => {
    let result: VNode[] | undefined
    if (ctrl.filter) {
      result = pushNode(h(ComposableFilter, {ctrl}), result)
    }
    if (ctrl.sort) {
      result = pushNode(h(ComposableSorting, {ctrl}), result)
    }

    if (result) {
      return h('div', {class: 'list-options'}, result)
    }
  },

  pagination: (ctrl: ListController) => {
    if (!ctrl.pagination || (ctrl.data.ready && !ctrl.data.value.pagination)) {
      return
    }
    return h(Pagination, {
      page: ctrl.pagination.page,
      'onUpdate:page': (value: number) => ctrl.pagination.page = value,
      maxPage: ctrl.getTotalPages(),
    })
  },
}

function pushNode(node: VNode, container?: VNode[]): VNode[]
function pushNode(node: VNode | undefined, container: VNode[]): VNode[]
function pushNode(node?: VNode, container?: VNode[]): VNode[] | undefined
function pushNode(node?: VNode, container?: VNode[]) {
  if (node) {
    if (!container) {
      container = []
    }
    container.push(node)
  }

  return container
}


/*
    <div class="list-items" v-if="list.data.ready">

    </div>
*/
