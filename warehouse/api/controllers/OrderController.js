/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	dispatch: function (req, res) {
    Order.findOne(req.param('id'), function (err, order) {
      if (err) {
        return res.negotiate(err);
      }

      if (!order) {
        return res.notFound();
      }

      Order.update(order.id, {
        dispatchDate: new Date()
      }, function (err) {
        if (err) {
          return res.negotiate(err);
        }

        return res.ok();
      });
    });
  }
};

