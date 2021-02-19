import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BuyerBiodataSchema = new Schema({
    idBuyerAccount: {
        type: String
    },
    nameBuyer: {
        type: String,
        required: true
    },
    noTelpBuyer: {
        type: String,
        required: true
    },
    addressBuyer: {
        type: String,
        required: true
    },
    postalCode: {
        type: String
    },
    // Next update
    // addressTracking : {
    //     type: Unknown
    // }
    imgKtpBuyer: {
        type: String
    },
    imgSelfBuyer: {
        type: String
    }
})