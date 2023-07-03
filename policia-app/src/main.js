import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { io } from 'socket.io-client';
import './registerServiceWorker'

let socket;

const app = createApp(App);

app.config.globalProperties.$connectSocket = () => {
  socket = io(`http://localhost:3000/`);
  app.config.globalProperties.$socket = socket;
};

app.use(router);

app.mount('#app');

if (window.matchMedia('(display-mode: standalone)').matches) {
  router.push('/chat');
}