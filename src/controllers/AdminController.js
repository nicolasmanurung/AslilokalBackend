import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AdminAccountSchema } from '../models/AdminAccountModel';
import { SellerAccountSchema } from '../models/SellerAccountModel';

const AdminAccount = mongoose.model('AdminAccount', AdminAccountSchema);
const SellerAccount = mongoose.model('SellerAccount', SellerAccountSchema);

export const loginRequiredAdmin = async(req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({
            message: 'Unauthorization user'
        })
    }
}

export const adminLoginAccount = async(req, res) => {
    try {
        const findAdminAccount = await AdminAccount.findOne({
            usernameAdmin: req.body.usernameAdmin
        });

        if (!findAdminAccount) {
            return res.status(200).json({
                success: false,
                message: 'Autentikasi salah. Akun tidak ditemukan!'
            });
        } else {
            var passwordField = findAdminAccount.passwordAdmin.split('$');
            var salt = passwordField[0];
            var hash = crypto.createHmac('sha256', salt)
                .update(req.body.passwordAdmin)
                .digest('hex');

            if (!(hash == passwordField[1])) {
                return res.status(200).json({
                    success: false,
                    message: 'Password salah!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    username: findAdminAccount._id,
                    token: jwt.sign({
                        usernameAdmin: findAdminAccount.usernameAdmin,
                        _id: findAdminAccount._id
                    }, "KODELAPOAPI")
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const adminRegisterAccount = async(req, res) => {
    try {
        const newAdmin = new AdminAccount(req.body);
        var salt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.createHmac("sha256", salt)
            .update(req.body.passwordAdmin)
            .digest('hex');

        newAdmin.passwordAdmin = salt + "$" + hash;
        const findAdminAccount = await AdminAccount.findOne({
            usernameAdmin: req.body.usernameAdmin
        });

        if (findAdminAccount) {
            return res.status(200).json({
                success: false,
                message: 'Tidak dapat mendaftar. Akun sudah ada!'
            });
        } else if (!findAdminAccount) {
            try {
                await newAdmin.save()
                return res.status(200).json({
                    success: true,
                    message: 'Akun berhasil dibuat'
                });
            } catch (error) {
                console.log(error);
                return res.status(401).json({
                    success: false,
                    message: 'Maaf ada gangguan server!'
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const putStatusShop = async(req, res) => {
    try {
        const oneShop = await SellerAccount.findOneAndUpdate({
            _id: req.params.idSeller
        }, {
            $set: {
                shopVerifyStatus: req.body.status
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Berhasil di update',
            result: oneShop
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}