<div id="blogContainer" home-infinite>
<div class="blog" ng-repeat="entry in blog">
	<div class="title" ng-bind="entry.Title"></div>
	<div class="blurb" ng-bind-html-unsafe="entry.Blurb"></div>
	<div class="posted" ng-bind="timeString(entry.Posted)"></div>
</div>
</div>