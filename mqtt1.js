const mqtt = require('mqtt');

const brokerUrl = 'mqtt//:gp2023@duckdns.org:1883'; //mqtt://your-ejabberd-mqtt-broker-address
const clientId = 'testsub@duckdns.org';

const client = mqtt.connect(brokerUrl, {
  clientId: clientId,
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  // Your logic after connecting
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  // Your logic to handle incoming messages
});

// Subscribe to a topic
const topic = 'test/1';
client.subscribe(topic, (err) => {
  if (!err) {
    console.log(`Subscribed to ${topic}`);
  }
});

// Publish a message
const message = 'Hello, MQTT!';
client.publish(topic, message);

// Handle errors
client.on('error', (error) => {
  console.error('MQTT error:', error);
});
