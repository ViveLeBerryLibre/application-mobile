<script setup lang="ts">
import {useRouter} from 'vue-router';
import {computed, ref} from 'vue';

const router = useRouter();

const modelValueTest = defineModel<string>();

// ------------------ Component Props ------------------------
type Props = {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
});

// ------------------ Component States -----------------------
const nom = ref('');

// ------------------ Component Computed ---------------------
const computedName = computed(() => {
  return nom.value.toUpperCase();
})

// ------------------ Component Methods ----------------------
const mtehodTest = () => {

}
</script>

<template>

</template>

<style scoped>

</style>