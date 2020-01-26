<template>
  <div>
    <lightbox v-model="lightbox.visible">
      <template v-slot:title>Execute {{ file.name }}</template>
      <template v-slot:content>
        <v-form>
          <v-list>
            <v-list-item>
              <v-select
                item-text="name"
                item-value="_id"
                :items="machines"
                v-model="lightbox.machine"
                label="Machine"
              ></v-select>
            </v-list-item>

            <v-list-item>
              <v-item-group>
                <v-btn @click="execute">Execute</v-btn>
                <v-btn @click="lightbox.visible = false">Cancel</v-btn>
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

          <v-spacer></v-spacer>

          <v-btn
            icon
            @click="lightbox.machine = machines[0]; lightbox.visible = true"
            color="secondary"
          >
            <v-icon>cloud_upload</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-container>
    <gcode-viewer
      :bed="viewer.bed"
      :gcode="file.raw"
      :position="viewer.position"
      :rotation="viewer.rotation"
      :scale="viewer.scale"
      :theme="$vuetify.theme.dark ? viewer.theme.dark : viewer.theme.light"
    />
  </div>
</template>

<script>
//Imports
import api from '../api.js';
import colors from 'vuetify/lib/util/colors.js';
import gcodeViewer from 'vue-gcode-viewer';
import lightbox from '../components/lightbox.vue';

export default {
  components: {
    'gcode-viewer': gcodeViewer,
    lightbox
  },
  data: () => ({
    machines: [],
    file: {
      name: null,
      description: null,
      raw: null
    },
    lightbox: {
      machine: null,
      visible: false
    },
    viewer: {
      bed: {
        X: 22.3,
        Y: 22.3
      },
      position: {
        X: 11.15,
        Y: 0,
        Z: -11.15
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
      },
      theme: {
        light: {
          extrusionColor: colors.blue.darken3,
          pathColor: colors.blue.lighten2,
          bedColor: colors.green.accent2,
          backgroundColor: colors.grey.lighten3
        },
        dark: {
          extrusionColor: colors.amber.darken2,
          pathColor: colors.amber.lighten2,
          bedColor: colors.blueGrey.darken3,
          backgroundColor: colors.blueGrey.darken4
        }
      }
    }
  }),
  created: function ()
  {
    //Get machines
    api.machines.all().then(machines => this.machines = machines);

    //Get file
    api.files.get(this.$route.params.id).then(file => this.file = file);
  },
  methods: {
    execute: function ()
    {
      api.machines.execute(this.lightbox.machine._id, this.$route.params.id);
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