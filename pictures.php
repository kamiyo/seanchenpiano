<div init-fancybox>
<a class="fancybox" no-bubble ng-repeat="picture in pictures" rel="fancybox" href="./images/gallery/{{picture.url}}" title="{{picture.caption}}">
<img ng-src="./images/gallery/thumbs/{{picture.url}}" alt=""/></a>
<div class="spacer"></div>
</div>