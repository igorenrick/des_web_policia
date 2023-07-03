<template>
  <div id="mapid" style="height: 100vh;"></div>
</template>
  
<script>
import { socketMixin } from '../socketMixin';
import L from 'leaflet';
import viaturaIcon from '../assets/policeman.png';


export default {
  mixins: [socketMixin],
  data() {
    return {
      patrolCars: window.patrolCars || [],
      batalhaoId: null,
      map: null,
      markers: {},
    };
  },
  methods: {
    addMarker(patrolCar) {
      if (this.map === null || !patrolCar.location || this.map._animatingZoom === true) {
        return;
      }

      const icon = L.icon({
        iconUrl: viaturaIcon,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19],
      });

      this.markers[patrolCar.id] = L.marker([patrolCar.location.latitude, patrolCar.location.longitude], { icon })
        .bindPopup(`${patrolCar.name || patrolCar.id}`)
        .addTo(this.map).openPopup();
      this.markers[patrolCar.id].on('click', () => this.selectPatrolCar(patrolCar));
    },
    updateMarker(patrolCar) {
      if (this.map === null || !patrolCar.location || this.map._animatingZoom === true) {
        return;
      }

      if (this.markers[patrolCar.id]) {
        this.markers[patrolCar.id].setLatLng([patrolCar.location.latitude, patrolCar.location.longitude]);
      } else {
        this.addMarker(patrolCar);
      }
    },
    removeMarker(id) {
      if (this.map === null) {
        return;
      }

      if (this.markers[id]) {
        this.map.removeLayer(this.markers[id]);
        delete this.markers[id];
      }
    },

    selectPatrolCar(patrolCar) {
      this.$router.push({ name: 'BattalionChat', params: { patrolCarId: patrolCar.id } });
    },
  },
  mounted() {
    window.patrolCars = this.patrolCars;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      this.$nextTick(() => {
        this.map = L.map('mapid', {
          center: [latitude, longitude],
          zoom: 13,
          zoomAnimation: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(this.map);

        this.patrolCars.forEach(patrolCar => {
          if (patrolCar.location) {
            this.addMarker(patrolCar);
          }
        });
      });
    }, (error) => {
      console.error('Error getting location', error);
      this.$nextTick(() => {
        this.map = L.map('mapid', {
          center: [0, 0],
          zoom: 13,
        });
      });
    });
  },
  watch: {
    patrolCars: {
      handler(newPatrolCars, oldPatrolCars) {
        newPatrolCars.forEach(newPatrolCar => {
          if (newPatrolCar.location && (!this.markers[newPatrolCar.id] || newPatrolCar.location !== oldPatrolCars.find(oldPatrolCar => oldPatrolCar.id === newPatrolCar.id)?.location)) {
            console.log('via watch');
            this.updateMarker(newPatrolCar);
          }
        });
      },
      deep: true,
    },
  },
  beforeUnmount() {
    this.map.off();
    this.map.remove();
  }
};
</script>
