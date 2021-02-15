import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const AdminAccountSchema = new Schema({
    usernameAdmin: {
        type: String
    },
    passwordAdmin: {
        type: String
    }
})