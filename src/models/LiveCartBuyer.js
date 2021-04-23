import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const LiveCartBuyerSchema = new Schema({
    idBuyerAccount: {
        type: String
    },
    products: [{
        type: String
    }]
})