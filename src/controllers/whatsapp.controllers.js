import Whatsapp from "whatsapp-web.js";
const { Client, RemoteAuth } = Whatsapp;
import { toDataURL } from "qrcode";
import { authenticateSchema } from "../validations/whatsapp.validations.js";
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";
import { handleMessage } from "../services/eztor.service.js";
import { sendMessageToClient } from "../helpers/functions.js";

const clients = {};

const store = new MongoStore({ mongoose: mongoose });

export const authenticate = async (req, res) => {
  try {
    const { error } = authenticateSchema(req.body);
    if (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    const { client_id } = req.body;

    if (clients[client_id]) {
      return res.status(200).json({
        success: true,
        message: "Client already authenticated.",
      });
    }

    const client = new Client({
      authStrategy: new RemoteAuth({
        store,
        clientId: client_id,
        backupSyncIntervalMs: 300000,
      }),
      puppeteer: {
        dumpio: false,
        args: [
          "--no-sandbox",
          "--no-zygote",
          "--disable-cache",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-setuid-sandbox",
          "--js-flags=--expose-gc",
        ],
        headless: true,
      },
    });

    client.initialize();

    client.on("qr", async (qr) => {
      res.send(`<img src=${await toDataURL(qr)} alt="QR Code" />`);
    });

    clientEvents(client, client_id);
  } catch (error) {
    console.log("error", error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { client_id, phone_number, message } = req.body;

    let client = clients[client_id];

    if (!client) {
      client = new Client({
        authStrategy: new RemoteAuth({
          store,
          clientId: client_id,
          backupSyncIntervalMs: 300000,
        }),
        puppeteer: {
          dumpio: false,
          args: [
            "--no-sandbox",
            "--no-zygote",
            "--disable-cache",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--disable-setuid-sandbox",
            "--js-flags=--expose-gc",
          ],
          headless: true,
          Viewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
        },
      });

      clientEvents(client, client_id);

      client.on("ready", () => {
        console.log("Client is ready 1");
        sendMessageToClient(client, phone_number, message, res);
      });
      client.initialize();
    } else {
      sendMessageToClient(client, phone_number, message, res);
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

function clientEvents(client, client_id) {
  client.on("auth_failure", (message) => {
    console.log("Inside Auth failure event", message);
  });

  client.on("authenticated", async () => {
    console.log("Inside Authenticated event");
  });

  client.on("remote_session_saved", () => {
    console.log("remote_session_saved");
    clients[client_id] = client;
  });

  client.on("ready", () => {
    console.log("Client is ready");
  });

  client.on("message", async (message) => {
    if (message.from == "status@broadcast" || message.hasMedia || !message.body)
      return;

    const handleMessageResponse = await handleMessage({
      client_id,
      message: message.body,
    });
    if (!handleMessageResponse.success || !handleMessageResponse.data) return;

    client.sendMessage(message.from, handleMessageResponse.data);
  });

  client.on("disconnected", (reason) => {
    console.log("Client disconnected:", reason);
  });
}
