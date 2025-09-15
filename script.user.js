// ==UserScript==
// @name         Battle Cats Pull Decoder
// @namespace    https://battle-cats.fandom.com/
// @version      0.2
// @description  Type slot codes like “A1-A10 B11-B13 A10G” → unit names, comma-separated & lower-case.
// @match        *://bc.godfat.org/*
// @match        *://battle-cats.fandom.com/*
// @match        *://battlecats.miraheze.org/*
// @grant        none
// ==/UserScript==

(() => {
    "use strict";

    const codeToName = {};
    document.querySelectorAll("td.cat").forEach((td) => {
        const pickID = td
            .getAttribute("onclick")
            ?.match(/pick\('([^']+)'\)/)?.[1];
        if (!pickID) return;
        const name = td
            .querySelector("a:not([href*='/cats/'])")
            ?.textContent.trim();
        if (name) codeToName[pickID] = name.toLowerCase();
    });

    /* ---------- 2. UI container ---------- */
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        right: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        width: "260px",
        background: "rgba(0,0,0,.75)",
        color: "#fff",
        padding: ".5rem",
        borderRadius: ".5rem",
        fontFamily: "sans-serif",
        zIndex: 9999,
    });
    box.innerHTML = `
    <label style="font-weight:bold;font-size:.8rem">codes</label>
    <textarea id="bc-in" rows="2" style="width:100%;resize:vertical;min-width:0px;"></textarea>
    <label style="font-weight:bold;font-size:.8rem;margin-top:.4rem;display:block">names</label>
    <textarea id="bc-out" rows="2" style="width:100%;min-width:0px;" readonly></textarea>
  `;
    document.body.append(box);

    /* ---------- 3. helpers ---------- */
    const normalize = (tok) => {
        const m = tok.match(/^([AB])(\d+)(G?)$/i);
        return m ? `${m[2]}${m[1].toUpperCase()}${m[3] ? "G" : ""}` : null;
    };

    const expand = (rng) => {
        const [a, b] = rng.split("-");
        const m1 = a.match(/^([AB])(\d+)$/i);
        const m2 = b.match(/^([AB])?(\d+)$/i);
        if (!m1 || !m2) return [];
        const letter = m1[1].toUpperCase();
        const n1 = +m1[2],
            n2 = +m2[2];
        return Array.from({ length: n2 - n1 + 1 }, (_, i) =>
            normalize(`${letter}${n1 + i}`)
        );
    };

    /* ---------- 4. main logic ---------- */
    const $in = box.querySelector("#bc-in"),
        $out = box.querySelector("#bc-out");

    $in.addEventListener("input", () => {
        const tokens = $in.value
            .trim()
            .replace(/[,;\n]+/g, " ")
            .split(/\s+/)
            .filter(Boolean);

        const codes = tokens
            .flatMap((t) => (t.includes("-") ? expand(t) : normalize(t)))
            .filter(Boolean);
        $out.value = codes
            .map((c) => codeToName[c])
            .filter(Boolean)
            .join(", ");
    });
})();
