<?php
	include('dbsettings.php');
	$type = mysql_escape_string($_GET['q']);
	$which = mysql_escape_string($_GET['r']);
	$title = 'KAMIYONET - music';
	$link = mysql_connect($HOSTNAME, $USERNAME, $PASSWORD) or die ('Could not connect: ' . mysql_error()); 
 	mysql_select_db($DB_NAME) or die ('Could not select database');
	if ($type == 'c') {
		if ($which == 'm') {
			$query = 'SELECT * FROM '.$CONCERTO.' WHERE url <> \'\' ORDER BY year DESC, composer ASC, piece ASC;';
		} else {
			$query = 'SELECT * FROM '.$CONCERTO.' ORDER BY year DESC, composer ASC, piece ASC;';
		}
		$result = mysql_query($query);
		$arr = array();
		$temp;
		while ($temp = mysql_fetch_assoc($result)) {
			$arr[] = $temp;
		}
		echo json_encode($arr);
	} else if ($type == 's') {
		if ($which == 'm') {
			$query = 'SELECT * FROM '.$MUSIC.' WHERE url <> \'\' ORDER BY year DESC, composer ASC, piece ASC;';
		} else {
			$query = 'SELECT * FROM '.$MUSIC.' ORDER BY year DESC, composer ASC, piece ASC;';
		}
		$result = mysql_query($query);
		$arr = array();
		while ($temp = mysql_fetch_assoc($result)) {
			$arr[] = $temp;
		}
		echo(json_encode($arr));
	} else if ($type == 'h') {
		if ($which == 'm') {
			$query = 'SELECT * FROM '.$CHAMBER.' WHERE url <> \'\' ORDER BY year DESC, composer ASC, piece ASC;';
		} else {
			$query = 'SELECT * FROM '.$CHAMBER.' ORDER BY year DESC, composer ASC, piece ASC;';
		}
		$result = mysql_query($query);
		$arr = array();
		while ($temp = mysql_fetch_assoc($result)) {
			$arr[] = $temp;
		}
		echo(json_encode($arr));
	} else if ($type == 'a') {
		if ($which == 'm') {
			$query = 'SELECT * FROM '.$COMP.' WHERE instrumentation = \'Arrangements for Piano\' && url <> \'\' ORDER BY year DESC, piece ASC;';
		} else {
			$query = 'SELECT * FROM '.$COMP.' WHERE instrumentation = \'Arrangements for Piano\' ORDER BY piece ASC;';
		}
		$result = mysql_query($query);
		$arr = array();
		while ($temp = mysql_fetch_assoc($result)) {
			$arr[] = $temp;
		}
		echo(json_encode($arr));
	} else if ($type == 'o') {
		if ($which == 'm') {
			$query = 'SELECT * FROM '.$COMP.' WHERE instrumentation <> \'Arrangements for Piano\' && instrumentation <> \'Videogame-y\' && url <> \'\' ORDER BY year DESC, piece ASC;';
		} else {
			$query = 'SELECT * FROM '.$COMP.' WHERE instrumentation <> \'Arrangements for Piano\' && instrumentation <> \'Videogame-y\' ORDER BY piece ASC;';
		}
		$result = mysql_query($query);
		$arr = array();
		while ($temp = mysql_fetch_assoc($result)) {
			$arr[] = $temp;
		}
		echo(json_encode($arr));
	} else if ($type == 'v') {
		if ($which == 'm') {
			$query = 'SELECT * FROM '.$COMP.' WHERE instrumentation = \'Videogame-y\' && url <> \'\' ORDER BY year DESC, piece ASC;';
		} else {
			$query = 'SELECT * FROM '.$COMP.' WHERE instrumentation = \'Videogame-y\' ORDER BY piece ASC;';
		}
		$result = mysql_query($query);
		$arr = array();
		while ($temp = mysql_fetch_assoc($result)) {
			$arr[] = $temp;
		}
		echo(json_encode($arr));
	}
	mysql_free_result($result);

	mysql_close($link);
	
	
?>
