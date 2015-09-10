<div id="videos" infinite="">
  <ul ng-cloak="" id="vList">
    <li class="items" click-video="{{video.snippet.resourceId.videoId}}" ng-repeat="video in videos">
      <div class="img-container">
        <img img-load="" ng-src="{{video.snippet.thumbnails.default.url}}" />
        <div class="duration">{{video.duration}}</div>
      </div>
      <div class="vidDetails">
        <div class="vidDescription">{{video.snippet.title}}</div>
        <div class="views">{{video.statistics.viewCount}} views | published on {{getPublished(video.snippet.publishedAt) | date:'longDate'}}</div>
      </div>
      <div class="spacer"></div>
    </li>
    <li scroll-up="" id="scrollUp">Scroll back up</li>
  </ul>
</div>