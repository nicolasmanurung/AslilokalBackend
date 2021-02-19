import mongoose from 'mongoose';
import pagination from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

export const SellerShopSchema = new Schema({
    idSellerAccount: {
        type: String,
        required: true
    },
    nameShop: {
        type: String,
        required: true
    },
    noTelpSeller: {
        type: String,
        required: true
    },
    noWhatsappShop: {
        type: String,
        required: true
    },
    isPickup: {
        type: Boolean,
        required: true
    },
    isDelivery: {
        type: Boolean,
        required: true
    },
    // isPayLater: {
    //     type: Boolean,
    //     required: true
    // },
    imgShop: {
        type: String
    },
    freeOngkirLimitKm: {
        type: Boolean
    },
    addressShop: {
        type: String,
        required: true
    },
    postalCode: {
        type: String
    },
    // Next Update
    // trackingGpsSeller:{
    //     type: String
    // }
    isTwentyFourHours: {
        type: Boolean,
        default: false
    },
    openTime: {
        type: String
    },
    closeTime: {
        type: String
    },
    sumFollowers: {
        type: Number,
        default: 0
    }
})

SellerShopSchema.plugin(pagination)