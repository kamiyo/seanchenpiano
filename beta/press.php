<table id="press">
	<tr>
		<td>Biography</td>
		<td><a href="/docs/seanchenbio.doc"><div class="word-icon"></div></a></td>
		<td><a href="/docs/seanchenbio.pdf"><div class="pdf-icon"></div></a></td>
	</tr>
	<tr>
		<td>Repertoire List</td>
		<td><a href="/docs/seanchenrep.xls"><div class="excel-icon"></div></a></td>
		<td><a href="/docs/seanchenrep.pdf"><div class="pdf-icon"></div></a></td>
	</tr>
	<tr>
		<td>Publicity Photos</td>
		<td></td>
		<td><a href="https://www.dropbox.com/sh/pzou7yeukjktznn/O090nLq8sC"><div class="dropbox-icon"></div></a></td>
</table>

<div id="quotes">
	<div ng-repeat="quote in quotes">
		<p>&ldquo;{{quote.quote}}&rdquo;</p>
		<div class="italics">&mdash;{{quote.author}}, ({{quote.date}})</div>
	</div>
</div>
	
