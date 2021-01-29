import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PaymentSchema = new Schema({
    idProduct: {
        type: String,
        required: true
    },
    idSellerAccount: {
        type: String,
        required: true
    },
    qtyProduct: {
        type: Number
    },
    totalPayment: {
        type: Number,
        required: true
    },
    validity: {
        type: Date,
        default: Date.now,
        expires: '180m'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})