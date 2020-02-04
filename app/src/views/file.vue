<template>
  <div>
    <lightbox v-model="visible">
      <template v-slot:title>Execute {{ file.name }}</template>
      <template v-slot:content>
        <v-form>
          <v-list>
            <v-list-item>
              <v-select
                item-text="name"
                item-value="_id"
                :items="machines"
                v-model="machine"
                label="Machine"
              ></v-select>
            </v-list-item>

            <v-list-item>
              <v-item-group>
                <v-btn @click="execute">Execute</v-btn>
                <v-btn @click="visible = false">Cancel</v-btn>
              </v-item-group>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>
    <v-container
      fluid
      class="overlay-container"
    >
      <v-col align="center">
        <v-toolbar
          class="overlay"
          color="primary"
        >
          <v-toolbar-title>{{ file.name }} - {{ file.description }}</v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              icon
              @click="machine = machines[0]._id; visible = true"
            >
              <v-icon>settings</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-container>
    <gcode-viewer
      :bed="viewer.bed"
      :gcode="file.raw"
      :position="viewer.position"
      :rotation="viewer.rotation"
      :scale="viewer.scale"
      :theme="theme"
    />
  </div>
</template>

<script>
//Imports
import api from '../api.js';
import colors from 'vuetify/lib/util/colors.js';
import gcodeViewer from 'vue-gcode-viewer';
import lightbox from '../components/lightbox.vue';
import {customization} from '../../../config.js';

export default {
  components: {
    'gcode-viewer': gcodeViewer,
    lightbox
  },
  data: () => ({
    machines: [],
    machine: null,
    file: {
      name: null,
      description: null,
      raw: null
    },
    visible: false,
    viewer: {
      bed: {
        X: 20,
        Y: 20
      },
      position: {
        X: 10,
        Y: 0,
        Z: -10
      },
      rotation: {
        X: -90,
        Y: 0,
        Z: 180
      },
      scale: {
        X: 0.1,
        Y: 0.1,
        Z: 0.1
      }
    }
  }),
  created: function ()
  {
    //Get machines
    api.machines.all().then(machines =>
    {
      this.machines = machines;
    });

    //Get file
    api.files.get(this.$route.params.id).then(file => this.file = file);
  },
  methods: {
    execute: function ()
    {
      api.machines.execute(this.machine, this.$route.params.id);
    }
  },
  computed: {
    theme: function ()
    {
      return this.$vuetify.theme.dark ? customization.viewer.dark : customization.viewer.light;
    }
  },
  watch: {
    machine: function ()
    {
      const machine = this.machines.find(machine => machine._id == this.machine);
      this.viewer.bed.X = machine.length;
      this.viewer.bed.Y = machine.width;
      this.viewer.position.X = machine.length / 2;
      this.viewer.position.Z = -machine.width / 2;
    }
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}

.overlay-container {
  position: fixed;
  z-index: 1;
}

.overlay {
  width: fit-content;
}
</style>