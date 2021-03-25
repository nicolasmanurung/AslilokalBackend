import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BuyerAccountSchema = new Schema({
    emailBuyer: {
        type: String,
        required: true
    },
    passwordBuyer: {
        type: String,
        required: true
    },
    emailVerifyStatus: {
        type: Boolean,
        default: false
    },
    biodataVerifyStatus: {
        type: Boolean,
        default: false
    }
});