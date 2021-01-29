import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TokenAccountSchema = new Schema({
    idAccount: {
        type: String,
        required: true
    },
    emailAccount:{
        type: String,
        required: true
    },
    tokenVerify: {
        type: String,
        required: true,
        expires: '120m'
    }
});