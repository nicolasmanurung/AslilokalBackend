import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
    updateProductImg,
    // UPDATE
    updateSellerImg,
    uploadProductImg,
    // UPLOAD
    uploadUsrImg
} from '../configs/upload';
import { DebtorSchema } from '../models/DebtorModel';
import { NotificationSchema } from '../models/NotificationModel';
import { OrderSchema } from '../models/OrderModel';
import { ProductSchema } from "../models/ProductModel";
import { SellerAccountSchema } from "../models/SellerAccountModel";
import { SellerBiodataSchema } from "../models/SellerBiodataModel";
import { SellerShopSchema } from "../models/SellerShopModel";
import { TokenAccountSchema } from "../models/TokenAccountModel";
import { VoucherSchema } from '../models/VoucherModel';
import { SellerRevenueSchema } from '../models/SellerRevenue';
import { OrderRevenueSchema } from '../models/OrderRevenue';

const mailgun = require("mailgun-js");
const DOMAIN = 'nicolasmanurung.tech';
const mg = mailgun({
    apiKey: "key-cb0c873e189ae11c0fd69b368afcc5ce",
    domain: DOMAIN
});

const SellerAccount = mongoose.model('SellerAccount', SellerAccountSchema);
const SellerBiodata = mongoose.model('SellerBiodata', SellerBiodataSchema);
const SellerShop = mongoose.model('SellerShop', SellerShopSchema);
const TokenAccount = mongoose.model('TokenAccount', TokenAccountSchema);
const Product = mongoose.model('Product', ProductSchema);
const Debtor = mongoose.model('Debtor', DebtorSchema);
const Voucher = mongoose.model('Voucher', VoucherSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Order = mongoose.model('Order', OrderSchema);
const SellerRevenue = mongoose.model('SellerRevenue', SellerRevenueSchema);
const OrderRevenue = mongoose.model('OrderRevenue', OrderRevenueSchema);

// UPLOAD
const uploadImgProduct = uploadProductImg.single('imgProduct');
const uploadKtpBiodata = uploadUsrImg.single('ktpImgSeller');
const uploadShop = uploadUsrImg.single('imgShop');
const uploadSellerMultiple = uploadUsrImg.fields([{
        name: 'imgSelfSeller',
        maxCount: 1
    },
    {
        name: 'ktpImgSeller',
        maxCount: 1
    }
]);

// UPDATE
const imgSelfSellerUpdate = updateSellerImg.single('imgSelfSellerUpdate')
const imgShopImgUpdate = updateSellerImg.single('imgShopImgUpdate');
const imgKtpSellerUpdate = updateSellerImg.single('imgKtpSellerUpdate');
const imgProductSellerUpdate = updateProductImg.single('imgProductSellerUpdate');


// Middleware
export const loginRequiredSeller = async(req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorization User' });
    }
};

// Testing JWT
export const jwtSellerTesting = async(req, res, next) => {
    try {
        return res.status(200).json({
            email: req.user.emailSeller,
            idUser: req.user._id
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Ada kesalahan!'
        });
    }
}

