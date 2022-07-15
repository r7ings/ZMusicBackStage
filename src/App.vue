<template>
  <div id="app">
    <Index />
  </div>
</template>

<script>
import axios from "axios";
import Index from "./views/Index.vue";
export default {
  name: "App",
  components: { Index },
  beforeCreate() {
    //本地调试
    // axios.defaults.baseURL = "http://127.0.0.1:9990";
    //服务器
    axios.defaults.baseURL = "http://43.138.114.35:9990";
  },
};
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>