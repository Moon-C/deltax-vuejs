<template>
    <div class="container">
        <div class="row grey-wrapper">
            <div class="col-sm-6">
                <p>Selected columns</p>
                <draggable class="list-group" v-model="selectedComparators"
                :options="{ group: 'comparators' }"
                @change="generateTable()">
                    <div v-for="comparator in selectedComparators" 
                    class="list-group-item"
                    :key="comparator">{{ comparator }}</div>
                </draggable>
            </div>
            <div class="col-sm-6">
                <p>Add columns</p>
                <draggable class="list-group" v-model="comparatorTypes"
                :options="{ group: 'comparators' }">
                    <div v-for="comparator in comparatorTypes" 
                    :key="comparator"
                    class="list-group-item">{{ comparator }}</div>
                </draggable>
            </div>
        </div>
        <div class="grey-wrapper">
            <Table :columns="iColumns" :data="iData" stripe border></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="100" :current="1" @on-change="generateData($event)"></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Draggable from 'vuedraggable'

export default {
    data() {
        return {
            comparatorTypes: ['Last Interaction','U-shaped'],
            selectedComparators: ['First Interaction'],
            iColumns: [],
            iData: []
        }
    },
    methods: {
        generateTable() {

            // Generating columns
            
            this.iColumns = [];

            let channelGroupHeader = {
                title: 'MCF Channel Grouping',
                key: 'channelGrouping',
                align: 'center',
            };
            this.iColumns.push(channelGroupHeader);

            this.selectedComparators.forEach(comparator => {
                let prefix = comparator.split(" ").map(word => word[0]).join('').toLowerCase();
                let column = {
                    title: comparator,
                    align: 'center',
                    children: [
                        {
                            title: 'Conversions',
                            key: prefix+'Conversions',
                            align: 'center',
                            sortable: true
                        },
                        {
                            title: 'Conversion Value',
                            key: prefix+'ConversionValue',
                            align: 'center',
                            sortable: true
                        }
                    ] 
                }
                this.iColumns.push(column);
            });

            let percentChangeHeader = {
                title: '% change in conversions',
                key: 'changeInConversions',
                align: 'center',
                children: [
                    {
                        title: 'First Interaction',
                        key: 'firstInteraction',
                        align: 'center',
                        sortable: true
                    }
                ]
            };

            this.iColumns.push(percentChangeHeader);

            // Generating data

            // const data = [];
            // for (let i = 0; i < 20; i++) {

            //     let item = {
            //         key: i,
            //         channelGrouping: 'Group '+(i+1),
            //         firstInteraction: (i+1)+".0%"
            //     };

            //     this.selectedComparators.forEach(comparator => {
            //         let prefix = comparator.split(" ").map(word => word[0]).join('').toLowerCase();
            //         item[prefix+'Conversions'] = '$40';
            //         item[prefix+'ConversionValue'] = 'US$ '+(i+1)+'00000';
            //     });

            //     data.push(item);
            // }
            // this.iData = data;

        },
        generateData(page) {
            const data = [];
            for (let i = (page-1)*10; i < page*10; i++) {
                data.push({
                    key: i,
                    channelGrouping: 'Group '+(i+1),
                    liConversions: '$40',
                    liConversionValue: 'US$ '+(i+1)+'00000',
                    fiConversions: '$41',
                    fiConversionValue: 'US$ '+(i+2)+'00000',
                    uConversions: '$41',
                    uConversionValue: 'US$ '+(i+2)+'00000',
                    firstInteraction: (i+1)+".0%"
                });
            }
            this.iData = data;
        }
    },
    components: {
        draggable: Draggable
    },
    mounted () 
    {
        this.generateTable();
        this.generateData(1);

    }
}
</script>

<style>

.grey-wrapper {
    background-color: #CCC;
    margin: 10px;
    border: 5px solid #CCC;
    border-radius: 5px;
}

</style>

