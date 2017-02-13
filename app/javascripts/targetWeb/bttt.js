/**
 * Created by BaoJun on 2017/2/11.
 * bt天堂
 */
const cheerio = require('cheerio')
const getSuperagent = require('../utils/mySuperagent.js')
const chinese2Gb2312 = require('../utils/chinese2Gb2312.js')

exports.queryTitle = function (query, next) {
    let form = {
        show: 'title,ftitle,type,area,time,director,player,actor,imdb',
        tbname: 'movie',
        tempid: '1',
        keyboard: query,
    }
    let callBack = {}
    let status = {}
    getSuperagent().post('http://www.bttt99.com/e/search/')
        .type('form')
        .send(form)
        .end(function (error, response) {
            if (error) {
                status['code'] = 0
                status['error'] = error
                callBack['status'] = status
                next(callBack)
            }
            if (response.statusCode == 200) {
                status['code'] = 1
                callBack['status'] = status
                let $ = cheerio.load(response.text)
                let jsonRes = {}
                //基本信息
                let movies = []
                $('.title').each(function (i, elem) {
                    let address = $('a', elem).attr('href')
                    if (address.indexOf('bttt99') < 0)
                        address = 'http://www.bttt99.com' + address
                    movies.push({
                        //电影名称
                        'name': $('b', elem).text(),
                        //网页地址
                        'address': address,
                        //海报图片
                        'post': $('img', $(elem).next()).attr('src'),
                        //豆瓣评分
                        'db': $('strong', elem).text(),
                        //上映日期
                        'year': $('font', 'b', elem).text()
                    })
                })
                callBack['movies'] = movies
                next(callBack)
            }
        })
}

//爬取细节及下载地址下载地址
exports.detail = function (req, res) {
    let website = 'http://www.bttt99.com/e/show.php?classid=1&id=20310'
    getSuperagent().get(website)
        .set('Referer', 'http://www.bttt99.com/v/20310/')
        .end(function (error, response) {
            if (error) {
                res.send(error)
            }
            if (response.statusCode == 200) {
                let $ = cheerio.load(response.text)
                //完整返回值
                let jsonRes = {}
                //下载地址信息
                let movies = []
                $('.downurl').each(function (i, elem) {
                    $('li', elem).each(function (x, xelem) {
                        let movie = {}
                        //文件名称
                        movie['name'] = $('a', xelem).text()
                        //下载地址
                        movie['download'] = $('a', xelem).attr('href')
                        //文件大小
                        movie['file-size'] = ''
                        movies.push(movie)
                    })
                })
                jsonRes['files'] = movies
                //剧照
                let photos = []
                jsonRes['photos'] = photos
                res.json(jsonRes)
            }
        })
}