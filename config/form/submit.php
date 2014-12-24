<?php
$response = new stdClass();
$response->success = false;

if (
  ($first_name = filter_input(INPUT_POST, "first_name", FILTER_SANITIZE_STRING)) !== false
  && ($last_name = filter_input(INPUT_POST, "last_name", FILTER_SANITIZE_STRING)) !== false
  && ($email = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL)) !== false
  && ($message = filter_input(INPUT_POST, "message", FILTER_SANITIZE_STRING)) !== false
) {
  $message = "Contact request submitted via the contact form:" . PHP_EOL .
    "First name: {$first_name}" . PHP_EOL .
    "Last name: {$last_name}" . PHP_EOL .
    "Email address: {$email}" . PHP_EOL . PHP_EOL .
    $message
  ;
  $response->success = mail("contact@4000milestare.com", "Contact request from the website.", $message);
}

// AJAX call, send JSON response.
if (!empty($_POST["js"])) {
  echo json_encode($response);
}
// Normal form submit, send redirect.
else {
  $location = "/contact-nojs-";
  if ($response->success === true) {
    $location .= 'success';
  }
  else {
    $location .= 'error';
  }
  header("Location: {$location}.html");
}
