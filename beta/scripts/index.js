var dbg;
var parseDate = function (input, format) {
  format = format || 'yyyy-mm-dd'; // default format
  var parts = input.match(/(\d+)/g), 
      i = 0, fmt = {};
  // extract date-part indexes from the format
  format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

  return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
}

angular.module('ui.scrollfix',[]).directive('uiScrollfix', ['$log', '$window', function ($log, $window) {
  'use strict';
  return {
    require: '^?uiScrollfixTarget',
    link: function (scope, elm, attrs, uiScrollfixTarget) {
      var top = elm[0].offsetTop,
	  	  bot = top + elm[0].offsetHeight,
		  isTop = true,
          $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);
      if (!attrs.uiScrollfix) {
        attrs.uiScrollfix = top;
      } else if (typeof(attrs.uiScrollfix) === 'string') {
        // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
        if (attrs.uiScrollfix.charAt(0) === 't') {
			if (attrs.uiScrollfix.charAt(1) === '-') {
          		attrs.uiScrollfix = top - parseFloat(attrs.uiScrollfix.substr(2));
			} else if (attrs.uiScrollfix.charAt(1) === '+') {
				attrs.uiScrollfix = top + parseFloat(attrs.uiScrollfix.substr(2));
			} else {
				attrs.uiScrollfix = top + parseFloat(attrs.uiScrollfix.substr(1));
			}
        } else if (attrs.uiScrollfix.charAt(0) === 'b') {
          	if (attrs.uiScrollfix.charAt(1) === '-') {
          		attrs.uiScrollfix = bot + parseFloat(attrs.uiScrollfix.substr(2));
			} else if (attrs.uiScrollfix.charAt(1) === '+') {
				attrs.uiScrollfix = bot - parseFloat(attrs.uiScrollfix.substr(2));
			} else if (attrs.uiScrollfix.length == 1) {
				attrs.uiScrollfix = bot;
			} else {
				attrs.uiScrollfix = bot + parseFloat(attrs.uiScrollfix.substr(1));
			}
			isTop = false;
        }
      }

      $target.bind('scroll', function () {
        // if pageYOffset is defined use it, otherwise use other crap for IE
        var offset;
		var height;
        if (angular.isDefined($window.pageYOffset)) {
          offset = $window.pageYOffset;
		  height = $window.innerHeight;
        } else {
          var iebody = (document.compatMode && document.compatMode !== "BackCompat") ? document.documentElement : document.body;
          offset = iebody.scrollTop;
		  height = iebody.offsetHeight;
        }
		if (isTop) {
			if (!elm.hasClass('ui-scrollfix') && offset > attrs.uiScrollfix) {
			  elm.addClass('ui-scrollfix');
			} else if (elm.hasClass('ui-scrollfix') && offset < attrs.uiScrollfix) {
			  elm.removeClass('ui-scrollfix');
			}
		} else {
			if (!elm.hasClass('ui-scrollfix') && (offset)> attrs.uiScrollfix) {
			  elm.addClass('ui-scrollfix');
			} else if (elm.hasClass('ui-scrollfix') && (offset) < attrs.uiScrollfix) {
			  elm.removeClass('ui-scrollfix');
			}
		}
      });
    }
  };
}]).directive('uiScrollfixTarget', [function () {
  'use strict';
  return {
    controller: function($element) {
      this.$element = $element;
    }
  };
}]);

var goog = angular.module('goog', []);
goog.constant('gapiUrl', 'https://apis.google.com/js/client.js');
goog.constant('apiKey', 'AIzaSyBJm8pj4Ejqw8rHJVgk_0s6w1HlB6RfZ34');
goog.run(function(Gapi, apiKey) {
	Gapi.setKey(apiKey);
});

goog.Gapi = function($rootScope, $q, $log, gapiUrl) {
	this.scope = $rootScope;	
	this.log = $log;
	this.q = $q;
	this.loaded = this.q.defer();
	this.ready = this.loaded.promise;
	this.load_(gapiUrl);
};

goog.service('Gapi', goog.Gapi);

goog.Gapi.prototype.setKey = function(key) {
	var self = this;
	var sendKey = function() {
		gapi.client.setApiKey(key);
		self.log.info('Key set.');
	};
	self.loaded.promise.then(sendKey);
	return self.ready.promise;	
}

goog.Gapi.prototype.load_ = function(gapiUrl) {
	this.log.info('Loading gapi...');
	window.gapiLoaded = angular.bind(this, function() {
		this.log.info('Loaded.');
		this.loaded.resolve();
		this.scope.$digest();
	});
	var tail = $('body')[0];
	var newScript = $("<script>").attr({
		type: 'text/javascript',
		src: gapiUrl + '?onload=gapiLoaded'
	}).appendTo(tail);
};

goog.Gapi.prototype.request = function(params) {
	var self = this;
	var deferred = this.q.defer();
	if (params.callback) {
		this.log.warn('params will be overwritten.');	
	}
	params.callback = function(result) {
		if (!result || !result.error) {
			deferred.resolve(result);
		} else {
			deferred.reject(result);
		}
		self.scope.$digest();
	};
	self.ready.then(function() {
		self.log.info('requesting...', params);
		gapi.client.request(params);
	}, function() {
		deferred.reject();
	});
	self.log.info('request promised.');
	return deferred.promise;
};

