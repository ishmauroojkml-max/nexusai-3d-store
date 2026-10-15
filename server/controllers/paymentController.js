const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc   Create payment intent
// @route  POST /api/payment/create-intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;
    
    // For test mode / demo - if no Stripe key, return mock
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('YourStripeTestKey')) {
      return res.json({
        success: true,
        clientSecret: 'pi_mock_secret_test_' + Date.now(),
        mock: true,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId: orderId || '' },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   Webhook handler
// @route  POST /api/payment/webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    if (paymentIntent.metadata.orderId) {
      await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
        isPaid: true, paidAt: Date.now(), orderStatus: 'confirmed',
        paymentResult: { id: paymentIntent.id, status: 'completed' }
      });
    }
  }
  res.json({ received: true });
};

