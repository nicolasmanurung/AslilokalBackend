import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SellerBiodataSchema = new Schema({
    idSellerAccount: {
        type: String,
        required: true
    },
    nameSellerBiodata: {
        type: String,
        required: true
    },
    idKtpNumber: {
        type: String,
        required: true
    },
    telpNumber: {
        type: String,
        required: true
    },
    birthDateSeller: {
        type: Date
    },
    addressSeller: {
        type: String,
        required: true
    },
    ktpImgSeller: {
        type: String,
        required: true
    },
    selfImgSeller: {
        type: String,
        required: true
    },
    paymentInfo: {
        ovoNumber: {
            type: String
        },
        danaNumber: {
            type: String
        },
        gopayNumber: {
            type: String
        }
    }
})