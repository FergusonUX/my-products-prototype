<template>
  <div>
      <div class="product-modal" style="width: auto">
          <header class="product-modal-head">
            <div class="columns">
              <div class="column is-one-fifth" style="min-height:175px; max-height:175px;">
                <img class="image" v-bind:src="selectedProd.image" alt="">
              </div>
              <div class="column">
                <!-- <p class="is-pulled-right">
                  <span class="icon has-text-grey">
                    <i class="fas fa-print"></i>
                  </span>
                </p> -->
                <button class="button is-pulled-right" type="button" @click="$parent.close()">Close</button>
                <p class="has-text-weight-bold product-list-item-title is-size-5">{{selectedProd.name}}</p>
                <p class="">{{selectedProd.code}}</p>
                <p class="is-size-7">{{selectedProd.brand}}</p>
                <p class="is-size-7"><a class="inactive-link" href="#">View full product detail</a></p>
                <p v-if="getProductsByFamilyID(selectedProd.family).length" class="is-size-7">
                  <br>
                  This product is part of a family of {{getProductsByFamilyID(selectedProd.family).length}} products. <a href="#" class="inactive-link">View the entire family</a>
                </p>
                <br>


              </div>

            </div>

            <!-- <nav class="level">
              <div class="level-left" @click="prevProduct()">
                <a class="button is-primary" :disabled="!canPrev">Previous</a>
              </div>
              <div class="level-left" @click="nextProduct()">
                <a class="button is-primary" :disabled="!canNext">Next</a>
              </div>
            </nav> -->
          </header>


          <section class="product-modal-body">
            <tabs animation="slide" :only-fade="false" ref="tabs">

              <tab-pane label="Details">
                <div class="">
                  Product description and specifications will go here.
                </div>
              </tab-pane>

              <tab-pane label="Availability">
                <div class="">
                  <p><b>In-store Availability</b></p>
                  <p>XX Available for pick-up in Newport News, VA</p>
                  <p><a class="inactive-link" href="#">Check other stores</a></p>
                  <br>
                  <p><b>Shipping Information</b></p>
                  <p>Available for immediate shipment</p>
                  <p><a class="inactive-link" href="#">See what's available</a></p>
                </div>
              </tab-pane>

              <tab-pane label="Documents">
                <div class="">
                  <p class="title is-5">Documents</p>
                  <ul>
                    <li><a class="inactive-link" href="#">Specification</a></li>
                    <li><a class="inactive-link" href="#">Parts</a></li>
                    <li><a class="inactive-link" href="#">Installation</a></li>
                    <li><a class="inactive-link" href="#">Warranty</a></li>
                  </ul>
                </div>
              </tab-pane>

              <tab-pane :label="'My Orders (' + getOrdersByProductID(selectedProd.code).length + ')'">
                <p class="title is-5">Order History for {{selectedProd.code}}</p>
                <div v-if="getOrdersByProductID(selectedProd.code).length">
                  <table class="table is-fullwidth is-narrow is-striped is-size-6">
                    <thead>
                      <tr>
                        <th><abbr title="Order Number">Order #</abbr></th>
                        <th>Date</th>
                        <th>PO</th>
                        <th>Job</th>
                        <th>Ordered By</th>
                        <th>Account</th>
                        <th>Unit</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                          v-for="order in getOrdersByProductID(selectedProd.code)"
                          v-bind:key="order['order-number']"
                      >
                        <th>{{order['order-number']}}</th>
                        <td>{{formatDate(order['date-ordered'], 'M/D/Y')}}</td>
                        <td>{{order['purchase-order-number']}}</td>
                        <td>{{order['job-name']}}</td>
                        <td>{{order['ordered-by']}}</td>
                        <td>{{order['account']}}</td>
                        <td>{{getProductUnitPriceFromOrder(order['order-number'], selectedProd.code)}}</td>
                        <td><a class="inactive-link" href="#">view order</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <p>There are no orders associated with this product.</p>
                </div>

              </tab-pane>


              <tab-pane :label="'My Quotes (' + getQuotesByProductID(selectedProd.code).length + ')'">
                <p class="title is-5">Quotes including {{selectedProd.code}}</p>
                <div v-if="getQuotesByProductID(selectedProd.code).length">
                  <table class="table is-fullwidth is-narrow is-striped is-size-6">
                    <thead>
                      <tr>
                        <th><abbr title="Quote Number">Quote #</abbr></th>
                        <th>Date Created</th>
                        <th>Date Expires</th>
                        <th>Job</th>
                        <th>Account</th>
                        <th>Unit</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                          v-for="quote in getQuotesByProductID(selectedProd.code)"
                          v-bind:key="quote['quote-number']"
                      >
                        <th>{{quote['quote-number']}}</th>
                        <td>{{formatDate(quote['date-created'], 'M/D/Y')}}</td>
                        <td>{{formatDate(quote['date-expiration'], 'M/D/Y')}}</td>
                        <td>{{quote['job-name']}}</td>
                        <td>{{quote['account']}}</td>
                        <td>{{getProductUnitPriceFromQuote(quote['quote-number'], selectedProd.code)}}</td>
                        <td><a class="inactive-link" href="#">view quote</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <p>There are no quotes associated with this product.</p>
                </div>

              </tab-pane>


              <tab-pane :label="'My Lists (' + getListsByProductID(selectedProd.code).length + ')'">
                <p class="title is-5">Lists including {{selectedProd.code}}</p>
                <div v-if="getListsByProductID(selectedProd.code).length">
                  <table class="table is-fullwidth is-narrow is-striped is-size-6">
                    <thead>
                      <tr>
                        <th>List Name</th>
                        <th>Shared</th>
                        <th>Product Quantity</th>
                        <th>Actions</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                          v-for="list in getListsByProductID(selectedProd.code)"
                          v-bind:key="list['name']"
                      >
                        <td>{{list['name']}}</td>
                        <td>
                          <span v-if="list['is-shared']" class="icon has-text-grey-light">
                            <i class="fas fa-user-plus"></i>
                          </span>
                        </td>
                        <td>

                          <div class="field has-addons">
                            <div class="control">
                              <a class="button is-small is-info"
                              @click="listQuantityDecrement(list['name'], selectedProd.code)"
                              >
                                -
                              </a>
                            </div>
                            <div class="control">
                              <input class="input is-small" type="text" name="" style="width: 50px;" :value="getProductQuantityFromList(list['name'], selectedProd.code)">
                            </div>
                            <div class="control">
                              <a class="button is-small is-info" @click="listQuantityIncrement(list['name'], selectedProd.code)">
                                +
                              </a>
                            </div>
                          </div>

                        </td>
                        <td><a class="button is-small is-info inactive-button">Add to Cart</a></td>
                        <td><a class="inactive-link" href="#">view list</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <p>There are no lists that include this product.</p>
                </div>

              </tab-pane>


            </tabs>
          </section>


          <footer class="product-modal-foot">

            <button class="button" type="button" href="#">
              <span class="icon has-text-grey">
                <i class="fas fa-print"></i>
              </span>
              &nbsp; Print
            </button>
            <div class="field is-grouped is-pulled-right">
              <div class="control">
                <input class="input" type="text" value="1" style="width:40px;">
              </div>
              <div class="control">
                <a class="button is-primary">
                  <span class="icon">
                    <i class="fas fa-shopping-cart"></i>
                  </span>
                  &nbsp; Add to Cart
                </a>
              </div>
            </div>
            <!-- <button class="button is-primary" type="button" name="button">Add to Cart</button> -->
              <!-- <button class="button" :disabled="!canPrev" @click="prevProduct()">Previous</button>
              <button class="button" :disabled="!canNext" @click="nextProduct()">Next</button> -->

          </footer>
      </div>
  </div>
