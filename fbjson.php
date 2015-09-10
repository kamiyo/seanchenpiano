<?php

require_once("facebook.php");

$config = array();
$config['appId'] = '183696981671453';
$config['secret'] = 'da87011d23480e26777978e11c1e5102';
$config['access_token'] = $config['appId'] . '|' . $config['secret'];
$facebook = new Facebook($config);
$result = $facebook->api('/seanchenpiano/posts', 'GET', '');

echo json_encode($result['data']);
?>