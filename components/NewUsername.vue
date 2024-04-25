<template>
    <label class="label">
      <span class="label-text text-xl">Username:</span>
      <span class="label-text-alt">
        <slot name="top-right-label"></slot>
      </span>
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
      :class="{...{'input-error':isInvalid},...inputClass}"
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
      <span class="label-text-alt">
        <slot name="bottom-right-label"></slot>
      </span>
    </label>
  </template>
  <script setup lang="ts">
  const props = withDefaults(defineProps<{host:string, inputClass?:Record<string,boolean>}>(), {
    inputClass: {} as Record<string,boolean>
  })
  const username = defineModel<string>();
  const {url:personalUrl} = useUrlWithId(props.host,'chat', username)
  const {isInvalid, onInput} = useInvalid();
  </script>
