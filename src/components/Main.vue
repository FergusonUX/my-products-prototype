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

          <h2 class="subtitle is-size-3">Filters</h2>

          <input class="input" type="text" name="" value="" v-model="fpSearchTerm" placeholder="search product name">
          <br><br>

          <p class="title is-size-5">Quotes &amp; Orders</p>
          <ul>
            <li>Order #
              <multi-select
                           :options="orders"
                           :selected-options="fpOrderIDs"
                           placeholder="select order #"
                           @select="onSelectOrderID">
              </multi-select>
            </li><br>
            <li>Quote #
              <multi-select
                           :options="quotes"
                           :selected-options="fpQuoteIDs"
                           placeholder="select quote #"
                           @select="onSelectQuoteID">
              </multi-select>
            </li><br>
            <li>Job Name
              <multi-select
                           :options="jobNames"
                           :selected-options="fpOrderJobNames"
                           placeholder="select job"
                           @select="onSelectOrderJob">
              </multi-select>
            </li><br>
            <li>PO #
              <multi-select
                           :options="poNumbers"
                           :selected-options="fpOrderPONumbers"
                           placeholder="select PO #"
                           @select="onSelectOrderPO">
              </multi-select>
            </li><br>
            <!-- <li>Start Date <br>
              <flat-pickr class="input"
                          v-model="fpOrderStartDate"
                          :config="flatPickrConfig"
                          @on-change="onSelectOrderStartDate"
              >
              <br>{{fpOrderStartDate}}
              </flat-pickr>
            </li><br>
            <li>End Date <br>
              <flat-pickr class="input"
                          v-model="fpOrderEndDate"
                          :config="flatPickrConfig"
                          @on-change="onSelectOrderEndDate"
              >
              </flat-pickr>
              <br>{{fpOrderEndDate}}
            </li><br> -->

            <!-- <li>Order Status</li> -->


          </ul>
          <hr>

          <p class="title is-size-5">My Lists</p>
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
          <hr>

          <p class="title is-size-5">Job Board</p>
          <ul>
            <li>Account</li>
            <!-- <li>Job Account</li>
            <li>Contract</li>
            <li>Store</li> -->
          </ul>
          <hr>

          <p class="title is-size-5">Category</p>
          <ul>
            <li>Category 1</li>
            <li>Category 2</li>
            <li>Category 3</li>
          </ul>
          <hr>

          <p class="title is-size-5">Brand</p>
          <ul>
            <li>Brand 1</li>
            <li>Brand 2</li>
            <li>Brand 3</li>
          </ul>
          <br>

        </div>

        <div class="column">

          <h2 class="title is-size-3">My Products</h2>


           <div class="columns is-multiline">
             <div class="column is-one-third-tablet is-one-quarter-desktop is-one-fifth-widescreen product-results-list"
                v-for="(item) in filteredProducts"
                v-bind:key="item.code"
             >
               <div class="product-list-item">
                 <div class="product-list-item-content">
                   <div class="is-horizontal-center">
                     <figure class="image is-128x128" style="overflow:hidden;">
                       <img class="img" v-bind:src="item.image" alt="">
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
import moment from 'moment'
import { MultiSelect } from 'vue-search-select'
import listData from '../data/lists.json'
import orderData from '../data/orders.json'
import productData from '../data/products.json'
import quoteData from '../data/quotes.json'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  name: 'Main',
  data () {
    return {
      lists: listData.lists.tree,
      orders: orderData.orders,
      products: productData.products,
      quotes: quoteData.quotes,

      jobNames: [],
      fpOrderJobNames: [],

      poNumbers: [],
      fpOrderPONumbers: [],

      fpSearchTerm: '',

      fpOrderIDs: [],
      fpQuoteIDs: [],
      fpListIDs: [],

      fpListsShared: false,

      fpOrderStartDate: null,
      fpOrderEndDate: null,

      flatPickrConfig: {
        dateFormat: 'm-d-Y'
      }
    }
  },
  computed: {
    filteredProducts: function () {

      var fp = this.products

      if (this.fpSearchTerm) {
        let searchTerm = this.fpSearchTerm
        fp = _.filter(fp, function (product) {
          return _.includes(product.name.toUpperCase(), searchTerm.toUpperCase())
        })
      }

      if (this.fpListsShared) {
        let func = this.prodIsShared
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpOrderIDs.length) {
        let func = this.prodIsInOrderIDFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpQuoteIDs.length) {
        let func = this.prodIsInQuoteIDFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpOrderJobNames.length) {
        let func = this.prodIsInOrderJobFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpOrderPONumbers.length) {
        let func = this.prodIsInOrderPOFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpOrderStartDate) {
        let func = this.prodIsInOrderAfterStartDate
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }
      if (this.fpOrderEndDate) {
        let func = this.prodIsInOrderBeforeEndDate
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      return fp
    }
  },
  methods: {
    prodIsInOrderAfterStartDate: function (prodID) {
      var bool = true
      console.log('prodIsInOrderAfterStartDate - checking against date value: ' + this.fpOrderStartDate)
      let dateArr = this.fpOrderStartDate.split('-')
      let dateVal = moment(dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0])
      console.log('setting this.fpOrderStartDate: ' + dateVal)
      return bool
    },
    prodIsInOrderBeforeEndDate: function (prodID) {
      var bool = true
      console.log('prodIsInOrderBeforeEndDate - checking against date value: ' + this.fpOrderEndDate)
      let dateArr = this.fpOrderEndDate.split('-')
      let dateVal = moment(dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0])
      console.log('setting this.fpOrderEndDate: ' + dateVal)
      return bool
    },
    prodIsInOrderIDFilter: function (prodID) {
      var bool = false
      _.forEach(this.fpOrderIDs, function (order) {
        if (_.includes(_.map(order['products-ordered'], 'code'), prodID)) {
          // console.log(prodID + ': ' + _.includes(_.map(order['products-ordered'], 'code'), prodID))
          bool = true
        }
      })
      return bool
    },
    prodIsInQuoteIDFilter: function (prodID) {
      var bool = false
      _.forEach(this.fpQuoteIDs, function (order) {
        if (_.includes(_.map(order['products-quoted'], 'code'), prodID)) {
          // console.log(prodID + ': ' + _.includes(_.map(order['products-ordered'], 'code'), prodID))
          bool = true
        }
      })
      return bool
    },
    prodIsInOrderJobFilter: function (prodID) {
      var bool = false
      var ordersThatIncludeFilteredJob = []
      var jobNames = this.fpOrderJobNames
      _.forEach(this.orders, function (order) {
        // console.log(order['order-number'] + ': ' + _.includes(_.map(jobNames, 'value'), order['job-name']))
        if (_.includes(_.map(jobNames, 'value'), order['job-name'])) {
          ordersThatIncludeFilteredJob.push(order)
        }
      })
      // console.log(ordersThatIncludeFilteredJob.length)
      _.forEach(ordersThatIncludeFilteredJob, function (order) {
        // console.log('order[\'products-ordered\']: ' + order['products-ordered'])
        // loop through an array of orders that include one of the selected job
        // and filter products no in the order
        if (_.includes(_.map(order['products-ordered'], 'code'), prodID)) {
          // console.log(prodID + ': ' + _.includes(_.map(order['products-ordered'], 'code'), prodID))
          bool = true
        }
      })
      return bool
    },
    prodIsInOrderPOFilter: function (prodID) {
      var bool = false
      var ordersThatIncludeFilteredPO = []
      var poNumbers = this.fpOrderPONumbers
      _.forEach(this.orders, function (order) {
        // console.log(order['order-number'] + ': ' + _.includes(_.map(jobNames, 'value'), order['job-name']))
        if (_.includes(_.map(poNumbers, 'value'), order['purchase-order-number'])) {
          ordersThatIncludeFilteredPO.push(order)
        }
      })
      // console.log(ordersThatIncludeFilteredJob.length)
      _.forEach(ordersThatIncludeFilteredPO, function (order) {
        // console.log('order[\'products-ordered\']: ' + order['products-ordered'])
        // loop through an array of orders that include one of the selected job
        // and filter products no in the order
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
      // console.log('prodIsShared: ' + prodID + ' returning ' + listContainsAProductID)
      return listContainsAProductID
    },
    onSelectLists (items, lastSelectItem) {
      this.fpListIDs = items
    },
    onSelectOrderID (items, lastSelectItem) {
      this.fpOrderIDs = items
    },
    onSelectQuoteID (items, lastSelectItem) {
      this.fpQuoteIDs = items
    },
    onSelectOrderJob (items, lastSelectItem) {
      this.fpOrderJobNames = items
      // console.log('fpOrderJobNames: ' + JSON.stringify(this.fpOrderJobNames))
      // this.lastSelectedOrderID = lastSelectItem
    },
    onSelectOrderPO (items, lastSelectItem) {
      this.fpOrderPONumbers = items
    },
    onSelectOrderStartDate (selectedDates, dateStr, instance) {
      // console.log('Date change hook was called', dateStr)
      /* if (dateStr) {
        let dateArr = dateStr.split('-')
        this.fpOrderStartDate = moment(dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0])
        // console.log('setting this.fpOrderStartDate: ' + this.fpOrderStartDateVal)
      } */
    },
    onSelectOrderEndDate (selectedDates, dateStr, instance) {
      /* if (dateStr) {
        let dateArr = dateStr.split('-')
        this.fpOrderEndDate = moment(dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0])
        // console.log('setting this.fpOrderStartDate: ' + this.fpOrderEndDateVal)
      } */
    }
  },
  components: {
    MultiSelect,
    FlatPickr
  },
  mounted: function () {
    console.log('Main.vue, mounted: Build Filters...')

    // modify orders object
    for (let order in this.orders) {
      this.orders[order].value = this.orders[order]['order-number']
      this.orders[order].text = this.orders[order]['order-number']
    }

    // modify quotes object
    for (let quote in this.quotes) {
      this.quotes[quote].value = this.quotes[quote]['quote-number']
      this.quotes[quote].text = this.quotes[quote]['quote-number']
    }

    // modify lists object
    for (let list in this.lists) {
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
      // for every order
        // add any new job names to the jobNames array
    */
    for (let order in this.orders) {
      // console.log(_.indexOf(this.jobNames, this.orders[order]['job-name']))
      if (this.orders[order]['job-name'] && _.indexOf(this.jobNames, this.orders[order]['job-name']) === -1) {
        // console.log('yeah! ' + this.orders[order]['job-name'])
        this.jobNames.push({ text: this.orders[order]['job-name'], value: this.orders[order]['job-name'] })
      }

      if (this.orders[order]['purchase-order-number'] && _.indexOf(this.poNumbers, this.orders[order]['purchase-order-number']) === -1) {
        this.poNumbers.push({ text: this.orders[order]['purchase-order-number'], value: this.orders[order]['purchase-order-number'] })
      }
    }



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
  @import "../../node_modules/@ferguson-enterprises/fds-css/sass/components/card"

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
  .img
    position: absolute
    top: 50%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    max-width: 100%
    max-height: 100%
</style>
