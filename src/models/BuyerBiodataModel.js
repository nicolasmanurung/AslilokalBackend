import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BuyerBiodataSchema = new Schema({
    idBuyerAccount: {
        type: String,
        required: true
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