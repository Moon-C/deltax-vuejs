<template>
  <div class="container">

    <movie-details @switchComponent="switchComponent($event)" v-bind="currentProps">
      <legend slot="legend">{{ heading }}</legend>
    </movie-details>

  </div>
</template>


<script>

import axios from 'axios'
import MovieDetails from '../components/MovieDetails.vue'

export default {
  data() {
    return {
      currentProps: {},
      refresh: true
    }
  },
  computed: {
    heading: function() {
      if(this.$route.params.id === undefined)
        return 'Add New Movie';
      else
        return 'Edit Movie';
    }
  },
  methods: {
    switchComponent: function(component) {
      if(component.producerID !== undefined)
        this.currentProps = {producerID: component.producerID};
      if(component.actorID !== undefined)
        this.currentProps = {actorID: component.actorID};
    }
  },
  components: {
    'movie-details': MovieDetails
  }

}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

.invalid-feedback {
  display: block !important;
}

/* .btn-primary {
  background-color: #41b883 !important;
  border-color: #41b883 !important;
} */

</style>
