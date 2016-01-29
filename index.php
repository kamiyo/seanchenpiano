<?php 
$uri = $_SERVER['REQUEST_URI'];
$title = "";
$description = "";
$url = "http://seanchenpiano.com$uri";
if ($uri == "/about") {
	$title = "About pianist Sean Chen";
	$description = "Read Sean's Bio and explore his discography, repertoire, and compositions.";
} else {
	$title = "Sean Chen - Pianist";
	if ($uri == "/music") {
		$description = "Audio clips";
	} else if ($uri == "/videos") {
		$description = "YouTube clips";
	} else if ($uri == "/pictures") {
		$description = "Photos";
	} else if ($uri == "/schedule") {
		$description = "Concert schedule";
	} else if ($uri == "/contact") {
		$description = "Contact info";
	} else if ($uri == "/press") {
		$description = "Press materials";
	} else {
		$description = "Website of pianist Sean Chen";
	}
}
?>
<!DOCTYPE html>
<html>
<head>
	<base href="/">
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="./images/favicon.png">
    <base target="_blank" />
    <meta name="fragment" content="!" />
    <meta name="description" content="<?php echo $description; ?>" />
    <meta name="robots" content="index,follow" />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:type" content="musician" />
    <meta property="og:url" content="<?php echo $url; ?>" />
    <meta property="og:image" content="http://seanchenpiano.com/images/gallery/thumbs/seanchen_stone.jpg" />
    <meta property="og:site_name" content="Sean Chen Piano" />
    <link rel="stylesheet" type="text/css" href="./scripts/fontello.<?php echo time(); ?>.css">
    <link rel="stylesheet" type="text/css" href="./scripts/jquery.fancybox.<?php echo time(); ?>.css">
    <link rel="stylesheet" type="text/css" href="./scripts/jquery.fancybox-thumbs.<?php echo time(); ?>.css">
    <link rel="stylesheet" type="text/css" href="./scripts/index.<?php echo time(); ?>.css">
    <title>Sean Chen - Pianist</title>
</head>

<body class="flexbox" ng-app="root" ng-controller="rootCtrl" fade-body>
    <div id="header" fade-header>
        <div logo-click id="logoClick"></div>
        <div ng-cloak id="menu">
            <div id="subMenu">
                <ul id="mediaMenu" class="animate-hide" ng-controller="mediaNav">
                    <li class="nav" ng-repeat="medium in mediaIcons" media-nav="{{mediaPaths[$index]}}"><i class="icon-{{medium}}"></i></li>
                </ul>
                <div class="spacer"></div>
            </div>
            <ul id="mainMenu" ng-controller="navigation">
                <li class="nav" click-nav="{{nav}}" ng-repeat="nav in navs"><a no-bubble class="nothing" ng-bind="nav"></a></li>
                <li class="spacer"></li>
            </ul>
        </div>
    </div>

    <div id="front" ng-cloak class="over animate-show" fade-front>
        <div class="quote hide">&ldquo;{{quotes[quoteIndex].short}}&rdquo;<div style="text-align:right;">- {{quotes[quoteIndex].shortAuthor}}</div></div>
        <div id="overBorder"></div>
        <img class="fadeBuffer hide" />
        <img class="fadeBuffer show" />
    </div>
    <div id="main">
        <div id="playerContainer">
            <div id="player" class=""></div>
        </div>

        <div id="mainRow">
			<div id="contentContainer">
            <div id="content" ng-view>
            </div>
			</div>
            <div ng-cloak id="sidebar">
                <div id="social">
                    <ul>
                        <li><a href="https://www.facebook.com/seanchenpiano"><img src="./images/fb.svg" /></a></li>
                        <li><a href="https://twitter.com/seanchenpiano"><img src="./images/twitter.svg" /></a></li>
                        <li><a href="http://www.youtube.com/seanchenpiano"><img src="./images/yt.svg" /></a></li>
                        <li><a href="http://www.linkedin.com/in/seanchenpiano"><img src="./images/linkedin.svg" /></a></li>
                    </ul>
                </div>
                <div id="calendarSwitch" ng-controller="calendar" ng-switch on="showCalendar" ng-animate="'calAnim'">
                    <div id="calendarContainer" ng-switch-when="full">
                        <i class="icon-left-open" ng-click="prevMonth()"></i><div id="month" ng-bind="month+' '+year"></div><i class="icon-right-open" ng-click="nextMonth()"></i>
                        <table id="calendar">
                            <thead>
                                <tr>
                                    <td class="calHeader" ng-repeat="name in days" ng-bind="name"></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="week in cal">
                                    <td ng-repeat="day in week" date-iso="{{stringify(day)}}" ng-bind="day.d"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="calendarList" ng-switch-when="list">
                        <div class="heading">Upcoming Events</div>
                        <ul>
                            <li class="eventClick" ng-repeat="event in listCalendar" ng-click="goToSched(event.dateString)" >
                                <div ng-bind="event.dateString"></div>
                                <div class="leftpad" ng-bind="event.summary"></div>
                                <div class="leftpad" ng-bind="event.location"></div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div id="twitterLabel" class="heading">Twitter</div>
                <div id="twitterBox" ng-controller="twitterCtrl">
                    <ul>
                        <li ng-repeat="tweet in tweets | orderBy : 'created_at' : true" check="{{tweet.created_at}}">
                            <!--<img class="twitterImg" ng-src="{{tweet.user.profile_image_url}}" />-->
                            <span class="twitterName" ng-bind="tweet.user.name"></span> <a ng-href="http://twitter.com/{{tweet.user.screen_name}}">@{{tweet.user.screen_name}}</a>
                            <a class="twitterSN" ng-href="http://twitter.com/{{tweet.user.screen_name}}/status/{{tweet.id_str}}"><div class="tweetBody" tweet-click="tweet.id_str" ng-bind-html="tweet.text"></div></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div ng-cloak id="mainFooter" class="animate-hide hide" ng-controller="mainFooter">
        <i class="icon-{{icon}}" trigger-click></i>
        <div id="seekGroup">
            <div id="seekDrag" seek-drag></div>
            <div id="seekBar" ng-bind="piece"></div>
            <div id="loadBar" ng-bind="piece"></div>
            <div id="backLabel" ng-bind="piece"></div>
        </div>
        <div id="timeLabel" ng-bind="time"></div>
        <i class="icon-volume-up" toggle-mute></i>
        <div id="volumeGroup">
            <div id="volumeDrag" volume-drag></div>
            <div id="volumeBar"></div>
            <div id="volumeLoad"></div>
        </div>
    </div>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript">
	if (typeof jQuery === 'undefined') {
	    document.write(unescape("%3Cscript src='./scripts/jquery-1.11.3.min.js' type='text/javascript'%3E%3C/script%3E"));
	}
	</script>
	<script type="text/javascript" src="./scripts/bluebird.min.js"></script>
	<script type="text/javascript" src="./scripts/velocity.min.js"></script>
	<script type="text/javascript" src="./scripts/velocity.ui.min.js"></script>
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-route.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-resource.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-animate.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-sanitize.min.js"></script>
	<!--<script type="text/javascript" src="./scripts/angular-ui-router.min.js"></script>-->
	<script type="text/javascript" src="./scripts/moment.min.js"></script>
	<script type="text/javascript" src="./scripts/moment-timezone-with-data.js"></script>
	<script type="text/javascript" src="./scripts/plugins.<?php echo time(); ?>.js"></script>
	<script type="text/javascript" src="./scripts/index.<?php echo time(); ?>.js"></script>
    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-21471649-1']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

    </script>
</body>
</html>
