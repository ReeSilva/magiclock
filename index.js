const awsIot = require('aws-iot-device-sdk');
const { Gpio } = require('onoff');

const device = awsIot.device({
  keyPath: './certs/MagicLock.private.key',
  certPath: './certs/MagicLock.cert.pem',
  caPath: './certs/root-CA.crt',
  clientId: 'MagicLockInitial',
  host: 'aj5n8a300b2x9.iot.us-east-1.amazonaws.com',
  keepalive: 120
});

console.log('comecei');

device.on('connect', () => {
  console.log('conectei');
  device.subscribe('magiclock/open');
  console.log('me inscrevi');
  device.publish('magiclock/thing', JSON.stringify({ status: 'I\'m alive' }));
});

device.on('message', (topic, payload) => {
  const lock = new Gpio(4, 'out');
  const message = JSON.parse(payload.toString());
  console.log(message);
  if (message.magic === 'open') {
    console.log('ok, i\'ll open your lock');
    lock.writeSync(1);
    setTimeout(() => {
      console.log('desligando');
      lock.writeSync(0);
      console.log('unexport');
      lock.unexport();
    }, 500);
  }
});

device.on('error', function(error) {
  console.log('me feriu aqui, ó');
  console.log('error', error);
});

