<template>
  <div class="container">

    <movie-details @switchComponent="switchComponent($event)" v-bind="currentProps">
      <legend slot="legend">{{ heading }}</legend>
    </movie-details>

  </div>
</template>


<script>

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
