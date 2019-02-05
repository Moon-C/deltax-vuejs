<template>
  <div class="container">

    <keep-alive>
      <component :is="selectedComponent" @switchComponent="switchComponent($event)" v-bind="currentProps">
        <legend slot="legend">{{ heading }}</legend>
      </component>
    </keep-alive>

  </div>
</template>


<script>

import axios from 'axios'
import MovieDetails from '../components/MovieDetails.vue'
import PersonDetails from '../components/PersonDetails.vue'

export default {
  data() {
    return {
      selectedComponent: 'movie-details',
      currentProps: {}
    }
  },
  computed: {
    heading: function() {
      if(this.selectedComponent == 'movie-details')
        return 'Edit Movie';
      if(this.selectedComponent == 'person-details') {
        if(this.currentProps.mode == 'new-producer')
          return 'Add New Producer';
        if(this.currentProps.mode == 'new-actor')
          return 'Add New Actor';
      }
    }
  },
  methods: {
    switchComponent: function(event) {

        // change this
        if(event.name === 'movie-details')
            this.selectedComponent = 'movie-details';
        else
            this.selectedComponent = event.name;
        // ok
        if(event.name !== 'movie-details')
            this.currentProps = {mode: event.mode};
        else
            this.currentProps = {};
    }
  },
  components: {
    'movie-details': MovieDetails,
    'person-details': PersonDetails
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

.entryForm {
  max-width: 600px;
  margin: auto;
  margin-bottom: 20px;
  padding: 30px;
  padding-bottom: 0px;
  border: 1px solid #888;
  border-radius: 10px;
}

</style>
