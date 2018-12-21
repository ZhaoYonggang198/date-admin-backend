# Date

## auth

``` post http://[主页]/auth```


Request Parameter

```
{
	"code": 'code get by wx.login()'
}
```

Response, 后续所有的调用都需要带session_key参数

```
{
"session_key":"session_key"
}
```


## wechat/info

### 保存用户的微信的getuserinfo信息 

```
 POST http://[主页]/wechat/info 
```

请求参数

```
{
    "session_key": XXXXX  // [POST http://[主页]/auth得到的session_key],
    "wechat": {}   // wx.getUserInfo()获得的信息
}
```

返回值

```
{
"result":"success"
}
```

### 获取保存过的wechat信息
```
GET http://[主页]/wechat/info
```
请求参数

```
wx.request{
    url: 'http://[主页]/wechat/info,
    data: {
        session_key
    }
}
```
返回参数

```
{
    "avatarUrl":...,
    "city":...,
    "country":"China",
    "gender":1,
    "language":"zh_CN",
    "nickName":...,
    "province":"Shanghai"
}
```

## user-profile 我们需要保存的用户信息

### 创建/修改 

```
POST http://[主页]/user-profile
```
请求参数

```
wx.request({
  url: 'http://[主页]/user-profile',
  method: 'POST',
  data: {
      session_key: session_key,
      profile:
      {
          username: '我是一个昵称',
          avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI07WicskqVY2wR8AzZkMQxYMicmIfQwzPIbSufQpSNjaYK6xfFCcBzGKfHQxrt3dicKR4R0IZJnUjIw/13',
          sex: 'male',
          birthday: '2015/09/05'
      }
    }
  })
```
返回值

```
{"result":"success"}
```

### 获取值
```
GET http://[主页]/user-profile
```
请求参数

```
wx.request({
    url: 'http://[主页]/user-profile',
    data: {
      session_key
    },
    success: res => {
      console.log(res.data)
    }
})
```
返回值

```
{
    "avatar":"URL",
    "birthday":"2015/09/05",
    "sex":"male",
    "username":"我是一个昵称"
}
```

## 获取当前系统问题列表

```
GET http://[主页]/question-answer
```
请求参数

```
wx.request({
    url: 'http://[主页]/question-answer',
    data: {
      session_key
    }
})
```
返回问题列表

```
[
    {
        question : "你的身高是多少？",
        questionId : "1",
        openid : "oPhwN5JExYdDlns_sq2bsJWonSeA",
        answer: {
            asr : "这是一条语音",
            src : "http://localhost/3.mp3"
        }
    }
    ...
    {
        "question" : "你介意他（她）喝酒吗？",
        "questionId":"31"
    }
]
```

## 添加对某个系统问题的回答

```
POST http://[主页]/public-question/answer
```

请求参数

```
wx.request({
    url: 'http://[主页]/public-question/answer',
    method: 'POST',
    data: {
        session_key,
        questionId: "1",
        answer: {
            asr: '这是一条语音',
            src: 'http://localhost/3.mp3'
        }
    }
})
```

## 用户状态

### 获取单个用户状态
```
GET http://[主页]/user-status
```
请求参数

```
wx.request({
    url: hostRoot + 'user-status',
    method: 'GET',
    data: {
        session_key
    }
})
```
返回值

```
{
    "asr":"这是一条语音1",
    "src":"http://localhost/3.mp3",
    "timestamp":"Tue Dec 18 2018 14:11:52 GMT+0800 (CST)"
}
```

### 获取用户状态列表
```
GET http://[主页]/user-status-list
```
请求参数

```
wx.request({
    url: hostRoot + 'user-status-list',
    method: 'GET',
    data: {
      session_key,
      start: 0,
      end: 1
    }
})
```
返回值

```
[
    {
        profile: {
        },
        status: {
        }
    }
]
```

### 修改用户状态
```
POST http://[主页]/user-status
```
请求参数

```
wx.request({
    url: 'http://[主页]/user-status',
    method: 'POST',
    data: {
        session_key,
        status: {
            asr: '这是一条语音1',
            src: 'http://localhost/3.mp3',
            timestamp: 'Tue Dec 18 2018 14:11:52 GMT+0800 (CST)' 
        }
    }
})
```
返回值

```
{"result":"success"}
```

## 关注某人

### 关注
```
POST http://[主页]/favorite
```
请求参数

```
wx.request({
  url: hostRoot + 'favorite',
  method: 'POST',
  data: {
      session_key,
      object: 被关注的openid, 
      favorite: true/false,  //关注/取关
  }
})
```

### 获取关注的列表
```
GET http://[主页]/favorite
```
请求参数

```
wx.request({
    url: 'http://[主页]/favorite',
    method: 'GET',
    data: {
        session_key
    }                          
})
```
返回值

```

```


## qrcode

### node-canvas install

```bash
// ubuntu: 
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

// mac: 
brew install pkg-config cairo pango libpng jpeg giflib
```

```bash
npm install canvas
```

## ffmpeg

```bash
//mac
brew install ffmpeg

// ubuntu
sudo apt-get install ffmpeg
```

```bash
npm install fluent-ffmpeg
```

## restart mongodb

```bash
sudo mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongod.log --logappend  -fork -port 27017
```


## 听写添加接口
### 添加词语列表
* 请求方式

``` post http://localhost/dictateWords```

* 参数

