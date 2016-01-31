<div>
	<div toggle-siblings="" id="biocontainer" class="heading aboutList">Biography</div>
	<div class="bioList" id="biography" ng-bind-html="bio">
	</div>
</div>
	<div>
	<div toggle-siblings="" class="heading aboutList">Discography</div>
	<div class="discList">
		<div class="discog" ng-repeat="item in disc | orderBy:'date':true">
		<img ng-src="/images/discography/{{item.img}}" />
		<table class="discOver">
			<tr>
			<td class="{{hasLink(item.google)}}">
				<a ng-show="{{hasLink(item.google)}}" ng-href="{{item.google}}">
				<img ng-src="/images/google.svg" />
				</a>
			</td>
			<td class="{{hasLink(item.itunes)}}">
				<a ng-show="{{hasLink(item.itunes)}}" ng-href="{{item.itunes}}">
				<img ng-src="/images/itunes.svg" />
				</a>
			</td>
			<td class="{{hasLink(item.xbox)}}">
				<a ng-show="{{hasLink(item.xbox)}}" ng-href="{{item.xbox}}">
				<img ng-src="/images/MicrosoftGrooveIcon.png" />
				</a>
			</td>
			</tr>
			<tr>
			<td class="{{hasLink(item.arkiv)}}">
				<a ng-show="{{hasLink(item.arkiv)}}" ng-href="{{item.arkiv}}">
				<img ng-src="/images/arkiv.svg" />
				</a>
			</td>
			<td class="{{hasLink(item.spotify)}}">
				<a ng-show="{{hasLink(item.spotify)}}" ng-href="{{item.spotify}}">
				<img ng-src="/images/spotify.svg" />
				</a>
			</td>
			<td class="{{hasLink(item.amazon)}}">
				<a ng-show="{{hasLink(item.amazon)}}" ng-href="{{item.amazon}}">
				<img ng-src="/images/amazon.svg" />
				</a>
			</td>
			</tr>
			<tr>
			<td></td>
			<td></td>
			<td></td>
			</tr>
		</table>
		</div>
	</div>
</div>


<div ng-repeat="mlist in repList">
	<div toggle-siblings="" class="heading aboutList">{{mlist.label}}</div>
	<div class="repDiv">
		<table class="repList">
			<tr ng-repeat="item in mlist.list | orderBy:'composer'">
				<td ng-bind="showComp(item.composer)"></td>
				<td>
					{{item.piece}}
					<a class="info" ng-repeat="file in item.pdf" ng-show="file" target="_blank" ng-href="http://seanchenpiano.com/musicfiles/composing/{{file}}.pdf">
						<div class="small-pdf-icon"></div>{{fileOrList(item, $index)}}
					</a>
				</td>
			</tr>
		</table>
	</div>
</div>