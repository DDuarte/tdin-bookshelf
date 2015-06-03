/**
 * Usage:
 *
 * ```
 * res.emailAddressInUse();
 * ```
 *
 */

module.exports = function emailAddressInUse (){

  // Get access to `res`
  var res = this.res;

  return res.send(409, 'Email address is already taken by another user.');
};
