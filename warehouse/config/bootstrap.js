/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var context = require('rabbit.js').createContext("amqp://-UjhSQW2:I7wUztYvmR2CRNt8YYKDzvFs9QuwP_E5@furry-laburnum-34.bigwig.lshift.net:10597/ZDeYcPlGqzB3");

module.exports.bootstrap = function(cb) {

  var pull = context.socket('PULL');
  pull.setEncoding('utf8');

  pull.connect('orders', function () {
    console.log('Connected to pull socket orders');
  });

  pull.on('data', function (msg) {
    try {
      var orderObj = JSON.parse(msg);
    } catch (err) {
      console.log('Error "' + err + '" when parsing message "' + msg + '"');
      return;
    }

    Order.create({storeOrderId: orderObj.storeOrderId}).exec(function (err, order) {
      if (err) {
        console.log("Error ", err," creating order ", JSON.stringify(orderObj));
        return;
      }

      async.eachSeries(orderObj.books, function (book, cb) {
        Book.create({
          title: book.title,
          ISBN: book.ISBN,
          quantity: book.quantity,
          order: order.id
        }).exec(function (err, b) {
          if (err) {
            cb(err);
            return;
          }

          console.log("b", b.order);
          cb();
        });
      }, function (err) {
        if (err) {
          console.log("Error", err, "creating book in order ", JSON.stringify(order));
        } else {
          console.log("Finished adding all books for order ", order);
        }
      });
    });

    console.log("Received: ", JSON.stringify(orderObj));
  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
