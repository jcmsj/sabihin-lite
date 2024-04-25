<template>
  <div class="flex justify-center font-chillax">

    <Head>
      <Title>Sign Up</Title>
    </Head>
    <form class="card card-normal h-max w-full max-w-xl"
      @submit.prevent="register(username, password, DOMAIN)"
     >
      <div class="card-body">
        <!-- TODO: Use the commented labels for errors/assistance -->
        <NewUsername v-model="username" :host="host"/>
        <!-- <NewEmail v-model="email" /> -->
        <NewPassword v-model="password" />
        <div class="card-actions flex-col items-center gap-y-4">
          <button class="btn-primary btn h-full p-3 text-xl">Sign Up</button>
          <NuxtLink to="/login" class="btn-ghost btn text-xl underline"> Login instead </NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { register } from '~/utils/register';
import {DOMAIN} from "~/utils/domain"

definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
  // Can't access window statically
// const host = computed(() => window.location.host);
const host = "localhost:3000"
const username = ref("");
// const email = ref("");
const password = ref("");

</script>
<style scoped>

:deep(.input) {
  @apply lg:py-8 text-xl bg-base-300
}
</style>
