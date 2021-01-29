import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const NotificationSchema = new Schema({
    idUser: {
        type: String,
        required: true
    },
    // Cancel, order, review, etc
    statusNotification: {
        type: String,
        required: true
    },
    isRead:{
        // unread, read, etc
        type: String
    },
    descNotification: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});