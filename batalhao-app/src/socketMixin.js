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
      const newPatrolCar = { id: id, status: "Online" };
      window.patrolCars.push(newPatrolCar);
      if (this.addMarker && newPatrolCar.location) {
        this.addMarker(newPatrolCar);
      }
    });
    this.socket.on('patrol_car_name_update', ({ id, name }) => {
      const patrolCar = window.patrolCars.find(car => car.id === id);
      if (patrolCar) {
        patrolCar.name = name;
        if (this.updateMarker) {
          this.updateMarker(patrolCar);
        }
      }
    });
    this.socket.on("viatura_disconnected", (id) => {
      const patrolCarIndex = window.patrolCars.findIndex((car) => car.id === id);
      if (patrolCarIndex !== -1) {
        window.patrolCars.splice(patrolCarIndex, 1);
        if (this.removeMarker) {
          this.removeMarker(id);
        }
      }
    });
    this.socket.on("receive_message", (message) => {
      if (!window.chatMessages[message.sender]) {
        window.chatMessages[message.sender] = [];
      }
      message.direction = message.sender !== 'batalhao' ? 'incoming' : 'outgoing';
      window.chatMessages[message.sender].push(message);
    });
    this.socket.on("location_update", (update) => {
      const patrolCarIndex = window.patrolCars.findIndex((car) => car.id === update.id);
      if (patrolCarIndex !== -1) {
        window.patrolCars[patrolCarIndex].location = update.location;
        if (this.updateMarker) {
          console.log('via minix');
          this.updateMarker(window.patrolCars[patrolCarIndex]);
        }
      }
    });
  },
  beforeUnmount() {
    this.socket.off("new_batalhao");
    this.socket.off("new_viatura");
    this.socket.off("viatura_disconnected");
    this.socket.off("receive_message");
    this.socket.off("location_update");
  }

}
