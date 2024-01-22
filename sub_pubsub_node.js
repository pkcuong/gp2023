const { client, xml, jid } = require("@xmpp/client");
const { v4: uuidv4 } = require("uuid");
const { XMPP_SERVER_ADDRESS } = require("./env");

async function initClient(username, password) {
  const xmpp = new client({
    service: XMPP_SERVER_ADDRESS, // xmpp://<XMPP-SERVER-ADDRESS>
    domain: "gp2023.duckdns.org", // DOMAIN
    username: username, // USERNAME
    password: password, // PASSWORD
  });

  // Error handling
  xmpp.on("error", (err) => {
    console.error("Error", err);
  });

  // Check for incoming stanzas
  xmpp.on("stanza", (stanza) => {
    console.log("Incoming stanza: ", stanza.toString());
  });

  // Check if client is connected
  xmpp.on("online", (address) => {
    console.log("online", address);
  });

  await xmpp.start(); // Connect to the XMPP server
  return xmpp;
}
function Sub_pubsub_node(client, username,jid, node) {
  // Subscibe a pubsub node
  const nodeName = `/home/gp2023.duckdns.org/huy/${node}`; 
  const JID = `${jid}`;
  // Create XML for subscribe a pubsub node
  const xmlSubNode = xml(
    "iq",
    {
      type: "set",
      to: "pubsub.gp2023.duckdns.org",
      id: getUuid(), // Arbitrary ID
    },
    xml(
      "pubsub",
      { xmlns: "http://jabber.org/protocol/pubsub" },
      xml("subscribe", { node: nodeName }, { jid: JID})
      
    )
  );
  return xmlSubNode;
}

async function main() {
  const username = "testsub"; // USERNAME
  const password = "1" // PASSWORD
  const client = await initClient(username, password);
  const nodename = "test3";
  const JID = "testpub@gp2023.duck.dns.org";
  const xmlSubNode = Sub_pubsub_node(client, username, JID, nodename);
  await client.send(xmlSubNode);
}

main();

// Utils
function getUuid() {
  return uuidv4().split("-").join("");
}