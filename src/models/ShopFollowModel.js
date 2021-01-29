import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ShopFollowSchema = new Schema({
    idSellerAccount: {
        type: String,
        required: true
    },
    sumFollowers: {
        type: Number,
        default: 0
    },
    followers: [{
        idBuyerAccount: {
            type: String
        }
    }]
})