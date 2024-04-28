<template>
<div>
    <div>Sabihin.lite</div>
    <NuxtLink to="/inbox">Inbox</NuxtLink>
    <button class="btn btn-primary" @click="signOut({callbackUrl:'/login'})">Sign out</button>
    <div>Welcome back {{ data?.user?.name }}</div>
    {{data}}
    <slot></slot>
</div>
</template>
<script setup lang="ts">
const {data,signOut} = useAuth();

// const session = getSession();
</script>
