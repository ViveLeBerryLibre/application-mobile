import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import SignIn from '@/modules/SignIn/pages/SignIn.vue';
import SitePage from '@/modules/Site/pages/Site.vue';
import DashboardPage from '@/modules/Dashboard/pages/Dashboard.vue';
import RequestCreate from '@/modules/Intervention/RequestCreate/pages/RequestCreate.vue';
import RapportsPage from '@/modules/Intervention/RapportsASigner/pages/Rapports.vue';
import DemandeDevis from '@/modules/Devis/DemandeDevis/pages/DemandeDevis.vue';
import SuiviDevis from '@/modules/Devis/SuiviDevis/pages/SuiviDevis.vue';
import SuiviDemandeIntervention from '@/modules/Intervention/SuiviDemandeIntervention/pages/SuiviDemandeIntervention.vue';
import SuiviInterventions from '@/modules/Intervention/SuiviIntervention/pages/SuiviInterventions.vue';
import DemandeIntervention from '@/modules/Intervention/SuiviDemandeIntervention/pages/DemandeIntervention.vue';
import InterventionPage from '@/modules/Intervention/common/pages/Intervention.vue';
import ContactPage from '@/modules/Contact/pages/ContactPage.vue';
import DevisPage from '@/modules/Devis/SuiviDevis/pages/Devis.vue';
import LegalPage from '@/modules/Legal/Legal.vue';
import { store } from '@/plugins/store';
import { Permissions } from '@/router/AccessControl';
import PreDashboardPage from '@/modules/PreDashboard/PreDashboardPage.vue';
import StatsPage from '@/modules/Stats/StatsPage.vue';
import SuiviPreventif from '@/modules/Intervention/SuiviIntervention/components/Preventif/SuiviPreventif.vue';
import SuiviTravaux from '@/modules/Intervention/SuiviIntervention/components/Travaux/SuiviTravaux.vue';
import TagNFC from '@/modules/TagNFC/Page/TagNFC.vue';
//import {registerGuard} from '@/router/Guards';
import SatisfactionPage from '@/modules/Satisfaction/SatisfactionPage.vue';
import AccueilSatisfactionPage from '@/modules/Satisfaction/AccueilSatisfactionPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signIn',
    name: 'SignIn',
    component: SignIn,
    beforeEnter() {
      store.dispatch('resetAllStore');
      return true;
    },
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/site',
    name: 'Site',
    component: SitePage,
    beforeEnter() {
      store.dispatch('resetTempStore');
      return true;
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/legal',
    name: 'Legal',
    component: LegalPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/createRequest',
    name: 'RequestCreate',
    component: RequestCreate,
    async beforeEnter() {
      if(Permissions.userCanAccess(Permissions.CREER_DEMANDE_INTERVENTION)){
        store.dispatch('showAstreinteModal');
        return true;
      }
      return false;
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/rapports',
    name: 'Rapports',
    component: RapportsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/demandeDevis',
    name: 'DemandeDevis',
    component: DemandeDevis,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suividevis',
    name: 'SuiviDevis',
    component: SuiviDevis,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suividevis/:id',
    name: 'Devis',
    component: DevisPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suivi-demandes-intervention',
    name: 'SuiviDemandesIntervention',
    component: SuiviDemandeIntervention,
    beforeEnter() {
      return Permissions.userCanAccess(Permissions.CONSULTER_DEMANDE_INTERVENTION);
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suivi-interventions',
    name: 'SuiviInterventions',
    component: SuiviInterventions,
    beforeEnter() {
      return Permissions.userCanAccess(Permissions.CONSULTER_INTERVENTION_PREVENTIVE, Permissions.CONSULTER_INTERVENTION_NON_PREVENTIVE);
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/demande-intervention/:id',
    name: 'DemandeIntervention',
    component: DemandeIntervention,
    beforeEnter() {
      return Permissions.userCanAccess(Permissions.CONSULTER_DEMANDE_INTERVENTION);
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/intervention/:id',
    name: 'Intervention',
    component: InterventionPage,
    beforeEnter() {
      return Permissions.userCanAccess(Permissions.CONSULTER_INTERVENTION_PREVENTIVE, Permissions.CONSULTER_INTERVENTION_NON_PREVENTIVE);
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/predashboard',
    name: 'PreDashboard',
    component: PreDashboardPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stats',
    name: 'StatsPage',
    component: StatsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suivi-preventif',
    name: 'SuiviPreventif',
    component: SuiviPreventif,
    beforeEnter() {
      return Permissions.userCanAccess(Permissions.CONSULTER_INTERVENTION_PREVENTIVE);
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/suivi-travaux',
    name: 'SuiviTravaux',
    component: SuiviTravaux,
    beforeEnter() {
      return Permissions.userCanAccess(Permissions.CONSULTER_INTERVENTION_NON_PREVENTIVE);
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tag-nfc',
    name: 'TagNFC',
    component: TagNFC,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/satisfaction',
    name: 'Satisfaction',
    component: SatisfactionPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/accueilSatisfaction',
    name: 'AccueilSatisfaction',
    component: AccueilSatisfactionPage,
    meta: {
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

//registerGuard(router);

export default router;
