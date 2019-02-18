<template>
    <div class="container">
        <div class="row">
            <CheckboxGroup v-model="selectedComparators"
            :value="true"
            @on-change="generateTable()">
                <Checkbox v-for="comparator in comparatorTypes" 
                :label="comparator"
                :key="comparator" />
            </CheckboxGroup>
        </div>
        <div class="row">
            <Table :columns="iColumns" :data="iData" stripe border height="500"></Table>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            comparatorTypes: ['First Interaction','Last Interaction','U-shaped'],
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

        }
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
