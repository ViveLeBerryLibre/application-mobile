<template>
  <ion-app>
    <Header class="header"></Header>
    <ion-router-outlet class="main-content" />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, getCurrentInstance } from 'vue';
import Header from '@/modules/header/Header.vue';
export default defineComponent({
  name: 'App',
  components: {
    Header,
    IonApp,
    IonRouterOutlet
  },
  setup(){
    const app = getCurrentInstance();
    const envoiEnCours = false;
    return {
      app,
      envoiEnCours
    };
  },
  methods: {
  },

});
</script>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: auto;
}

.main-content {
  margin-top: 56px; /* Hauteur standard d'un ion-header */
}

/* Ajustement pour les pages avec ion-content */
ion-content {
  --padding-top: 0;
}
</style>
