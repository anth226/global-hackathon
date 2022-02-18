module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'mysecret',
  // Database connection information
  database: 'mongodb://localhost:27017/glh-platform',
  // Setting port for server
  port: 8080,
  // Configuring Mailgun API for sending transactional email
  mailgun_priv_key: 'mailgun private key here',
  // Configuring Mailgun domain for sending transactional email
  mailgun_domain: 'mailgun domain here',
  // Mailchimp API key
  mailchimpApiKey: 'mailchimp api key here',
  // SendGrid API key
  sendgridApiKey: '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',
  // Stripe API key
  stripeApiKey: 'stripe api key goes here',

  // S3 Info
  s3bucket: 'plastplace',
  s3accessKeyId: 'AKIA5TFCHVFPA6GTI446',
  s3secretAccessKey: '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',
  s3region: 'us-east-2',

  // necessary in order to run tests in parallel of the main app
  test_port: 3001,
  test_env: 'test',
  test_email: 'sunnyprome30@gmail.com',
  test_db: 'mern-starter-test',
};
