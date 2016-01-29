<?php
	include('dbsettings.php');
	$title = 'KAMIYONET - pictures';
	$link = mysql_connect($HOSTNAME, $USERNAME, $PASSWORD) or die ('Could not connect: ' . mysql_error()); 
	
	mysql_select_db($DB_NAME) or die ('Could not select database');

	$query = 'SELECT * FROM '.$PICLIST.' WHERE Deleted = 0 ORDER BY ID ASC;';
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
