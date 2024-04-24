<template>
    <label class="label">
      <span class="label-text text-xl">Username:</span>
      <!-- <span class="label-text-alt">Top Right label</span> -->
    </label>
    <input
      class="input"
      type="username"
      name="username"
      id="username"
      placeholder="username"
      required
      v-model="username"
      @input="onInput"
      :class="{'input-error':isInvalid}"
    />
    <label class="label">
      <span class="label-text-alt text-lg text-info">
        <span v-if="username">
          Others can reach you via:
          <br />
          {{ personalUrl }}
        </span>
        &nbsp;
      </span>
      <span class="label-text-alt"><!-- Bottom Right label --></span>
    </label>
  </template>
  <script setup lang="ts">
  const props = defineProps<{host:string}>()
  const username = defineModel<string>();
  const {url:personalUrl} = useUrlWithId(props.host,'chat', username)
  const {isInvalid, onInput} = useInvalid();
  </script>
