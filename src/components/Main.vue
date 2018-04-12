<template>
  <div>

    <div class="header">
      <div class="container">
        <p>Header</p>
      </div>
    </div>


    <div class="container">

      <br><br>

      <div class="columns">

        <div class="column is-3">

          <h2 class="subtitle is-size-4">Filters</h2>

          <input class="input" type="text" name="" value="">

          <br><br>

          <p class="subtitle is-size-5">Orders</p>
          <ul>
            <li>Order #
              <multi-select
                           :options="orders"
                           :selected-options="fpOrderIDs"
                           placeholder="select order #"
                           @select="onSelectOrders">
              </multi-select>
            </li><br>
            <li>Date Range</li>
            <!-- <li>Order Status</li> -->
            <li>Job Name</li>
            <li>PO #</li>
          </ul>
          <br>

          <p class="subtitle is-size-5">Quotes</p>
          <ul>
            <li>Quote #</li>
            <li>Date Range</li>
            <li>Quote Status</li>
            <li>Job Name</li>
          </ul>
          <br>

          <p class="subtitle is-size-5">My Lists</p>
          <ul>
            <li>List Name
              <multi-select
                           :options="lists"
                           :selected-options="fpListIDs"
                           placeholder="select list"
                           @select="onSelectLists">
              </multi-select>
            </li><br>
            <li>
              <label class="checkbox">
                <input type="checkbox" v-model="fpListsShared">
                  &nbsp; Shared
              </label>
            </li>
            <!-- <li>Favorite</li> -->
            <!-- <li>Job Name</li> -->
          </ul>
          <br>

          <p class="subtitle is-size-5">Job Board</p>
          <ul>
            <li>Account</li>
            <!-- <li>Job Account</li>
            <li>Contract</li>
            <li>Store</li> -->
          </ul>
          <br>

          <p class="subtitle is-size-5">Category</p>
          <ul>
            <li>Category 1</li>
            <li>Category 2</li>
            <li>Category 3</li>
          </ul>
          <br>

          <p class="subtitle is-size-5">Brand</p>
          <ul>
            <li>Brand 1</li>
            <li>Brand 2</li>
            <li>Brand 3</li>
          </ul>
          <br>

        </div>

        <div class="column">

          <h2 class="subtitle is-size-4">Results</h2>


           <div class="columns is-multiline">
             <div class="column is-one-third-tablet is-one-quarter-desktop is-one-fifth-widescreen product-results-list"
                v-for="(item) in filteredProducts"
                v-bind:key="item.code"
             >
               <div class="product-list-item">
                 <div class="product-list-item-content">
                   <div class="is-horizontal-center">
                     <figure class="image is-128x128">
                       <img v-bind:src="item.image" alt="">
                     </figure>
                   </div>
                   <br>
                   <p class="has-text-weight-bold product-list-item-title">{{item.name}}</p>
                   <p class="is-size-7">{{item.code}}</p>
                 </div>

               </div>
             </div>
           </div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
import _ from 'lodash'
import { MultiSelect } from 'vue-search-select'
import listData from '../data/lists.json'
import orderData from '../data/orders.json'
import productData from '../data/products.json'
import quoteData from '../data/quotes.json'

