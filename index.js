const awsIot = require('aws-iot-device-sdk');

console.log('rodando');

const device = awsIot.device({
  keyPath: './certs/MagicLock.private.key',
  certPath: './certs/MagicLock.cert.pem',
  caPath: './certs/root-CA.crt',
  clientId: 'MagicLockInitial',
  host: 'a3vhfiz04xq9n9.iot.us-east-1.amazonaws.com'
});

console.log('criou o device');

device.on('connect', () => {
  console.log('connect');
  device.subscribe('magiclock/open');
  console.log('assinou');
  device.publish('magiclock/thing', JSON.stringify({ status: 'I\'m alive' }));
  console.log('publicou');
});

device.on('message', (topic, payload) => {
  console.log('Message', topic, payload.toString());
});

device
  .on('error', function(error) {
    console.log('error', error);
  });

