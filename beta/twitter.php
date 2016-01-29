<?php

require_once('TwitterAPIExchange.php');

$settings = array(
	'oauth_access_token' => '1396348188-GLJGOMgERa7HYwBNMkXPCsSRtvDWYf2CDfELnIb',
	'oauth_access_token_secret' => 'oszYKyKJ30xYVEwKVmx9tN0lDHa92MOXi8HMuoI9GjI',
	'consumer_key' => '0WALbUFlAOsVEn7UfjlxQ',
	'consumer_secret' => 'tV3c9nbuUJh7LvJOId5AUPK5XsxrPvWJLbF4DoMd5o'
);


$type = mysql_escape_string($_GET['q']);
if ($type == 'm') {
	$url = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json';
} else if ($type == 'u') {
	$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
}
$requestMethod = 'GET';
$getfield = '?count=10&include_rts=1';

$twitter = new TwitterAPIEXchange($settings);
echo $twitter->setGetfield($getfield)
			->buildOauth($url, $requestMethod)
			->performRequest();

?>