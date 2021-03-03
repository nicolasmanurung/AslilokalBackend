import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OrderSchema = new Schema({
    idBuyerAccount: {
        type: String
    },
    idSellerAccount: {
        type: String
    },
    addressBuyer: {
        type: String
    },
    products: [{
        idProduct: {
            type: String
        },
        imgProduct: {
            type: String
        },
        nameProduct: {
            type: String
        },
        priceAt: {
            type: Number
        },
        qty: {
            type: Number
        },
        noteProduct: {
            type: String
        }
    }],
    // seller, jne, jnt, dll
    courierType: {
        type: String
    },
    resiCode: {
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
        type: Boolean,
        default: false
    },
    isCancelSeller: {
        type: Boolean,
        default: false
    },
    isFinish: {
        type: Boolean,
        default: false
    },
    //iterasi
    messageCancel: {
        type: String
    },
    acceptAt: {
        type: Date
    },
    finishAt: {
        type: Date
    },
    orderAt: {
        type: Date,
        default: Date.now
    }
});