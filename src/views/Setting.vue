<template>
    <v-container>
        <loading :active.sync="isLoading" color="red"></loading>
        <br />
        <v-card>
            <v-card-title>
                <v-container>
                    <v-icon>mdi-settings</v-icon>設定
                </v-container>
            </v-card-title>
        </v-card>
        <br />
        <v-card>
            <v-container class="cin-container">
                <v-text-field v-model="masterData.hotel_name" label="HOTEL NAME" color="red"></v-text-field>
                <v-text-field
                    v-model="masterData.temairazu_url"
                    label="TEMAIRAZU URL"
                    color="red"
                    placeholder="https://sv30.temairazu.net"
                ></v-text-field>
                <v-text-field
                    v-model="masterData.temairazu_username"
                    label="TEMAIRAZU USER ID"
                    color="red"
                ></v-text-field>
                <v-text-field
                    v-model="masterData.temairazu_password"
                    label="TEMAIRAZU USER PASSWORD"
                    color="red"
                ></v-text-field>
                <br />
                <div class="text-center">
                    <v-btn class="mx-2" dark large @click="update">更新</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {
    fetchMasterData,
    updateMasterData,
    IMasterData
} from "@/services/masterDataService";
// Import component
const Loading = require("vue-loading-overlay");
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
@Component({
    components: {
        Loading
    }
})
export default class Setting extends Vue {
    public isLoading: boolean = false;
    public masterData: IMasterData = fetchMasterData();
    public async update() {
        this.isLoading = true;
        updateMasterData(this.masterData);
        await this.sleep(500);
        this.isLoading = false;
    }
    public sleep(milliSeconds: number) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, milliSeconds);
        });
    }
}
</script>
<style scoped>
.cin-container {
    padding: 100px;
}
</style>
