import {reactive} from "vue";

const state = reactive({
  appName: 'Bree Dr.Calc',
  appVersion: process.env.VUE_APP_VERSION,
  repoLink: 'https://github.com/Thoronir42/bree-dr-calc',
})

export default {
  state,
}
