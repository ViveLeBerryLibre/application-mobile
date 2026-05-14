<template>
  <ion-page>
    <ion-header class="green">
      <ion-toolbar class="green">
        <ion-title class='center'>Bardary Brothers</ion-title>
        <div slot="end" class="user-pill" @click="showUserInfo">
          <img :src="getIcon" alt="userInfo">
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="dashboard-container">
        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button 
            expand="block" 
            size="large" 
            color="primary"
            class="action-button devis-button"
            @click="navigateToDevis"
          >
<!--            todo mettre un icon-->
            Devis
          </ion-button>

          <ion-button 
            expand="block" 
            size="large" 
            color="secondary"
            class="action-button rapports-button"
            @click="navigateToRapports"
          >
            <!--            todo mettre un icon-->
            <!--            <ion-icon name="bar-chart-outline" slot="start"></ion-icon>-->
            Rapports
          </ion-button>

<!--          <ion-button
            expand="block" 
            size="large" 
            color="tertiary"
            class="action-button notes-button"
            @click="navigateToNotes"
          >
            Notes
          </ion-button>-->

          <ion-button
            expand="block"
            size="small"
            color="tertiary"
            class="action-button notes-button"
            @click="goToNotes"
          >
            <!--            todo mettre un icon-->
            <!--            <ion-icon name="create-outline" slot="start"></ion-icon>-->
            Notes 2
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
  IonButton,
  //IonIcon,
  alertController,
  loadingController,
  toastController
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import userData from '@/data/userData.json';
import OpenAIWhisperService from '@/common/services/OpenAIWhisperService';

export default defineComponent({
  name: 'DashboardPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    //IonIcon
  },
  computed: {
    getIcon() {
      return require('@/assets/userInfo.png');
    },
  },
  setup() {
    const router = useRouter();
    const userInfo = ref(userData);
    const isRecording = ref(false);
    const transcribedText = ref('');

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
      router.push('/devis');
    };

    const navigateToRapports = () => {
      router.push('/rapports');
    };

    const navigateToNotes = () => {
      showVoiceNotesOptions();
    };

    const goToNotes = () => {
      router.push('/notes');
    };

    const showVoiceNotesOptions = async () => {
      const alert = await alertController.create({
        header: 'Notes Vocales',
        message: 'Choisissez une option pour vos notes:',
        buttons: [
          {
            text: 'Configurer API Key',
            handler: () => {
              showApiKeyInput();
            }
          },
          {
            text: 'Enregistrer Note Vocale',
            handler: () => {
              startVoiceRecording();
            }
          },
          {
            text: 'Voir Notes Transcrites',
            handler: () => {
              showTranscribedNotes();
            }
          },
          {
            text: 'Annuler',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    };

    const showApiKeyInput = async () => {
      const alert = await alertController.create({
        header: 'Configuration OpenAI',
        message: 'Entrez votre clé API OpenAI pour utiliser Whisper:',
        inputs: [
          {
            name: 'apiKey',
            type: 'password',
            placeholder: 'sk-...'
          }
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Sauvegarder',
            handler: (data) => {
              if (data.apiKey && data.apiKey.trim()) {
                OpenAIWhisperService.setApiKey(data.apiKey.trim());
                showToast('Clé API configurée avec succès!', 'success');
                return true;
              } else {
                showToast('Veuillez entrer une clé API valide', 'danger');
                return false;
              }
            }
          }
        ]
      });
      await alert.present();
    };

    const startVoiceRecording = async () => {
      try {
        const loading = await loadingController.create({
          message: 'Préparation de l\'enregistrement...'
        });
        await loading.present();

        const started = await OpenAIWhisperService.startRecording();
        await loading.dismiss();

        if (started) {
          isRecording.value = true;
          showRecordingControls();
        } else {
          showToast('Impossible de démarrer l\'enregistrement', 'danger');
        }
      } catch (error) {
        showToast('Erreur lors du démarrage de l\'enregistrement', 'danger');
        console.error('Recording error:', error);
      }
    };

    const showRecordingControls = async () => {
      const alert = await alertController.create({
        header: 'Enregistrement en cours...',
        message: 'Parlez maintenant. Appuyez sur "Arrêter" quand vous avez terminé.',
        buttons: [
          {
            text: 'Arrêter l\'enregistrement',
            handler: () => {
              stopVoiceRecording();
            }
          }
        ],
        backdropDismiss: false
      });
      await alert.present();
    };

    const stopVoiceRecording = async () => {
      try {
        const loading = await loadingController.create({
          message: 'Arrêt de l\'enregistrement et transcription...'
        });
        await loading.present();

        const recordingResult = await OpenAIWhisperService.stopRecording();
        isRecording.value = false;

        if (recordingResult) {
          const transcriptionResult = await OpenAIWhisperService.transcribeAudio(recordingResult);
          await loading.dismiss();

          if (transcriptionResult.success) {
            transcribedText.value = transcriptionResult.text;
            showTranscriptionResult(transcriptionResult.text);
          } else {
            showToast(`Erreur de transcription: ${transcriptionResult.error}`, 'danger');
          }
        } else {
          await loading.dismiss();
          showToast('Erreur lors de l\'arrêt de l\'enregistrement', 'danger');
        }
      } catch (error) {
        await loadingController.dismiss();
        showToast('Erreur lors de la transcription', 'danger');
        console.error('Transcription error:', error);
      }
    };

    const showTranscriptionResult = async (text: string) => {
      const alert = await alertController.create({
        header: 'Transcription',
        message: `<p><strong>Texte transcrit:</strong></p><p>${text}</p>`,
        buttons: [
          {
            text: 'Copier',
            handler: () => {
              navigator.clipboard.writeText(text);
              showToast('Texte copié dans le presse-papiers', 'success');
            }
          },
          {
            text: 'OK'
          }
        ]
      });
      await alert.present();
    };

    const showTranscribedNotes = async () => {
      const message = transcribedText.value 
        ? `<p><strong>Dernière note transcrite:</strong></p><p>${transcribedText.value}</p>`
        : 'Aucune note transcrite disponible.';

      const alert = await alertController.create({
        header: 'Notes Transcrites',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    };

    const showToast = async (message: string, color: 'success' | 'danger' | 'warning' = 'success') => {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        color: color,
        position: 'bottom'
      });
      await toast.present();
    };

    return {
      userData: userInfo,
      isRecording,
      showUserInfo,
      navigateToDevis,
      navigateToRapports,
      navigateToNotes,
      goToNotes,
    };
  }
});
</script>

<style scoped>
/* User pill styling in header */
.user-pill {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 12px;
  margin-right: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-pill:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-icon {
  color: white;
  font-size: 20px;
  margin-right: 6px;
}

.user-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

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
  align-items: center;
}

.action-button {
  height: 60px;
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 12px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 70%;
}

.devis-button {
  --background: #3880ff;
  --background-hover: #3171e0;
  --background-activated: #2961c9;
  text-align: center;
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

.green {
  background-color: #01a0c6 !important;
}
</style>
