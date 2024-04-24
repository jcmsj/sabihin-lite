<template>
    <span class="label-text-alt text-base text-info">
        <span v-if="tooShort">
            Add
            <strong>
                {{ needed }}
            </strong>
            more character/s
        </span>
        &nbsp;
    </span>
</template>
<script setup lang="ts">
/** 
 * Represents the top-right label in 
 * @see https://daisyui.com/components/input/#with-form-control-and-labels 
 * 
*/

const props = defineProps<{
    needed: number,
}>();
const tooShort = computed(() => props.needed > 0);
</script>
