<template>
  <div>
    <lightbox v-model="lightboxes.upsert.visible">
      <template v-slot:title>
        {{ lightboxes.upsert.create ? 'Create a new machine' : 'Edit ' + lightboxes.upsert.name }}
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
                v-model="lightboxes.upsert.name"
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
                v-model="lightboxes.upsert.controller"
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
                v-model="lightboxes.upsert.tags"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                @blur="update('length')"
                label="Length"
                ref="length"
                type="number"
                v-model.number="lightboxes.upsert.length"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                @blur="update('width')"
                label="Width"
                ref="width"
                type="number"
                v-model.number="lightboxes.upsert.width"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                :rules="[rules.required, rules.number]"
                @blur="update('height')"
                label="Height"
                ref="height"
                type="number"
                v-model.number="lightboxes.upsert.height"
              />
            </v-list-item>

            <v-list-item>
              <v-item-group>
                <v-btn
                  :disabled="!prechecks"
                  @click="create()"
                  v-if="lightboxes.upsert.create"
                >
                  Create
                </v-btn>

                <v-btn @click="lightboxes.upsert.visible = false">
                  {{ lightboxes.upsert.create ? 'Cancel' : 'Close' }}
                </v-btn>
              </v-item-group>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <lightbox v-model="lightboxes.control.visible">
      <template v-slot:title>
        Control {{machine.name}}
      </template>
      <template v-slot:content>
        <machine :machine="machine" />
      </template>
    </lightbox>

    <gallery
      @add="upsert()"
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
        <v-item-group>
          <v-btn @click="machine = props.entity; lightboxes.control.visible = true">Control</v-btn>
          <v-btn @click="upsert(props.entity)">
            Edit
          </v-btn>
          <v-btn
            color="error"
            @click="_delete(props.entity)"
          >
            Delete
          </v-btn>
        </v-item-group>
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
import machine from '../components/machine.vue';
import {filters} from '../../../config.js';

export default {
  components: {
    gallery,
    lightbox,
    machine
  },
  data: () => ({
    x: 3.5,
    controllers: [],
    lightboxes: {
      control: {
        visible: false
      },
      upsert: {
        _id: null,
        controller: null,
        tags: [],
        name: null,
        length: 0,
        width: 0,
        height: 0,
        create: false,
        visible: false,
      },
    },
    machine: {name: null},
    machines: [],
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      name: value => new RegExp(filters.name).test(value) || 'Invalid name',
      tags: value => value instanceof Array && new RegExp(filters.tags).test(JSON.stringify(value)) || 'Invalid tags',
      number: value => typeof value == 'number' || 'Invalid number'
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
    //Show upsert lightbox
    upsert: function (machine)
    {
      //Configure lightbox
      if (machine == null)
      {
        this.lightboxes.upsert._id = null;
        this.lightboxes.upsert.controller = this.controllers[0];
        this.lightboxes.upsert.name = null;
        this.lightboxes.upsert.tags = [];
        this.lightboxes.upsert.length = 0;
        this.lightboxes.upsert.width = 0;
        this.lightboxes.upsert.height = 0;
        this.lightboxes.upsert.create = true;
      }
      else
      {
        this.lightboxes.upsert._id = machine._id;
        this.lightboxes.upsert.controller = machine.controller;
        this.lightboxes.upsert.name = machine.name;
        this.lightboxes.upsert.tags = machine.tags;
        this.lightboxes.upsert.length = machine.length;
        this.lightboxes.upsert.width = machine.width;
        this.lightboxes.upsert.height = machine.height;
        this.lightboxes.upsert.create = false;
      }

      //Show upsert lightbox
      this.lightboxes.upsert.visible = true;
    },
    //Create machine
    create: function ()
    {
      api.machines.create(this.lightboxes.upsert.controller._id, this.lightboxes.upsert.name, this.lightboxes.upsert.tags, this.lightboxes.upsert.length, this.lightboxes.upsert.width, this.lightboxes.upsert.height).then(({_id, controller}) =>
      {
        //Add to list
        this.machines.push({
          _id,
          controller,
          name: this.lightboxes.upsert.name,
          tags: this.lightboxes.upsert.tags,
          length: this.lightboxes.upsert.length,
          width: this.lightboxes.upsert.width,
          height: this.lightboxes.upsert.height
        });

        //Hide upsert lightbox
        this.lightboxes.upsert.visible = false;
      });
    },
    //Update machine
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.lightboxes.upsert.create)
      {
        //Update front end
        const machine = this.machines.find(machine => machine._id == this.lightboxes.upsert._id);
        machine[property] = this.lightboxes.upsert[property];

        //Update backend
        if (property == 'controller')
        {
          api.machines.update({[property]: this.lightboxes.upsert[property]._id}, this.lightboxes.upsert._id);
        }
        else
        {
          api.machines.update({[property]: this.lightboxes.upsert[property]}, this.lightboxes.upsert._id);
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