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
    getOneVoucher,
    uploadOneProductImg,
    uploadMultipleImg,
    getOrderByQuery,
    // UPDATE
    updateOneImage,
    updateSellerSelfImage,
    updateShopImage,
    updateKtpImage,
    updateProductImage,
    jwtSellerTesting
} from '../controllers/SellerControllers';

const routes = async(app) => {
    // Testing
    app.route('/testing/multiple')
        .post(uploadMultipleImg)

    // Testing Update
    app.route('/testing/update')
        .put(updateOneImage)


    // Testing JWT
    app.route('/seller/testing/jwt')
        .post(loginRequiredSeller, jwtSellerTesting)

    // Update Image
    // [Done]
    app.route('/seller/update/imgproduct')
        .put(loginRequiredSeller, updateProductImage)

    // [Done]
    app.route('/seller/update/imgktp')
        .put(loginRequiredSeller, updateKtpImage)

    // [Done]
    app.route('/seller/update/imgshop')
        .put(loginRequiredSeller, updateShopImage)

    app.route('/seller/update/imgself')
        .put(loginRequiredSeller, updateSellerSelfImage)

    //Auth
    // [Done]
    app.route('/seller/login')
        .post(sellerLoginAccount)

    // [Done]
    app.route('/seller/register')
        .post(sellerRegisterAccount)

    // [Done]
    app.route('/seller/verify')
        .post(loginRequiredSeller, postResubmitTokenSeller)

    // [Done]
    app.route('/seller/verify/token')
        .post(loginRequiredSeller, getTokenCodeSeller)

    // [Done]
    app.route('/seller/account')
        .post(loginRequiredSeller, uploadMultipleImg)
        // ktpImgSeller, imgSelfSeller - postSellerBiodata 

    // [Done]
    app.route('/seller/account/detail/:idSellerAccount')
        .get(loginRequiredSeller, getSellerBiodata)
        .put(loginRequiredSeller, putSellerBiodata)
        //

    // [Done]
    app.route('/seller/shop')
        .post(loginRequiredSeller, postShopBiodata)
        // imgShop - postShopBiodata

    // [Done]
    app.route('/seller/shop/detail/:idSellerAccount')
        .get(loginRequiredSeller, getShopBiodata)
        .put(loginRequiredSeller, putShopBiodata)

    // Product

    // [Done]
    app.route('/seller/product')
        .post(loginRequiredSeller, postOneProduct)
        // imgProduct - postOneProduct
        .get(loginRequiredSeller, getProductBySeller)


    // [Done]
    app.route('/seller/products/:idSellerAccount')
        .get(loginRequiredSeller, getSearchProductBySeller)

    // [Done]
    app.route('/seller/product/detail/:idProduct')
        .get(loginRequiredSeller, getOneProduct)
        .put(loginRequiredSeller, putOneProduct)

    // Debtor

    // [Done]
    app.route('/seller/debtor')
        .post(loginRequiredSeller, postOneDebtor)

    // [Done]
    app.route('/seller/debtor/detail/:idDebtor')
        .put(loginRequiredSeller, putOneDebtorLunas)

    // [Done]
    app.route('/seller/debtors/:idSellerAccount')
        .get(loginRequiredSeller, getAllDebtorBySeller)

    // Voucher

    // [Done]
    app.route('/seller/voucher')
        .post(loginRequiredSeller, postOneVoucher)

    // [Done]
    app.route('/seller/vouchers/:idSellerAccount')
        .get(loginRequiredSeller, getVoucherBySeller)

    // [Done]
    app.route('/seller/voucher/detail/:idVoucher')
        .get(loginRequiredSeller, getOneVoucher)

    // Notification
    // [Done]
    app.route('/seller/notifications/:idSellerAccount')
        .get(loginRequiredSeller, getNotificationBySeller)

    // [Done]
    app.route('/seller/notification/detail/:idNotification')
        .get(loginRequiredSeller, getOneNotificationSeller)

    // Order

    // Testing
    // app.route('/seller/orders/testing/:idSellerAccount')
    //     .get(loginRequiredSeller, getOrderByQuery)

    // [Done]
    app.route('/seller/orders/:idSellerAccount')
        .get(loginRequiredSeller, getAllOrderSeller)

    // [Done]
    app.route('/seller/order/detail/:idOrder')
        .get(loginRequiredSeller, getOneOrderSeller)

    // [Done]
    app.route('/seller/order/status/:idOrder')
        .put(loginRequiredSeller, putStatusOrder)

    // [Done]
    app.route('/seller/order/cancel/:idOrder')
        .put(loginRequiredSeller, putAcceptCancelOrder)

}

export default routes;