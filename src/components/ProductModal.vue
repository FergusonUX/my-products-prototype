<template>
  <div>
      <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
              <p class="modal-card-title">{{product2}}</p>
          </header>
          <section class="modal-card-body">

          </section>
          <footer class="modal-card-foot">
              <button class="button" type="button" @click="$parent.close()">Close</button>
          </footer>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Main',
  props: {
    email: '',
    password: '',
    testMessage: '',
    product: { name: 'Tony' }
  },
  data () {
    return {
      product2: this.product
    }
  },
  filters: {

  },
  computed: {

  },
  methods: {

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
