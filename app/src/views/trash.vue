<template>
  <v-container
    align-start
    fluid
    fill-height
  >
    <v-col cols="12">
      <v-row justify="space-around">
        <v-card
          v-for="file in files"
          :key="file._id"
          elevation="6"
          max-width="500"
        >
          <v-card-title>{{ file.name }}</v-card-title>
          <v-card-text v-if="file.description != 'null'">
            {{ file.description }}
          </v-card-text>
          <v-card-actions>
            <v-item-group>
              <v-btn @click="recover(file)">
                Recover
              </v-btn>
              <v-btn
                color="error"
                @click="remove(file)"
              >
                Remove
              </v-btn>
            </v-item-group>
          </v-card-actions>
        </v-card>
        <v-card v-if="files.length == 0">
          <v-card-title class="font-weight-light">No files available</v-card-title>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
//Imports
import api from '../api.js';

export default {
  data: () => ({
    files: []
  }),
  created: function ()
  {
    api.trash.all().then(files => this.files = files);

    //Get trash
    api.trash.all().then(files => this.files = files);
  },
  methods: {
    //Recover file
    recover: function (file)
    {
      api.trash.recover(file._id).then(() =>
      {
        //Get index
        const index = this.files.findIndex(item => item._id == file._id);

        //Remove file
        this.files.splice(index, 1);
      });
    },
    //Remove file
    remove: function (file)
    {
      api.trash.remove(file._id).then(() =>
      {
        //Get index
        const index = this.files.findIndex(item => item._id == file._id);

        //Remove file
        this.files.splice(index, 1);
      });
    }
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}
</style>