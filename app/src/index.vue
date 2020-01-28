<template>
  <v-app>
    <v-navigation-drawer
      app
      temporary
      color="secondary"
      v-model="menu"
    >
      <v-list-item
        nav
        two-line
      >
        <v-list-item-content>
          <v-list-item-title class="font-weight-light headline">Cloud CNC</v-list-item-title>
          <v-list-item-subtitle class="font-weight-bold subtitle">V{{ version }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>account_circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            to="/account"
          >Account</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>gavel</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            to="/admin"
          >Admin</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>folder</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            to="/files"
          >Files</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>remove_outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            to="/trash"
          >Trash</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>dock</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            to="/machines"
          >Machines</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>account_tree</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            to="/controllers"
          >Controllers</v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>exit_to_app</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-btn
            text
            class="font-weight-light"
            @click="logout()"
          >Logout</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
    >
      <v-app-bar-nav-icon
        @click="menu = !menu"
        v-if="$route.path != '/login'"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="display-1 font-weight-thin">{{ $route.name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="invertTheme()"
      >
        <v-icon>invert_colors</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-bottom-sheet v-model="visible">
      <v-sheet
        class="text-center"
        color="error"
        id="error"
      >
        <v-btn
          icon
          x-large
          @click="visible = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
        <h1 class="font-weight-light title">{{error.name}}</h1>
        <p
          class="font-weight-light"
          id="error-description"
        >{{error.description}}</p>
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
//Imports
import api from './api.js';
import pkg from '../../package.json';

export default {
  created: function ()
  {
    let dark = true;

    //No cookie, use OS preference
    if (document.cookie.length == 0 || !new RegExp(/(?<=dark=)(true|false)/).test(document.cookie))
    {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    //Cookie
    else
    {
      dark = new RegExp(/(?<=dark=)true/).test(document.cookie);
    }
    this.$vuetify.theme.dark = dark;

    //Version information
    this.version = pkg.version;
  },
  data: () => ({
    error: {
      name: null,
      description: null
    },
    menu: false,
    version: null,
    visible: false
  }),
  methods: {
    invertTheme: function ()
    {
      //Get new theme
      const theme = !this.$vuetify.theme.dark;

      //Invert theme
      this.$vuetify.theme.dark = theme;

      //Set cookie
      document.cookie = 'dark=' + theme;
    },
    logout: function ()
    {
      api.sessions.logout().then(() =>
      {
        this.$router.push('/login');
      });
    }
  },
  watch: {
    error:
    {
      deep: true,
      handler()
      {
        this.visible = true;
      }
    }
  }
};
</script>

<style>
#error {
  padding: 12px;
}

#error-description {
  margin: 0;
}

.v-btn--active:hover::before,
.v-btn--active::before {
  opacity: 0 !important;
}

html {
  overflow-y: auto;
}
</style>