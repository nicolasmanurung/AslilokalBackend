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
    addressShop: {
        type: String,
        required: true
    },
    postalCodeInput: {
        type: String
    },
    shopTypeStatus: {
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
    sumCountView: {
        type: Number,
        default: 0
    },
    sumFollowers: {
        type: Number,
        default: 0
    }
})

SellerShopSchema.plugin(pagination)