<?php

namespace GuzzleMaster;


require_once __DIR__ . '/../vendor/autoload.php';

use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7;


$request = new Request('GET', 'http://jsonplaceholder.typicode.com/posts/1');


echo "SCHEMA: {$request->getUri()->getScheme()} \r\n";

echo "PORT: {$request->getUri()->getPort()} \r\n";

echo ($request->getUri()->getHost()).  "\r\n";

echo ($request->getUri()->getPath()).  "\r\n";

$client = new Client();


$response = $client->request(
    'GET',
    'http://jsonplaceholder.typicode.com/posts/1'
);

echo ($response->getStatusCode())."\n";
echo($response->getReasonPhrase());

if($response->hasHeader('content-type')) {
    dd($response->getHeader('content-type'));

}