<?php

require_once __DIR__ . '/../vendor/autoload.php';


use GuzzleHttp\Client;

$client = new Client(
    [
        'base_uri' => 'http://jsonplaceholder.typicode.com/'
    ]
);

$response = $client->get('posts/1');

$posts = json_decode($response->getBody()->__toString());

print_r($posts->title);
print_r($response->getReasonPhrase());