import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { SellerAccountSchema } from "../models/SellerAccountModel";
import { SellerBiodataSchema } from "../models/SellerBiodataModel";
import { SellerShopSchema } from "../models/SellerShopModel";
import { TokenAccountSchema } from "../models/TokenAccountModel";
import { ProductSchema } from "../models/ProductModel";
import { DebtorSchema } from '../models/DebtorModel';
import { VoucherSchema } from '../models/VoucherModel';
import { NotificationSchema } from '../models/NotificationModel';
import { OrderSchema } from '../models/OrderModel';
import {
    // UPLOAD
    uploadUsrImg,
    uploadProductImg,
    // UPDATE
    updateSellerImg,
    updateProductImg
} from '../configs/upload';

const mailgun = require("mailgun-js");
const DOMAIN = 'nicolasmanurung.tech';
const mg = mailgun({
    apiKey: "76d09f6b0646ad23850b363dcebdb7ad-e5da0167-d59bdd1e",
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

// UPLOAD
const uploadImgProduct = uploadProductImg.single('imgProduct');
const uploadKtpBiodata = uploadUsrImg.single('ktpImgSeller');
const uploadShop = uploadUsrImg.single('imgShop');
const uploadSellerMultiple = uploadUsrImg.fields([
    {
        name: 'imgSelfSeller', maxCount: 1
    },
    {
        name: 'ktpImgSeller', maxCount: 1
    }
]);

// UPDATE
const imgSelfSellerUpdate = updateSellerImg.single('imgSelfSellerUpdate')
const imgShopImgUpdate = updateSellerImg.single('imgShopImgUpdate');
const imgKtpSellerUpdate = updateSellerImg.single('imgKtpSellerUpdate');
const imgProductSellerUpdate = updateProductImg.single('imgProductSellerUpdate');


// Middleware
export const loginRequiredSeller = async (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorization User' });
    }
};

// Belum di Test
export const sellerRegisterAccount = async (req, res) => {
    try {
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
                // Disini setting email konfirmasi [Belum di testing]
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
                            await newSeller.save();
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
export const sellerLoginAccount = async (req, res) => {
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

// Belum di Test
export const postResubmitTokenSeller = async (req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailSeller
        });
        if (!oneToken) {
            let randomToken = Math.random().toString(16).substring(9);
            const token = new TokenAccount(
                req.body.idSellerAccount,
                req.body.emailSeller,
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
        })
    }
}

// Belum di Test
export const getTokenCodeSeller = async (req, res) => {
    try {
        const oneToken = await TokenAccount.findOne({
            emailAccount: req.body.emailSeller
        });
        if (oneToken.tokenVerify === req.body.tokenVerify) {
            try {
                await SellerAccount.findOneAndUpdate({
                    emailSeller: req.body.emailSeller
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
export const postSellerBiodata = async (req, res) => {
    try {
        // const oneSellerBiodata = new SellerBiodata(req.body);
        // oneSellerBiodata.imgSelfSeller = req.files.imgSelfSeller.key;
        // oneSellerBiodata.ktpImgSeller = req.files.ktpImgSeller.key;
        // await oneSellerBiodata.save()
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
export const getSellerBiodata = async (req, res) => {
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
export const putSellerBiodata = async (req, res) => {
    try {
        let oneSellerBiodata = await SellerBiodata.findOneAndUpdate({
            idSellerAccount: req.params.idSellerAccount
        });
        if (oneSellerBiodata) {
            oneSellerBiodata = new SellerBiodata(req.body);
            await oneSellerBiodata.save();
            return res.status(200).json({
                success: true,
                message: 'Berhasil di update',
                result: oneSellerBiodata
            });
        } else {
            return res.status(401).json({
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
export const postShopBiodata = async (req, res) => {
    try {
        uploadShop(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                let oneShopBio = new SellerShop(req.body);
                oneShopBio.imgShop = req.file.key;
                oneShopBio.save();
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
            message: 'Gagal mengupdate gambar!'
        });
    }
}

// Belum di Test
export const getShopBiodata = async (req, res) => {
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
export const putShopBiodata = async (req, res) => {
    try {
        let oneShopBiodata = await SellerShop.findOneAndUpdate({
            idSellerAccount: req.params.idSellerAccount
        })
        if (oneShopBiodata) {
            oneShopBiodata = new SellerShop(req.body);
            await oneShopBiodata.save();
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil',
                result: oneShopBiodata
            });
        } else {
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
export const postOneProduct = async (req, res) => {
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
export const getOneProduct = async (req, res) => {
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
export const getProductBySeller = async (req, res) => {
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
export const getSearchProductBySeller = async (req, res) => {
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
export const putOneProduct = async (req, res) => {
    try {
        let oneProduct = await Product.findOneAndUpdate(req.params.idProduct);
        if (oneProduct) {
            oneProduct = new Product(req.body);
            await oneProduct.save();
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil',
                result: oneProduct
            });
        } else {
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
export const postOneDebtor = async (req, res) => {
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
export const getAllDebtorBySeller = async (req, res) => {
    try {
        const allDebtor = await Debtor.find({
            idSellerAccount: req.params.idSellerAccount
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
export const putOneDebtorLunas = async (req, res) => {
    try {
        let oneDebtor = await Debtor.findOneAndUpdate(req.params.idDebtor);
        if (oneDebtor) {
            oneDebtor = new Debtor(req.body);
            await oneDebtor.save();
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengedit',
                result: oneDebtor
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'Maaf data tidak ditemukan!'
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
export const postOneVoucher = async (req, res) => {
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

// Belum di Test
export const getVoucherBySeller = async (req, res) => {
    try {
        const findAllVoucher = await Voucher.find({
            idSellerAccount: req.params.idSellerAccount
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

// Belum di Test
export const getNotificationBySeller = async (req, res) => {
    try {
        const findAllNotification = await Notification.find({
            idUser: req.params.idSellerAccount
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
export const getOneNotificationSeller = async (req, res) => {
    try {
        const oneNotification = await Notification.findByIdAndUpdate(req.params.idNotification, {
            $set: {
                statusNotification: "read"
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
export const getAllOrderSeller = async (req, res) => {
    try {
        const allOrder = await Order.find({
            idSellerAccount: req.params.idSellerAccount,
            statusOrder: req.query.status
        });
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
export const getOneOrderSeller = async (req, res) => {
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
export const putStatusOrder = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.idOrder, {
            $set: {
                statusOrder: req.body.statusOrder
            }
        });

        const oneNotification = new Notification(
            req.body.idBuyerAccount,
            req.body.statusOrder,
            "unread",
            "Lihat status pesanan mu telah berubah!"
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
export const putAcceptCancelOrder = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.idOrder, {
            $set: {
                isCancelSeller: true
            }
        });
        const oneNotification = new Notification(
            req.body.idBuyerAccount,
            req.body.statusOrder,
            "unread",
            "Pesanan kamu berhasil di batalkan"
        );
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
export const getOneVoucher = async (req, res) => {
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
export const uploadOneProductImg = async (req, res, next) => {
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
export const uploadOneKtpImg = async (req, res, next) => {
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
export const uploadOneShopImg = async (req, res, next) => {
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
export const uploadOneSelfImg = async (req, res, next) => {
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

export const updateSelfImage = async (req, res, next) => {
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

export const updateSellerSelfImage = async (req, res) => {
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

export const updateShopImage = async (req, res) => {
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

export const updateKtpImage = async (req, res) => {
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

export const updateProductImage = async (req, res) => {
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


// Belum di Test [Middleware]
export const uploadMultipleImg = async (req, res) => {
    try {
        uploadSellerMultiple(req, res, err => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Image upload error!'
                });
            } else {
                let oneSellerBiodata = new SellerBiodata(req.body);
                oneSellerBiodata.imgSelfSeller = req.files['imgSelfSeller'][0].key;
                oneSellerBiodata.ktpImgSeller = req.files['ktpImgSeller'][0].key;
                oneSellerBiodata.save()
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
            message: 'Gagal mengupdate gambar!'
        });
    }
}

// TESTING AWS
// Belum di Test [Middleware]
export const updateOneImage = async (req, res, next) => {
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