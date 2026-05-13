import { createStore } from 'vuex';
import DashboardModule, {DashBoardState} from '../modules/Dashboard/store';

export interface RootState {
  dashboardState: DashBoardState;
}

export const store = createStore({
  modules: {
    dashboardState: DashboardModule,
  },
  actions: {
    resetAllStore() {
      store.dispatch('resetTempStore');
    },
    resetTempStore(){
    },
    showAstreinteModal(){

    }
  },
});
