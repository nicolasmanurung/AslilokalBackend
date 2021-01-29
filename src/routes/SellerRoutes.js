import {
    loginRequiredSeller,
    sellerRegisterAccount,
    sellerLoginAccount,
    postResubmitTokenSeller,
    getTokenCodeSeller,
    postSellerBiodata,
    getSellerBiodata,
    putSellerBiodata,
    postShopBiodata,
    getShopBiodata,
    putShopBiodata,
    postOneProduct,
    getOneProduct,
    getProductBySeller,
    getSearchProductBySeller,
    putOneProduct,
    postOneDebtor,
    getAllDebtorBySeller,
    putOneDebtorLunas,
    postOneVoucher,
    getVoucherBySeller,
    getNotificationBySeller,
    getOneNotificationSeller,
    getAllOrderSeller,
    getOneOrderSeller,
    putStatusOrder,
    putAcceptCancelOrder,
    getOneVoucher
} from '../controllers/SellerControllers';

const routes = async (app) => {
    //Auth
    app.route('/seller/login')
        .post(sellerLoginAccount)

    app.route('/seller/register')
        .post(loginRequiredSeller, sellerRegisterAccount)

    app.route('/seller/verify')
        .get(loginRequiredSeller, getTokenCodeSeller)
        .post(loginRequiredSeller, postResubmitTokenSeller)

    app.route('/seller/account')
        .post(loginRequiredSeller, postSellerBiodata)

    app.route('/seller/account/detail/:idSellerAccount')
        .get(loginRequiredSeller, getSellerBiodata)
        .put(loginRequiredSeller, putSellerBiodata)

    app.route('/seller/shop')
        .post(loginRequiredSeller, postShopBiodata)

    app.route('/seller/shop/detail/:idSellerAccount')
        .get(loginRequiredSeller, getShopBiodata)
        .put(loginRequiredSeller, putShopBiodata)

    // Product
    app.route('/seller/product')
        .post(loginRequiredSeller, postOneProduct)
        .get(loginRequiredSeller, getProductBySeller)

    app.route('/seller/products/:idSellerAccount')
        .get(loginRequiredSeller, getSearchProductBySeller)

    app.route('/seller/product/detail/:idProduct')
        .get(loginRequiredSeller, getOneProduct)
        .put(loginRequiredSeller, putOneProduct)

    // Debtor
    app.route('/seller/debtor')
        .post(loginRequiredSeller, postOneDebtor)

    app.route('/seller/debtor/detail/:idDebtor')
        .put(loginRequiredSeller, putOneDebtorLunas)

    app.route('/seller/debtors/:idSellerAccount')
        .get(loginRequiredSeller, getAllDebtorBySeller)

    // Voucher
    app.route('/seller/voucher')
        .post(loginRequiredSeller, postOneVoucher)

    app.route('/seller/vouchers/:idSellerAccount')
        .get(loginRequiredSeller, getVoucherBySeller)

    app.route('/seller/voucher/detail/:idVoucher')
        .get(loginRequiredSeller, getOneVoucher)

    // Notification
    app.route('/seller/notifications/:idSellerAccount')
        .get(loginRequiredSeller, getNotificationBySeller)

    app.route('/seller/notification/detail/:idNotification')
        .get(loginRequiredSeller, getOneNotificationSeller)

    // Order
    app.route('/seller/orders/:idSellerAccount')
        .get(loginRequiredSeller, getAllOrderSeller)

    app.route('/seller/order/detail/:idOrder')
        .get(loginRequiredSeller, getOneOrderSeller)

    app.route('/seller/order/status/:idOrder')
        .put(loginRequiredSeller, putStatusOrder)

    app.route('/seller/order/cancel/:idOrder')
        .put(loginRequiredSeller, putAcceptCancelOrder)

}

export default routes;