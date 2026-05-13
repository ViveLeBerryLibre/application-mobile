<template>
  <ion-menu class="menu" side="start" :id="getMenuId" :menu-id="getMenuId" content-id="main-content" swipeGesture="true">
    <ion-header class="header">
      <ion-grid>
        <ion-row class="ion-align-items-end">
          <ion-col offset="4">
            <img class="logo" v-if="getLogo" :src="getLogo" alt=""/>
          </ion-col>
          <ion-col class="ion-align-self-start">
            <ion-icon :icon="closeSharp" @click="closeMenu"></ion-icon>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-toolbar translucent>
        <ion-title>
          <h1>{{$t('app.dashboard.menu.title')}}</h1>
        </ion-title>
      </ion-toolbar>
      <ion-toolbar translucent class="user">
        <ion-icon :icon="personCircleOutline" slot="start"></ion-icon>
        <ion-title class="user-name">
          <h4>{{userName}}</h4>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="main-content">
      <ion-list>
        <ion-item v-for="(item,index) in menuItem" :key="index" class="ion-no-padding" lines="none" @click="item.enabled && navigateFromMenu(item.route)">
          <ion-label>{{item.libelle}}</ion-label>
          <ion-label v-if="!item.enabled" class="soon">Prochainement</ion-label>
          <ion-icon v-if="item.enabled" :icon="item.icon ? item.icon : chevronForward"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer class="menu-footer">
      <ion-list>
        <ion-item lines="none" @click="changeSite">
          <ion-label>{{$t('app.dashboard.menu.change.site')}}</ion-label>
          <ion-icon :icon="chevronForward"></ion-icon>
        </ion-item>
        <ion-item lines="none" @click="disconnect">
          <ion-label>{{$t('app.dashboard.menu.disconnect')}}</ion-label>
          <ion-icon :icon="chevronForward"></ion-icon>
        </ion-item>
        <ion-item lines="none" @click="$router.push('/legal')">
          <ion-label class="ion-text-wrap">{{$t('app.dashboard.menu.legal')}}</ion-label>
          <ion-icon :icon="informationCircleOutline"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-footer>
  </ion-menu>
  <ion-header class="bandeau ion-no-border">
    <ion-toolbar :style="{borderBottomColor: 'var(--'+getCssVarLisere+')'}">
      <ion-buttons class="navigation-button" slot="start">
        <ion-icon v-if="withBurger" :icon="menuOutline" @click="openMenu"></ion-icon>
      </ion-buttons>
      <ion-title><h2 v-html="pageTitle"></h2></ion-title>
    </ion-toolbar>
    <ion-toast cssClass="toast-up"
            :is-open="isToastOpen"
            :message="$t('app.error.missing.permission')"
            :duration="2000"
            @didDismiss="isToastOpen = false">
    </ion-toast>
  </ion-header>
  
</template>

