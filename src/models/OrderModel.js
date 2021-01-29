import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OrderSchema = new Schema({
    idBuyerAccount: {
        type: String,
        required: true
    },
    idSellerAccount: {
        type: String,
        required: true
    },
    addressBuyer: {
        type: String,
        required: true
    },
    products: [{
        imgProduct: {

        },
        idProduct: {
            type: String
        },
        priceAt: {
            type: Number
        },
        qty: {
            type: Number
        }
    }],
    courierType: {
        type: String
    },
    courierCost: {
        type: Number
    },
    voucherCode: {
        type: String
    },
    voucherId: {
        type: String
    },
    totalProductPrice: {
        type: Number
    },
    totalPayment: {
        type: Number
    },
    // Belum Bayar, Dibayar, DiProses, Menunggu, Selesai
    statusOrder: {
        type: String
    },
    isCancelBuyer: {
        type: Boolean
    },
    isCancelSeller: {
        type: Boolean
    },
    isFinish: {
        type: Boolean,
        default: false
    }
});