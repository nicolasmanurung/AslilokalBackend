import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OrderRevenueSchema = new Schema({
    idSellerAccount: {
        type: String
    },
    sumRevenueRequest: {
        type: Number
    },
    acceptedRevenue: {
        type: Number
    },
    informationPayment: {
        providerPayment: {
            type: String
        },
        numberPayment: {
            type: Number
        }
    },
    statusRevenue: {
        // request, done
        type: String
    },
    acceptAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})