<template>
    <div>
        <div class="hero min-h-screen bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Sabihin.lite</h1>
                    <p class="py-6">Send end-to-end encrypted messages</p>
                    <NuxtLink to="/register" class="btn btn-primary">Get Started</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    auth: false
})
</script>
