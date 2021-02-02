import express from 'express';
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import bodyParser, { json } from 'body-parser';
import cors from 'cors';
import sellerRoutes from './src/routes/SellerRoutes';
import buyerRoutes from './src/routes/BuyerRoutes';

const app = express();
app.use(cors());

// mongoose connection
mongoose.Promise = global.Promise;
mongoose
    .connect(
        'mongodb://nicolas:nicolas@kodelapocluster-shard-00-00.pm3ct.mongodb.net:27017,kodelapocluster-shard-00-01.pm3ct.mongodb.net:27017,kodelapocluster-shard-00-02.pm3ct.mongodb.net:27017/kodelapodb?ssl=true&replicaSet=atlas-2sxsls-shard-0&authSource=admin&retryWrites=true&w=majority', {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        console.log('Connected to database ');
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT'
    ) {
        jsonwebtoken.verify(
            req.headers.authorization.split(' ')[1],
            'KODELAPOAPI',
            (err, decode) => {
                if (err) req.user = undefined;
                req.user = decode;
                next();
            }
        );
    } else {
        req.user = undefined;
        next();
    }
});

sellerRoutes(app);
buyerRoutes(app);

app.get('/', (req, res) => {
    return res.status(200).send("Halooo");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Your server is running on ${process.env.PORT}`);
});