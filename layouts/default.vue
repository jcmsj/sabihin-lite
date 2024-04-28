<template>
    <!-- https://daisyui.com/components/navbar/#navbar-with-search-input-and-dropdown -->
    <div class="navbar bg-base-100">
        <div class="flex-1 gap-x-4">
            <NuxtLink to="/about" active-class="btn-primary" class="btn text-xl">Sabihin.lite</NuxtLink>
            <NuxtLink to="/" active-class="btn-primary" class="btn" >
                Inbox
                <Icon name="mi:inbox" />
            </NuxtLink>
            <NuxtLink to="/chat" active-class="btn-primary" class="btn">
                Chat
                <Icon name="mi:message" />
            </NuxtLink>
        </div>
        <div class="flex-none gap-2">
            <label class="swap swap-rotate">
                <!-- https://daisyui.com/components/theme-controller/#theme-controller-using-a-swap -->
                <!-- this hidden checkbox controls the state -->
                <input type="checkbox" class="theme-controller" value="light" />
                <Icon class="swap-off w-10 h-10" name="mi:sun" />
                <Icon class="swap-on w-10 h-10" name="mi:moon" />
            </label>
            <div class="dropdown dropdown-end" :class="{ 'hidden': !hasSession }">
                <!-- https://daisyui.com/components/avatar/#avatar-placeholder -->
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-24">
                        <span class="text-3xl">{{ userInitialLetters }}</span>
                    </div>
                </div>
                <ul tabindex="0"
                    class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li>
                        <a class="justify-between">
                            Profile
                        </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><button @click="logout({ callbackUrl: '/login' })">Logout</button></li>
                </ul>
            </div>
        </div>
    </div>
    <slot></slot>
</template>
<script setup lang="ts">
const { data } = useAuth();
const hasSession = computed(() => !!data.value?.user);
const userInitialLetters = computed(() => {
    const name = data.value?.user?.name;
    if (name) {
        return name[0] + name[1]
    };

    return ''
});
</script>
