// Gapi functions

angular.module('services.Gapi', [])
    .constant('gapiUrl', 'https://apis.google.com/js/client.js')
    .service('Gapi', ['$rootScope', '$q', '$log', '$window', 'gapiUrl',
        function ($rootScope, $q, $log, $window, gapiUrl) {
            this.scope = $rootScope;
            this.log = $log;
            this.q = $q;
            this.window = $window;
            this.loaded = this.q.defer();
            this.ready = this.loaded.promise;

            this.log.info('Loading gapi...');
            this.window.gapiLoaded = angular.bind(this, function () {
                this.log.info('Loaded.');
                this.loaded.resolve();
                this.scope.$digest();
            });
            var tail = $('body')[0];
            $("<script>").attr({
                type: 'text/javascript',
                src: gapiUrl + '?onload=gapiLoaded'
            }).appendTo(tail);

            this.request = function (params) {
                var self = this;
                var deferred = this.q.defer();
                if (params.callback) {
                    this.log.warn('params will be overwritten.');
                }
                params.callback = function (result) {
                    if (!result || !result.error) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                    self.scope.$digest();
                };
                self.ready.then(function () {
                    self.log.info('requesting...', params);
                    gapi.client.request(params);
                }, function () {
                    deferred.reject();
                });
                self.log.info('request promised.');
                return deferred.promise;
            };
        }]);

angular.module('google', ['services.Gapi'])
    .constant('apiKey', 'AIzaSyBJm8pj4Ejqw8rHJVgk_0s6w1HlB6RfZ34')
    .run(function (Gapi, apiKey) {
        var self = Gapi;
        var sendKey = function () {
            gapi.client.setApiKey(apiKey);
            self.log.info('Key set.');
        };
        self.loaded.promise.then(sendKey);
        return self.ready.promise;
    });

// parse event and time

angular.module('services.parseEventTime', [])
.service('parseEventTime', [function () {
    this.string = function (event) {
        if (typeof (event.start.dateTime) === 'undefined') {
            return moment(event.start.date).format("dddd MMMM D, YYYY");
        } else {
            if (typeof (event.start.timeZone) === 'undefined') {
                event.start.timeZone = "America/New_York";
            }
            date = moment(event.start.dateTime);
            date.tz(event.start.timeZone);
            return date.format("dddd MMMM D, YYYY - HH:mm z");
        }
    };
    this.moment = function (event) {
        if (typeof (event.start.dateTime) === 'undefined') {
            return moment(event.start.date);
        } else {
            if (typeof (event.start.timeZone) === 'undefined') {
                event.start.timeZone = "America/New_York";
            }
            date = moment(event.start.dateTime);
            date.tz(event.start.timeZone);
            return date;
        }
    };
}]);

// GOOGLE CALENDAR LOADER

