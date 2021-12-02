<?php

require_once __DIR__ . '/../vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;

$client = new Client(
    [
        'base_uri' => 'http://jsonplaceholder.typicode.com/'
    ]
);



$cookieJar = new CookieJar();

// allow redirects
$response = $client->request("GET", 'https://httpbin.org/redirect/1',
    [
        'allow_redurects' => true,
        'delay' => 2000, // delay sending of request for 2 secs
        'max' => 10,
        'http_errors' => true , // whether to supress or allow http_errors
        'cookies' => $cookieJar
    ]
);







