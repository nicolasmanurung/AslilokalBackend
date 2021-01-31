import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { BuyerAccountSchema } from '../models/BuyerAccountModel';
import { BuyerBiodataSchema } from "../models/BuyerBiodataModel";
import { BuyerFollowingSchema } from "../models/BuyerFollowingModel";
import { ShopFollowSchema } from '../models/ShopFollowModel';
import { TokenAccountSchema } from "../models/TokenAccountModel";
import { ProductSchema } from "../models/ProductModel";
import { SellerShopSchema } from '../models/SellerShopModel'
import { VoucherSchema } from '../models/VoucherModel';
import { CartBuyerSchema } from '../models/CartBuyerModel';
import { OrderSchema } from '../models/OrderModel';
import { ReviewSchema } from '../models/ReviewModel';
import { TestingSchema } from '../models/TestingModel';
import {
    uploadUsrImg
} from '../configs/upload';

const mailgun = require("mailgun-js");
const DOMAIN = 'nicolasmanurung.tech';
const mg = mailgun({
    apiKey: "76d09f6b0646ad23850b363dcebdb7ad-e5da0167-d59bdd1e",
    domain: DOMAIN
});

const BuyerAccount = mongoose.model('BuyerAccount', BuyerAccountSchema);
const BuyerBiodata = mongoose.model('BuyerBiodata', BuyerBiodataSchema);
const BuyerFollowing = mongoose.model('BuyerFollowing', BuyerFollowingSchema);
const ShopFollow = mongoose.model('ShopFollow', ShopFollowSchema);
const TokenAccount = mongoose.model('TokenAccount', TokenAccountSchema);
const Product = mongoose.model('Product', ProductSchema);
const SellerShop = mongoose.model('SellerShop', SellerShopSchema);
const Voucher = mongoose.model('Voucher', VoucherSchema);
const CartBuyer = mongoose.model('CartBuyer', CartBuyerSchema);
const Order = mongoose.model('Order', OrderSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Testing = mongoose.model('Testing', TestingSchema);

// UPLOAD
const uploadImgSelfBuyer = uploadUsrImg.single('imgSelfBuyer');
// UPDATE
const imgSelfBuyerUpdate = uploadUsrImg.single('imgSelfBuyerUpdate');

export const loginRequiredBuyer = async (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorization User' });
    }
};

