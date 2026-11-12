/**
 * Dev utility: creates an Ethereal test inbox and writes its SMTP
 * credentials to a JSON file so local runs of the server can exercise the
 * real Nodemailer path. Run from the project root:
 *   node scripts/dev-tests/make-ethereal-account.mjs .tmp/smtp.json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import nodemailer from "nodemailer";

const out = process.argv[2] ?? ".tmp/smtp.json";
mkdirSync(dirname(out), { recursive: true });

const account = await nodemailer.createTestAccount();

writeFileSync(
  out,
  JSON.stringify(
    {
      smtp: account.smtp,
      user: account.user,
      pass: account.pass,
      webUser: account.user,
      webPass: account.pass,
    },
    null,
    2,
  ),
);
console.log(`Ethereal test account saved to ${out}`);
console.log(`SMTP: ${account.smtp.host}:${account.smtp.port} user=${account.user}`);
