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
        type: Date,
        //Testing
    },
    addressSeller: {
        type: String,
        required: true
    },
    ktpImgSeller: {
        type: String
    },
    imgSelfSeller: {
        type: String
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