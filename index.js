const awsIot = require('aws-iot-device-sdk');
const { Gpio } = require('onoff');

const device = awsIot.device({
  keyPath: './certs/MagicLock.private.key',
  certPath: './certs/MagicLock.cert.pem',
  caPath: './certs/root-CA.crt',
  clientId: 'MagicLockInitial',
  host: 'a3vhfiz04xq9n9.iot.us-east-1.amazonaws.com'
});

device.on('connect', () => {
  device.subscribe('magiclock/open');
  device.publish('magiclock/thing', JSON.stringify({ status: 'I\'m alive' }));
});

device.on('message', (topic, payload) => {
  const lock = new Gpio(4, 'out');
  if (payload.magic === 'open') {
    console.log('ok, i\'ll open your lock');
    setTimeout(() => {
      lock.writeSync(1);
      lock.unexport();
    }, 500);
  }
});

device.on('error', function(error) {
  console.log('me feriu aqui, ó');
  console.log('error', error);
});

