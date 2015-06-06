/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {
  dispatch: function (req, res) {
    Order.findOne(req.param('id')).populate('books').exec(function (err, order) {
      if (err) {
        return res.negotiate(err);
      }

      if (!order) {
        return res.notFound();
      }

      var requestData = {
        orderId: order.storeOrderId,
        books: _.map(order.books, function (book) {
          return {
            ISBN: book.ISBN,
            quantity: book.quantity
          }
        })
      };

      request({
        url: 'http://localhost:8000/api/orders/' + order.storeOrderId,
        method: 'PATCH',
        json: requestData
      }, function (error, response, body) {
        console.log('request', requestData, 'error', error, 'response', response, 'body', body);
        if (err) {
          return res.negotiate(err);
        }

        if (response.statusCode !== 200) {
          return res.serverError();
        }

        console.log('Sent PATCH to store order id', order.storeOrderId, '(' + order.id + ')');

        Order.update(order.id, {
          dispatchDate: new Date()
        }, function (err) {
          if (err) {
            return res.negotiate(err);
          }

          return res.ok();
        });
      });
    });
  }
};

