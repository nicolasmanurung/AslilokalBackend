import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SellerAccountSchema = new Schema({
    noTelpSeller: {
        type: String,
        required: true
    },
    emailSeller: {
        type: String,
        required: true
    },
    passSeller: {
        type: String,
        required: true
    },
    emailVerifyStatus: {
        // false, true
        type: Boolean,
        default: false
    },
    shopVerifyStatus: {
        // submit, review, accept, reject
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});