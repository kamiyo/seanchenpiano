<div id="blogContainer" home-infinite>
<div class="blog" ng-repeat="entry in blog | orderBy:'Posted':true">
	<div class="title" ng-bind-html="entry.Title"></div>
	<div class="blurb" ng-bind-html="entry.Blurb"></div>
    <a ng-href="{{entry.link}}" target="_blank" ng-hide='{{!entry.link}}'><img style="max-width:95%; margin-left:10px; padding-top: 10px; padding-bottom:10px;" ng-hide='{{!(entry.picture)}}' ng-src="{{entry.picture}}" onerror="this.style.visibility='hidden'"/></a>
    <div class="story" ng-bind-html="entry.story"></div>
	<span class="posted" ng-bind="timeString(entry.Posted)"></span> <a ng-show="link2fb(entry)" ng-href="{{link2fb(entry)}}" ng-bind="likecomments(entry)" target="_blank"></a>
</div>
</div>