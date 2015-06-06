<?php
	include('dbsettings.php');
	$type = mysql_escape_string($_GET['q']);
	$which = mysql_escape_string($_GET['r']);
	$title = 'KAMIYONET - discography';
	$link = mysql_connect($HOSTNAME, $USERNAME, $PASSWORD) or die ('Could not connect: ' . mysql_error()); 
 	mysql_select_db($DB_NAME) or die ('Could not select database');
	
	$query = 'SELECT * FROM '.$DISC.' ORDER BY date DESC;';
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
