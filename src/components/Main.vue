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
          <br><br><br>

          <b-collapse class="panel" :open.sync="collapseSectionOneIsOpen" animation="fade">
            <div slot="trigger">
              <p class="title is-size-5">
                <span>Quotes &amp; Orders</span>
                <span class="is-size-4" style="display:inline-block; float:right; position:relative; top:-4px;">
                  <span v-if="collapseSectionOneIsOpen">-</span>
                  <span v-else>+</span>
                </span>
              </p>
            </div>
            <br>
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
                             :options="jobs"
                             :selected-options="fpJobs"
                             placeholder="select job"
                             @select="onSelectJob">
                </multi-select>
              </li><br>
              <li>Account
                <multi-select
                             :options="accounts"
                             :selected-options="fpAccounts"
                             placeholder="select job"
                             @select="onSelectAccount">
                </multi-select>
              </li><br>
              <li>PO #
                <multi-select
                             :options="pos"
                             :selected-options="fpPOs"
                             placeholder="select PO #"
                             @select="onSelectPO">
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
          </b-collapse>

          <hr>

          <b-collapse class="panel" :open.sync="collapseSectionTwoIsOpen" animation="fade">
            <div slot="trigger">
              <p class="title is-size-5">
                My Lists
                <span class="is-size-4" style="display:inline-block; float:right; position:relative; top:-4px;">
                  <span v-if="collapseSectionTwoIsOpen">-</span>
                  <span v-else>+</span>
                </span>
              </p>
            </div>
            <br>
            <ul>
              <li>List Name
                <multi-select
                             :options="lists"
                             :selected-options="fpListIDs"
                             placeholder="select list"
                             @select="onSelectListID">
                </multi-select>
              </li><br>
              <li>
                <label class="checkbox">
                  <input type="checkbox" v-model="fpListsShared">
                    &nbsp; Shared With Me
                </label>
              </li>
              <!-- <li>Favorite</li> -->
              <!-- <li>Job Name</li> -->
            </ul>
          </b-collapse>

          <hr>

          <b-collapse class="panel" :open.sync="collapseSectionThreeIsOpen" animation="fade">
            <div slot="trigger">
              <p class="title is-size-5">
                Category
                <span class="is-size-4" style="display:inline-block; float:right; position:relative; top:-4px;">
                  <span v-if="collapseSectionThreeIsOpen">-</span>
                  <span v-else>+</span>
                </span>
              </p>
            </div>
            <br>
            <ul>
              <li v-for="cat in categories" v-bind:key="cat.name">
                <label class="checkbox">
                  <input type="checkbox" v-model="fpCategories" :value="cat.name">
                    &nbsp; {{cat.name}} ({{cat.count}})
                </label>
              </li>
            </ul>
          </b-collapse>

          <hr>

          <b-collapse class="panel" :open.sync="collapseSectionFourIsOpen" animation="fade">
            <div slot="trigger">
              <p class="title is-size-5">
                Brand
                <span class="is-size-4" style="display:inline-block; float:right; position:relative; top:-4px;">
                  <span v-if="collapseSectionThreeIsOpen">-</span>
                  <span v-else>+</span>
                </span>
              </p>
            </div>
            <br>
            <ul>
              <li v-for="brand in brands" v-bind:key="brand.name">
                <label class="checkbox">
                  <input type="checkbox" v-model="fpBrands" :value="brand.name">
                    &nbsp; {{brand.name}} ({{brand.count}})
                </label>
              </li>
            </ul>
          </b-collapse>

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

                   <div v-if="productShared(item.code)" style="display:inline-block; position:absolute; float:left; top:3px; left:8px;">
                     <span class="icon has-text-info">
                       <i class="fas fa-user-plus"></i>
                     </span>
                   </div>

                   <br>
                   <p class="has-text-weight-bold product-list-item-title">{{item.name}}</p>
                   <p class="is-size-7">{{item.code}}</p>

                   <div v-if="fpOrderIDs.length">
                     <br>
                     <p class="is-size-7">
                       <span>Ordered {{productOrderFilterMethod(item.code).length}} time<span v-if="productOrderFilterMethod(item.code).length > 1">s</span>.</span>
                     </p>
                   </div>

                   <div v-if="fpListIDs.length">
                     <br>
                     <p class="is-size-7">
                       <span>Found in</span>
                       <span class=""><a href="#">{{lastSelectedListItem.value}}</a></span>
                       <span v-if="productListFilterMethod(item.code).length > 1">and {{productListFilterMethod(item.code).length - 1}} other list</span><span v-if="productListFilterMethod(item.code).length > 2">(s)</span>
                     </p>
                   </div>

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
import Buefy from 'buefy'

