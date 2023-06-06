<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  // Set up the email headers
  $to = 'jkjatinsharma72@gmail.com';
  $subject = 'New Contact Form Submission';
  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

  // Compose the email body
  $body = "Name: $name\r\n";
  $body .= "Email: $email\r\n";
  $body .= "Message:\r\n$message\r\n";

  // Send the email
  if (mail($to, $subject, $body, $headers)) {
    echo 'Email sent successfully.';
  } else {
    echo 'An error occurred while sending the email.';
  }
} else {
  echo 'Invalid request.';
}
?>
