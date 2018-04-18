<template>
  <div>
      <div>

        <nav class="level">
          <div class="level-left" @click="changeProduct('previous')">
            Previous product
          </div>
          <div class="level-right" @click="changeProduct('next')">
            Next product
          </div>
        </nav>

      </div>

  </div>
</template>

<script>

export default {
  props: [],
  data () {
    return {

    }
  },
  filters: {

  },
  computed: {

  },
  methods: {
    changeProduct: function (direction) {
      console.log('change', direction)
      this.$emit('change')
    }
  },
  components: {

  },
  mounted: function () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
</style>
