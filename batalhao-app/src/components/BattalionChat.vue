<template>
    <div class="chat-container">
        <div class="message-list" v-scroll-bottom>
            <div class="chat-header">
                <button @click="goBack">Voltar</button>
                <h2 class="chat-title">Chat com a viatura {{ $route.params.patrolCarId }}</h2>
            </div>
            <ul class="chat">
                <li v-for="(message, index) in getMessagesForPatrolCar($route.params.patrolCarId)" :key="index"
                    :class="{ 'outgoing': message.direction === 'outgoing', 'incoming': message.direction === 'incoming' }">
                    <p class="sender">{{ message.sender === 'batalhao' ? 'Batalhão' : 'Viatura' }}</p>
                    <p class="message">{{ message.text }}</p>
                </li>

            </ul>
        </div>
        <div class="message-input-container">
            <input type="text" v-model="newMessage" />
            <button @click="sendMessage">Enviar</button>
        </div>
    </div>
</template>

<script>
import { socketMixin } from '../socketMixin';

export default {
    mixins: [socketMixin],
    data() {
        return {
            messages: window.chatMessages || {},
            patrolCarId: null,
            newMessage: ""
        };
    },
    methods: {
        sendMessage() {
            if (this.patrolCarId && this.newMessage.trim() !== "") {
                const message = {
                    text: this.newMessage,
                    sender: "batalhao",
                    receiverId: this.patrolCarId,
                    direction: "outgoing"
                };
                this.socket.emit("send_message", message);
                this.newMessage = "";
                this.getMessagesForPatrolCar(this.patrolCarId).push(message);
                window.chatMessages = this.messages;
            } else {
                alert("Por favor, insira uma mensagem");
            }
        },
        getMessagesForPatrolCar(patrolCarId) {
            if (!this.messages[patrolCarId]) {
                this.messages = {
                    ...this.messages,
                    [patrolCarId]: []
                };
            }
            return this.messages[patrolCarId];
        },
        goBack() {
            this.$router.push({ name: 'BattalionMap' });
        }
    },
    watch: {
        chatMessagesGlobal: {
            immediate: true,
            handler(newVal) {
                this.messages = newVal;
                this.$nextTick(() => {
                    const messageList = this.$el.querySelector(".message-list");
                    if (messageList) {
                        messageList.scrollTop = messageList.scrollHeight;
                    }
                });
            }
        }
    },
    computed: {
        chatMessagesGlobal() {
            return window.chatMessages;
        }
    },
    mounted() {
        this.patrolCarId = this.$route.params.patrolCarId;
    },
    inject: ['socket'],
    beforeUnmount() {
        this.socket.off("receive_message");
    },
    directives: {
        "scroll-bottom": {
            componentUpdated(el) {
                el.scrollTop = el.scrollHeight;
            }
        }
    }
};
</script>
  
<style>
.chat-container {
  position: relative;
  margin-top: 0;
}

.message-list {
  overflow-y: auto;
  max-height: calc(100vh - 183px); /* Altura máxima da lista de mensagens */
  padding-bottom: 10px; /* Espaçamento inferior */
  padding-top: 40px;
  z-index: 1; /* Z-index menor para ficar atrás do .message-input-container */
}

.message-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #f8f8f8;
  padding-bottom: 40px; /* Espaçamento inferior igual à altura do botão de envio */
  z-index: 2; /* Z-index maior para ficar na frente do .message-list */
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
  background-color: #d4f5d0; /* Cor de fundo mais suave para as mensagens enviadas */
  float: right;
  clear: both;
}

.chat .outgoing .message::before {
  right: -10px;
  top: 3px;
  border: 10px solid;
  border-color: transparent transparent transparent #d4f5d0;
}

.chat .outgoing .sender {
  float: right;
  clear: both;
  margin-right: 10px;
  font-size: 12px; /* Tamanho menor para o sender */
  margin-bottom: 5px; /* Espaçamento inferior menor para o sender */
}

.chat .incoming .message {
  background-color: #f8cccc; /* Cor de fundo mais suave para as mensagens recebidas */
  float: left;
  clear: both;
}

.chat .incoming .message::before {
  left: -10px;
  top: 3px;
  border: 10px solid;
  border-color: transparent #f8cccc transparent transparent;
}

.chat .incoming .sender {
  float: left;
  clear: both;
  margin-left: 10px;
  font-size: 12px; /* Tamanho menor para o sender */
  margin-bottom: 5px; /* Espaçamento inferior menor para o sender */
}

.chat li p {
  margin-bottom: 0;
}

.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #f8f8f8;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    widows: 100%;
    z-index: 3;
}

.chat-header button {
    margin-right: 20px;
}
</style>