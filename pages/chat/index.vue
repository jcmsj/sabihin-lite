<template>
    <div class="p-2 flex flex-col items-center">
        <form class="form-control gap-y-4" @submit.prevent="send()">
            <label class="input input-bordered flex items-center gap-2">
                <input type="text" name="recipient" id="recipient" class="grow p-2" required minlength="1"
                    placeholder="Username" v-model="recipient" />
            </label>
            <textarea name="message" id="message" cols="50" rows="10" class="textarea textarea-bordered" required
                v-model="message"></textarea>
            <button type="submit" class="btn btn-primary" :class="{ 'hidden': showSent }">
                Send
                <Icon name="mdi:send" class="w-6 h-6 text-primary-content" />
            </button>
            <button class="btn btn-success" :class="{ 'hidden': !showSent }">
                Sent
                <Icon name="mdi:check" />
            </button>
        </form>
    </div>
</template>
<script setup lang="ts">
import { encodeBase64 } from 'hash-wasm/lib/util';
import { PublicKey, encrypt } from '~/utils/cryptography/keypair';

const recipient = ref()
const message = ref()
definePageMeta({
    auth: false,
})

const publicKeyCache = ref<Record<string, CryptoKey>>({})

async function fetchPublicKey(username: string) {
    if (publicKeyCache.value[username]) {
        return publicKeyCache.value[username]
    }

    const response = await $fetch(`/api/user/${username}/publickey`)
    const pk = await PublicKey.deserialize(response.publicKey)
    publicKeyCache.value[username] = pk
    return pk
}

async function postMessage(recipient: string, message: string) {
    const response = await $fetch(`/api/user/${recipient}/message`, {
        method: "POST",
        body: {
            message,
        },
    })
    return response
}
async function onSubmit(recipient: string, message: string) {
    const publicKey = await fetchPublicKey(recipient)
    const encryptedMessage = encodeBase64(new Uint8Array(await encrypt(publicKey, message)))

    // send
    const response = await postMessage(recipient, encryptedMessage)
    return response
}
const { data, execute: send, pending, status } = useAsyncData(async () => {
    return await onSubmit(recipient.value, message.value)
}, {
    immediate: false,
})

const isSuccess = computed(() => status.value == 'success')
const showSent = ref(false)

const { start: startShowSentTimer } = useTimeout(5000 /**5000ms == 5s */, {
    callback() {
        showSent.value = false
    },
    controls: true,
    immediate: false,
})

watch(() => isSuccess.value, (value) => {
    if (value) {
        showSent.value = true
        startShowSentTimer()
        recipient.value = ''
        message.value = ''
    }
})
</script>
