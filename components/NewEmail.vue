<template>
    <!-- EMAIL -->
    <label class="label">
        <span class="label-text text-xl">Email:</span>
        <!-- <span class="label-text-alt">Top Right label</span> -->
    </label>
    <input class="input" :class="{'input-error': isInvalid}" type="email" name="email" id="email" placeholder="user@domain" required v-model="email" @input="onInput"/>
    <!-- <label class="label">
        <span class="label-text-alt">Bottom left label</span>
        <span class="label-text-alt">Bottom Right label</span>
    </label> -->
</template>
<script setup lang="ts">
import useInvalid from '~/composables/useInvalid';

const email = defineModel<string>();
const {isInvalid, onInput} = useInvalid();
</script>
