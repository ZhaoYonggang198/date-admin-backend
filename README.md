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
```
get http://localhost/bindingPlat
```
```
    {
        session_key
        }
```
回复数据
```
    [
        xiaoai
    ]
```
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
 
 
## get-user-profile
 ```
 arguments: {
    source: "xiaomi"
 }
 ```
 
 ```
"result": {
    "status": "guest",
    "profile": null
}
    
或
    
"result": {
"status": "user",
"profile": {
    "username": "八块腹肌才换名",
    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo4iat7p082GpPb6iaic22iaPlficjTsr99M6kSj2aREZUe2s76Bjn1ib1P259s0WBpaubQUjDsIw8AacKw/132",
    "sex": "male"
}
}
 ```
 
 ## get-current-status 获取最近一次访问的用户
 ```
 {
"arguments":{"source": "xiaoai"},
"userId":"darwin_C7J4i4YMagyPEP7wqbMBMg_C_C_",
"api":"get-current-status"
}
```

```
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": {
        "_key": "xiaoaidarwin_C7J4i4YMagyPEP7wqbMBMg_C_C_",
        "current": "darwin_date_end_12345678_1_69",
        "first": "2019-01-18T12:13:31.072Z",
        "heard": [
            "darwin_date_end_12345678_1_116",
            "darwin_date_end_12345678_1_69"
        ],
        "logins": 1,
        "status": {
            "_key": "darwin_date_end_12345678_1_69",
            "dateCreated": "2019-01-10T08:01:47.153Z",
            "info": {
                "duration": 18,
                "asr": "120.mp3",
                "src": "https://edison.xiaodamp.cn/resource/poem/120.mp3"
            },
            "updates": 1
        }
    }
}
```
 
 ## get-next-status 下一个userstatus
 ```
 {
"arguments":{"source": "xiaoai"},
"userId":"darwin_C7J4i4YMagyPEP7wqbMBMg_C_C_",
"api":"get-next-status"
}
```

```
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": {
        "_key": "xiaoaidarwin_C7J4i4YMagyPEP7wqbMBMg_C_C_",
        "current": "darwin_date_end_12345678_1_69",
        "first": "2019-01-18T12:13:31.072Z",
        "heard": [
            "darwin_date_end_12345678_1_116",
            "darwin_date_end_12345678_1_69"
        ],
        "logins": 1,
        "status": {
            "_key": "darwin_date_end_12345678_1_69",
            "dateCreated": "2019-01-10T08:01:47.153Z",
            "info": {
                "duration": 18,
                "asr": "120.mp3",
                "src": "https://edison.xiaodamp.cn/resource/poem/120.mp3"
            },
            "updates": 1
        }
    }
}
```
## get-asked-list 获取别人问你的问题
```
{
"arguments":{"source": "xiaoai"},
"userId":"darwin-test",
"api":"get-asked-list"
}
``` 

```
[
{

    "_key": "859047",
    "answer": {
        "_key": "548372",
        "openid": "oPhwN5CHNMjy5JT92jOmkqA_1kOM",
        "questionId": "12",
        "answer": {
            "asr": "我这个职业很神圣，我是在为国家做贡献。",
            "src": "https://edison.xiaodamp.cn/resource/audio/bfeb0560-09d7-11e9-bf25-fd0ed44efcff.mp3",
            "duration": 7
        },
        "dateCreated": "2018-12-27T13:03:05.754Z",
        "updates": 1
    },
    "answerDate": "2019-01-03T11:03:39.233Z",
    "answerStatus": "unread",
    "object": "oPhwN5CHNMjy5JT92jOmkqA_1kOM",
    "question": {
        "who": "oPhwN5CHNMjy5JT92jOmkqA_1kOM",
        "url": "https://edison.xiaodamp.cn/resource/asr/381a4090-0f47-11e9-b040-afe6a6a9cb61.mp3",
        "asr": "你做什么呢？",
        "duration": 3
    },
    "questionDate": "2019-01-03T11:03:39.233Z",
    "questionId": "12",
    "questionStatus": "unread",
    "subject": "oPhwN5C5lvHS5Nl6wRhUgfGxNic0",
    "profile": {
        "_key": "oPhwN5C5lvHS5Nl6wRhUgfGxNic0",
        "dateCreated": "2018-12-28T12:44:49.929Z",
        "info": {
            "username": "粗茶淡饭",
            "avatar": "https://wx.qlogo.cn/mmopen/vi_32/w2OlzwFOZWeLIeU0ykFfGIm2iaYDTDoP6QRk2CWHtPlq5Tdqq6AWjsEwPsRfTicfVGDUJp7HibHke3kFKCia9CsO5A/132",
            "sex": "未知"
        },
        "updates": 1
    }
}
]
```
 
