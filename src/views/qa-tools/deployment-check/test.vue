<template>
    <h1 class='ma-4 text-h6'>Test Query Jira Issue</h1>
    <v-form :style="{ width: '1200px' }">
        <v-container>
            <v-row class="align-center">
                <v-col cols="12" sm="2">
                    <p>Project Name</p>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field v-model="projectName" :rules="rules" ariant="solo" clearable
                        placeholder="PDM"></v-text-field>
                </v-col>
            </v-row>

            <v-row class="align-center">
                <v-col cols="12" sm="2">
                    <p>Affect Version</p>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field v-model="affectVersion" :rules="rules" ariant="solo" clearable
                        placeholder="1.2.9"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="align-center">
                <v-col cols="12" sm="2">
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn size="large" block @click="clear">Clear</v-btn>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn color="indigo-darken-1" size="large" block  @click="submit">Submit</v-btn>
                </v-col>
            </v-row>
        </v-container>

    </v-form>
    <v-container>
        <v-table fixed-header height="600px">
            <thead >
                <tr>
                    <th class="text-left">
                        Key
                    </th>
                    <th class="text-left">
                        Status
                    </th>
                    <th class="text-left">
                        Type
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in issueList" :key="item.key">
                    <td>{{ item.key }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.type }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>
  

<script lang='ts' setup>

import { ref } from 'vue'
import {square_base_url} from '@/config-url'
const projectName = ref('')
const affectVersion = ref('')
const rules = ref([
    (value: string) => {
        if (value) return true
        return 'You must enter.'
    },
])
const issueList = ref()


function clear() {
    affectVersion.value = ''
    projectName.value = ''
    issueList.value = []
}

async function submit() {
    var project = projectName.value.trim()
    var version = affectVersion.value.trim()
    var body = { "affect_version": project + version }
    if (version !== '' && project !== '') {
        const response = await fetch(square_base_url + '/skysquare/jira_test', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        var res = await response.json();
        var res_list = res.data
        issueList.value = res_list
        return res_list
    } else {
        console.log("Empty version.")
    }
}

</script>