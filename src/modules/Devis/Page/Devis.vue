<template>
  <ion-page>
    <ion-content>
      <div class="page-wrapper">
        <div v-if="step === 1" class="form-container">
          <h2 class="section-title">Chantier</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Type chantier</label>
              <select v-model="devis.chantierDTO.typeChantier">
                <option value="Reconnaissance structurelle">Reconnaissance structurelle</option>
                <option value="Diagnostic structurel">Diagnostic structurel</option>
              </select>
            </div>
            <div class="form-field">
              <label>Libellé</label>
              <input v-model="devis.chantierDTO.libelle">
            </div>
            <div class="form-field">
              <label>Adresse</label>
              <input v-model="devis.chantierDTO.adresse">
            </div>
            <div class="form-field">
              <label>Année de construction</label>
              <input type="number" v-model.number="devis.chantierDTO.anneeConstruction">
            </div>
            <div class="form-field">
              <label>Nature</label>
              <input v-model="devis.chantierDTO.nature">
            </div>
          </div>

          <h2 class="section-title">Client</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Libellé adresse</label>
              <input v-model="devis.clientDTO.adresseDTO.libelle">
            </div>
            <div class="form-field">
              <label>N° rue</label>
              <input type="number" v-model.number="devis.clientDTO.adresseDTO.numero">
            </div>
            <div class="form-field">
              <label>Nom rue</label>
              <input v-model="devis.clientDTO.adresseDTO.nomRue">
            </div>
            <div class="form-field">
              <label>Code postal</label>
              <input type="number" v-model.number="devis.clientDTO.adresseDTO.codePostal">
            </div>
            <div class="form-field">
              <label>Ville</label>
              <input v-model="devis.clientDTO.adresseDTO.ville">
            </div>
            <div class="form-field">
              <label>Genre</label>
              <select v-model="devis.clientDTO.genre">
                <option value="MONSIEUR">Monsieur</option>
                <option value="MADAME">Madame</option>
              </select>
            </div>
            <div class="form-field">
              <label>Nom client</label>
              <input v-model="devis.clientDTO.nom">
            </div>
            <div class="form-field">
              <label>Prénom client</label>
              <input v-model="devis.clientDTO.prenom">
            </div>
            <div class="form-field">
              <label>Mail client</label>
              <input v-model="devis.clientDTO.mail">
            </div>
          </div>
        </div>

        <div v-else class="form-container">
          <h2 class="section-title">§1</h2>
          <div class="center">
            Intro
            <div class="cent-pct">
              <button class="bouton-record" @click="startListening('pararagraphe1Intro')">
                🎤 Démarrer
              </button>
            </div>
            <div class="cent-pct">
              <button class="bouton-stop bouton-record" @click="stopListening">
                ⛔ Stop
              </button>
            </div>
          </div>

          <textarea class="textearea" id="pararagraphe1Intro" v-model="fields.pararagraphe1Intro"></textarea>

          <div class="center">
            Description
            <div class="cent-pct">
              <button class="bouton-record" @click="startListening('pararagraphe1Description')">
                🎤 Démarrer
              </button>
            </div>
            <div class="cent-pct">
              <button class="bouton-stop bouton-record" @click="stopListening">
                ⛔ Stop
              </button>
            </div>
          </div>

          <textarea class="textearea" id="pararagraphe1Intro" v-model="fields.pararagraphe1Description"></textarea>

          <div>Nombre de points :<input type="number" v-model="nbPointParagraphe1" @input="addPointPar1"></div>
          <div v-for="(point, index) in nbPointParagraphe1" :key="index">
            <input v-model="devis.paragrapheUnDTO.points[index]">
            <button class="bouton-record bouton-smaller" @click="startListeningPourPoint((val: any) => devis.paragrapheUnDTO.points[index] = val)">
              🎤 Démarrer
            </button>
            <button class="bouton-stop bouton-record bouton-smaller" @click="stopListening">
              ⛔ Stop
            </button>
          </div>

          <h2 class="section-title">§2</h2>

        </div>

        <div class="nav-bar">
          <button class="btn btn-secondary" @click="precedent" :disabled="step === 1">
            ← Précédent
          </button>
          <div class="dots">
            <div class="dot" :class="{ active: step === 1 }">1</div>
            <div class="dot" :class="{ active: step === 2 }">2</div>
          </div>
          <button class="btn btn-primary" @click="suivant">
            Suivant →
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import {defineComponent, onBeforeMount, onBeforeUnmount, ref, reactive, computed} from 'vue';
import {SpeechRecognition} from '@capacitor-community/speech-recognition';
import {Capacitor} from '@capacitor/core';
import {DevisDTO} from '@/models/DevisDTO';
import {createEmptyDevisDTO} from '@/models/utils/DevisFactory';
import {store} from '@/plugins/store';

