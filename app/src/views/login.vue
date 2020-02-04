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
                filled
                single-line
                :rules="[rules.required, rules.username]"
                label="Username"
                prepend-icon="account_circle"
                v-if="initial"
                v-model="username"
              ></v-text-field>
              <v-text-field
                filled
                single-line
                :append-icon="password.visible ? 'visibility_off' : 'visibility'"
                :rules="[rules.required, rules.password]"
                :type="password.visible ? 'text' : 'password'"
                @click:append="password.visible = !password.visible"
                label="Password"
                prepend-icon="lock"
                v-if="initial"
                v-model="password.value"
              ></v-text-field>
              <v-text-field
                filled
                single-line
                :rules="[rules.required, rules.otp]"
                label="MFA Code"
                prepend-icon="vpn_key"
                type="number"
                v-if="!initial"
                v-model.number="otp"
              ></v-text-field>
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
          Invalid username, password, or MFA code!
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
    initial: true,
    username: null,
    password: {
      value: null,
      visible: false
    },
    otp: null,
    rules: {
      required: value => value != null || 'Required',
      username: value => new RegExp(filters.name).test(value) || 'Invalid username',
      password: value => new RegExp(filters.password).test(value) || 'Invalid password',
      otp: value => new RegExp(filters.otp).test(value) || 'Invalid code'
    },
    prechecks: false,
    invalid: false
  }),
  methods: {
    login: function ()
    {
      //Initial phase of MFA (Or only stage if disabled)
      if (this.initial)
      {
        api.sessions.login(this.username, this.password.value).then(res =>
        {
          if (res.valid && !res.mfa)
          {
            this.$router.push('/files');
          }
          else if (res.valid)
          {
            this.initial = false;
          }
          else
          {
            this.invalid = true;
          }
        });
      }
      else
      {
        api.sessions.mfa(this.otp).then(valid =>
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
  }
};
</script>

<style scoped>
#container {
  padding: 15px;
}
</style>