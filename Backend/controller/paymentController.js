import { Stripe } from 'stripe';
import dotenv from "dotenv";
import productModel from '../models/product.js';
import orderModel from '../models/Order.js';
import PDFDocument from 'pdfkit';
import path from 'path';
import nodemailer from "nodemailer";
import fs from "fs";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (req, res) => {
    const { cartItems, buyerId } = req.body;


    try {
        // 1. Create line items for Stripe Checkout
        const line_items = cartItems.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: item.productimgs.length > 0 ? [item.productimgs[0].trim()] : [], // Handle single or multiple images
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        // Add delivery charge as a separate item
        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: 50 * 100, // 50 INR converted to paise
            },
            quantity: 1,
        });


        const minimalCartItems = cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
            productSize: item.productSize,
            image: item.productimgs.length > 0 ? [item.productimgs[0].trim()] : [],
        }));

        // 2. Create the Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/myOrders?session_id={CHECKOUT_SESSION_ID`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                buyerId,
                cartItems: JSON.stringify(minimalCartItems),
            },
            shipping_address_collection: {
                allowed_countries: ['IN'], // ✅ Add this to collect address
            },
            phone_number_collection: {
                enabled: true, // ✅ Add this to collect phone number
            },
        });

        res.status(200).json({ success: true, url: session.url });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

export function generatePDF(orders) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const receiptDir = path.join('receipts');
        if (!fs.existsSync(receiptDir)) {
            fs.mkdirSync(receiptDir);
        }
        const receiptPath = path.join(receiptDir, `receipt-${Date.now()}.pdf`);
        const writeStream = fs.createWriteStream(receiptPath);

        doc.pipe(writeStream);

        doc.fontSize(20).text('Order Receipt', { align: 'center' }).moveDown();

        orders.forEach(order => {
            doc.fontSize(14).text(`Seller ID: ${order.sellerId}`);
            order.products.forEach(p => {
                doc.text(`- Product ID: ${p.productId}`);
                doc.text(`  Price: ₹${p.price}`);
                doc.text(`  Quantity: ${p.quantity}`);
                doc.text(`  Size: ${p.productSize}`);
                doc.text(`  Subtotal: ₹${p.price * p.quantity}`).moveDown();
            });
            doc.text(`Subtotal for Seller: ₹${order.totalAmount}`).moveDown();
        });

        const grandTotal = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 50;
        doc.fontSize(14).text(`Delivery Charge: ₹50`);
        doc.fontSize(16).text(`Grand Total: ₹${grandTotal}`).moveDown();

        const { firstName, lastName, email, phone, address, city, state, pincode } = orders[0];
        doc.text(`Name: ${firstName} ${lastName}`);
        doc.text(`Email: ${email}`);
        doc.text(`Phone: ${phone}`);
        doc.text(`Address: ${address}, ${city}, ${state} - ${pincode}`);

        doc.end();

        writeStream.on('finish', () => {
            resolve(receiptPath);
        });

        writeStream.on('error', reject);
    });
}

export const sendReceiptEmail = async (toEmail, receiptPath) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASSWORD
        },
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: toEmail,
        subject: "Your Order Receipt",
        text: "Thank you for your purchase! Please find your receipt attached.",
        attachments: [
            {
                filename: 'receipt.pdf',
                path: receiptPath,
            },
        ],
    };

    return transporter.sendMail(mailOptions);
};

export const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const buyerId = session.metadata.buyerId;
        const cartItems = JSON.parse(session.metadata.cartItems);

        const ordersBySeller = {}; // Grouped by sellerId

        for (const item of cartItems) {
            if (!item.productId) continue;

            const product = await productModel.findById(item.productId);
            if (!product) continue;
            product.stock = product.stock - item.quantity;
            await product.save();

            const sellerId = product.sellerId;

            if (!ordersBySeller[sellerId]) {
                ordersBySeller[sellerId] = [];
            }

            ordersBySeller[sellerId].push({
                productId: product._id,
                quantity: item.quantity,
                price: item.price,
                productSize: item.productSize,
                image: item.image[0]
            });
        }

        const orderDocs = [];

        for (const sellerId in ordersBySeller) {
            const sellerProducts = ordersBySeller[sellerId];

            const totalAmount = sellerProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

            const order = new orderModel({
                buyerId,
                sellerId,
                products: sellerProducts,
                totalAmount,
                paymentStatus: 'paid',
                firstName: session.shipping_details.name.split(' ')[0],
                lastName: session.shipping_details.name.split(' ')[1] || '',
                email: session.customer_details.email,
                address: session.shipping_details.address.line1,
                city: session.shipping_details.address.city,
                state: session.shipping_details.address.state,
                pincode: session.shipping_details.address.postal_code,
                phone: session.customer_details.phone,
            });

            await order.save();
            orderDocs.push(order);
        }

        const receiptPath = await generatePDF(orderDocs);
        
        const toEmail = session.customer_details.email;

        await sendReceiptEmail(toEmail, receiptPath);

        return res.status(200).send({ received: true });
    } else {
        res.status(400).send('Event type not handled');
    }
};
