<template>
    <h1 class='ma-4 text-h6'>Environment Compare</h1>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      location="top"
    >
      <span>{{ message }}</span>
    </v-snackbar>
    <v-form :style="{ width: '1200px' }">
        <v-container>
            <v-row class="align-center">
                <v-col cols="12" sm="2">
                    <p>Environment</p>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-combobox v-model="environment" :items="environmentItems" :rules="rules" multiple clearable></v-combobox>
                </v-col>
            </v-row>

            <v-row class="align-center">
                <v-col cols="12" sm="2">
                    <p>TCM Check</p>
                </v-col>
                <v-col cols="12" sm="1">
                    <v-switch v-model="tcmSwitch" color="indigo-darken-3" hide-details inset></v-switch>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-select v-show="tcmSwitch" clearable label="TCM_PAGE" :items="tcmPageList"
                            v-model="tcmPage">
                        </v-select>
                </v-col>
            </v-row>
            <v-row class="align-center">
                <v-col cols="12" sm="2">
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn size="large" block @click="reset">Reset</v-btn>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn color="indigo-darken-3" size="large" block @click="submit">
                        <span v-if="isLoading == true">Loading...</span>
                        <span v-if="isLoading == false">Submit</span>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

    </v-form>
    <v-container>
        <v-table fixed-header height="700px">
            <thead>
                <tr>
                    <th class="text-left">
                        Service
                    </th>
                    <th v-for="env in environment" class="text-left">
                        {{ env }}
                    </th>
                    <th v-show="tcmSwitch" class="text-left">
                        TCM
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr :class="{'error': item.error}" v-for="item in serviceList" :key="item.key">
                    <td>{{ item.service }}</td>
                    <td v-for="env in environment" class="text-left">
                        {{ item[env] }}
                    </td>
                    <td v-show="tcmSwitch">{{ item.TCM }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>
  

<script lang='ts' setup>

import { onMounted } from 'vue'
import { ref } from 'vue'
import { square_base_url } from '@/config-url'

const environment = ref(['QA', 'UAT'])
const environmentItems = ref(['DEV', 'QA', 'UAT'])
const tcmSwitch = ref(false)
const tcmPage = ref('')
const tcmPageList = ref()
const isLoading = ref(false)
const message  = ref('')
const rules = ref([
    (value: any[]) => {
        if (value.length > 0) return true
        return 'Empty Input.'
    },
])
const serviceList = ref()

const snackbar = ref(false)

function reset() {
    environment.value = []
    serviceList.value = []
    tcmSwitch.value = false
    tcmPage.value = ''
}

async function submit() {
    isLoading.value = true
    var envList = environment.value
    var tcm = tcmSwitch.value
    var tcmlink = tcmPage.value
    var body = {
        "environment": envList,
        "tcm": tcm,
        "tcm_page_title": tcmlink
    }
    if (envList.length) {
        const response = await fetch(square_base_url + '/skysquare/qa_tools/environment_compare', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        var res = await response.json();
        isLoading.value = false
        if (res.code == 200) {
            var res_list = res.data
            serviceList.value = res_list
        } else if (res.code == 500) {
            message.value = res.message
            snackbar.value = true
        }
    } else {
        message.value = "Empty Environment !"
        snackbar.value = true
    }
    isLoading.value = false
}

async function getTcmPages() {
    const response = await fetch(square_base_url + '/skysquare/qa_tools/environment_compare/get-tcm-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json()
    tcmPageList.value = res.data.map((item: { [x: string]: any; }) => item['tcm_page_title'])
    console.log(tcmPageList.value)
}

onMounted(async () => { // Use an async function so that you can await the fetch operation   
    await getTcmPages()
})   

</script>

<style scoped>
.error {
    background-color: red;
}
</style>