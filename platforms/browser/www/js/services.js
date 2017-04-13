angular.module('starter.services', [])
	.factory('Storage', function() {
		return {
			set: function(key, data) {
				return window.localStorage.setItem(key, window.JSON.stringify(data));
			},
			get: function(key) {
				return window.JSON.parse(window.localStorage.getItem(key));
			},
			remove: function(key) {
				return window.localStorage.removeItem(key);
			}
		};
	})

	.factory('Jpush', function(Storage, $state) {
		return {
			init: function() {
				try {
					window.plugins.jPushPlugin.init();
				} catch(exception) {
					// console.info(exception);
				}
				document.addEventListener("jpush.setTagsWithAlias", this.onTagsWithAlias, false); //设置别名与标签
				document.addEventListener("jpush.openNotification", this.onOpenNotification, false); //点击通知进入应用程序时会出发改事件
			},
			getRegistrationID: function() {
				window.plugins.jPushPlugin.getRegistrationID(function(data) {
					var JPushData = { registerId: data };
					try {
						console.info(JPushData);
						Storage.set('JPush', JPushData);
					} catch(exception) {
						console.info(exception);
					}
				});
			},
			setTagsWithAlias: function(tags, alias) {
				try {
					window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
				} catch(exception) {
					console.info(exception);
				}
			},
			onTagsWithAlias: function(event) {
				try {
					console.info(event);
				} catch(exception) {
					console.info(exception);
				}
			},
			onOpenNotification: function(event) {
				try {
					if(device.platform == "Android") {
						var extras = event.extras;
						if(extras.type == 'shopOrderNotice') {
							console.info('shopOrderNotice', extras);
							$state.go('shop.OrderDetails', { id: extras.orderId });
						}
					} else {
						alertContent = event.aps.alert;
					}
				} catch(exception) {
					console.info("JPushPlugin:onOpenNotification" + exception);
				}
			}
		}
	})

	.factory('System', function($rootScope, $http, $q, $timeout, $ionicLoading, $resource, $ionicPopup, $cordovaInAppBrowser, $cordovaAppVersion, Message, ENV) {
		var verInfo;
		var resource = $resource(ENV.YD_URL, { do: 'config' });
		return {
			aboutUs: function(success, error) {
				Message.loading();
				resource.get({ op: 'getVersion' }, success, error);
			},
			checkUpdate: function() {
				$http.get(ENV.YD_URL + '?do=config&op=getVersion').then(function(data) {
					if(data.code != 0) {
						return;
					}
					verInfo = data.data.data; //服务器 版本
					$cordovaAppVersion.getVersionNumber().then(function(version) {
						if(version < verInfo.version) {
							var confirmPopup = $ionicPopup.confirm({
								template: '发现新版本，是否更新版本',
								buttons: [{
									text: '取消',
									type: 'button-default'
								}, {
									text: '更新',
									type: 'button-positive',
									onTap: function() {
										$cordovaInAppBrowser.open(verInfo.downloadUrl, '_system');
									}
								}]
							});
						} else {
							return true;
						}
					}, function() {
						Message.show('通讯失败，请检查网络！');
					});
				}, false);
			},
			getNotice: function() {
				// document.getElementById("noticeMp3").play();
				$rootScope.globalInfo.noticeNum++;
				console.log('接受消息');
				// resource.get({op: 'notice'}, function (response) {
				// 	$rootScope.globalInfo.noticeNum++;
				// 	console.log('接受消息');
				// });
			},
			fetchCount: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.get({ op: 'count' }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			}
		}
	})

	.factory('Notice', function($rootScope, $http, $q, $timeout, $ionicLoading, $resource, $ionicPopup, $cordovaInAppBrowser, $cordovaAppVersion, Message, ENV) {
		var resource = $resource(ENV.YD_URL, { do: 'message' });
		return {
			getNotice: function() {
				resource.get({ op: 'notice' }, function(response) {
					if(response.code == 0) {
						if(response.data.length > 0) {
							$rootScope.globalInfo.noticeNum = response.data.length;
							document.getElementById("noticeMp3").play();
						}
					}
				});
			},
			getList: function(type, page) {
				var deferred = $q.defer();
				var page = page || 1;
				Message.loading();
				resource.save({ op: 'getList', types: type, page: page }, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			getInfo: function(id) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getInfo', id: id }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			}
		}
	})

	.factory('Message', function($ionicLoading) {
		return {
			show: function() {
				var text = arguments[0] ? arguments[0] : 'Hi，出现了一些错误，请检查网络或者退出重试！';
				var duration = arguments[1] ? arguments[1] : 1500;
				var callback = arguments[2] ? arguments[2] : '';
				$ionicLoading.hide();
				if(typeof callback === "function") {
					$ionicLoading.show({
						noBackdrop: true,
						template: text,
						duration: duration
					}).then(function() {
						callback();
					});
				} else {
					$ionicLoading.show({
						noBackdrop: true,
						template: text,
						duration: duration
					});
				}
			},
			loading: function() {
				var text = arguments[0] ? arguments[0] : '';
				$ionicLoading.hide();
				$ionicLoading.show({
					hideOnStateChange: false,
					duration: 10000,
					template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br/>' + text
				})
			},
			hidden: function() {
				$ionicLoading.hide();
			}
		};
	})

	.factory('TokenAuth', function($q, Storage, $location) {
		return {
			request: function(config) {
				var userInfo = Storage.get('user');
				config.headers = config.headers || {};
				if(userInfo && userInfo.token) {
					config.headers.TOKEN = userInfo.token;
				}
				return config;
			},
			response: function(response) {
				if(response.data.code === 403) {
					Storage.remove('user');
					$location.path('/auth/login');
				}
				return response || $q.when(response);
			}
		};
	})

	.factory('Home', function($resource, $rootScope, $ionicLoading, ENV, $q, Message, $state) {
		var home = {};
		var moreGoods = [];
		var resource = $resource(ENV.YD_URL, { do: 'home' });
		return {
			//获取首页轮播图和nav信息
			fetch: function() {
				Message.loading();
				//文章收藏列表  为了方便放在这个服务里面
				var deferred = $q.defer();
				resource.get({ op: 'display' }, function(response) {
					console.log(response);
					//Resource {code: 0, msg: "首页幻灯返回成功", data: Object, $promise: Promise, $resolved: true}
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			//获取首页商家列表
			fetchShops: function(page, lat, long) {
				Message.loading();
				page = page || 1;
				var deferred = $q.defer();
				resource.get({ op: 'shopsList', page: page, lat: lat, lng: long }, function(response) {
					Message.hidden();
					console.log(response);
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			//获取选择的城市坐在的经纬度
			getSearchCity: function(keyword) {
				Message.loading();
				var resource = $resource(ENV.YD_URL, { do: 'api' });
				var deferred = $q.defer();
				resource.get({ op: 'getLatlng', keyword: keyword }, function(response) {
					deferred.resolve(response);
					//返回的response：Resource {code: 0, msg: "经纬度获取成功！", data: Object, $promise: Promise, $resolved: true}
				});
				return deferred.promise;
				//起到保护作用，不允许函数外部改变函数内的deferred状态
			},
			// 导航跳转
			getNav: function(id) {
				Message.loading();
				var deferred = $q.defer();
				resource.get({ op: 'getNav', id: id }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.data);
					}
				});
				return deferred.promise;
			},
			// 商家列表
			shopsList: function(cid, page) {
				page = page || 1;
				var deferred = $q.defer();
				Message.loading();
				resource.get({ op: 'shopsList', cid: cid, page: page }, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 首页商家搜索功能
			goCategory: function(keywords) {
				if(!keywords || keywords.length < 1) {
					Message.show("请输入一个以上关键字！");
					return false;
				}
				$state.go('shops.shopsCategory', { keywords: keywords });
			},
			categoryList: function(keywords, page) {
				var page = page || 1;
				Message.loading();
				var deferred = $q.defer();
				resource.get({ op: 'shopsList', keywords: keywords, page: page }, function(response) {
					if(response.code == 1) {
						Message.show('您搜索的商家不存在！');
						return false;
					}
					deferred.resolve(response.data);
				})
				return deferred.promise;
			}
		};
	})

	// 商家
	.factory('Shop', function($resource, $rootScope, $ionicLoading, ENV, $q, Message) {
		var resource = $resource(ENV.YD_URL, { do: 'shops' });
		return {
			getShopsDetail: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({ op: 'shopsInfo', spid: spid }, function(response) {
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},
			praise: function(spid) {
				var res = $resource(ENV.YD_URL, { do: 'users' });
				var deferred = $q.defer();
				res.save({ op: 'followShops', spid: spid }, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 商家基本信息
			getShops: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'getShopsInfo',
					spid: spid
				}
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
						$state.go('tab.my');
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 商家二维码
			shopQrcode: function(spid) {
				Message.loading();
				var deferred = $q.defer();
				resource.save({ op: 'getQrcode', spid: spid }, function(response) {
					Message.hidden();
					deferred.resolve(response.data);
				});
				return deferred.promise;
			}
		};
	})

	// 用户登录、注册、找回密码
	.factory('Auth', function($resource, $rootScope, $q, ENV, Message, $state, Storage) {
		var resource = $resource(ENV.YD_URL + '&do=auth', { op: "@op" });
		var checkMobile = function(mobile) {
			if(!ENV.REGULAR_MOBILE.test(mobile)) {
				Message.show('请输入正确的11位手机号码', 800);
				return false;
			} else {
				return true;
			}
		};

		var checkPwd = function(pwd) {
			if(!pwd || pwd.length < 6) {
				Message.show('请输入正确的密码(最少6位)', 800);
				return false;
			}
			return true;
		};

		return {
			// 用户注册协议
			fetchAgreement: function() {
				var deferred = $q.defer();
				resource.get({ op: 'agreement' }, function(response) {
					deferred.resolve(response.data);
				});
				return deferred.promise;
			},

			// 登陆操作
			login: function(mobile, password) {
				if(!checkMobile(mobile)) {
					return false;
				}
				if(!checkPwd(password)) {
					return false;
				}
				Message.loading('登陆中……');
				resource.save({
					op: 'login',
					mobile: mobile,
					password: password
				}, function(response) {
					if(response.code == 0) {
						Message.show('登陆成功', 1500);
						Storage.set("user", response.data);
						$rootScope.globalInfo.user = response.data;
						console.log($rootScope.globalInfo.user)
						$state.go('tab.home');
					} else {
						Message.show(response.msg, 1500);
					}
				}, function() {
					Message.show('通信错误，请检查网络', 1500);
				});
			},
			//获取验证码
			getSmsCaptcha: function(type, tMobile, mobile, pictureCaptcha) {
				if(!checkMobile(mobile)) {
					return false;
				}
				var deferred = $q.defer();
				Message.loading('加载中');
				resource.save({ op: 'register', type: type, tMobile: tMobile, mobile: mobile, pictureCaptcha: pictureCaptcha }, function(response) {
					Message.hidden();
					console.log(response);
					if(response.code !== 0) {
						Message.show(response.msg);
						//	deferred.resolve();
						if(response.code == 2) {
							//							deferred.reject();
							deferred.resolve();
							//deferred.resolve();
						}
						return false;
					} else {
						deferred.resolve();
					}
				});
				return deferred.promise;
			},

			getoneLogin: function(success, error) {
				var res = $resource(ENV.YD_URL + '?do=api');
				res.save({ op: 'nav' }, success, error);
			},
			//忘记密码获取验证码
			getCaptcha: function(success, error, mobile) {
				if(!checkMobile(mobile)) {
					return false;
				}
				var _json = {
					op: 'forget',
					type: 'send',
					mobile: mobile
				};
				Message.loading();
				resource.save(_json, success, error);
			},
			//检查验证码
			checkCaptain: function(mobile, captcha, type) {
				if(!checkMobile(mobile)) {
					return false;
				}
				var _json = {
					op: 'register',
					type: 'verifycode',
					mobile: mobile,
					code: captcha
				};

				if(type) {
					_json = {
						op: 'forget',
						type: 'verifycode',
						mobile: mobile,
						code: captcha
					};
				}

				Message.loading();

				return resource.get(_json, function(response) {
					console.log(response);
					if(response.code !== 0) {
						Message.show(response.msg, 1500);
						//						Deferred.resolve()
						return;
					}
					$rootScope.$broadcast('Captcha.success');
					Message.show(response.msg, 1000);
				}, function() {
					Message.show('通信错误，请检查网络！', 1500);
				});
			},

			/*设置密码*/
			setPassword: function(reg, type) {
				if(reg.password.length < 6) {
					Message.show('密码长度不能小于6位！', 1500);
					return false;
				}
				if(reg.password != reg.rePassword) {
					Message.show('两次密码不一致，请检查！', 1500);
					return false;
				}
				var _json = {
					op: 'register',
					tMobile: reg.tMobile,
					mobile: reg.mobile,
					password: reg.password,
					repassword: reg.rePassword,
					code: reg.captcha
				};
				console.log(reg.mobile);
				if(type) {
					_json = {
						op: 'forget',
						mobile: reg.mobile,
						password: reg.password,
						repassword: reg.rePassword,
						code: reg.captcha
					};
				}

				Message.loading();
				return resource.get(_json, function(response) {
					if(response.code !== 0) {
						Message.show(response.msg, 1500);
						return;
					}
					$state.go('auth.login');
					Message.show("密码设置成功，请重新登录！", 1500);
				}, function() {
					Message.show('通信错误，请检查网络！', 1500);
				});
			},
			// 获取头像
			getUserLogo: function(success, error) {
				var res = $resource(ENV.YD_URL + '?do=api');
				res.get({ op: 'logo' }, success, error);
			}
		}
	})

	.factory('User', function($resource, $rootScope, $q, $ionicLoading, ENV, $state, Message, $timeout, Storage) {
		var resource = $resource(ENV.YD_URL, { do: 'users' });
		return {
			checkAuth: function() {
				return(Storage.get('user') && Storage.get('user').uid != '');
			},
			/*退出登录*/
			logout: function() {
				Storage.remove('user');
				Message.show('退出成功！', '1500', function() {
					$state.go("auth.login");
				});
			},
			// 实名认证
			getRealName: function(pasa, type) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {};
				if(type) {
					_json = {
						op: 'certification',
						type: 'save',
						realname: pasa.realname,
						gender: pasa.gender,
						idcard: pasa.idcard,
						code: pasa.code
					}
				} else {
					_json = {
						op: 'certification'
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.center');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 实名认证获取验证码
			realNamePwd: function(pasa) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'certification',
					type: 'send',
					realname: pasa.realname,
					gender: pasa.gender,
					idcard: pasa.idcard
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 修改登录及支付密码 获取验证码
			getCaptcha: function(oldpsd, newpsd, respsd, type) {
				var _json = {};
				Message.loading();
				var deferred = $q.defer();
				if(type == 1) {
					_json = {
						op: 'updatePassword',
						type: 'send',
						userPassword: oldpsd,
						password: newpsd,
						repassword: respsd
					}
				} else if(type == 2) {
					_json = {
						op: 'updatePayPassword',
						type: 'send',
						userPassword: oldpsd,
						password: newpsd,
						repassword: respsd
					}
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 忘记密码获取验证码
			resetPwd: function(newpsd, respsd) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'forgetPayPassword',
					type: 'send',
					password: newpsd,
					repassword: respsd
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 修改登录密码
			changeLoginPsd: function(oldpsd, code, newpsd, respsd) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'updatePassword',
					userPassword: oldpsd,
					code: code,
					password: newpsd,
					repassword: respsd
				};
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.center');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 修改支付密码
			changePayPsd: function(oldpsd, code, newpsd, respsd) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'updatePayPassword',
					userPassword: oldpsd,
					code: code,
					password: newpsd,
					repassword: respsd
				};
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.center');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 忘记支付密码提交修改
			resetPayPsd: function(newpsd, respsd, code) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'forgetPayPassword',
					code: code,
					password: newpsd,
					repassword: respsd
				}
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('user.center');
					} else {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 转增
			getGive: function(types, pasa) {
				var deferred = $q.defer();
				var _json = {};
				if(types) {
					_json = {
						op: 'getGive',
						giveUid: pasa.userId,
						bean: pasa.giveBeanNum,
						password: pasa.payPassword,
						type: 'save'
					}
				} else {
					_json = {
						op: 'getGive'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(types) {
							Message.show(response.msg);
							$timeout(function() {
								$state.go('user.giveList');
							}, 1200);
						}
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 用户帮助列表
			useHelp: function() {
				var deferred = $q.defer();
				var _json = {
					op: 'helpList'
				};
				Message.loading();
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else {
						Message.show(response.msg);
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 用户帮助列表详情
			helpInfo: function(id) {
				var deferred = $q.defer();
				var _json = {
					op: 'helpInfo',
					id: id
				};
				Message.loading();
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else {
						Message.show(response.msg);
					}

				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			// 转增记录
			giveList: function(type, page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({ op: 'giveList', type: type, page: page }, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 回购
			getRepo: function(t, pasa) {
				var deferred = $q.defer();
				var _json = {};
				if(t) {
					_json = {
						op: 'withdraw',
						bean: pasa.bean,
						password: pasa.password,
						type: 'save'
					}
				} else {
					_json = {
						op: 'withdraw'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							$timeout(function() {
								Message.show('提交成功！');
							}, 1200);
							$state.go('user.repoList');
						}
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 银行卡列表
			getBank: function(t, id) {
				var deferred = $q.defer();
				var _json = {};
				if(t == 'select') {
					_json = {
						op: 'getBank',
						id: id,
						type: 'save'
					}
				} else if(t == 'delete') {
					_json = {
						op: 'getBank',
						id: id,
						type: 'delete'
					}
				} else {
					_json = {
						op: 'getBank'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(t == 'select') {
						if(response.code == 0) {
							deferred.resolve(response.data);
							$state.go('user.repo');
						} else if(response.code == 1) {
							Message.show(response.msg);
						}
					} else if(t == 'delete') {
						deferred.resolve(response);
						if(response.code == 1) {
							Message.show(response.msg);
							return;
						}
					} else {
						if(response.code == 0) {
							deferred.resolve(response.data);
						} else if(response.code == 1) {
							Message.show(response.msg);
						}
					}
				});
				return deferred.promise;
			},
			// 添加银行卡
			getBankInfo: function(t, pasa) {
				var deferred = $q.defer();
				var _json = {};
				if(t) {
					_json = {
						op: 'getBankInfo',
						realname: pasa.userName,
						bankName: pasa.bankName,
						idCard: pasa.idCard,
						bankCard: pasa.bankCard,
						mobile: pasa.mobile,
						type: 'save'
					}
				} else {
					_json = {
						op: 'getBankInfo'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 回购列表
			getRepoList: function(type, page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({ op: 'withdrawList', type: type, page: page }, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 回购单
			getRepoInfo: function(id) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getWithdrawInfo', id: id }, function(response) {
					Message.hidden();
					deferred.resolve(response);
					if(response.code == 1) {
						Message.show(response.msg);
						return;
					}
				});
				return deferred.promise;
			},
			// 直捐
			getDonate: function(t, para) {
				var deferred = $q.defer();
				var _json = {};
				if(t) {
					_json = {
						op: 'getDonate',
						bean: para.donateNum,
						password: para.password,
						type: 'save'
					}
				} else {
					_json = {
						op: 'getDonate'
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
						if(t) {
							Message.show('直捐成功！');
							$timeout(function() {
								$state.go('user.donateList');
							}, 1200);
						}
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 直捐记录
			donateList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({ op: 'getDonateList', page: page }, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 推荐码
			recomCode: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getQrcode' }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 0) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 推荐记录
			recommendList: function(page) {
				var deferred = $q.defer();
				page = page || 1;
				Message.loading();
				resource.save({ op: 'histroyRecommend', page: page }, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			myBean: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getUserBean' }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			recommendBean: function(t, type, page, role) {
				var deferred = $q.defer();
				var _json = {};
				page = page || 1;
				if(t == 1) {
					_json = {
						op: 'getExcitationBean',
						type: type,
						page: page,
						role: role
					}
				} else if(t == 2) {
					_json = {
						op: 'getBeanRecUser',
						type: type,
						page: page
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			// 上个激励日
			getExcitation: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getDaysExcitation' }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 我的爱心
			getLove: function(role) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getLove', role: role }, function(response) {

					console.log(response);
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					} else {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			// 爱心详情
			loveInfo: function(role, type, page) {
				var deferred = $q.defer();
				var _json = {};
				page = page || 1;
				_json = {
					op: 'getLoveDetails',
					role: role,
					type: type,
					page: page
				};
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					deferred.resolve(response);
				});
				return deferred.promise;
			}

		}
	})

	.factory("Area", function($resource) {
		var resource = $resource("lib/area.json");
		return {
			getList: function(success, pid, cid) {
				resource.get({}, function(data) {
					success(data);
				});
			}
		}
	})

	.factory('Lbs', function(ENV, $resource) {
		var resource = $resource(ENV.YD_URL, { do: 'api' });
		/**
		 * @return {number}
		 */
		var Rad = function(d) {
			return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
		};
		return {
			calcDistance: function(p1, p2) {
				var radLat1 = Rad(p1.lat);
				var radLat2 = Rad(p2.lat);
				var a = radLat1 - radLat2;
				var b = Rad(p1.lng) - Rad(p2.lng);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10) / 10000; //输出为公里
				s = s.toFixed(2);
				return s;
			},
			getCity: function(success, error, posi) {
				return resource.get({ op: 'getPlace', lat: posi.lat, lng: posi.lng }, success, error);
			}
		};
	})

	.factory('Order', function(ENV, $resource, Message, $q, $state, $timeout) {
		var resource = $resource(ENV.YD_URL, { do: 'order', op: '@op' });
		return {
			create: function(money, voucher, remark, spid) {
				Message.loading();
				var deferred = $q.defer();
				var _json = {
					op: 'create',
					money: money,
					voucher: voucher,
					remarks: remark,
					spid: spid
				};
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
						$state.go('shops.orderInfo', { 'id': response.data, type: 'user' });
						$timeout(function() {
							Message.show(response.msg);
						}, 1200);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				}, function() {
					Message.show('通信错误，请检查网络!', 1500);
				});
				return deferred.promise;
			},
			getList: function(type, page) {
				var deferred = $q.defer();
				page = page || 1;
				var _json = {};
				if(type == 'shops') {
					_json = {
						op: 'getList',
						type: 'shops',
						page: page
					}
				} else if(type == 'user') {
					_json = {
						op: 'getList',
						type: 'user',
						page: page
					}
				}
				Message.loading();
				resource.save(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			getInfo: function(id) {
				var deferred = $q.defer();
				var _json = {
					op: 'getInfo',
					id: id
				}
				Message.loading();
				resource.get(_json, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				});
				return deferred.promise;
			},
			refuse: function(refuseRemark, id) {
				var deferred = $q.defer();
				Message.loading();
				resource.get({ op: 'refuse', refuseRemark: refuseRemark, id: id }, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			},
			confirm: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.get({ op: 'refuse' }, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			}
		};
	})

	.factory('Payment', function($resource, $ionicLoading, ENV, Message, $q) {
		var resource = $resource(ENV.YD_URL, { do: 'payment', op: '@op' });
		return {
			getOffline: function(orderId, thumbs) {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'getOffline', orderId: orderId, thumbs: thumbs }, function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			}
		}
	})

	.factory('Mc', function($resource, $ionicLoading, ENV, Message, $q) {
		var resource = $resource(ENV.YD_URL, { do: 'mc', op: '@op' });
		return {
			getMy: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'display' }, function(response) {
					console.log(response)
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show('response.msg');
					}
				});
				return deferred.promise;
			}
		}
	})
	.factory('Apply', function($resource, $ionicLoading, ENV, Message, $q, $state, $rootScope, Storage) {
		var resource = $resource(ENV.YD_URL, { do: 'users' });
		return {
			// 进入申请商家或进入商家中心页面
			getApply: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'applyfor' }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 301) {
						Message.show(response.msg);
						$state.go('shops.wait');
					} else if(response.code == 2) {
						Message.show(response.msg);
						$state.go('shops.center', { spid: $rootScope.globalInfo.user.isShop });
						var shopApply = Storage.get('user');
						shopApply.isShop = response.data;
						Storage.set('user', shopApply);
						$rootScope.globalInfo.user = shopApply;
						console.log(shopApply);
						console.log(Storage.get('user'));
					} else if(response.code == 1) {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			// 获取商家经营类型和让利类型
			getApplyType: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'applyfor' }, function(response) {
					Message.hidden();
					if(response.code == 0) {
						deferred.resolve(response.data);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			// 审核等待刷新请求
			refreshApply: function() {
				var deferred = $q.defer();
				Message.loading();
				resource.save({ op: 'applyfor' }, function(response) {
					if(response.code == 301) {
						Message.show(response.msg);
					} else if(response.code == 2) {
						Message.show(response.msg);
						$state.go('shops.center', { spid: $rootScope.globalInfo.user.isShop });
						$rootScope.globalInfo.user.isShop = response.data;
					} else if(response.code == 1) {
						Message.show(response.msg);
					}

				});
				return deferred.promise;
			},
			// 提交商家申请
			subApply: function(apply, area) {
				var deferred = $q.defer();
				Message.loading();
				var _json = {
					op: 'applyfor',
					type: 'save',
					username: apply.userName,
					shopName: apply.shopName,
					cname: apply.cName,
					shopPerUid: apply.shopPer,
					address: apply.address,
					birth: area,
					mobile: apply.mobile,
					description: apply.shopDescrip,
					cid: apply.selecedType,
					shopsRebateType: apply.selectedBili,
					idCardThumbA: apply.corrImg,
					idCardThumbB: apply.falImg,
					businessLicence: apply.businessImg,
					accordingToTheDoor: apply.shopsImg
				}
				resource.save(_json, function(response) {
					if(response.code == 301) {
						Message.show(response.msg, 2000);
						deferred.resolve(response);
					} else if(response.code == 1) {
						Message.show(response.msg);
					}
				})
				return deferred.promise;
			}
		}
	})