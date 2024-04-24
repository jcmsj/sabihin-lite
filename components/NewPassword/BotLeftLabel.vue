<template>
    <span class="capitalize" :class="`text-${rating.color}`">
        Strength:
        <strong>
            {{ rating.category }}
        </strong>
    </span>
</template>
<script setup lang="ts">
import { type Rating } from '~/composables/useZXCVBN';

/** 
 * Represents the bot-left label in 
 * @see https://daisyui.com/components/input/#with-form-control-and-labels 
 * 
*/

defineProps<{
    rating:Rating
}>();
</script>
