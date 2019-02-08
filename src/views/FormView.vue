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
      currentProps: {},
      refresh: true
    }
  },
  computed: {
    heading: function() {
      if(this.selectedComponent === 'movie-details') {
        if(this.$route.params.id === undefined)
          return 'Add New Movie';
        else
          return 'Edit Movie';
      }
      if(this.selectedComponent === 'person-details') {
        if(this.currentProps.mode === 'new-producer')
          return 'Add New Producer';
        if(this.currentProps.mode === 'new-actor')
          return 'Add New Actor';
      }
    }
  },
  methods: {
    switchComponent: function(component) {
      this.selectedComponent = component.name;
      if(component.name === 'movie-details') {
        if(component.producerID !== undefined)
          this.currentProps = {producerID: component.producerID};
        if(component.actorID !== undefined)
          this.currentProps = {actorID: component.actorID};
      }
      else
        this.currentProps = {mode: component.mode};
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

.entry-form {
  max-width: 600px;
  margin: auto;
  margin-bottom: 20px;
  padding: 30px;
  padding-bottom: 0px;
  border: 1px solid #888;
  border-radius: 10px;
}

.invalid-feedback {
  display: block !important;
}

/* .btn-primary {
  background-color: #41b883 !important;
  border-color: #41b883 !important;
} */

</style>
