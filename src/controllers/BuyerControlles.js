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
import { NotificationSchema } from '../models/NotificationModel';
import {
    uploadUsrImg
} from '../configs/upload';

const mailgun = require("mailgun-js");
const DOMAIN = 'nicolasmanurung.tech';
const mg = mailgun({
    apiKey: "key-cb0c873e189ae11c0fd69b368afcc5ce",
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
const Notification = mongoose.model('Notification', NotificationSchema);
// UPLOAD
const uploadMultipleBiodata = uploadUsrImg.fields([{
        name: 'imgKtpBuyer',
        maxCount: 1
    }, {
        name: 'imgSelfBuyer',
        maxCount: 1
    }])
    // UPDATE
const imgSelfBuyerUpdate = uploadUsrImg.single('imgSelfBuyerUpdate');

export const loginRequiredBuyer = async(req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorization User' });
    }
};

// Testing JWT
export const jwtBuyerTesting = async(req, res, next) => {
    try {
        return res.status(200).json({
            email: req.user.emailBuyer,
            idUser: req.user._id
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Ada kesalahan!'
        });
    }
}

// Belum di Test
export const buyerRegisterAccount = async(req, res) => {
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
                var tokenVerify = Math.random().toString(16).substring(9);
                const oneToken = await TokenAccount.findOne({
                    emailAccount: req.body.emailBuyer
                });
                const emailAccount = req.body.emailBuyer;

                //console.log("oneToken->" + oneToken);
                if (!oneToken) {
                    const token = new TokenAccount({
                        emailAccount,
                        tokenVerify
                    });

                    await token.save();
                    //console.log("token ->" + token);
                } else {
                    tokenVerify = oneToken.tokenVerify;
                }

                const data = {
                    from: 'Kodelapo Account <no-reply@kodelapo.com>',
                    to: req.body.emailBuyer,
                    subject: 'Email verifikasi',
                    html: `<table dir="ltr">
                    <tbody>
                        <tr>
                            <td style="padding:0;font-family:'Segoe UI Semibold','Segoe UI Bold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:17px;color:#FF7676">Akun <span class="il">Kodelapo</span></td>
                        </tr>
                        <tr>
                            <td style="padding:0;font-family:'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:41px;color:#2672ec">Kode keamanan</td>
                        </tr>
                        <tr>
                            <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">
                                Gunakan kode keamanan berikut untuk akun <span class="il">Kodelapo</span> <a dir="ltr" id="m_6439999066462717123iAccount" class="m_6439999066462717123link" style="color:#2672ec;text-decoration:none" href="` + req.body.emailBuyer + `" target="_blank">` + req.body.emailBuyer + `</a>.
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">
                                Kode keamanan: <span style="font-family:'Segoe UI Bold','Segoe UI Semibold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:14px;font-weight:bold;color:#2a2a2a">` + tokenVerify + `</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">Terima kasih,</td>
                        </tr>
                        <tr>
                            <td style="padding:0;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">Tim akun <span class="il">Kodelapo</span></td>
                        </tr>
                    </tbody>
                </table>`
                };

                mg.messages().send(data, async(error, body) => {
                    if (error) {
                        console.log(error);
                        return res.status(200).json({
                            success: false,
                            message: 'Maaf ada gangguan email service! Silahkan daftar ulang!'
                        });
                    } else {
                        try {
                            await newBuyer.save();
                            return res.status(200).json({
                                success: true,
                                message: 'Akun berhasil dibuat'
                            });
                        } catch (error) {
                            console.log(error)
                            return res.status(200).json({
                                success: false,
                                message: 'Maaf ada gangguan database service! Silahkan daftar ulang!'
                            });
                        }
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
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test
export const buyerLoginAccount = async(req, res) => {
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
            var passwordField = findBuyerAccount.passwordBuyer.split('$');
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
                    username: findBuyerAccount._id,
                    token: jwt.sign({
                        emailBuyer: findBuyerAccount.emailBuyer,
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
export const postResubmitTokenBuyer = async(req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailBuyer
        });
        const emailAccount = req.body.emailBuyer
        let tokenVerify = Math.random().toString(16).substring(9);
        if (!oneToken) {

            const token = new TokenAccount({
                emailAccount,
                tokenVerify
            })
            await token.save();
            const data = {
                from: 'Kodelapo Account <no-reply@kodelapo.com>',
                to: req.body.emailBuyer,
                subject: 'Email verifikasi',
                html: `<table dir="ltr">
                <tbody>
                    <tr>
                        <td style="padding:0;font-family:'Segoe UI Semibold','Segoe UI Bold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:17px;color:#FF7676">Akun <span class="il">Kodelapo</span></td>
                    </tr>
                    <tr>
                        <td style="padding:0;font-family:'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:41px;color:#2672ec">Kode keamanan</td>
                    </tr>
                    <tr>
                        <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">
                            Gunakan kode keamanan berikut untuk akun <span class="il">Kodelapo</span> <a dir="ltr" id="m_6439999066462717123iAccount" class="m_6439999066462717123link" style="color:#2672ec;text-decoration:none" href="` + emailAccount + `" target="_blank">` + emailAccount + `</a>.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">
                            Kode keamanan: <span style="font-family:'Segoe UI Bold','Segoe UI Semibold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:14px;font-weight:bold;color:#2a2a2a">` + tokenVerify + `</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">Terima kasih,</td>
                    </tr>
                    <tr>
                        <td style="padding:0;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">Tim akun <span class="il">Kodelapo</span></td>
                    </tr>
                </tbody>
            </table>`
            };

            mg.messages().send(data, async(error, body) => {
                if (error) {
                    console.log(error);
                    return res.status(200).json({
                        success: false,
                        message: 'Maaf ada gangguan email service! Silahkan daftar ulang!'
                    });
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Token berhasil di kirim'
            });
        } else {
            tokenVerify = oneToken.tokenVerify;
            const data = {
                from: 'Kodelapo Account <no-reply@kodelapo.com>',
                to: req.body.emailBuyer,
                subject: 'Email verifikasi',
                html: `<table dir="ltr">
                <tbody>
                    <tr>
                        <td style="padding:0;font-family:'Segoe UI Semibold','Segoe UI Bold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:17px;color:#FF7676">Akun <span class="il">Kodelapo</span></td>
                    </tr>
                    <tr>
                        <td style="padding:0;font-family:'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:41px;color:#2672ec">Kode keamanan</td>
                    </tr>
                    <tr>
                        <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">
                            Gunakan kode keamanan berikut untuk akun <span class="il">Kodelapo</span> <a dir="ltr" id="m_6439999066462717123iAccount" class="m_6439999066462717123link" style="color:#2672ec;text-decoration:none" href="` + req.body.emailBuyer + `" target="_blank">` + req.body.emailBuyer + `</a>.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">
                            Kode keamanan: <span style="font-family:'Segoe UI Bold','Segoe UI Semibold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;font-size:14px;font-weight:bold;color:#2a2a2a">` + tokenVerify + `</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0;padding-top:25px;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">Terima kasih,</td>
                    </tr>
                    <tr>
                        <td style="padding:0;font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif;font-size:14px;color:#2a2a2a">Tim akun <span class="il">Kodelapo</span></td>
                    </tr>
                </tbody>
            </table>`
            };

            mg.messages().send(data, async(error, body) => {
                if (error) {
                    console.log(error);
                    return res.status(200).json({
                        success: false,
                        message: 'Maaf ada gangguan email service! Silahkan daftar ulang!'
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Token berhasil di kirim'
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        })
    }
}

// Belum di Test
export const getTokenCodeBuyer = async(req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailBuyer
        });

        if (oneToken) {
            if (oneToken.tokenVerify === req.body.tokenVerify) {
                try {
                    await BuyerAccount.findOneAndUpdate({
                        emailBuyer: req.body.emailBuyer
                    }, {
                        $set: {
                            emailVerifyStatus: true
                        }
                    });
                    await oneToken.remove();
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
        } else if (!oneToken) {
            return res.status(401).json({
                success: false,
                message: 'Maaf token sudah kadaluarsa! Buat ulang!'
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
export const postBuyerBiodata = async(req, res) => {
    try {
        uploadMultipleBiodata(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                let oneBuyerBiodata = new BuyerBiodata(req.body);
                oneBuyerBiodata.imgSelfBuyer = req.files['imgSelfBuyer'][0].key;
                oneBuyerBiodata.imgKtpBuyer = req.files['imgKtpBuyer'][0].key;
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
export const getBuyerBiodata = async(req, res) => {
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
export const putBuyerBiodata = async(req, res) => {
    try {
        const {
            nameBuyer,
            noTelpBuyer,
            addressBuyer
        } = req.body;

        let oneBiodata = await BuyerBiodata.findOneAndUpdate({
            idBuyerAccount: req.params.idBuyerAccount
        }, {
            nameBuyer,
            noTelpBuyer,
            addressBuyer
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: oneBiodata
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
export const postFollowShop = async(req, res) => {
    try {
        await BuyerFollowing.findOneAndUpdate({ idBuyerAccount: req.body.idBuyerAccount }, {
            $set: {
                "idBuyerAccount": req.body.idBuyerAccount
            },
            $push: {
                "following.idSellerAccount": req.body.idSellerAccount
            },
            $inc: {
                sumFollowing: 1
            }
        }, { new: true, upsert: true })

        await ShopFollow.findOneAndUpdate({ idSellerAccount: req.body.idSellerAccount }, {
            $set: {
                "idSellerAccount": req.body.idSellerAccount,
            },
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
export const unFollowShop = async(req, res) => {
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
export const getAllShopFollowing = async(req, res) => {
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
export const getShopIsFollowing = async(req, res) => {
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
export const getOneProductBuyer = async(req, res) => {
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
export const getProductByBuyer = async(req, res) => {
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

export const getProductCategorizeByUmkm = async(req, res) => {
    try {
        const products = await Product.find({
            umkmTags: req.query.umkm
        })

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: products
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const getPopularProduct = async(req, res) => {
    try {
        var options = {
            page: req.query.page,
            limit: req.query.limit
        }

        const allProduct = await Product.paginate({}, options);

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
export const getSearchProductByBuyer = async(req, res) => {
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
export const getShopList = async(req, res) => {
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
export const getOneShopInfo = async(req, res) => {
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
export const getSearchShopList = async(req, res) => {
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
export const getOneVoucherInfo = async(req, res) => {
    try {
        const oneVoucher = await Voucher.findOne({
            idSellerAccount: req.body.idSellerAccount,
            codeVoucher: req.body.codeVoucher
        });
        if (oneVoucher) {
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil data',
                oneVoucher
            });
        } else if (!oneVoucher) {
            return res.status(200).json({
                success: false,
                message: 'Data kosong',
                oneVoucher
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
export const getVoucherActiveFromShop = async(req, res) => {
    try {
        const findAllActiveVoucher = await Voucher.find({
            idSellerAccount: req.body.idSellerAccount,
            validity: {
                $gte: Date.now()
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
export const getOneNotificationBuyer = async(req, res) => {
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
export const getNotificationBuyer = async(req, res) => {
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
export const postOneProductToCart = async(req, res) => {
    try {
        const oneProductToCart = await CartBuyer.findOne({
            idBuyerAccount: req.params.idBuyerAccount,
            idProduct: req.body.idProduct,
        });

        if (oneProductToCart) {
            return res.status(200).json({
                success: false,
                message: 'Product sudah di keranjang nih!'
            });
        } else if (!oneProductToCart) {
            const product = {
                idBuyerAccount: req.params.idBuyerAccount,
                idSellerAccount: req.body.idSellerAccount,
                nameShop: req.body.nameShop,
                addressShop: req.body.addressShop,
                idProduct: req.body.idProduct,
                imgProduct: req.body.imgProduct,
                productPrice: req.body.productPrice,
                qtyProduct: req.body.qtyProduct,
                noteProduct: req.body.noteProduct
            }
            const newProductToCart = new CartBuyer(product);
            await newProductToCart.save();
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
export const deleteOneProductFromCart = async(req, res) => {
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
export const deleteMultipleProductFromCart = async(req, res) => {
    try {
        await CartBuyer.deleteMany({
            idBuyerAccount: req.params.idBuyerAccount,
            idProduct: {
                $in: req.body.products
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
export const putOneProductCart = async(req, res) => {
    try {
        await CartBuyer.updateOne({
            idBuyerAccount: req.params.idBuyerAccount,
            idProduct: req.body.idProduct
        }, {
            $set: {
                qtyProduct: req.body.qtyProduct,
                noteProduct: req.body.noteProduct
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil!'
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
export const getKeranjangBuyer = async(req, res) => {
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
export const postOneOrderBuyer = async(req, res) => {
    try {
        const oneOrder = new Order(req.body);
        await oneOrder.save()

        const oneNotification = new Notification({
            idUser: req.body.idSellerAccount,
            statusNotification: "order",
            refId: oneOrder._id,
            isRead: "unread",
            descNotification: `Ada orderan baru nih...`
        });

        await oneNotification.save();
        await oneOrder.save();
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
export const getAllOrderBuyer = async(req, res) => {
    try {
        const allOrderBuyer = await Order.find({
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
export const getOneOrderBuyer = async(req, res) => {
    try {
        const oneOrder = await Order.findById(req.params.idOrder);
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
export const putCancelOneOrder = async(req, res) => {
    try {
        const order = await Order.findOneAndUpdate(req.params.idOrder, {
            $set: {
                isCancelBuyer: true
            }
        });
        const oneNotification = new Notification({
            idUser: req.body.idSellerAccount,
            statusNotification: "cancel",
            refId: order.id,
            isRead: "unread",
            descNotification: `Wah, ada orderan yang minta dibatalkan, coba lihat...`
        })
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
export const putFinishOrder = async(req, res) => {
    try {
        const order = await Order.findOneAndUpdate(req.params.idOrder, {
            $set: {
                isCancelSeller: null,
                isCancelBuyer: null,
                // isFinish: true
            }
        });
        // Review Created

        const {
            _id: idOrder,
            idBuyerAccount,
            idSellerAccount,
            products: product
        } = order

        const jobQuerys = [];
        product.forEach(item => {
            const review = new Review({
                idSellerAccount,
                idBuyerAccount,
                idOrder,
                idProduct: item.idProduct,
                nameProduct: item.nameProduct
            });
            jobQuerys.push(review.save());
        });

        //console.log(product);
        await Promise.all(jobQuerys);
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
export const postOneReviewBuyer = async(req, res) => {
    try {
        const review = await Review.findOneAndUpdate(req.params.idReview, {
            $set: {
                nameReviewer: req.body.nameReviewer,
                starReview: req.body.starReview,
                textOfReview: req.body.textOfReview,
                statusReview: "reviewed"
            }
        });
        const oneNotification = new Notification({
            idUser: req.body.idSellerAccount,
            statusNotification: "review",
            refId: review.id,
            isRead: "unread",
            descNotification: "Lihat ada pembeli yang mereview pesanannya!"
        })
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
export const getAllReviewBuyer = async(req, res) => {
    try {
        const allReview = await Review.find({
            idBuyerAccount: req.params.idBuyerAccount,
            statusReview: req.query.status
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
export const getOneReviewBuyer = async(req, res) => {
    try {
        const oneReview = await Review.findById(req.params.idReview);
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
export const getAllReviewFromShop = async(req, res) => {
    try {
        const allReview = await Review.find({
            idSellerAccount: req.params.idSellerAccount
        })
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

// Testing
export const postTesting = async(req, res) => {
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

export const updateImgSelfBuyer = async(req, res, next) => {
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