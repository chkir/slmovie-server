/**
 * Created by BaoJun on 2017/2/11.
 */
var express = require('express');
var router = express.Router();

const dyjy = require('../app/javascripts/targetWeb/dyjy.js')
const bttt = require('../app/javascripts/targetWeb/bttt.js')
const btttla = require('../app/javascripts/targetWeb/btttla.js')
const timeText = require('../app/javascripts/utils/timeTest.js')

router.get('/all', function (req, res, next) {
    timeText.start()
    console.log('all into  ' + timeText.time())
    res.movies = {}
    dyjy.queryTitle(req.query.name, function (data) {
        console.log('dyjy back  ' + timeText.time())
        res.movies['dyjy'] = (data)
        next()
    })
}, function (req, res, next) {
    bttt.queryTitle(req.query.name, function (data) {
        console.log('bttt back  ' + timeText.time())
        res.movies['bttt'] = (data)
        next()
    })
}, function (req, res, next) {
    res.send(res.movies)
});

router.get('/dyjy', function (req, res) {
    timeText.start()
    dyjy.queryTitle(req.query.name, function (data) {
        console.log('dyjy  ' + timeText.time())
        res.json(data)
    })
});

router.get('/bttt', function (req, res) {
    timeText.start()
    bttt.queryTitle(req.query.name, function (data) {
        console.log('bttt  ' + timeText.time())
        res.json(data)
    })
});

router.get('/btttla', function (req, res) {
    btttla.queryTitle(req, res)
});

module.exports = router;