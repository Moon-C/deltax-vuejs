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
            <Table
            :columns="iColumns" :data="iData"
            stripe border 
            :loading="loading" />
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
    { key: 'ft', name: 'First Interaction' },
    { key: 'lt', name: 'Last Interaction' },
    { key: 'us', name: 'U-shaped' }
];

export const modelChildrenGeneral = {
    'conversion': 'Conversion',
    'revenue': 'Revenue'
};

export const modelChildren = {
    'ft': {
       'ft-conversion': 'Conversion',
       'ft-revenue': 'Revenue'
    },
    'lt': {
       'lt-conversion': 'Conversion',
       'lt-revenue': 'Revenue'
    },
    'us': {
       'us-conversion': 'Conversion',
       'us-revenue': 'Revenue'
    }
}

export default {
    data() {
        return {
            availableModels: modelTypes,
            selectedModels: [],
            iColumns: [],
            iData: [],
            totalData: 0,
            loading: true,
            compareMethod: 'conversion'
        }
    },
    components: {
        draggable: Draggable
    },
    methods: {
        initializeSelectedModels() {
            // First Interaction (index 0) as default model selection on load
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

                let childrenKeys = Object.keys(modelChildren[model.key]);
                /* 
                    Should return keys associated with selected model
                    Ex.: If First Interaction (ft) is selected model,
                    childrenKeys should contain [ft-conversion, ft-revenue, ...]
                */

               let childrenObjects = [];
               childrenKeys.forEach(childKey => {
                   let child = {};
                   child['title'] = modelChildren[model.key][childKey];
                   child['key'] = childKey;
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
            
            if(this.selectedModels.length > 1) {
                let percentChange = {
                    renderHeader: () => {
                        return (
                            /*
                                JSX syntax for rendering % change header
                                Requires Babel 6 and Vue 2+
                                https://github.com/vuejs/babel-plugin-transform-vue-jsx
                            */
                            <div class="my-2">
                                <Dropdown 
                                trigger="click"
                                onon-click={
                                    (event) => {
                                        this.compareMethod = event;
                                        this.calculateChange();
                                    }
                                }>
                                    <Button>
                                        % change in {modelChildrenGeneral[this.compareMethod]} 
                                        <Icon type="ios-arrow-down"></Icon>
                                    </Button>
                                    <DropdownMenu slot="list" class="my-0">
                                        <DropdownItem name="conversion">Conversion</DropdownItem>
                                        <DropdownItem name="revenue">Revenue</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <div class="small my-1">
                                    (from {this.selectedModels[0].name})
                                </div>
                            </div>
                        )
                    },
                    align: 'center',
                    minWidth: 200,
                    children: [
                        {
                            title: this.selectedModels[1].name,
                            key: 'percentChange',
                            align: 'center',
                            minWidth: 100,
                            sortable: true
                        }
                    ]
                };
                this.iColumns.push(percentChange);
            }

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
                this.calculateChange();
                this.loading = false;
            });

        },
        refreshTable() {
            this.generateHeaders();
            this.generateData(1);
        },
        calculateChange() {
            
            if(this.selectedModels.length > 1) {
                let firstKey = this.selectedModels[0].key+'-'+this.compareMethod;
                let secondKey = this.selectedModels[1].key+'-'+this.compareMethod;

                for(let i = 0; i < this.iData.length; i++) {
                    let numerator = this.iData[i][secondKey];
                    let denominator = this.iData[i][firstKey];
                    let result = ((numerator / denominator) * 100) - 100;
                    result = Math.round((result + 0.00001) * 100) / 100
                    
                    this.iData[i].percentChange = result+'%';
                }
            }
        }
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

