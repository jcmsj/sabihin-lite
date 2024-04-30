<template>
  <div class="flex justify-center font-chillax">

    <Head>
      <Title>Sign Up</Title>
    </Head>
    <form class="card card-normal h-max w-full max-w-xl"
      @submit.prevent="onSubmit"
     >
      <div class="card-body">
        <!-- TODO: Use the commented labels for errors/assistance -->
        <NewUsername v-model="username" :host="host" :inputClass="{'input-error': httpState == 409}">
          <template #top-right-label>
            <span class="text-error text-xl">
              <span v-if="httpState == 409">Username is already taken</span>
            </span>
          </template>
        </NewUsername>
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
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
const host = "localhost:3000"
const username = ref("");
const password = ref("");
const httpState = ref<number>(200)
const duplicateUsernames = ref<string[]>([])
watchEffect(() => {
  if (duplicateUsernames.value.includes(username.value) ) {
    httpState.value = 409
  } else {
    httpState.value = 200
  }
})
async function onSubmit() {
  const response = await register(username.value, password.value, DOMAIN);
  console.log(response)
  httpState.value = response.status
  if (response.status == 409 && response.message == '[POST] "/api/register": 409 Username already exists') {
    duplicateUsernames.value.push(username.value)
  }
}
</script>
<style scoped>

:deep(.input) {
  @apply lg:py-8 text-xl bg-base-300
}
</style>
