<template>
  <v-container
    align-center
    fluid
    fill-height
  >
    <v-col cols="12">
      <v-row justify="center">
        <v-card width="500">
          <v-card-title class="font-weight-light primary headline">
            Login
          </v-card-title>
          <v-spacer />
          <v-card-text id="container">
            <v-form v-model="prechecks">
              <v-text-field
                v-model="username"
                filled
                single-line
                prepend-icon="account_circle"
                :rules="[rules.required, rules.username]"
              ></v-text-field>
              <v-text-field
                v-model="password.value"
                filled
                single-line
                :append-icon="password.visible ? 'visibility_off' : 'visibility'"
                prepend-icon="lock"
                :rules="[rules.required, rules.password]"
                :type="password.visible ? 'text' : 'password'"
                @click:append="password.visible = !password.visible"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              :disabled="!prechecks"
              @click="login"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar
          v-model="invalid"
          class="font-weight-light title"
        >
          Invalid username or password!
          <v-btn
            icon
            color="accent"
            @click="invalid = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
//Imports
import api from '../api.js';
import {filters} from '../../../config.js';

export default {
  data: () => ({
    username: null,
    password: {
      value: null,
      visible: false
    },
    rules: {
      required: value => value != null || 'Required',
      username: value => new RegExp(filters.name).test(value) || 'Invalid username',
      password: value => new RegExp(filters.password).test(value) || 'Invalid password'
    },
    prechecks: false,
    invalid: false
  }),
  methods: {
    login: function ()
    {
      api.sessions.login(this.username, this.password.value).then(valid =>
      {
        if (valid)
        {
          this.$router.push('/files');
        }
        else
        {
          this.invalid = true;
        }
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