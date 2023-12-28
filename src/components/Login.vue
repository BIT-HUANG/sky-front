<template>
  <div class="d-flex align-center flex-column mt-16">
    <v-card class="pa-6" width="600" title="Welcome To SQMS !" text="SKYCORE QA Management Square">
      <v-sheet width="300" class="mx-auto">
        <v-form @submit.prevent>
          <v-text-field v-model="username" :rules="rules" label="username"></v-text-field>
          <v-text-field v-model="password" :rules="rules" label="password"></v-text-field>
          <v-btn type="submit" size="large" block class="mt-4" @click="login">Login</v-btn>
        </v-form>
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('')
const password = ref('')
const rules = ref([
  (value: string) => {
    if (value) return true
    return 'You must enter.'
  },
])

const router = useRouter()
const login = ref([
  () => {
    if (username.value !== '' && password.value !== '') {
      router.push(
        {
          path: '/square/home',
        }
      )
    } else {
      console.log("no user info.")
    }

  }
]
)
</script>
