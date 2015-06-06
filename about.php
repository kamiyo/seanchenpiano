<div><div toggle-siblings class="heading aboutList">Biography</div>
<div class="repList" id="biography"><p>Pianist Sean Chen is being hailed as a rising star with a "million-volt smile" and a "formidable set of fingers" (Dallas Morning News). In 2013 Chen won the American Pianists Association's DeHaan Classical Fellowship, one of the most lucrative and significant prizes available to an American pianist. He also won Third Prize at the 14th Van Cliburn International Piano Competition, becoming the first American to reach the finals since 1997. 
The <?php $myage = explode("/", "08/27/1988"); $diff = date('Y') - $myage[2]; echo $diff; ?>-year-old American pianist has appeared as soloist with the Indianapolis Symphony Orchestra under Gerard Schwarz, Fort Worth Symphony Orchestra under Leonard Slatkin and Miguel Harth-Bedoya, Indianapolis Chamber Orchestra, Corpus Christi, New West, Phoenix and San Diego symphony orchestras, and the Suwon City Philharmonic in South Korea. Last season Chen performed in recital at Jordan Hall in Boston, the Dame Myra Hess Series in Chicago, SubCulture in New York City, the Concertgebouw in Amsterdam, and on tour in the Czech Republic.</p>
<p>Highlights of Chen's 2014-15 season include debuts with the Milwaukee Symphony Orchestra, the Philadelphia Chamber Orchestra at the Kimmel Center, the symphony orchestras of Hartford, Tucson, Santa Fe, and Carmel, and his return to the Indianapolis Chamber Orchestra. He appears in recital in the Steinway Series at the Smithsonian in Washington, D.C., the Salk Institute in San Diego, Jacksonville, New Orleans, on tour in Hawaii, and with soprano Jessica Rivera in Thousand Oaks, CA. 
A proponent of the music of our time, Chen has performed new works by Lisa Bielawa, Michael Williams, Nicco Athens, Michael Gilbertson, and Reinaldo Moya. Recent CD releases include an album of Michael Williams's solo piano works on the Parma label, a live recording from the Cliburn competition released by Harmonia Mundi, and La Valse, a solo recording on the Steinway label, as part of his American Pianists Association prize. The New York Times praised Chen's "alluring, colorfully shaded renditions" of works by Scriabin and Ravel on the latter, and Los Angeles Music Examiner noted, "Los Angeles native Sean Chen has the rare ability to combine poetic musical sensibilities and dazzling technical prowess."</p>
<p>Born in 1988 in Margate, FL, Chen grew up in the Los Angeles area of Oak Park, CA. His impressive achievements before college included receiving an NFAA ARTSweek award, a prize at the California International Young Artist Competition, the Los Angeles Music Center's Spotlight Award, the Evelyn Vonar Storrs Scholarship, and the Glenn Miller Scholarship. These honors combined with his extraordinary intellect facilitated offers of acceptance by MIT, Harvard, and the Juilliard School. Choosing to study music, Chen earned his Bachelor's and Master's degrees at Juilliard, where he won the 2010 Gina Bachauer Piano Competition, the 2010 Munz Scholarship, and first prize at the 2008 Juilliard Concerto Competition. While attending Juilliard, Chen was the recipient of a notable third-party scholarship: the 2010 Paul and Daisy Soros Fellowship for New Americans. In competition, Chen won Second Prize at the 2011 Seoul International Music Competition, Third Prize at the 2013 Morocco Philharmony International Piano Competition, Best Performance of an American Work at the 2009 Cleveland International Piano Competition, and he was a semifinalist at the 2012 Leeds International Piano Competition.</p>
<p>Chen received his Artist Diploma at the Yale School of Music in 2014 as a George W. Miles Fellowship recipient, and a student of Hung-Kuan Chen and Tema Blackstone. His former teachers include Jerome Lowenthal, Matti Raekallio, and Edward Francis. He has been featured in a nationally syndicated radio series that chronicled the finals week of the APA's competition, as well as on From the Top, American Public Media's Performance Today, WQXR (New York), WFMT (Chicago), WGBH (Boston), and WFYI (Indianapolis). The webcast of his April 2013 performance of Bartók's Piano Concerto No. 2 with the Indianapolis Symphony can be viewed at <a href="AmericanPianists.org" target="_blank">AmericanPianists.org</a>.</p>
<p>In March 2014 International Piano magazine named Chen "One To Watch." He is currently under the management of the American Pianists Association. When not at the piano, Chen enjoys tinkering with computers and composing.</p>
</div>
</div></div>
<div><div toggle-siblings class="heading aboutList">Discography</div>
<div class="discList">
<div class="discog" ng-repeat="item in disc | orderBy:'date':true">
<img ng-src="/images/discography/{{item.img}}" />
<table class="discOver">
	<tr>
		<td class="{{hasLink(item.google)}}"><a ng-show="{{hasLink(item.google)}}" ng-href="{{item.google}}"><img ng-src="/images/google.svg" /></a></td>
		<td class="{{hasLink(item.itunes)}}"><a ng-show="{{hasLink(item.itunes)}}" ng-href="{{item.itunes}}"><img ng-src="/images/itunes.svg" /></a></td>
		<td class="{{hasLink(item.xbox)}}"><a ng-show="{{hasLink(item.xbox)}}" ng-href="{{item.xbox}}"><img ng-src="/images/xbox.svg" /></a></td>
	</tr>
	<tr>
		<td class="{{hasLink(item.arkiv)}}"><a ng-show="{{hasLink(item.arkiv)}}" ng-href="{{item.arkiv}}"><img ng-src="/images/arkiv.svg" /></a></td>
		<td class="{{hasLink(item.spotify)}}"><a ng-show="{{hasLink(item.spotify)}}" ng-href="{{item.spotify}}"><img ng-src="/images/spotify.svg" /></a></td>
		<td class="{{hasLink(item.amazon)}}"><a ng-show="{{hasLink(item.amazon)}}" ng-href="{{item.amazon}}"><img ng-src="/images/amazon.svg" /></a></td>
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



<div ng-repeat="mlist in repList"><div toggle-siblings class="heading aboutList">{{mlist.label}}</div>
<table class="repList">
	<tr ng-repeat="item in mlist.list | orderBy:'composer'">
		<td ng-bind="showComp(item.composer)"></td>
		<td>{{item.piece}}
		<a class="info" ng-repeat="file in item.pdf" ng-show="file" target="_blank" ng-href="http://seanchenpiano.com/musicfiles/composing/{{file}}.pdf"><div class="small-pdf-icon"></div>{{fileOrList(item, $index)}}</a></td>
	</tr>
</table>
</div>