## get-asking-list 获取你问别人的问题
```
{
"arguments":{"source": "xiaoai"},
"userId":"darwin-test",
"api":"get-asking-list"
}
``` 

```
[
    {
        "_rev": "_Y_MylEe--_",
        "answer": {
            "who": "oPhwN5CHNMjy5JT92jOmkqA_1kOM",
            "url": "https://edison.xiaodamp.cn/resource/asr/d06df4c0-0f53-11e9-b040-afe6a6a9cb61.mp3",
            "asr": "我是六岁。",
            "duration": 4
        },
        "answerDate": "2019-01-03T12:33:49.663Z",
        "answerStatus": "unread",
        "object": "oPhwN5C5lvHS5Nl6wRhUgfGxNic0",
        "question": {
            "who": "oPhwN5C5lvHS5Nl6wRhUgfGxNic0",
            "url": "https://edison.xiaodamp.cn/resource/asr/84e043a0-0e3b-11e9-9ae4-5310b066ba7a.mp3",
            "asr": "你年龄多大？",
            "duration": 3
        },
        "questionDate": "2019-01-02T03:07:22.523Z",
        "questionStatus": "read",
        "subject": "oPhwN5CHNMjy5JT92jOmkqA_1kOM",
        "profile": {
            "_key": "oPhwN5C5lvHS5Nl6wRhUgfGxNic0",
            "dateCreated": "2018-12-28T12:44:49.929Z",
            "info": {
                "username": "粗茶淡饭",
                "avatar": "https://wx.qlogo.cn/mmopen/vi_32/w2OlzwFOZWeLIeU0ykFfGIm2iaYDTDoP6QRk2CWHtPlq5Tdqq6AWjsEwPsRfTicfVGDUJp7HibHke3kFKCia9CsO5A/132",
                "sex": "未知"
            },
            "updates": 1
        }
    }
]
``` 


## 提交问别人的问题和得到的答案
```
{
"arguments":{"source": "xiaoai",
	"questionId": "1",
	"answerId": "test",  // 被问的人的openid
	"questionText":"1234", 
	"media": "123351",
	"answer": null
},
"userId":"darwin-test",
"api":"post-question-answer"
}
```

## 修改问题状态

```
{
"arguments":{"source": "xiaoai",
	"key": "", //get-asking-list获得的_key值
	"status": "read"
},
"userId":"darwin-test",
"api":"post-question-status"
}

```

## 修改答案已读状态
```
{
"arguments":{"source": "xiaoai",
	"key": "", //get-asked-list获得的_key值
	"status": "read"
},
"userId":"darwin-test",
"api":"post-answer-status"
}

```

## 提交对某个问题的答复
```
{
"arguments":{
    "source": "xiaoai",
    "key": "1933863",
    "answerText": "你在哪个城"
    "media": ""
},
"userId":"darwin-test",
"api":"post-answer"
}
```

## 获取某个用户的status

```
{
"arguments":{"source": "xiaoai",
	"openid": ""
},
"userId":"darwin-test",
"api":"get-status"
}

```


