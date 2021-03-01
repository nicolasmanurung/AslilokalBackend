import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SellerRevenueSchema = new Schema({
    idSellerAccount: {
        type: String
    },
    sumSaldo: {
        type: Number
    }
})