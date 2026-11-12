/**
 * Dev utility: logs into an Ethereal test inbox over IMAP and prints the
 * most recent message (subject, from, attachments, plain-text head).
 *   node scripts/dev-tests/check-ethereal-inbox.mjs .tmp/smtp.json
 */
import { readFileSync } from "node:fs";
import tls from "node:tls";

const cfg = JSON.parse(readFileSync(process.argv[2] ?? ".tmp/smtp.json", "utf8"));
const IMAP_HOSTS = ["smtp.ethereal.email", "imap.ethereal.email"];

const socket = await new Promise((resolve, reject) => {
  for (const host of IMAP_HOSTS) {
    const sock = tls.connect({ host, port: 993, rejectUnauthorized: false });
    sock.once("secureConnect", () => resolve(sock));
    sock.once("error", () => {
      /* try next host */
    });
  }
  setTimeout(() => reject(new Error("no IMAP host reachable")), 10000);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});

let buffer = "";
const lines = [];

function send(cmd) {
  return new Promise((resolve) => {
    const tag = `a${crypto.randomUUID().slice(0, 8)}`;
    buffer = "";
    socket.write(`${tag} ${cmd}\r\n`);
    // finish once the tagged response arrives
    const check = setInterval(() => {
      if (buffer.includes(`${tag} `)) {
        clearInterval(check);
        resolve(buffer);
      }
    }, 50);
  });
}

socket.setEncoding("utf8");
socket.on("data", (chunk) => {
  buffer += chunk;
  if (buffer.length > 5000) lines.push(buffer);
});

await send(`LOGIN ${cfg.user} ${cfg.pass}`);
await send(`SELECT INBOX`);
const search = await send(`SEARCH ALL`);
console.log("SEARCH:", search.trim().slice(0, 300));

const seqs = search.match(/SEARCH ([0-9 ]+)/);
if (seqs) {
  const last = seqs[1].trim().split(" ").pop();
  const fetch = await send(`FETCH ${last} (BODY[HEADER.FIELDS (SUBJECT FROM)] BODYSTRUCTURE)`);
  console.log("FETCH:", fetch.trim().slice(0, 800));
}

socket.write("a99 LOGOUT\r\n");
socket.end();
