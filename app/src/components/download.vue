<template>
  <a
    id="link"
    ref="link"
  ></a>
</template>

<script>
export default {
  props: {
    data: String,
    filename: String,
    id: String
  },
  created: function ()
  {
    this.$root.$on('download', id =>
    {
      if(id == this.id)
      {
        this.download();
      }
    });
  },
  methods: {
    download: function ()
    {
      //Create element
      const element = this.$refs.link;
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.data));
      element.setAttribute('download', this.filename);

      //Download
      element.click();
    }
  }
};
</script>

<style>
#link {
  display: none;
}
</style>