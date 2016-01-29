<div class="heading">Concerti</div>
<table id="musicList">
	<thead>
		<tr>
			<th ng-class="{active : isSelected('concerto', 'composer')}" ng-click="sort('concerto', 'composer')">Composer<i ng-class="sortIcon('concerto', 'composer')"></i></th>
			<th ng-class="{active : isSelected('concerto', 'piece')}" ng-click="sort('concerto', 'piece')">Piece<i ng-class="sortIcon('concerto', 'piece')"></i></th>
			<th style="width:10%" ng-class="{active : isSelected('concerto', 'year')}" ng-click="sort('concerto', 'year')">Year<i ng-class="sortIcon('concerto', 'year')"></i></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="music in list.concerti | orderBy : predicate.concerto : reverse.concerto">
			<td ng-bind="music.composer"></td>
			<td><div class="musicHover" bind-music ng-bind="music.piece"></div>
				<div class="info" ng-bind="music.contributing"></div>
				<ul class="animate-displayNone">
					<li id="{{music.url[$index]}}" class="musicHover" ng-repeat="movement in music.movements" ng-bind="movement" bind-movement="{{music.url[$index]}}"></li>
				</ul>
			</td>
			<td ng-bind="music.year"></td>
		</tr>	
	</tbody>
</table>
<div class="heading">Soli</div>
<table id="musicList">
	<thead>
		<tr>
			<th ng-class="{active : isSelected('solo', 'composer')}" ng-click="sort('solo', 'composer')">Composer<i ng-class="sortIcon('solo', 'composer')"></i></th>
			<th ng-class="{active : isSelected('solo', 'piece')}" ng-click="sort('solo', 'piece')">Piece<i ng-class="sortIcon('solo', 'piece')"></i></th>
			<th style="width:10%" ng-class="{active : isSelected('solo', 'year')}" ng-click="sort('solo', 'year')">Year<i ng-class="sortIcon('solo', 'year')"></i></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="music in list.soli | orderBy : predicate.solo : reverse.solo">
			<td ng-bind="music.composer"></td>
			<td><div class="musicHover" bind-music ng-bind="music.piece"></div>
				<div class="info" ng-bind="music.contributing"></div>
				<ul class="animate-displayNone">
					<li class="musicHover" ng-repeat="movement in music.movements" ng-bind="movement" bind-movement="{{music.url[$index]}}"></li>
				</ul>
			</td>
			<td ng-bind="music.year"></td>
		</tr>	
	</tbody>
</table>
<div class="heading">Chamber</div>
<table id="musicList">
	<thead>
		<tr>
			<th ng-class="{active : isSelected('chamber', 'composer')}" ng-click="sort('chamber', 'composer')">Composer<i ng-class="sortIcon('chamber', 'composer')"></i></th>
			<th ng-class="{active : isSelected('chamber', 'piece')}" ng-click="sort('chamber', 'piece')">Piece<i ng-class="sortIcon('chamber', 'piece')"></i></th>
			<th style="width:10%" ng-class="{active : isSelected('chamber', 'year')}" ng-click="sort('chamber', 'year')">Year<i ng-class="sortIcon('chamber', 'year')"></i></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="music in list.chamber | orderBy : predicate.chamber : reverse.chamber">
			<td ng-bind="music.composer"></td>
			<td><div class="musicHover" bind-music ng-bind="music.piece"></div>
				<div class="info" ng-bind="music.contributing"></div>
				<ul class="animate-displayNone">
					<li class="musicHover" ng-repeat="movement in music.movements" ng-bind="movement" bind-movement="{{music.url[$index]}}"></li>
				</ul>
			</td>
			<td ng-bind="music.year"></td>
		</tr>	
	</tbody>
</table>
<div class="heading">Arrangements</div>
<table id="musicList">
	<thead>
		<tr>
			<th ng-class="{active : isSelected('arrangement', 'piece')}" ng-click="sort('arrangement', 'piece')">Piece<i ng-class="sortIcon('arrangement', 'piece')"></i></th>
			<th style="width:10%" ng-class="{active : isSelected('arrangement', 'year')}" ng-click="sort('arrangement', 'year')">Year<i ng-class="sortIcon('arrangement', 'year')"></i></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="music in list.arrangement | orderBy : predicate.arrangement : reverse.arrangement">
			<td><div class="musicHover" bind-music>{{music.piece}}</div>
			<a class="info" ng-repeat="file in music.pdf" ng-show="file" href="http://seanchenpiano.com/music/composing/{{file}}.pdf"><div class="small-pdf-icon"></div>{{fileOrList(music, $index)}}</a>
				</div>
				<ul class="animate-displayNone">
					<li class="musicHover" ng-repeat="movement in music.movements" ng-bind="movement" bind-movement="{{music.url[$index]}}"></li>
				</ul>
			</td>
			<td ng-bind="music.year"></td>
		</tr>	
	</tbody>
</table>
<div class="heading">Compositions</div>
<table id="musicList">
	<thead>
		<tr>
			<th ng-class="{active : isSelected('composition', 'piece')}" ng-click="sort('composition', 'piece')">Piece<i ng-class="sortIcon('composition', 'piece')"></i></th>
			<th style="width:10%" ng-class="{active : isSelected('composition', 'year')}" ng-click="sort('composition', 'year')">Year<i ng-class="sortIcon('composition', 'year')"></i></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="music in list.composition | orderBy : predicate.composition : reverse.composition">
			<td><div class="musicHover" bind-music>{{music.piece}}</div>
			<a class="info" ng-repeat="file in music.pdf" ng-show="file" href="http://seanchenpiano.com/music/composing/{{file}}.pdf"><div class="small-pdf-icon"></div>{{fileOrList(music, $index)}}</a>
				</div>
			
				<ul class="animate-displayNone">
					<li class="musicHover" ng-repeat="movement in music.movements" ng-bind="movement" bind-movement="{{music.url[$index]}}"></li>
				</ul>
			</td>
			<td ng-bind="music.year"></td>
		</tr>	
	</tbody>
</table>
<div class="heading">Videogame Music</div>
<table id="musicList">
	<thead>
		<tr>
			<th ng-class="{active : isSelected('vg', 'piece')}" ng-click="sort('vg', 'piece')">Piece<i ng-class="sortIcon('vg', 'piece')"></i></th>
			<th style="width:10%" ng-class="{active : isSelected('vg', 'year')}" ng-click="sort('vg', 'year')">Year<i ng-class="sortIcon('vg', 'year')"></i></th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="music in list.vg | orderBy : predicate.vg : reverse.vg">
			<td><div class="musicHover" bind-music>{{music.piece}}</div>
			<a class="info" ng-repeat="file in music.pdf" ng-show="file" href="http://seanchenpiano.com/music/composing/{{file}}.pdf"><div class="small-pdf-icon"></div>{{fileOrList(music, $index)}}</a>
				<ul class="animate-displayNone">
					<li class="musicHover" ng-repeat="movement in music.movements" ng-bind="movement" bind-movement="{{music.url[$index]}}"></li>
				</ul>
			</td>
			<td ng-bind="music.year"></td>
		</tr>	
	</tbody>
</table>