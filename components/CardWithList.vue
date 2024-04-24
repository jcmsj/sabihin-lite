<template>
    <div class="card card-compact">
        <div class="card-body">
            <div class="card-title">
                <slot name="card-title">
                </slot>
            </div>
            <ul class="list list-disc">
                <li v-for="item in props.items" :key="item">
                    {{ item }}
                </li>
            </ul>
        </div>
        <slot name="actions"></slot>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    items: string[],
}>();
</script>
