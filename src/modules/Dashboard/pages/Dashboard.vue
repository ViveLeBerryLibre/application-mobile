<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bardary Brothers</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <div class="dashboard-container">
        <!-- User Info Button -->
        <ion-card class="user-info-card">
          <ion-card-content>
            <ion-button 
              fill="clear" 
              size="large" 
              class="user-info-button"
              @click="showUserInfo"
            >
              <ion-icon name="person-circle-outline" slot="start"></ion-icon>
              <div class="user-info-text">
                <div class="user-name">{{ userData.prenom }} {{ userData.nom }}</div>
                <div class="user-email">{{ userData.email }}</div>
              </div>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button 
            expand="block" 
            size="large" 
            color="primary"
            class="action-button devis-button"
            @click="navigateToDevis"
          >
            <ion-icon name="document-text-outline" slot="start"></ion-icon>
            Devis
          </ion-button>

          <ion-button 
            expand="block" 
            size="large" 
            color="secondary"
            class="action-button rapports-button"
            @click="navigateToRapports"
          >
            <ion-icon name="bar-chart-outline" slot="start"></ion-icon>
            Rapports
          </ion-button>

          <ion-button 
            expand="block" 
            size="large" 
            color="tertiary"
            class="action-button notes-button"
            @click="navigateToNotes"
          >
            <ion-icon name="create-outline" slot="start"></ion-icon>
            Notes
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonButton, 
  IonIcon,
  alertController
} from '@ionic/vue';
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import userData from '@/data/userData.json';

export default defineComponent({
  name: 'Dashboard',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon
  },
  setup() {
    const router = useRouter();
    const userInfo = ref(userData);

    const showUserInfo = async () => {
      const alert = await alertController.create({
        header: 'Informations utilisateur',
        message: `
          <strong>Nom:</strong> ${userInfo.value.nom}<br>
          <strong>Prénom:</strong> ${userInfo.value.prenom}<br>
          <strong>Email:</strong> ${userInfo.value.email}
        `,
        buttons: ['OK']
      });
      await alert.present();
    };

    const navigateToDevis = () => {
      router.push('/demandeDevis');
    };

    const navigateToRapports = () => {
      router.push('/rapports');
    };

    const navigateToNotes = () => {
      // For now, show an alert since Notes page doesn't exist yet
      showNotesAlert();
    };

    const showNotesAlert = async () => {
      const alert = await alertController.create({
        header: 'Notes',
        message: 'La fonctionnalité Notes sera bientôt disponible.',
        buttons: ['OK']
      });
      await alert.present();
    };

    return {
      userData: userInfo,
      showUserInfo,
      navigateToDevis,
      navigateToRapports,
      navigateToNotes
    };
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-info-card {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-info-button {
  width: 100%;
  height: auto;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.user-info-text {
  margin-left: 12px;
  text-align: left;
}

.user-name {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--ion-color-dark);
}

.user-email {
  font-size: 0.9em;
  color: var(--ion-color-medium);
  margin-top: 4px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  justify-content: center;
}

.action-button {
  height: 60px;
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 12px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.devis-button {
  --background: #3880ff;
  --background-hover: #3171e0;
  --background-activated: #2961c9;
}

.rapports-button {
  --background: #5260ff;
  --background-hover: #4854e0;
  --background-activated: #3e4bc9;
}

.notes-button {
  --background: #2dd36f;
  --background-hover: #24c65f;
  --background-activated: #1fb854;
}

ion-icon {
  font-size: 1.5em;
}
</style>