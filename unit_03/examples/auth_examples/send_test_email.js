const sendgrid = require('./sendgrid');

sendgrid.sendEmail(
  'john.doe@example.com',
  'test message',
  'this is a test.',
  '<em>this is a test.</em>'
);
