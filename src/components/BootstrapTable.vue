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
        <div class="row">
            <b-table :fields="iColumns" :items="iData" striped bordered hover>
                <!-- <template slot="table-colgroup">
                    <col>
                    <col v-for="comparator in selectedComparators" :key="comparator" span="2" style="background-color:yellow">
                    <col>
                </template>

                <template slot="lastInteraction" slot-scope="data">
                    {{ data.item.liConversions }} {{ data.item.liConversionValue }}
                </template> -->

            </b-table>
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
                label: 'MCF Channel Grouping',
                key: 'channelGrouping',
                align: 'center',
            };
            this.iColumns.push(channelGroupHeader);

            this.selectedComparators.forEach(comparator => {
                let prefix = comparator.split(" ").map(word => word[0]).join('').toLowerCase();
                let conversions = {
                    label: 'Conversions',
                    key: prefix+'Conversions',
                    align: 'center',
                    sortable: true
                };
                let conversionValue = {
                    label: 'Conversion Value',
                    key: prefix+'ConversionValue',
                    align: 'center',
                    sortable: true
                };
                this.iColumns.push(conversions);
                this.iColumns.push(conversionValue);
            });

            // this.iColumns.push({ 
            //     key: 'lastInteraction',
            //     label: 'Laaast Interaction',
            //     colspan: '2'
            // });

            let percentChangeHeader = {
                    label: 'First Interaction',
                    key: 'firstInteraction',
                    align: 'center',
                    sortable: true
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

        }
    },
    components: {
        draggable: Draggable
    },
    mounted () 
    {
        this.generateTable();

        const data = [];
        for (let i = 0; i < 20; i++) {
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

