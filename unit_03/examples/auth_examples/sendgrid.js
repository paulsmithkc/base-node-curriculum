const debug = require('debug')('app:sendgrid');
const config = require('config');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

// set api key
sgMail.setApiKey(config.get('sendgrid.apiKey'));

const sendEmail = async (to, subject, text, html, trackingEnabled = false) => {
  const msg = {
    from: config.get('sendgrid.from'),
    // redirect emails in development
    to: config.get('sendgrid.to') || to,
    subject: subject,
    text: text,
    html: html,
    trackingSettings: {
      clickTracking: { enable: trackingEnabled },
      openTracking: { enable: trackingEnabled },
      subscriptionTracking: { enable: trackingEnabled },
    },
  };
  const result = await sgMail.send(msg);
  debug(`${msg.subject} sent to ${msg.to}: ${result}`);
};

const sendVerifyEmail = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    type: 'verify_email',
  };
  const secret = config.get('sendgrid.secret');
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  const msg = {
    from: config.get('sendgrid.from'),
    // redirect emails in development
    to: config.get('sendgrid.to') || user.email,
    templateId: config.get('sendgrid.templates.verifyEmail'),
    dynamicTemplateData: {
      token: token,
    },
    trackingSettings: {
      clickTracking: { enable: false },
      openTracking: { enable: false },
      subscriptionTracking: { enable: false },
    },
  };
  const result = await sgMail.send(msg);
  debug(`Verify Email sent to ${msg.to}: ${result}`);
};

const sendResetPassword = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    type: 'reset_password',
  };
  const secret = config.get('sendgrid.secret');
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  const msg = {
    from: config.get('sendgrid.from'),
    // redirect emails in development
    to: config.get('sendgrid.to') || user.email,
    templateId: config.get('sendgrid.templates.resetPassword'),
    dynamicTemplateData: {
      token: token,
    },
    trackingSettings: {
      clickTracking: { enable: false },
      openTracking: { enable: false },
      subscriptionTracking: { enable: false },
    },
  };
  const result = await sgMail.send(msg);
  debug(`Reset Password sent to ${msg.to}: ${result}`);
};

module.exports = {
  sendEmail,
  sendVerifyEmail,
  sendResetPassword,
};
