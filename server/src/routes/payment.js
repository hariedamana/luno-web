const express = require('express');
const router = express.Router();

// Initialize Stripe (will be done in the route handler using req.stripe)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Product configuration
const PRODUCT = {
    name: 'LUNO Edge Pro',
    description: 'Edge-AI Voice Capture Device with 1 year Pro License',
    price: 6000, // $60.00 in cents
    currency: 'usd',
    image: 'https://via.placeholder.com/400x400?text=LUNO+Edge+Pro'
};

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { customerEmail } = req.body;

        // Build session options - only include customer_email if it's a valid non-empty string
        const sessionOptions = {
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: PRODUCT.currency,
                        product_data: {
                            name: PRODUCT.name,
                            description: PRODUCT.description,
                            images: [PRODUCT.image],
                        },
                        unit_amount: PRODUCT.price,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
            metadata: {
                productName: PRODUCT.name,
            },
        };

        // Only add customer_email if it's a valid non-empty string
        if (customerEmail && typeof customerEmail === 'string' && customerEmail.trim()) {
            sessionOptions.customer_email = customerEmail.trim();
        }

        const session = await stripe.checkout.sessions.create(sessionOptions);

        // Create pending order in database
        await req.prisma.order.create({
            data: {
                stripeSessionId: session.id,
                customerEmail: customerEmail || 'guest@checkout.com',
                productName: PRODUCT.name,
                amount: PRODUCT.price,
                status: 'pending',
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        console.error('Error type:', error.type);
        console.error('Error code:', error.code);
        console.error('Full error:', JSON.stringify(error, null, 2));
        res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
    }
});

// Get session status (for success page)
router.get('/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            status: session.payment_status,
            customerEmail: session.customer_email,
            amountTotal: session.amount_total,
            currency: session.currency,
            productName: PRODUCT.name,
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
});

// Stripe Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Update order status in database
            await req.prisma.order.update({
                where: { stripeSessionId: session.id },
                data: { status: 'completed' },
            });

            console.log('✅ Payment completed for session:', session.id);
            break;

        case 'checkout.session.expired':
            const expiredSession = event.data.object;

            await req.prisma.order.update({
                where: { stripeSessionId: expiredSession.id },
                data: { status: 'failed' },
            });

            console.log('❌ Session expired:', expiredSession.id);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
