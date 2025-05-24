import express from 'express';
import { checkout, webhook } from '../controller/paymentController.js';
const paymentrouter = express.Router();

paymentrouter.post('/webhook', express.raw({ type: 'application/json' }), webhook);
paymentrouter.post('/create-payment-intent', express.json() , checkout);


export default paymentrouter;