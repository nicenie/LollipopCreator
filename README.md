# LollipopCreator

Golang语言社区  前端creator框架，通信方式 websocket, 与社区的LollipopGo服务端框架完美结合。
>微信订阅号：Golang语言社区<Br/>
>微信服务号：Golang技术社区<Br/>
>商业定制版：联系彬哥(微信：cserli)<Br/>


论坛
--------------
WwW.Golang.Ltd

QQ群
-----------
221273219

腾讯云+社区专栏
-----------
[腾讯专栏](https://cloud.tencent.com/developer/column/2170)

Golang语言社区
-----------

<ol>
<li>希望更多喜欢游戏编程的同学及想从事开发游戏服务器的同学一个方向的指引</li>
<li>课程多维度教学，lollipopCreator游戏框架实战课程等等</li>
<li>LollipopCreator架构 最新版本: v1.0.X </li>
<li>LollipopCreator架构 直接下载就可以使用（彬哥维护），无需依赖管理，否则导致部分官方接口无法使用 </li>
<li>LollipopCreator架构 手机对战游戏视频：<a href="https://www.bilibili.com/video/av52239498" target="_blank">点击访问</a></li>
<li>LollipopCreator架构 PC端游对战游戏视频：<a href="https://www.bilibili.com/video/av54726431" target="_blank">点击访问</a></li>
<li>同时我们的免费课程也在持续更新中; 点击访问：<a href="http://gopher.ke.qq.com" target="_blank">腾讯课堂</a></li>
<li>同时我们的免费课程也在持续更新中; 点击访问：<a href="https://study.163.com/provider/400000000538037/index.htm?share=2&shareId=400000000538037" target="_blank">网易云课堂</a></li>
<li>同时我们的免费课程也在持续更新中; 点击访问：<a href="http://space.bilibili.com/389368547?" target="_blank">B站(bilibili.com)</a></li>
<li>同时我们的免费课程也在持续更新中; 点击访问：<a href="http://www.gameais.com" target="_blank">LollipopCreator框架文档地址：GameAIs平台(GameAIs.com)</a></li>
</ol>






架构目录说明
-----------
```go
├── Core
│   ├── ThirdLibrary  # 框架base64模块及AES加解密模块          
│   └── XX.js         # 客户端连接信息等
├── General
│   ├── Components    # 常用组件，字体，编辑框等
│   ├── Items         # FPS信息
│   ├── Manager       # 常用管理器：UIManager，AudioManager，CollectManager，SceneManager，TipManager等
│   └── NativeLib     # 本地化库
├── resources        
│   └── Base          
│   │   ├── data      # 头像信息
│   │   └── scripts   # 主场景管理
│   └── Master       
│       ├── data      # 设计之初放置放动画，声音，UI文件目录
│       ├── prefabs   # 设计之初方式场景，UI预制件目录
│       └── scripts   # 设计之初与prefabs目录相同，放置场景、UI脚本目录
└── ──── SubModules    
        ├── XXX_1Game  # 设计之初，游戏目录
        ├── XXX_2Game  # 设计之初，游戏目录
        └── XXX_3Game  # 游戏结构参照开源项目目录，

```
 <div class="footer">

 </div>

