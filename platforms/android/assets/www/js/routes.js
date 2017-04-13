angular.module('starter.routes', [])
	.config(function($stateProvider, $urlRouterProvider) {
		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		$stateProvider
			// setup an abstract state for the tabs directive
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})

			.state('tab.home', {
				url: '/home',
				views: {
					'tab-home': {
						templateUrl: 'templates/tab/tab-home.html',
						controller: 'homeCtrl'
					}
				}
			})

			.state('tab.list', {
				url: '/list',
				cache: false,
				views: {
					'tab-list': {
						templateUrl: 'templates/tab/tab-list.html',
						controller: 'listCtrl'
					}
				}
			})

			.state('tab.my', {
				url: '/my',
				cache: false,
				views: {
					'tab-my': {
						templateUrl: 'templates/tab/tab-my.html',
						controller: 'myCtrl'
					}
				}
			})

			.state('tab.count', {
				url: '/count',
				cache: false,
				views: {
					'tab-count': {
						templateUrl: 'templates/tab/tab-count.html',
						controller: 'countCtrl'
					}
				}
			})

			.state('shops', {
				url: '/shop',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})

			.state('shops.shopsList', {
				url: '/shopsList/:cid',
				params: { cid: null },
				templateUrl: 'templates/shop/shopsList.html',
				controller: 'shopsListCtrl'
			})
			.state('shops.shopsCategory', {
				url: '/shopsCategory/:keywords',
				templateUrl: 'templates/shop/shopsCategory.html',
				controller: 'shopsCategoryCtrl'
			})
			.state('shops.shopsInfo', {
				url: '/shopsInfo/:spid',
				params: { spid: null },
				templateUrl: 'templates/shop/shopsInfo.html',
				controller: 'shopsInfoCtrl'
			})

			.state('shops.orderInfo', {
				url: '/orderInfo/:id/:type',
				params: { id: null, type: null },
				cache: false,
				templateUrl: 'templates/shop/orderInfo.html',
				controller: 'shopsOrderInfoCtrl'
			})
			.state('shops.wait', {
				url: '/wait',
				templateUrl: 'templates/shop/waiting.html',
				controller: 'shopsWaitCtrl'
			})
			.state('shops.orderList', {
				url: '/orderList/:type',
				params: { type: null },
				cache: false,
				templateUrl: 'templates/shop/orderList.html',
				controller: 'shopOrderListCtrl'
			})

			.state('shops.qrcode', {
				url: '/qrcode',
				templateUrl: 'templates/shop/qrcode.html',
				controller: 'shopQrcodeCtrl'
			})

			.state('shops.center', {
				url: '/center',
				templateUrl: 'templates/shop/center.html',
				controller: 'shopCenterCtrl'
			})

			.state('shops.pay', {
				url: '/pay/:orderId/:spid/:payPrice',
				params: { orderId: null, spid: null, payPrice: null },
				templateUrl: 'templates/shop/pay.html',
				controller: 'shopPayCtrl'
			})
			.state('cAgent', {
				url: '/cAgent',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('cAgent.center', {
				url: '/center',
				cache: false,
				templateUrl: 'templates/cagent/center.html',
				controller: 'cACenterCtrl'
			})
			.state('cAgent.subordinate', {
				url: '/subordinate',
				cache: false,
				templateUrl: 'templates/cagent/subordinate.html',
				controller: 'subordinateCtrl'
			})
			.state('sMan', {
				url: '/sMan',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})
			.state('sMan.center', {
				url: '/center',
				cache: false,
				templateUrl: 'templates/applySMan/center.html',
				controller: 'SManCenterCtrl'
			})
			.state('sMan.myProfit', {
				url: '/myProfit',
				cache: false,
				templateUrl: 'templates/applySMan/myProfit.html',
//				controller: 'myProfitCtrl'
			})
			//			.state('pAgent.center', {
			//				url: '/center',
			//				templateUrl: 'templates/pAgent/center.html',
			//				controller: 'pACenterCtrl'
			//			})
			.state('auth', {
				url: '/auth',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})

			.state('auth.login', {
				url: '/login',
				cache: false,
				templateUrl: 'templates/auth/login.html',
				controller: 'loginCtrl'
			})

			.state('auth.register', {
				url: '/register',
				cache: false,
				templateUrl: 'templates/auth/register.html',
				controller: 'registerCtrl'
			})

			.state('auth.resetPsd', {
				url: '/resetPsd',
				cache: false,
				templateUrl: 'templates/auth/resetPsd.html',
				controller: 'resetPsdCtrl'
			})

			.state('user', {
				url: '/user',
				abstract: true,
				template: '<ion-nav-view></ion-nav-view>'
			})

			.state('user.center', {
				url: '/center',
				templateUrl: 'templates/user/center.html',
				controller: 'userCenterCtrl'
			})

			.state('user.realName', {
				url: '/realName',
				cache: false,
				templateUrl: 'templates/user/realName.html',
				controller: 'userRealNameCtrl'
			})

			.state('user.aboutUs', {
				url: '/aboutUs',
				cache: false,
				templateUrl: 'templates/user/aboutUs.html',
				controller: 'userAboutUsCtrl'
			})

			.state('user.loginPsw', {
				url: '/loginPsw/:type',
				params: { type: null },
				cache: false,
				templateUrl: 'templates/user/loginPsw.html',
				controller: 'userLoginPswCtrl'
			})
			.state('user.resetPayWord', {
				url: '/resetPayWord',
				params: { type: null },
				cache: false,
				templateUrl: 'templates/user/resetPayWord.html',
				controller: 'userResetPayWordCtrl'
			})
			.state('user.news', {
				url: '/news',
				templateUrl: 'templates/user/news.html',
				controller: 'userNewsCtrl'
			})

			.state('user.newsDetails', {
				url: '/newsDetails/:id',
				templateUrl: 'templates/user/newsDetails.html',
				controller: 'userNewsDetailsCtrl'
			})

			.state('user.userHelp', {
				url: '/userHelp',
				templateUrl: 'templates/user/userHelp.html',
				controller: 'userHelpCtrl'
			})

			.state('user.donate', {
				url: '/donate',
				cache: false,
				templateUrl: 'templates/user/donate.html',
				controller: 'userDonateCtrl'
			})

			.state('user.donateList', {
				url: '/donateList',
				cache: false,
				templateUrl: 'templates/user/donateList.html',
				controller: 'userDonateListCtrl'
			})

			.state('user.repo', {
				url: '/repo',
				cache: false,
				templateUrl: 'templates/user/repo.html',
				controller: 'userRepoCtrl'
			})

			.state('user.repoList', {
				url: '/repoList/:type',
				params: { type: null },
				cache: false,
				templateUrl: 'templates/user/repoList.html',
				controller: 'userRepoListCtrl'
			})

			.state('user.repoInfo', {
				url: '/repoInfo/:id',
				params: { id: null },
				templateUrl: 'templates/user/repoInfo.html',
				controller: 'userRepoInfoCtrl'
			})

			.state('user.myBank', {
				url: '/myBank',
				cache: false,
				templateUrl: 'templates/user/myBank.html',
				controller: 'userMyBankCtrl'
			})

			.state('user.give', {
				url: '/give',
				cache: false,
				templateUrl: 'templates/user/give.html',
				controller: 'userGiveCtrl'
			})

			.state('user.recommend', {
				url: '/recommend',
				templateUrl: 'templates/user/recommend.html',
				controller: 'userRecommendCtrl'
			})

			.state('user.recommendHistory', {
				url: '/recommendHistory',
				templateUrl: 'templates/user/recommendHistory.html',
				controller: 'userRecommendHistoryCtrl'
			})

			.state('user.myMessage', {
				url: '/myMessage',
				cache: false,
				templateUrl: 'templates/user/myMessage.html',
				controller: 'userMyMessageCtrl'
			})

			.state('user.pay', {
				url: '/pay/:spid',
				params: { spid: null },
				cache: false,
				templateUrl: 'templates/user/pay.html',
				controller: 'userPayCtrl'
			})

			.state('user.apply', {
				url: '/apply',
				cache: false,
				templateUrl: 'templates/user/apply.html',
				controller: 'userApplyCtrl'
			})
			.state('user.applyCAgent', {
				url: '/applyCAgent',
				cache: false,
				templateUrl: 'templates/user/applyCAgent.html',
				controller: 'applyCAgentCtrl'
			})
			// .state('user.applyPAgent', {
			// 	url: '/applyPAgent',
			// 	cache: false,
			// 	templateUrl: 'templates/user/applypAgent.html',
			// 	controller: 'applyPAgentCtrl'
			// })
			.state('user.applySMan', {
				url: '/applySMan',
				cache: false,
				templateUrl: 'templates/user/applySMan.html',
				controller: 'applySManCtrl'
			})

			.state('user.notice', {
				url: '/notice/:id',
				params: { id: null },
				templateUrl: 'templates/user/notice.html',
				controller: 'userNoticeCtrl'
			})

			.state('user.myBean', {
				url: '/myBean',
				cache: false,
				templateUrl: 'templates/user/myBean.html',
				controller: 'userMyBeanCtrl'
			})

			.state('user.giveList', {
				url: '/giveList/:type',
				params: { type: null },
				cache: false,
				templateUrl: 'templates/user/giveList.html',
				controller: 'userGiveListCtrl'
			})

			.state('user.totalBean', {
				url: '/totalBean/:type',
				params: { type: null },
				cache: false,
				templateUrl: 'templates/user/totalBean.html',
				controller: 'userTotalBeanCtrl'
			})

			.state('user.excitation', {
				url: '/excitation',
				templateUrl: 'templates/user/excitation.html',
				controller: 'userExcitationCtrl'
			})

			.state('user.loveInfo', {
				url: '/loveInfo',
				cache: false,
				templateUrl: 'templates/user/loveInfo.html',
				controller: 'userLoveInfoCtrl'
			});

		$urlRouterProvider.otherwise('/auth/login');
	});