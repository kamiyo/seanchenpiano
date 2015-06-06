<?php
	include('dbsettings.php');
	$type = mysql_escape_string($_GET['q']);
	$number = mysql_escape_string($_GET['n']);
	$start = mysql_escape_string($_GET['s']);
	$title = 'KAMIYONET - home';
	$link = mysql_connect($HOSTNAME, $USERNAME, $PASSWORD) or die ('Could not connect: ' . mysql_error()); 
 	mysql_select_db($DB_NAME) or die ('Could not select database');
	if ($type == 'c') {
		$query = 'SELECT COUNT(*) FROM '.$MBLOG.' WHERE deleted = 0;';
	} else if ($number != '') {
		if ($start == '') {
			$query = 'SELECT * FROM '.$MBLOG.' WHERE deleted = 0 ORDER BY posted DESC LIMIT '.$number.';';
		} else {
			$query = 'SELECT * FROM '.$MBLOG.' WHERE deleted = 0 ORDER BY posted DESC LIMIT '.$start.','.$number.';';
		}
	} else {
		$query = 'SELECT * FROM '.$MBLOG.' WHERE deleted = 0 ORDER BY posted DESC;';
	}
	$result = mysql_query($query);
	$arr = array();
	$temp;
	while ($temp = mysql_fetch_assoc($result)) {
		$arr[] = $temp;
	}
	echo json_encode($arr);
	mysql_free_result($result);

	mysql_close($link);	
?>
