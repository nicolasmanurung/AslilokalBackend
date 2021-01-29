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
    getAllReviewFromShop
} from '../controllers/BuyerControlles';

const routes = async (app) => {
    // Auth
    app.route('/buyer/login')
        .post(buyerLoginAccount)

    app.route('/buyer/register')
        .post(buyerRegisterAccount)

    app.route('/buyer/verify')
        .post(loginRequiredBuyer, postResubmitTokenBuyer)
        .get(loginRequiredBuyer, getTokenCodeBuyer)

    // Account
    app.route('/buyer/account')
        .post(loginRequiredBuyer, postBuyerBiodata)

    app.route('/buyer/acount/detail/:idBuyerAccount')
        .get(loginRequiredBuyer, getBuyerBiodata)
        .put(loginRequiredBuyer, putBuyerBiodata)

    // Follow
    app.route('/buyer/follow')
        .post(loginRequiredBuyer, postFollowShop)

    app.route('/buyer/unfollow')
        .post(loginRequiredBuyer, unFollowShop)

    app.route('/buyer/shop/isfollow')
        .get(loginRequiredBuyer, getShopIsFollowing)

    // Product
    app.route('/buyer/product/detail/:idProduct')
        .get(getOneProductBuyer)

    app.route('/buyer/products')
        .get(getProductByBuyer)

    app.route('/buyer/products/search')
        .get(getSearchProductByBuyer)

    // Shop
    app.route('/buyer/shops')
        .get(getShopList)

    app.route('/buyer/shop/detail/:idSellerAccount')
        .get(getOneShopInfo)

    app.route('/buyer/shops/search')
        .get(getSearchShopList)

    // Voucher 
    app.route('/buyer/voucher')
        .get(getOneVoucherInfo)

    app.route('/buyer/vouchers')
        .get(getVoucherActiveFromShop)

    // Notification
    app.route('/buyer/notification/detail/:idNotification')
        .get(loginRequiredBuyer, getOneNotificationBuyer)

    app.route('/buyer/notifications/:idBuyerAccount')
        .get(loginRequiredBuyer, getNotificationBuyer)

    // Cart
    app.route('/buyer/cart/:idBuyerAccount')
        .post(loginRequiredBuyer, postOneProductToCart)
        .delete(loginRequiredBuyer, deleteMultipleProductFromCart)
        .put(loginRequiredBuyer, putOneProductCart)
        .get(loginRequiredBuyer, getKeranjangBuyer)

    // Order
    app.route('/buyer/order')
        .post(loginRequiredBuyer, postOneOrderBuyer)

    app.route('/buyer/orders/:idBuyerAccount')
        .get(loginRequiredBuyer, getAllOrderBuyer)

    app.route('/buyer/order/detail/:idOrder')
        .get(loginRequiredBuyer, getOneOrderBuyer)
        .put(loginRequiredBuyer, putCancelOneOrder)

    app.route('/buyer/order/finish/:idOrder')
        .put(loginRequiredBuyer, putFinishOrder)

    // Review
    app.route('/buyer/review')
        .post(loginRequiredBuyer, postOneReviewBuyer)

    app.route('/buyer/reviews/:idBuyerAccount')
        .get(loginRequiredBuyer, getAllReviewBuyer)

    app.route('/buyer/review/detail/:idReview')
        .get(getOneReviewBuyer)

    app.route('/buyer/review/shop/:idSellerAccount')
        .get(getAllReviewFromShop)
}

export default routes;