import fs from "node:fs";

// OpenNext copies every value from .env* into .open-next/cloudflare/next-env.mjs.
// These four are stored as Worker secrets instead, so remove them from the
// generated bundle before deploy. Runtime still receives them via env bindings.
const SECRET_KEYS = [
  "CLOUDFLARE_D1_TOKEN",
  "CLOUDFLARE_R2_ACCESS_KEY_ID",
  "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
  "HTTPSMS_API_KEY",
];

const file = ".open-next/cloudflare/next-env.mjs";
const source = fs.readFileSync(file, "utf8");
let removed = false;

const output = source.replace(
  /export const (production|development|test) = (\{.*\});/g,
  (match, mode, json) => {
    const values = JSON.parse(json);
    let touched = false;
    for (const key of SECRET_KEYS) {
      if (key in values) {
        delete values[key];
        touched = true;
      }
    }
    if (!touched) return match;
    removed = true;
    return `export const ${mode} = ${JSON.stringify(values)};`;
  }
);

if (removed) {
  fs.writeFileSync(file, output);
  console.log("Removed secret values from generated env bundle.");
} else {
  console.log("Generated env bundle contains no secret values.");
}
