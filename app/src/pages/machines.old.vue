<template>
  <div>
    <lightbox v-model="dialog.visible">
      <template v-slot:title>
        {{ dialog.create ? 'Create a new machine' : 'Edit ' + dialog.name }}
      </template>
      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.name]"
                @blur="update('name')"
                counter="30"
                label="Name"
                ref="name"
                v-model="dialog.name"
              />
            </v-list-item>

            <v-list-item>
              <v-select
                :items="controllers"
                @blur="update('controller')"
                item-text="name"
                item-value="_id"
                label="Controller"
                ref="controller"
                v-model="dialog.controller"
              ></v-select>
            </v-list-item>

            <v-list-item>
              <v-combobox
                chips
                multiple
                :rules="[rules.required, rules.tags]"
                @blur="update('tags')"
                label="Tags"
                ref="tags"
                v-model="dialog.tags"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.double]"
                @blur="update('length')"
                label="Length"
                ref="length"
                v-model="dialog.length"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.double]"
                @blur="update('width')"
                label="Width"
                ref="width"
                v-model="dialog.width"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.double]"
                @blur="update('height')"
                label="Height"
                ref="height"
                v-model="dialog.height"
              />
            </v-list-item>

            <v-list-item>
              <v-btn
                :disabled="!prechecks"
                @click="create()"
                v-if="dialog.create"
              >
                Create
              </v-btn>

              <v-btn @click="dialog.visible = false">
                {{ dialog.create ? 'Cancel' : 'Close' }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <gallery
      @add="showDialog()"
      :entities="machines"
    >
      <template v-slot:description="props">
        <p>Machine bound to controller: {{props.entity.controller.name}}</p>
        <v-chip-group column>
          <v-chip
            small
            :key="tag"
            v-for="tag in props.entity.tags"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </template>

      <template v-slot:actions="props">
        <v-btn>Command</v-btn>
        <v-btn @click="showDialog(props.entity)">
          Edit
        </v-btn>
        <v-btn
          color="error"
          @click="_delete(props.entity)"
        >
          Delete
        </v-btn>
      </template>

      <template v-slot:empty class="font-weight-light">
        No machines available!
      </template>
    </gallery>
  </div>
</template>

<script>
//Imports
import api from '../api.js';
import gallery from '../components/gallery.vue';
import lightbox from '../components/lightbox.vue';
import {filters} from '../../../config.js';

export default {
  components: {
    gallery,
    lightbox
  },
  data: () => ({
    dialog: {
      _id: null,
      controller: null,
      tags: [],
      name: null,
      length: 0,
      width: 0,
      height: 0,
      visible: false,
      create: false
    },
    prechecks: false,
    machines: [],
    controllers: [],
    rules: {
      required: value => value != null || 'Required',
      name: value => new RegExp(filters.name).test(value) || 'Invalid name',
      tags: value => value instanceof Array && new RegExp(filters.tags).test(JSON.stringify(value)) || 'Invalid tags',
      double: value => new RegExp(filters.double).test(value) || 'Invalid number'
    }
  }),
  created: function ()
  {
    //Get machines
    api.machines.all().then(machines => this.machines = machines);

    //Get controllers
    api.controllers.all().then(controllers => this.controllers = controllers);
  },
  methods:
  {
    //Show dialog
    showDialog: function (machine)
    {
      //Configure dialog
      if (machine == null)
      {
        this.dialog._id = null;
        this.dialog.controller = this.controllers[0];
        this.dialog.name = null;
        this.dialog.tags = [];
        this.dialog.length = 0;
        this.dialog.width = 0;
        this.dialog.height = 0;
        this.dialog.create = true;
      }
      else
      {
        this.dialog._id = machine._id;
        this.dialog.controller = machine.controller;
        this.dialog.name = machine.name;
        this.dialog.tags = machine.tags;
        this.dialog.length = machine.length;
        this.dialog.width = machine.width;
        this.dialog.height = machine.height;
        this.dialog.create = false;
      }

      //Show dialog
      this.dialog.visible = true;
    },
    //Create machine
    create: function ()
    {
      api.machines.create(this.dialog.controller._id, this.dialog.name, this.dialog.tags, this.dialog.length, this.dialog.width, this.dialog.height).then(({_id, controller}) =>
      {
        //Add to list
        this.machines.push({
          _id,
          controller,
          name: this.dialog.name,
          tags: this.dialog.tags,
          length: this.dialog.length,
          width: this.dialog.width,
          height: this.dialog.height
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
        const machine = this.machines.find(machine => machine._id == this.dialog._id);
        machine[property] = this.dialog[property];

        //Update backend
        if (property == 'controller')
        {
          api.machines.update({[property]: this.dialog[property]._id}, this.dialog._id);
        }
        else
        {
          console.log(`Property: ${property} Dialog: ${this.dialog[property]}`);
          api.machines.update({[property]: this.dialog[property]}, this.dialog._id);
        }
      }
    },
    //Delete machine
    _delete: function (machine)
    {
      api.machines.remove(machine._id).then(() =>
      {
        //Get index
        const index = this.machines.findIndex(item => item._id == machine._id);

        //Delete machine
        this.machines.splice(index, 1);
      });
    }
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}

#create {
  float: right;
}
</style>