/**
* Order.js
*
* @description :: Order from the store containing multiple books
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    storeOrderId: {
      type: 'integer',
      required: true
    },
    date: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    },
    books: {
      collection: 'book',
      via: 'order'
    },
    dispatchDate: {
      type: 'datetime',
      defaultTo: null
    }
  }
};
