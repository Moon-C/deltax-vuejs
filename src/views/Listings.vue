<template>
  <div class="container">
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
  data() {
    return {
      movies: []
    }
  },
  methods: {
    deleteMovie: function(movieID, movieIndex) {
      let self = this;
      axios.delete('/movies/'+movieID)
      .then(self.movies.splice(movieIndex, 1))
      .catch(error => console.log(error));      
    }
  },
  mounted() {

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
  }
}
</script>
