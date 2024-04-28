<template>
  <div class="flex justify-center">

    <Head>
      <Title>Login</Title>
    </Head>
    <div class="flex w-full max-w-xl flex-col items-center self-center">
      <form class="card card-normal h-max w-full self-center" @submit.prevent="login(username, password, DOMAIN)">
        <div class="card-body">
          <!-- TODO: Use the commented labels for errors/assistance -->
          <label class="label">
            <span class="label-text">Username:</span>
            <!-- <span class="label-text-alt">Top Right label</span> -->
          </label>
          <input required class="input bg-base-300 text-lg" type="text" name="username" id="username"
            placeholder="username" v-model="username" />
          <label class="label">
            <!-- <span class="label-text-alt">Bottom Left label</span>
                    <span class="label-text-alt">Bottom Right label</span> -->
          </label>
          <label class="label">
            <span class="label-text">Password:</span>
            <!-- <span class="label-text-alt">Top Right label</span> -->
          </label>
          <input required class="input bg-base-300 text-lg" type="password" name="password" id="password"
            placeholder="password here" v-model="password" />
          <label class="label">
            <!-- <span class="label-text-alt">Bottom Left label</span> -->
            <!-- <span class="label-text-alt">Bottom Right label</span> -->
          </label>

          <div class="card-actions justify-center">
            <button class="btn-primary btn h-full px-5 text-lg">Login</button>
          </div>
        </div>
      </form>
      <!-- <div class="divider w-full self-center">OR USE</div>
        <Providers /> -->
      <div class="divider w-full self-center">OR</div>
      <div class="card">
        <div class="card-body">
          <NuxtLink to="/register" class="btn-secondary btn"> Register </NuxtLink>
          <!-- <NuxtLink to="/recover" class="btn-ghost btn underline"> Recover Account </NuxtLink> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { login } from "~/utils/login"
import { DOMAIN } from "~/utils/domain"
definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const username = ref("");
const password = ref("");
const { data, execute } = useAsyncData(() => login(username.value, password.value, DOMAIN),
  {
    immediate: false,
  },
)
</script>
