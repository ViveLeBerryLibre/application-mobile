<template>
    <ion-toolbar class="titre">
        <ion-buttons v-if="showNav" class="button" slot="start">
            <ion-icon :icon="chevronBackOutline" @click="back"></ion-icon>
        </ion-buttons>
        <h2>{{title}}</h2>
    </ion-toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {IonToolbar, IonButtons, IonIcon, useBackButton } from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import { store } from '@/plugins/store';

export default defineComponent({
    name: 'TitleNav',
    emits: ['go-back'],
    components: {IonToolbar, IonButtons, IonIcon },
    props: {
        title: {
            type: String
        },
        showNav: {
            type: Boolean
        },
        doGoBackStepper: {
            type: Boolean
        },
        backStepperMutationName: {
            type: String
        },
        emitGoBack: {
          type: Boolean
        },
    },
    data(){
        if(this.doGoBackStepper === true){
            useBackButton(1, () => {
                this.goBackStepper();
            });
        } else {
            useBackButton(1, () => {
                this.goBack();
            });
        }
        return {
            chevronBackOutline,
        };
    },
    methods: {
        back(){
          if(this.showNav === true){
            if(this.doGoBackStepper){
              this.goBackStepper();
            } else {
              this.goBack();
            }
          }
        },
        goBackStepper(){
          if(this.backStepperMutationName){
            store.commit(this.backStepperMutationName);
          }
        },
        goBack(){
          if(this.emitGoBack){
            this.$emit('go-back');
          } else {
            this.$router.back();
          }
        },
    },
});
</script>

<style scoped>
.titre h2 {
    font-family: var(--font-family-raleway);
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-high-medium);
    text-align: center;
    margin-bottom: 17px;
}
.button ion-icon {
  font-size: var(--font-size-biggest);
}
</style>