export default {
  name: 'Main',
  data () {
    return {
      lists: listData.lists.tree,
      orders: orderData.orders,
      products: productData.products,
      quotes: quoteData.quotes,

      fpListsShared: false,
      fpOrderIDs: [],
      fpListIDs: []
    }
  },
  computed: {
    filteredProducts: function () {

      var fp = this.products
      // var lists = this.lists

      /* if (this.fpListsShared) {
        fp = _.filter(fp, function (o) { return o.lists['is-shared'] })
      } */
      if (this.fpListsShared) {
        let func = this.prodIsShared
        fp = _.filter(fp, function (o) {
          // console.log(func(o.code))
          return func(o.code)
        })
      }

      if (this.fpOrderIDs.length) {
        let func = this.prodIsInOrderFilter
        fp = _.filter(fp, function (o) {
          return func(o.code)
        })
        /*
        var idArray = []
        _.forIn(this.fpOrderIDs, function (o) {
          idArray.push(o['order-number'])
        })
        // console.log(idArray)
        fp = _.filter(fp, function (o) {
          var productContainsASelectedOrderID = false
          _.forIn(o.orders, function (o) {
            // console.log(o['order-number'])
            // console.log(_.includes(idArray, o['order-number']))
            if (_.includes(idArray, o['order-number'])) {
              productContainsASelectedOrderID = true
            }
          })
          return productContainsASelectedOrderID
        })
        */
      }

      return fp
    }
  },
  methods: {
    prodIsInOrderFilter: function (prodID) {
      var bool = false
      _.forEach(this.fpOrderIDs, function (order) {
        if (_.includes(_.map(order['products-ordered'], 'code'), prodID)) {
          // console.log(prodID + ': ' + _.includes(_.map(order['products-ordered'], 'code'), prodID))
          bool = true
        }
      })
      return bool
    },
    prodIsShared: function (prodID) {
      // console.log('prodIsShared: ' + prodID)
      var listContainsAProductID = false
      // console.log(prodID)
      // console.log('lp', JSON.stringify(lists[0]), lists[0].products)
      _.forEach(this.lists, function (list) {
        // console.log(_.includes(_.map(list.products, 'code'), o.code))
        if (list['is-shared']) {
          if (_.includes(_.map(list.products, 'code'), prodID)) {
            listContainsAProductID = true
          }
        }
      })
      // console.log('returning ' + listContainsAProductID)
      console.log('prodIsShared: ' + prodID + ' returning ' + listContainsAProductID)
      return listContainsAProductID
    },
    onSelectLists (items, lastSelectItem) {
      this.fpListIDs = items
      // this.lastSelectedOrderID = lastSelectItem
    },
    onSelectOrders (items, lastSelectItem) {
      this.fpOrderIDs = items
      // this.lastSelectedOrderID = lastSelectItem
    }
  },
  components: {
    MultiSelect
  },
  mounted: function () {
    console.log('Main.vue, mounted: Build Filters...')

    // modify orders object
    for (var order in this.orders) {
      this.orders[order].value = this.orders[order]['order-number']
      this.orders[order].text = this.orders[order]['order-number']
    }

    // modify lists object
    for (var list in this.lists) {
      this.lists[list].value = this.lists[list]['name']
      this.lists[list].text = this.lists[list]['name']
    }

    /*
    // for every product
      // iterate through orders and
        // see if the code exists in any of the products-ordered children
          // if it does, add the order data to it
    */






    /*
    // for every list item in lists...
      // recreate list in dropdown
    // for every list item in accounts...
      // recreate list in dropdown

    // iterate through every product in json

    // for every product...
      // add an item to the product array
      // check details.brand, add/skip
      // check details.category, add/skip
      // for every order in orders...
        // check order-number, add/skip
        // check purchase-order-number, add/skip
        // check job name, add/skip
        // check delivery-info.delivery-location, add/skip
        // check job-info.account, add/skip
      // for every quote in quotes...
        // check quote-number, add/skip
        // check job name, add/skip
        // check job-info.account, add/skip
    */
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/functions"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/initial-variables"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/derived-variables"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/utilities/mixins"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/components/card"
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/layout/columns"
  .header
    background: $color-brand

  .product-list-item
    @extend .card
    line-height: 1.25
    color: #000000
  .product-list-item-content
    @extend .card-content
    padding: 12px
  .product-results-list
    display: flex
  .is-horizontal-center
    justify-content: center
    text-align: -webkit-center
  .product-list-item-title
    overflow: hidden
    text-overflow: ellipsis
    display: -webkit-box
    line-height: 16px
    max-height: 32px
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical

</style>
