<div>
  <div toggle-siblings="" class="heading aboutList">Biography</div>
  <div class="bioList" id="biography">
    <p>Hailed as a charismatic rising star with “an exceptional ability to connect with an audience combined with an easy virtuosity” (Huffington Post), <?php $diff = abs(strtotime(date("Y-m-d")) - strtotime("1988-08-27")); echo floor($diff / (365 * 60 * 60 * 24)); ?>-year-old American pianist Sean Chen won third prize at the Van Cliburn International Piano Competition, and was also awarded the Christel DeHaan Classical Fellowship of the American Pianists Association in 2013. Since then, he has continued to earn accolades for “alluring, colorfully shaded renditions “(New York Times), and was recently named a 2015 fellow by the prestigious Leonore Annenberg Fellowship Fund for the Performing Arts.</p>
    <p>In the coming season, Mr. Chen will make return appearances with the San Diego Symphony, Carmel Symphony, and Sunriver Festival Orchestras, as well as perform with the National Symphony of the Dominican Republic, North Carolina, Hudson Valley, Pasadena, Bakersfield, Knoxville, Fairfax, and San Angelo Symphony Orchestras. He will also be traveling across the United States for solo and chamber recitals, including concerts in Chicago, Denver, Louisville, and Los Angeles. Lauded for his natural charisma and approachable personality, Mr. Chen is particularly in demand for residencies that combine performances with master classes, school concerts, and artist conversations.</p>
    <p>He has previously worked with many prominent orchestras, including the Fort Worth, Hartford, Indianapolis, Milwaukee, Phoenix, San Diego, Santa Fe, Tucson, and New West Symphonies, as well as the Philadelphia, Indianapolis, and South Bay Chamber Orchestras, collaborating with such esteemed conductors as Leonard Slatkin, Gerard Schwarz, Miguel Harth-Bedoya, Marcelo Lehninger, Nir Kabaretti, James Judd, George Hanson, and Boris Brott. Solo recitals have brought him to major venues worldwide, including Jordan Hall in Boston, Subculture in New York City, the American Art Museum at the Smithsonian in Washington, D.C., the National Concert Hall in Taipei, Het Concertgebouw in Amsterdam, and the Salle Cortot in Paris.</p>
    <p>Mr. Chen has been featured in broadcast and recorded performances on WQXR (New York), WGBH (Boston), WFYI (Indianapolis), NPR’s From the Top, and American Public Media’s Performance Today. Additional media coverage includes a profile featured on the cover of Clavier Companion in May 2015, and recognition as “One to Watch” by International Piano Magazine in March 2014.</p>
    <p>His recent CD releases include La Valse, a solo recording on the Steinway label, hailed for “penetrating artistic intellect” (Audiophile Audition); a live recording from the Cliburn Competition released by harmonia mundi, praised  for “ravishing tone and cogently contoured lines” (Gramophone); and an album of Michael Williams' solo piano works on the Parma label.</p>
    <p>A multifaceted musician, Mr. Chen also transcribes, composes, and improvises. His transcription of Ravel’s La Valse has been received with glowing acclaim, and his encore improvisations are lauded as “genuinely brilliant” (Dallas Morning News). An advocate of new music, he has also collaborated with several composers and performed their works, including Lisa Bielawa, Michael Williams, Nicco Athens, Michael Gilbertson, and Reinaldo Moya.</p>
    <p>Born in Florida, Mr. Chen grew up in the Los Angeles area of Oak Park, California. His impressive achievements before college include the NFAA ARTSweek, Los Angeles Music Center’s Spotlight, and 2006 Presidential Scholars awards. These honors combined with diligent schoolwork facilitated offers of acceptance by MIT, Harvard, and The Juilliard School. Choosing to study music, Mr. Chen earned his Bachelor and Master of Music from Juilliard, meanwhile garnering several awards, most notably the Paul and Daisy Soros Fellowship for New Americans. He received his Artist Diploma in 2014 at the Yale School of Music as a George W. Miles Fellow. His teachers include Hung-Kuan Chen, Tema Blackstone, Edward Francis, Jerome Lowenthal, and Matti Raekallio.</p>
    <p>When not at the piano, Mr. Chen enjoys experimenting with computers.</p>

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
				<img ng-src="/images/xbox.svg" />
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