// Belum di Test
export const buyerRegisterAccount = async (req, res) => {
    try {
        const newBuyer = new BuyerAccount(req.body);
        var salt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.createHmac("sha256", salt)
            .update(req.body.passwordBuyer)
            .digest('hex');

        newBuyer.passwordBuyer = salt + "$" + hash;
        const findBuyerAccount = await BuyerAccount.findOne({
            emailBuyer: req.body.emailBuyer
        });

        if (findBuyerAccount) {
            return res.status(200).json({
                success: false,
                message: 'Tidak dapat mendaftar. Akun sudah ada!'
            });
        } else if (!findBuyerAccount) {
            try {
                const data = {
                    from: 'Kodelapo Account <no-reply@kodelapo.com>',
                    to: req.body.emailSeller,
                    subject: 'Email verifikasi',
                    html: `<body class="em_body" style="margin:0px auto; padding:0px;" bgcolor="#efefef">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" align="center" bgcolor="#efefef">
                            <tr>
                                <td align="center" valign="top"><table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:650px; table-layout:fixed;">
                                    <tr>
                                        <td align="center" valign="top" style="padding:0 25px;" class="em_aside10"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td height="26" style="height:26px;" class="em_h20">&nbsp;</td>
                                            </tr>
                                            <tr><td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;"><img src="https://drive.google.com/uc?id=1Q6Uo4eLetR1gIKzQvokgZo5GgT3JVSFM" width="208" height="41" alt="kodelapo" border="0" style="display:block; font-family:Arial, sans-serif; font-size:18px; line-height:25px; text-align:center; color:#1d4685; font-weight:bold; max-width:208px;" class="em_w150" /></a></td></tr>
                                            <tr>
                                                <td height="28" style="height:28px;" class="em_h20">&nbsp;</td>
                                            </tr>
                                        </table>
                                        </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                        </table>
                        <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                            <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
                                <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                                    <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#1d4685"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                                        <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                            Ini adalah pesan konfirmasi. Jangan pernah sebarkan token dibawah ini ke siapapun.
                                                          </td>
                                        </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                            Apabila kamu memiliki kendala, harap hubungi admin kodelapo.
                                                          </td>
                                            </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                            </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box;font-size: 14px; margin: 0;">
                                            <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                &mdash; Tim Akun Kodelapo
                                            </td>
                                            </tr></table></td>
                                    </tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                                        <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">Follow <a href="http://instagram.com/kodelapo" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@kodelapo</a> on Instagram.</td>
                                        </tr></table></div></div>
                            </td>
                            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                        </tr></table></body>`
                };

                mg.messages().send(data, async (error, body) => {
                    if (error) {
                        console.log(error);
                        return res.status(200).json({
                            success: false,
                            message: 'Maaf ada gangguan service! Silahkan daftar ulang!'
                        });
                    } else {
                        try {
                            console.log(body);
                            await newBuyer.save();
                            return res.status(200).json({
                                success: true,
                                message: 'Akun berhasil dibuat'
                            });
                        } catch (error) {
                            return res.status(200).json({
                                success: false,
                                message: 'Maaf ada gangguan service! Silahkan daftar ulang!'
                            });
                        }
                    }
                })
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

// Belum di Test
export const buyerLoginAccount = async (req, res) => {
    try {
        const findBuyerAccount = await BuyerAccount.findOne({
            emailBuyer: req.body.emailBuyer
        });
        if (!findBuyerAccount) {
            return res.status(200).json({
                success: false,
                message: 'Autentikasi salah. Akun tidak ditemukan!'
            });
        } else {
            var passwordField = findSellerAccount.passwordBuyer.split('$');
            var salt = passwordField[0];
            var hash = crypto.createHmac('sha256', salt)
                .update(req.body.passwordBuyer)
                .digest('hex');

            if (!(hash == passwordField[1])) {
                return res.status(200).json({
                    success: false,
                    message: 'Password salah!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    token: jwt.sign({
                        emailSeller: findBuyerAccount.emailBuyer,
                        _id: findBuyerAccount._id
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

// Belum di Test
export const postResubmitTokenBuyer = async (req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailBuyer
        });
        if (!oneToken) {
            let randomToken = Math.random().toString(16).substring(9);
            const token = new TokenAccount(
                req.body.idBuyerAccount,
                req.body.emailBuyer,
                randomToken
            )
            await token.save();
            return res.status(200).json({
                success: true,
                message: 'Token berhasil di kirim'
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Token sudah dikirim sebelumnya...'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getTokenCodeBuyer = async (req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailBuyer
        });
        if (oneToken.tokenVerify === req.body.tokenVerify) {
            try {
                await BuyerAccount.findOneAndUpdate({
                    emailBuyer: req.body.emailBuyer
                }, {
                    $set: {
                        emailVerifyStatus: true
                    }
                });
                return res.status(200).json({
                    success: true,
                    message: 'Token terkonfirmasi'
                });
            } catch (error) {
                console.log(error);
                return res.status(200).json({
                    success: false,
                    message: 'Ada kesalahan'
                });
            }
        } else {
            return res.status(200).json({
                success: false,
                message: 'Token salah'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const postBuyerBiodata = async (req, res) => {
    try {
        uploadImgSelfBuyer(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                let oneBuyerBiodata = new BuyerBiodata(req.body);
                oneBuyerBiodata.imgSelfBuyer = req.file.location;
                oneBuyerBiodata.save();
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil menambahkan'
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getBuyerBiodata = async (req, res) => {
    try {
        const oneBuyerBiodata = await BuyerBiodata.findOne({
            idBuyerAccount: req.params.idBuyerAccount
        });
        if (oneBuyerBiodata) {
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil data',
                result: oneBuyerBiodata
            });
        } else if (!oneBuyerBiodata) {
            return res.status(200).json({
                success: false,
                message: 'Silahkan isi data diri kamu',
                result: oneBuyerBiodata
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const putBuyerBiodata = async (req, res) => {
    try {
        let oneBiodata = await BuyerBiodata.findOneAndUpdate({
            idBuyerAccount: req.params.idBuyerAccount
        });
        if (oneBiodata) {
            oneBiodata = new BuyerBiodata(req.body);
            await oneBiodata.save();
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil',
                result: oneBiodata
            });
        } else if (!oneBiodata) {
            return res.status(200).json({
                success: false,
                message: 'Maaf ada gangguan server!'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const postFollowShop = async (req, res) => {
    try {
        await BuyerFollowing.findOneAndUpdate(req.body.idBuyerAccount, {
            $push: {
                "following.idSellerAccount": req.body.idSellerAccount
            },
            $inc: {
                sumFollowing: 1
            }
        }, { new: true, upsert: true })
        await ShopFollow.findOneAndUpdate(req.body.idSellerAccount, {
            $push: {
                "followers.idBuyerAccount": req.body.idBuyerAccount
            },
            $inc: {
                sumFollowers: 1
            }
        }, { new: true, upsert: true });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengikuti'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const unFollowShop = async (req, res) => {
    try {
        await BuyerFollowing.findOneAndUpdate(req.body.idBuyerAccount, {
            $pull: {
                "following.idSellerAccount": req.body.idSellerAccount
            },
            $inc: {
                sumFollowing: -1
            }
        }, { new: true, upsert: true })

        await ShopFollow.findOneAndUpdate(req.body.idSellerAccount, {
            $pull: {
                "followers.idBuyerAccount": req.body.idBuyerAccount
            },
            $inc: {
                sumFollowers: -1
            }
        }, { new: true, upsert: true });
        return res.status(200).json({
            success: true,
            message: 'Berhasil unfollow'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
// Next iteration
export const getAllShopFollowing = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getShopIsFollowing = async (req, res) => {
    try {
        const oneShop = await BuyerFollowing.findOne({
            idBuyerAccount: req.body.idBuyerAccount,
            "following.idSellerAccount": req.body.idSellerAccount
        });
        if (oneShop) {
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil data',
                following: true
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil data',
                following: false
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getOneProductBuyer = async (req, res) => {
    try {
        const oneProduct = await Product.findById(req.params.idProduct);
        if (oneProduct) {
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil',
                result: oneProduct
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Maaf product tidak ditemukan',
                result: oneProduct
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getProductByBuyer = async (req, res) => {
    try {
        var options = {
            page: req.query.page,
            limit: req.query.limit
        }
        const allProduct = await Product.paginate({
            productCategory: req.query.type
        }, options);

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: allProduct
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getSearchProductByBuyer = async (req, res) => {
    try {
        var query = new RegExp(req.query.name, 'i');
        var options = {
            page: req.query.page,
            limit: req.query.limit
        };
        const allProduct = await Product.paginate({
            productCategory: req.query.type,
            nameProduct: query
        }, options);

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: allProduct
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getShopList = async (req, res) => {
    try {
        var options = {
            page: req.query.page,
            limit: req.query.limit
        };
        const allShopList = await SellerShop.paginate({}, options);

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: allShopList
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getOneShopInfo = async (req, res) => {
    try {
        const oneShop = await SellerShop.findOne({
            idSellerAccount: req.params.idSellerAccount
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
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

// Belum di Test
export const getSearchShopList = async (req, res) => {
    try {
        var query = new RegExp(req.query.name, 'i');
        var options = {
            page: req.query.page,
            limit: req.query.limit
        };
        const allShopList = await SellerShop.paginate({
            nameShop: query
        }, options);

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: allShopList
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getOneVoucherInfo = async (req, res) => {
    try {
        const oneVoucher = await Voucher.findById({
            idSellerAccount: req.body.idSellerAccount,
            codeVoucher: req.body.codeVoucher
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            oneVoucher
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getVoucherActiveFromShop = async (req, res) => {
    try {
        const findAllActiveVoucher = await Voucher.find({
            idSellerAccount: req.body.idSellerAccount,
            validity: {
                $lt: Date.now
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            findAllActiveVoucher
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getOneNotificationBuyer = async (req, res) => {
    try {
        const oneNotification = await Notification.findByIdAndUpdate(req.params.idNotification, {
            $set: {
                isRead: "read"
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: oneNotification
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getNotificationBuyer = async (req, res) => {
    try {
        const findAllNotification = await Notification.find({
            idUser: req.params.idBuyerAccount
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: findAllNotification
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

//Belum di Test
export const postOneProductToCart = async (req, res) => {
    try {
        let oneProductToCart = await CartBuyer.findOneAndUpdate({
            idBuyerAccount: req.params.idBuyerAccount,
            "products.idSellerAccount": req.body.idSellerAccount
        }, {
            $push: {
                "products": [{
                    idSellerAccount: req.body.idSellerAccount,
                    nameShop: req.body.nameShop,
                    addressShop: req.body.addressShop,
                    idProduct: req.body.idProduct,
                    imgProduct: req.body.imgProduct,
                    productPrice: req.body.productPrice,
                    qtyProduct: req.body.qtyProduct,
                    noteProduct: req.body.noteProduct
                }]
            }
        }, {
            new: true, upsert: true
        });
        if (oneProductToCart) {
            return res.status(200).json({
                success: false,
                message: 'Product sudah di keranjang nih!'
            });
        } else {
            return res.status(200).json({
                success: true,
                message: 'Product sudah dimasukkan ke keranjang!'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

//Belum di Test
export const deleteOneProductFromCart = async (req, res) => {
    try {
        await CartBuyer.findOneAndUpdate({
            idBuyerAccount: req.params.idBuyerAccount
        }, {
            $pull: {
                "products._id": req.body.idKeranjangProduct
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Product sudah dihapus dari keranjang!'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const deleteMultipleProductFromCart = async (req, res) => {
    try {
        let arrayIdProduct = req.body.products
        await CartBuyer.findOneAndUpdate({
            idBuyerAccount: req.params.idBuyerAccount
        }, {
            $pull: {
                "products._id": {
                    $in: [arrayIdProduct]
                }
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Product sudah dihapus dari keranjang!'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const putOneProductCart = async (req, res) => {
    try {
        await CartBuyer.findOneAndUpdate({
            idBuyerAccount: req.params.idBuyerAccount,
            "products._id": req.body.idKeranjangProduct
        }, {
            $push: {
                "qtyProduct": req.body.qtyProduct,
                "noteProduct": req.body.noteProduct
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getKeranjangBuyer = async (req, res) => {
    try {
        const findAllKeranjangBuyer = await CartBuyer.find({
            idBuyerAccount: req.params.idBuyerAccount
        });
        return res.status(200).json({
            success: true,
            message: 'Data berhasil di ambil...',
            result: findAllKeranjangBuyer
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const postOneOrderBuyer = async (req, res) => {
    try {
        const oneOrder = new Order(req.body);
        const oneNotification = new Notification(
            req.body.idSellerAccount,
            "order",
            "unread",
            `Ada orderan nih...`
        )
        await oneOrder.save();
        await oneNotification.save();
        return res.status(200).json({
            success: true,
            message: 'Data berhasil ditambahkan'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test 
export const getAllOrderBuyer = async (req, res) => {
    try {
        const allOrderBuyer = Order.find({
            idBuyerAccount: req.params.idBuyerAccount,
            statusOrder: req.body.statusOrder
        });
        return res.status(200).json({
            success: true,
            message: 'Data berhasil diambil',
            result: allOrderBuyer
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getOneOrderBuyer = async (req, res) => {
    try {
        const oneOrder = Order.findById(req.params.idOrder);
        return res.status(200).json({
            success: true,
            message: 'Data berhasil diambil',
            result: oneOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}


// Belum di Test
export const putCancelOneOrder = async (req, res) => {
    try {
        await Order.findOneAndUpdate(req.params.idOrder, {
            $set: {
                statusOrder: true
            }
        });
        const oneNotification = new Notification(
            req.body.idSellerAccount,
            "cancel",
            "unread",
            `Wah, ada orderan yang dibatalkan, coba lihat...`
        )
        await oneNotification.save();
        return res.status(200).json({
            success: true,
            message: 'Order berhasil di ajukan batal'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const putFinishOrder = async (req, res) => {
    try {
        await Order.findOneAndUpdate(req.params.idOrder, {
            $set: {
                isFinish: true
            }
        });
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

// Belum di Test
export const postOneReviewBuyer = async (req, res) => {
    try {
        const oneReview = new Review(req.body);
        await oneReview.save();
        const oneNotification = new Notification(
            req.body.idSellerAccount,
            "review",
            "unread",
            "Lihat ada pembeli yang mereview pesanannya!"
        )
        await oneNotification.save();
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

// Belum di Test
export const getAllReviewBuyer = async (req, res) => {
    try {
        const allReview = await Review.find({
            idBuyerAccount: req.params.idBuyerAccount
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil',
            result: allReview
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getOneReviewBuyer = async (req, res) => {
    try {
        const oneReview = await Review.find(req.params.idReview);
        return res.status(200).json({
            success: true,
            message: 'Berhasil',
            result: oneReview
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const getAllReviewFromShop = async (req, res) => {
    try {
        const allReview = await Review.find({
            idSellerAccount: req.params.idSellerAccount
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Testing
export const postTesting = async (req, res) => {
    try {
        const oneTesting = new Testing(req.body);
        oneTesting.imgUrl = req.file.location;
        await oneTesting.save();
        // console.log(req.body.name);
        // console.log(req.file.location);
        return res.status(200).json({
            success: true,
            message: 'Success!',
            result: oneTesting
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const updateImgSelfBuyer = async (req, res, next) => {
    try {
        imgSelfBuyerUpdate(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                next();
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengupdate gambar!'
        });
    }
}
// Sudah di Test [Middleware] - sample
// export const uploadSingleImg = async (req, res, next) => {
//     try {
//         uploadSample(req, res, err => {
//             if (err) {
//                 console.log(err);
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Image upload error!'
//                 });
//             } else {
//                 next();
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({
//             success: false,
//             message: 'Gagal mengupload gambar!'
//         });
//     }
// }