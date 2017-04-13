【*内部资料请勿泄露】
##插件安装：
1. 请重置最新版本的package.json<br/>
```
svn revert package.json
```
2. 如果安装有android平台，否则忽略<br/>
```
ionic platform remove android
```
3. 添加android平台<br/>
```
ionic platform add android
```
##手工安装方法<br/>
微信支付插件
```
ionic plugin add cordova-plugin-wechat --variable wechatappid=wxccf2f10b80e74781
```
<i>极光推送插件</i>
```
ionic plugin add https://github.com/jpush/jpush-phonegap-plugin.git --variable API_KEY=bd48c48b3bafc74288176bca  
```