<template>
    <v-container>
        <br />
        <v-card>
            <v-card-title>
                <v-btn class="mx-2" fab dark color="red" @click="fetch">
                    <v-icon>mdi-sync</v-icon>
                </v-btn>
                <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="4">
                        <v-select
                            v-model="date"
                            :items="dates"
                            menu-props="auto"
                            hide-details
                            label="Select"
                        ></v-select>
                    </v-col>'s GUESTS
                </v-row>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
        </v-card>
        <br />
        <v-card class="table-card">
            <loading :active.sync="isLoading" color="red"></loading>
            <v-container>
                <div v-if="data.length < 2">
                    <div class="text-center">
                        <br />PLEASE FETCH DATA
                        <br />
                        <br />
                    </div>
                </div>
                <div v-else>
                    <v-data-table
                        height="70%"
                        dense
                        :headers="getHeader"
                        :items="getData"
                        :items-per-page="20"
                        :search="search"
                    ></v-data-table>
                </div>
            </v-container>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { fetchCsvService, deleteFile } from "@/services/fetchCsvService";
import { parseCsvService } from "@/services/parseCsvService";
import {
    fetchMasterData,
    updateMasterData
} from "@/services/masterDataService";
import dayjs from "dayjs";
// component
// Import component
const Loading = require("vue-loading-overlay");
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";

@Component({
    components: {
        Loading
    }
})
export default class Home extends Vue {
    public search: string = "";
    public data: string[][] = [];
    public isLoading: boolean = false;
    public isExist: boolean = true;
    public get getData() {
        return this.data.slice(1).map(items => {
            const retval: { [key: string]: string } = {};
            items.forEach((item, idx) => {
                retval[idx.toString()] = item;
            });
            return retval;
        });
    }
    public get getHeader() {
        return this.data[0].map((item, idx) => {
            return {
                text: item,
                value: idx.toString(),
                sortable: true,
                divider: item === "予約番号",
                width: "200px"
            };
        });
    }
    public async fetch() {
        this.isLoading = true;
        const master = fetchMasterData();
        if (this.isExist) {
            deleteFile(master.lastfilename);
            this.isExist = false;
        }
        const path = await fetchCsvService(
            master.temairazu_url,
            master.temairazu_username,
            master.temairazu_password,
            this.date
        );
        parseCsvService(path, this.cb);
        updateMasterData({
            ...master,
            lastfilename: path
        });
        this.isExist = true;
        this.isLoading = false;
    }
    public cb(input: string[][]) {
        this.data = input;
    }
    public created() {
        const master = fetchMasterData();
        if (master.lastfilename) {
            try {
                parseCsvService(master.lastfilename, this.cb);
            } catch (err) {
                this.isExist = false;
            }
        }
    }
    public date = dayjs(new Date()).format("YYYY-MM-DD");
    public dates = [
        {
            text: `TOMORROW（${dayjs(new Date())
                .add(1, "day")
                .format("YYYY/MM/DD")}）`,
            value: dayjs(new Date())
                .add(1, "day")
                .format("YYYY-MM-DD")
        },
        {
            text: `TODAY（${dayjs(new Date()).format("YYYY/MM/DD")}）`,
            value: dayjs(new Date()).format("YYYY-MM-DD")
        },
        {
            text: `YESTERDAY（${dayjs(new Date())
                .subtract(1, "day")
                .format("YYYY/MM/DD")}）`,
            value: dayjs(new Date())
                .subtract(1, "day")
                .format("YYYY-MM-DD")
        }
    ];
}
</script>
<style scoped>
.table-header {
    min-width: 200px;
}
.table-card {
    height: "70vh";
    overflow: auto;
}
</style>
