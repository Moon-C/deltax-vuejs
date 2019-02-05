<template>
  <div class="container">

    <transition name="fade">
      <div id="movieAlert" v-if="showAlert" class="alert alert-primary" role="alert">
        {{ alertText }}
      </div>
    </transition>

    <table class="table table-striped">
      <thead>
        <tr>
          <!-- <th scope="col">#</th> -->
          <th scope="col">Movie Name</th>
          <th scope="col">Release Date</th>
          <th scope="col">Producer</th>
          <th scope="col">Actors</th>
          <th scope="col"> </th>
        </tr>
      </thead>
      <tbody>
        
        <tr v-for="(movie, index) in movies" :key="movie.id">
          <!-- <th scope="row">{{ movie.id }}</th> -->
          <td>{{ movie.name }}</td>
          <td>{{ movie.yearOfRelease }}</td>
          <td>{{ movie.producer }}</td>
          <td>{{ movie.actors.join(", ") }}</td>
          <td><small><router-link :to="{ name: 'editEntry', params: { id: movie.id } }">Edit</router-link> | 
          <a href="#" @click.prevent="deleteMovie(movie.id, index)">Delete</a></small></td>
        </tr>
      </tbody>
    </table>

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
      movies: []
    }
  },
  methods: {
    hideAlert: function() {
      let self = this;
      setTimeout(function(){ 
          self.showAlert = false;
      }, 5000);
    },
    deleteMovie: function(movieID, movieIndex) {
      let self = this;
      axios.delete('/movies/'+movieID)
      .then(res => {
        let movieName = self.movies[movieIndex].name;
        self.movies.splice(movieIndex, 1);
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
    .then(res => self.movies = res.data)
    .catch(error => console.log(error));

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
    
    if(this.showAlert)
      this.hideAlert();
  }
}
</script>
