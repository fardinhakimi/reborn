<?php

require_once __DIR__ . '/../vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Promise\Utils;


$client = new Client(
    [
        'base_uri' => 'http://jsonplaceholder.typicode.com/'
    ]
);


$promise1 = $client->getAsync("posts/1");
$promise2 = $client->getAsync("posts/2");

$promises = [
    $promise1,
    $promise2
];


$results = Utils::unwrap($promises);


foreach($results as $item) {
    print_r($item->getBody()->__toString());
}








