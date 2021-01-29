import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const VoucherSchema = new Schema({
    idSellerAccount: {
        type: String,
        required: true
    },
    valueVoucher: {
        type: Number,
        required: true
    },
    minimumPurchase: {
        type: Number,
        default: 0
    },
    validity: {
        type: Date
    },
    codeVoucher: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});