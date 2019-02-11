<template>
  <div class="container">

    <b-alert id="movieAlert" :show="showAlert" variant="primary" dismissible fade>
      {{ alertText }}
    </b-alert>

    <b-modal id="movieDetailsDialog" :title="selectedMovie.name" :ok-only="true" footer-class="py-1" >
      <b-container>
        <b-row>
          <b-col cols="4"><b-img thumbnail fluid :src="selectedMovie.poster" alt="Poster Unavailable" /></b-col>
          <b-col cols="8">
            <p class="mt-2">Release Date: {{ selectedMovie.yearOfRelease }}</p>
            <p class="mt-2">Plot: {{ selectedMovie.plot }}</p>
            <p class="mt-2">Producer: {{ selectedMovie.producer }}</p>
            <p class="mt-2">Actors: {{ selectedMovie.actors.join(", ") }}</p>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>

    <b-modal @ok="deleteMovie()" id="deleteDialog" title="Delete Confirmation" ok-title="Delete" footer-class="py-1" >
      <p class="mt-3">Remove '{{ deleteParameters.movieName }}' from listings?</p>
    </b-modal>

    <b-container>
      <b-list-group>
        <b-list-group-item v-for="(movie, index) in movies" :key="movie.id">
          <b-row>
            <b-col sm="10">
              <b-link v-b-modal.movieDetailsDialog href="#" @click="setSelectedMovie(movie)">{{ movie.name }}</b-link></b-col>
            <b-col sm="2"><small>
              <router-link :to="{ name: 'editEntry', params: { id: movie.id } }">Edit</router-link> | 
              <b-link v-b-modal.deleteDialog href="#" @click="setDeleteParameters(movie.id, index)">Delete</b-link>
            </small></b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-container>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'listings',
  props: ['paramAlert', 'paramAlertText'],
  data() {
    return {
      showAlert: false,
      alertText: '',
      deleteParameters: {
        movieID: '',
        movieIndex: null,
        movieName: ''
      },
      selectedMovie: {
        actors: []
      },
      movies: []
    }
  },
  methods: {
    hideAlert: function() {
      let self = this;
      setTimeout(() => self.showAlert = false, 5000);
    },
    setSelectedMovie: function(movie) {
      this.selectedMovie = movie;
    },
    setDeleteParameters: function(movieID, movieIndex) {
      this.deleteParameters.movieID = movieID;
      this.deleteParameters.movieIndex = movieIndex;
      this.deleteParameters.movieName = this.movies[movieIndex].name;
    },
    deleteMovie: function() {
      let self = this;
      axios.delete('/movies/'+this.deleteParameters.movieID)
      .then(() => {
        let movieName = self.movies[this.deleteParameters.movieIndex].name;
        self.movies.splice(this.deleteParameters.movieIndex, 1);
        self.showAlert = true;
        self.alertText = "'"+movieName+"' was deleted from listings.";
        self.hideAlert();
      })
      .catch(error => console.log(error));      
    }
  },
  mounted() {

    // Checking for alerts
    if(this.paramAlert) {
      this.showAlert = this.paramAlert;
      this.alertText = this.paramAlertText;
    }

    // Fetch movie listings
    let self = this;
    axios.get('/movies')
    .then(res => {
      
      self.movies = res.data;

      // Fetch and map producers
      axios.get('/producers')
      .then(res => {

        const producers = res.data;
        let producerMap = producers.reduce((map, producer) => 
          (map[producer.id] = {id: producer.id, name: producer.name}, map), {});

        self.movies.forEach((movie, index) =>
          self.movies[index].producer = producerMap[movie.producer].name);

      })
      .catch(error => console.log(error));

      // Fetch and map actors
      axios.get('/actors')
      .then(res => {

        const actors = res.data;
        let actorMap = actors.reduce((map, actor) => 
          (map[actor.id] = {id: actor.id, name: actor.name}, map), {});

        self.movies.forEach((movie, index) => {
          self.movies[index].actors = self.movies[index].actors
          .map(actorID => actorMap[actorID].name);
        });

      })
      .catch(error => console.log(error));
      
    })
    .catch(error => console.log(error));
    
    if(this.showAlert)
      this.hideAlert();
  }
}
</script>
