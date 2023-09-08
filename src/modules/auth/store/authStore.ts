import {computed, reactive} from "vue";

const state = reactive({
  userName: localStorage.getItem('auth.userName') as string | null,
})

const actions = {
  logIn: (userName: string) => {
    state.userName = userName
    localStorage.setItem('auth.userName', userName)
  },
  logOut: () => {
    state.userName = null
    localStorage.removeItem('auth.userName')
  },
}

export default {
  state,
  actions,

  user: reactive({
    isLoggedIn: computed(() => !!state.userName),
  }),
}
