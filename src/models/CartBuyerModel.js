import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CartBuyerSchema = new Schema({
    idBuyerAccount: {
        type: String
    },
    // Data Seller
    idSellerAccount: {
        type: String
    },
    nameShop: {
        type: String
    },
    addressShop: {
        type: String
    },
    isLocalShop: {
        type: Boolean
    },
    // Data Product
    idProduct: {
        type: String
    },
    nameProduct: {
        type: String
    },
    // kuliner, sembako, dll
    categoryProduct: {
        type: String
    },
    imgProduct: {
        type: String
    },
    productPrice: {
        type: Number
    },
    qtyProduct: {
        type: Number
    },
    noteProduct: {
        type: String
    }
});