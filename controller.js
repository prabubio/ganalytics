'use strict';
var Model = require('./model/model.js');

exports.getData = function (req, res) {
    console.log('yes I am in controller');
    var model = new Model();
    console.log('yes I am in controller2');
    model.readData(function (err, data) {
        if (err) {
            console.log('Can not read data');
            res.status(500).end();
        }

        res.set('content-type', 'text/json; charset=utf-8');
        res.send(data);

    });
};