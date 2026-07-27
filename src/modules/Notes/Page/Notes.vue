<template>
  <ion-page>
    <ion-content>
      <div class="center">
      <div class="cent-pct">
        <button class="bouton-record" @click="startListening">
          🎤 Démarrer
        </button>
      </div>
      <div class="cent-pct">
        <button class="bouton-stop bouton-record" @click="stopListening">
          ⛔ Stop
        </button>
      </div>
    </div>

<!--    <button @click="checkText">
      Corriger
    </button>

    <button @click="fixText">
      Corriger 2
    </button>

    <button @click="corrigerApi">
      Corriger api
    </button>-->

    <div>
<!--      <form @submit.prevent="sendEmail">
        <input v-model="from_name" type="text" placeholder="Nom" required />

        <input v-model="from_email" type="email" placeholder="Email" required />

        <textarea
          v-model="message"
          placeholder="Message"
          required
        ></textarea>

        <button type="submit">
          Envoyer
        </button>
      </form>

      <form
        action="https://formsubmit.co/pierre.bardary@laposte.et"
        method="POST"
      >
        &lt;!&ndash; Désactive le captcha &ndash;&gt;
        <input type="hidden" name="_captcha" value="false" />

        &lt;!&ndash; Sujet du mail &ndash;&gt;
        <input
          type="hidden"
          name="_subject"
          value="Nouveau message depuis le site"
        />

        &lt;!&ndash; Redirection après envoi &ndash;&gt;
        <input
          type="hidden"
          name="_next"
          value="http://localhost:5173/success"
        />

        <input
          type="text"
          name="name"
          placeholder="Votre nom"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Votre email"
          required
        />

        <textarea
          name="message"
          placeholder="Votre message"
          rows="5"
          required
        ></textarea>

        <button type="submit">
          Envoyer
        </button>
      </form>-->

    </div>

    <div class="submit">
      <form action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="fca847ec-7cc2-42d8-9daf-77b04d780386">
        <input type="hidden" name="name" v-model="name" required>
        <input type="hidden" name="email" v-model="email" required>
        <textarea hidden name="message" v-model="transcript" required></textarea>
        <button type="submit">Mail</button>
      </form>

      <button @click="envoyerServeur">
        Envoyer au serveur
      </button>
    </div>

    <textarea class="textearea" id="transcript" v-model="transcript"></textarea>

    <p>{{ corrected }}</p>
    <p>{{ corrected0 }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {IonPage, IonContent} from '@ionic/vue';
import {computed, defineComponent} from 'vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import {Capacitor} from '@capacitor/core';
import { correctText } from '@/common/utils/grammar';
import NoteService from '@/modules/Notes/service/noteService';

import {store} from '@/plugins/store';

export default defineComponent({
  name: 'NotesPage',
  components: {
    IonPage,
    IonContent
  },
  setup(){
    const transcript = ref('');
    let listener: any = null;
    const isNative = Capacitor.isNativePlatform();
    let recognition: any = null;
    const corrections = ref<any[]>([]);
    const corrected = ref('');
    const corrected0 = ref('');

    let email = ref('');
    const name = ref('Notes');
    const getUser = computed(() => {
      return store.getters['dashboardState/getUser'];
    });

/*    const from_name = ref('');
    const from_email = ref('');
    const message = ref('');*/

/*    const sendEmail = async () => {
      try {
        const response = await emailjs.send(
          'service_fd3klrh',
          'template_erv3nam',
          {
            from_name: from_name.value,
            from_email: from_email.value,
            message: message.value
          },
          '7iqqOds_LS9qwunE2'
        );

        console.log('SUCCESS!', response.status, response.text);
        alert('Email envoyé !');
      } catch (error) {
        console.error('FAILED...', error);
        alert('Erreur lors de l’envoi');
      }
    };*/

    const envoyerServeur = async () => {
      await NoteService.envoyerNotesServeur(transcript.value);
    };

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
      if (isNative) {
        await SpeechRecognition.stop();
      } else {
        recognition.stop();
      }
    };

    const fixText = async () => {
      corrected.value = 'Correction...';

      corrected.value = await correctText(
        transcript.value
      );
    };

    const corrigerApi = async () => {
      await NoteService.ameliorerLanguage(transcript.value);
    };

    const checkText = async () => {
      const params = new URLSearchParams();

      params.append('text', transcript.value);
      params.append('language', 'fr');

      const response = await fetch(
        'https://api.languagetool.org/v2/check',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );

      const data = await response.json();
      console.log(data);

      corrections.value = data.matches.map(
        (match: any) => ({
          message: match.message,
          replacement:
            match.replacements[0]?.value || '',
        })
      );
      console.log(corrections.value);

      corrected0.value = transcript.value;
      console.log(corrected0.value);

      const sortedMatches = data.matches.sort(
        (a: any, b: any) => b.offset - a.offset
      );

      sortedMatches.forEach((match: any) => {
        const replacement =
          match.replacements[0]?.value;

        if (replacement) {
          corrected0.value =
            corrected0.value.substring(0, match.offset) +
            replacement +
            corrected0.value.substring(
              match.offset + match.length
            );
        }

      });
      console.log(transcript.value);
      console.log(corrected0);
    };

    onMounted(async () => {
      email.value = getUser.value.email;
      if (isNative) {
        email.value = 'francois.bardary@gmail.com';

        try {
          const available = await SpeechRecognition.available();
          console.log('Disponible :', available);
        } catch (error) {
          console.error('Erreur available():', error);
        }
      } else {
        const hasWebSpeech =
            !!(window as any).SpeechRecognition ||
            !!(window as any).webkitSpeechRecognition;

        console.log('Disponible (web) :', hasWebSpeech);
      }
    });

    onBeforeUnmount(() => {
      listener?.remove();
    });

    return {
      startListening,
      stopListening,
      checkText,
      fixText,
      corrigerApi,
      // sendEmail,
      envoyerServeur,
      corrected0,
      transcript,
      name,
      email,

/*      from_name,
      from_email,
      message*/

    };
  }
});
</script>

<style scoped>

button {
  margin-right: 10px;
  padding: 10px 15px;
}

.submit {
  display: flex;
  justify-content: center;
}
.bouton-record{
  background-color: #1fb854;
  width: 60%;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
}
.bouton-stop{
  background-color: #cf3c4f;
}
.center{
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.cent-pct {
  width: 100%;
}
.textearea {
  width: 100%;
  height: 50%;
  margin-top: 20px;
}
</style>
