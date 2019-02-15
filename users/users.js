/**
 *  Users Handler
 *
 */

/* jshint esversion: 6 */

 var multer = require('multer');    // To save Files
 var express = require('express');
 var router = express.Router();

 var formUpload = multer({ dest: './temp' });


 router.get('/', (res, req, next) => {
  res.send('Users hello');
 });

 router.get('/profile/:id/edit', (req, res) => {
   console.log("profile id => " + req.params.id);
   res.send("Id reached : " + req.params.id);
 });

 router.post('/create',
             formUpload.fields([
               { name:'username', maxCount:1 },
               { name:'password', maxCount:1 },
               { name:'email', maxCount:1 }
             ]),
             (req, res) => {
               console.log(req.body);
               res.end('done creating user');
             }
);

module.exports = router;
