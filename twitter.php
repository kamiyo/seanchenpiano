<?php

require_once ('codebird.php');
\Codebird\Codebird::setConsumerKey('0WALbUFlAOsVEn7UfjlxQ', 'tV3c9nbuUJh7LvJOId5AUPK5XsxrPvWJLbF4DoMd5o');
$cb = \Codebird\Codebird::getInstance();
$cb->setToken('1396348188-GLJGOMgERa7HYwBNMkXPCsSRtvDWYf2CDfELnIb', 'oszYKyKJ30xYVEwKVmx9tN0lDHa92MOXi8HMuoI9GjI');

$api = 'statuses/userTimeline';
$type = mysql_escape_string($_GET['q']);
if ($type == 'm') {
	$api = 'statuses/mentionsTimeline';
} else if ($type == 'u') {
	$api = 'statuses/userTimeline';
}

$params['screen_name'] = 'seanchenpiano';
$params['include_rts'] = true;
$params['count'] = 10;

$cb->setReturnFormat(CODEBIRD_RETURNFORMAT_JSON);
$data = (array) $cb->$api($params);
print_r($data[0]);

?>
