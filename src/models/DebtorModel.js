import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const DebtorSchema = new Schema({
    idSellerAccount: {
        type: String,
        required: true
    },
    nameDebtor: {
        type: String,
        required: true
    },
    totalDebt: {
        type: Number,
        required: true
    },
    descDebt: {
        type: String
    },
    statusTransaction: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});