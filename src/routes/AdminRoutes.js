import {
    adminLoginAccount,
    loginRequiredAdmin,
    putStatusShop,
    adminRegisterAccount,
    getShopRevenueRequest,
    getOneShopRevenueRequest,
    putShopRevenueRequest,
    getAllOrderWithStatus,
    putAdminStatusOrder,
    getAllOrderPaymentRequired,
    getAllShop,
    putAslilokalShop
} from '../controllers/AdminController';

const routes = async(app) => {
    app.route('/admin/login')
        .post(adminLoginAccount)

    app.route('/admin/register')
        .post(adminRegisterAccount)

    app.route('/admin/verify/shop/:idSeller')
        .put(loginRequiredAdmin, putStatusShop)

    app.route('/admin/allshop')
        .get(loginRequiredAdmin, getAllShop)

    // Revenue
    app.route('/admin/revenue/all')
        .get(loginRequiredAdmin, getShopRevenueRequest)

    app.route('/admin/revenue/detail/:idRevenue')
        .get(loginRequiredAdmin, getOneShopRevenueRequest)

    app.route('/admin/revenue/:statusRevenue/:idRevenue')
        .put(loginRequiredAdmin, putShopRevenueRequest)

    // Order
    app.route('/admin/order/finish/all')
        .get(loginRequiredAdmin, getAllOrderWithStatus)

    app.route('/admin/order/paymentrequired/all')
        .get(loginRequiredAdmin, getAllOrderPaymentRequired)

    app.route('/admin/order/status/:idOrder')
        .put(loginRequiredAdmin, putAdminStatusOrder)

    // Aslilokal
    app.route('/admin/aslilokal/:idSellerAccount')
        .put(loginRequiredAdmin, putAslilokalShop)

}

export default routes;