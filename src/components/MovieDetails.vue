<template>

    <form class="entryForm">
      <slot name=legend />

      <fieldset class="form-group">
        
        <div class="form-group row align-items-center">
          <label class="col-sm-2 col-form-label" for="name">Movie Name</label>
          <div class="col-sm-10">
            <input type="text" id="name" class="form-control" v-model="movieDetails.name" />
          </div>
        </div>

        <div class="form-group row align-items-center">
          <label class="col-sm-2 col-form-label"  for="year">Release Date</label>
          <div class="col-sm-10">
            <input type="text" id="year" class="form-control" v-model="movieDetails.yearOfRelease" />
          </div>
        </div>

        <div class="form-group row align-items-center">
          <label class="col-sm-2 col-form-label"  for="plot">Plot</label>
          <div class="col-sm-10">
            <textarea id="plot" class="form-control" v-model="movieDetails.plot" />
          </div>
        </div>

        <div class="form-group row align-items-center">
          <label class="col-sm-2 col-form-label"  for="posterUrl">Poster URL</label>
          <div class="col-sm-10">
            <input type="text" id="posterUrl" class="form-control" v-model="movieDetails.poster" />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-sm-2 col-form-label"  for="producers">Producers</label>
          <div class="col-sm-10">
            <select id="producers" class="form-control" v-model="movieDetails.producer">
              <option v-for="producer in Object.values(producerMap)" :key="producer.id" :value="producer.id">{{ producer.name }}</option>
            </select>
            <p><a @click.prevent="$emit('switchComponent', {name: 'person-details', mode: 'new-producer'})" href="">+ Add Producer</a></p>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-sm-2 col-form-label"  for="actors">Actors</label>
          <div class="col-sm-10">
            <multiselect id="actors" v-model="movieDetails.actors" placeholder="Search or add actor" label="name" track-by="name" 
            :options="Object.values(actorMap)" :multiple="true" :clearOnSelect="true" :hideSelected="true" openDirection="below"></multiselect>
            <p><a @click.prevent="$emit('switchComponent', {name: 'person-details', mode: 'new-actor'})" href="">+ Add Actor</a></p>
          </div>
        </div>

        <div class="form-group">
          <button class="btn btn-primary" type="button" @click="submitRequest()">Submit</button>
        </div>
      </fieldset>
    </form>

</template>

<script>

import axios from 'axios'
import Multiselect from 'vue-multiselect'

export default {
    data() {
        return {
          id: this.$route.params.id,
          movieDetails: {
            name: '',
            yearOfRelease: '',
            plot: '',
            poster: '',
            producer: '',
            actors: []
          },
          producerMap: {},
          actorMap: {}
        }
    },
    methods: {
      generateProducerMap: function() {
        let self = this;

        axios.get('/producers')
        .then(res => {

          const producers = res.data;
          let producerMap = producers.reduce((map, producer) => 
            (map[producer.id] = {id: producer.id, name: producer.name}, map), {});

          self.producerMap = producerMap;

        })
        .catch(error => console.log(error));
      },
      generateActorMap: function() {
        let self = this;

        axios.get('/actors')
        .then(res => {

          const actors = res.data;
          let actorMap = actors.reduce((map, actor) => 
            (map[actor.id] = {id: actor.id, name: actor.name}, map), {});

          self.actorMap = actorMap;
          if(self.id !== undefined)
            self.loadActorDetails();

        })
        .catch(error => console.log(error));
      },
      fetchMovieDetails: function() {
        let self = this;

        axios.get('/movies/'+self.id)
        .then(res => self.movieDetails = res.data)
        .catch(error => console.log(error));
      },
      loadActorDetails: function() {
          let actors = [];
          this.movieDetails.actors.forEach(actorID =>
            actors.push({ id: this.actorMap[actorID].id, name: this.actorMap[actorID].name }));
          this.movieDetails.actors = actors;
      },
      submitRequest: function() {

        let json = JSON.parse(JSON.stringify(this.movieDetails));
        json.actors = json.actors.map(actor => actor.id);
        console.log(json);

        let self = this;
        if(self.id === undefined) {
          axios.post('/movies', json)
          .then(res => {
              console.log(res);
              self.$router.push({name: 'listings', params: 
              { paramAlert: true, paramAlertText: "'"+json.name+"' has been added to listings." }});
          });
        } else {
          axios.put('/movies/'+self.id, json)
          .then(res => {
              console.log(res);
              self.$router.push({name: 'listings', params: 
              { paramAlert: true, paramAlertText: "Details for '"+json.name+"' has been modified." }});
          });
        }

      }
    },
    created() {
      if(this.id !== undefined)
        this.fetchMovieDetails();
      this.generateProducerMap();
      this.generateActorMap();
    },
    activated() {
      this.generateProducerMap();
      this.generateActorMap();
    },
    components: {
      multiselect: Multiselect
    }
}
</script>
