<template>
  <v-container
    align-center
    fluid
    fill-height
  >
    <v-col cols="12">
      <v-row justify="center">
        <v-card>
          <v-card-title class="display-4">
            404
          </v-card-title>
          <v-card-text class="headline">
            That's an error
          </v-card-text>
          <v-card-actions>
            <v-btn to="/files">
              Get me out of here
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
export default {};
</script>

<style scoped>
#container {
  padding: 15px;
}
</style>