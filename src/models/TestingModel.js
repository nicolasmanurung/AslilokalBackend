import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const TestingSchema = new Schema({
    name: {
        type: String
    },
    imgUrl: {
        type: String
    }
})