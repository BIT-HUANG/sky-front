<template>
    <v-snackbar v-model="snackbar" :timeout="2000" location="top">
        <span>{{ barMsg }}</span>
    </v-snackbar>
    <v-navigation-drawer>
        <v-menu location="end">
            <template v-slot:activator="{ props: menu }">
                <v-tooltip location="top">
                    <template v-slot:activator="{ props: tooltip }">
                        <v-btn block color="primary" v-bind="mergeProps(menu, tooltip)">
                            {{ currentFolder }}
                        </v-btn>
                    </template>
                    <span>Current Path: {{ currentFolderPath }}</span>
                </v-tooltip>
            </template>
            <v-card>
                <v-dialog v-model="dialogNewFolder" persistent width="1024">
                    <template v-slot:activator="{ props }">
                        <v-btn block style="height: 48px;" v-bind="props"> NEW FOLDER </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Add New Folder To {{ currentFolderPath }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form :style="{ width: '1377px' }">
                                <v-container>
                                    <v-row class="align-center">
                                        <v-col cols="12" sm="2">
                                            <p>New Folder Name</p>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field v-model="newFolderName" :rules="rules" ariant="solo" clearable
                                                placeholder="Report_yyMMddhhmmss"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="align-center">
                                        <v-col cols="12" sm="4">
                                        </v-col>
                                        <v-col cols="12" sm="2">
                                            <v-btn color="indigo-darken-1" size="large" block
                                                @click="newFolder">Submit</v-btn>
                                        </v-col>
                                        <v-col cols="12" sm="2">
                                            <v-btn size="large" block @click="dialogNewFolder = false">Close</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogUploadFile" persistent width="1024">
                    <template v-slot:activator="{ props }">
                        <v-btn block style="height: 48px;" v-bind="props"> UPLOAD FILE </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Upload File To {{ currentFolderPath }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form :style="{ width: '1377px' }">
                                <v-container>
                                    <v-row class="align-center">
                                        <v-col cols="12" sm="2">
                                            <p>Choose Your File</p>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-file-input v-model="fileToUpload" clearable
                                                label="File input"></v-file-input>
                                        </v-col>
                                    </v-row>
                                    <small>* Zip File Auto Extract to The Path.</small>
                                    <v-row class="align-center">
                                        <v-col cols="12" sm="4">
                                        </v-col>
                                        <v-col cols="12" sm="2">
                                            <v-btn color="indigo-darken-1" size="large" block
                                                @click="uploadFile">Upload</v-btn>
                                        </v-col>
                                        <v-col cols="12" sm="2">
                                            <v-btn size="large" block @click="dialogUploadFile = false">Close</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>

                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-card>

        </v-menu>


        <v-list>
            <v-list-item @click="fetchData(item.file_path)" color="primary" v-for="(item, index) in fileList"
                :key="item.file_name" :value="item.file_path">
                <v-list-item-title class="float-left" style="width: 195px;">{{ item.file_name }}
                    <v-tooltip v-if="item.file_name.length > 20" activator="parent" location="top">{{ item.file_name }}
                    </v-tooltip>
                    <v-tooltip v-if="item.file_name == '<<<'" activator="parent" location="top">Back To Parent Folder
                    </v-tooltip>
                </v-list-item-title>
                <v-menu v-if="item.file_name != '<<<'">
                    <template v-slot:activator="{ props }">
                        <v-icon icon="mdi-dots-vertical" v-bind="props"></v-icon>
                    </template>
                    <v-dialog v-model="dialogDelFile" persistent width="1024">
                        <template v-slot:activator="{ props }">
                            <v-btn block class="text-red" style="height: 48px;" v-bind="props"> DELETE </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Delete {{ item.file_path }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-form :style="{ width: '1377px' }">
                                    <v-container>
                                        <v-row class="align-center">
                                            <v-col cols="12" sm="10">
                                                <p> Comfirm to Delete file or folder permanently, and could not recover!</p>
                                            </v-col>
                                        </v-row>
                                        <v-row class="align-center">
                                            <v-col cols="12" sm="4">
                                            </v-col>
                                            <v-col cols="12" sm="2">
                                                <v-btn color="red-darken-1" size="large" block
                                                    @click="deleteFileOrFolder(item.file_path)">Delete</v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="2">
                                                <v-btn size="large" block @click="dialogDelFile = false">Close</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-menu>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-container>
        <v-img v-show="img_show" :src="iframe_url" :contain="true"></v-img>
    <iframe v-show="iframe_show" :src="iframe_url" frameBorder="0" style="width: 100%; height: 1080px"></iframe>
    </v-container> 
    
</template>

<script lang='ts' setup>
import { mergeProps } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { square_base_url } from '@/config-url'

mergeProps
const fileList = ref()
const currentFolder = ref('')
const currentFolderPath = ref('')
const currentAbsFolderPath = ref('')
const iframe_url = ref('')
const iframe_show = ref(false)
const img_show = ref(false)
const dialogNewFolder = ref(false)
const dialogUploadFile = ref(false)
const dialogDelFile = ref(false)
const snackbar = ref(false)
const barMsg = ref('')
const newFolderName = ref('')
const fileToUpload = ref()

const rules = ref([
    (value: string) => {
        if (value) return true
        return 'You must enter.'
    },
])

async function fetchData(req_url: string) {
    iframe_show.value = false
    img_show.value = false
    var lastIndex = req_url.lastIndexOf('/')
    currentFolder.value = (lastIndex === -1 ? req_url : req_url.slice(lastIndex + 1))
    var formated_url = ''
    if (req_url != '') {
        formated_url = '/' + req_url
    } else {
        currentFolder.value = 'Root'
    }
    currentFolderPath.value = '/Root/' + req_url
    currentAbsFolderPath.value = req_url
    const response = await fetch(square_base_url + '/skysquare/data' + formated_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
    const mime = response.headers.get('content-type')
    let isFile = true;
    if(mime && mime.includes('image')) {
        console.log('img show')
        iframe_show.value = false
        iframe_url.value = square_base_url + '/skysquare/data' + formated_url

        img_show.value = true
        return
    }
    if (mime && mime.includes('application/json') && !formated_url.includes('.')) {
        isFile = false;
    }
    if (!isFile) {
        var res = await response.json();
        fileList.value = res.data
        iframe_show.value = false
        img_show.value = false
        console.log('get path')
    } else {
        console.log('show file')
        img_show.value = false
        iframe_url.value = square_base_url + '/skysquare/data' + formated_url;
        iframe_show.value = true
        
    }
}

async function newFolder() {
    var folder_name = newFolderName.value.trim()
    var body = {
        "file_path": currentAbsFolderPath.value,
        "folder_name": folder_name
    }
    if (folder_name !== '') {
        const response = await fetch(square_base_url + '/skysquare/data-add-folder', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        var res = await response.json();
        barMsg.value = res.message.data
        snackbar.value = true
        fetchData(currentAbsFolderPath.value)
    } else {
        barMsg.value = "Folder Name is Empty !"
        snackbar.value = true
    }
}

async function deleteFileOrFolder(file_path: string) {
    console.log(file_path)
    var body = { "file_path": file_path }
    if (file_path !== '') {
        const response = await fetch(square_base_url + '/skysquare/data-remove', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        var res = await response.json();
        barMsg.value = res.message.data
        snackbar.value = true
        var parent = res.message.parent
        fetchData(parent)
        dialogDelFile.value = false
    } else {
        barMsg.value = "Failed to Delete !"
        snackbar.value = true
    }


}

async function uploadFile() {
    var path_data = { "file_path": currentAbsFolderPath.value }
    let fd = new FormData()
    fd.append("file", fileToUpload.value[0])
    fd.append("data", JSON.stringify(path_data))
    console.log(fd)
    if (fileToUpload) {
        const response = await fetch(square_base_url + '/skysquare/data-upload', {
            method: 'POST',
            body: fd
        })
        var res = await response.json();
        barMsg.value = res.message
        snackbar.value = true

        fetchData(currentAbsFolderPath.value)
    } else {
        barMsg.value = "Folder Name is Empty !"
        snackbar.value = true
    }
}

onMounted(async () => { // Use an async function so that you can await the fetch operation   
    await fetchData('')
})   
</script>