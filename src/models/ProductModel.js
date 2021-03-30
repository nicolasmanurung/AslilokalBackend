import mongoose from 'mongoose';
import pagination from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
    idSellerAccount: {
        type: String,
        required: true
    },
    nameProduct: {
        type: String,
        required: true
    },
    productCategory: {
        // Sembako, Jasa, Kuliner, Fashion
        type: String
    },
    umkmTags: {
        type: String
    },
    promotionTags: [{
        type: String
    }],
    priceProduct: {
        type: String
    },
    productWeight: {
        type: Number
    },
    priceServiceRange: {
        type: String
    },
    imgProduct: {
        type: String
    },
    promoPrice: {
        type: Number
    },
    descProduct: {
        type: String
    },
    sumCountView: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    lastUpdateAt: {
        type: Date,
        default: Date.now
    }
});

ProductSchema.plugin(pagination);