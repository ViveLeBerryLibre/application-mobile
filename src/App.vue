<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { Network } from '@capacitor/network';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, getCurrentInstance } from 'vue';
import { OFFLINE } from './modules/Offline/store/mutation-types';
import { store } from './plugins/store';
import PortailDatabase from '@/sqlite-utils/PortailDatabase';
import CommonDemandeInterventionService from '@/common/services/CommonDemandeInterventionService';
import CommonDemandeDevisService from './common/services/CommonDemandeDevisService';
import { VersionModuleAction } from './modules/Version/store/actions-types';
export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup(){
    const app = getCurrentInstance();
    const sqlite = app?.appContext.config.globalProperties.$sqlite;
    const envoiEnCours = false;
    return {
      app,
      sqlite,
      envoiEnCours
    };
  },
  async beforeMount() {
    await PortailDatabase.checkAppUpdate(this.sqlite);
    const databaseCreated: boolean = await PortailDatabase.initDatabase(this.sqlite);
    if(databaseCreated === false){
      console.log('failed to create database');
    }
    Network.addListener('networkStatusChange', (status) => this.updateConnectionStatus(status.connected)); 
    this.updateConnectionStatus(navigator.onLine);
  },
  methods: {
    async updateConnectionStatus(connected: boolean) {
      if(store.state.offlineState.connected === connected ){
        return;
      }
      store.commit(OFFLINE.SET_OFFLINE,connected);
      if(connected && store.state.authState.token !== '' && this.envoiEnCours === false){
        this.envoiEnCours = true;
        await CommonDemandeInterventionService.synchronizeLocalData(this.app, null, store.state.authState.user.tCompteId);
        await CommonDemandeDevisService.synchronizeDemandeDevis(this.app, null, store.state.authState.user.tCompteId);
        this.envoiEnCours = false;
      }
    },
  },
  mounted() {
    store.dispatch(VersionModuleAction.GET_VERSION);
  }
});
</script>