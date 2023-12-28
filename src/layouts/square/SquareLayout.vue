<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="SKYCORE QA Management Square">
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props"> QA Tools </v-btn>
        </template>
        <v-list>
          <v-list-item @click="currentMenu = menu.children ?? []" v-for="(menu, index) in qaToolMenu" :key="index"
            :value="index">
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item @click='changePage(menu.url)' color="primary" rounded="shaped" v-for="(menu, index) in currentMenu"
          :key="index" :value="index">
          <v-list-item-title>{{ menu.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="" style="min-height: 300px;">
      <RouterView></RouterView>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const qaToolMenu = ref([
  {
    title: 'Deployment Check',
    children: [
      {
        title: 'QA Service Check',
        url: '/square/qa-tools/deployment-check/qa-service-check'
      },
      {
        title: 'UAT service Check',
        url: '/square/qa-tools/deployment-check/uat-service-check'
      },
      {
        title: 'Environment Compare',
        url: '/square/qa-tools/deployment-check/environment-compare'
      },
      {
        title: 'JIRA TEST',
        url: '/square/qa-tools/deployment-check/test'
      },
    ]
  },
  {
    title: 'Jira Tools',
    children: [
      {
        title: 'Query Issue',
        url: '/square/coming-soon'
      },
      {
        title: 'Relase Content',
        url: '/square/coming-soon'
      },
    ]
  },
  { title: 'Jenkins Tools' },
  { title: 'Confluence Tools' },
  {
    title: 'QA Reports',
    children: [
      {
        title: 'QA REPORT',
        url: '/square/qa-tools/qa-reports/automation-report'
      },
      {
        title: 'QA REPORT NEW',
        url: '/square/qa-tools/qa-reports/automation-report-new'
      },
      {
        title: 'JENKINS REPORT UI',
        url: '/square/qa-tools/qa-reports/jenkins-report-ui'
      }
    ]
  },
  { title: 'QA Settings' },
])

const currentMenu = ref(qaToolMenu.value[0].children)
const router = useRouter()

function changePage(url: string) {
  router.push(
    {
      path: url,
    }
  )
}
</script>