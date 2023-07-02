<template>
  <div id="app">
    <router-view v-if="socketConnected" />
  </div>
</template>

<script>
export default {
  inject: ['socket'],
  data() {
    return {
      socketConnected: false
    }
  },
  mounted() {
    this.socket.on('connect', () => {
      this.socketConnected = true;
      this.socket.emit("batalhao_connect");
    });
  },
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
