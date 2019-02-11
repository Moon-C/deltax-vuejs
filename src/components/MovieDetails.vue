<template>

  <form class="entry-form">
    <slot name=legend />

    <b-modal id="personDialog" :hide-header="true" :hide-footer="true">
      <person-details @switchComponent="recreate($event)" :mode="mode">
        <legend slot="legend">{{ heading }}</legend>
      </person-details>
    </b-modal>

    <fieldset class="form-group">

      <div class="form-group row align-items-center">
        <label class="col-sm-2 col-form-label" for="name">Movie Name</label>
        <div class="col-sm-10">
          <input type="text" id="name" class="form-control" v-model.trim="$v.movieDetails.name.$model" />
          <div class="invalid-feedback" v-if="!$v.movieDetails.name.required && $v.movieDetails.name.$dirty">
            Please enter a valid name!
          </div>
        </div>
      </div>

      <div class="form-group row align-items-center">
        <label class="col-sm-2 col-form-label"  for="year">Release Date</label>
        <div class="col-sm-10">
          <input type="text" id="year" class="form-control" v-model.trim.lazy="$v.movieDetails.yearOfRelease.$model" />
          <div class="invalid-feedback" v-if="!$v.movieDetails.yearOfRelease.validDate && $v.movieDetails.yearOfRelease.$dirty">
            Please enter a valid date! (dd/mm/yyyy)
          </div>
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

          <select 
          id="producers"
          class="form-control"
          v-model="$v.movieDetails.producer.$model">
          <option
          v-for="producer in Object.values(producerMap)" 
          :key="producer.id" 
          :value="producer.id">{{ producer.name }}
        </option>
      </select>

      <div><b-link v-b-modal.personDialog href="#" @click="mode = 'new-producer'">+ Add Producer</b-link></div>

      <div class="invalid-feedback" v-if="!$v.movieDetails.producer.required && $v.movieDetails.producer.$dirty">
        Please select a producer
      </div>
    </div>
  </div>

  <div class="form-group row">
    <label class="col-sm-2 col-form-label"  for="actors">Actors</label>
    <div class="col-sm-10">

      <multiselect
      id="actors" 
      v-model="$v.movieDetails.actors.$model" 
      placeholder="Search or add actor" 
      label="name" 
      track-by="name" 
      :options="Object.values(actorMap)" 
      :multiple="true" 
      :clearOnSelect="true" 
      :hideSelected="true" 
      openDirection="below">
    </multiselect>

    <div><b-link v-b-modal.personDialog href="#" @click="mode = 'new-actor'">+ Add Actor</b-link></div>

    <div class="invalid-feedback" v-if="!$v.movieDetails.actors.required && $v.movieDetails.actors.$dirty">
      Minimum one actor must be selected
    </div>

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
  import { required } from 'vuelidate/lib/validators'
  
import PersonDetails from '../components/PersonDetails.vue'

  const validDate = (date) => date.search(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/) === 0

  export default {
    props: ['producerID','actorID'],
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
        actorMap: {},
        mode: ''
      }
    },
    computed: {
      heading: function() {
        if(this.mode === 'new-producer')
          return 'Add New Producer'
        if(this.mode === 'new-actor')
          return 'Add New Actor'
      }
    },
    validations: {
      movieDetails: {
        name: { required },
        yearOfRelease: { validDate },
        producer: { required },
        actors: { required }
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

          if(self.producerID !== undefined)
            self.movieDetails.producer = self.producerID; 

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
          if(self.id !== undefined && self.movieDetails.actors.length === 0)
            self.fetchMovieDetails();

          if(self.actorID !== undefined)
            self.movieDetails.actors.push(self.actorMap[self.actorID]);

        })
        .catch(error => console.log(error));
      },
      fetchMovieDetails: function() {
        let self = this;

        axios.get('/movies/'+self.id)
        .then(res => {
          self.movieDetails = res.data;
          self.loadActorDetails();
        })
        .catch(error => console.log(error));
      },
      loadActorDetails: function() {
        let actors = [];
        this.movieDetails.actors.forEach(actorID =>
          actors.push({ id: this.actorMap[actorID].id, name: this.actorMap[actorID].name }));
        this.movieDetails.actors = actors;
      },
      recreate: function(event) {
          this.$emit('switchComponent', event);
          this.generateProducerMap();
          this.generateActorMap();
      },
      submitRequest: function() {

        let json = JSON.parse(JSON.stringify(this.movieDetails));
        json.actors = json.actors.map(actor => actor.id);
        console.log(json);

        let self = this;
        self.$v.$touch();
        if(!self.$v.$invalid) {
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
      }
    },
    created() {
      this.generateProducerMap();
      this.generateActorMap();
    },
    components: {
      multiselect: Multiselect,
      'person-details': PersonDetails
    }
  }
</script>

<style scoped>

.entry-form {
  max-width: 600px;
  margin: auto;
  margin-bottom: 20px;
  padding: 30px;
  padding-bottom: 0px;
  border: 1px solid #888;
  border-radius: 10px;
}

</style>
