<template>
  <form class="entry-form">

    <slot name="legend" />

    <div class="form-group row align-items-center">
      <label class="col-sm-2 col-form-label" for="name">{{ personTitle }} Name</label>
      <div class="col-sm-10">
        <input type="text" id="name" class="form-control" v-model.trim="$v.personDetails.name.$model" required />
        <div class="invalid-feedback" v-if="!$v.personDetails.name.required && $v.personDetails.name.$dirty">
          Please enter a valid name!
        </div>
      </div>
    </div>

    <div class="form-group row align-items-center">
      <label class="col-form-label col-sm-2" for="sex">Sex</label>
      <div id="sex" class="col-sm-10">
        <div class="form-check form-check-inline">
          <input type="radio" id="male" value="M" v-model="$v.personDetails.sex.$model" class="form-check-input" required />
          <label for="male" class="form-check-label">Male</label>
        </div>
        <div class="form-check form-check-inline">
          <input type="radio" id="female" value="F" v-model="$v.personDetails.sex.$model" class="form-check-input" required />
          <label for="female" class="form-check-label">Female</label>
        </div>
        <div class="invalid-feedback" v-if="!$v.personDetails.sex.required && $v.personDetails.sex.$dirty">
          Select an option
        </div>
      </div>
    </div>

    <div class="form-group row align-items-center">
      <label class="col-sm-2 col-form-label" for="dob">Date of Birth</label>
      <div class="col-sm-10">
        <input type="text" id="dob" class="form-control" v-model.trim.lazy="$v.personDetails.dob.$model" required />
        <div class="invalid-feedback" v-if="!$v.personDetails.dob.validDate && $v.personDetails.dob.$dirty">
          Please enter a valid date! (dd/mm/yyyy)
        </div>
      </div>
    </div>
    <div class="form-group row align-items-center">
      <label class="col-sm-2 col-form-label" for="bio">Bio</label>
      <div class="col-sm-10">
        <textarea type="text" id="bio" class="form-control" v-model="personDetails.bio" />
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-2 col-form-label"  for="movies">Movies</label>
      <div class="col-sm-10">

        <multiselect 
        id="movies"
        v-model="personDetails.movies"
        placeholder="Search or add movie"
        label="name"
        track-by="name" 
        :options="Object.values(movieMap)" 
        :multiple="true" 
        :clearOnSelect="true"
        :hideSelected="true"
        openDirection="below">
      </multiselect>
    </div>
  </div>

  <p><b-link 
    href="#" 
    @click="$emit('switchComponent', {name: 'movie-details'})"> 
    Cancel 
  </b-link></p>

  <div class="form-group">
    <button class="btn btn-primary" type="button" @click.prevent="submitRequest()">Submit</button>
  </div>

</form>
</template>

<script>
  import axios from 'axios'
  import Multiselect from 'vue-multiselect'
  import { required } from 'vuelidate/lib/validators'

  const validDate = (date) => date.search(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/) === 0

  export default {
    props: ['mode'],
    data() {
      return {
        personDetails: {
          name: '',
          sex: '',
          dob: '',
          bio: '',
          movies: []
        },

        movieMap: {}
      }
    },
    computed: {
      tablePath: function() {
        if(this.mode == 'new-producer')
          return '/producers';
        if(this.mode == 'new-actor')
          return '/actors';
      },
      personTitle: function() {
        if(this.mode == 'new-producer')
          return 'Producer';
        if(this.mode == 'new-actor')
          return 'Actor';
      }
    },
    validations: {
      personDetails: {
        name: { required },
        sex: { required },
        dob: { validDate }
      },
    },
    methods: {
      submitRequest: function() {

        let json = JSON.parse(JSON.stringify(this.personDetails));
        json.movies = json.movies.map(movie => movie.id);
        console.log(json);

        let self = this;
        self.$v.$touch();
        if(!self.$v.$invalid) {
          axios.post(this.tablePath, json)
          .then(res => {
            console.log(res);   
            if(self.mode === 'new-producer') {
              self.$emit('switchComponent', {name: 'movie-details', producerID: res.data.id});
            }
            if(self.mode === 'new-actor')
              self.$emit('switchComponent', {name: 'movie-details', actorID: res.data.id});
          })
          .catch(error => {
            console.log(error);
            self.$emit('serverError');
          });
        }
      }
    },
    components: {
      multiselect: Multiselect
    },
    created() {
      let self = this;

      axios.get('/movies')
      .then(res => {

        const movies = res.data;
        let movieMap = movies.reduce((map, movie) => 
          (map[movie.id] = {id: movie.id, name: movie.name}, map), {});

        self.movieMap = movieMap;
      })
      .catch(error => {
        console.log(error);
        self.$emit('serverError');
      });
    },
    deactivated() {
      this.personDetails.name = '';
      this.personDetails.sex = '';
      this.personDetails.dob = '';
      this.personDetails.bio = '';
      this.personDetails.movies = [];
      this.$v.$reset();
    }
  }
</script>