export const socketMixin = {
  inject: ['socket'],
  created() {
    if (this.socket) {
      this.socket.emit("batalhao_connect");
    } else {
      console.error('Socket is null');
    }
  },
  mounted() {
    if (this.socket) {
      this.socket.on("new_batalhao", (id) => {
        this.batalhaoId = id;
      });
    } else {
      console.error('Socket is null');
    }
    this.socket.on("new_viatura", (id) => {
      window.patrolCars.push({ id: id, status: "Online" });
    });
    this.socket.on("viatura_disconnected", (id) => {
      const patrolCarIndex = window.patrolCars.findIndex((car) => car.id === id);
      if (patrolCarIndex !== -1) {
        window.patrolCars.splice(patrolCarIndex, 1);
      }
    });
    this.socket.on("receive_message", (message) => {
      if (!window.chatMessages[message.sender]) {
        window.chatMessages[message.sender] = [];
      }
      message.direction = message.sender !== 'batalhao' ? 'incoming' : 'outgoing';
      window.chatMessages[message.sender].push(message);
    });
  },
  beforeUnmount() {
    this.socket.off("new_batalhao");
    this.socket.off("new_viatura");
    this.socket.off("viatura_disconnected");
    this.socket.off("receive_message");
  }
  
}
