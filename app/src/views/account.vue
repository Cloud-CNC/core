<template>
  <v-container
    align-center
    fluid
    fill-height
  >
    <v-col cols="12">
      <v-row justify="center">
        <v-card width="500">
          <v-card-title class="font-weight-light text-center">
            Edit your account
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-list>
                <v-list-item>
                  <v-text-field
                    ref="username"
                    v-model="account.username"
                    counter="30"
                    label="Username"
                    :rules="[rules.required, rules.username]"
                    @blur="update('username')"
                  />
                </v-list-item>

                <v-list-item>
                  <v-text-field
                    ref="password"
                    v-model="account.password"
                    counter="256"
                    label="Password"
                    type="password"
                    :rules="[rules.required, rules.password]"
                    @blur="update('password')"
                  />
                </v-list-item>

                <v-list-item>
                  <v-select
                    ref="role"
                    v-model="account.role"
                    :items="account.roles"
                    label="Role"
                    @blur="update('role')"
                  />
                </v-list-item>
              </v-list>
            </v-form>
          </v-card-text>
        </v-card>
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
    account: {
      roles: ['Admin', 'User'],
      role: null,
      username: null,
      password: null
    },
    rules: {
      required: value => value != null || 'Required',
      username: value => new RegExp(filters.name).test(value) || 'Invalid username',
      password: value => new RegExp(filters.password).test(value) || 'Invalid password'
    }
  }),
  created: function ()
  {
    //Get account
    api.accounts.get().then(account =>
    {
      this.account.username = account.username;
      this.account.role = account.role.charAt(0).toUpperCase() + account.role.substring(1);
    });
  },
  methods: {
    //Update account
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid)
      {
        //Update backend
        if (property == 'role')
        {
          const role = this.account.role.charAt(0).toLowerCase() + this.account.role.substring(1);
          api.accounts.update({[property]: role});
        }
        else
        {
          api.accounts.update({[property]: this.account[property]});
        }
      }
    }
  }
};
</script>

<style scoped>
</style>