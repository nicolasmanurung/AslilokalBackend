import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ReviewSchema = new Schema({
    idSellerAccount: {
        type: String
    },
    idBuyerAccount: {
        type: String
    },
    idOrder: {
        type: String
    },
    idProduct: {
        type: String
    },
    nameReviewer: {
        type: String
    },
    starReview: {
        type: Number
    },
    textOfReview: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});