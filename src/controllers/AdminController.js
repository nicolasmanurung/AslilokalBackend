import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AdminAccountSchema } from '../models/AdminAccountModel';
import { SellerAccountSchema } from '../models/SellerAccountModel';
import { OrderRevenueSchema } from '../models/OrderRevenue';
import { OrderSchema } from '../models/OrderModel';
import { SellerShopSchema } from '../models/SellerShopModel';
import { ProductSchema } from '../models/ProductModel';

const AdminAccount = mongoose.model('AdminAccount', AdminAccountSchema);
const SellerAccount = mongoose.model('SellerAccount', SellerAccountSchema);
const OrderRevenue = mongoose.model('OrderRevenue', OrderRevenueSchema);
const Order = mongoose.model('Order', OrderSchema);
const SellerShop = mongoose.model('SellerShop', SellerShopSchema);
const Product = mongoose.model('Product', ProductSchema);

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
            message: 'Berhasil di update'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const getShopRevenueRequest = async(req, res) => {
    try {
        const allRevenueRequest = await OrderRevenue.find({
            statusRevenue: req.query.type
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: allRevenueRequest
        });

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const getOneShopRevenueRequest = async(req, res) => {
    try {
        const oneRevenueRequest = await OrderRevenue.findById(req.params.idRevenue);
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: oneRevenueRequest
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const putShopRevenueRequest = async(req, res) => {
    try {
        const oneOrderRevenue = await OrderRevenue.findByIdAndUpdate(req.params.idRevenue, {
            statusRevenue: req.params.statusRevenue
        }, {
            $set: {
                acceptAt: new Date.now
            }
        });

        if (req.params.statusRevenue == "done") {
            const oneNotification = new Notification({
                idUser: oneOrderRevenue.idSellerAccount,
                statusNotification: "revenue",
                refId: req.params.idRevenue,
                isRead: "unread",
                descNotification: "Lihat saldo mu sudah di cairkan..."
            });
            await oneNotification.save()
        }
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengubah data'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const getAllOrderWithStatus = async(req, res) => {
    try {
        const allOrder = await Order.find({
            statusOrder: {
                $in: ["delivered", "done"]
            },
            acceptAt: {
                $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil',
            result: allOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const getAllOrderPaymentRequired = async(req, res) => {
    try {
        const allOrder = await Order.find({
            statusOrder: "paymentrequired",
            acceptAt: {
                $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil',
            result: allOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const putAdminStatusOrder = async(req, res) => {
    try {
        const oneOrder = await Order.findByIdAndUpdate(req.params.idOrder, {
            $set: {
                statusOrder: req.body.statusOrder
            }
        });

        // add pendapatan
        if (req.body.statusOrder == "finish") {
            await SellerRevenue.findOneAndUpdate({
                idSellerAccount: oneOrder.idSellerAccount
            }, {
                $inc: {
                    sumSaldo: oneOrder.totalPayment
                },
                $set: {
                    finishAt: new Date.now
                }
            }, {
                new: true,
                upsert: true
            })

            const oneNotification = new Notification({
                idUser: oneOrder.idBuyerAccount,
                statusNotification: req.body.statusOrder,
                refId: req.params.idOrder,
                isRead: "unread",
                descNotification: "Penghasilanmu bertambah!"
            })

            await oneNotification.save();
        }
        return res.status(200).json({
            success: true,
            message: 'Berhasil'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const getAllShop = async(req, res) => {
    try {
        const allShop = await SellerAccount.find({
            shopVerifyStatus: req.query.shopVerifyStatus
        }, {
            passSeller: 0
        });


        return res.status(200).json({
            success: true,
            message: 'Berhasil',
            result: allShop
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const putAslilokalShop = async(req, res) => {
    try {
        await SellerShop.updateOne({
            idSellerAccount: req.params.idSellerAccount
        }, {
            $set: {
                shopTypeStatus: req.body.shopUmkmStatus
            }
        });

        await Product.updateMany({
            idSellerAccount: req.params.idSellerAccount
        }, {
            $set: {
                umkmTags: req.body.shopUmkmStatus
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengassign toko'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}