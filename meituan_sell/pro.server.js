var express = require('express');
var port = 8088;


var app = express();

var router = express.Router();
router.get('/', function(req, res, next){
    req.url = '/index.html';
    next();
});

app.use(router);

// 接口数据
// 1、读取json数据
var goods = require('./data/01-商品页(点菜).json');
var ratings = require('./data/02-商品页(评价).json');
var seller = require('./data/03-商品页(商家).json');

// 2、路由
var routes = express.Router();

//3 编写接口
routes.get('/goods', (req, res) =>{
    res.json(goods)
});

routes.get('/ratings', (req, res) =>{
  res.json(ratings)
});

routes.get('/seller', (req, res) =>{
  res.json(seller)
});

// 4、中间件
app.use('/api',routes);

//定义static目录
app.use(express.static('./dist'));

//启动express
module.express = app.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }
    
    console.log("http://localhost:" + port + "\n");
});