```json
{"openId"    : "oNijH5e8sdGfry-3tQWVN3SgskB0",
 "dictateWords": {
 	"title": "语文第二课",
	"active": false,
	"playWay" : "order", //disorder
	"playTimes" : 1,
	"intervel" : 5, //间隔
	"words": [
	{ "term": "波浪", "pinyin": "bolang"},
	{ "term": "浪花","pinyin": "langhua"},
	{ "term": "海浪","pinyin": "hailang"},
	{ "term": "灯光","pinyin": "dangguang"},
	{ "term": "电灯","pinyin": "diandeng"},
	{ "term": "作文","pinyin": "zuowen"},
	{ "term": "工作","pinyin": "gongzuo"}
	]
 }
}
```
* 返回值

```json
{
    "result": "success",
    "id": "52330249"
}
```

### 更新词语列表
* 请求方式

``` put http://localhost/dictateWords```

* 参数

```json
{"id"    : "52115059",
 "dictateWords": {
 	"title": "语文第二课",
	"active": false,
	"playWay" : "order", //disorder
	"playTimes" : 1,
	"intervel" : 5, //间隔
	"words": [
	{ "term": "波浪", "pinyin": "bolang"},
	{ "term": "浪花","pinyin": "langhua"},
	{ "term": "海浪","pinyin": "hailang"},
	{ "term": "灯光","pinyin": "dangguang"},
	{ "term": "电灯","pinyin": "diandeng"},
	{ "term": "作文","pinyin": "zuowen"},
	{ "term": "工作","pinyin": "gongzuo"}
	]
 }
}
```

* 返回值

```json
{
    "result": "success",
    "id": "52330249"
}
```

### 删除词语列表
* 请求方式

``` delete http://localhost/dictateWords?id=52115059```

* 返回值
```json
{
    "result": "success",
    "id": "52330249"
}
```

### 查询所有的词语列表
* 请求方式

``` get http://localhost/dictateWords?openId=oNijH5e8sdGfry-3tQWVN3SgskB0```

* 返回值
```json
{
    "result": "success",
    "data": [
        {
            "title": "语文第一课",
            "active": false,
            "words": [
                { "term": "波浪", "pinyin": "bolang"},
                { "term": "浪花","pinyin": "langhua"},
                { "term": "海浪","pinyin": "hailang"},
                { "term": "灯光","pinyin": "dangguang"},
                { "term": "电灯","pinyin": "diandeng"},
                { "term": "作文","pinyin": "zuowen"},
                { "term": "工作","pinyin": "gongzuo"}
            ],
            "darwinId": "weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8",
            "createTime": "2018-10-23",
            "updateTime": "2018-10-23",
            "id": "52330249"
        },
        {
            "darwinId": "weixin_oESUr5Arz8hmqlkTJjmrR_539Pz8",
            "active": true,
            "words": [
                { "term": "波浪", "pinyin": "bolang"},
                { "term": "浪花","pinyin": "langhua"},
                { "term": "海浪","pinyin": "hailang"},
                { "term": "灯光","pinyin": "dangguang"},
                { "term": "电灯","pinyin": "diandeng"},
                { "term": "作文","pinyin": "zuowen"},
                { "term": "工作","pinyin": "gongzuo"}
            ],
            "id": "52086497"
        }
    ]
}
```


##绑定用户接口
### 绑定新用户

* 请求方式

``` post http://localhost/binding```

* 参数

```json
{"openId"    : "oNijH5e8sdGfry-3tQWVN3SgskB0",
 "bindingCode": 70364
}
```

* 返回值

```json
{
    "result": "success",
    "state": true
}
```

###查询绑定的设备
#### 旧接口
* 请求方式

``` get http://localhost/binding?openid=oNijH5e8sdGfry-3tQWVN3SgskB0```

* 返回值

```json
{
    "result": "success",
    "bindingTypes": [
        "xiaoai",
        "dingdong"
    ]
}
```

#### 新接口
* 请求方式

``` get http://localhost/bindingPlat?openId=oNijH5e8sdGfry-3tQWVN3SgskB0 ```

* 返回值

```json
{
    "result": "success",
    "bindingTypes": [
        {
            "platType": "xiaoai"
        },
        {
            "platType": "dingdong",
            "skill": "course-record"
        }
    ]
}
```

###查询拼音
* 请求方式

```get http://localhost/pinyin?sentence=子弹```

* 返回值

```json
{
    "result": "success",
    "data": [
        [
            "zǐ"
        ],
        [
            "dàn",
            "tán"
        ]
    ]
}
```

###查询积分
* 请求方式

```get http://localHost/integral?id=oNijH5dOWOgyvX75lpVubHqWILOk```


* 返回值
```json
{
    "result": "success",
    "data": {
        "totalScore": 1000,
        "usedScore": 600,
        "remainScore": 400,
        "drawTimes": 2
    }
}
```

###查询奖品
* 请求方式

```get http://localHost/awards?id=oNijH5dOWOgyvX75lpVubHqWILOk```

* 返回值
```json
{
    "result": "success",
    "data": [
        {
            "grand": 1,
            "awardDesc": "小度在家音箱",
            "time": "2018-11-17 20:13:51"
        },
        {
            "grand": 1,
            "awardDesc": "小度在家音箱",
            "time": "2018-11-17 20:15:39"
        }
    ]
}
```


###抽奖接口
* 请求方式
```post http://localhost/luckydraw```

* 参数
```json
{
	"id"    : "oNijH5e8sdGfry-3tQWVN3SgskB0"
}
```

* 返回值
```json
{
    "result": "success",
    "data": {
        "grand": 2
    }
}
```

###保存中奖联系方式
* 请求方式
```post http://localhost/asst/prizeuser```

* 参数
```json
{"id"    : "oNijH5dOWOgyvX75lpVubHqWILOk",
 "grand" : 2,
 "phone" : "18629022031"
}
```

* 返回值
```json
{
    "result": "success",
    "data": "58600843"
}
```

