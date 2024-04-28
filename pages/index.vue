<template>
    <div class="flex flex-col items-center gap-y-4">
        <h1>Inbox</h1>
        <div class="divider w-1/2 self-center"></div>
        <div class="loading loading-lg text-primary" :class="{'hidden':!pendingMessages}"></div>
        <div class="card border-primary card-bordered w-96 bg-base-100 shadow-xl" v-for="msg in decryptedMessages">
            <div class="card-body">
                <p>Message:</p>
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
        <div class="join flex justify-center">
            <button class="btn join-item " @click="page = Math.max(0, page - 1)" :class="{'btn-disabled': disablePrev}">
                <Icon name="mi:previous" />
                Previous
            </button>
            <button class="btn" :class="{'btn-disabled':pendingMessages}" @click="onRefreshClick()">
                Refresh
                <Icon name="mi:refresh" />
            </button>
            <button class="btn join-item" @click="page++" :class="{'btn-disabled':disableNext}">
                Next
                <Icon name="mi:next" />
            </button>
        </div>
        <div>
            Page: {{ displayedPage }} / {{ displayedMaxPage }}
        </div>
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
const displayedPage = computed(() => page.value + 1);
const { data: encryptedMessages, execute: fetchMessages,pending:pendingMessages } = useAsyncData(async () =>
    $fetch(`/api/inbox`, {
        headers,
        query: {
            page: page.value,
            pageSize: pageSize.value,
        },
    })
    , {
        watch: [page, pageSize],
    })

const {data:totalMessages,execute:fetchTotalMessages} = useAsyncData(async () => {
    return await $fetch(`/api/inbox/count`, {
        headers,
    })
})

async function onRefreshClick() {
    await fetchTotalMessages();
    await fetchMessages();
}
const maxPage = computed(() => Math.max(0, Math.ceil(totalMessages.value?.count ?? 0 / pageSize.value) - 1))
const displayedMaxPage = computed(() => maxPage.value + 1)
const disableNext = computed(() => page.value >= maxPage.value)
const disablePrev = computed(() => page.value <= 0)
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