angular.module('values.calendar', [])
.value('calParams', {
    'path': 'calendar/v3/calendars/rjeriqtl1igtpf9kl0v17jjvuc@group.calendar.google.com/events',
    'params': {
        'orderBy': 'startTime',
        'singleEvents': 'true'
    }
})
.value('days', ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

angular.module('services.getGoogleCalendar', [
    'google',
    'values.calendar',
    'services.parseEventTime'
]).service('getGoogleCalendar', ['$log', '$rootScope', 'Gapi', '$q', 'calParams', 'parseEventTime',
    function ($log, $rootScope, Gapi, $q, calParams, parseEventTime) {
        var calList = null;
        var dateList = { "iso": [], "long": [] };
        var queried = false;
        var deferred = $q.defer()

        this.getDateList = function () {
            return dateList;
        };
        this.get = function () {
            if (queried) {
                return deferred.promise;
            }
            queried = true;
            return Gapi.request(calParams).then(function (result) {
                items = angular.copy(result.items);
                archive = [];
                now = moment();
                pivot = 0;
                for (var i = 0; i < items.length; i++) {
                    if (parseEventTime.moment(items[i]).isBefore(now)) {
                        pivot = i + 1;
                    } else {
                        break;
                    }
                }
                for (var i = 0; i < items.length; i++) {
                    items[i].dateString = parseEventTime.string(items[i]);
                    dateList['long'].push(items[i].dateString);
                    dateList['iso'].push(parseEventTime.moment(items[i]).format("YYYY-MM-DD"));
                }
                archive = angular.copy(items.slice(0, pivot));
                items = angular.copy(items.slice(pivot));
                calList = { archive: archive, upcoming: items };
                deferred.resolve(calList);
                return calList;
            });
        }
    }]);


angular.module('googleCalendar', [
    'services.getGoogleCalendar'
]);

// CALENDAR WIDGET DISPLAY

angular.module('services.calendarWidget', [])
.service('calendarWidget', function () {
    var self = this;
    this.array = [];
    this.current = moment().date(1);

    this.nextMonth = function () {
        self.current.add(1, 'M');
    }

    this.prevMonth = function () {
        self.current.subtract(1, 'M');
    }

    this.month = function () {
        return self.current.format("MMMM");
    }

    this.year = function () {
        return self.current.format("YYYY");
    }

    this.populate = function () {
        dayNum = self.current.day();

        cursor = moment(self.current).subtract(dayNum, 'd');

        for (var i = 0; i < 5; i++) {
            if (typeof (self.array[i]) === 'undefined') {
                self.array[i] = [];
            }
            for (var j = 0; j < 7; j++) {
                temp = { 'y': cursor.format("YYYY"), 'm': cursor.format("M"), 'd': cursor.format("D") };
                self.array[i][j] = temp;
                cursor.add(1, 'd');
            }
        }
        return self.array;
    };
})

// MUSIC PLAYER

angular.module('mp', ['services.musicPlayer'])

angular.module('services.musicPlayer', [])
    .constant('swfUrl', './scripts/swf/')
    .constant('smJs', './scripts/soundmanager2-nodebug-jsmin.js')
    .service('musicPlayer', ['$rootScope', '$q', '$log', '$filter', 'swfUrl', 'smJs', '$timeout',
        function ($rootScope, $q, $log, $filter, swfUrl, smJs, $timeout) {
            this.player = null;
            this.timeout = $timeout;
            this.musicUrl = null;
            this.scope = $rootScope;
            this.loaded = $q.defer();
            this.log = $log;
            this.filter = $filter;
            this.sound = null;
            this.piece = null;
            this.movement = null;
            this.url = '';
            this.duration = null;
            this.isSeeking = false;
            this.volume = 75;
            this.nextClick = [];

            var self = this;
            var tail = $('body')[0];

            var loadFn = function () {
                self.duration = self.sound.durationEstimate;
                if (self.sound.isHTML5) {
                    $('#loadBar').css('width', (594 * self.sound.bytesLoaded) + 'px');
                } else {
                    $('#loadBar').css('width', (594 * self.sound.bytesLoaded / self.sound.bytesTotal) + 'px');
                }
            }
            var loadedFn = function () {
                self.duration = self.sound.duration;
                $('#loadBar').css('width', 594 + 'px');
            }
            var playFn = function () {
                if (!self.isSeeking) {
                    $('#seekBar').css('width', (594 * self.sound.position / self.duration) + 'px');
                    self.scope.updatePiece();
                }
            }
            this.seekTime = function (p) {
                var loadedDur;
                if (self.sound.isHTML5) {
                    loadedDur = Math.floor(self.sound.bytesLoaded * self.duration);
                } else {
                    loadedDur = Math.floor(self.sound.bytesLoaded / self.sound.bytesTotal * self.duration);
                }
                curr = (Math.min(loadedDur, p * self.duration));
                self.scope.seekTime(self.filter('date')(curr, 'mm:ss') + ' / ' + self.filter('date')(self.duration, 'mm:ss'));
            }
            this.setVolume = function (v) {
                self.volume = v;
                self.sound.setVolume(100 * v);
            }
            this.toggleMute = function () {
                self.sound.toggleMute();
            }

            var initPlayer = function () {
                soundManager.setup({
                    url: swfUrl,
                    flashVersion: 9,
                    preferFlash: false,
                    onready: function () {
                        //console.log('onready');
                        self.loaded.resolve();
                    },
                    ontimeout: function () {
                        soundManager.flashLoadTimeout = 0; // When restarting, wait indefinitely for flash
                        soundManager.onerror = {}; // Prevent an infinite loop, in case it's not flashblock
                        soundManager.reboot();
                    }
                });
            }
            this.setInfo = function (p, m) {
                self.piece = p;
                if (typeof (m) === 'undefined') {
                    self.movement = '';
                } else {
                    self.movement = m;
                }
            }
            this.display = function () {
                return (self.piece.composer + " " + self.piece.piece + ((self.movement) ? " - " : "") + self.movement)
            }
            this.timeDisplay = function () {
                if (self.sound.position && self.duration) {
                    return self.filter('date')(self.sound.position, 'mm:ss') + ' / ' + self.filter('date')(self.duration, 'mm:ss');
                } else {
                    return "00:00 / 00:00";
                }
            }
            this.seekToPercent = function (p) {
                var loadedDur;
                if (self.sound.isHTML5) {
                    loadedDur = Math.floor(self.sound.bytesLoaded * self.duration);
                } else {
                    loadedDur = Math.floor(self.sound.bytesLoaded / self.sound.bytesTotal * self.duration);
                }
                self.sound.setPosition(Math.min(loadedDur, p * self.duration));
            }
            this.playPiece = function (url) {
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
                    url: '/musicfiles/' + url + '.mp3',
                    volume: self.volume,
                    whileloading: function () {
                        loadFn();
                    },
                    onload: function () {
                        loadedFn();
                    },
                    whileplaying: function () {
                        playFn();
                    },
                    onplay: function () {
                        self.scope.updateIcon('pause');
                        self.scope.updatePiece();
                    },
                    onpause: function () {
                        self.scope.updateIcon('play');
                    },
                    onresume: function () {
                        self.scope.updateIcon('pause');
                    },
                    onfinish: function () {
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

            $.getScript(smJs, function (data, textStatus, jqxhr) {
                initPlayer();

            });
        }]);

// YOUTUBE PLAYER LOADER

angular.module('youtube', [])
.constant('apiUrl', 'http://www.youtube.com/iframe_api?wmode=opaque&origin=http://seanchenpiano.com')
.constant('playlist', 'PLzauXr_FKIlhzArviStMMK08Xc4iuS0n9')
.service('ytPlayer', ['$rootScope', '$q', '$log', '$location', 'apiUrl',
    function ($rootScope, $q, $log, $location, apiUrl) {
        var self = this;

        this.player = null;
        this.videoId = null;
        this.scope = $rootScope;
        this.log = $log;

        this.loaded = $q.defer();
        this.init = function () {
            var onReady = function () {
                self.loaded.resolve();
                self.scope.$digest();
            }

            window.onYouTubePlayerAPIReady = function () {
                self.player = new YT.Player('player', {
                    videoId: self.videoId,
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

            $.getScript(apiUrl);
        }

        this.loadVideo = function (vId) {
            if (typeof (self.player) === 'undefined') {
                $log.log('waiting');
                self.loaded.promise.then(function () {
                    self.player.loadVideoById(vId);
                });
            } else {
                self.player.loadVideoById(vId);
            }
        };
        this.getQualities = function () {
            return self.player.getAvailableQualityLevels();
        }
    }]);

// YOUTUBE PLAYLIST LOADER

angular.module('vloader', ['google'])
.value('requestParams', {
    'path': 'youtube/v3/playlistItems',
    'params': {
        'part': 'id, snippet',
        'playlistId': 'PLzauXr_FKIlhzArviStMMK08Xc4iuS0n9',
        'maxResults': 10
    }
}).value('statsParams', {
    'path': 'youtube/v3/videos',
    'params': {
        'part': 'contentDetails, statistics'
    }
}).service('getVideos', function ($rootScope, $log, $q, Gapi, requestParams, statsParams) {
    this.scope = $rootScope;
    this.prevTitle = "";
    this.lastToken = "";
    this.pageToken = "";
    this.videos = [];
    this.lastIndex = 0;
    this.nextCount = 0;
    this.vidList = "";
    this.vidDefer = null;
    this.getting = false;

    var self = this;
    this.isGetting = function () {
        return getting;
    };

    this.reset = function () {
        $log.log('reset');
        prevTitle = "";
        lastToken = "";
        pageToken = "";
        videos = [];
        lastIndex = 0;
        nextCount = 0;
        vidList = "";
    };

    this.get = function () {
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
        Gapi.request(req).then(function (response) {
            $log.log('received', response);

            vidList = "";
            for (var i = 0; i < response.items.length; i++) {
                vidList = vidList + response.items[i].snippet.resourceId.videoId + ",";
            }

            var statsReq = angular.copy(statsParams);
            statsReq.params.id = vidList;
            return Gapi.request(statsReq).then(function (statsResponse) {

                // Use moment.js?
                for (var i = 0; i < statsResponse.items.length; i++) {
                    // try to use one regex: PT(\d*)H?(\d*)M?(\d*)S
                    reg0 = /PT(\d+)H(\d+)M(\d+)S/;
                    reg1 = /PT(\d+)M(\d+)S/;
                    reg2 = /PT(\d+)M/;
                    reg3 = /PT(\d+)S/;
                    dur = statsResponse.items[i].contentDetails.duration;
                    if (reg0.test(dur)) {
                        dur = dur.replace(reg0, function (m, a, b, c) { return (a.length < 2 ? "0" : "") + a + ":" + (b.length < 2 ? "0" : "") + b + ":" + (c.length < 2 ? "0" : "") + c; });
                    } else if (reg1.test(dur)) {
                        dur = dur.replace(reg1, function (m, a, b) { return (a.length < 2 ? "0" : "") + a + ":" + (b.length < 2 ? "0" : "") + b; });
                    } else if (reg2.test(dur)) {
                        dur = dur.replace(reg2, function (m, a) { return (a.length < 2 ? "0" : "") + a + ":00"; });
                    } else if (reg3.test(dur)) {
                        dur = dur.replace(reg3, function (m, a) { return "00:" + (a.length < 2 ? "0" : "") + a; });
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
    };
    this.next = function () {
        return pageToken;
    };
    this.lastIndex = function () {
        return lastIndex;
    };
    this.returnOrder = function () {
        return order;
    };
});

// constants

angular.module('constants', [])
.constant('velocityEasing', { duration: 400, easing: [0, 0, 0.355, 1.000] })
.constant('menuEntries', ['home', 'about', 'schedule', 'media', 'press', 'contact'])
.constant('fronts', ['./images/front0.jpg', './images/front1.jpg', './images/front2.jpg', './images/front3.jpg', './images/front4.jpg'])
.constant('mediaPaths', ['music', 'videos', 'pictures'])
.constant('mediaIcons', ['music', 'youtube-play', 'camera'])

// filters

angular.module('filters', [])
.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
})

// root module

angular.module('root', [
    'ngRoute',
    'ngSanitize',
    'vloader',
    'services.getGoogleCalendar',
    'services.calendarWidget',
    'youtube', 'JSONresources',
    'mp',
    'services.parseEventTime',
    'constants',
    'filters',
    'rootServices'
]).value('$anchorScroll', angular.noop);

// root services

angular.module('rootServices', ['constants'])
.service('ytInit', ['$location', 'velocityEasing', function ($location, velocityEasing) {
    if ($location.search().video) {
        $('#player').velocity("fadeIn", velocityEasing);
    }
}]).service('deferrer', ['$rootScope', '$q', function ($rootScope, $q) {
    this.scope = $rootScope;
    this.q = $q;
    this.loaded = this.q.defer();
    this.ready = this.loaded.promise;
}]).service('scrollFn', [function () {
    var self = this;
    this.prev = 0;
    this.fn = function (top) {
        if (typeof (top) === 'undefined') {
            top = 0;
        }
        $('html').velocity("scroll", {
            offset: top,
            mobileHA: false,
            duration: 200,
            easing: 'easeOutCubic'
        });
    }
    this.restore = function () {
        self.fn(Math.min(445, self.prev));
    }
    this.save = function () {
        self.prev = $(window).scrollTop();
    }
}]).service('toggleYT', ['ytPlayer', '$log', function (ytPlayer, $log) {
    this.hide = function () {
        if ($('#front').hasClass('under')) {
            $('#front').removeClass('under').addClass('over').velocity("fadeIn", {
                duration: 400,
                easing: [0, 0, 0.355, 1.000]
            });
        }
        if (angular.isDefined(ytPlayer.player)) {
            ytPlayer.player.pauseVideo();
        }
    };
    this.show = function () {
        if ($('#front').hasClass('over')) {
            $.Velocity.animate($('#front'), 'fadeOut', {
                duration: 400,
                easing: [0, 0, 0.355, 1.000]
            }).then(function (elements) {
                $(elements).removeClass('over').addClass('under');
            });
        }
    };
}]);

angular.module('rootDirectives', []).directive('scrollUp', ['scrollFn', function (scrollFn) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on("click", function () { scrollFn.fn(); });
        }
    }
    // CHECK THE INFINITE SCROLLS WORK
}]).directive('infinite', ['$window', 'getVideos', function ($window, getVideos) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $($window).on('scroll.infinite', function () {
                var win = $(this)[0];
                if (win.innerHeight + win.pageYOffset >= ($('#videos').outerHeight() + $('#videos').offset().top) * 0.8) {
                    if (scope.moreToLoad && !getVideos.isGetting()) {
                        scope.getVids();
                    }
                }
            });
        }
    }
}]).directive('homeInfinite', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $($window).on('scroll.infinite', function () {
                var win = $(this)[0];
                if (win.innerHeight + win.pageYOffset >= $('#blogContainer').outerHeight() * 0.8) {
                    scope.getMorePosts();
                }
            });
        }
    }
    // CHECK INFINITE SCROLLS ^
}]).directive('clickVideo', ['musicPlayer', 'getVideos', 'ytPlayer', 'toggleYT', 'scrollFn', function (musicPlayer, getVideos, ytPlayer, toggleYT, scrollFn) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on("click", function (e) {
                value = attrs.clickVideo;
                $('.items.active').removeClass('active');
                $(element).addClass('active');
                if (musicPlayer.sound && (musicPlayer.sound.playState == 1)) {
                    $('.icon-pause').trigger('click');
                }
                thePlayer = $('#player');
                toggleYT.show();
                ytPlayer.loadVideo(value);
                scrollFn.fn();
            });
        }
    }
}]).directive('imgLoad', ['deferrer', '$timeout', function (deferrer, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on("load", function (e) {
                $timeout(function () {
                    deferrer.loaded.resolve();
                    deferrer.scope.$digest();
                }, 0);
            });
        }
    }
}]).directive('bindMusic', ['$rootScope', 'musicPlayer', function ($rootScope, musicPlayer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            current = ((scope.music.url.length == 1) ? scope.music.url[0] : '');
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
                $(element).on("click", function (e) {
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
                $(element).on("click", function (e) {
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
}]).directive('seekDrag', ['musicPlayer', function (musicPlayer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('mousedown', function (event) {
                if (event.which != 1) {
                    return;
                }
                musicPlayer.isSeeking = true;
                var pos = event.offsetX;
                $('#seekBar').css('width', Math.min(pos, parseInt($('#loadBar').css('width').replace('px', ''))) + 'px');
                $(window).on('mousemove.seek', function (emove) {
                    curr = emove.offsetX;
                    end = Math.min(curr, parseInt($('#loadBar').css('width').replace('px', '')));
                    $('#seekBar').css('width', end + 'px');
                    musicPlayer.seekTime(end / 594.0);
                });
                $(window).on('mouseup.seek', function (eup) {
                    $(window).off('.seek');
                    curr = eup.offsetX;
                    end = Math.min(curr, parseInt($('#loadBar').css('width').replace('px', '')));
                    $('#seekBar').css('width', end + 'px');
                    musicPlayer.isSeeking = false;
                    musicPlayer.seekToPercent(end / 594.0);
                });
            });
        }
    }
}]).directive('volumeDrag', ['musicPlayer', function (musicPlayer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('mousedown', function (event) {
                if (event.which != 1) {
                    return;
                }
                var pos = event.offsetX;
                $('#volumeBar').css('width', Math.min(pos, parseInt($('#volumeLoad').css('width').replace('px', ''))) + 'px');
                $(window).on('mousemove.seek', function (emove) {
                    curr = emove.offsetX;
                    end = Math.min(curr, parseInt($('#volumeLoad').css('width').replace('px', '')));
                    $('#volumeBar').css('width', end + 'px');
                    musicPlayer.sound.setVolume(100 * end / 144);
                });
                $(window).on('mouseup.seek', function (eup) {
                    $(window).off('.seek');
                    curr = eup.offsetX;
                    end = Math.min(curr, parseInt($('#volumeLoad').css('width').replace('px', '')));
                    $('#volumeBar').css('width', end + 'px');
                    musicPlayer.setVolume(end / 144);
                });
                $(element).on('dblclick', function (event) {
                    at = 0.75 * 144;
                    $('#volumeBar').css('width', at + 'px');
                    musicPlayer.setVolume(0.75);
                });
            });
        }
    }
}]).directive('toggleMute', ['musicPlayer', function (musicPlayer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var muted = false;
            $(element).on('click', function (event) {
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
}]).directive('bindMovement', ['musicPlayer', function (musicPlayer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
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
            $(element).on('click', function () {
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
}]).directive('triggerClick', ['musicPlayer', function (musicPlayer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('click', function () {
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
}]).directive('logoClick', ['$rootScope', '$location', function ($rootScope, $location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('click', function () {
                $rootScope.$apply($location.path('home'));
            });
        }
    }
}]).directive('toggleChildren', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('click', function () {
                $(this).children().animate({
                    opacity: 'toggle',
                    height: 'toggle'
                }, 200);
            });
        }
    }
}]).directive('toggleSiblings', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('click', function () {
                $(this).siblings().animate({
                    opacity: 'toggle',
                    height: 'toggle'
                }, 200);
            });
        }
    }
}]).directive('fadeHeader', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var img = new Image();
            img.onload = function () {
                $(element).prepend(img);
                $.Velocity($('#header'), {
                    opacity: 1.0
                }, {
                    duration: 400, easing: [0, 0, 0.355, 1.000]
                });
            }
            img.src = "./images/header.svg";
        }
    }
}).directive('fadeBody', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            $(window).on('load', function (event) {
                $.Velocity($('body'), {
                    opacity: 1.0
                }, {
                    duration: 400, easing: [0, 0, 0.355, 1.000]
                });
            });
        }
    }
}).directive('fadeFront', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            $('.fadeBuffer.show').css('opacity', 0)
                .prop('src', $scope.front)
                .one('load', function (event) {
                    $scope.isFading = true;
                    $.Velocity.animate(event.target, {
                        opacity: 1.0
                    }, {
                        duration: 400, easing: [0, 0, 0.355, 1.000]
                    }).then(function (elements) {
                        $(elements[0]).css('opacity', '').css('z-index', 14);
                        $scope.isFading = false;
                    });
                });
            $scope.$watch('front', function (newValue, oldValue) {
                var active = $('.fadeBuffer.show'),
                    inactive = $('.fadeBuffer.hide');
                if (newValue === oldValue) {
                    return;
                }
                if ($scope.isFading) {
                    return;
                }

                inactive.prop('src', newValue);
                inactive.one('load', function () {
                    $scope.isFading = true;
                    inactive.addClass('show').removeClass('hide');
                    $.Velocity.animate(active, {
                        opacity: 0.0
                    }, {
                        duration: 400,
                        easing: [0, 0, 0.355, 1.000]
                    }).then(function (elements) {
                        inactive.css('z-index', 14);
                        active.css('z-index', 13).css('opacity', '')
                            .addClass('hide').removeClass('show')
                            .prop('src', '');
                        $scope.isFading = false;
                    });
                });
            });
        }
    }

}).directive('clickNav', ['$rootScope', '$log', '$location', function ($rootScope, $log, $location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                if (('/' + attrs.clickNav) == $location.path()) {
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
                    $rootScope.fadePromise = $.Velocity.animate(
                        document.getElementById('contentContainer'),
                        { opacity: 0.0 },
                        {
                            duration: 400,
                            easing: [0, 0, 0.355, 1.000],
                            complete: function (elements) {
                                $rootScope.$apply($location.path(attrs.clickNav));
                            }
                        }
                    );
                }

            });
        }
    }
}]).directive('mediaNav', ['$rootScope', '$log', '$location', function ($rootScope, $log, $location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                if (('/' + attrs.mediaNav) == $location.path()) {
                    return;
                }
                if ($(element).parent().hasClass('animate-show')) {
                    angular.element('#mainMenu .active').removeClass('active');
                    angular.element('#mediaMenu .active').removeClass('active');
                    angular.element(element).addClass('active');
                    $('#content').addClass('animate-hide').removeClass('animate-show').bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd", function (event) {
                        $(event.currentTarget).unbind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd");
                        $rootScope.$apply($location.path(attrs.mediaNav));
                    });
                }
                $rootScope.fadePromise = $.Velocity.animate(
                        document.getElementById('contentContainer'),
                        { opacity: 0.0 },
                        {
                            duration: 400,
                            easing: [0, 0, 0.355, 1.000],
                            complete: function (elements) {
                                $rootScope.$apply($location.path(attrs.mediaNav));
                            }
                        }
                    );
            });
        }
    }
}]);

