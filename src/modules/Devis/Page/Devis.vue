<template>
  <ion-page>
    <ion-content>
      <div class="center">
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

    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import {defineComponent, onBeforeUnmount, ref, reactive} from 'vue';
import {SpeechRecognition} from '@capacitor-community/speech-recognition';
import {Capacitor} from '@capacitor/core';

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

    onBeforeUnmount(() => {
      listener?.remove();
    });

    return {
      startListening,
      stopListening,
      fields,
    };
  }
});
</script>

<style scoped>

</style>