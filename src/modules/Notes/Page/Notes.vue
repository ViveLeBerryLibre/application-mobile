<template>
  <ion-page>
    <button @click="startListening">
      🎤 Démarrer
    </button>

    <button @click="stopListening">
      ⛔ Stop
    </button>

    <p class="text">
      {{ transcript }}
    </p>
  </ion-page>
</template>

<script lang="ts">
import {IonPage} from '@ionic/vue';
import {defineComponent} from 'vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import {Capacitor} from '@capacitor/core';



export default defineComponent({
  name: 'NotesPage',
  components: {
    IonPage
  },
  setup(){
    const transcript = ref('');
    let listener: any = null;
    const isNative = Capacitor.isNativePlatform();
    let recognition: any = null;

    const checkPermission = async () => {
      const permission = await SpeechRecognition.checkPermissions();

      if (permission.speechRecognition !== 'granted') {
        await SpeechRecognition.requestPermissions();
      }
    };

    const startListening = async () => {
      if (isNative) {
        await checkPermission();

        listener = await SpeechRecognition.addListener(
          'partialResults',
          (data: any) => {
            if (data.matches?.length > 0) {
              transcript.value = data.matches[0];
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
        console.log('Platform not supported');
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

          transcript.value = text;
        };

        recognition.onerror = (event: any) => {
          console.error(event.error);
        };

        recognition.start();
      }


    };

    const stopListening = async () => {
      await SpeechRecognition.stop();
    };

    onMounted(async () => {
      const available = await SpeechRecognition.available();

      console.log('Disponible :', available);
    });

    onBeforeUnmount(() => {
      listener?.remove();
    });

    return {
      startListening,
      stopListening,
      transcript,
    };
  }
});
</script>

<style scoped>
.container {
  padding: 20px;
}

button {
  margin-right: 10px;
  padding: 10px 15px;
}

.text {
  margin-top: 20px;
  font-size: 18px;
}
</style>