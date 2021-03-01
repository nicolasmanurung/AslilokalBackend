import {
    adminLoginAccount,
    loginRequiredAdmin,
    putStatusShop,
    adminRegisterAccount,
    getShopRevenueRequest,
    getOneShopRevenueRequest,
    putShopRevenueRequest
} from '../controllers/AdminController';

const routes = async(app) => {
    app.route('/admin/login')
        .post(adminLoginAccount)

    app.route('/admin/register')
        .post(adminRegisterAccount)

    app.route('/admin/verify/shop/:idSeller')
        .put(loginRequiredAdmin, putStatusShop)

    //
    app.route('/admin/revenue/all')
        .get(loginRequiredAdmin, getShopRevenueRequest)

    app.route('/admin/revenue/detail/:idRevenue')
        .get(loginRequiredAdmin, getOneShopRevenueRequest)

    app.route('/admin/revenue/:statusRevenue/:idRevenue')
        .put(loginRequiredAdmin, putShopRevenueRequest)

}

export default routes;