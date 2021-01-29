import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BuyerFollowingSchema = new Schema({
    idBuyerAccount: {
        type: String,
        required: true
    },
    sumFollowing: {
        type: Number,
        default: 0
    },
    following: [{
        idSellerAccount: {
            type: String
        }
    }]
})