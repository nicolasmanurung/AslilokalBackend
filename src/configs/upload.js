require('dotenv').config();
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import crypto from 'crypto';

aws.config.update({
    accessKeyId: 'AKIA36EE2TFWE34DVTXN',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
});

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const fileFilter = (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.jpeg') {
        console.log('Extension Check');
        cb(null, true);
    } else {
        cb('Only Images Are Allow', false);
    }
};

// UPLOAD
export const uploadUsrImg = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'kodelapo-usr-img',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            let salt = crypto.randomBytes(16).toString('hex');
            cb(null, `${Date.now().toString()}-${salt}`);
        }
    })
});


// UPDATE
export const uploadProductImg = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'kodelapo-product-img',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            let salt = crypto.randomBytes(16).toString('hex');
            cb(null, `${Date.now().toString()}-${salt}`);
        }
    })
});


// Belum Test
export const updateSellerImg = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'kodelapo-usr-img',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, `${req.body.imgKey}`);
        }
    })
})

// Belum Test
export const updateProductImg = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'kodelapo-product-img',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, `${req.body.imgKey}`);
        }
    })
})