export default {
  name: 'Main',
  data () {
    return {

      lists: listData.lists.tree,
      fpListIDs: [],
      lastSelectedListItem: {},
      fpListsShared: false,

      orders: orderData.orders,
      products: productData.products,
      quotes: quoteData.quotes,

      brands: [],
      fpBrands: [],

      categories: [],
      fpCategories: [],

      fpOrderIDs: [],
      fpQuoteIDs: [],

      collapseSectionOneIsOpen: false,
      collapseSectionTwoIsOpen: false,
      collapseSectionThreeIsOpen: false,
      collapseSectionFourIsOpen: false,

      jobs: [],
      fpJobs: [],

      pos: [],
      fpPOs: [],

      accounts: [],
      fpAccounts: [],

      fpSearchTerm: '',


      fpOrderStartDate: null,
      fpOrderEndDate: null,

      flatPickrConfig: {
        dateFormat: 'm-d-Y'
      }
    }
  },
  filters: {

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

      if (this.fpJobs.length) {
        let func = this.prodIsInOrderJobFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpAccounts.length) {
        let func = this.accountFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      if (this.fpPOs.length) {
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

      /* ------- My Lists --------- */
      if (this.fpListIDs.length) {
        let func = this.prodIsInListIDFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      /* ------- Categories --------- */
      if (this.fpCategories.length) {
        let func = this.categoryFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      /* ------- Brands --------- */
      if (this.fpBrands.length) {
        let func = this.brandFilter
        fp = _.filter(fp, function (product) {
          return func(product.code)
        })
      }

      return fp
    }
  },
  methods: {
    productOrderFilterMethod: function (prodID) {
      // console.log(prodID + ': productListFilterMessage')
      // console.log('this.fpListIDs: ' + this.fpListIDs)
      let listOfOrders = []
      for (var order in this.orders) {
        // console.log('list: ' + this.fpListIDs[list].name)
        if (_.indexOf(_.map(this.orders[order]['products-ordered'], 'code'), prodID) !== -1) {
          // console.log(prodID + ': ' + this.lists[list].name)
          listOfOrders.push(this.orders[order])
        }
      }

      return listOfOrders
    },
    productShared: function (prodID) {
      let productShared = false
      for (var list in this.lists) {
        // console.log('list: ' + this.fpListIDs[list].name)
        if (_.indexOf(_.map(this.lists[list].products, 'code'), prodID) !== -1) {
          if (this.lists[list]['is-shared']) {
            productShared = true
          }
        }
      }

      return productShared
    },
    productListFilterMethod: function (prodID) {
      // console.log(prodID + ': productListFilterMessage')
      // console.log('this.fpListIDs: ' + this.fpListIDs)
      let listOfLists = []
      for (var list in this.lists) {
        // console.log('list: ' + this.fpListIDs[list].name)
        if (_.indexOf(_.map(this.lists[list].products, 'code'), prodID) !== -1) {
          // console.log(prodID + ': ' + this.lists[list].name)
          listOfLists.push(this.lists[list])
        }
      }

      return listOfLists
    },
    brandFilter: function (prodID) {
      let index = _.indexOf(_.map(this.products, 'code'), prodID)
      // console.log('index', index)
      let brand = this.products[index].brand
      // console.log(category)
      return _.includes(this.fpBrands, brand)
    },
    categoryFilter: function (prodID) {
      let index = _.indexOf(_.map(this.products, 'code'), prodID)
      // console.log('index', index)
      let category = this.products[index].categories
      // console.log(category)
      return _.includes(this.fpCategories, category)
    },
    accountFilter: function (prodID) {
      var bool = false
      var ordersThatIncludeFilteredAccount = []
      var accounts = this.fpAccounts
      _.forEach(this.orders, function (order) {
        // console.log(order['order-number'] + ': ' + _.includes(_.map(jobs, 'value'), order['job-name']))
        if (_.includes(_.map(accounts, 'value'), order['account'])) {
          ordersThatIncludeFilteredAccount.push(order)
        }
      })
      // console.log(ordersThatIncludeFilteredJob.length)
      _.forEach(ordersThatIncludeFilteredAccount, function (order) {
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
    prodIsInListIDFilter: function (prodID) {
      var bool = false
      _.forEach(this.fpListIDs, function (order) {
        if (_.includes(_.map(order['products'], 'code'), prodID)) {
          // console.log(prodID + ': ' + _.includes(_.map(order['products-ordered'], 'code'), prodID))
          bool = true
        }
      })
      return bool
    },
    prodIsInOrderJobFilter: function (prodID) {
      var bool = false
      var ordersThatIncludeFilteredJob = []
      var jobs = this.fpJobs
      _.forEach(this.orders, function (order) {
        // console.log(order['order-number'] + ': ' + _.includes(_.map(jobs, 'value'), order['job-name']))
        if (_.includes(_.map(jobs, 'value'), order['job-name'])) {
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
      var pos = this.fpPOs
      _.forEach(this.orders, function (order) {
        // console.log(order['order-number'] + ': ' + _.includes(_.map(jobs, 'value'), order['job-name']))
        if (_.includes(_.map(pos, 'value'), order['purchase-order-number'])) {
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
    onSelectListID (items, lastSelectItem) {
      this.fpListIDs = items
      this.lastSelectedListItem = lastSelectItem
    },
    onSelectOrderID (items, lastSelectItem) {
      this.fpOrderIDs = items
    },
    onSelectQuoteID (items, lastSelectItem) {
      this.fpQuoteIDs = items
    },
    onSelectJob (items, lastSelectItem) {
      this.fpJobs = items
      // console.log('fpJobs: ' + JSON.stringify(this.fpJobs))
      // this.lastSelectedOrderID = lastSelectItem
    },
    onSelectAccount (items, lastSelectItem) {
      this.fpAccounts = items
    },
    onSelectPO (items, lastSelectItem) {
      this.fpPOs = items
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
    FlatPickr,
    Buefy
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


    for (let product in this.products) {

      // create brands
      if (this.products[product].brand) {
        let index = _.indexOf(_.map(this.brands, 'name'), this.products[product].brand)
        if (index === -1) {
          this.brands.push({ name: this.products[product].brand, count: 1 })
        } else {
          this.brands[index].count++
        }
      }
      // create categories
      if (this.products[product].categories) {
        let index = _.indexOf(_.map(this.categories, 'name'), this.products[product].categories)
        if (index === -1) {
          this.categories.push({ name: this.products[product].categories, count: 1 })
        } else {
          this.categories[index].count++
        }
      }
    }

    /*
    // for every product
      // iterate through orders and
        // see if the code exists in any of the products-ordered children
          // if it does, add the order data to it
    */

    /*
      // for every order
        // add any new job names to the jobs array
    */
    for (let order in this.orders) {
      // console.log(_.indexOf(this.jobs, this.orders[order]['job-name']))
      if (this.orders[order]['job-name'] && _.indexOf(_.map(this.jobs, 'value'), this.orders[order]['job-name']) === -1) {
        // console.log('yeah! ' + this.orders[order]['job-name'])
        this.jobs.push({ text: this.orders[order]['job-name'], value: this.orders[order]['job-name'] })
      }
      // console.log(this.orders[order]['order-number'] + ': ' + _.indexOf(_.map(this.accounts, 'value'), this.orders[order]['account']) === -1)
      if (this.orders[order]['account'] && _.indexOf(_.map(this.accounts, 'value'), this.orders[order]['account']) === -1) {
        // console.log('yeah! ' + this.orders[order]['account'])
        this.accounts.push({ text: this.orders[order]['account'], value: this.orders[order]['account'] })
      }

      if (this.orders[order]['purchase-order-number'] && _.indexOf(this.pos, this.orders[order]['purchase-order-number']) === -1) {
        this.pos.push({ text: this.orders[order]['purchase-order-number'], value: this.orders[order]['purchase-order-number'] })
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
