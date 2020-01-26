<template>
  <div>
    <lightbox v-model="dialog.visible">
      <template v-slot:title>
        {{ dialog.create ? 'Create a new file' : 'Edit ' + dialog.name }}
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
              <v-textarea
                ref="description"
                v-model="dialog.description"
                counter="1000"
                label="Description"
                :rules="[rules.description]"
                @blur="update('description')"
              />
            </v-list-item>

            <v-list-item v-if="dialog.create">
              <v-file-input
                ref="file"
                accept=".gcode"
                label="File"
                :rules="[rules.raw]"
                @blur="update('name')"
                @change="dialog.raw = $event"
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
      :entities="files"
    >
      <template v-slot:actions="props">
        <v-item-group>
          <v-btn :to="`/file/${props.entity._id}`">
            Open
          </v-btn>
          <v-btn @click="showDialog(props.entity)">
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

      <template
        v-slot:empty
        class="font-weight-light"
      >
        No files available!
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
    lightbox,
    gallery
  },
  data: () => ({
    dialog: {
      name: null,
      description: null,
      raw: null,
      visible: false,
      create: false
    },
    files: [],
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      name: value => new RegExp(filters.name).test(value) || 'Invalid name',
      description: value => new RegExp(filters.description).test(value) || 'Invalid description',
      raw: value => value instanceof File && value.size > 0 || 'Invalid file'
    }
  }),
  created: function ()
  {
    //Get files
    api.files.all().then(files => this.files = files);
  },
  methods:
  {
    //Show dialog
    showDialog: function (file)
    {
      //Configure dialog
      if (file == null)
      {
        this.dialog._id = null;
        this.dialog.name = null;
        this.dialog.description = null;
        this.dialog.create = true;
      }
      else
      {
        this.dialog._id = file._id;
        this.dialog.name = file.name;
        this.dialog.description = file.description;
        this.dialog.create = false;
      }

      //Show dialog
      this.dialog.visible = true;
    },
    //Create file
    create: function ()
    {
      //Convert file to UTF8
      this.dialog.raw.arrayBuffer().then(raw =>
      {
        raw = new Uint8Array(raw);
        const temp = [];
        raw.forEach((byte, i) => temp[i] = String.fromCharCode(byte));
        raw = temp.join('');

        api.files.create(this.dialog.name, this.dialog.description, raw).then(_id =>
        {
          //Add to list
          this.files.push({_id, name: this.dialog.name, description: this.dialog.description});

          //Hide dialog
          this.dialog.visible = false;
        });
      });
    },
    //Update file
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.dialog.create)
      {
        //Update front end
        const file = this.files.find(file => file._id == this.dialog._id);
        file[property] = this.dialog[property];

        //Update backend
        api.files.update({[property]: this.dialog[property]}, this.dialog._id);
      }
    },
    //Delete file
    _delete: function (file)
    {
      api.files.remove(file._id).then(() =>
      {
        //Get index
        const index = this.files.findIndex(item => item._id == file._id);

        //Delete file
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

#create {
  float: right;
}
</style>