export default defineComponent({
  name: 'DevisPage',
  components: {
    IonPage,
    IonContent
  },
  setup(){
    // Tous les champs "vocaux" centralisés ici
    const fields = reactive<Record<string, string>>({
      pararagraphe1Intro: '',
      pararagraphe1Description: ''
    });

    const isNative = Capacitor.isNativePlatform();
    let recognition: any = null;
    let listener: any = null;
    const activeField = ref<string | null>(null);
    const activeSetter = ref<((value: string) => void) | null>(null);
    let step = ref(2);
    let nbPointParagraphe1 = ref(1);
    let devis = reactive<DevisDTO>(createEmptyDevisDTO());
    const getUser = computed(() => {
      return store.getters['dashboardState/getUser'];
    });
    const previousNbPoints = ref(1);


    const suivant = async () => {
      step.value++;
    };

    const precedent = async () => {
      step.value--;
    };

    const addPointPar1 = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const newValue = Number(target.value);

      if (newValue > previousNbPoints.value) {
        console.log('➕ Ajout de point(s)');
        // ajoute les nouvelles entrées vides dans le tableau points
        for (let i = previousNbPoints.value; i < newValue; i++) {
          devis.paragrapheUnDTO.points.push('');
        }
      } else if (newValue < previousNbPoints.value) {
        console.log('➖ Réduction de point(s)');
        // retire les entrées en trop
        devis.paragrapheUnDTO.points.splice(newValue);
      }

      previousNbPoints.value = newValue;
      nbPointParagraphe1.value = newValue;
    };

    const checkPermission = async () => {
      const permission = await SpeechRecognition.checkPermissions();

      if (permission.speechRecognition !== 'granted') {
        await SpeechRecognition.requestPermissions();
      }
    };

    const startListening = async (fieldKey: string) => {
      activeField.value = fieldKey;

      if (isNative) {
        await checkPermission();

        listener = await SpeechRecognition.addListener(
            'partialResults',
            (data: any) => {
              if (data.matches?.length > 0  && activeField.value) {
                fields[activeField.value] = data.matches[0];
              }
            }
        );

        await SpeechRecognition.start({
          language: 'fr-FR',
          partialResults: true,
          popup: false,
          maxResults: 1,
        });
      } else {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
          alert('Speech Recognition non supporté');
          return;
        }

        recognition = new SpeechRecognition();

        recognition.lang = 'fr-FR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let text = '';

          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }

          if (activeField.value) {
            fields[activeField.value] = text;
          }

        };

        recognition.onerror = (event: any) => {
          console.error(event.error);
        };

        recognition.start();
      }

    };

    const stopListening = async () => {
      if (isNative) {
        await SpeechRecognition.stop();
      } else {
        recognition.stop();
      }
    };

    const startListeningPourPoint = async (setter: (value: string) => void) => {
      activeSetter.value = setter;

      if (isNative) {
        await checkPermission();

        listener = await SpeechRecognition.addListener(
            'partialResults',
            (data: any) => {
              if (data.matches?.length > 0 && activeSetter.value) {
                activeSetter.value(data.matches[0]);
              }
            }
        );

        await SpeechRecognition.start({
          language: 'fr-FR',
          partialResults: true,
          popup: false,
          maxResults: 1,
        });
      } else {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
          alert('Speech Recognition non supporté');
          return;
        }

        recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (activeSetter.value) {
            activeSetter.value(text);
          }
        };

        recognition.onerror = (event: any) => {
          console.error(event.error);
        };

        recognition.start();
      }
    };

    onBeforeMount (() => {
      devis.redacteur = getUser.value.prenom + getUser.value.nom;

      devis.interlocuteurDTO.id = getUser.value.id;
      devis.interlocuteurDTO.prenom = getUser.value.prenom;
      devis.interlocuteurDTO.nom = getUser.value.nom;
      devis.interlocuteurDTO.telephone = getUser.value.telephone;
      devis.interlocuteurDTO.mail = getUser.value.mail;
    });

    onBeforeUnmount(() => {
      listener?.remove();
    });

    return {
      startListening,
      stopListening,
      fields,
      step,
      devis,
      suivant,
      precedent,
      nbPointParagraphe1,
      addPointPar1,
      startListeningPourPoint
    };
  }
});
</script>

<style scoped>
.page-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 96px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

/* --- Colonnes du formulaire --- */
.form-container {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  row-gap: 20px;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.form-field input,
.form-field select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-field input:focus,
.form-field select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* --- Textareas (step 2) --- */
.textearea {
  width: 100%;
  min-height: 60px;
  margin: 12px 0 24px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
}

.center {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.cent-pct {
  flex: 1;
}

.bouton-record {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.bouton-smaller {
  width: 20%;
}

.bouton-record:hover {
  background: #dbeafe;
}

.bouton-stop {
  background: #fef2f2;
  color: #dc2626;
}

.bouton-stop:hover {
  background: #fee2e2;
}

/* --- Barre de navigation Précédent / Suivant --- */
.nav-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
  padding: 16px 0;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease, transform 0.1s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* --- Dots (déjà existants) --- */
.dots {
  display: flex;
  gap: 12px;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  background: #e5e7eb;
  color: #6b7280;
}

.dot.active {
  background: #2563eb;
  color: #fff;
}
</style>