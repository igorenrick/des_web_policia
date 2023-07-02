<template>
  <div class="patrol-list">
    <h1 class="title">Viaturas</h1>
    <ul>
      <li v-for="(patrolCar, index) in patrolCars" :key="index">
        Viatura {{ patrolCar.id }} ({{ patrolCar.status }})
        <button @click="selectPatrolCar(patrolCar)">Selecionar</button>
      </li>
    </ul>
  </div>
</template>
  
<script>
import { socketMixin } from '../socketMixin';

export default {
  mixins: [socketMixin],
  data() {
    return {
      patrolCars: window.patrolCars || [],
      batalhaoId: null,
    };
  },
  methods: {
    selectPatrolCar(patrolCar) {
      this.$router.push({ name: 'BattalionChat', params: { patrolCarId: patrolCar.id } });
    },
  },
  mounted() {
    window.patrolCars = this.patrolCars;
  },
  /*
  beforeUnmount() {
    this.socket.off("new_batalhao");
    this.socket.off("new_viatura");
    this.socket.off("viatura_disconnected");
  }
  */
};
</script>
