	<ul id="sort">
		<div id="sortBy">sort by:</div>
		<li class="button" click-sort="relevance">relevance</li>
		<li class="button" click-sort="viewCount">view-count</li>
		<li class="button" click-sort="date">date published</li>
		<li class="last-button" click-sort="searchResults">Youtube search</li>
		<li class="spacer"></li>
	</ul>
	<div id="videos" infinite>
		<ul ng-cloak id="vList" ng-init="initVids()">
			<li class="items animate-leave" slide-in click-video="{{video.id.videoId}}" ng-repeat="video in videos">
				<div class="img-container">			
					<img img-load ng-src="{{video.snippet.thumbnails.default.url}}" />
					<div class="duration">{{video.duration}}</div>
				</div>
				<div class="vidDetails">
					<div class="vidDescription">{{video.snippet.title}}</div>
					<div class="views">{{video.statistics.viewCount}} views | published on {{getPublished(video.snippet.publishedAt) | date:'longDate'}}</div>
				</div>
				<div class="spacer"></div>
			</li>
			<li scroll-up id="scrollUp">Scroll back up</li>
		</ul>
	</div>