<script lang="ts">
import {AUTH, USER} from '@/modules/Auth/store/mutation-types';
import { store } from '@/plugins/store';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenu,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonFooter,
  IonToast,
  menuController,
} from '@ionic/vue';
import { menuOutline, chevronForward, closeSharp, informationCircleOutline, personCircleOutline, mailOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import SiteService from '@/modules/Site/services/SiteService';
import { SIGNIN } from '@/modules/SignIn/store/mutation-types';

export default defineComponent({
  name: 'TheAppBar',
  props: {
    pageTitle: {
      type: String
    },
    withBurger: {
      type: Boolean
    },
    menuId: {
      type: String
    },
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenu,
    IonIcon,
    IonItem,
    IonList,
    IonContent,
    IonLabel,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonToast
  },
  methods: {
    //Permet de retourner à l'étape de choix du site en désactivant le retour arrière
    changeSite() {
      menuController.close(this.menuId).then( () => {
        this.$router.replace('/site');
      });
    },
    //Reset les informations de l'utilisateur connecté ainsi que son JWT et renvoie à la page de login
    disconnect(){
      store.commit(SIGNIN.SET_CLEAR_CACHE, true);
      store.commit(USER.RESET_USER);
      store.commit(USER.SET_IS_OLD_LOGIN, false);
      menuController.close(this.menuId).then( () => {
        this.$router.replace('/signIn');
      });
    },
    openMenu(){
      menuController.enable(true, this.menuId).then( () => {
        menuController.open(this.menuId);
      });
    },
    //permet de fermer le menu
    closeMenu(){
      menuController.close(this.menuId);
    },
    navigateFromMenu(route: string){
      menuController.close(this.menuId).then( () => {
        menuController.enable(false, this.menuId).then( () =>{
          this.$router.push(route);
        });
      });
    },
  },
  data() {
    const menuItem = [
            {
                id:1,
                libelle: this.$t('app.dashboard.title'),
                enabled: true,
                route: '/predashboard',
            },
            {
              id:2,
              libelle: this.$t('app.dashboard.stats.title'),
              enabled: true,
              route: '/stats',
            },
            {
                id:3,
                libelle: this.$t('app.dashboard.card.title.demande.intervention'),
                enabled: true,
                route: '/createRequest',
            },
            {
                id:4,
                libelle: this.$t('app.dashboard.card.title.rapport.signer'),
                enabled: true,
                route: '/rapports',
            },
            {
                id:5,
                libelle: this.$t('app.dashboard.card.title.suivi.demandes.intervention'),
                enabled: true,
                route: '/suivi-demandes-intervention',
            },
            {
                id:6,
                libelle: this.$t('app.dashboard.card.title.suivi.intervention'),
                enabled: true,
                route: '/suivi-interventions',
            },
            {
                id:7,
                libelle: this.$t('app.dashboard.card.title.demande.devis'),
                enabled: true,
                route: '/demandeDevis',
            },
            {
                id:8,
                libelle: this.$t('app.dashboard.card.title.suivi.devis'),
                enabled: true,
                route: '/suividevis',
            },
            {
                id:9,
                libelle: this.$t('app.dashboard.menu.contact'),
                enabled: true,
                route: '/contact',
                icon: mailOutline,
            },
        ];
    const userName = store.state.authState.user.sub;

    return {
      userName,
      menuItem,
      menuOutline,
      chevronForward,
      closeSharp,
      informationCircleOutline,
      mailOutline,
      personCircleOutline,
    };
  },
  computed: {
    getMenuId(): string | undefined {
      return this.menuId;
    },
    getCssVarLisere(): string {
      return SiteService.getSocieteFromStructureId(`${store.state.siteState.site.structureId}`);
    },
    getLogo(){
      const logoName = SiteService.getSocieteFromStructureId(`${store.state.siteState.site.structureId}`);
      if(logoName === 'inconnue'){
        return null;
      } else {
        return require(`@/assets/dashboard/logos-societes/${logoName}.svg`);
      }
    },
    isToastOpen: {
      get() { return store.state.authState.isToastPermissionOpen;},
      set(value: string) { store.commit(AUTH.SET_IS_TOAST_PERMISSION_OPEN, value);}
    },
  },
});
</script>

<style scoped>
ion-menu.menu ion-toolbar {
  text-align: center;
}
ion-menu.menu .header-md::after { 
  display: none; 
}
.header ion-icon {
  float: right;
  font-size: 40px;
  margin: 10px 10px 0 0;
  color: var(--gris-profond);
}
.user ion-icon {
  font-size: 40px;
  margin: 0 -40px 0 12px;
}
ion-menu.menu ion-label {
  font-family: var(--font-family-roboto);
  font-style: var(--font-style-normal);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-high-medium);
  line-height: var(--line-spacing-medium);
  letter-spacing: var(--character-spacing-0);
  color: var(--gris-profond);
}
ion-menu.menu ion-item {
  margin-left: 5% ;
}
ion-menu.menu ion-title {
  font-family: var(--font-family-roboto);
  font-style: var(--font-style-normal);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-high-large);
  line-height: var(--line-spacing-biggest);
  letter-spacing: var(--character-spacing-0);
  color: var(--gris-profond);
  padding: 0 2%;
}
.header h2{
  font-family: var(--font-family-raleway);
  font-style: var(--font-style-normal);
  font-weight: var(--font-weight-600);
  font-size: var(--font-size-low-large);
  line-height: var(--line-spacing-low-large);
  letter-spacing: var(--character-spacing-0);
  color: var(--gris-profond);
}
ion-footer.menu-footer ion-label {
  font-family: var(--font-family-roboto);
  font-style: var(--font-style-normal);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-medium);
  line-height: var(--line-spacing-medium);
  letter-spacing: var(--character-spacing-0);
  color: var(--gris-profond);
}
ion-menu.menu ion-label.soon {
  font-family: var(--font-family-raleway);
  font-style: var(--font-style-normal);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-low-medium);
  line-height: var(--line-spacing-small);
  letter-spacing: var(--character-spacing-0);
  background-color: var(--bouton-d-action-principal);
  margin: 0 5% 0 0;
  text-align: center;
  color: var(--blanc);
  border-radius: 5px;
}
.navigation-button {
  position: absolute;
}
.navigation-button ion-icon {
  font-size: var(--font-size-very-large);
}
.bandeau {
  height: 10%;
  background-color: var(--bandeau);
  display: flex;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px #00000029;
}
.bandeau ion-toolbar {
  --background: var(--bandeau);
  --color: var(--blanc);
  margin-bottom: -4px;
  border-bottom: 4px solid;
  height: 100%;
  display: flex;
  align-items: center;
}
.user-name{
    margin-left: 40px;
}
.bandeau h2{
  font-family: var(--font-family-raleway);
  font-style: var(--font-style-normal);
  font-weight: var(--font-weight-600);
  font-size: var(--font-size-high-large);
  line-height: var(--line-spacing-biggest);
  letter-spacing: var(--character-spacing-0);
  margin: 0 0 0 5%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.logo {
  max-height: 70px;
}
</style>
