import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TokenAccountSchema = new Schema({
    emailAccount: {
        type: String
    },
    tokenVerify: {
        type: String
    },
});