</template>

<script>
import Tabs from '@/components/tabs/Tabs'
import TabPane from '@/components/tabs/TabPane'
import _ from 'lodash'
import moment from 'moment'

export default {
  props: [ 'eventBus', 'products', 'orders', 'quotes', 'lists', 'product' ],
  data () {
    return {
      tabs: [],
      selectedProd: this.product
    }
  },
  filters: {

  },
  computed: {
    canNext: function () {
      let canProgress = false
      let map = _.map(this.products, 'code')
      let prodIndex = _.indexOf(map, this.selectedProd.code)
      if (prodIndex < this.products.length - 1) {
        canProgress = true
      }
      return canProgress
    },
    canPrev: function () {
      let canProgress = false
      let map = _.map(this.products, 'code')
      let prodIndex = _.indexOf(map, this.selectedProd.code)
      if (prodIndex > 0) {
        canProgress = true
      }
      return canProgress
    }
  },
  methods: {
    prevProduct: function () {
      let map = _.map(this.products, 'code')
      // console.log('testFunc', map)
      let prodIndex = _.indexOf(map, this.selectedProd.code)
      // console.log('prevProduct', this.products, prodIndex)
      if (prodIndex > 0) {
        // console.log('Setting new product to ' + this.products[prodIndex - 1].name)
        this.selectedProd = this.products[prodIndex - 1]
      }
    },
    nextProduct: function () {
      let map = _.map(this.products, 'code')
      console.log('nextProduct', this.selectedProd.code)
      let prodIndex = _.indexOf(map, this.selectedProd.code)
      // console.log('prevProduct', this.products, prodIndex)
      if (prodIndex < this.products.length) {
        // console.log('Setting new product to ' + this.products[prodIndex + 1].name)
        this.selectedProd = this.products[prodIndex + 1]
      }
    },
    changeProduct: function (direction) {
      console.log('change', direction)
      this.$emit('change')
    },
    listQuantityIncrement: function (listName, prodID) {
      let map = _.map(this.lists, 'name')
      let index = _.indexOf(map, listName)
      let map2 = _.map(this.lists[index]['products'], 'code')
      let index2 = _.indexOf(map2, prodID)
      // console.log('listQuantityIncrement')
      this.lists[index]['products'][index2]['quantity']++
    },
    listQuantityDecrement: function (listName, prodID) {
      let map = _.map(this.lists, 'name')
      let index = _.indexOf(map, listName)
      let map2 = _.map(this.lists[index]['products'], 'code')
      let index2 = _.indexOf(map2, prodID)
      // console.log('listQuantityDecrement')
      this.lists[index]['products'][index2]['quantity']--
    },
    getOrdersByProductID: function (prodID) {
      let listOfOrders = []
      for (var order in this.orders) {
        if (_.indexOf(_.map(this.orders[order]['products-ordered'], 'code'), prodID) !== -1) {
          listOfOrders.push(this.orders[order])
        }
      }
      return listOfOrders
    },
    getQuotesByProductID: function (prodID) {
      let listOfQuotes = []
      for (var quote in this.quotes) {
        if (_.indexOf(_.map(this.quotes[quote]['products-quoted'], 'code'), prodID) !== -1) {
          listOfQuotes.push(this.quotes[quote])
        }
      }
      return listOfQuotes
    },
    getListsByProductID: function (prodID) {
      let listOfLists = []
      for (var list in this.lists) {
        if (_.indexOf(_.map(this.lists[list]['products'], 'code'), prodID) !== -1) {
          listOfLists.push(this.lists[list])
        }
      }
      return listOfLists
    },
    formatDate: function (value, format) {
      // console.log('value: ' + value)
      if (!format) {
        format = 'MMMM DD, YYYY'
      }
      // var dateObj = new Date(value)
      var retDate = moment.unix(value).format(format)
      return retDate
    },
    getProductUnitPriceFromOrder: function (orderID, prodID) {
      let map = _.map(this.orders, 'order-number')
      let index = _.indexOf(map, orderID)
      let map2 = _.map(this.orders[index]['products-ordered'], 'code')
      let index2 = _.indexOf(map2, prodID)
      // console.log(prodID, orderID, map, index, map2, index2)
      return this.orders[index]['products-ordered'][index2]['unit-price']
    },
    getProductUnitPriceFromQuote: function (quoteID, prodID) {
      let map = _.map(this.quotes, 'quote-number')
      let index = _.indexOf(map, quoteID)
      let map2 = _.map(this.quotes[index]['products-quoted'], 'code')
      let index2 = _.indexOf(map2, prodID)
      // console.log(prodID, orderID, map, index, map2, index2)
      return this.quotes[index]['products-quoted'][index2]['unit-price']
    },
    getProductQuantityFromList: function (listName, prodID) {
      let map = _.map(this.lists, 'name')
      let index = _.indexOf(map, listName)
      let map2 = _.map(this.lists[index]['products'], 'code')
      let index2 = _.indexOf(map2, prodID)
      // console.log(prodID, orderID, map, index, map2, index2)
      return this.lists[index]['products'][index2]['quantity']
    },
    getProductsByFamilyID: function (familyID) {
      // console.log(familyID, this.products.length)
      return _.filter(this.products, { 'family': familyID })
    }
  },
  components: {
    Tabs,
    TabPane
  },
  mounted: function () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/functions"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/initial-variables"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/derived-variables"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/mixins"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/components/modal"

  .product-modal
    @extend .modal-card
    color: black
  .product-modal-head
    @extend .modal-card-head
    // background: white !important
    border-bottom: none
  .product-modal-title
    @extend .modal-card-title
  .product-modal-body
    background: white
    @extend .modal-card-body
    min-height: 300px
  .product-modal-foot
    @extend .modal-card-foot

  .product-modal-head,
  .product-modal-foot
    align-items: initial
    background-color: $modal-card-head-background-color
    display: block
    flex-shrink: 0
    justify-content: flex-start
    padding: $modal-card-head-padding
    position: relative
  .inactive-link
    color: purple
  .inactive-button
    // background-color: purple
</style>
