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
    imgProduct: {
        type: String
    },
    nameProduct: {
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
    statusReview: {
        type: String,
        default: "unreview"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});