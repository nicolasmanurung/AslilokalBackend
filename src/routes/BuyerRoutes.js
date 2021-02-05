import {
    loginRequiredBuyer,
    buyerRegisterAccount,
    buyerLoginAccount,
    postResubmitTokenBuyer,
    getTokenCodeBuyer,
    postBuyerBiodata,
    getBuyerBiodata,
    putBuyerBiodata,
    postFollowShop,
    unFollowShop,
    getAllShopFollowing,
    getShopIsFollowing,
    getOneProductBuyer,
    getProductByBuyer,
    getSearchProductByBuyer,
    getShopList,
    getOneShopInfo,
    getSearchShopList,
    getOneVoucherInfo,
    getVoucherActiveFromShop,
    getOneNotificationBuyer,
    getNotificationBuyer,
    postOneProductToCart,
    deleteOneProductFromCart,
    deleteMultipleProductFromCart,
    putOneProductCart,
    getKeranjangBuyer,
    postOneOrderBuyer,
    getAllOrderBuyer,
    getOneOrderBuyer,
    putCancelOneOrder,
    putFinishOrder,
    postOneReviewBuyer,
    getAllReviewBuyer,
    getOneReviewBuyer,
    getAllReviewFromShop,
    updateImgSelfBuyer,
    jwtBuyerTesting
} from '../controllers/BuyerControlles';

const routes = async(app) => {

    // Image Testing
    // app.route('/testing/image')
    //     .post(uploadSingleImg, postTesting);

    // JWT Testing
    app.route('/buyer/testing/jwt')
        .post(loginRequiredBuyer, jwtBuyerTesting)
        // Update
        // [Done]
    app.route('/buyer/update/imgself')
        .put(loginRequiredBuyer, updateImgSelfBuyer)

    // Auth

    // [Done]
    app.route('/buyer/login')
        .post(buyerLoginAccount)

    // [Done]
    app.route('/buyer/register')
        .post(buyerRegisterAccount)


    // [Done]
    app.route('/buyer/verify')
        .post(loginRequiredBuyer, postResubmitTokenBuyer)
        .get(loginRequiredBuyer, getTokenCodeBuyer)

    // Account

    // [Done]
    app.route('/buyer/account')
        .post(loginRequiredBuyer, postBuyerBiodata)
        //imgSelfBuyer - uploadSelfImgBuyer

    // [Done]
    app.route('/buyer/account/detail/:idBuyerAccount')
        .get(loginRequiredBuyer, getBuyerBiodata)
        .put(loginRequiredBuyer, putBuyerBiodata)

    // Follow
    // [Done]
    app.route('/buyer/follow')
        .post(loginRequiredBuyer, postFollowShop)

    // [Done]
    app.route('/buyer/unfollow')
        .post(loginRequiredBuyer, unFollowShop)

    // [Done]
    app.route('/buyer/shop/isfollow')
        .get(loginRequiredBuyer, getShopIsFollowing)

    // Product
    // [Done]
    app.route('/buyer/product/detail/:idProduct')
        .get(getOneProductBuyer)

    // [Done]
    app.route('/buyer/products')
        .get(getProductByBuyer)

    // [Done]
    app.route('/buyer/products/search')
        .get(getSearchProductByBuyer)

    // Shop

    // [Done]
    app.route('/buyer/shops')
        .get(getShopList)

    // [Done]
    app.route('/buyer/shop/detail/:idSellerAccount')
        .get(getOneShopInfo)

    // [Done]
    app.route('/buyer/shops/search')
        .get(getSearchShopList)

    // Voucher
    // [Done]
    app.route('/buyer/voucher/detail')
        .get(getOneVoucherInfo)

    // [Done]
    app.route('/buyer/vouchers')
        .get(getVoucherActiveFromShop)

    // Notification
    app.route('/buyer/notification/detail/:idNotification')
        .get(loginRequiredBuyer, getOneNotificationBuyer)

    app.route('/buyer/notifications/:idBuyerAccount')
        .get(loginRequiredBuyer, getNotificationBuyer)

    // Cart
    // [Done]
    app.route('/buyer/cart/:idBuyerAccount')
        .post(loginRequiredBuyer, postOneProductToCart)
        .delete(loginRequiredBuyer, deleteMultipleProductFromCart)
        .put(loginRequiredBuyer, putOneProductCart)
        .get(loginRequiredBuyer, getKeranjangBuyer)

    // Order

    // [Done]
    app.route('/buyer/order')
        .post(loginRequiredBuyer, postOneOrderBuyer)

    // [Done]
    app.route('/buyer/orders/:idBuyerAccount')
        .get(loginRequiredBuyer, getAllOrderBuyer)


    // [Done]
    app.route('/buyer/order/detail/:idOrder')
        .get(loginRequiredBuyer, getOneOrderBuyer)
        .put(loginRequiredBuyer, putCancelOneOrder)

    // [Done]
    app.route('/buyer/order/finish/:idOrder')
        .put(loginRequiredBuyer, putFinishOrder)

    // Review
    // [Done]
    app.route('/buyer/review/:idReview')
        .post(loginRequiredBuyer, postOneReviewBuyer)

    // [Done]
    //Get Review and Unreview
    app.route('/buyer/reviews/:idBuyerAccount')
        .get(loginRequiredBuyer, getAllReviewBuyer)

    // [Done]
    app.route('/buyer/review/detail/:idReview')
        .get(getOneReviewBuyer)

    // [Done]
    app.route('/buyer/review/shop/:idSellerAccount')
        .get(getAllReviewFromShop)
}

export default routes;