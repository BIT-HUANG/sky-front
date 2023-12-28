<template>
    <v-snackbar v-model="snackbar" :timeout="2000" location="top">
        <span>{{ barMsg }}</span>
    </v-snackbar>

    <v-navigation-drawer>
        <v-btn block color="primary" @click="getJobList()">
            Job List
        </v-btn>
        <v-list>
            <v-list-item color="primary" v-for="(jobName, index) in jobList" :key="jobName" :value="index"
                @click="getBuildList(jobName)">
                <v-list-item-title>{{ jobName }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer>
        <v-menu v-model="menu" :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
                <v-btn block color="primary" v-bind="props" @click="getJobParas(currentJob)">
                    Build List
                </v-btn>
            </template>
            <v-card min-width="300">
                <v-card-title>Build With Parameter</v-card-title>
                <v-list>
                    <v-list-item v-for="(parameter) in parameterList" :key="parameter">
                        <v-select clearable :label="parameter.parameter_key" :items="parameter.parameter_value"
                            v-model="buildPara[parameter.parameter_key]">
                        </v-select>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn variant="text" @click="menu = false, getBuildList(currentJob)"> fresh </v-btn>
                    <v-btn color="primary" variant="text" @click="menu = false, startBuild()">
                        Build
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>

        <v-list>
            <v-list-item color="primary" v-for="(build, index) in buildList" :key="build" :value="index"
                @click="build.artifacts && showReport(build)">
                <v-tooltip v-if="build.duration" activator="parent" location="top"> Process time: {{
                    MillisecondsToTime(build.duration) }}
                </v-tooltip>
                <v-list-item-title> Build #{{ build.build }}
                    <v-icon v-if="build.progress" color="info" icon="mdi-clock-time-five" size="small"></v-icon>
                    <v-icon v-if="build.result == 'UNSTABLE'" color="warning" icon="mdi-information" size="small"></v-icon>
                    <v-icon v-if="build.result == 'SUCCESS'" color="success" icon="mdi-check-circle" size="small"></v-icon>
                    <v-icon v-if="build.artifacts" color="info" icon="mdi-file-chart" size="small"></v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-container>
        <iframe v-if="iframe_show" :src="iframe_url" frameBorder="0" style="width: 100%; height: 1150px"></iframe>
    </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { square_base_url } from '@/config-url'

const snackbar = ref(false)
const barMsg = ref('')
const menu = ref(false)
const buildPara = ref<any>({})
const startBuildID = ref()
const jobList = ref()
const currentJob = ref('')
const buildList = ref()
const iframe_url = ref('')
const iframe_show = ref(false)
const parameterList = ref()

async function getJobList() {
    const response = await fetch(square_base_url + '/skysquare/get-jenkins-jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json()
    jobList.value = res.data
}

async function getBuildList(job_name: string) {
    var body = { "job_name": job_name }
    currentJob.value = job_name
    const response = await fetch(square_base_url + '/skysquare/get-jenkins-job-builds', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json()
    buildList.value = res.data
}

async function showReport(build_info: any) {
    iframe_show.value = false
    snackbar.value = true
    barMsg.value = 'Loading Report ...'
    var body = { "job_name": build_info.job, "build_id": build_info.build }
    const response = await fetch(square_base_url + '/skysquare/download-jenkins-report', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    if (response.ok) {
        iframe_url.value = square_base_url + '/skysquare/data/Test_Report/JenkinsTemp/allure-report/index.html'
        iframe_show.value = true
    }

}

async function getJobParas(job_name: string) {
    var body = { "job_name": job_name }
    const response = await fetch(square_base_url + '/skysquare/get-jenkins-job-parameter-list', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json()
    parameterList.value = res.data

}


async function startBuild() {
    var body = { "job_name": currentJob.value, "parameter": buildPara.value }
    console.log(body)
    const response = await fetch(square_base_url + '/skysquare/build-jenkins-job-with-parameter', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    var res = await response.json()
    startBuildID.value = res.data
}

function MillisecondsToTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const millisecondsRemaining = milliseconds % 1000;
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}.${millisecondsRemaining.toString().padStart(3, '0')}`;

}




onMounted(async () => { // Use an async function so that you can await the fetch operation   
    await getJobList()
})   
</script>