<template>
    <h1 class='ma-4 text-h6'>SkyCore AI</h1>
    <v-container style="flex: 1; overflow: auto;">
        <v-list lines="two">
            <v-list-item color="primary" v-for="(history, index) in chatHistory" :key="history" :value="index">
                <v-list-item-title>
                    {{ history.role }}
                </v-list-item-title>
                <div v-html="history.content"></div>
            </v-list-item>
        </v-list>
    </v-container>
    <v-container>
        <v-textarea class="float-bottom" label="input" v-model="userMSG"></v-textarea>
        <v-row class="align-center">
            <v-col cols="12" sm="8">
            </v-col>
            <v-col cols="12" sm="2">
                <v-btn class="float-right" size="large" block @click="cleanHistory">
                    <span>Clean</span>
                </v-btn>
            </v-col>
            <v-col cols="12" sm="2">
                <v-btn class="float-right" color="indigo-darken-3" size="large" block @click="sendMsg">
                    <span v-if="isLoading == true">Loading...</span>
                    <span v-if="isLoading == false">Send</span>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { square_base_url } from '@/config-url'
const isLoading = ref(false)
const chatHistory = ref()
const userMSG = ref('')
async function sendMsg() {
    isLoading.value = true
    var body = {
        "user_msg": userMSG.value
    }
    const response = await fetch(square_base_url + '/skysquare/wenxin-chat', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json();
    chatHistory.value = res.data
    isLoading.value = false
    userMSG.value = ''
}

async function cleanHistory() {
    isLoading.value = true

    const response = await fetch(square_base_url + '/skysquare/wenxin-chat-clean', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json();
    chatHistory.value = res.data
    isLoading.value = false
    userMSG.value = ''
}
</script>