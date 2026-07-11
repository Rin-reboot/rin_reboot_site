import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the portfolio as static HTML", async () => {
  const html = await readFile(new URL("out/index.html", root), "utf8");

  assert.match(html, /<title>Rin — Frontend Engineer<\/title>/i);
  assert.match(html, /Interfaces, systems, and everything between\./);
  assert.match(html, /pure_board/);
  assert.match(html, /log_total/);
  assert.match(html, /chatapp/);
  assert.doesNotMatch(html, /_next\/image|fonts\.googleapis|fonts\.gstatic|codex-preview/);
});

test("ships all local assets required by the page", async () => {
  await Promise.all([
    access(new URL("out/avatar.jpg", root)),
    access(new URL("out/og.png", root)),
  ]);
});
