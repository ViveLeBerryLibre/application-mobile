<template>
  <ion-header class="green">
    <ion-toolbar class="green">
      <ion-title class='center'>Bardary Brothers</ion-title>
      <div slot="end" class="user-pill" @click="showUserInfo">
        <img :src="getIcon" alt="userInfo">
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">

import {alertController, IonHeader, IonTitle, IonToolbar, toastController} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import userData from '@/data/userData.json';

export default defineComponent({
  name: 'HeaderPage',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
  },
  computed: {
    getIcon() {
      return require('@/assets/userInfo.png');
    },
  },
  setup() {
    const userInfo = ref({...userData});

    const showUserInfo = async () => {
      const alert = await alertController.create({
        header: 'Informations utilisateur',
        message: `
          <strong>Nom:</strong> ${userInfo.value.nom}<br>
          <strong>Prénom:</strong> ${userInfo.value.prenom}<br>
          <strong>Email:</strong> ${userInfo.value.email}
        `,
        buttons: [
          {
            text: 'Modifier',
            handler: () => {
              showEditUserInfo();
            }
          },
          {
            text: 'Fermer',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
    };

    const showEditUserInfo = async () => {
      const alert = await alertController.create({
        header: 'Modifier les informations',
        inputs: [
          {
            name: 'nom',
            type: 'text',
            placeholder: 'Nom',
            value: userInfo.value.nom
          },
          {
            name: 'prenom',
            type: 'text',
            placeholder: 'Prénom',
            value: userInfo.value.prenom
          },
          {
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            value: userInfo.value.email
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
              if (data.nom && data.prenom && data.email) {
                saveUserInfo(data);
              } else {
                showErrorToast('Veuillez remplir tous les champs');
                return false;
              }
            }
          }
        ]
      });
      await alert.present();
    };

    const saveUserInfo = async (newData: any) => {
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newData.email)) {
          showErrorToast('Format d\'email invalide');
          return;
        }

        userInfo.value = {
          nom: newData.nom.trim(),
          prenom: newData.prenom.trim(),
          email: newData.email.trim()
        };

        // Sauvegarde dans le localStorage
        localStorage.setItem('userData', JSON.stringify(userInfo.value));

        showSuccessToast('Informations mises à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showErrorToast('Erreur lors de la sauvegarde');
      }
    };

    const showSuccessToast = async (message: string) => {
      const toast = await toastController.create({
        message: message,
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    };

    const showErrorToast = async (message: string) => {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    };

    // Charger les données depuis le localStorage au démarrage
    const loadUserData = () => {
      const savedData = localStorage.getItem('userData');
      if (savedData) {
        try {
          userInfo.value = JSON.parse(savedData);
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
        }
      }
    };

    // Charger les données au démarrage
    loadUserData();

    return {
      userInfo,
      showUserInfo,
    };
  }
});
</script>

<style scoped>
.green {
  --background: #01a0c6;
  --color: white;
}

.center {
  text-align: center;
}

.user-pill {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-pill:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-pill img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

ion-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
