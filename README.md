# 小程序后台接口

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
        favorite: true/false, //是否关注
        liking: true/false, //是否点赞
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
返回值

```
{"result":"success"}
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
[
    {
        favorite: true/false, //是否关注
        liking: true/false, //是否点赞
        profile: {
        },
        status: {
        }
    }
]
```

### 获取收藏你的列表
```
GET http://[主页]/favorited-list
```
请求参数

```
wx.request({
    url: 'http://[主页]/favorited-list',
    method: 'GET',
    data: {
        session_key
    }                          
})
```
返回值

```
[
    {
        subject: "openid",
        dateCreated: "",
        dateUpdate: ""
        status: {},
        profile: {}
    }
]
```
## 喜欢

### 喜欢/不再喜欢某人
```
POST http://[主页]/like
```
请求参数

```
wx.request({
    url: 'http://[主页]/like',
    method: 'POST',
    data: {
        session_key,
        object: session_key,
        like: true/false, //喜欢/不再喜欢
    }
})
```
返回值

```
{"result":"success"}
```


### 获得别人喜欢一个人的列表
```
GET http://[主页]/liked-list
```
请求参数

```
wx.request({
    url: 'http://[主页]/liked-list',
    method: 'GET',
    data: {
        session_key
    }
})
```
返回值

```
[
    {
        subject: "openid",
        dateCreated: "",
        dateUpdate: ""
        status: {},
        profile: {}
    }
]
```

## 问问题
### 向某人发问
```
POST http://[主页]/ask-question
```
请求参数

```
wx.request({
    url: 'http://[主页]/ask-question',
    method: 'POST',
    data: {
      session_key,
      ask: {
          who: session_key,
          url: 'http://localhost/3.mp3',
          asr: '你有多高啊？'
      }
    }
})
```

### 获取某个用户被问的问题列表
```
GET http://[主页]/asked-list
```

请求参数

```
wx.request({
  url: hostRoot + 'asked-list',
  method: 'GET',
  data: {
      session_key
  }
})
```

### 获取某个用户问别人的问题列表

```
GET http://[主页]/asking-list
```

请求参数

```
wx.request({
  url: hostRoot + 'asking-list',
  method: 'GET',
  data: {
      session_key
  }
})
```

### 回答某人问题

```
POST /personal-question/answer
```

请求参数

```
wx.request({
  url: hostRoot + 'personal-question/answer',
  method: 'POST',
  data: {
      session_key,
      key,
      answer: {
      }
  }
})
```

### 更新某个问题回复的阅读状态

```
POST http://[主页]/question-status
```

请求参数

```
wx.request({
  url: hostRoot + 'question-status',
  method: 'GET',
  data: {
      session_key,
      key, //某个问题的key
      status: "read"
  }
})
```

## 上传图片
```
http://[主页]/upload/image
```

```
wx.uploadFile({
    url: 'http://[主页]/upload/image',
    filePath: res.tempFilePaths[0],
    name: 'image',
})
```

## 上传视频
```
http://[主页]/upload/video
```
请求参数

```
wx.uploadFile({
    url: 'http://[主页]/upload/video',
    filePath: res.tempFilePath,
    name: 'video',
})
```

## ASR识别
```
http://[主页]/asr
```

请求参数
```
wx.uploadFile({
  url: 'http://[主页]/asr',
  filePath: res.tempFilePath,
  name: 'audio',
  success: function(res){
      console.log(res)
  }
})
```

返回值

```
{
    "url":"url",
    "result":{     // asr result
        "err_msg":"speech quality error.",
        "err_no":3301,
        "sn":"169911408631545362711"
    }
}
```

## 绑定用户
### bind
```
post http://localhost/bind
```
```
{
	"session_key":"",
	"code": 52095,
	"type": "xiaoai"
}
```
### unbind
```
post http://localhost/unbind
```
```
{
	"session_key":"",
	"type": "xiaoai"
}
```

### 绑定平台

## 安装依赖

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





##绑定用户接口

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

#API gateway后台接口
## get-public-question-answer

```
arguments: {
    questionId, //标准公共问题id
    answerId, //回答者的openid
}
```

## get-status-list
 ```
 arguments: {
    source: "xiaomi",
    start: "0",
    end: "100"  //获取从0到100的用户自我介绍列表
 }
 ```
 
 ```
[
        {
            "status": {
                "_key": "oPhwN5JExYdDlns_sq2bsJWonSeA",
                "_id": "UserStatus/oPhwN5JExYdDlns_sq2bsJWonSeA",
                "_rev": "_X80XPFW--_",
                "info": {
                    "asr": "这是一条语音1",
                    "duration": 18,
                    "src": "http://localhost/3.mp3",
                    "timestamp": "Tue Dec 18 2018 14:11:52 GMT+0800 (CST)"
                },
                "dateCreated": "2018-12-26T10:18:37.608Z",
                "updates": 3,
                "dateUpdate": "2018-12-27T02:58:23.990Z"
            },
            "profile": {
                "_key": "oPhwN5JExYdDlns_sq2bsJWonSeA",
                "_id": "UserProfile/oPhwN5JExYdDlns_sq2bsJWonSeA",
                "_rev": "_X80XPFK---",
                "info": {
                    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI07WicskqVY2wR8AzZkMQxYMicmIfQwzPIbSufQpSNjaYK6xfFCcBzGKfHQxrt3dicKR4R0IZJnUjIw/13",
                    "birthday": "",
                    "sex": "male",
                    "username": "我是一个昵称"
                },
                "dataCreated": "2018-12-26T04:35:28.096Z",
                "updates": 9,
                "dateUpdate": "2018-12-27T02:58:23.986Z"
            },
            "favorite": null,
            "liking": null
        }
    ]
 ```
 
 



