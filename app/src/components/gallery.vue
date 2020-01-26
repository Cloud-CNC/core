<template>
  <div>
    <v-container cols="12">
      <v-row justify="space-around">
        <v-card
          elevation-6
          class="entity"
          v-for="entity in entities"
          :key="entity._id"
          max-width="500"
        >
          <v-card-title primary-title class="font-weight-light">
            <slot
              name="name"
              :entity="entity"
            >{{entity.name}}</slot>
          </v-card-title>
          <v-card-text class="font-weight-light">
            <slot
              name="description"
              :entity="entity"
            >{{entity.description}}</slot>
          </v-card-text>
          <v-card-actions class="font-weight-light">
            <slot
              name="actions"
              :entity="entity"
            ></slot>
          </v-card-actions>
        </v-card>
        <v-card v-if="entities.length == 0">
          <v-card-title primary-title class="font-weight-light" color="red">
            <slot name="empty">None available!</slot>
          </v-card-title>
        </v-card>
    </v-container>
    <v-footer
      fixed
      color="transparent"
    >
      <v-spacer>
        <v-btn
          icon
          x-large
          color="secondary"
          @click="add()"
          id="plus"
        >
          <v-icon id="add">add</v-icon>
        </v-btn>
      </v-spacer>
    </v-footer>
  </div>
</template>

<script>
export default {
  props: {
    entities: Array
  },
  methods: {
    add: function ()
    {
      this.$emit('add');
    }
  }
};
</script>

<style>
#plus {
  float: right;
}
.entity {
  margin: 10px;
}
</style>