var cal = angular.module('cal', ['goog']);
cal.value('calParams', {
	'path': 'calendar/v3/calendars/rjeriqtl1igtpf9kl0v17jjvuc@group.calendar.google.com/events',
	'params': {
		'orderBy' : 'startTime',
		'singleEvents' : 'true'
	}
});
cal.constant('zones', {
	'America/New_York' : {
		label: 'ET',
		time: 0
	},
	'America/Los_Angeles' : {
		label: 'PT',
		time: -3
	},
	'America/Phoenix' : {
		label: 'MT',
		time: -2
	},
	'America/Chicago' : {
		label: 'CT',
		time: -1
	},
	'Europe/Amsterdam' : {
		label: 'CET',
		time: 6
	}
});
cal.value('days', ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
.value('fullDays', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
.value('months', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
.value('array', [
	[{y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}],
	[{y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}],
	[{y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}],
	[{y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}],
	[{y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}, {y:1970, m:0, d:0}]
])
.service('cService', ['array', function(array) {
	var self = this;
	this.getNumDays = function(year, month) {
		if (((month < 8) && (month % 2 == 1)) || ((month >= 8) && (month % 2 == 0))) {
			return 31;
		} else {
			if (month != 2) {
				return 30;
			}
		}
		if ((year % 400) == 0) {
			return 29;
		} else if ((year % 100) == 0) {
			return 28;
		} else if ((year % 4) == 0) {
			return 29;
		} else {
			return 28;
		}
	};
	
	this.populate = function(year, month, day) {
		if (typeof(day) === 'undefined') {
			day = 1;
		}
		date = year + '-' + month + '-' + day;
		date = parseDate(date).getTime();
		date = Math.floor((date / (1000 * 60 * 60 * 24)) % 7);
		date = (date + 4) % 7;
		prevMonth = month - 1;
		prevYear = year;
		if (prevMonth == 0) {
			prevMonth = 12;
			prevYear = prevYear - 1;
		}
		nextMonth = month + 1;
		nextYear = year;
		if (nextMonth == 13) {
			nextMonth = 1;
			nextYear = nextYear + 1;
		}		
		numDays = [self.getNumDays(prevYear, prevMonth), self.getNumDays(year, month), self.getNumDays(nextYear, nextMonth)];
		monthArray = [prevMonth, month, nextMonth];
		yearArray = [prevYear, year, nextYear];
		start = ((day - 1 - date) + numDays[0]) % numDays[0];
		ii = 0;
		for (var i = 0; i < 5; i++) {
			for (var j = 0; j < 7; j++) {
				start = start % numDays[ii];
				if (start == 0) {
					ii++;
				}
				array[i][j].y = yearArray[ii];
				array[i][j].d = start + 1;
				array[i][j].m = monthArray[ii];
				start++;
			}			
		}
		return array;
	};
}]);
cal.service('parseTime', ['fullDays', 'months', 'zones', function(fullDays, months, zones) {
	this.parseEvent = function(event) {
		temp = '';
		if (typeof(event.start.dateTime) === 'undefined') {
			temp = parseDate(event.start.date);
			return fullDays[temp.getDay()] + ", " + months[temp.getMonth()] + " " + temp.getDate() + ", " + temp.getFullYear();
		} else {
			temp = new Date(event.start.dateTime);
			offset = (typeof(event.start.timeZone)==='undefined')?0:zones[event.start.timeZone].time;
			return fullDays[temp.getDay()] + ", " + months[temp.getMonth()] + " " + temp.getDate() + ", " + temp.getFullYear() + " - " + (((temp.getHours() + offset)<10)?("0"+temp.getHours()):temp.getHours()) + ":" + ((temp.getMinutes()<10)?("0"+temp.getMinutes()):temp.getMinutes());
		}
	}
	
}]);
cal.service('getCal', ['$log', '$rootScope', 'Gapi', '$q', 'calParams', 'parseTime', function($log, $rootScope, Gapi, $q, calParams, parseTime) {
	var calList;
	var dateList = {iso : [], long : []};
	var queried = false;
	var deferred = $q.defer()
	
	this.getDateList = function() {
		return dateList;
	};
	this.get = function() {
		if (queried) {
			return deferred.promise;
		}
		queried = true;
		return Gapi.request(calParams).then(function(result) {
			items = angular.copy(result.items);
			archive = [];
			now = new Date();
			pivot = 0;
			for (var i = 0; i < items.length; i++) {
				if (typeof(items[i].start.dateTime) === 'undefined') {
					curr = parseDate(items[i].start.date).getTime();
				} else {
					curr = parseDate(items[i].start.dateTime).getTime();
				}
				if (curr < now) {
					pivot = i;
				} else {
					break;
				}
			}
			for (var i = 0; i < items.length; i++) {
				items[i].dateString = parseTime.parseEvent(items[i]);
				dateList.long.push(items[i].dateString);
				if (typeof(items[i].start.dateTime) === 'undefined') {
					curr = items[i].start.date;
				} else {
					curr = items[i].start.dateTime.substr(0, 10);
				}
				dateList.iso.push(curr);
			}
			archive = angular.copy(items.slice(0, pivot+1));
			items = angular.copy(items.slice(pivot+1));
			calList = {archive: archive, upcoming: items};
			deferred.resolve(calList);
			return calList;
		});
	}
}]);


var ytready;
var root;

var mp = angular.module('mp', []);
mp.constant('swfUrl', './scripts/swf/');
mp.constant('smJs', './scripts/soundmanager2.js');

mp.Player = function($rootScope, $q, $log, $filter, swfUrl, smJs) {
	this.player;
	this.musicUrl;
	this.scope = $rootScope;
	this.loaded = $q.defer();
	this.log = $log;
	this.filter = $filter;
	this.load_(swfUrl, smJs);
	this.sound;
	var piece;
	this.movement;
	this.url = '';
	this.duration;
	this.isSeeking = false;
	this.volume = 75;
	this.nextClick = [];
};

mp.service('musicPlayer', ['$rootScope', '$q', '$log', '$filter', 'swfUrl', 'smJs', mp.Player]);

mp.Player.prototype.load_ = function(swfUrl, smJs) {
	var self = this;
	var tail = $('body')[0];
	
	var loadFn = function() {
		self.duration = self.sound.durationEstimate;
		if (self.sound.isHTML5) {
			$('#loadBar').css('width', (594 * self.sound.bytesLoaded) + 'px');
		} else {
			$('#loadBar').css('width', (594 * self.sound.bytesLoaded / self.sound.bytesTotal) + 'px');
		}
		
	}
	
	var loadedFn = function() {
		self.duration = self.sound.duration;
		$('#loadBar').css('width', 594 + 'px');
	}
	
	var playFn = function() {
		if (!self.isSeeking) {
			$('#seekBar').css('width', (594 * self.sound.position / self.duration) + 'px');
			self.scope.updatePiece();
		} 
	}
	
	this.seekTime = function(p) {
		var loadedDur;
		if (self.sound.isHTML5) {
			loadedDur = Math.floor(self.sound.bytesLoaded * self.duration);
		} else {
			loadedDur = Math.floor(self.sound.bytesLoaded / self.sound.bytesTotal * self.duration);
		}
		curr = (Math.min(loadedDur, p * self.duration));
		self.scope.seekTime(self.filter('date')(curr, 'mm:ss') + ' / ' + self.filter('date')(self.duration, 'mm:ss')); 
	}
	
	this.setVolume = function(v) {
		self.volume = v;
		self.sound.setVolume(100*v);
	}
	
	this.toggleMute = function() {
		self.sound.toggleMute();
	}
	
	var initPlayer = function() {
		soundManager.setup({
			url: swfUrl,	
			flashVersion: 9,
			preferFlash: false,
			onready: function() {
				self.loaded.resolve();
			},
		});
	}
	this.setInfo = function(p, m) {
		piece = p;
		if(typeof(m)==='undefined') {
			self.movement = '';
		} else {
			self.movement = m;
		}		
	}
	this.display = function() {
		return (piece.composer + " " + piece.piece + ((self.movement)?" - ":"") + self.movement)
	}
	this.timeDisplay = function() {
		if (self.sound.position && self.duration) {
			return self.filter('date')(self.sound.position, 'mm:ss') + ' / ' + self.filter('date')(self.duration, 'mm:ss');
		} else {
			return "00:00 / 00:00";
		}
	}
	this.seekToPercent = function(p) {
		var loadedDur;
		if (self.sound.isHTML5) {
			loadedDur = Math.floor(self.sound.bytesLoaded * self.duration);
		} else {
			loadedDur = Math.floor(self.sound.bytesLoaded / self.sound.bytesTotal * self.duration);
		}
		self.sound.setPosition(Math.min(loadedDur, p * self.duration));
	}
	this.playPiece = function(url) {
		if (self.url == url) {
			self.sound.togglePause();
			return;
		}
		if (self.sound) {
			self.sound.stop();
			if (self.sound.muted) {
				$('.icon-volume-up').trigger('click');
			}
			self.sound.destruct();
		}
		$('#loadBar').css('width', 0);
		$('#seekBar').css('width', 0);
		self.sound = soundManager.createSound({
			url: '/music/' + url + '.mp3',
			volume: self.volume,
			whileloading: function() {
				loadFn();
			},
			onload: function() {
				loadedFn();
			},
			whileplaying: function() {
				playFn();
			},
			onplay: function() {
				self.scope.updateIcon('pause');
				self.scope.updatePiece();
			},
			onpause: function() {
				self.scope.updateIcon('play');
			},
			onresume: function() {
				self.scope.updateIcon('pause');
			},
			onfinish: function() {
				self.scope.updateIcon('play');
				this.setPosition(0);
				$('#seekBar').css('width', 0);
				$('.musicHover').removeClass('active');
				if (self.nextClick !== []) {
					$('#loadBar').css('width', 0);
					self.nextClick.trigger('click');
				}
			}
		});
		self.url = url;
		self.sound.play();
	}
	
	$.getScript(smJs, function() {
		initPlayer();
	});	
};

var yt = angular.module('yt', []);
yt.constant('apiUrl', 'http://www.youtube.com/iframe_api?wmode=opaque&origin=http://www.seanchenpiano.com');
yt.constant('channelId', 'UCB2g3_4_nzJl08oPxLPxfPQ');

yt.Player = function($rootScope, $q, $log, $location, apiUrl) {
	this.player;
	this.videoId;
	this.scope = $rootScope;
	this.log = $log;
	var self = this;
	this.loaded = $q.defer();
	this.init = function() {
		self.load_(apiUrl, $location.search().video);
	}
	this.loadVideo = function(vId) {
		if (typeof(self.player) === 'undefined') {
			$log.log('waiting');
			self.loaded.promise.then(function() {
				self.player.loadVideoById(vId);
			});
		} else {
			self.player.loadVideoById(vId);
		}
	};
	this.getQualities = function() {
		return self.player.getAvailableQualityLevels();	
	}
};

yt.service('ytPlayer', ['$rootScope', '$q', '$log', '$location', 'apiUrl', yt.Player]);

yt.Player.prototype.load_ = function(apiUrl, video) {
	var self = this;
	
	var onReady = function() {
		self.loaded.resolve();
		self.scope.$digest();
	}
	window.onYouTubePlayerAPIReady = function() {
		self.player = new YT.Player('player', {
			videoId: video,
			wmode: 'transparent',
			playerVars: {
				'autoplay': 1,
				'wmode': 'transparent'
			},
			events: {
				'onReady': onReady
			}
		});
	};
	$.getScript(apiUrl, function() {
	});	
};

var loader = angular.module('vloader', ['goog']);


loader.value('requestParams', {
	'path': 'youtube/v3/search',
	'params' : {
		'part': 'id, snippet',
		'channelId': 'UCB2g3_4_nzJl08oPxLPxfPQ',
		'type': 'video',
		'maxResults' : 10
	}
}).value('statsParams', {
	'path': 'youtube/v3/videos',
	'params': {
		'part': 'contentDetails, statistics'
	}	
});

loader.service('getVideos', function($rootScope, $log, $q, Gapi, requestParams, statsParams, channelId) {
	var scope = $rootScope;
	var prevTitle;
	var lastToken = "";
	var pageToken;
	var videos;
	var lastIndex = 0;
	var nextCount = 0;
	var vidList;
	var order;
	var vidDefer;
	var getting = false;
	
	return {
		isGetting: function() {
			return getting;
		},
		reset: function() {
			$log.log('reset');
			prevTitle = "";
			lastToken = "";
			pageToken = "";
			videos = [];
			lastIndex = 0;
			nextCount = 0;
			vidList = "";
		},
		setSort: function(o) {
			if (o != "searchResults") {
				requestParams.params.channelId = channelId;
				requestParams.params.order = o;
			} else {
				delete requestParams.params.channelId;
				requestParams.params.q = "sean chen piano";
				requestParams.params.order = "relevance";
			}
			order = o;
		},
		get : function() {
			getting = true;
			vidDefer = $q.defer();
			lastIndex = lastIndex + nextCount;
			var req = angular.copy(requestParams);
			if (!pageToken) {
				videos = [];
			} else {
				req.params.pageToken = pageToken;
			}
			lastToken = pageToken;
			$log.log('requesting', req);
			Gapi.request(req).then(function(response) {
				$log.log('received', response);
				
				vidList = "";
				for (var i = 0; i < response.items.length; i++) {
					vidList = vidList + response.items[i].id.videoId + ",";
				}			
				
				var statsReq = angular.copy(statsParams);
				statsReq.params.id = vidList;
				$log.log('getting stats', statsReq);
				return Gapi.request(statsReq).then(function(statsResponse) {
					$log.log('received stats', statsResponse);
					for (var i = 0; i < statsResponse.items.length; i++) {
						reg0 = /PT(\d+)H(\d+)M(\d+)S/;
						reg1 = /PT(\d+)M(\d+)S/;
						reg2 = /PT(\d+)M/;
						reg3 = /PT(\d+)S/;
						dur = statsResponse.items[i].contentDetails.duration;
						if (reg0.test(dur)){
							dur = dur.replace(reg0,function(m,a,b, c) {return (a.length<2?"0":"")+a+":"+(b.length<2?"0":"")+b+":"+(c.length<2?"0":"")+c;});
						} else if (reg1.test(dur)) {
							dur = dur.replace(reg1,function(m,a,b) {return (a.length<2?"0":"")+a+":"+(b.length<2?"0":"")+b;});
						} else if (reg2.test(dur)) {
							dur = dur.replace(reg2,function(m,a) {return (a.length<2?"0":"")+a+":00";});
						} else if (reg3.test(dur)) {
							dur = dur.replace(reg3,function(m,a) {return "00:" + (b.length<2?"0":"") + b;});
						}
						response.items[i].duration = dur;
						response.items[i].statistics = statsResponse.items[i].statistics;
					}
					pageToken = response.nextPageToken;
					videos = videos.concat(response.items);
					nextCount = response.items.length;
					getting = false;
					vidDefer.resolve(videos);
				});			
			});
			return vidDefer.promise;
		},
		next : function() {
			return pageToken;
		},
		lastIndex : function() {
			return lastIndex;
		},
		returnOrder : function() {
			return order;
		}
	}
});

angular.module('root', ['vloader', 'cal', 'yt', 'JSONresources', 'mp'])
.value('$anchorScroll', angular.noop)
.service('ytInit', ['$location', 'ytPlayer', function($location, ytPlayer) {
	if ($location.search().video) {
		angular.element('#player').removeClass('animate-hide').addClass('animate-show');
	}
	if ($location.search().sort) {
		$("#sort li[click-sort='"+$location.search().sort+"'").addClass('active');
	}
}]).service('deferrer', ['$rootScope', '$q', function($rootScope, $q) {
	this.scope = $rootScope;
	this.q = $q;
	this.loaded = this.q.defer();
	this.ready = this.loaded.promise;
}]).service('scrollFn', function() {
	var self = this;
	this.prev = 0;
	this.fn = function(top) {
		if (typeof(top) === 'undefined') {
			top = 0;
		}
		if (navigator.appName == "Microsoft Internet Explorer") {
			$(document.documentElement).animate({scrollTop: top}, 200, "easeOutCubic");
		}
		$('html, body').animate({scrollTop: top}, 200, "easeOutCubic");
	}
	this.restore = function() {
		self.fn(Math.min(445, self.prev));
	}
	this.save = function () {
		self.prev = $(window).scrollTop();
	}
}).directive('scrollUp', ['scrollFn', function(scrollFn) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind("click", function() {scrollFn.fn();});
		}
	}
}]).directive('infinite', ['$rootScope', '$window', '$log', 'getVideos', function($rootScope, $window, $log, getVideos) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$rootScope.infinite = function() {
				var win = $(this)[0];
				if (win.innerHeight + win.pageYOffset >= ($('#videos').outerHeight() + $('#videos').offset().top) * 0.8) {
					if (scope.moreToLoad && !getVideos.isGetting()) {
						scope.getVids();
					}
				}
			};
			$($window).bind('scroll.infinite', $rootScope.infinite);
		}
	}
}]).directive('homeInfinite', ['$rootScope', '$window', '$log', function($rootScope, $window, $log) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$($window).bind('scroll.infinite', function() {
				var win = $(this)[0];
				if (win.innerHeight + win.pageYOffset >= $('#blogContainer').outerHeight() * 0.8) {
					scope.getMorePosts();
				}
			});
			
		}
	}
}]).directive('slideIn', ['$timeout', '$log', 'getVideos', 'deferrer', function($timeout, $log, getVideos, deferrer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			deferrer.ready.then(function() {
				$timeout(function() {
					element.removeClass('animate-leave').addClass('animate-enter');
				}, 100 * (scope.$index - getVideos.lastIndex()));
			}, function() {
				deferrer.loaded.reject();
			});
		}
	}
}]).directive('clickVideo', ['$rootScope', '$log', 'musicPlayer', 'getVideos', 'ytPlayer', 'toggleYT', function($rootScope, $log, musicPlayer, getVideos, ytPlayer, toggleYT) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind("click", function(e) {
				value = attrs.clickVideo;
				angular.element('#items.active').removeClass('active');
				angular.element(element).addClass('active');
				if (musicPlayer.sound && (musicPlayer.sound.playState == 1)) {
					$('.icon-pause').trigger('click');
				}
				thePlayer = angular.element('#player');
				toggleYT.show();
				ytPlayer.loadVideo(value);
				$('body').animate({scrollTop: 0}, 250, "easeOutCubic");
				
			});
		}
	}
}]).directive('imgLoad', ['deferrer', function(deferrer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind("load" , function(e){
				deferrer.loaded.resolve();
				deferrer.scope.$digest();
			});			
		}
	}
}]).directive('clickSort', ['$rootScope', '$log', '$location', 'getVideos', '$timeout', function($rootScope, $log, $location, getVideos, $timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if (getVideos.returnOrder()) {
				if(attrs.clickSort == getVideos.returnOrder()) {
					angular.element(element).addClass('active');
				} 
			} else {
				if (attrs.clickSort == 'relevance') {
					angular.element(element).addClass('active');
				}
			}
			element.bind("click", function(e) {
				angular.element('#sort li.active').removeClass('active');
				angular.element(element).addClass('active');
				getVideos.reset();
				getVideos.setSort(attrs.clickSort);
				$rootScope.getVids();
			});
		}
	}
}]).directive('bindMusic', ['$log', '$rootScope', 'musicPlayer', function($log, $rootScope, musicPlayer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			current = ((scope.music.url.length == 1)?scope.music.url[0]:'');
			if (musicPlayer) {
				if ((current == musicPlayer.url) && (current != '')) {
					if (musicPlayer.sound.paused) {
						$(element).addClass('paused');
					} else {
						$(element).addClass('active');
					}
				}
			}
			if ($.isArray(scope.music.movements) == true) {
				element.bind("click", function(e) {
					$(element).siblings('ul').animate({
						opacity: 'toggle',
						height: 'toggle'
					}, 200);
					if ($(element).children().length != 0) {
						$(element).children().animate({
						opacity: 'toggle',
							height: 'toggle'
						}, 200);
					}
				});
			} else {
				element.bind("click", function(e) {
					$('#mainFooter').removeClass('animate-hide hide').addClass('animate-show show');
					wasClicked = false;
					if ($(element).hasClass('active')) {
						wasClicked = true;
						$(element).addClass('paused');
					} 
					$('.musicHover').removeClass('active');
					if (!wasClicked) {
						$('.paused').removeClass('paused');
						musicPlayer.setInfo(scope.music);
						$(element).addClass('active');
						musicPlayer.nextClick = [];
					}
					musicPlayer.playPiece(scope.music.url[0]);
				});
			}
		}
	}
}]).directive('seekDrag', ['$log', '$rootScope', 'musicPlayer', function($log, $rootScope, musicPlayer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).on('mousedown', function(event) {
				if (event.which != 1) {
					return;
				}
				musicPlayer.isSeeking = true;
				var start = event.screenX;
				var objPos = $('#seekBar').offset().left;
				$('#seekBar').css('width', Math.min(start - objPos, parseInt($('#loadBar').css('width').replace('px','')))+'px');
				$(window).on('mousemove.seek', function(emove) {
					curr = emove.screenX;
					end = Math.min(curr - objPos, parseInt($('#loadBar').css('width').replace('px','')));
					$('#seekBar').css('width', end+'px');
					musicPlayer.seekTime(end/594.0);
				});
				$(window).on('mouseup.seek', function(eup) {
					$(window).off('.seek');
					curr = eup.screenX;
					end = Math.min(curr - objPos, parseInt($('#loadBar').css('width').replace('px','')));
					$('#seekBar').css('width', end+'px');
					musicPlayer.isSeeking = false;
					musicPlayer.seekToPercent(end/594.0);
				});
			});
		}
	}
}]).directive('volumeDrag', ['$log', '$rootScope', 'musicPlayer', function($log, $rootScope, musicPlayer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).on('mousedown', function(event) {
				if (event.which != 1) {
					return;
				}
				var start = event.screenX;
				var objPos = $('#volumeBar').offset().left;
				$('#volumeBar').css('width', Math.min(start - objPos, parseInt($('#volumeLoad').css('width').replace('px','')))+'px');
				$(window).on('mousemove.seek', function(emove) {
					curr = emove.screenX;
					end = Math.min(curr - objPos, parseInt($('#volumeLoad').css('width').replace('px','')));
					$('#volumeBar').css('width', end+'px');
					musicPlayer.sound.setVolume(100*end/144);
				});
				$(window).on('mouseup.seek', function(eup) {
					$(window).off('.seek');
					curr = eup.screenX;
					end = Math.min(curr - objPos, parseInt($('#volumeLoad').css('width').replace('px','')));
					$('#volumeBar').css('width', end+'px');
					musicPlayer.setVolume(end/144);
				});
			});
		}
	}
}]).directive('toggleMute', ['$log', '$rootScope', 'musicPlayer', function($log, $rootScope, musicPlayer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var muted = false;
			$(element).on('click', function(event) {
				muted = !muted;
				if (muted) {
					$('.icon-volume-up').css('color', '#a5a5a5');
				} else {
					$('.icon-volume-up').css('color', '#a33415');
				}
				$('#volumeBar').toggle();
				musicPlayer.toggleMute();
			});
		}
	}
}]).directive('bindMovement', ['$log', '$rootScope', 'musicPlayer', function($log, $rootScope, musicPlayer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			current = attrs.bindMovement;
			if (musicPlayer) {
				if ((current == musicPlayer.url) && (musicPlayer.url != '')) {
					if (musicPlayer.sound.paused) {
						$(element).addClass('paused');
					} else {
						$(element).addClass('active');
					}
					$(element).parent().animate({
						opacity: 'toggle',
						height: 'toggle'
					}, 200);
				}
			}
			$(element).bind('click', function() {
				$('#mainFooter').removeClass('animate-hide hide').addClass('animate-show show');
				wasClicked = false;
				if ($(element).hasClass('active')) {
					wasClicked = true;
					$(element).addClass('paused');
				}
				$('.musicHover').removeClass('active');
				if (!wasClicked) {
					$('.paused').removeClass('paused');
					musicPlayer.setInfo(scope.$parent.music, scope.movement);
					$(element).addClass('active');
					if (!scope.$last) {
						musicPlayer.nextClick = $($(element).parent().children()[scope.$index + 1]);
					} else {
						musicPlayer.nextClick = [];
					}
				}
				musicPlayer.playPiece(attrs.bindMovement);
			});
		}
	}
}]).directive('triggerClick', ['$log', '$rootScope', 'musicPlayer', function($log, $rootScope, musicPlayer) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).bind('click', function() {
				if (($('.musicHover.active').length == 0) && ($('.musicHover.paused').length == 0)) {
					musicPlayer.sound.togglePause();
				}
				else {
					if ($('.musicHover.paused').length > 0) {
						$('.musicHover.paused').trigger('click');
					} else {
						$('.musicHover.active').trigger('click');
					}
				}
			});
		}
	}
}]).controller('videoLister', ['$rootScope', '$scope', '$log', '$window', 'getVideos', '$timeout', 'ytPlayer', 'toggleYT', 'list', function($rootScope, $scope, $log, $window, getVideos, $timeout, ytPlayer, toggleYT, list) {
	if (!ytPlayer.player) {
		ytPlayer.init();
	}
	if (ytPlayer.player && (ytPlayer.player.getPlayerState() == 2)) {
		toggleYT.show();
	}
	angular.element('#mediaMenu').removeClass('animate-hide').addClass('animate-show');
	$('#mediaMenu .nav[media-nav*="video"]').addClass('active');
	$scope.videos = list;
	$scope.moreToLoad = true;
	$scope.getVids = function() {
		$scope.$apply(getVideos.get().then(function(result) {
			$scope.videos = result;
			$scope.moreToLoad = (getVideos.next()) ? '...' : false;
		}));
	};
	$rootScope.getVids = $scope.getVids;
	$scope.getPublished = function(date) {
		return date.substr(0, 10);
	};
}]).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.when("/home", {
		templateUrl: "/beta/home.php",
		controller: "homeCtrl",
		reloadOnSearch: false,
		resolve : {
			list : function($q, $log, homeResource) {
				var deferred = $q.defer();
				var cb = function(result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.Blurb) {
							obj.Blurb = obj.Blurb.replace(/\\/g, '');
						}
						if (obj.Posted) {
							obj.Posted = new Date(obj.Posted.replace(' ', 'T') + 'Z');
						}
						deferred.resolve(result);
					}
				}
				homeResource.query({q:'', n:'8'}, cb);
				return deferred.promise;
			}
		}
	}).when("/about", {
		templateUrl: "/beta/about.php",
		controller: "aboutCtrl",
		resolve: {
			list: function($q, $log, musicResource) {
				var concertoD = $q.defer(),
					soloD = $q.defer(),
					chamberD = $q.defer(),
					composingD = $q.defer(),
					arrangingD = $q.defer(),
					videogameD = $q.defer();
					
				var concertoCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.contributing) {
							obj.contributing = obj.contributing.replace(/(\r\n)/g, ', ')
						} 
						if (obj.url) {
							obj.url = obj.url.split(';');
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
					}
					concertoD.resolve(result)					
                };
				
				var soloCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.piece) {
							obj.piece = obj.piece.replace(/\\/g, '');
						}
						if (obj.url) {
							obj.url = obj.url.split(';');
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
					}
					soloD.resolve(result);					
				};
				
				var chamberCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.contributing) {
							console.log(obj.contributing);
							obj.contributing = obj.contributing.replace(/(\r\n)/g, ', ');
						} 
						if (obj.url) {
							obj.url = obj.url.split(';');
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
					}
					chamberD.resolve(result);
                };
				
				var genericCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						obj.composer = 'Sean Chen';
						if (obj.piece) {
							obj.piece = obj.piece.replace(/\\/g, '');
						}
						if (obj.info) {
							obj.info = obj.info.replace(/\\/g, '');
						}
						if (obj.url) {
							obj.url = obj.url.split(';');
							for (var i = 0; i < obj.url.length; i++) {
								obj.url[i] = 'composing/' + obj.url[i];
							}
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
						if (obj.pdf) {
							obj.pdf = obj.pdf.split(';');
						}
						if (obj.pdflist) {
							obj.pdflist = obj.pdflist.split(';');
						}
					}
                };
				
				var composingCb = function (result) {
					genericCb(result);
					composingD.resolve(result);
				};
				var arrangingCb = function (result) {
					genericCb(result);
					arrangingD.resolve(result);
				};
				var videogameCb = function (result) {
					genericCb(result);
					videogameD.resolve(result);
				};
				
				musicResource.query({q:'c'}, concertoCb);
				musicResource.query({q:'s'}, soloCb);
				musicResource.query({q:'h'}, chamberCb);
				musicResource.query({q:'o'}, composingCb);
				musicResource.query({q:'a'}, arrangingCb);
				musicResource.query({q:'v'}, videogameCb);
				return $q.all([concertoD.promise, soloD.promise, chamberD.promise, composingD.promise, arrangingD.promise, videogameD.promise]);
			}
		},
		reloadOnSearch: false
	}).when("/schedule", {
		templateUrl: "/beta/schedule.php",
		controller: "scheduleCtrl",
		resolve : {
			list : function($q, $log, getCal) {
				return getCal.get();
			}
		},
		reloadOnSearch: false
	}).when("/music", {
		templateUrl: "/beta/music.php",
		controller: "musicCtrl",
		resolve : {
			list : function ($q, $log, musicResource, musicPlayer) {
				var concertoD = $q.defer(),
					soloD = $q.defer(),
					chamberD = $q.defer(),
					composingD = $q.defer(),
					arrangingD = $q.defer(),
					videogameD = $q.defer();
					
				var concertoCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.contributing) {
							obj.contributing = obj.contributing.replace(/(\r\n)/g, ', ');
						} 
						if (obj.url) {
							obj.url = obj.url.split(';');
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
					}
					concertoD.resolve(result)					
                };
				
				var soloCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.piece) {
							obj.piece = obj.piece.replace(/\\/g, '');
						}
						if (obj.url) {
							obj.url = obj.url.split(';');
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
					}
					soloD.resolve(result);					
				};
				
				var chamberCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.contributing) {
							obj.contributing = obj.contributing.replace(/(\r\n)/g, ', ');
						} 
						if (obj.url) {
							obj.url = obj.url.split(';');
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
					}
					chamberD.resolve(result);
                };
				
				var genericCb = function (result) {
					for (var key in result) {
						var obj = result[key];
						obj.composer = 'Sean Chen';
						if (obj.piece) {
							obj.piece = obj.piece.replace(/\\/g, '');
						}
						if (obj.info) {
							obj.info = obj.info.replace(/\\/g, '');
						}
						if (obj.url) {
							obj.url = obj.url.split(';');
							for (var i = 0; i < obj.url.length; i++) {
								obj.url[i] = 'composing/' + obj.url[i];
							}
						}
						if (obj.movements) {
							obj.movements = obj.movements.split(';');
						}
						if (obj.pdf) {
							obj.pdf = obj.pdf.split(';');
						}
						if (obj.pdflist) {
							obj.pdflist = obj.pdflist.split(';');
						}
					}
                };
				
				var composingCb = function (result) {
					genericCb(result);
					composingD.resolve(result);
				};
				var arrangingCb = function (result) {
					genericCb(result);
					arrangingD.resolve(result);
				};
				var videogameCb = function (result) {
					genericCb(result);
					videogameD.resolve(result);
				};
				
				musicResource.query({q:'c', r:'m'}, concertoCb);
				musicResource.query({q:'s', r:'m'}, soloCb);
				musicResource.query({q:'h', r:'m'}, chamberCb);
				musicResource.query({q:'o', r:'m'}, composingCb);
				musicResource.query({q:'a', r:'m'}, arrangingCb);
				musicResource.query({q:'v', r:'m'}, videogameCb);
				return $q.all([concertoD.promise, soloD.promise, chamberD.promise, composingD.promise, arrangingD.promise, videogameD.promise]);
			}
		},
		reloadOnSearch: false
	}).when("/videos", {
		templateUrl: "/beta/videos.php", controller: "videoLister",
		resolve : {
            list : function ($q, $route, $timeout, getVideos) {
				getVideos.reset();
            	return getVideos.get();
            }
        },
		reloadOnSearch: false
	}).when("/pictures", {
		templateUrl: "/beta/pictures.php", controller: "picturesCtrl",
		resolve : {
			list : function ($q, $log, picturesResource) {
				var deferred = $q.defer();
				
				var pictureCb = function(result) {
					deferred.resolve(result);
				}
				
				picturesResource.query({}, pictureCb);
				
				return deferred.promise;
			}
		},
		reloadOnSearch: false
	}).when("/press", {
		templateUrl: "/beta/press.php",
		controller: "pressCtrl",
		resolve : {
			list : function ($q, pressResource) {
				var deferred = $q.defer();
				var cb = function(result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.quote) {
							obj.quote = obj.quote.replace(/\\/g, '');
						}
						deferred.resolve(result);
					}
				}
				
				pressResource.query({q:''}, cb);
				return deferred.promise;
			}
		},
		reloadOnSearch: false
	}).when("/contact", {
		templateUrl: "/beta/contact.php",
		controller: "contactCtrl",
		reloadOnSearch: false
	}).otherwise({
		templateUrl: "/beta/home.php",
		controller: "homeCtrl",
		reloadOnSearch: false,
		resolve : {
			list : function($q, $log, homeResource) {
				var deferred = $q.defer();
				var cb = function(result) {
					for (var key in result) {
						var obj = result[key];
						if (obj.Blurb) {
							obj.Blurb = obj.Blurb.replace(/\\/g, '');
						}
						if (obj.Posted) {
							obj.Posted = new Date(obj.Posted.replace(' ', 'T') + 'Z');
						}
						deferred.resolve(result);
					}
				}
				homeResource.query({q:'', n:'8'}, cb);
				return deferred.promise;
			}
		}
	});
}]).constant('menuEntries', ['home', 'about', 'schedule', 'media', 'press', 'contact'])
.constant('fronts', ['./images/front0.jpg', './images/front1.jpg', './images/front2.jpg', './images/front3.jpg'])
.constant('mediaPaths', ['music', 'videos', 'pictures'])
.constant('mediaIcons', ['music', 'youtube-play', 'camera'])
.controller('navigation', ['$scope', '$log', 'menuEntries', function($scope, $log, menuEntries) {
	$scope.navs = menuEntries;
}]).controller('mediaNav', ['$scope', '$log', 'mediaIcons', 'mediaPaths', function($scope, $log, mediaIcons, mediaPaths) {
	$scope.mediaIcons = mediaIcons;
	$scope.mediaPaths = mediaPaths;
}]).directive('toggleChildren', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).on('click', function() {
				$(this).children().animate({
					opacity: 'toggle',
					height: 'toggle'
				}, 200);
			});
		}
	}
}]).directive('toggleSiblings', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).on('click', function() {
				 if ($(this).hasClass('icon-right-dir')) {
					 $(this).removeClass('icon-right-dir').addClass('icon-down-dir')
				 } else {
					 $(this).removeClass('icon-down-dir').addClass('icon-right-dir');
				 }
				$(this).siblings().animate({
					opacity: 'toggle',
					height: 'toggle'
				}, 200);
			});
		}
	}
}]).service('toggleYT', ['ytPlayer', '$log', function(ytPlayer, $log) {
	this.hide = function() {
		angular.element('#front').removeClass('under').addClass('over').removeClass('animate-hide').addClass('animate-show'); 
		if (angular.isDefined(ytPlayer.player)) {
				ytPlayer.player.pauseVideo();
			}
		};
	this.show = function() {angular.element('#front').removeClass('animate-show').addClass('animate-hide')
					.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(event){
							$(event.currentTarget).unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd");
							$(event.currentTarget).removeClass('over').addClass('under');
					});
	};
}]).directive('fadeFront', function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$scope.$watch('front', function(newValue, oldValue) {
				var front = $('#theFront'), fader = $('#theFader');
				if (newValue === oldValue) {
					return;
				}
				if (isFading()) {
					return;
				}
				initFade(oldValue);
				
				function initFade(fadeSource) {
                	fader.prop("src", fadeSource).addClass( "show" );
                    front.one( "load", startFade );
                }
				
				function isFading() {
                    return(
                        fader.hasClass("show") || fader.hasClass( "animate-hide" )
                    );
                }
				function startFade() {
                	fader.width();
 	            	fader.addClass( "animate-hide" );
 		            setTimeout( teardownFade, 250 );
                }

				function teardownFade() {
					fader.removeClass( "show animate-hide" );
				}
				
			});
			
		}
	}
	
}).directive('clickNav', ['$rootScope', '$log', '$location', function($rootScope, $log, $location) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			angular.element('#content').html("");
			element.bind("click", function() {
				if (('/'+attrs.clickNav) == $location.path()) {
					return;
				}
				if (attrs.clickNav == 'media') {
					if (angular.element('#mediaMenu').hasClass('animate-hide')) {
						angular.element('#mediaMenu').removeClass('animate-hide').addClass('animate-show');
					} else {
						angular.element('#mediaMenu').removeClass('animate-show').addClass('animate-hide');
					}
				} else {
					$('#mediaMenu .active').removeClass('active');
					angular.element('#mainMenu .active').removeClass('active');
					angular.element(element).addClass('active');
					angular.element('#mediaMenu').removeClass('animate-show').addClass('animate-hide');
					$('#content').addClass('animate-hide').removeClass('animate-show').bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(event){
						$(event.currentTarget).unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd");
						$rootScope.$apply($location.path(attrs.clickNav));
					});
				}

			});
		}
	}
}]).directive('mediaNav', ['$rootScope', '$log', '$location', function($rootScope, $log, $location) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind("click", function() {
				if (('/'+attrs.mediaNav) == $location.path()) {
					return;
				}
				if ($(element).parent().hasClass('animate-show')) {
					angular.element('#mainMenu .active').removeClass('active');
					angular.element('#mediaMenu .active').removeClass('active');
					angular.element(element).addClass('active');
					$('#content').addClass('animate-hide').removeClass('animate-show').bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(event){
						$(event.currentTarget).unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd");
						$rootScope.$apply($location.path(attrs.mediaNav));
					});
				}
			});
		}
	}
}]).controller('homeCtrl', ['$scope', 'homeResource', 'list', 'fullDays', 'months', '$q', function($scope, homeResource, list, fullDays, months, $q) {
	var def = $q.defer();
	var countCb = function(result) {
		console.log('resolving');
		def.resolve(result[0]['COUNT(*)']);
	};
	$scope.postCount = homeResource.query({q:'c'}, countCb);
	$scope.page = 0;
	$scope.number = 8;
	$scope.timeString = function(time) {
		return fullDays[time.getDay()] + ', ' + months[time.getMonth()] + ' ' + time.getDate() + ', ' + time.getFullYear() + ', ' + ((time.getHours() < 10)?'0':'') + time.getHours() + ":" + ((time.getMinutes() < 10)?'0':'') + time.getMinutes();
	}
	$scope.blog = list;
	console.log($scope.blog);
	$('#mainMenu .nav[click-nav*="home"]').addClass('active');
	$scope.isGetting = false;

	
	$scope.getMorePosts = function() {
		console.log($scope.page);
		if ($scope.isGetting) {
			console.log('returning');
			return;
		}
		$scope.page++;
		if ($scope.page * $scope.number > $scope.postCount) {
			return;
		}
		var cb = function(result) {
			console.log(result);
			for (var key in result) {
				var obj = result[key];
				if (obj.Blurb) {
					obj.Blurb = obj.Blurb.replace(/\\/g, '');
				}
				if (obj.Posted) {
					obj.Posted = new Date(obj.Posted.replace(' ', 'T') + 'Z');
				}
			}
			$scope.isGetting = false;
			$scope.blog = $scope.blog.concat(result);
		};
		$scope.isGetting = true;
		start = $scope.page * $scope.number;
		$scope.$apply(function() {homeResource.query({s:start, n:$scope.number}, cb)});
	}	
	
}]).controller('aboutCtrl', ['$scope', 'list', function($scope, list) {
	$('#mainMenu .nav[click-nav*="about"]').addClass('active');
	$scope.dir = ['right', 'right', 'right'];
	$scope.repList = [{},{},{},{},{},{}];
	for (var i = 0; i < 6; i++) {
		$scope.repList[i].list = list[i];
	}

	$scope.repList[0].label = 'Concerto Repertoire';
	$scope.repList[1].label = 'Solo Repertoire';
	$scope.repList[2].label = 'Chamber Repertoire';
	$scope.repList[3].label = 'Compositions';
	$scope.repList[4].label = 'Arrangements';
	$scope.repList[5].label = 'Videogame';

	$scope.prevComp = '';
	
	$scope.showComp = function(entry) {
		if (entry == $scope.prevComp || entry == 'Sean Chen') {
			return '';			
		}
		$scope.prevComp = entry;
		return entry;
	};

		
	$scope.fileOrList = function(entry, i) {
		if (entry.pdflist.length != 0) {
			return entry.pdflist[i];
		}
		return '';
	}
	
}]).controller('musicCtrl', ['$scope', '$q', '$log', 'toggleYT', '$window', 'list', '$window', 'musicPlayer', function($scope, $q, $log, toggleYT, $window, list, $window, scrollFn, musicPlayer) {
	angular.element('#mediaMenu').removeClass('animate-hide').addClass('animate-show');
	$('#mediaMenu .nav[media-nav*="music"]').addClass('active');
	$scope.list = {}
	$scope.list.concerti = list[0];
	$scope.list.soli = list[1];
	$scope.list.chamber = list[2];
	$scope.list.composition = list[3];
	$scope.list.arrangement = list[4];
	$scope.list.vg = list[5];
	$scope.predicate = {concerto: 'year', solo: 'year', chamber: 'year', composition: 'year', arrangement: 'year', vg: 'year'};
	$scope.reverse = {concerto: 'true', solo: 'true', chamber: 'true', composition: 'true', arrangement: 'true', vg: 'true'};
	$scope.last = {concerto: 'year', solo: 'year', chamber: 'year', composition: 'year', arrangement: 'year', vg: 'year'};
	$scope.sort = function(type, pred) {
			$scope.predicate[type] = pred; 
			if ($scope.last[type] != $scope.predicate[type]) {
				if (pred == "year") {
					$scope.reverse[type] = true;
				} else {
					$scope.reverse[type] = false;
				}
				$scope.last[type] = $scope.predicate[type];
			} else {
				$scope.reverse[type] = !$scope.reverse[type];
			}
	};
	$scope.isSelected = function(type, pred) {
		return $scope.predicate[type] === pred;
	};
	$scope.sortIcon = function(type, pred) {
		if ($scope.predicate[type] === pred) {
			if ($scope.reverse[type]) {
				return 'icon-down-dir';
			} else {
				return 'icon-up-dir';
			}
		}
		return '';
	};
		
	$scope.fileOrList = function(entry, i) {
		if (entry.pdflist.length != 0) {
			return entry.pdflist[i];
		}
		return '';
	}
	
}]).directive('initFancybox', ['$log', function($log) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$('.fancybox').fancybox({
				openEffect	: 'elastic',
				prevEffect	: 'fade',
				nextEffect	: 'fade',
				helpers	: {
					title	: {
						type: 'outside'
					},
					thumbs	: {
						width	: 75,
						height	: 75
					},
					overlay : {
						css : {
							'background' : 'rgba(0, 0, 0, 0.85)'
						}
					},
				}
			});
		}
	}	
}]).controller('picturesCtrl', ['$scope', 'list', 'toggleYT', '$window', function($scope, list, toggleYT, $window) {
	angular.element('#mediaMenu').removeClass('animate-hide').addClass('animate-show');
	$('#mediaMenu .nav[media-nav*="pictures"]').addClass('active');
	$scope.pictures = list;
}]).controller('scheduleCtrl', ['$scope', 'list', '$window', 'parseTime', function($scope, list, $window, parseTime) {
	$('#mainMenu .nav[click-nav*="schedule"]').addClass('active');
	$scope.list = list;
	$scope.parseTime = parseTime.parseEvent;
	$scope.describeEvent = function(event) {
		if (typeof(event.description) === 'undefined') {
			return event.summary;
		} else {
			temp = event.description;
			n = temp.indexOf('site: ');
			if (n != -1) {
				temp = temp.substr(0, n-2);
			}
			return temp;
		}
	};
	$scope.getLink = function(event) {
		if (typeof(event.description) === 'undefined') {
			return false;
		} else {
			temp = event.description;
			n = temp.indexOf('site: ');
			if (n != -1) {
				url = temp.substr(n+6);
				return url;
			}
			return false;
		}
		
	}
	
}]).controller('contactCtrl', ['$scope', 'getVideos', 'toggleYT', '$window', function($scope, getVideos, toggleYT, $window) {
	$('#mainMenu .nav[click-nav*="contact"]').addClass('active');
}]).controller('pressCtrl', ['$scope', 'getVideos', 'list', '$window', function($scope, getVideos, list, $window) {
	$('#mainMenu .nav[click-nav*="press"]').addClass('active');
	$scope.quotes = list;
	
}]).controller('mainFooter', ['$scope', '$rootScope', 'musicPlayer', function($scope, $rootScope, musicPlayer) {
	$scope.icon = 'pause';
	$scope.updateIcon = function(i) {
		$scope.$apply(function() {
			$scope.icon = i;
		});
	}
	$scope.updatePiece = function() {
		$scope.$apply(function() {
			$scope.piece = musicPlayer.display();
			$scope.time = musicPlayer.timeDisplay();
		});
	}
	$scope.seekTime = function(t) {
		$scope.$apply(function() {
			$scope.time = t;
		});
	}
	$rootScope.seekTime = $scope.seekTime;
	$rootScope.updateIcon = $scope.updateIcon;
	$rootScope.updatePiece = $scope.updatePiece;
}]).controller('twitterCtrl', ['$scope', '$q', 'twitterResource', function($scope, $q, twitterResource) {
	var def = $q.defer();
	var theResults = [];
	var temp1, temp2;
	var cb1 = function(result) {
		temp1 = angular.copy(result);
		twitterResource.query({q:'m'}, cb2);
	}
	
	var cb2 = function(result) {
		temp2 = angular.copy(result);
		theResults = temp1.concat(temp2);
		for (var key in theResults) {
			var obj = theResults[key];
			if (obj.created_at) {
				obj.created_at = obj.created_at.replace(/(\+\S+) (.*)/, '$2 $1');
			}
		}
		def.resolve(theResults);
	}
	twitterResource.query({q:'u'}, cb1);
	$scope.tweets = def.promise;
	console.log($scope.tweets);
	
}]).controller('rootCtrl', ['$scope', '$rootScope', 'scrollFn', 'toggleYT', 'fronts', 'pressResource', function($scope, $rootScope, scrollFn, toggleYT, fronts, pressResource) {
	$('#mainRow').css('min-height', ($(window).innerHeight() - 95) + 'px');
	var start = true;
	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		scrollFn.save();
		$(window).unbind('.infinite');
		if (start && (typeof($$route) !== 'undefined')){
			if (next.$$route.templateUrl == "/beta/about.php") {
				$('.quote').removeAttr('style').css({top: '20px', left: '50px'});
				$scope.front = fronts[3];
			} else if (next.$$route.templateUrl == "/beta/schedule.php") {
				$('.quote').removeAttr('style').css({bottom: '20px', left: '50px'});
				$scope.front = fronts[1];
			} else if (next.$$route.templateUrl == "/beta/press.php") {
				$scope.front = fronts[2];
				$('.quote').removeAttr('style').css({display: 'none'});
			} else if (next.$$route.templateUrl == "/beta/home.php") {
				$scope.front = fronts[0];
				$('.quote').removeAttr('style').css({top: '20px', left: '50px'});
			}
		} 
    });
	var genericCb = function (result) {
		for (var key in result) {
			var obj = result[key];
			if (obj.short) {
				obj.short = obj.short.replace(/\\/g, '');
			}
		}
		return result;
	};
	$scope.quotes = pressResource.query({q:'s'}, genericCb);
	$scope.quoteIndex = 0;
	$('.quote').removeAttr('style').css({top: '20px', left: '50px'});
	$scope.front = fronts[0];
	var prevVid = false;
	$rootScope.$on('$routeChangeSuccess', function(event, next, current) {
		$('#content').removeClass('animate-hide').addClass('animate-show');
		scrollFn.restore();
		if (!start) {
			if (next.loadedTemplateUrl == "/beta/about.php") {
				$('.quote').removeAttr('style').css({top: '20px', left: '50px'});
				$scope.front = fronts[3];
			} else if (next.loadedTemplateUrl == "/beta/schedule.php") {
				$('.quote').removeAttr('style').css({bottom: '20px', left: '50px'});
				$scope.front = fronts[1];
			} else if (next.loadedTemplateUrl == "/beta/press.php") {
				$scope.front = fronts[2];
				$('.quote').removeAttr('style').css({display: 'none'});
			} else if (next.loadedTemplateUrl == "/beta/home.php") {
				$scope.front = fronts[0];
				$('.quote').removeAttr('style').css({top: '20px', left: '50px'});
			}
			$scope.quoteIndex = ($scope.quoteIndex + 1) % $scope.quotes.length;
		} else {
			start = false;
		}
		if (next.loadedTemplateUrl != "/beta/videos.php") {
			if (!prevVid) {
				return;
			}
			prevVid = false;
			toggleYT.hide();
			$('#sidebar').children().removeClass('hide');
			$('#sidebar').removeClass('out').bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(event){
				$(this).unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd");
				$(this).children().removeClass('animate-hide').addClass('animate-show');
			});
			
			/**/
		} else {
			prevVid = true;
			$('#sidebar').children().addClass('animate-hide').removeClass('animate-show').bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function(event){
				$('#sidebar').addClass('out');
				$(this).addClass('hide');
				$(this).unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd");
			});
		}
			
		
		
		
	});
}]).directive('dateString', ['getCal', function(getCal) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
		}
	}
}])
.controller('calendar', ['$scope', '$location', '$timeout', 'days', 'months', 'cService', 'getCal', 'scrollFn', function($scope, $location, $timeout, days, months, cService, getCal, scrollFn) {
	var date = new Date();
	var scrollItem = '';
	$scope.showCalendar = 'list';
	$scope.$on('$routeChangeStart', function() {
		if ($location.path() == '/schedule') {
			$scope.showCalendar = 'full';
			$scope.initCal();
		} else if ($location.path() == '/videos') {
		
		} else {
			$scope.showCalendar = 'list';
		}
	});
	$scope.$on('$routeChangeSuccess', function() {
		$timeout(function() {
			if (scrollItem != '') {
				scrollFn.fn($('.schedule li[scroll-date*="' + scrollItem + '"]').offset().top - 120);
			}
			scrollItem = '';
		}, 0);
	});
	getCal.get().then(function(result) {
		$scope.masterCalendar = result;
		$scope.listCalendar = [];
		for (var i = 0; i < 3; i++) {
			$scope.listCalendar.push($scope.masterCalendar.upcoming[i]);
		}
		$scope.dateList = getCal.getDateList();
		$scope.highlight();
	});
	
	$scope.goToSched = function(where) {
		$('#mainMenu li[click-nav*="schedule"]').trigger('click');
		scrollItem = where;
	}
	
	$scope.stringify = function(day) {
		return day.y + '-' + ((day.m < 10)?'0':'') + day.m + '-' + ((day.d < 10)?'0':'') + day.d;
	}	
	$scope.highlight = function() {
		$timeout(function() {
				$('#calendar td').removeClass('hasEvent');
				for (var i = 0; i < $scope.dateList.iso.length; i++) {
					$('#calendar td[date-iso*=' + $scope.dateList.iso[i] + ']').addClass('hasEvent').attr('string', $scope.dateList.long[i]).on('click', function(event) {
						scrollFn.fn($('.schedule li[scroll-date*="' + $(event.currentTarget).attr('string') + '"]').offset().top - 120);
					});
				}
		}, 0);
	};
	$scope.initCal = function() {
		date = new Date();
		$scope.days = days;
		$scope.currMonth = date.getMonth();
		$scope.currYear = date.getFullYear();
		$scope.month = months[$scope.currMonth];
		$scope.year = $scope.currYear;
		$scope.cal = cService.populate($scope.currYear, $scope.currMonth + 1);
		if (typeof($scope.dateList) !== 'undefined') {
			$scope.highlight();
		}
	}
	
	$scope.prevMonth = function() {
		$scope.currMonth--;
		if ($scope.currMonth < 0) {
			$scope.currYear--;
			$scope.currMonth = 11;
		}
		$scope.month = months[$scope.currMonth];
		$scope.year = $scope.currYear;
		$scope.cal = cService.populate($scope.currYear, $scope.currMonth + 1);
		$scope.highlight();
	}
	
	$scope.nextMonth = function() {
		$scope.currMonth++;
		if ($scope.currMonth > 11) {
			$scope.currYear++;
			$scope.currMonth = 0;
		}
		$scope.month = months[$scope.currMonth];
		$scope.year = $scope.currYear;
		$scope.cal = cService.populate($scope.currYear, $scope.currMonth + 1);
		$scope.highlight();
	}
	$scope.initCal();
}]);

angular.module('JSONresources', ['ngResource']).
factory('musicResource', function ($resource) {
	return $resource('musicJSON.php', {}, {
		query: {method:'GET', params:{q:''}, isArray:true}
	});
}).factory('picturesResource', function($resource) {
	return $resource('picturesJSON.php', {}, {
		query: {method:'GET', params:{}, isArray:true}
	});
}).factory('twitterResource', function($resource) {
	return $resource('twitter.php', {}, {
		query: {method:'GET', params:{}, isArray:true}
	});	
}).factory('pressResource', function($resource) {
	return $resource('pressJSON.php', {}, {
		query: {method:'GET', params:{}, isArray:true}
	});	
}).factory('homeResource', function($resource) {
	return $resource('homeJSON.php', {}, {
		query: {method:'GET', params:{}, isArray:true}
	});	
});