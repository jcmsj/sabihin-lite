<template>
    <div class="flex flex-col items-center">
        <h1>Inbox</h1>
        <div class="divider w-1/2 self-center"></div>
        <div class="card border-primary card-bordered w-96 bg-base-100 shadow-xl" v-for="msg in decryptedMessages">
            <div class="card-body">
                <p >Message:</p>
                <p class="text-lg">{{ msg.message }}</p>
                <div>
                    Sent: <br>
                    {{ msg.createdAt }}
                </div>
                <details class="collapse bg-base-200">
                    <summary class="collapse-title font-medium">
                        View ciphertext
                    </summary>
                    <div class="collapse-content">
                        <p class="text-sm text-wrap break-words">
                            {{ msg.encrypted }}
                        </p>
                    </div>
                </details>
            </div>
        </div>
        <button class="btn" @click="execute()">Refresh</button>
    </div>
</template>
<script setup lang="ts">
import { computedAsync } from '@vueuse/core';
import { decodeBase64 } from 'hash-wasm/lib/util';
import { decrypt } from '~/utils/cryptography/keypair';
import { importKey } from '~/utils/cryptography/masterkey';

const headers = useRequestHeaders(['cookie']) as HeadersInit
const page = ref(0);
const pageSize = ref(5);
const { data: encryptedMessages, execute } = useAsyncData(async () =>
    $fetch(`/api/user/inbox`, {
        headers,
        query: {
            page: page.value,
            pageSize: pageSize.value,
        },
    })
    , {
        watch: [page, pageSize],
    })

const masterKey = computedAsync(async () => {
    const raw = localStorage.getItem('masterKey');
    if (raw !== null) {
        return await importKey(raw);
    }
})
const { data: encryptedPrivateKey } = useFetch("/api/user/privatekey", {
    headers,
})

const { data: privateKey } = useAsyncData(async () => {
    const base64 = decodeBase64(encryptedPrivateKey.value?.privateKey!)
    return await masterKey.value?.unwrapKey("jwk", base64);
}, {
    watch: [masterKey, encryptedPrivateKey],
})

const { data: decryptedMessages } = useAsyncData(async () => {
    const pk = privateKey.value;
    if (pk == null || encryptedMessages.value == null) {
        return [];
    }
    return await Promise.all(encryptedMessages.value.map(async ({ message, createdAt, ...rest }) => ({
        message: await decrypt(pk, decodeBase64(message)),
        encrypted: message.replaceAll("/", ''),
        createdAt: new Date(createdAt).toLocaleString(),
        ...rest,
    })))
}, {
    watch: [privateKey, encryptedMessages],
})
</script>
