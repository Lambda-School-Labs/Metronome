const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @api {post} /api/user/register Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {String} email The user's email.
 * @apiParam {String} password The user's password.
 * @apiParam {String} firstName The user's first name.
 * @apiParam {String} lastName The user's last name.
 * @apiParam {String} role The user's role (Teacher or Student) (defaults to Student if not specified).
 *
 * @apiSuccess {String} token The new user's JWT.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "abcdef.ghijklmnop.qrstuvwxyz"
 *    }
 *
 * @apiUse UserAlreadyExistsError
 * @apiUse InvalidInputsError
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role = 'Student' } = req.body;
    const user = await User.getModelForRole(role).registerNewUser({
      email,
      password,
      firstName,
      lastName,
    });
    const token = user.generateJWT();
    res.status(200).json({
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /api/user/login Log a user in
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} email The user's email.
 * @apiParam {String} password The user's password.
 *
 * @apiSuccess {String} token The user's JWT.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "abcdef.ghijklmnop.qrstuvwxyz"
 *    }
 *
 * @apiUse UserDoesNotExistError
 * @apiUse IncorrectPasswordError
 * @apiUse InvalidInputsError
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await User.loginUser({ email, password });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {put} /api/user/ Edit the user's profile
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} newEmail The user's new email.
 * @apiParam {String} oldPassword The user's old (current) password.
 * @apiParam {String} newPassword The user's new password.
 * @apiParam {String} firstName The user's new first name.
 * @apiParam {String} lastName The user's new last name.
 *
 * @apiSuccess {String} token The user's new JWT.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "abcdef.ghijklmnop.qrstuvwxyz"
 *    }
 *
 * @apiUse UserAlreadyExistsError
 * @apiUse InvalidInputsError
 */
exports.editProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, newEmail, oldPassword, newPassword } = req.body;
    const currentUser = await User.findById(req.user._id);
    const token = await currentUser.editProfile({
      newEmail,
      oldPassword,
      newPassword,
      firstName,
      lastName,
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /api/user/transaction make a stripe transaction
 * @apiName StripeTransaction
 * @apiGroup User
 *
 * @apiParam {String} userId The user's id.
 * @apiParam {String} tokenId The stripe front-end transaction token id.
 * @apiParam {String} subscribeType The user subscription type.
 * @apiParam {String} price The user transaction price.
 *
 * @apiSuccess {JSON} transaction The user's transaction JSON information.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": "ch_1CNoOCBAjX4w9BqH3Ck3KBAL",
 *      "object": "charge",
 *      "amount": 299,
 *      "amount_refunded": 0,
 *      "application": null,
 *      "application_fee": null,
 *      "balance_transaction": "txn_1CNoOCBAjX4w9BqHZaGDqBbr",
 *      "captured": true,
 *      "created": 1525380656,
 *      "currency": "usd"
 *    }
 *
 * @apiError UserDoesNotExist "User not exist."
 *
 * @apiErrorExample Transaction Error:
 *    HTTP/1.1 500 Bad Request
 *    {
 *      "error": "Transaction Error"
 *    }
 *
 * @apiErrorExample "No Transaction"
 *    HTTP/1.1 500 Bad Request
 *    {
 *      "error": "No Transaction"
 *    }
 */
exports.transaction = async (req, res, next) => {
  try {
    const { tokenId, subscribeType, price } = req.body;
    const user = await User.findById(req.user._id);
    if (subscribeType) {
      user.subscribeType = subscribeType;
      user.isSubscribe = true;
    }
    user.price = price;

    if (!user) return res.status(422).json({ error: 'User not exist' });
    if (subscribeType === '1 Month') {
      const charge = await stripe.plans.create({
        amount: Number(price) * 100,
        currency: 'usd',
        interval: 'month',
        product: 'prod_CnOW1SzS52XC5X',
      });

      if (!charge) return res.status(500).json({ error: 'Transaction Error' });
      user.orderId = charge.id;
    } else if (subscribeType === '1 Client') {
      const charge = await stripe.charges.create({
        amount: Number(price) * 100,
        currency: 'usd',
        source: tokenId,
      });

      if (!charge) return res.status(500).json({ error: 'Transaction Error' });
      user.orderId = charge.id;
    } else {
      res.status(500).json({ error: 'No Transaction' });
    }
    user.save();
    const token = user.generateJWT();
    res.status(200).json(token);
  } catch (err) {
    next(err);
  }
};
