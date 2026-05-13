import { createStore } from 'vuex';
import VersionModule, { VersionState } from '@/modules/Version/store';
import SiteModule, { SiteState } from '@/modules/Site/store';
import OfflineModule, { OfflineState } from '@/modules/Offline/store';
import AuthModule, { AuthState } from '@/modules/Auth/store';
import CreateRequestModule, { CreateRequestState } from '@/modules/Intervention/RequestCreate/store';
import DemandeDevisModule, { DemandeDevisState } from '@/modules/Devis/DemandeDevis/store';
import SuiviDevisModule, { SuiviDevisState } from '@/modules/Devis/SuiviDevis/store';
import SuiviInterventionsModule, { SuiviInterventionsState } from '@/modules/Intervention/SuiviIntervention/store';
import SuiviDemandeInterventionModule, { SuiviDemandeInterventionState } from '@/modules/Intervention/SuiviDemandeIntervention/store';
import ContactModule, { ContactState } from '@/modules/Contact/store';
import { DEMANDE_DEVIS } from '@/modules/Devis/DemandeDevis/store/mutation-types';
import { INTERVENTIONREQUEST, STEPPER } from '@/modules/Intervention/RequestCreate/store/mutation-types';
import { SITE} from '@/modules/Site/store/mutation-types';
import { SUIVIINTERVENTIONS } from '@/modules/Intervention/SuiviIntervention/store/mutation-types';
import { RECHERCHEDEMANDE, SUIVIDEMANDESINTERVENTION } from '@/modules/Intervention/SuiviDemandeIntervention/store/mutation-types';
import { AUTH, USER} from '@/modules/Auth/store/mutation-types';
import { DemandeInterventionModuleAction } from '@/modules/Intervention/RequestCreate/store/actions-types';
import { RECHERCHEDEVIS, SUIVIDEVIS } from '@/modules/Devis/SuiviDevis/store/mutation-types';
import {CONTACT} from '@/modules/Contact/store/mutation-types';
import TagModule, {TagState} from '@/modules/TagNFC/store';
import StatsModule, {StatsState} from '@/modules/Stats/store';
import DashboardModule, {DashBoardState} from '../modules/Dashboard/store';
import SignInModule, {SignInState} from '@/modules/SignIn/store';
import SatisfactionModule, {SatisfactionState} from '@/modules/Satisfaction/store';

export interface RootState {
  versionState: VersionState;
  siteState: SiteState;
  demandeDevisState: DemandeDevisState;
  suiviDevisState: SuiviDevisState;
  offlineState: OfflineState;
  authState: AuthState;
  createRequestState: CreateRequestState;
  suiviDemandeInterventionState: SuiviDemandeInterventionState;
  suiviInterventionsState: SuiviInterventionsState;
  contactState: ContactState;
  tagState: TagState;
  statsStats: StatsState;
  dashboardState: DashBoardState;
  signInState: SignInState;
  satisfactionState: SatisfactionState;
}

export const store = createStore({
  modules: {
    versionState: VersionModule,
    siteState: SiteModule,
    demandeDevisState: DemandeDevisModule,
    suiviDevisState: SuiviDevisModule,
    offlineState: OfflineModule,
    authState: AuthModule,
    createRequestState: CreateRequestModule,
    suiviDemandeInterventionState: SuiviDemandeInterventionModule,
    suiviInterventionsState: SuiviInterventionsModule,
    contactState: ContactModule,
    tagModule: TagModule,
    statsModule: StatsModule,
    dashBoardModule: DashboardModule,
    signInModule: SignInModule,
    satisfactionState: SatisfactionModule
  },
  actions: {
    resetAllStore() {
      store.commit(AUTH.SET_TOKEN, '');
      store.commit(USER.RESET_USER);
      store.dispatch('resetTempStore');
    },
    resetTempStore(){
      store.commit(SITE.RESET_SITE);
      store.commit(DEMANDE_DEVIS.RESET);
      store.commit(RECHERCHEDEVIS.RESET);
      store.commit(SUIVIDEVIS.RESET_PAGE);
      store.commit(SUIVIINTERVENTIONS.RESET);
      store.commit(RECHERCHEDEMANDE.RESET);
      store.commit(SUIVIDEMANDESINTERVENTION.RESET_PAGE);
      store.commit(INTERVENTIONREQUEST.RESET);
      store.commit(STEPPER.RESET_STEPPER);
      store.commit(CONTACT.RESET);
    },
    showAstreinteModal(){
      store.dispatch(DemandeInterventionModuleAction.SHOW_ASTREINTE_MODALE);
    }
  },
});
