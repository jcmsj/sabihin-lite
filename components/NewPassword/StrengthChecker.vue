<template>
    <div>
        <progress class="progress" :class="result.color" :value="result.score"
            :max="MAX_SCORE"></progress>
        <CardWithList class="text-warning" v-if="result.feedback.warning" :items="[result.feedback.warning]">
            <template v-slot:card-title>
                Warnings:
            </template>
        </CardWithList>
        <CardWithList v-if="result.feedback.suggestions.length" :items="result.feedback.suggestions">
            <template v-slot:card-title>
                Tips:
            </template>
        </CardWithList>
    </div>
</template>
<script setup lang="ts">
import { type SabihinResult, MAX_SCORE } from '~/composables/useZXCVBN';

defineProps<{
    result: SabihinResult,
}>();
</script>
