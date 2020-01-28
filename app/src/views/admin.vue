<template>
  <div>
    <lightbox v-model="lightbox.visible">
      <template v-slot:title>
        {{lightbox.create ? 'Create a new account' : 'Edit ' + lightbox.username }}
      </template>

      <template v-slot:content>
        <v-form v-model="prechecks">
          <v-list>
            <v-list-item>
              <v-text-field
                ref="firstName"
                v-model="lightbox.firstName"
                counter="30"
                label="First Name"
                :rules="[rules.required, rules.firstName]"
                @blur="update('firstName')"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                ref="lastName"
                v-model="lightbox.lastName"
                counter="30"
                label="Last Name"
                :rules="[rules.required, rules.lastName]"
                @blur="update('lastName')"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                ref="username"
                v-model="lightbox.username"
                counter="30"
                label="Username"
                :rules="[rules.required, rules.username]"
                @blur="update('username')"
              />
            </v-list-item>

            <v-list-item>
              <v-text-field
                ref="password"
                v-model="lightbox.password"
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
                v-model="lightbox.role"
                :items="lightbox.roles"
                label="Role"
                @blur="update('role')"
              />
            </v-list-item>

            <v-list-item>
              <v-item-group>
                <v-btn
                  v-if="lightbox.create"
                  :disabled="!prechecks"
                  @click="create()"
                >
                  Create
                </v-btn>
                <v-btn @click="lightbox.visible = false">
                  {{ lightbox.create ? 'Cancel' : 'Close' }}
                </v-btn>
              </v-item-group>
            </v-list-item>
          </v-list>
        </v-form>
      </template>
    </lightbox>

    <gallery
      @add="showLightbox()"
      :entities="accounts"
    >
      <template v-slot:name="props">
        {{props.entity.username}}
      </template>

      <template v-slot:description="props">
        <v-chip-group>
          <v-chip>
            {{ props.entity.role.charAt(0).toUpperCase() + props.entity.role.substring(1) }}
          </v-chip>
        </v-chip-group>
        {{ props.entity.firstName }} {{ props.entity.lastName }}
      </template>

      <template v-slot:actions="props">
        <v-item-group>
          <v-btn @click="administrate(props.entity)">
            Administrate
          </v-btn>
          <v-btn @click="showLightbox(props.entity)">
            Edit
          </v-btn>
          <v-btn
            color="error"
            @click="remove(props.entity)"
          >
            Remove
          </v-btn>
        </v-item-group>
      </template>

      <template
        v-slot:empty
        class="font-weight-light"
      >
        No accounts available!
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
    accounts: [],
    lightbox: {
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
    //Show lightbox
    showLightbox: function (account)
    {
      //Configure lightbox
      if (account == null)
      {
        this.lightbox._id = null;
        this.lightbox.firstName = null;
        this.lightbox.lastName = null;
        this.lightbox.username = null;
        this.lightbox.password = null;
        this.lightbox.role = 'User';
        this.lightbox.create = true;
      }
      else
      {
        this.lightbox._id = account._id;
        this.lightbox.firstName = account.firstName;
        this.lightbox.lastName = account.lastName;
        this.lightbox.username = account.username;
        this.lightbox.password = null;
        this.lightbox.role = account.role.charAt(0).toUpperCase() + account.role.substring(1);
        this.lightbox.create = false;
      }

      //Show lightbox
      this.lightbox.visible = true;
    },
    //Create account
    create: function ()
    {
      const role = this.lightbox.role.charAt(0).toLowerCase() + this.lightbox.role.substring(1);
      api.accounts.create(role, this.lightbox.firstName, this.lightbox.lastName, this.lightbox.username, this.lightbox.password).then(res =>
      {
        //Add to list
        this.accounts.push({_id: res._id, firstName: this.lightbox.firstName, lastName: this.lightbox.lastName, username: this.lightbox.username, role});

        //Hide lightbox
        this.lightbox.visible = false;
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
      if (this.$refs[property].valid && !this.lightbox.create)
      {
        //Update front end
        const account = this.accounts.find(account => account._id == this.lightbox._id);
        account[property] = this.lightbox[property];

        //Update backend
        if (property == 'role')
        {
          const role = this.lightbox.role.charAt(0).toLowerCase() + this.lightbox.role.substring(1);
          api.accounts.update({[property]: role}, this.lightbox._id);
        }
        else
        {
          api.accounts.update({[property]: this.lightbox[property]}, this.lightbox._id);
        }
      }
    },
    //Remove account
    remove: function (account)
    {
      api.accounts.remove(account._id).then(() =>
      {
        //Get index
        const index = this.accounts.findIndex(item => item._id == account._id);

        //Remove account
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