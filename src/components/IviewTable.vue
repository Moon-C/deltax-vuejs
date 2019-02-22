<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-6">
                <p>Selected Models</p>
                <draggable class="list-group grey-wrapper" 
                v-model="selectedModels"
                :options="{ group: 'models' }"
                @change="refreshTable()">
                    <div v-for="model in selectedModels" 
                    class="list-group-item"
                    :key="model.key">{{ model.name }}</div>
                </draggable>
            </div>
            <div class="col-sm-6">
                <p>Available Models</p>
                <draggable class="list-group grey-wrapper" 
                v-model="availableModels"
                :options="{ group: 'models' }">
                    <div v-for="model in availableModels"
                    class="list-group-item"
                    :key="model.key">{{ model.name }}</div>
                </draggable>
            </div>
        </div>
        <div class="grey-wrapper">
            <Table :columns="iColumns" :data="iData"
            stripe border :loading="loading" ></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                    :total="totalData" 
                    :current="1" 
                    @on-change="generateData($event)"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Draggable from 'vuedraggable'
import axios from 'axios'

export const modelTypes = [
    { key: 'ft', name: 'First Touch' },
    { key: 'lt', name: 'Last Touch' },
    { key: 'us', name: 'U-shaped' }
];

export const modelNameMap = {
    'ft-conversion': 'Conversion',
    'ft-revenue': 'Revenue',
    'lt-conversion': 'Conversion',
    'lt-revenue': 'Revenue',
    'us-conversion': 'Conversion',
    'us-revenue': 'Revenue'
};

export default {
    data() {
        return {
            availableModels: modelTypes,
            selectedModels: [],
            iColumns: [],
            iData: [],
            totalData: 0,
            loading: true
        }
    },
    methods: {
        initializeSelectedModels() {
            // First Touch (index 0) as default model selection on load
            // Currently this causes issues on route change
            this.selectedModels.push(this.availableModels[0])
            this.availableModels.splice(0, 1);
        },
        generateHeaders() {

            // Generate column heads based on models selected
            this.iColumns = [];

            let channelGroups = {
                title: 'Engine',
                key: 'engine',
                align: 'center',
            };
            this.iColumns.push(channelGroups);

            this.selectedModels.forEach(model => {

                let childrenKeys = Object.keys(modelNameMap).filter(key => key.startsWith(model.key))
                /* 
                    Should filter keys associated with selected model
                    Ex.: If First Touch (ft) is selected model,
                    childrenKeys should contain [ft-conversion, ft-revenue, ...]
                */

               let childrenObjects = [];
               childrenKeys.forEach(key => {
                   let child = {};
                   child['title'] = modelNameMap[key];
                   child['key'] = key;
                   child['align'] = 'center';
                   child['sortable'] = true;
                   childrenObjects.push(child);
               });

                let column = {
                    title: model.name,
                    align: 'center',
                    children: childrenObjects
                }
                this.iColumns.push(column);
            });
            
            // To be reworked for client side computation
            let percentChange = {
                title: '% change in conversions',
                align: 'center',
                children: [
                    {
                        title: 'First Interaction',
                        key: 'percentChange',
                        align: 'center',
                        sortable: true
                    }
                ]
            };
            this.iColumns.push(percentChange);

        },
        generateData(page) {
            
            this.loading = true;
            axios.get('/data')
            .then(res => {

                const data = Object.values(res.data);

                this.totalData = data.length;

                let iData = []
                for(let i = (page-1)*10; i < page*10 && i < data.length; i++) {
                    iData.push(data[i]);
                    iData[iData.length-1]['key'] = i;
                }
                this.iData = iData;
                this.loading = false;
            });

        },
        refreshTable() {
            this.generateHeaders();
            this.generateData(1);
        }
    },
    components: {
        draggable: Draggable
    },
    mounted () 
    {
        this.initializeSelectedModels();
        this.refreshTable();
    }
}
</script>

<style scoped>

.grey-wrapper {
    margin: 10px;
    padding: 10px;
    border: 1px solid #CCC;
    border-radius: 5px;
}

</style>

