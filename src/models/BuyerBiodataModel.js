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
    rajaOngkir: {
        city_id: {
            type: String
        },
        province_id: {
            type: String
        },
        province: {
            type: String
        },
        city_name: {
            type: String
        },
        postal_code: {
            type: String
        }
    },
    addressBuyer: {
        type: String,
        required: true
    },
    postalCodeInput: {
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