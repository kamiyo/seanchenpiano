<!DOCTYPE html>
<html>
<head>
	<base href="/beta/" / target="_blank">
	<link rel="stylesheet" type="text/css" href="./scripts/fontello.<?php echo time(); ?>.css">
	<link rel="stylesheet" type="text/css" href="./scripts/jquery.fancybox.<?php echo time(); ?>.css">
	<link rel="stylesheet" type="text/css" href="./scripts/jquery.fancybox-thumbs.<?php echo time(); ?>.css">
	<link rel="stylesheet" type="text/css" href="./scripts/index.<?php echo time(); ?>.css">
<title>Sean Chen - pianist</title>
</head>

<body class="flexbox" ng-cloak ng-app="root" ng-controller="rootCtrl">
	<div id="header">
		<div id="menu">
			<div id="subMenu">
				<ul id="mediaMenu" class="animate-hide" ng-controller="mediaNav">
					<li class="nav" ng-repeat="medium in mediaIcons" media-nav="{{mediaPaths[$index]}}"><i class="icon-{{medium}}"></i></li>
				</ul>
				<div class="spacer"></div>
			</div>
			<ul id="mainMenu" ng-controller="navigation">
				<li class="nav" ng-bind="nav" click-nav="{{nav}}" ng-repeat="nav in navs"></li>
				<li class="spacer"></li>
			</ul>
		</div>
	</div>
	
	<div id="front" class="over animate-show" fade-front>
		<div class="quote">&ldquo;{{quotes[quoteIndex].short}}&rdquo;<div style="text-align:right;">- {{quotes[quoteIndex].shortAuthor}}</div></div>
		<div id="overBorder"></div>
		<img class="fader" id="theFader"/>
		<img id="theFront" ng-src="{{front}}" />
	</div>
	<div id="main">
		<div id="playerContainer">
			<div id="player" class=""></div>		
			<!--<div id="hideCtrl" class="animate-hide"></div>-->
		</div>

		<div id="mainRow">
			<div id="content" ng-view>
			
			</div>
			<div id="sidebar">
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
									<td ng-repeat="name in days" ng-bind="name"></td>
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
							<li class="eventClick" ng-click="goToSched('{{event.dateString}}')" ng-repeat="event in listCalendar">
								<div ng-bind="event.dateString"></div>
								<div ng-bind="event.location"></div>
							</li>
						</ul>
					</div>
				</div>
				<div id="twitterLabel" class="heading">Twitter</div>
				<div id="twitterBox" ng-controller="twitterCtrl">
					<ul>
						<li ng-repeat="tweet in tweets | orderBy : tweet.created_at">
							<img ng-src="{{tweet.user.profile_image_url}}" /><span class="twitterName" ng-bind="tweet.user.name"></span><a ng-href="http://twitter.com/{{tweet.user.screen_name}}">@{{tweet.user.screen_name}}</a>
							<a ng-href="http://twitter.com/{{tweet.user.screen_name}}/status/{{tweet.id_str}}" ><div class="tweetBody" tweet-click="tweet.id_str" ng-bind="tweet.text"></div></a>
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
		<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
		<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-resource.min.js"></script>
		<script src="./scripts/jquery.mousewheel.<?php echo time(); ?>.js"></script>
		<script src="./scripts/jquery.fancybox.<?php echo time(); ?>.js"></script>
		<script src="./scripts/jquery.fancybox-thumbs.<?php echo time(); ?>.js"></script>
		<script src="./scripts/index.<?php echo time(); ?>.js"></script>

</body>
</html>
