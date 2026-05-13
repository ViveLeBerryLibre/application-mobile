<template>
    <div class="header" @click="toggleContent">
        <slot name="header"></slot>
        <ion-icon :icon="chevronUp" ref="icon"></ion-icon>
    </div>
    <div v-if="isOpen">
        <slot name="content"></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonIcon, createAnimation } from '@ionic/vue';
import { chevronUp } from 'ionicons/icons';

export default defineComponent({
    name: 'AccordionItem',
    components: { IonIcon },
    data(){
        const isOpen = true;
        const icon: typeof IonIcon | any = undefined;
        return {
            isOpen,
            chevronUp,
            icon
        };
    },
    methods: {
        toggleContent(){
            this.animateIcon();
            this.isOpen = !this.isOpen;
        },
        animateIcon(){
            if(this.isOpen){
                createAnimation().addElement(this.icon.$el)
                .duration(150)
                .fromTo('transform', 'rotate(0deg)', 'rotate(180deg)')
                .play();
            } else {
                createAnimation().addElement(this.icon.$el)
                .duration(150)
                .fromTo('transform', 'rotate(180deg)', 'rotate(0deg)')
                .play();
            }
        }
    },
    mounted(){
        this.icon = this.$refs.icon;
    }
});
</script>

<style scoped>
.header {
  background-color: var(--blanc-casse);
  padding: 0px 20px 0px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
ion-icon {
  font-size: 20px;
}
</style>