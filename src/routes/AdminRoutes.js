import {
    adminLoginAccount,
    loginRequiredAdmin,
    putStatusShop,
    adminRegisterAccount
} from '../controllers/AdminController';

const routes = async(app) => {
    app.route('/admin/login')
        .post(adminLoginAccount)

    app.route('/admin/register')
        .post(adminRegisterAccount)

    app.route('/admin/verify/shop/:idSeller')
        .put(loginRequiredAdmin, putStatusShop)
}

export default routes;