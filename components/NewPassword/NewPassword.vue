<template>
    <label class="label">
        <span class="label-text text-xl">Enter a <strong>strong</strong> password:</span>
        <span class="label-text text-xl">
            <!-- Empty for now -->
        </span>
    </label>
    <input class="input" :class="{'input-error':isInvalid}" type="password" name="password" id="password" placeholder="password here"
        :minlength="MIN_PASSWORD_LENGTH" v-model="password" required  @input="onInput"/>
    <label class="label">
        <NewPasswordBotLeftLabel :rating="result" />
        <NewPasswordBotRightLabel :needed="needed" />
    </label>
    <NewPasswordStrengthChecker :result="result" />
</template>
<script setup lang="ts">
/** 
 * Combines the Top & Bot labels with the input field based on
 * @see https://daisyui.com/components/input/#with-form-control-and-labels 
 * 
*/

const MIN_PASSWORD_LENGTH = 8;

const password = defineModel<string>({
    default:""
});
const result = useZXCVBN(password);
provide("result", result);
const needed = computed(() => Math.max(MIN_PASSWORD_LENGTH - password.value.length, 0));

const {isInvalid, onInput} = useInvalid();
</script>
