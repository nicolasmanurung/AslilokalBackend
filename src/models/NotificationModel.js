import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const NotificationSchema = new Schema({
    idUser: {
        type: String
    },
    // Cancel, order, review, etc
    statusNotification: {
        type: String
    },
    refId: {
        type: String
    },
    isRead: {
        // unread, read, etc
        type: String
    },
    descNotification: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});