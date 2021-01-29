import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CartBuyerSchema = new Schema({
    idBuyerAccount: {
        type: String,
        required: true
    },
    products: [{
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
        // Data Product
        idProduct: {
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
    }]
});