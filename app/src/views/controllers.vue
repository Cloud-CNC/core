<template>
  <div>
    <lightbox v-model="dialog.visible">
      <template v-slot:title>
        {{ dialog.create ? 'Create a new controller' : 'Edit ' + dialog.name }}
      </template>
      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                ref="name"
                v-model="dialog.name"
                counter="30"
                label="Name"
                :rules="[rules.required, rules.name]"
                @blur="update('name')"
              />
            </v-list-item>

            <v-list-item>
              <v-item-group>
                <v-btn
                  v-if="dialog.create"
                  :disabled="!prechecks"
                  @click="create()"
                >
                  Create
                </v-btn>
                <v-btn @click="dialog.visible = false">
                  {{ dialog.create ? 'Cancel' : 'Close' }}
                </v-btn>
              </v-item-group>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <gallery
      @add="showDialog()"
      :entities="controllers"
    >
      <template v-slot:actions="props">
        <v-item-group>
          <download
            :data="props.entity.key"
            :filename="`Controller_Key_${props.entity.name}_${props.entity._id}.txt`"
            :id="props.entity._id"
          ></download>
          <v-btn @click="$root.$emit('download', props.entity._id)">Download</v-btn>
          <v-btn @click="showDialog(props.entity)">
            Edit
          </v-btn>
          <v-btn
            color="error"
            @click="remove(props.entity)"
          >
            Remove
          </v-btn>
        </v-item-group>
      </template>
    </gallery>
  </div>
</template>

<script>
//Imports
import api from '../api.js';
import download from '../components/download.vue';
import gallery from '../components/gallery.vue';
import lightbox from '../components/lightbox.vue';
import {filters} from '../../../config.js';

export default {
  components: {
    download,
    gallery,
    lightbox
  },
  data: () => ({
    dialog: {
      _id: null,
      name: null,
      visible: false,
      create: false
    },
    prechecks: false,
    controllers: [],
    rules: {
      required: value => value != null || 'Required',
      name: value => new RegExp(filters.name).test(value) || 'Invalid name'
    }
  }),
  created: function ()
  {
    //Get controllers
    api.controllers.all().then(controllers => 
    {
      this.controllers = controllers;
    });
  },
  methods:
  {
    //Show dialog
    showDialog: function (controller)
    {
      //Configure dialog
      if (controller == null)
      {
        this.dialog._id = null;
        this.dialog.name = null;
        this.dialog.create = true;
      }
      else
      {
        this.dialog._id = controller._id;
        this.dialog.name = controller.name;
        this.dialog.create = false;
      }

      //Show dialog
      this.dialog.visible = true;
    },
    //Create controller
    create: function ()
    {
      api.controllers.create(this.dialog.name).then(({_id, key}) =>
      {
        //Add to list
        this.controllers.push({
          _id,
          name: this.dialog.name,
          key
        });

        //Hide dialog
        this.dialog.visible = false;
      });
    },
    //Update machine
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.dialog.create)
      {
        //Update front end
        const machine = this.controllers.find(machine => machine._id == this.dialog._id);
        machine[property] = this.dialog[property];

        //Update backend
        api.controllers.update({[property]: this.dialog[property]}, this.dialog._id);
      }
    },
    //Remove machine
    remove: function (machine)
    {
      api.controllers.remove(machine._id).then(() =>
      {
        //Get index
        const index = this.controllers.findIndex(item => item._id == machine._id);

        //Remove machine
        this.controllers.splice(index, 1);
      });
    }
  }
};
</script>

<style>
#container {
  padding: 15px;
}

#create {
  float: right;
}

textarea {
  height: 20vh;
  width: 30vw !important;
}
</style>