angular.module('rootControllers', []).controller('videoLister', ['$rootScope', '$scope', '$log', '$window', 'getVideos', '$timeout', 'ytPlayer', 'toggleYT', 'list', function ($rootScope, $scope, $log, $window, getVideos, $timeout, ytPlayer, toggleYT, list) {
    $scope.videos = [];
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
    $scope.getVids = function () {
        $scope.$apply(getVideos.get().then(function (result) {
            $scope.videos = result;
            $scope.moreToLoad = (getVideos.next()) ? '...' : false;
        }));
    };
    $rootScope.getVids = $scope.getVids;
    $scope.getPublished = function (date) {
        return date.substr(0, 10);
    };
}]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when("/home", {
        templateUrl: "home.php",
        controller: "homeCtrl",
        reloadOnSearch: false,
        resolve: {
            list: function ($q, $log, homeResource, fbResource) {
                var deferred = $q.defer();
                var master;
                var cb = function (result) {
                    for (var key in result) {
                        var obj = result[key];
                        if (obj.Blurb) {
                            obj.Blurb = obj.Blurb.replace(/\\/g, '');
                        }
                        if (obj.Posted) {
                            obj.Posted = new Date(obj.Posted.replace(' ', 'T') + 'Z');
                        }
                    }
                    master = result;
                    fbResource.query({}, fcb);
                };
                var fcb = function (result) {
                    for (var key in result) {
                        var obj = result[key];
                        isYT = false;
                        if (obj.message) {
                            obj.Blurb = obj.message.replace(/\\/g, '');
                            //console.log(obj.Blurb);
                            obj.Blurb = obj.Blurb.replace(/(((https?:\/\/)|(www))[\.\w\/?=\+%#-A-Za-z0-9]*)/g, '<a href="' + '$1' + '" target="_blank">' + '$1' + '</a>');
                            if (obj.Blurb.indexOf("www.youtube.com") != -1 || obj.Blurb.indexOf("youtu.be") != -1) {
                                isYT = true;
                                url = obj.link.substr(obj.link.indexOf("v=") + 2, 11);
                                obj.Blurb = obj.Blurb + '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + url + '?origin=http://seanchenpiano.com" frameborder="0" allowfullscreen></iframe>';
                            }
                        }
                        if (obj.created_time) {
                            obj.Posted = new Date(obj.created_time.substr(0, obj.created_time.length - 2) + ':' + obj.created_time.substr(obj.created_time.length - 2, 2));
                        }
                        obj.Title = 'Posted to <a href="http://www.facebook.com/seanchenpiano" target="_blank">Facebook Page</a>';
                        if (obj.picture) {
                            obj.picture = obj.picture.replace(/\\/g, '');
                            obj.picture = obj.picture.replace('s.jpg', 'o.jpg');
                            if (isYT) {
                                obj.picture = "";
                            }
                        }
                        if (obj.story) {
                            if (obj.link) {
                                if (obj.story.indexOf("event") != -1) {
                                    obj.story = obj.story.replace('event', '<a href="' + obj.link + '" target="_blank">event</a>');
                                } else {
                                    obj.story = '<a href="https://www.facebook.com/seanchenpiano/posts/' + obj.id.substr(obj.id.indexOf('_') + 1, obj.id.length) + '" target="_blank">' + obj.story + '</a>';
                                }
                            }
                        }
                    }
                    master = master.concat(result);
                    deferred.resolve(master);
                };
                homeResource.query({ q: '', n: '8' }, cb);
                return deferred.promise;
            }
        }
    }).when("/about", {
        templateUrl: "about.php",
        controller: "aboutCtrl",
        resolve: {
            list: function ($q, $log, musicResource, discResource) {
                var concertoD = $q.defer(),
					soloD = $q.defer(),
					chamberD = $q.defer(),
					composingD = $q.defer(),
					arrangingD = $q.defer(),
					videogameD = $q.defer(),
					discD = $q.defer();

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
                var discCb = function (result) {
                    //console.log(result);
                    discD.resolve(result);
                };

                musicResource.query({ q: 'c' }, concertoCb);
                musicResource.query({ q: 's' }, soloCb);
                musicResource.query({ q: 'h' }, chamberCb);
                musicResource.query({ q: 'o' }, composingCb);
                musicResource.query({ q: 'a' }, arrangingCb);
                musicResource.query({ q: 'v' }, videogameCb);
                discResource.query({ q: '' }, discCb);
                return $q.all([concertoD.promise, soloD.promise, chamberD.promise, composingD.promise, arrangingD.promise, videogameD.promise, discD.promise]);
            }
        },
        reloadOnSearch: false
    }).when("/schedule", {
        templateUrl: "schedule.php",
        controller: "scheduleCtrl",
        resolve: {
            list: function ($q, $log, getGoogleCalendar) {
                return getGoogleCalendar.get();
            }
        },
        reloadOnSearch: false
    }).when("/music", {
        templateUrl: "music.php",
        controller: "musicCtrl",
        resolve: {
            list: function ($q, $log, musicResource, musicPlayer) {
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

                musicResource.query({ q: 'c', r: 'm' }, concertoCb);
                musicResource.query({ q: 's', r: 'm' }, soloCb);
                musicResource.query({ q: 'h', r: 'm' }, chamberCb);
                musicResource.query({ q: 'o', r: 'm' }, composingCb);
                musicResource.query({ q: 'a', r: 'm' }, arrangingCb);
                musicResource.query({ q: 'v', r: 'm' }, videogameCb);
                return $q.all([concertoD.promise, soloD.promise, chamberD.promise, composingD.promise, arrangingD.promise, videogameD.promise]);
            }
        },
        reloadOnSearch: false
    }).when("/videos", {
        templateUrl: "videos.php", controller: "videoLister",
        resolve: {
            list: function ($q, $route, $timeout, getVideos) {
                getVideos.reset();
                return getVideos.get();
            }
        },
        reloadOnSearch: false
    }).when("/pictures", {
        templateUrl: "pictures.php", controller: "picturesCtrl",
        resolve: {
            list: function ($q, $log, picturesResource) {
                var deferred = $q.defer();

                var pictureCb = function (result) {
                    deferred.resolve(result);
                }

                picturesResource.query({}, pictureCb);

                return deferred.promise;
            }
        },
        reloadOnSearch: false
    }).when("/press", {
        templateUrl: "press.php",
        controller: "pressCtrl",
        resolve: {
            list: function ($q, pressResource) {
                var deferred = $q.defer();
                var cb = function (result) {
                    for (var key in result) {
                        var obj = result[key];
                        if (obj.quote) {
                            obj.quote = obj.quote.replace(/\\/g, "");
                        }
                    }
                    deferred.resolve(result);
                }

                pressResource.query({ q: '' }, cb);
                return deferred.promise;
            }
        },
        reloadOnSearch: false
    }).when("/contact", {
        templateUrl: "contact.php",
        controller: "contactCtrl",
        reloadOnSearch: false
    }).otherwise({
        templateUrl: "home.php",
        controller: "homeCtrl",
        reloadOnSearch: false,
        resolve: {
            list: function ($q, $log, homeResource, fbResource) {
                var deferred = $q.defer();
                var master;
                var cb = function (result) {
                    for (var key in result) {
                        var obj = result[key];
                        if (obj.Blurb) {
                            obj.Blurb = obj.Blurb.replace(/\\/g, '');
                        }
                        if (obj.Posted) {
                            obj.Posted = new Date(obj.Posted.replace(' ', 'T') + 'Z');
                        }
                    }
                    master = result;
                    fbResource.query({}, fcb);
                };
                var fcb = function (result) {
                    for (var key in result) {
                        var obj = result[key];
                        isYT = false;
                        if (obj.message) {
                            obj.Blurb = obj.message.replace(/\\/g, '');
                            //console.log(obj.Blurb);
                            obj.Blurb = obj.Blurb.replace(/(((https?:\/\/)|(www))[\.\w\/?=\+%#-A-Za-z0-9]*)/g, '<a href="' + '$1' + '" target="_blank">' + '$1' + '</a>');
                            if (obj.Blurb.indexOf("www.youtube.com") != -1 || obj.Blurb.indexOf("youtu.be") != -1) {
                                isYT = true;
                                url = obj.link.substr(obj.link.indexOf("v=") + 2, 11);
                                obj.Blurb = obj.Blurb + '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + url + '?origin=http://seanchenpiano.com" frameborder="0" allowfullscreen></iframe>';
                            }
                        }
                        if (obj.created_time) {
                            obj.Posted = new Date(obj.created_time.substr(0, obj.created_time.length - 2) + ':' + obj.created_time.substr(obj.created_time.length - 2, 2));
                        }
                        obj.Title = 'Posted to <a href="http://www.facebook.com/seanchenpiano" target="_blank">Facebook Page</a>';
                        if (obj.picture) {
                            obj.picture = obj.picture.replace(/\\/g, '');
                            obj.picture = obj.picture.replace('s.jpg', 'o.jpg');
                            if (isYT) {
                                obj.picture = "";
                            }
                        }
                        if (obj.story) {
                            if (obj.link) {
                                if (obj.story.indexOf("event") != -1) {
                                    obj.story = obj.story.replace('event', '<a href="' + obj.link + '" target="_blank">event</a>');
                                } else {
                                    obj.story = '<a href="https://www.facebook.com/seanchenpiano/posts/' + obj.id.substr(obj.id.indexOf('_') + 1, obj.id.length) + '" target="_blank">' + obj.story + '</a>';
                                }
                            }
                        }
                    }
                    master = master.concat(result);
                    deferred.resolve(master);
                };
                homeResource.query({ q: '', n: '8' }, cb);
                return deferred.promise;
            }
        }
    });
}]).controller('navigation', ['$scope', '$log', 'menuEntries', function ($scope, $log, menuEntries) {
    $scope.navs = menuEntries;
}]).controller('mediaNav', ['$scope', '$log', 'mediaIcons', 'mediaPaths', function ($scope, $log, mediaIcons, mediaPaths) {
    $scope.mediaIcons = mediaIcons;
    $scope.mediaPaths = mediaPaths;
}]).controller('homeCtrl', ['$scope', 'homeResource', 'list', '$q', function ($scope, homeResource, list, $q) {
    var def = $q.defer();
    var countCb = function (result) {
        //console.log('resolving');
        def.resolve(result[0]['COUNT(*)']);
    };
    $scope.postCount = homeResource.query({ q: 'c' }, countCb);
    $scope.page = 0;
    $scope.number = 8;
    $scope.timeString = function (time) {
        return moment(time).format("dddd, MMMM D, YYYY, HH:MM");
    }
    $scope.link2fb = function (entry) {
        if (!entry.created_time) return;
        return 'https://www.facebook.com/seanchenpiano/posts/' + entry.id.substr(entry.id.indexOf('_') + 1, entry.id.length);
    }
    $scope.likecomments = function (entry) {
        if (!entry.created_time) return;
        c = (entry.comments) ? entry.comments.data : 'undefined';
        l = (entry.likes) ? entry.likes.data : 'undefined';
        return ((entry.likes || entry.comments) ? ' - ' : ' - go to facebook post') + ((entry.likes) ? (l.length + ' like' + ((l.length > 1) ? 's' : '')) : '') + ((entry.likes && entry.comments) ? ' and ' : '') + ((entry.comments) ? (c.length + ' comment' + ((c.length > 1) ? 's' : '')) : '');
    }
    $scope.blog = list;
    $('#mainMenu .nav[click-nav*="home"]').addClass('active');
    $scope.isGetting = false;

    $scope.getMorePosts = function () {
        if ($scope.isGetting) {
            return;
        }
        $scope.page++;
        if ($scope.page * $scope.number > $scope.postCount) {
            return;
        }
        var cb = function (result) {
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
        $scope.$apply(function () { homeResource.query({ s: start, n: $scope.number }, cb) });
    }

}]).controller('aboutCtrl', ['$scope', 'list', function ($scope, list) {
    $('#mainMenu .nav[click-nav*="about"]').addClass('active');
    $scope.dir = ['right', 'right', 'right'];
    $scope.repList = [{}, {}, {}, {}, {}, {}];
    for (var i = 0; i < 6; i++) {
        $scope.repList[i].list = list[i];
    }

    $scope.disc = list[6];
    $scope.repList[0].label = 'Concerto Repertoire';
    $scope.repList[1].label = 'Solo Repertoire';
    $scope.repList[2].label = 'Chamber Repertoire';
    $scope.repList[3].label = 'Compositions';
    $scope.repList[4].label = 'Arrangements';
    $scope.repList[5].label = 'Videogame';

    $scope.prevComp = '';

    $scope.showComp = function (entry) {
        if (entry == $scope.prevComp || entry == 'Sean Chen') {
            return '';
        }
        $scope.prevComp = entry;
        return entry;
    };

    $scope.hasLink = function (entry) {
        if (entry != "") {
            return true;
        } else {
            return false;
        }
    };

    $scope.fileOrList = function (entry, i) {
        if (entry.pdflist.length != 0) {
            return entry.pdflist[i];
        }
        return '';
    }

}]).controller('musicCtrl', ['$scope', '$q', '$log', 'toggleYT', 'list', '$window', 'musicPlayer', function ($scope, $q, $log, toggleYT, list, $window, scrollFn, musicPlayer) {
    angular.element('#mediaMenu').removeClass('animate-hide').addClass('animate-show');
    $('#mediaMenu .nav[media-nav*="music"]').addClass('active');
    $scope.list = {}
    $scope.list.concerti = list[0];
    $scope.list.soli = list[1];
    $scope.list.chamber = list[2];
    $scope.list.composition = list[3];
    $scope.list.arrangement = list[4];
    $scope.list.vg = list[5];
    $scope.predicate = { concerto: 'year', solo: 'year', chamber: 'year', composition: 'year', arrangement: 'year', vg: 'year' };
    $scope.reverse = { concerto: 'true', solo: 'true', chamber: 'true', composition: 'true', arrangement: 'true', vg: 'true' };
    $scope.last = { concerto: 'year', solo: 'year', chamber: 'year', composition: 'year', arrangement: 'year', vg: 'year' };
    $scope.sort = function (type, pred) {
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
    $scope.isSelected = function (type, pred) {
        return $scope.predicate[type] === pred;
    };
    $scope.sortIcon = function (type, pred) {
        if ($scope.predicate[type] === pred) {
            if ($scope.reverse[type]) {
                return 'icon-down-dir';
            } else {
                return 'icon-up-dir';
            }
        }
        return '';
    };

    $scope.fileOrList = function (entry, i) {
        if (entry.pdflist.length != 0) {
            return entry.pdflist[i];
        }
        return '';
    }

}]).directive('initFancybox', ['$log', function ($log) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $('.fancybox').fancybox({
                openEffect: 'elastic',
                prevEffect: 'fade',
                nextEffect: 'fade',
                helpers: {
                    title: {
                        type: 'outside'
                    },
                    thumbs: {
                        width: 75,
                        height: 75
                    },
                    overlay: {
                        css: {
                            'background': 'rgba(0, 0, 0, 0.85)'
                        }
                    }
                }
            });
        }
    }
}]).directive('noBubble', ['$log', function ($log) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('click', function (e) {
                e.preventDefault();
            })
        }
    }
}]).controller('picturesCtrl', ['$scope', 'list', 'toggleYT', '$window', function ($scope, list, toggleYT, $window) {
    angular.element('#mediaMenu').removeClass('animate-hide').addClass('animate-show');
    $('#mediaMenu .nav[media-nav*="pictures"]').addClass('active');
    $scope.pictures = list;
}]).controller('scheduleCtrl', ['$scope', 'list', '$window', 'parseEventTime', function ($scope, list, $window, parseEventTime) {
    $('#mainMenu .nav[click-nav*="schedule"]').addClass('active');
    $scope.list = list;
    $scope.parseTime = parseEventTime.string;
    $scope.describeEvent = function (event) {
        if (typeof (event.description) === 'undefined') {
            return event.summary;
        } else {
            temp = event.description;
            n = temp.indexOf('site: ');
            if (n != -1) {
                temp = temp.substr(0, n - 2);
            }
            return temp;
        }
    };
    $scope.getLink = function (event) {
        if (typeof (event.description) === 'undefined') {
            return false;
        } else {
            temp = event.description;
            n = temp.indexOf('site: ');
            if (n != -1) {
                url = temp.substr(n + 6);
                return url;
            }
            return false;
        }

    }

}]).controller('contactCtrl', ['$scope', 'getVideos', 'toggleYT', '$window', function ($scope, getVideos, toggleYT, $window) {
    $('#mainMenu .nav[click-nav*="contact"]').addClass('active');
}]).controller('pressCtrl', ['$scope', 'getVideos', 'list', '$window', function ($scope, getVideos, list, $window) {
    $('#mainMenu .nav[click-nav*="press"]').addClass('active');
    $scope.pquotes = list;

    $scope.process = function (thing) {
        return thing.replace(/\\/g, '');
    };

}]).controller('mainFooter', ['$scope', '$rootScope', 'musicPlayer', function ($scope, $rootScope, musicPlayer) {
    $scope.icon = 'pause';
    $scope.updateIcon = function (i) {
        $scope.$apply(function () {
            $scope.icon = i;
        });
    }
    $scope.updatePiece = function () {
        $scope.$apply(function () {
            $scope.piece = musicPlayer.display();
            $scope.time = musicPlayer.timeDisplay();
        });
    }
    $scope.seekTime = function (t) {
        $scope.$apply(function () {
            $scope.time = t;
        });
    }
    $rootScope.seekTime = $scope.seekTime;
    $rootScope.updateIcon = $scope.updateIcon;
    $rootScope.updatePiece = $scope.updatePiece;
}]).controller('twitterCtrl', ['$scope', '$q', 'twitterResource', function ($scope, $q, twitterResource) {
    var def = $q.defer();
    var theResults = [];
    var temp1, temp2;
    var cb1 = function (result) {
        temp1 = angular.copy(result);
        twitterResource.query({ q: 'm', c: '10' }, cb2);
    }

    var cb2 = function (result) {
        temp2 = angular.copy(result);
        theResults = temp1.concat(temp2);
        for (var key in theResults) {
            obj = theResults[key];
            if (obj.created_at) {
                obj.created_at = new Date(obj.created_at.replace(/(\S+) (\+\S+) (.*)/, '$3 $1'));
            }
            obj.text = obj.text.replace(/&gt;/g, ">");
            obj.text = obj.text.replace(/&lt;/g, "<");
            obj.text = obj.text.replace(/&amp;/g, "&");
        }
        def.resolve(theResults);
    }
    twitterResource.query({ q: 'u', c: '5' }, cb1);
    def.promise.then(function (result) { $scope.tweets = result; })

}]).controller('rootCtrl', ['$scope', '$rootScope', '$timeout', 'scrollFn', 'toggleYT', 'fronts', 'pressResource', '$route', '$q', function ($scope, $rootScope, $timeout, scrollFn, toggleYT, fronts, pressResource, $route, $q) {
    var def = $q.defer();
    $('#mainRow').css('min-height', ($(window).innerHeight() - 95) + 'px');
    var start = true;
    var prevVid = false;
    $scope.frontNum = 4;
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        scrollFn.save();
        $(window).unbind('.infinite');
        if (!start) {
            newNum = 0;
            do {
                newNum = Math.floor(Math.random() * 5);
            } while ($scope.frontNum == newNum);
            $scope.frontNum = newNum;
            $scope.front = fronts[$scope.frontNum];

            $.Velocity.animate($('.quote'), "fadeOut", {
                duration: 400, easing: [0, 0, 0.355, 1.000]
            }).then(function () {
                $scope.theIndex = ($scope.theIndex + 1) % $scope.quotes.length;
                $scope.quoteIndex = $scope.indices[$scope.theIndex];
                switch ($scope.frontNum) {
                    case 0:
                        $('.quote').removeAttr('style').css({ top: '20px', left: '50px' });
                        break;
                    case 1:
                        $('.quote').removeAttr('style').css({ bottom: '20px', left: '50px' });
                        break;
                    case 2:
                        $('.quote').removeAttr('style').css({ bottom: '20px', right: '20px', 'text-align': 'right' });
                        break;
                    case 3:
                        $('.quote').removeAttr('style').css({ top: '20px', left: '50px' });
                        break;
                    case 4:
                        $('.quote').removeAttr('style').css({ bottom: '20px', left: '50px' });
                        break;
                    default:
                        break;
                }
                def.promise.then(function () {
                    if (next.$$route.templateUrl != "press.php")
                        $('.quote').velocity("fadeIn", {
                            duration: 400, easing: [0, 0, 0.355, 1.000]
                        });
                })
            });
        }
        if (typeof next.$$route != 'undefined' && next.$$route.templateUrl == "videos.php") {
            prevVid = true;
        } else {
            if (!prevVid) {
                return;
            }
            prevVid = false;
            toggleYT.hide();
        }
    });

    $scope.indices = null;

    var genericCb = function (result) {
        for (var key in result) {
            var obj = result[key];
            if (obj['short']) {
                obj['short'] = obj['short'].replace(/\\/g, '');
            }
        }

        $scope.indices = new Array();

        for (i = 0; i < result.length; i++) {
            $scope.indices.push(i);
        }

        for (i = $scope.indices.length - 1; i > 0; i--) {
            randomIndex = Math.floor(Math.random() * (i + 1));
            temp = $scope.indices[i];
            $scope.indices[i] = $scope.indices[randomIndex];
            $scope.indices[randomIndex] = temp;
        }

        $scope.theIndex = 0;
        $scope.quoteIndex = $scope.indices[$scope.theIndex];
        return result;
    };


    $scope.quotes = pressResource.query({ q: 's' }, genericCb);
    $scope.quoteIndex = 0;
    $('.quote').removeAttr('style').css({ top: '20px', left: '50px' });
    $scope.front = fronts[4];
    $('#theFront').one('load', function () {
        $(this).removeClass('animate-hide').addClass('animate-show');
    });


    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
        nextTemp = next.loadedTemplateUrl;
        if (nextTemp == "about.php") {
            $('title').text('Sean Chen - About');
        } else if (nextTemp == "schedule.php") {
            $('title').text('Sean Chen - Schedule');
        } else if (nextTemp == "press.php") {
            $('title').text('Sean Chen - Press');
        } else if (nextTemp == "home.php") {
            $('title').text('Sean Chen - Pianist');
        } else if (nextTemp == "music.php") {
            $('title').text('Sean Chen - Listen');
        } else if (nextTemp == "videos.php") {
            $('title').text('Sean Chen - Watch');
        } else if (nextTemp == "pictures.php") {
            $('title').text('Sean Chen - Pictures');
        } else if (nextTemp == "contact.php") {
            $('title').text('Sean Chen - Contact');
        }
        if (typeof $rootScope.fadePromise === 'undefined') {
            $timeout(function () {
                $('#contentContainer').velocity({ opacity: 1.0 }, {
                    duration: 500,
                    easing: [0, 0, 0.355, 1.000]
                })
            }, 0);
        } else {
            $rootScope.fadePromise.then(function (elements) {
                $('#contentContainer').velocity({ opacity: 1.0 }, {
                    duration: 500,
                    easing: [0, 0, 0.355, 1.000]
                });
            });
        }

        def.resolve();
        if (start) {
            start = false;
            $('.quote').velocity("fadeIn", {
                duration: 400, easing: [0, 0, 0.355, 1.000]
            });
        }
        scrollFn.restore();
    });
}])
.controller('calendar', ['$scope', '$location', '$timeout', 'days', 'calendarWidget', 'getGoogleCalendar', 'scrollFn', function ($scope, $location, $timeout, days, calendarWidget, getGoogleCalendar, scrollFn) {
    var date = new Date();
    var scrollItem = '';
    $scope.showCalendar = 'list';
    $scope.$on('$routeChangeStart', function () {
        if ($location.path() == '/schedule') {
            $scope.showCalendar = 'full';
            $scope.initCal();
        } else if ($location.path() == '/videos') {

        } else {
            $scope.showCalendar = 'list';
        }
    });
    $scope.$on('$routeChangeSuccess', function () {
        $timeout(function () {
            if (scrollItem != '') {
                scrollFn.fn($('.schedule li[scroll-date*="' + scrollItem + '"]').offset().top - 120);
            }
            scrollItem = '';
        }, 0);
    });
    getGoogleCalendar.get().then(function (result) {
        $scope.masterCalendar = result;
        $scope.listCalendar = [];
        for (var i = 0; i < 3; i++) {
            $scope.listCalendar[i] = angular.copy($scope.masterCalendar.upcoming[i]);
            mysplit = $scope.listCalendar[i].location.split(",");
            $scope.listCalendar[i].location = mysplit[0] + ", " + mysplit[mysplit.length - 2] + ", " + mysplit[mysplit.length - 1];
        }

        $scope.dateList = getGoogleCalendar.getDateList();
        $scope.highlight();
    });

    $scope.goToSched = function (where) {
        $('#mainMenu li[click-nav*="schedule"]').trigger('click');
        scrollItem = where;
    }

    $scope.stringify = function (day) {
        return moment(day.y + "-" + day.m + "-" + day.d, "YYYY-M-D").format("YYYY-MM-DD");
    }
    $scope.highlight = function () {
        $timeout(function () {
            $('#calendar td').removeClass('hasEvent isToday prevMonth nextMonth');
            for (var i = 0; i < $scope.dateList.iso.length; i++) {
                $('#calendar td[date-iso*=' + $scope.dateList['iso'][i] + ']').not('.otherMonth').addClass('hasEvent').attr('string', $scope.dateList['long'][i]).on('click', function (event) {
                    scrollFn.fn($('.schedule li[scroll-date*="' + $(event.currentTarget).attr('string') + '"]').offset().top - 120);
                });
                $('#calendar td[date-iso*=' + moment().format("YYYY-MM-DD") + ']').addClass('isToday');
                $('#calendar td:not([date-iso*=' + calendarWidget.current.format("YYYY-MM-") + '])').not('.calHeader').addClass('otherMonth');
            }
        }, 0);
    };

    $scope.initCal = function () {
        $scope.days = days;
        $scope.month = calendarWidget.month();
        $scope.year = calendarWidget.year();
        $scope.cal = calendarWidget.populate();
        if (typeof ($scope.dateList) !== 'undefined') {
            $scope.highlight();
        }
    }

    $scope.prevMonth = function () {
        calendarWidget.prevMonth();
        $scope.month = calendarWidget.month();
        $scope.year = calendarWidget.year();
        $scope.cal = calendarWidget.populate();
        $scope.highlight();
    }

    $scope.nextMonth = function () {
        calendarWidget.nextMonth();
        $scope.month = calendarWidget.month();
        $scope.year = calendarWidget.year();
        $scope.cal = calendarWidget.populate();
        $scope.highlight();
    }

    $scope.initCal();
}]);

angular.module('JSONresources', ['ngResource']).
factory('musicResource', function ($resource) {
    return $resource('musicJSON.php', {}, {
        query: { method: 'GET', params: { q: '' }, isArray: true }
    });
}).factory('picturesResource', function ($resource) {
    return $resource('picturesJSON.php', {}, {
        query: { method: 'GET', params: {}, isArray: true }
    });
}).factory('twitterResource', function ($resource) {
    return $resource('twitter.php', {}, {
        query: { method: 'GET', params: {}, isArray: true }
    });
}).factory('pressResource', function ($resource) {
    return $resource('pressJSON.php', {}, {
        query: { method: 'GET', params: {}, isArray: true }
    });
}).factory('homeResource', function ($resource) {
    return $resource('homeJSON.php', {}, {
        query: { method: 'GET', params: {}, isArray: true }
    });
}).factory('fbResource', function ($resource) {
    return $resource('fbjson.php', {}, {
        query: { method: 'GET', params: {}, isArray: true }
    });
}).factory('discResource', function ($resource) {
    return $resource('discJSON.php', {}, {
        query: { method: 'GET', params: {}, isArray: true }
    });
});