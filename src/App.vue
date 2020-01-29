<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app clipped>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">L&G Applications</v-list-item-title>
                    <v-list-item-subtitle>auto cin tool</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item link @click="goHome">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>HOME</v-list-item-content>
                </v-list-item>
                <v-list-item link @click="goSettings">
                    <v-list-item-icon>
                        <v-icon>mdi-settings</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>SETTINGS</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app clipped-left dense>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title class="mr-12 align-center">
                <span class="title">{{ master.hotel_name || 'L&G CHECK IN TOOL' }}</span>
            </v-toolbar-title>
        </v-app-bar>
        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
    fetchMasterData,
    updateMasterData,
    IMasterData
} from "@/services/masterDataService";
@Component({})
export default class App extends Vue {
    public master: IMasterData = fetchMasterData();
    public drawer: boolean = true;
    public goHome() {
        this.$router.push({ name: "home" });
    }
    public goSettings() {
        this.$router.push({ name: "setting" });
    }
}
</script>
