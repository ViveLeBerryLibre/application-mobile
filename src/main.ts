import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n';
import { IonicVue } from '@ionic/vue';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { useState } from './plugins/state';
import { store } from './plugins/store';
import {msalInstance} from '@/authenticationConfig';
import {msalPlugin} from './plugins/msalPlugin';


/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {CustomNavigationClient} from '@/router/CustomNavigationClient';

const navigationClient = new CustomNavigationClient(router);
msalInstance.setNavigationClient(navigationClient);

const app = createApp(App)
  .use(IonicVue)
  .use(i18n)
  .use(router)
  .use(store)
  .use(msalPlugin, msalInstance);

const [jsonListeners, setJsonListeners] = useState(false);
const [isModal, setIsModal] = useState(false);
const [message, setMessage] = useState('');
app.config.globalProperties.$isModalOpen = {isModal: isModal, setIsModal: setIsModal};
app.config.globalProperties.$isJsonListeners = {jsonListeners: jsonListeners, setJsonListeners: setJsonListeners};
app.config.globalProperties.$messageContent = {message: message, setMessage: setMessage};

const onProgressImport = async (progress: string) => {
  if(app.config.globalProperties.$isJsonListeners.jsonListeners.value) {
    if(!app.config.globalProperties.$isModalOpen.isModal.value) app.config.globalProperties.$isModalOpen.setIsModal(true);
    app.config.globalProperties.$messageContent.setMessage(
        app.config.globalProperties.$messageContent.message.value.concat(`${progress}\n`));
  }
};
const onProgressExport = async (progress: string) => {
  if(app.config.globalProperties.$isJsonListeners.jsonListeners.value) {
    if(!app.config.globalProperties.$isModalOpen.isModal.value) app.config.globalProperties.$isModalOpen.setIsModal(true);
    app.config.globalProperties.$messageContent.setMessage(
      app.config.globalProperties.$messageContent.message.value.concat(`${progress}\n`));
  }
};

//Existing Connections
const [existConn, setExistConn] = useState(false);

//  Existing Connections Store
app.config.globalProperties.$existingConn = {existConn: existConn, setExistConn: setExistConn};
  
router.isReady().then(() => {
  app.mount('#app');
});

defineCustomElements(window);