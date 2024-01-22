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
/*
function để subscribe 1 node. cần jid của node subscriber
function Sub_pubsub_node(client, username,jid, node) {
  // Subscibe a pubsub node
  const nodeName = `/home/gp2023.duckdns.org/huy/${node}`; 
  const JID = `admin@gp2023.duckdns.org`;
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
      xml("subscribe", { node: nodeName, jid: JID })
      
    )
  );
  return xmlSubNode;
}*/

//function để publish từ 1 node. title và summary là content bên trong  
function publish_to_pubsub(client, username, node, title, summary) {
  // Pubsub node name
  const nodeName = `/home/gp2023.duckdns.org/${username}/${node}`;
  // Create XML for publishing an item
  const xmlPublishNode = xml(
    "iq",
    {
      type: "set",
      to: "pubsub.gp2023.duckdns.org",
      id: getUuid(), // Arbitrary ID
    },
    xml(
      "pubsub",
      { xmlns: "http://jabber.org/protocol/pubsub" },
      xml(
        "publish",
        { node: nodeName },
        xml(
          "item",
          {},
          xml(
            "entry",
            { xmlns: "http://www.w3.org/2005/Atom" },
            xml("title", {}, title),
            xml("summary", {}, summary)
          )
        )
      )
    )
  );

  return xmlPublishNode;
}


async function main() {
  const username = "huy"; // USERNAME
  const password = "1" // PASSWORD
  const client = await initClient(username, password);
  const nodename = "test3";
  const title = "greetings";
  const summary = "hello"; 
  // đây là phần dành cho subscriber
  //const xmlSubNode = Sub_pubsub_node(client, username, JID, nodename);
  //await client.send(xmlSubNode);
  const xmlPublishNode = publish_to_pubsub(client, username, nodename, title, summary);
  await client.send(xmlPublishNode);
}

main();

// Utils
function getUuid() {
  return uuidv4().split("-").join("");
}