// Done
export const sellerRegisterAccount = async(req, res) => {
    try {
        var tokenVerify = Math.random().toString(16).substring(9);
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailSeller
        });
        const emailAccount = req.body.emailSeller;

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

        const newSeller = new SellerAccount(req.body);
        var salt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.createHmac("sha256", salt)
            .update(req.body.passSeller)
            .digest('hex');

        newSeller.passSeller = salt + "$" + hash;
        const findSellerAccount = await SellerAccount.findOne({
            emailSeller: req.body.emailSeller
        });

        if (findSellerAccount) {
            return res.status(200).json({
                success: false,
                message: 'Tidak dapat mendaftar. Akun sudah ada!'
            });
        } else if (!findSellerAccount) {
            try {
                const data = {
                    from: 'Kodelapo Account <no-reply@kodelapo.com>',
                    to: newSeller.emailSeller,
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
                                Gunakan kode keamanan berikut untuk akun <span class="il">Kodelapo Seller</span> <a dir="ltr" id="m_6439999066462717123iAccount" class="m_6439999066462717123link" style="color:#2672ec;text-decoration:none" href="` + newSeller.emailSeller + `" target="_blank">` + newSeller.emailSeller + `</a>.
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
                            await newSeller.save();
                            return res.status(200).json({
                                success: true,
                                message: 'Akun berhasil dibuat',
                                username: newSeller._id,
                                emailVerifyStatus: newSeller.emailVerifyStatus,
                                shopVerifyStatus: newSeller.shopVerifyStatus,
                                token: jwt.sign({
                                    emailSeller: newSeller.emailSeller,
                                    _id: newSeller._id
                                }, "KODELAPOAPI")
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

// Done
export const sellerLoginAccount = async(req, res) => {
    try {
        const findSellerAccount = await SellerAccount.findOne({
            emailSeller: req.body.emailSeller
        });
        if (!findSellerAccount) {
            return res.status(200).json({
                success: false,
                message: 'Autentikasi salah. Akun tidak ditemukan!'
            });
        } else {
            var passwordField = findSellerAccount.passSeller.split('$');
            var salt = passwordField[0];
            var hash = crypto.createHmac('sha256', salt)
                .update(req.body.passSeller)
                .digest('hex');

            if (!(hash == passwordField[1])) {
                return res.status(200).json({
                    success: false,
                    message: 'Password salah!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    username: findSellerAccount._id,
                    emailVerifyStatus: findSellerAccount.emailVerifyStatus,
                    shopVerifyStatus: findSellerAccount.shopVerifyStatus,
                    token: jwt.sign({
                        emailSeller: findSellerAccount.emailSeller,
                        _id: findSellerAccount._id
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

// Done
export const postResubmitTokenSeller = async(req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.user.emailSeller
        });

        const emailAccount = req.user.emailSeller
        let tokenVerify = Math.random().toString(16).substring(9);
        if (!oneToken) {
            const token = new TokenAccount({
                emailAccount,
                tokenVerify
            })
            await token.save();
            const data = {
                from: 'Kodelapo Account <no-reply@kodelapo.com>',
                to: emailAccount,
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
                            Gunakan kode keamanan berikut untuk akun <span class="il">Kodelapo Seller</span> <a dir="ltr" id="m_6439999066462717123iAccount" class="m_6439999066462717123link" style="color:#2672ec;text-decoration:none" href="` + emailAccount + `" target="_blank">` + emailAccount + `</a>.
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
                to: emailAccount,
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
                            Gunakan kode keamanan berikut untuk akun <span class="il">Kodelapo Seller</span> <a dir="ltr" id="m_6439999066462717123iAccount" class="m_6439999066462717123link" style="color:#2672ec;text-decoration:none" href="` + emailAccount + `" target="_blank">` + emailAccount + `</a>.
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

// Done
export const getTokenCodeSeller = async(req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.user.emailSeller
        });

        if (oneToken) {
            if (oneToken.tokenVerify === req.body.tokenVerify) {
                try {
                    await SellerAccount.findOneAndUpdate({
                        emailSeller: req.user.emailSeller
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
            return res.status(200).json({
                success: false,
                message: 'Maaf token salah...'
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
export const postSellerBiodata = async(req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Berhasil menambahkan'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const putSellerShopRequestRegistration = async(req, res) => {
    try {
        await SellerAccount.findByIdAndUpdate(req.params.idSellerAccount, {
            $set: {
                shopVerifyStatus: req.body.status
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil menambahkan'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Done
export const getSellerBiodata = async(req, res) => {
    try {
        const oneSellerBiodata = await SellerBiodata.findOne({
            idSellerAccount: req.params.idSellerAccount
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: oneSellerBiodata
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
export const putSellerBiodata = async(req, res) => {
    try {

        const ovoNumber = req.body.paymentInfo.ovoNumber;
        const danaNumber = req.body.paymentInfo.danaNumber;
        const gopayNumber = req.body.paymentInfo.gopayNumber;

        const paymentInfo = ({
            ovoNumber: ovoNumber,
            danaNumber: danaNumber,
            gopayNumber: gopayNumber
        })

        const {
            nameSellerBiodata,
            idKtpNumber,
            telpNumber,
            birthDateSeller,
            addressSeller
        } = req.body

        let oneSellerBiodata = await SellerBiodata.findOneAndUpdate({
            idSellerAccount: req.params.idSellerAccount
        }, {
            nameSellerBiodata,
            idKtpNumber,
            telpNumber,
            birthDateSeller,
            addressSeller,
            paymentInfo
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil di update',
            result: oneSellerBiodata
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
export const postShopBiodata = async(req, res, next) => {
    try {
        uploadShop(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Kesalahan saat mengupdate gambar'
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

export const fillShopData = async(req, res) => {
    try {
        await SellerShop.findOneAndUpdate({
            idSellerAccount: req.body.idSellerAccount
        }, {
            $set: {
                idSellerAccount: req.body.idSellerAccount,
                nameShop: req.body.nameShop,
                noTelpSeller: req.body.noTelpSeller,
                noWhatsappShop: req.body.noWhatsappShop,
                isPickup: req.body.isPickup,
                isDelivery: req.body.isDelivery,
                imgShop: req.file.key,
                addressShop: req.body.addressShop,
                isTwentyFourHours: req.body.isTwentyFourHours,
                openTime: req.body.openTime,
                closeTime: req.body.closeTime
            }
        }, {
            new: true,
            upsert: true
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil menambahkan'
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
export const getShopBiodata = async(req, res) => {
    try {
        const oneShopBiodata = await SellerShop.findOne({
            idSellerAccount: req.params.idSellerAccount
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: oneShopBiodata
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
export const putShopBiodata = async(req, res) => {
    try {
        const {
            nameShop,
            noTelpSeller,
            noWhatsappShop,
            isPickup,
            isDelivery,
            addressShop,
            isTwentyFourHours,
            openTime,
            closeTime,
            sumFollowers
        } = req.body

        let oneShopBiodata = await SellerShop.findOneAndUpdate({
            idSellerAccount: req.params.idSellerAccount
        }, {
            nameShop,
            noTelpSeller,
            noWhatsappShop,
            isPickup,
            isDelivery,
            addressShop,
            isTwentyFourHours,
            openTime,
            closeTime,
            sumFollowers
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: oneShopBiodata
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
export const postOneProduct = async(req, res) => {
    try {
        uploadImgProduct(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                const oneProduct = new Product(req.body);
                oneProduct.imgProduct = req.file.key
                oneProduct.save();
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil menambahkan'
                });
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
export const getOneProduct = async(req, res) => {
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
export const getProductBySeller = async(req, res) => {
    try {
        var query = req.query.name;
        var options = {
            page: req.query.page,
            limit: req.query.limit
        }
        const allProduct = await Product.paginate({
            idSellerAccount: req.query.idSellerAccount,
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
export const getSearchProductBySeller = async(req, res) => {
    try {
        var query = new RegExp(req.query.name, 'i');
        var options = {
            page: req.query.page,
            limit: req.query.limit
        };
        const allProduct = await Product.paginate({
            idSellerAccount: req.params.idSellerAccount,
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
export const putOneProduct = async(req, res) => {
    try {
        const {
            nameProduct,
            productCategory,
            priceProduct,
            productWeight,
            priceServiceRange,
            promoPrice,
            descProduct,
            isAvailable,
        } = req.body

        let oneProduct = await Product.findByIdAndUpdate(req.params.idProduct, {
            nameProduct,
            productCategory,
            priceProduct,
            productWeight,
            priceServiceRange,
            promoPrice,
            descProduct,
            isAvailable,
        });

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: oneProduct
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
export const postOneDebtor = async(req, res) => {
    try {
        const oneDebtor = new Debtor(req.body);
        await oneDebtor.save();
        return res.status(200).json({
            success: true,
            message: 'Berhasil menambahkan'
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
export const getAllDebtorBySeller = async(req, res) => {
    try {
        const allDebtor = await Debtor.find({
            idSellerAccount: req.params.idSellerAccount,
            createAt: {
                $gt: new Date(req.query.year + ',' + req.query.month)
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: allDebtor
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
export const putOneDebtorLunas = async(req, res) => {
    try {
        const {
            nameDebtor,
            totalDebt,
            descDebt,
            statusTransaction
        } = req.body

        await Debtor.findByIdAndUpdate(req.params.idDebtor, {
            nameDebtor,
            totalDebt,
            descDebt,
            statusTransaction
        });

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengedit'
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
export const postOneVoucher = async(req, res) => {
    try {
        const findOneVoucher = await Voucher.findOne({
            idSellerAccount: req.body.idSellerAccount,
            codeVoucher: req.body.codeVoucher
        })
        if (findOneVoucher) {
            return res.status(200).json({
                success: false,
                message: 'Voucher sudah ada!'
            });
        } else {
            const oneVoucher = new Voucher(req.body);
            await oneVoucher.save();
            return res.status(200).json({
                success: true,
                message: 'Berhasil menambahkan'
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

export const getVoucherBySeller = async(req, res) => {
    try {
        const findAllVoucher = await Voucher.find({
            idSellerAccount: req.params.idSellerAccount
                // validity: {
                //     $gt: new Date(Date.now())
                // }
        });
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: findAllVoucher
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

export const deleteVoucherById = async(req, res) => {
    try {
        await Voucher.findByIdAndDelete(req.params.idVoucher);
        return res.status(200).json({
            success: true,
            message: 'Berhasil menghapus voucher'
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
export const getNotificationBySeller = async(req, res) => {
    try {
        const findAllNotification = await Notification.find({
            idUser: req.params.idSellerAccount,
            createdAt: {
                $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
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

// Belum di Test
export const getOneNotificationSeller = async(req, res) => {
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

// Sudah di Test
// export const getAllOrderSeller = async(req, res) => {
//     try {
//         const allOrder = await Order.find({
//             idSellerAccount: req.params.idSellerAccount,
//             statusOrder: req.query.status
//         });
//         return res.status(200).json({
//             success: true,
//             message: 'Berhasil mengambil data',
//             result: allOrder
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({
//             success: false,
//             message: 'Maaf ada gangguan server!'
//         });
//     }
// }

//Sudah di Test
export const getAllOrderSeller = async(req, res) => {
    try {
        // Tambahi untuk Proses, Menunggu dan Selesai (30 hari terakhir)
        // Ganti menjadi Date = query.date
        const allOrder = await Order.find({
            idSellerAccount: req.params.idSellerAccount,
            statusOrder: req.query.status
                // orderAt: {
                //     $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                // }
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
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

// Belum di Test
export const getOneOrderSeller = async(req, res) => {
    try {
        const oneOrder = await Order.findById(req.params.idOrder);
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
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
// Belum Bayar, Dibayar, DiProses, Menunggu, Selesai
export const putStatusOrder = async(req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.idOrder, {
            $set: {
                statusOrder: req.body.statusOrder,
                acceptAt: new Date.now
            }
        });

        const oneNotification = new Notification({
            idUser: req.body.idBuyerAccount,
            statusNotification: req.body.statusOrder,
            refId: req.params.idOrder,
            isRead: "unread",
            descNotification: "Lihat status pesanan mu telah berubah!"
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
export const putAcceptCancelOrder = async(req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.idOrder, {
            $set: {
                isCancelSeller: true
            }
        });
        const oneNotification = new Notification({
            idUser: req.body.idBuyerAccount,
            statusNotification: req.body.statusOrder,
            refId: req.params.idOrder,
            isRead: "unread",
            descNotification: "Pesanan kamu berhasil di batalkan"
        });

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
export const getOneVoucher = async(req, res) => {
    try {
        const oneVoucher = await Voucher.findById(req.params.idVoucher);
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: oneVoucher
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Maaf ada gangguan server!'
        });
    }
}

// Belum di Test [Middleware]
export const uploadOneProductImg = async(req, res, next) => {
    try {
        uploadImgProduct(req, res, err => {
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
            message: 'Gagal mengupload gambar!'
        });
    }
}

// Belum di Test [Middleware]
export const uploadOneKtpImg = async(req, res, next) => {
    try {
        const passingData = new SellerBiodata(req.body);
        uploadKtpBiodata(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                passingData.ktpImgSeller = req.file.name;
                console.log("req.file.location [KTP] ->" + req.file.name)
                next();
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengupload gambar!'
        });
    }
}

// Belum di Test [Middleware]
export const uploadOneShopImg = async(req, res, next) => {
    try {
        uploadShop(req, res, err => {
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
            message: 'Gagal mengupload gambar!'
        });
    }
}

// Belum di Test [Middleware]
export const uploadOneSelfImg = async(req, res, next) => {
    try {
        const passingData = new SellerBiodata(req.body);
        uploadSelf(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                passingData.imgSelfSeller = req.file.name;
                console.log("req.file.location [KTP] ->" + req.file.name)
                next();
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengupload gambar!'
        });
    }
}

export const updateSelfImage = async(req, res, next) => {
    try {
        imgSelfSellerUpdate(req, res, err => {
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

export const updateSellerSelfImage = async(req, res) => {
    try {
        imgSelfSellerUpdate(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil mengupdate'
                });
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

export const updateShopImage = async(req, res) => {
    try {
        imgShopImgUpdate(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil mengupdate'
                });
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

export const updateKtpImage = async(req, res) => {
    try {
        imgKtpSellerUpdate(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil mengupdate'
                });
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

export const updateProductImage = async(req, res) => {
    try {
        imgProductSellerUpdate(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil mengupdate'
                });
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


// Done
export const uploadMultipleImg = async(req, res, next) => {
    try {
        uploadSellerMultiple(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Kesalahan saat mengupdate gambar'
                });
            } else {
                next();
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengupdate gambar!'
        });
    }
}

export const fillData = async(req, res) => {
    try {
        const {
            idSeller = req.body.idSellerAccount,
                nameSeller = req.body.nameSellerBiodata,
                idKtp = req.body.idKtpNumber,
                telpNo = req.body.telpNumber,
                birthDate = req.body.birthDateSeller,
                address = req.body.addressSeller,
                imgSelf = req.files['imgSelfSeller'][0].key,
                ktpImg = req.files['ktpImgSeller'][0].key,
                ovoNumber = req.body.ovoNumber,
                danaNumber = req.body.danaNumber,
                gopayNumber = req.body.gopayNumber
        } = req.body;

        var dataUpdate = await SellerBiodata.findOneAndUpdate({
            idSellerAccount: req.body.idSellerAccount
        }, {
            $set: {
                idSellerAccount: idSeller,
                nameSellerBiodata: nameSeller,
                idKtpNumber: idKtp,
                telpNumber: telpNo,
                birthDateSeller: birthDate,
                addressSeller: address,
                imgSelfSeller: imgSelf,
                ktpImgSeller: ktpImg,
                'paymentInfo.ovoNumber': ovoNumber,
                'paymentInfo.danaNumber': danaNumber,
                'paymentInfo.gopayNumber': gopayNumber
            }
        }, {
            new: true,
            upsert: true
        });

        return res.status(200).json({
            success: true,
            message: 'Berhasil menambahkan'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengupdate data'
        });
    }
}

// TESTING AWS
// Belum di Test [Middleware]
export const updateOneImage = async(req, res, next) => {
    try {
        imgSelfSellerUpdate(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                //console.log("imgKey ->" + req.body.imgKey);
                console.log(req.file);
                return res.status(200).json({
                    success: true,
                    message: 'Berhasil mengupdate'
                });
                //next();
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

export const getAnalitikPemasukanByMonth = async(req, res) => {
    try {
        var monthQuery = req.query.month;
        var yearQuery = req.query.year;

        var maxMonth = parseInt(monthQuery) + 1
        var maxYear = parseInt(yearQuery)

        if (monthQuery == 12) {
            maxYear += 1
            maxMonth = 1
        }

        const allTransaction = await Order.find({
            idSellerAccount: req.params.idSellerAccount,
            statusOrder: "finish",
            orderAt: {
                $gte: new Date(yearQuery + ',' + monthQuery),
                $lt: new Date(maxYear + ',' + maxMonth)
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: allTransaction
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengambil data!'
        });
    }
}

export const getAllHistoryRevenueOrder = async(req, res) => {
    try {
        const allHistory = await OrderRevenue.find({
            idSellerAccount: req.params.idSellerAccount
        });

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil',
            result: allHistory
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengambil data!'
        });
    }
}

export const postOneRevenueOrder = async(req, res) => {
    try {
        const oneOrderRevenue = new OrderRevenue(req.body);
        await oneOrderRevenue.save();
        return res.status(200).json({
            success: true,
            message: 'Berhasil menambah data'
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengambil data!'
        });
    }
}

export const getRevenueSum = async(req, res) => {
    try {
        const oneRevenue = await SellerRevenue.findOne({
            idSellerAccount: req.params.idSellerAccount
        });

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            result: oneRevenue
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Gagal mengambil data!'
        });
    }
}