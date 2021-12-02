<?php

require_once __DIR__ . '/../vendor/autoload.php';


use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$client = new Client(
    [
        'base_uri' => 'http://jsonplaceholder.typicode.com/'
    ]
);

$promise = $client->getAsync('posts/1');

$promise->then( function( $response ){

    echo " PROMISE REOLVED! \n";
    echo $response->getBody();

},
function( RequestException $e) {
    echo " PROMISE FAILED";
    echo $e->getMessage();
});

//$promise->wait();

echo 'I am defined after the promise';