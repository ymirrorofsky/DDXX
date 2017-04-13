angular.module('starter.controllers', [])

	.controller('homeCtrl', function($rootScope, $scope, $ionicSlideBoxDelegate, $ionicLoading, $ionicModal, $state, $http, Home, Message, $location, $anchorScroll, $ionicScrollDelegate, Lbs, $ionicPopup, Storage, $cordovaGeolocation, $cordovaInAppBrowser) {
		//		$scope.$on("$ionicView.beforeEnter", function() {
		//			if(!$rootScope.globalInfo.user.uid) {
		//				$state.go('auth.login');
		//			}

		$scope.pageData = { focusListData: '', navList: '', shopsList: [] }; // 初始化页面数据
		$scope.shops = { shopsList: '' };
		$scope.keywords = '';
		// 加载首页幻灯和导航
		Message.loading('加载中……');
		Home.fetch().then(function(data) {
			$scope.pageData = { focusListData: data.slide, navList: data.navList };
			if($scope.pageData.focusListData) {
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
			}
			Message.hidden();
		});
		// 首页搜索功能
		$scope.search = function() {
			Home.goCategory($scope.keywords);
		};
		// 导航跳转
		// ----------------------------------------------
		// $scope.toUrl = function(id) {
		// 	console.log(id)
		// 	Home.getNav(id).then(function(data) {
		// 		console.log(data)
		// 		if(data.link.url == 'shops.shopsInfo') {
		// 			$state.go(data.link.url, { spid: data.link.param.id });
		// 		} else if(data.link.url == 'shops.shopsList') {
		// 			console.log('shops.shopsList')
		// 			$state.go(data.link.url, { cid: data.link.param.id });
		// 		} else if(data.link.http == 1) {
		// 			document.addEventListener("deviceready", function() {
		// 				var options = {
		// 					location: 'yes',
		// 					clearcache: 'yes',
		// 					toolbar: 'yes',
		// 					toolbarposition: 'top'
		// 				};
		// 				$cordovaInAppBrowser.open(data.link.url, '_self', options)
		// 					.then(function(event) {
		// 						console.log(event)
		// 					})
		// 					.catch(function(event) {
		// 						// error
		// 						console.log(event)
		// 					});
		// 			}, false);
		// 		} else {
		// 			$state.go(data.link.url);
		// 		}
		// 	});
		// };
		// --------------------------------------

	$scope.toUrl = function(id) {
			console.log(id)
			Home.getNav(id).then(function(data) {
				console.log(data)
				$state.go('shops.shopsList', { cid: data.cid});				
			});
		};




		//-----------------------------------------------
		$scope.curPosition = { "status": 1 }; //1：定位失败，2：定位中，3：定位成功, 4：并获取到更新
		// 获取首页商家
		$scope.$on('shops.list.update', function(event, data) {
			//noinspection JSUnresolvedVariable
			console.log('nihao')
			Home.fetchShops(data.page, data.lat, data.lng).then(function(response) {
				console.log(response)
				//response:Resource {code: 1, msg: "商家信息返回为空", data: Array(0), $promise: Promise, $resolved: true}
				// console.log("更新商家", data);
				$scope.curPosition.status = 4;
				if(response.code == 1) {
					Message.show(response.msg);
					return;
				}
				$scope.shops.shopsList = response.data;
				console.log($scope.shops.shopsList)
			});
		});
		$scope.$broadcast('shops.list.update', $scope.curPosition);
		// 列表下拉刷新
		$scope.doRefresh = function() {
			Home.fetch().then(function(data) {
				$scope.pageData = { focusListData: data.slide, navList: data.navList };
				if($scope.pageData.focusListData) {
					$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
				}
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('shops.list.update', $scope.curPosition);
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1200'
				});
			});
		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function() {
			Home.fetchShops($scope.page, $scope.curPosition.lat, $scope.curPosition.lng).then(function(data) {
				$scope.page++;
				$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(data.code != 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};

		// 选择城市modal
		$ionicModal.fromTemplateUrl('templates/modal/location.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.citySelectModal = modal;
		});
		$scope.openModal = function() {
			$http.get('data/city.json').success(function(data) {
				$scope.cityList = data;
				$scope.citySelectModal.show();
			});
		};
		// 锚点跳转
		$scope.quickSelect = function(x) {
			$location.hash(x);
			$anchorScroll();
			$ionicScrollDelegate.$getByHandle('citySelectScroll').resize();
		};
		// 选择市
		$scope.selectCity = function(city) {
			Home.getSearchCity(city).then(function(response) {
				console.log(response)
				Message.hidden();
				if(response.code == 1) {
					Message.show(response.msg);
					console.log(response.msg)
					return;
				}
				$scope.pageData.shopsList = response.data;

				$scope.curPosition.status = 3;
				$scope.curPosition.city = city;
				//noinspection JSUnresolvedVariable
				$scope.curPosition.lat = response.data.latlng.lat; //当前城市纬度
				//noinspection JSUnresolvedVariable
				$scope.curPosition.lng = response.data.latlng.lng; //当前城市经度
				console.log($scope.curPosition)
				//$scope.curPosition:Object {status: 3, city: "安康", lat: 32.690575, lng: 109.03592}
				Storage.set("curPosition", $scope.curPosition);
				$scope.$broadcast('shops.list.update', $scope.curPosition);
				$ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
				$ionicSlideBoxDelegate.update();
			});
			$scope.citySelectModal.hide();
		};

		// 定位		
		var geolocationOption = { timeout: 5000, maximumAge: 10000, enableHighAccuracy: true }; //定位插件参数
		if(Storage.get("curPosition") === null) {
			$scope.curPosition.status = 2;
			//			Message.loading("定位中……");
			$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function(position) {
				$scope.curPosition.lat = position.coords.latitude;
				$scope.curPosition.lng = position.coords.longitude;
				Lbs.getCity(function(respond) {
					console.log(respond);
					if(respond.code == 0) {
						$scope.curPosition.city = respond.data;
						$scope.curPosition.status = 3;
						Storage.set("curPosition", $scope.curPosition);
						$scope.$broadcast('shops.list.update', $scope.curPosition);
					} else {
						$scope.curPosition.status = 1;
						Message.show(respond.msg);
					}
				}, function() {
					$scope.curPosition.status = 1;
					Message.show("定位失败，请手动选择当前城市");
				}, $scope.curPosition);
			}, function(err) {
				console.log(err)
				$scope.curPosition.status = 1;
				Message.show('定位失败，请在左上角手动选择当前城市！', 3000);
				console.info(err);
				return false;
			})

		} else {
			$scope.curPosition.status = 3;
			$scope.curPosition.city = Storage.get("curPosition").city;
			$scope.curPosition.lat = Storage.get("curPosition").lat;
			$scope.curPosition.lng = Storage.get("curPosition").lng;
			$scope.$broadcast('shops.list.update', $scope.curPosition);
			//校正历史定位
			$cordovaGeolocation.getCurrentPosition(geolocationOption).then(function(position) {
				var newPosition = {};
				newPosition.lat = position.coords.latitude;
				newPosition.lng = position.coords.longitude;
				Lbs.getCity(function(respond) {
					if(respond.code == 0) {
						newPosition.city = respond.data;
						if(newPosition.city !== "" && newPosition.city != $scope.curPosition.city) {
							//提示切换位置  弹窗
							$ionicPopup.confirm({
								template: '当前城市为：' + newPosition.city + '是否切换？',
								buttons: [{
										text: '取消',
										onTap: function() {
											return false;
										}
									},
									{
										text: '确定',
										type: 'button-assertive',
										onTap: function() {
											$scope.curPosition.status = 3;
											$scope.curPosition.city = newPosition.city;
											$scope.curPosition.lat = newPosition.lat;
											$scope.curPosition.lng = newPosition.lng;
											Storage.set("curPosition", $scope.curPosition);
											$scope.$broadcast('shops.all.update', $scope.curPosition);
											return true;
										}
									}
								]
							});
						}
						if(Lbs.calcDistance($scope.curPosition, newPosition) > 500) {
							$scope.curPosition.status = 3;
							$scope.curPosition.city = newPosition.city;
							$scope.curPosition.lat = newPosition.lat;
							$scope.curPosition.lng = newPosition.lng;
							Storage.set("curPosition", $scope.curPosition);
							$scope.$broadcast('shops.list.update', $scope.curPosition);
						}
					}
				}, function() {
					console.info(err);
				}, newPosition);
			}, function(err) {
				//Do Nothing
				console.info(err);
				return false;
			});
		}

	})
	// 商家搜索列表
	.controller('shopsCategoryCtrl', function($scope, Home, $stateParams, Message, $ionicLoading) {
		$scope.keywords = $stateParams.keywords;

		$scope.pageData = {
			shopsList: ''
		};
		Home.categoryList($scope.keywords).then(function(data) {
			Message.hidden();
			$scope.pageData.shopsList = data;
		});
		$scope.searchShop = function() {
			Home.goCategory($scope.keywords);
		};
		// 下拉刷新
		$scope.doRefresh = function() {
			$scope.refreshing = true;
			Home.categoryList($scope.keywords).then(function(data) {
				$scope.pageData.shopsList = data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1000'
				});
			})
		};
		// 上拉加载更多
		$scope.page = 2;
		$scope.noMore = true;
		$scope.loadMoreGoods = function() {
			$scope.refreshing = false;
			Home.categoryList($scope.keywords, $scope.page).then(function(data) {
				$scope.page++;
				$scope.pageData.shopsList = $scope.pageData.shopsList.concat(data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(data.code != 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			})
		}
	})
	.controller('listCtrl', function($scope, User) {
		$scope.totalInfo = { count: '', list: '', roleInfo: '', rebateInfo: '', arcData: {} };
		$scope.role = 1;
		if($scope.role == 1) {
			$scope.rolemenu = '信使';
		} else {
			$scope.rolemenu = '商家';
		}
		User.getLove($scope.role).then(function(data) {
			console.log(data);
			$scope.totalInfo = data;
			$scope.$broadcast("chart-update", $scope.totalInfo.arcData);
		});
		$scope.selectRole = function(role) {
			$scope.myVar = !$scope.myVar;
			$scope.role = role;
			if($scope.role == 1) {
				$scope.rolemenu = '信使';
			} else {
				$scope.rolemenu = '商家';
			}
			User.getLove($scope.role).then(function(data) {
				console.log(data);
				$scope.totalInfo = data;
				$scope.$broadcast("chart-update", $scope.totalInfo.arcData);
			});
		};

	})

	.controller('myCtrl', function($scope, $cordovaBarcodeScanner, $state, Message, Mc, Apply, $rootScope, Storage) {

		$scope.myInfo = {};
		Mc.getMy().then(function(data) {
			$scope.myInfo = data;
			console.log($scope.myInfo)
		});
		// 请求商家经营类型和让利类型
		$scope.toApply = function() {
			Mc.getApply().then(function(data) {
				$state.go('user.apply');
			})
			//			Apply.getApply().then(function(data) {
			//				$state.go('user.apply');
			//			})
		};
		$scope.toApplyCA = function() {
			Apply.getApplyCA().then(function(data) {
				$state.go('user.applyCAgent');
			})
		};
		$scope.toApplySM = function() {
			Apply.getApplySM().then(function(data) {
				$state.go('user.applySMan');
			})
		};

		// 消息是否显示
		$scope.msgNum = false;
		// console.log($rootScope.globalInfo.noticeNum);
		if($rootScope.globalInfo.noticeNum > 0) {
			$scope.msgNum = true;
		} else {
			$scope.msgNum = false;
		}
		$scope.showMsg = function() {
			$rootScope.globalInfo.noticeNum = 0;
			// Storage.set("noticeNum", $rootScope.globalInfo);
			$scope.msgNum = false;
			$state.go('user.myMessage');
		};
		// 扫码处理
		$scope.scan = function() {
			document.addEventListener("deviceready", function() {
				$cordovaBarcodeScanner.scan({
					prompt: "请保持手机或二维码稳定"
				}).then(function(barcodeData) {

					if(barcodeData.cancelled) {
						return false;
					}
					$scope.qr = barcodeData;
					var preg = /^http:\/\/.*\/yd\/\d+\/(\d+)$/;
					//http:// jkljjlk/yd/123/1234
					if(preg.test($scope.qr.text)) {
						var spid = $scope.qr.text.match(preg)[1];
						$state.go('user.pay', { 'spid': spid });
					} else {
						Message.show('二维码不是平台专用，请核对后再扫！', 2000);
					}
				}, function(error) {
					console.log(error);
					Message.show('扫码失败，请尝试重新扫码！', 2000);
				});
			});
		}
	})

	.controller('userPayCtrl', function($scope, $ionicPlatform, $cordovaCamera, Message, $ionicActionSheet, ENV, Order, Shop, $stateParams) {
		$scope.id = $stateParams.spid;
		$scope.shopsName = {};
		// 获取商家基本信息
		Shop.getShops($scope.id).then(function(data) {
			$scope.shopsName = data;
		});
		/*上传支付凭证*/
		$scope.payInfo = {
			money: '',
			img: '',
			remark: ''
		};
		var selectImages = function(from) {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if(from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function() {
				$cordovaCamera.getPicture(options).then(function(imageURI) {
					$scope.payInfo.img = "data:image/jpeg;base64," + imageURI;
					var image = document.getElementById('divImg');
					image.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
				}, function(error) {
					console.log('失败原因：' + error);
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 弹出选择图片 
		$scope.uploadAvatar = function() {
			var buttons = [];
			buttons = [
				{ text: "拍一张照片" },
				{ text: "从相册选一张" }
			]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function(index) {
					if(index == 0) {
						selectImages("camera");
					} else if(index == 1) {
						selectImages();
					}
					return true;
				}
			})
		};
		// 提交
		$scope.sureSubmit = function() {
			if(!$scope.payInfo.money || !ENV.REGULAR_MONEY.test($scope.payInfo.money)) {
				Message.show('请输入正确的金额！');
				return;
			}
			if(!$scope.payInfo.img) {
				Message.show('请上传支付凭证！');
				return;
			}
			if(!$scope.payInfo.remark) {
				Message.show('请输入备注信息！');
				return;
			}
			Order.create($scope.payInfo.money, $scope.payInfo.img, $scope.payInfo.remark, $scope.id);
		}
	})

	.controller('countCtrl', function($scope, $ionicSlideBoxDelegate, System) {
		$scope.countInfo = { settled: '', shopsLove: '', userLove: '', yesterday: '', shopsList: '' };
		$scope.curTab = 0;
		$scope.selectTab = function(index) {
			$scope.slectIndex = index;
			$ionicSlideBoxDelegate.slide(index);
		};
		$scope.slideHasChanged = function(index) {
			$scope.curTab = index;
		};
		System.fetchCount().then(function(data) {
			$scope.countInfo = data;
		});
	})

	.controller('shopsListCtrl', function($scope, Home, $stateParams, $ionicLoading) {
		$scope.cid = $stateParams.cid;
		$scope.pageData = { shopsList: '' };
		Home.shopsList($scope.cid).then(function(response) {
			$scope.pageData.shopsList = response.data;
		});

		// 列表下拉刷新
		$scope.doRefresh = function() {
			Home.shopsList($scope.cid).then(function(response) {
				$scope.refreshing = true; //下拉加载时避免上拉触发
				$scope.pageData.shopsList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '1200'
				});
			});
		};
		// 下拉加载更多商家
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMoreGoods = function() {
			Home.shopsList($scope.cid, $scope.page).then(function(response) {
				$scope.page++;
				$scope.pageData.shopsList = $scope.pageData.shopsList.concat(response.data);
				$scope.$broadcast('scroll.refreshComplete');
				if(response.code != 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多商家了！',
						duration: '1200'
					});
					$scope.noMore = false;
				}
			});
		};
	})

	.controller('shopsInfoCtrl', function($scope, Shop, $stateParams, $ionicSlideBoxDelegate, Message, $cordovaInAppBrowser) {
		$scope.shopsdetail = { slide: '', locationUrl: '', isFollow: 0, followNum: 0 };
		Shop.getShopsDetail($stateParams.spid).then(function(data) {
			Message.hidden();
			$scope.shopsdetail = data;
			$scope.shopsdetail.slide = data.thumbs;
			console.log($scope.shopsdetail.slide)
			$ionicSlideBoxDelegate.$getByHandle("slideimgs").update();
		});
		$scope.praise = function() {
			if($scope.shopsdetail.isFollow == 0) {
				Shop.praise($scope.shopsdetail.id).then(function(response) {
					if(response.code == 0) {
						$scope.shopsdetail.followNum++;
						Message.show(response.msg);
					} else {
						Message.show('您已经赞过');
					}
				});
			} else {
				Message.show('您已经赞过');
			}
		};

		$scope.showAddress = function(url) {
			document.addEventListener("deviceready", function() {
				var options = {
					location: 'yes',
					clearcache: 'yes',
					toolbar: 'yes',
					toolbarposition: 'top'

				};
				$cordovaInAppBrowser.open(url, '_system', options)
					.then(function(event) {
						console.log(event)
					})
					.catch(function(event) {
						// error
						console.log(event)
					});
			}, false);
		}
	})

	.controller('shopsOrderInfoCtrl', function($scope, Shop, $stateParams, $ionicModal, Message, Order, $state, $timeout) {
		// orderStatus -2: 代表平台拒绝, -1: 商家拒绝， 0： 待商家确认， 1： 商家已确认待平台确认， 2： 平台已确认订单完成
		$scope.type = $stateParams.type;
		$scope.orderInfo = { orderStatus: '', refuseCont: '' };
		if($scope.type == 'shops') {
			$scope.statusName = {
				'0': '确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家已拒绝',
				'-2': '平台已拒绝'
			};
		} else if($scope.type == 'user') {
			$scope.statusName = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家已拒绝',
				'-2': '平台已拒绝'
			};
		}
		Order.getInfo($stateParams.id).then(function(data) {
			$scope.orderInfo = data;
		});

		// 支付凭证modal
		$ionicModal.fromTemplateUrl('templates/modal/payVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.payVoucher = modal;
		});
		$scope.showVoucher = function() {
			$scope.payVoucher.show()
		};
		// 拒绝原因modal
		$ionicModal.fromTemplateUrl('templates/modal/reject.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.reject = modal;
		});
		$scope.rejectContent = function() {
			$scope.reject.show()
		};
		// 拒绝订单
		$scope.refuse = function() {
			if(!$scope.orderInfo.refuseCont) {
				Message.show('请输入拒绝原因！');
				return;
			}
			Order.refuse($scope.orderInfo.refuseCont, $stateParams.id).then(function(response) {
				Message.hidden();
				if(response.code == 0) {
					$scope.reject.hide();
					$state.go('shops.orderList', { 'type': 'shops' });
					$timeout(function() {
						Message.show('订单拒绝成功！');
					}, 1000);
				} else if(response.code == 1) {
					Message.show(response.msg);
				}
			});
		};

	})

	.controller('loginCtrl', function($rootScope, $scope, $ionicModal, Auth, $state, Message) {

		$scope.$on("$ionicView.beforeEnter", function() {
			if($rootScope.globalInfo.user.uid) {
				$state.go('tab.home');
			}
		});
		//		 headimg: '', info: ''
		$scope.spContent = {};
		$scope.agree = true;
		$scope.authAgree = function() {
			$scope.agree = !$scope.agree;
		};
		$scope.login = { mobile: '', password: '' };

		$ionicModal.fromTemplateUrl('templates/modal/single-page.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.spTitle = '用户注册协议';
			Auth.fetchAgreement().then(function(data) {
				$scope.spContent = data;
			});
		});
		$scope.showAgreement = function($event) {
			$scope.modal.show();
			$event.stopPropagation(); // 阻止冒泡
		};

		// 登陆业务逻辑
		$scope.login = function() {
			if(!$scope.agree) {
				Message.show('请勾选会员注册协议');
				return false;
			}
			Auth.login($scope.login.mobile, $scope.login.password);
		}
	})

	.controller('shopOrderListCtrl', function($scope, Order, $ionicLoading, $stateParams) {
		$scope.type = $stateParams.type;
		console.log($scope.type);
		$scope.orderList = [];
		$scope.orderEmpty = false;
		Order.getList($scope.type).then(function(response) {

			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderList = response.data;
			}
		});
		if($scope.type == 'shops') {
			$scope.statusName = {
				'0': '未确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家已拒绝',
				'-2': '平台已拒绝'
			};
		} else if($scope.type == 'user') {
			$scope.statusName = {
				'0': '待商家确认',
				'1': '待平台确认',
				'2': '已完成',
				'-1': '商家已拒绝',
				'-2': '平台已拒绝'
			};
		}
		// 列表下拉刷新
		$scope.doRefresh = function() {
			Order.getList($scope.type).then(function(response) {
				if(response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderList = response.data;
				}
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};

		// 下拉加载更多列表
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			Order.getList($scope.type, $scope.page).then(function(response) {
				$scope.page += 1;
				$scope.orderList = $scope.orderList.concat(response.data);
				if(response.code == 0) {
					if(response.data.length == 0) {
						$scope.noMore = true;
						$ionicLoading.show({
							noBackdrop: true,
							template: '没有更多订单了！',
							duration: '1200'
						});
					}
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			})
		};
	})

	.controller('shopQrcodeCtrl', function($scope, Shop, $rootScope) {
		console.log($rootScope.globalInfo.user.isShop)
		$scope.shopQrcode = { shopInfo: '', status: '' };
		Shop.shopQrcode($rootScope.globalInfo.user.isShop).then(function(data) {
			console.log(data)
			$scope.shopQrcode = data;
		})
	})

	.controller('shopCenterCtrl', function($scope, Shop, $rootScope) {
		$scope.shopsInfo = {};
		Shop.getShops($rootScope.globalInfo.user.isShop).then(function(data) {
			$scope.shopsInfo = data;
		})
	})

	.controller('shopPayCtrl', function($scope, $stateParams, $ionicPlatform, $ionicModal, Shop, $ionicActionSheet, $cordovaCamera, Message, Payment, $state, $timeout) {
		$scope.orderInfo = { orderId: '', spid: '', payPrice: '', voucher: '' };
		$scope.orderInfo.orderId = $stateParams.orderId;
		$scope.orderInfo.spid = $stateParams.spid;
		$scope.orderInfo.payPrice = $stateParams.payPrice;
		// 选择支付类型
		$scope.payType = 'credit';
		$scope.selectPayType = function(type) {
			$scope.payType = type;
		};

		Shop.getShops($scope.orderInfo.spid).then(function(data) {
			$scope.shopsInfo = data;
		});

		$ionicModal.fromTemplateUrl('templates/modal/shopsVoucher.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.shopsVoucher = modal;
		});

		$scope.orderConfirm = function() {
			if($scope.payType == 'wechat') {
				//noinspection JSUnresolvedVariable
				if(!window.Wechat) {
					alert("暂不支持微信支付！");
					return false;
				}
				Payment.wechatPay(model);
			} else if($scope.payType == 'alipay') {
				alert("证书尚未配置，请用微信支付！");
			} else if($scope.payType == 'credit') {
				$scope.shopsVoucher.show();
			}
		};

		$scope.uploadAvatar = function(type) {
			var buttons = [];
			buttons = [
				{ text: "拍一张照片" },
				{ text: "从相册选一张" }
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function(index) {
					if(index == 0) {
						$scope.selectImages("camera", type);
					} else if(index == 1) {
						$scope.selectImages('', type);
					}
					return true;
				}
			})

		};
		/*上传凭证*/
		$scope.selectImages = function(from) {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};

			if(from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function() {
				$cordovaCamera.getPicture(options).then(function(imageURI) {
					var image = document.getElementById('divImg');
					$scope.orderInfo.voucher = "data:image/jpeg;base64," + imageURI;
					image.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
				}, function() {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 提交
		$scope.sureSubmit = function() {
			if(!$scope.orderInfo.voucher) {
				Message.show('请上传支付凭证！');
				return;
			}
			Payment.getOffline($scope.orderInfo.orderId, $scope.orderInfo.voucher).then(function(response) {
				Message.hidden();
				if(response.code == 0) {
					$scope.shopsVoucher.hide();
					$state.go('shops.orderList', { 'type': 'shops' });
					$timeout(function() {
						Message.show('提交成功，请耐心等待');
					}, 1500);
				} else if(response.code == 1) {
					Message.show(response.msg);
				}
			});
		}
	})

	.controller('registerCtrl', function($scope, $ionicModal, Message, ENV, Auth, $interval, Storage) {
		$scope.reg = { step: 1, tMobile: '', mobile: '', pictureCaptcha: '', captcha: '', agree: true, password: '', rePassword: '', number: 60, bol: false };
		// 会员注册协议
		$ionicModal.fromTemplateUrl('templates/modal/single-page.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.spTitle = '用户注册协议';
			Auth.fetchAgreement().then(function(data) {
				$scope.spContent = data;
			});
		});
		$scope.showAgreement = function($event) {
			$scope.modal.show();
			$event.stopPropagation(); // 阻止冒泡
		};

		//获取短信验证码
		//		$scope.pictureCaptchaUrl="http://tcbj.noy7.com/app/index.php?i=34&c=entry&m=welfare&do=utility&op=getPictureCaptcha";
		$scope.pictureCaptchaUrl = ENV.YD_URL + '&do=utility&op=getPictureCaptcha';
		$scope.getSmsCaptcha = function() {
			if($scope.reg.tMobile) {
				if(!ENV.REGULAR_MOBILE.test($scope.reg.tMobile)) {
					Message.show('请输入正确的推荐人手机号');
					return;
				}
			}
			if(!$scope.reg.mobile || !ENV.REGULAR_MOBILE.test($scope.reg.mobile)) {
				Message.show('请输入正确的手机号');
				return;
			}
			if(!$scope.reg.pictureCaptcha) {
				Message.show('请输入验证码');
				return;
			}
			Auth.getSmsCaptcha('send', $scope.reg.tMobile, $scope.reg.mobile, $scope.reg.pictureCaptcha).then(function() {
				$scope.reg.step = 2;
				$scope.countDown();
			}, function() {
				document.querySelector('img[update-img]').src = $scope.pictureCaptchaUrl; // 更新图片验证码

			});
		};

		// 验证验证码，设置密码
		$scope.next = function() {
			if($scope.reg.step == 2) {
				Auth.checkCaptain($scope.reg.mobile, $scope.reg.captcha);
			} else if($scope.reg.step == 3) {
				console.log($scope.reg)
				Auth.setPassword($scope.reg);
			}
		};
		//验证成功后
		$scope.$on("Captcha.success", function() {
			$scope.reg.step = 3;
		});
		//发送验证后倒计时
		$scope.countDown = function() {
			$scope.reg.step = 2;
			$scope.reg.bol = true;
			$scope.reg.number = 60;
			var timer = $interval(function() {
				if($scope.reg.number <= 1) {
					$interval.cancel(timer);
					$scope.reg.bol = false;
					$scope.reg.number = 60;
				} else {
					$scope.reg.number--;
				}
			}, 1000)
		};
	})

	.controller('resetPsdCtrl', function($scope, Auth, $interval, Message, $rootScope) {
		$scope.reg = { captcha: null, mobile: null, password: null, repassword: null, number: 60, bol: false };
		$scope.showNext = 1;
		//获取短信验证码
		$scope.getCaptcha = function() {
			Auth.getCaptcha(function(response) {
				if(response.code !== 0) {
					Message.show(response.msg);
					return false;
				}
				$rootScope.$broadcast('Captcha.send');
				Message.show(response.msg, 1000);
			}, function() {
				Message.show('通信错误，请检查网络!', 1500);
			}, $scope.reg.mobile);
		};
		// 验证验证码
		$scope.next = function() {
			if($scope.showNext == 3) {
				Auth.setPassword($scope.reg, 1);
			} else if($scope.showNext == 1) {
				Auth.checkCaptain($scope.reg.mobile, $scope.reg.captcha, 1);
			}
		};
		//验证成功后
		$scope.$on("Captcha.success", function() {
			$scope.showNext = 3;
		});
		//发送验证后倒计时
		$scope.$on("Captcha.send", function() {
			$scope.reg.bol = true;
			$scope.reg.number = 60;
			var timer = $interval(function() {
				if($scope.reg.number <= 1) {
					$interval.cancel(timer);
					$scope.reg.bol = false;
					$scope.reg.number = 60;
				} else {
					$scope.reg.number--;
				}
			}, 1000)
		});
	})

	.controller('userCenterCtrl', function($scope, $rootScope, $ionicActionSheet, $ionicLoading, $ionicHistory, $timeout, $state, User, $ionicModal, $cordovaCamera) {
		// 退出登录
		$scope.logout = function() {
			$ionicActionSheet.show({
				destructiveText: '退出登录',
				titleText: '确定退出当前登录账号么？',
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				destructiveButtonClicked: function() {
					User.logout();
					$ionicHistory.nextViewOptions({ //退出后清除导航的返回
						disableBack: true
					});
					$ionicLoading.show({
						noBackdrop: true,
						template: '退出成功！',
						duration: '1500'
					});
					$timeout(function() {
						$state.go('auth.login');
					}, 1200);
					return true;
				}
			});
		};

		// 关于我们modal
		$ionicModal.fromTemplateUrl('templates/modal/aboutUs.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.aboutUs = modal;
		});
		$scope.openModal = function() {
			$scope.aboutUs.show()
		}

		$scope.payInfo = {

			img: ''

		};
		var selectImages = function(from) {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if(from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function() {
				$cordovaCamera.getPicture(options).then(function(imageURI) {
					User.uploadAvatar(imageURI).then(function(response) {
						$state.go(tab.my)
					})
				}, function(error) {
					console.log('失败原因：' + error);
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 弹出选择图片
		$scope.uploadAvatar = function() {
			var buttons = [];
			buttons = [
				{ text: "拍一张照片" },
				{ text: "从相册选一张" }
			]
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function(index) {
					if(index == 0) {
						selectImages("camera");
					} else if(index == 1) {
						selectImages();
					}
					return true;
				}
			})
		};
	})

	.controller('userRealNameCtrl', function($scope, User, Message, ENV, $interval) {
		$scope.pageData = {
			realname: '',
			gender: 1,
			idcard: '',
			code: ''
		};
		$scope.getCaptchaSuccess = false;
		$scope.personalSuccess = false;
		$scope.reg = {
			number: 60
		};
		$scope.select = function(type) {
			$scope.pageData.gender = type;
		};

		$scope.getRealName = function() {
			var _param = {
				realname: $scope.pageData.realname,
				gender: $scope.pageData.gender,
				idcard: $scope.pageData.idcard,
				code: $scope.pageData.code
			};
			if(!_param.realname || _param.realname.length <= 1) {
				Message.show('请输入真实姓名！');
				return false;
			}
			if(!_param.idcard || !ENV.REGULAR_IDCARD.test(_param.idcard)) {
				Message.show('请输入正确的身份证号码！');
				return false;
			}
			User.realNamePwd(_param).then(function() {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function() {
					if($scope.reg.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.reg.number = 60;
					} else {
						$scope.reg.number--;
					}
				}, 1000)
			});
		};

		User.getRealName().then(function(data) {
			$scope.pageData = data;
			if($scope.pageData.realname && $scope.pageData.gender && $scope.pageData.idcard) {
				$scope.personalSuccess = true;
			}
		});

		$scope.submit = function() {
			var _param = {
				realname: $scope.pageData.realname,
				gender: $scope.pageData.gender,
				idcard: $scope.pageData.idcard,
				code: $scope.pageData.code
			};
			if(!$scope.pageData.realname || $scope.pageData.realname.length <= 1) {
				Message.show('请输入真实姓名！');
				return false;
			}
			if(!$scope.pageData.idcard || !ENV.REGULAR_IDCARD.test($scope.pageData.idcard)) {
				Message.show('请输入正确的身份证号码！');
				return false;
			}
			if(!$scope.pageData.code) {
				Message.show('请输入验证码！');
				return false;
			}
			User.getRealName(_param, 1)
		}
	})

	// 关于我们
	.controller('userAboutUsCtrl', function($scope, System, Message) {
		System.aboutUs(function(response) {
			Message.hidden();
			$scope.version = response.data;
			console.log($scope.version)
		}, function(err) {
			Message.show(err.msg);
		});
		$scope.getUpdate = (function() {
			var res = System.checkUpdate();
			if(res === true) {
				Message.show("已经是最新版本！", 1500);
			}
		})
	})

	.controller('userLoginPswCtrl', function($scope, $stateParams, Message, User, $interval) {
		$scope.type = $stateParams.type;
		$scope.getCaptchaSuccess = false;
		$scope.pageData = { oldpsd: '', code: '', newpsd: '', respsd: '' };
		$scope.reg = {
			number: 60
		};
		// 获取修改登录或支付验证码
		$scope.getCode = function(oldpsd, newpsd, respsd, type) {
			if(oldpsd.length < 6 || newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if(newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			}
			User.getCaptcha(oldpsd, newpsd, respsd, type).then(function(data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function() {
					if($scope.reg.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.reg.number = 60;
					} else {
						$scope.reg.number--;
					}
				}, 1000)
			})
		};
		$scope.savePsd = function(oldpsd, code, newpsd, respsd) {
			if(oldpsd.length < 6 || newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if(newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			} else if(code.length < 4) {
				Message.show('请输入正确的验证码');
				return;
			}
			if($scope.type == 1) {
				User.changeLoginPsd(oldpsd, code, newpsd, respsd);
			} else if($scope.type == 2) {
				User.changePayPsd(oldpsd, code, newpsd, respsd);
			}
		}

	})

	// 忘记支付密码
	.controller('userResetPayWordCtrl', function($scope, User, ENV, Message, $interval) {
		$scope.getPsd = true;
		$scope.getCaptchaSuccess = false;
		$scope.pay = { mobile: '', code: '', newpsd: '', respsd: '', number: 60 };
		$scope.getCode = function(newpsd, respsd) {
			if(newpsd.length < 6 || respsd.length < 6) {
				Message.show('请输入至少6位的密码');
				return;
			} else if(newpsd != respsd) {
				Message.show('两次密码不一致');
				return;
			}
			User.resetPwd(newpsd, respsd).then(function(data) {
				$scope.getCaptchaSuccess = true;
				var timer = $interval(function() {
					if($scope.pay.number <= 1) {
						$interval.cancel(timer);
						$scope.getCaptchaSuccess = false;
						$scope.pay.number = 60;
					} else {
						$scope.pay.number--;
					}
				}, 1000)
			})
		};

		$scope.savePsd = function(newpsd, respsd, code) {
			User.resetPayPsd(newpsd, respsd, code);
		}

	})
	.controller('userNewsCtrl', function($scope) {

	})
	// 用户帮助列表详情
	.controller('userNewsDetailsCtrl', function($scope, User, $stateParams) {
		$scope.boll = false;
		$scope.helpDetail = { title: '', createtime: '', content: '' };
		$scope.id = $stateParams.id;
		User.helpInfo($scope.id).then(function(data) {
			$scope.boll = true;
			$scope.helpDetail = data;
		})
	})
	// 用户帮助列表
	.controller('userHelpCtrl', function($scope, User) {
		$scope.userList = '';
		User.useHelp().then(function(data) {
			$scope.userList = data;
			console.log(data)
		});
	})

	.controller('userDonateCtrl', function($scope, User, Message, ENV, $ionicPopup) {
		$scope.donateInfo = { donateNum: '', password: '', beanNum: '' };
		$scope.showDrop = false;
		$scope.showDropType = "普通信使豆";
		$scope.beanType = function(num, title) {
			$scope.showDropType = title;
			$scope.showDrop = false;
		};
		User.getDonate().then(function(data) {
			$scope.donateInfo = data;
		});

		$scope.submit = function() {
			if(!$scope.donateInfo.donateNum || !ENV.REGULAR_MONEY.test($scope.donateInfo.donateNum)) {
				Message.show('请输入捐赠数量');
				return;
			}
			if($scope.donateInfo.donateNum > $scope.donateInfo.beanNum) {
				Message.show('信使豆不足');
				return;
			}
			if(!$scope.donateInfo.password) {
				Message.show('请输入支付密码');
				return;
			}
			$ionicPopup.confirm({
				title: '直捐提示',
				template: '您是否选择捐赠？一点公益基金会将会感谢您的每一份爱心捐赠！',
				buttons: [{
						text: '取消',
						onTap: function() {
							return false;
						}
					},
					{
						text: '确定',
						type: 'button-assertive',
						onTap: function() {
							User.getDonate('type', $scope.donateInfo);
						}
					}
				]
			});
		}
	})

	.controller('userDonateListCtrl', function($scope, Message, User, $ionicLoading) {
		$scope.donateList = { list: '', countDonate: '' };
		$scope.orderEmpty = false;
		User.donateList().then(function(response) {
			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.donateList.countDonate = response.data.countDonate;
				$scope.donateList.list = response.data.list;
			}
		});

		// 下拉刷新
		$scope.doRefresh = function() {
			User.donateList().then(function(response) {
				$scope.donateList.list = response.data.list;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			User.donateList($scope.page).then(function(response) {
				$scope.page++;
				if(response.code == 0) {
					$scope.donateList.list = $scope.donateList.list.concat(response.data.list);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				} else if(response.code != 0) {
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
					$scope.noMore = true;
				}
			});
		};
	})

	.controller('userRepoCtrl', function($scope, Message, User) {
		$scope.showDrop = false;
		$scope.showDropType = "普通信使豆";
		$scope.beanType = function(num, title) {
			$scope.showDropType = title;
			$scope.showDrop = false;
		};
		$scope.repoInfo = { bean: '', password: '' };
		User.getRepo().then(function(data) {
			$scope.repoInfo = data;
		});

		var r = /^[1-9]\d*00$/;
		$scope.submit = function() {
			if(!$scope.repoInfo.bank) {
				Message.show('请添加银行卡！');
				return;
			}
			if(!$scope.repoInfo.bean) {
				Message.show('请输入回购信使豆的数量！');
				return;
			}
			if(!r.test($scope.repoInfo.bean)) {
				Message.show('请输入100的整数倍！');
				return;
			}
			if($scope.repoInfo.bean > $scope.repoInfo.beanNum) {
				Message.show('信使豆数量不足！');
				return;
			}
			if(!$scope.repoInfo.password) {
				Message.show('请输入支付密码！');
				return;
			}
			User.getRepo('type', $scope.repoInfo);
		}
	})

	.controller('userRepoListCtrl', function($scope, User, $ionicLoading, $stateParams) {
		$scope.type = $stateParams.type;
		$scope.repoList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.getRepoList($scope.select).then(function(response) {
			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.repoList = response.data
			}
		});

		$scope.active = function(id) {
			$scope.select = id;
			$scope.noMore = false;
			User.getRepoList(id).then(function(response) {
				if(response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.repoList = response.data
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function() {
			User.getRepoList($scope.select).then(function(response) {
				$scope.repoList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			User.getRepoList($scope.select, $scope.page).then(function(response) {
				$scope.page++;
				$scope.repoList = $scope.repoList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userRepoInfoCtrl', function($scope, Message, User, $stateParams) {
		$scope.id = $stateParams.id;
		$scope.repoInfo = {};
		$scope.orderEmpty = false;
		User.getRepoInfo($scope.id).then(function(response) {
			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.repoInfo = response.data;
			}
		});
	})

	.controller('userMyBankCtrl', function($scope, $ionicModal, Message, $ionicListDelegate, User, ENV, $timeout) {
		$scope.bankList = {};
		$scope.isDefault = '';
		$scope.bankInfo = { userName: '', bankName: '', idCard: '', bankCard: '', mobile: '' };
		$scope.showBank = false;
		$scope.bankType = function(num, title) {
			$scope.bankInfo.bankName = title;
			$scope.showBank = false;
		};

		User.getBank().then(function(data) {
			angular.forEach(data, function(x, y) {
				if(x.isDefault == 1) {
					$scope.isDefault = x.id;
				}
			});
			$scope.bankList = data;
		});
		// 提交添加银行卡资料
		$scope.submitData = function() {
			if(!$scope.bankInfo.userName) {
				Message.show('请输入开户姓名！');
				return;
			}
			if(!$scope.bankInfo.bankName) {
				Message.show('请选择转入银行的名称！');
				return;
			}
			if(!$scope.bankInfo.idCard || !ENV.REGULAR_IDCARD.test($scope.bankInfo.idCard)) {
				Message.show('请输入正确的身份证号！');
				return;
			}
			if(!$scope.bankInfo.bankCard || $scope.bankInfo.bankCard.length <= 5) {
				Message.show('请输入正确的银行卡号！');
				return;
			}
			if(!$scope.bankInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.bankInfo.mobile)) {
				Message.show('请输入正确的手机号！');
				return;
			}
			User.getBankInfo('type', $scope.bankInfo).then(function(response) {
				if(response.code == 0) {
					$scope.addBank.hide();
					$scope.bankInfo = { userName: '', bankName: '', idCard: '', bankCard: '', mobile: '' };
					$timeout(function() {
						Message.show('添加成功！');
					}, 1000);
					User.getBank().then(function(data) {
						angular.forEach(data, function(x, y) {
							if(x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.bankList = data;
					});
				} else if(response.code == 1) {
					Message.show(response.msg);
				}
			});
		};
		// 添加银行卡号
		$ionicModal.fromTemplateUrl('templates/modal/addBank.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.addBank = modal;
		});
		$scope.openModal = function() {
			$scope.addBank.show();
			User.getBankInfo().then(function(response) {
				$scope.bankInfo = response.data;
			});
		};
		// 选择银行卡
		$scope.selectBank = function(id) {
			$scope.isDefault = id;
		};
		//删除银行卡
		$scope.removeBank = function(id) {
			User.getBank('delete', id).then(function(response) {
				if(response.code == 0) {
					$timeout(function() {
						Message.show('删除成功！');
					}, 1000);
					$scope.isDefault = '';
					User.getBank().then(function(data) {
						angular.forEach(data, function(x) {
							if(x.isDefault == 1) {
								$scope.isDefault = x.id;
							}
						});
						$scope.bankList = data;
					});
				}
			})
		};
		$scope.submitBankType = function() {
			if(!$scope.isDefault) {
				Message.show('请先添加银行卡！');
				return;
			}
			User.getBank('select', $scope.isDefault);
		}

	})

	.controller('userGiveCtrl', function($scope, User, Message, ENV) {
		$scope.giveInfo = { userId: '', giveBeanNum: '', payPassword: '', beanNum: '' };
		User.getGive().then(function(data) {
			$scope.giveInfo = data;
		});
		$scope.submit = function() {
			if(!$scope.giveInfo.userId) {
				Message.show('请输入获赠人ID');
				return;
			}
			if(!$scope.giveInfo.giveBeanNum || !ENV.REGULAR_MONEY.test($scope.giveInfo.giveBeanNum)) {
				Message.show('请输入转赠信使豆数量');
				return;
			}
			if($scope.giveInfo.giveBeanNum > $scope.giveInfo.beanNum) {
				Message.show('信使豆数量不足');
				return;
			}
			if(!$scope.giveInfo.payPassword) {
				Message.show('请输入支付密码');
				return;
			}
			User.getGive('type', $scope.giveInfo);
		}
	})

	.controller('userRecommendCtrl', function($scope, User, Message) {
		$scope.myQrcode = {};
		User.recomCode().then(function(data) {
			$scope.myQrcode = data;
		});
		$scope.developing = function() {
			Message.show('开发中...');
		}
	})

	.controller('userRecommendHistoryCtrl', function($scope, User, $ionicLoading) {
		$scope.recommendList = {};
		$scope.orderEmpty = false;
		$scope.select = 1;
		User.recommendList($scope.select).then(function(response) {
			$scope.recommendList = response.data;
			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.recommendList = response.data
			}
		});

		$scope.active = function(id) {
			$scope.select = id;
			$scope.noMore = false;
			User.recommendList(id).then(function(response) {
				if(response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.recommendList = response.data
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function() {
			User.recommendList().then(function(response) {
				$scope.recommendList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			User.recommendList($scope.page).then(function(response) {
				$scope.page++;
				$scope.recommendList = $scope.recommendList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userMyMessageCtrl', function($scope, Notice, $ionicModal, $state, $ionicLoading) {
		$scope.select = 1;
		$scope.orderEmpty = false;
		$scope.active = function(id) {
			$scope.select = id;
			$scope.noMore = true;
			Notice.getList(id).then(function(response) {
				if(response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.allNotice = response.data;
				}
			});
		};
		$scope.onSwipe = function(a) {
			if(a == 'l') {
				$scope.select++;
				if($scope.select <= 4) {
					Notice.getList($scope.select).then(function(response) {
						if(response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
							$scope.allNotice = response.data;
						}
					});
				}
				$scope.select = Math.min(4, $scope.select);
			} else {
				$scope.select--;
				if($scope.select > 0) {
					Notice.getList($scope.select).then(function(response) {
						if(response.data == '' || response.data.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
							$scope.allNotice = response.data;
						}
					});
				}
				$scope.select = Math.max(1, $scope.select);
			}
		}
		$scope.statusName = {
			'1': '未读',
			'2': '已读'
		};
		$scope.allNotice = {};
		Notice.getList().then(function(response) {
			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.allNotice = response.data;
			}
		});
		// 跳转
		$scope.toUrl = function(id, type) {
			Notice.getInfo(id, type).then(function(data) {
				if(data.linkUrl.url == 'shops.orderInfo') {
					$state.go(data.linkUrl.url, { id: data.linkUrl.param.id, type: data.linkUrl.param.type });
				} else if(data.linkUrl.url == 'user.notice') {
					$state.go(data.linkUrl.url, { id: data.linkUrl.param.id });
				}
			});
		};
		// 下拉刷新
		$scope.doRefresh = function() {
			Notice.getList($scope.select).then(function(response) {
				$scope.allNotice = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = true;
		$scope.page = 2;
		$scope.loadMore = function() {
			Notice.getList($scope.select, $scope.page).then(function(response) {
				$scope.page++;
				$scope.allNotice = $scope.allNotice.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.code != 0) {
					$scope.noMore = false;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多消息了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userApplyCtrl', function($scope, $ionicModal, Area, Apply, $state, Mc, ENV, $ionicScrollDelegate, $cordovaCamera, $ionicActionSheet, Message) {
		$scope.applyInfo = {
			userName: '',
			shopName: '',
			cName: '',
			shopPer: '',
			address: '',
			mobile: '',
			shopDescrip: '',
			selecedType: '',
			selectedBili: '',
			corrImg: '',
			falImg: '',
			businessImg: '',
			shopsImg: ''
		};
		$scope.selectType = {};
		$scope.applyBol = true;
		$scope.showShopDesc = function() {
			$scope.applyBol = !$scope.applyBol;
		};
		// 商家协议
		$ionicModal.fromTemplateUrl('templates/modal/shopAgreement.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.shopAgreement = modal;
		});
		$scope.showShopAgreement = function() {
			$scope.shopAgreement.show()
		};
		// 我的地址
		$scope.areaList = {};
		$scope.up = {};
		$scope.up.userInfo = {};
		$ionicModal.fromTemplateUrl('templates/modal/area.html', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.area = modal;
		});
		$scope.areaShow = function() {
			Area.getList(function(data) {
				$scope.areaList = $scope.areaData = data;
			});
			$scope.area.show();
		};
		$scope.selectArea = function(id) {
			$ionicScrollDelegate.scrollTop();
			var pid = id.substr(0, 2) + "0000";
			var cid = id.substr(0, 4) + "00";
			if(id.substr(0, 2) != "00" && id.substr(2, 2) != "00" && id.substr(4, 2) != "00") {
				$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + $scope.areaData[pid]['cities'][cid]['districts'][id];
				$scope.area.hide();
				return true;
			}
			if(id.substr(0, 2) != "00" && id.substr(2, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'][id]['districts'];
				if($scope.areaList.length <= 0) {
					$scope.up.userInfo.area = $scope.areaData[pid].title + " " + $scope.areaData[pid]['cities'][cid].title + " " + "其他（县/区）";
					$scope.area.hide();
				}
				return true;
			}
			if(id.substr(0, 2) != "00") {
				$scope.areaList = $scope.areaData[pid]['cities'];
				return true;
			}
		};

		/*上传证件照*/
		$scope.uploadAvatar = function(type) {
			var buttons = [
				{ text: "拍一张照片" },
				{ text: "从相册选一张" }
			];
			$ionicActionSheet.show({
				buttons: buttons,
				titleText: '请选择',
				cancelText: '取消',
				buttonClicked: function(index) {
					if(index == 0) {
						selectImages("camera", type);
					} else if(index == 1) {
						selectImages("", type);
					}
					return true;
				}
			})
		};

		var selectImages = function(from, type) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: false,
				targetWidth: 1000,
				targetHeight: 1000,
				correctOrientation: true,
				cameraDirection: 0
			};
			if(from == 'camera') {
				options.sourceType = Camera.PictureSourceType.CAMERA;
			}
			document.addEventListener("deviceready", function() {
				$cordovaCamera.getPicture(options).then(function(imageURI) {
					if(type == 1) { //身份证正面照
						$scope.applyInfo.corrImg = "data:image/jpeg;base64," + imageURI;
						var image1 = document.getElementById('divImg01');
						image1.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if(type == 2) { //身份证反面照
						$scope.applyInfo.falImg = "data:image/jpeg;base64," + imageURI;
						var image2 = document.getElementById('divImg02');
						image2.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if(type == 3) { //营业执照
						$scope.applyInfo.businessImg = "data:image/jpeg;base64," + imageURI;
						var image3 = document.getElementById('divImg03');
						image3.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					} else if(type == 4) { //商铺封面照
						$scope.applyInfo.shopsImg = "data:image/jpeg;base64," + imageURI;
						var image4 = document.getElementById('divImg04');
						image4.style.backgroundImage = "url(data:image/jpeg;base64," + imageURI + ")";
					}
				}, function(error) {
					Message.show('选择失败,请重试.', 1000);
				});
			}, false);
		};
		// 获取商家经营类型

		Apply.getApplyType().then(function(data) {
			console.log(data)
			$scope.selectType = data;
		});
		$scope.selectType = {};
		// 提交商家申请信息
		$scope.apply = function() {
			if(!$scope.applyInfo.userName) {
				Message.show("商家账号不能为空！");
				return false;
			}
			if(!$scope.applyInfo.shopName) {
				Message.show("商户名称不能为空！");
				return false;
			}
			if(!$scope.applyInfo.cName) {
				Message.show("请输入商家负责人名字！");
				return false;
			}
			if(!$scope.applyInfo.shopPer) {
				Message.show("请输入商家推荐人名字！");
				return false;
			}
			if(!$scope.up.userInfo.area) {
				Message.show("请选择地址！");
				return false;
			}
			if(!$scope.applyInfo.address) {
				Message.show("请输入您的详细地址！");
				return false;
			}
			if(!$scope.applyInfo.mobile || !ENV.REGULAR_MOBILE.test($scope.applyInfo.mobile)) {
				Message.show("请输入正确的联系方式！");
				return false;
			}
			if(!$scope.applyInfo.shopDescrip) {
				Message.show("请输入您的商家描述信息！");
				return false;
			}
			if(!$scope.applyInfo.selecedType) {
				Message.show("请选择商户经营类型！");
				return false;
			}
			if(!$scope.applyInfo.selectedBili) {
				Message.show("请选择商户让利类型！");
				return false;
			}
			//			if(!$scope.applyInfo.corrImg) {
			//				Message.show("请上传您的法人身份证正面照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.falImg) {
			//				Message.show("请上传您的法人身份证反面照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.businessImg) {
			//				Message.show("请上传您的营业执照！");
			//				return false;
			//			}
			//			if(!$scope.applyInfo.shopsImg) {
			//				Message.show("请上传您的商铺封面照！");
			//				return false;
			//			}
			//检查该推荐商家账号是否存在

			Apply.checkshopPer($scope.applyInfo.shopPer).then(function(response) {
				$scope.applyInfo.shopPer = response
				Apply.subApply($scope.applyInfo, $scope.up.userInfo.area).then(function(data) {
					$state.go('tab.my');
				});
			})

		}
	})
	.controller('applySManCtrl', function($scope, $rootScope, Apply, ENV, Message) {
		$scope.applyCAgent = {};
		$scope.applyCAgent.cAgent = '';
		$scope.selectType = {};
		//检查该市级代理账号是否存在

		Apply.getApplySManUser().then(function(data) {
			console.log(data)
			$scope.userInfo = data;
		});

		$scope.checkCAgent = function() {
			if($scope.applyCAgent.cAgent) {
				if(!ENV.REGULAR_MOBILE.test($scope.applyCAgent.cAgent)) {
					Message.show("请输入正确的联系方式！");
					return false;
				}
				Apply.checkCAgent($scope.applyCAgent.cAgent).then(function(response) {
					Apply.applySMan(response).then(function(response) {
						$state.go('tab.my');
					})
				})
			} else {
				Apply.applySMan().then(function(response) {
					$state.go('tab.my');
				})
			}

		}
	})
	.controller('SManCenterCtrl', function() {

	})

	.controller('applyCAgentCtrl', function($scope, $rootScope, $ionicModal,Apply,ENV,$state) {
		console.log('nihao');
		$scope.applyInfo = {
			pAgentNum: '',
		};
		$scope.applyPAgent = {};
		$scope.applyPAgent.pAgent = '';
		Apply.getApplyCAgentUser().then(function(data) {
			$scope.userInfo = data;
		})
		$scope.checkPAgent = function() {
			if($scope.applyPAgent.pAgent) {
				if(!ENV.REGULAR_MOBILE.test($scope.applyPAgent.pAgent)) {
					Message.show("请输入正确的联系方式！");
					return false;
				}
				Apply.checkPAgent($scope.applyPAgent.pAgent).then(function(response) {
					Apply.applyCAgent(response).then(function(response) {
						$state.go('tab.my');
					})
				})
			} else {
				Apply.applyCAgent().then(function(response) {
					$state.go('tab.my');
				})
			}

		}

	})
	.controller('cACenterCtrl', function($scope, $rootScope, $ionicModal) {
		console.log('cACenterCtrl')
	})
	.controller('subordinateCtrl', function($scope, $rootScope) {
		$scope.subordinates = [{
				name: '刘欣欣'
			},
			{
				name: '刘妍'
			},
			{
				name: '吴梁玉'
			},
			{
				name: '张飞'
			},
			{
				name: '路被'
			},
		]
	})

	// 商家申请审核等待提示页
	.controller('shopsWaitCtrl', function($scope, Apply) {
		$scope.checks = function() {
			Apply.refreshApply();
		}
	})
	.controller('userNoticeCtrl', function($scope, $stateParams, Notice) {
		$scope.orderInfo = {};
		Notice.getInfo($stateParams.id).then(function(data) {
			$scope.orderInfo = data;
		})
	})

	.controller('userMyBeanCtrl', function($scope, User) {
		$scope.myBean = {};
		User.myBean().then(function(data) {
			$scope.myBean = data;
		})
	})

	.controller('userGiveListCtrl', function($scope, User, $ionicLoading, $stateParams) {
		$scope.type = $stateParams.type;
		$scope.giveList = {};
		$scope.orderEmpty = false;
		$scope.select = $scope.type || 1;
		User.giveList($scope.select).then(function(response) {
			if(response.data == '' || response.data.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
				$scope.giveList = response.data
			}
		});

		$scope.active = function(id) {
			$scope.select = id;
			$scope.noMore = false;
			User.giveList(id).then(function(response) {
				if(response.data == '' || response.data.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
					$scope.giveList = response.data
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function() {
			User.giveList($scope.select).then(function(response) {
				$scope.giveList = response.data;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			User.giveList($scope.select, $scope.page).then(function(response) {
				$scope.page++;
				$scope.giveList = $scope.giveList.concat(response.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.code != 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userTotalBeanCtrl', function($scope, User, $stateParams, $ionicLoading) {
		$scope.type = $stateParams.type;
		$scope.orderEmpty = false;
		$scope.selected = 1; //比例
		$scope.role = 1; //角色
		$scope.myVar = false;
		$scope.totalBean = { all_price: '', list: '', rebateInfo: '' };
		User.recommendBean($scope.type, $scope.selected, 1, $scope.role).then(function(response) {
			$scope.totalBean = response.data;
			if(response.data.list == '' || response.data.list.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
		});
		$scope.toggle = function() {
			$scope.myVar = !$scope.myVar;
		};

		$scope.selectRole = function(role) {
			$scope.myVar = !$scope.myVar;
			$scope.role = role;
			User.recommendBean($scope.type, $scope.selected, 1, $scope.role).then(function(response) {
				$scope.totalBean = response.data;
				if(response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
		};

		$scope.selectBili = function(id) {
			$scope.selected = id;
			$scope.noMore = false;
			User.recommendBean($scope.type, id, 1, $scope.role).then(function(response) {
				$scope.totalBean = response.data;
				if(response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
		};

		// 下拉刷新
		$scope.doRefresh = function() {
			User.recommendBean($scope.type, $scope.selected, $scope.page, $scope.role).then(function(response) {
				$scope.totalBean.list = response.data.list;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			User.recommendBean($scope.type, $scope.selected, $scope.page, $scope.role).then(function(response) {
				$scope.page++;
				$scope.totalBean.list = $scope.totalBean.list.concat(response.data.list);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.data.list.length == 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};
	})

	.controller('userExcitationCtrl', function($scope, User) {
		$scope.excitation = { user: '', userNum: '', userTitle: '', shop: '', shopsNum: '', shopsTitle: '' };
		User.getExcitation().then(function(data) {
			$scope.excitation = data;
		});

	})

	.controller('userLoveInfoCtrl', function($scope, User, $ionicLoading, $ionicSlideBoxDelegate) {
		$scope.myVar = false;
		$scope.orderEmpty = false;
		$scope.role = 1;
		$scope.type = 1;
		if($scope.role == 1) {
			$scope.rolemenu = '信使';
		} else {
			$scope.rolemenu = '商家';
		}
		$scope.loveInfo = { list: '', rebateInfo: '', roleInfo: '', loveNum: '' };
		User.loveInfo($scope.role, $scope.type).then(function(response) {
			$scope.loveInfo = response.data;
			if(response.data.list == '' || response.data.list.length == 0) {
				$scope.orderEmpty = true;
			} else {
				$scope.orderEmpty = false;
			}
		});
		$scope.select = function(role) {

			if(role == 1) {
				$scope.rolemenu = '信使';
			} else {
				$scope.rolemenu = '商家';
			}
			$scope.myVar = !$scope.myVar;
			$scope.role = role;
			//			console.log($scope.type);
			//			console.log($scope.role);		
			User.loveInfo($scope.role, $scope.type).then(function(response) {
				$scope.loveInfo = response.data;
				if(response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
		};

		$scope.selectTab = function(type) {
			$scope.type = type;
			//			console.log($scope.type);
			//			console.log($scope.role);
			$scope.noMore = false;
			User.loveInfo($scope.role, $scope.type).then(function(response) {
				$scope.loveInfo = response.data;
				if(response.data.list == '' || response.data.list.length == 0) {
					$scope.orderEmpty = true;
				} else {
					$scope.orderEmpty = false;
				}
			});
			$ionicSlideBoxDelegate.slide(type);
		};
		// 侧滑
		$scope.onSwipe = function(a) {
			if(a == 'r') {
				$scope.type++;
				if($scope.type <= 3) {
					User.loveInfo($scope.role, $scope.type).then(function(response) {
						$scope.loveInfo = response.data;
						if(response.data.list == '' || response.data.list.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
						}
					});
				}
				$scope.type = Math.min(3, $scope.type);
			} else {
				$scope.type--;
				if($scope.type > 0) {
					User.loveInfo($scope.role, $scope.type).then(function(response) {
						$scope.loveInfo = response.data;
						if(response.data.list == '' || response.data.list.length == 0) {
							$scope.orderEmpty = true;
						} else {
							$scope.orderEmpty = false;
						}
					});
				}
				$scope.type = Math.max(1, $scope.type);
			}
		};

		// 下拉刷新
		$scope.doRefresh = function() {
			User.loveInfo($scope.role, $scope.type).then(function(response) {
				$scope.loveInfo.list = response.data.list;
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					noBackdrop: true,
					template: '刷新成功！',
					duration: '3000'
				});
			});
		};
		// 下拉加载
		$scope.noMore = false;
		$scope.page = 2;
		$scope.loadMore = function() {
			User.loveInfo($scope.role, $scope.type, $scope.page).then(function(response) {
				$scope.page++;
				$scope.loveInfo.list = $scope.loveInfo.list.concat(response.data.list);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(response.data.list.length == 0) {
					$scope.noMore = true;
					$ionicLoading.show({
						noBackdrop: true,
						template: '没有更多记录了！',
						duration: '1200'
					});
				}
			});
		};

	});