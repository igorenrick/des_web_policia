<template>
  <div class="chat-container">
    <div class="message-list" v-scroll-bottom>
      <div class="chat-header">
        <h2 class="chat-title">Conversa com o Batalhão</h2>
        <!--<button @click="changeName">Alterar nome</button>-->
      </div>
      <ul class="chat">
        <li v-for="(message, index) in messages" :key="index"
          :class="{ 'outgoing': message.direction === 'outgoing', 'incoming': message.direction === 'incoming' }">
          <p class="sender">{{ message.direction === 'incoming' ? 'Batalhão' : 'Viatura' }}</p>
          <p class="message">{{ message.text }}</p>
        </li>
      </ul>
    </div>
    <div class="message-input-container">
      <input v-model="messageInput" type="text" placeholder="Digite uma mensagem">
      <button @click="sendMessage">Enviar Mensagem</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locationUpdateInterval: null,
      messageInput: "",
      messages: [],
    };
  },
  mounted() {
    this.locationUpdateInterval = setInterval(this.sendLocation, 2000);

    this.$connectSocket('viatura');

    this.$socket.on('new_batalhao', (id) => {
      this.batalhaoId = id;
    });

    this.$socket.on('receive_message', (message) => {
      console.log('Message from server:', message);
      message.direction = 'incoming';
      this.messages.push(message);
    });
  },
  beforeUnmount() {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }
  },
  methods: {
    sendLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.$socket.emit('location_update', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }, (error) => {
          console.log('Erro ao obter a localização:', error);
        });
      } else {
        console.log('Geolocalização não é suportada por este navegador.');
      }
    },
    sendMessage() {
      if (this.messageInput.trim() !== "") {
        console.log("batalhaoId:", this.batalhaoId);
        let message = {
          text: this.messageInput,
          sender: 'viatura',
          receiverId: this.batalhaoId,
          timestamp: new Date(),
          direction: 'outgoing'
        };
        this.$socket.emit('send_message', message);
        this.messages.push(message);
        this.messageInput = "";
      }
    },
  },
  directives: {
    'scroll-bottom': {
      mounted(el) {
        el.scrollTop = el.scrollHeight;
      },
      updated(el) {
        el.scrollTop = el.scrollHeight;
      },
    },
  },
};
</script>

<style>
.chat-container {
  position: relative;
  margin-top: 0;
}

.message-list {
  overflow-y: auto;
  max-height: calc(100vh - 183px);
  padding-bottom: 10px;
  padding-top: 100px;
  z-index: 1;
}

.message-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #f8f8f8;
  padding-bottom: 40px;
  z-index: 2;
}

.chat {
  list-style-type: none;
  padding: 0;
}

.chat .outgoing .message,
.chat .incoming .message {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px;
  position: relative;
}

.chat .outgoing .message::before,
.chat .incoming .message::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}

.chat .outgoing .message {
  background-color: #d4f5d0;
  float: right;
  clear: both;
}

.chat .outgoing .message::before {
  right: -10px;
  border: 10px solid;
  border-color: transparent transparent transparent #d4f5d0;
}

.chat .outgoing .sender {
  float: right;
  clear: both;
  margin-right: 10px;
  font-size: 12px;
}

.chat .incoming .message {
  background-color: #f8cccc;
  float: left;
  clear: both;
}

.chat .incoming .message::before {
  left: -10px;
  border: 10px solid;
  border-color: transparent #f8cccc transparent transparent;
}

.chat .incoming .sender {
  float: left;
  clear: both;
  margin-left: 10px;
  font-size: 12px;
  margin-bottom: 5px;
}

.chat li p {
  margin-bottom: 0;
}

.chat-header {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px;
    background-color: #f8f8f8;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    widows: 100%;
    z-index: 3;
}
</style>
