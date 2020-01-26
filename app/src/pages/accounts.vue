<template>
  <div>
    <v-dialog
      v-model="dialog.visible"
      width="500"
    >
      <v-card>
        <v-card-title
          primary-title
          class="font-weight-light primary headline"
        >
          {{ dialog.create ? 'Create a new account' : 'Edit ' + dialog.username }}
        </v-card-title>
        <v-card-text>
          <v-form v-model="prechecks">
            <v-list>
              <v-list-item>
                <v-text-field
                  ref="firstName"
                  v-model="dialog.firstName"
                  counter="30"
                  label="First Name"
                  :rules="[rules.required, rules.firstName]"
                  @blur="update('firstName')"
                />
              </v-list-item>

              <v-list-item>
                <v-text-field
                  ref="lastName"
                  v-model="dialog.lastName"
                  counter="30"
                  label="Last Name"
                  :rules="[rules.required, rules.lastName]"
                  @blur="update('lastName')"
                />
              </v-list-item>

              <v-list-item>
                <v-text-field
                  ref="username"
                  v-model="dialog.username"
                  counter="30"
                  label="Username"
                  :rules="[rules.required, rules.username]"
                  @blur="update('username')"
                />
              </v-list-item>

              <v-list-item>
                <v-text-field
                  ref="password"
                  v-model="dialog.password"
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
                  v-model="dialog.role"
                  :items="dialog.roles"
                  label="Role"
                  @blur="update('role')"
                />
              </v-list-item>
            </v-list>
          </v-form>
        </v-card-text>
        <v-card-actions>
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
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container
      align-start
      fluid
      fill-height
    >
      <v-col cols="12">
        <v-row justify="space-around">
          <v-card
            v-for="account in accounts"
            :key="account._id"
            elevation="6"
            max-width="400"
          >
            <v-card-title>{{ account.username }}</v-card-title>
            <v-card-text>
              <v-chip-group>
                <v-chip>
                  {{ account.role.charAt(0).toUpperCase() + account.role.substring(1) }}
                </v-chip>
              </v-chip-group>
              {{ account.firstName }} {{ account.lastName }}
            </v-card-text>
            <v-card-actions>
              <v-item-group>
                <v-btn @click="administrate(account)">
                  Administrate
                </v-btn>
                <v-btn @click="showDialog(account)">
                  Edit
                </v-btn>
                <v-btn
                  color="error"
                  @click="_delete(account)"
                >
                  Delete
                </v-btn>
              </v-item-group>
            </v-card-actions>
          </v-card>
          <v-card v-if="accounts.length == 0">
            <v-card-title class="font-weight-light">No accounts available</v-card-title>
          </v-card>
        </v-row>
      </v-col>
    </v-container>
    <v-footer
      fixed
      color="transparent"
    >
      <v-spacer />
      <v-btn
        icon
        x-large
        color="secondary"
        @click="showDialog()"
        id="create"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
//Imports
import api from '../api.js';
import {filters} from '../../../config.js';

export default {
  data: () => ({
    accounts: [],
    dialog: {
      _id: null,
      roles: ['Admin', 'User'],
      role: null,
      firstName: null,
      lastName: null,
      username: null,
      password: null,
      visible: false,
      create: false
    },
    prechecks: false,
    rules: {
      required: value => value != null || 'Required',
      firstName: value => new RegExp(filters.name).test(value) || 'Invalid first name',
      lastName: value => new RegExp(filters.name).test(value) || 'Invalid last name',
      username: value => new RegExp(filters.name).test(value) || 'Invalid username',
      password: value => new RegExp(filters.password).test(value) || 'Invalid password'
    }
  }),
  created: function ()
  {
    //Get accounts
    api.accounts.all().then(accounts => this.accounts = accounts);
  },
  methods: {
    //Show dialog
    showDialog: function (account)
    {
      //Configure dialog
      if (account == null)
      {
        this.dialog._id = null;
        this.dialog.firstName = null;
        this.dialog.lastName = null;
        this.dialog.username = null;
        this.dialog.password = null;
        this.dialog.role = 'User';
        this.dialog.create = true;
      }
      else
      {
        this.dialog._id = account._id;
        this.dialog.firstName = account.firstName;
        this.dialog.lastName = account.lastName;
        this.dialog.username = account.username;
        this.dialog.password = null;
        this.dialog.role = account.role.charAt(0).toUpperCase() + account.role.substring(1);
        this.dialog.create = false;
      }

      //Show dialog
      this.dialog.visible = true;
    },
    //Create account
    create: function ()
    {
      const role = this.dialog.role.charAt(0).toLowerCase() + this.dialog.role.substring(1);
      api.accounts.create(role, this.dialog.firstName, this.dialog.lastName, this.dialog.username, this.dialog.password).then(res =>
      {
        //Add to list
        this.accounts.push({_id: res._id, firstName: this.dialog.firstName, lastName: this.dialog.lastName, username: this.dialog.username, role});

        //Hide dialog
        this.dialog.visible = false;
      });
    },
    //TODO
    //Administrate account
    administrate: function (account)
    {
      //Set cookie

      //Go to files
    },
    //Update account
    update: function (property)
    {
      //Precheck
      if (this.$refs[property].valid && !this.dialog.create)
      {
        //Update front end
        const account = this.accounts.find(account => account._id == this.dialog._id);
        account[property] = this.dialog[property];

        //Update backend
        if (property == 'role')
        {
          const role = this.dialog.role.charAt(0).toLowerCase() + this.dialog.role.substring(1);
          api.accounts.update({[property]: role}, this.dialog._id);
        }
        else
        {
          api.accounts.update({[property]: this.dialog[property]}, this.dialog._id);
        }
      }
    },
    //Delete account
    _delete: function (account)
    {
      api.accounts.remove(account._id).then(() =>
      {
        //Get index
        const index = this.accounts.findIndex(item => item._id == account._id);

        //Delete account
        this.accounts.splice(index, 1);
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

.v-chip {
  margin: 4px 2px;
}
</style>