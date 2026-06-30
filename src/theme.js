// All visual design lives here: colors, fonts, spacing, and per-component
// style objects. Edit this file to change how the tracker looks without
// touching any of the app logic in App.jsx.

// ── Color palette ──────────────────────────────────────────────────────
// Pulled from data.alexischao.com's existing dashboard styling.
export const palette = {
  c1: "#ffe0e9", // lightest pink — tints, hover backgrounds
  c2: "#ffc2d4", // light pink — borders
  c3: "#ff9ebb", // mid-light pink — muted text, placeholders
  c4: "#ff7aa2", // mid pink — Reporting & Communication domain
  c5: "#e05780", // rose — Incident Response domain
  c6: "#b9375e", // primary rose — buttons, links, accents
  c7: "#8a2846", // dark rose — secondary text, labels
  c8: "#602437", // deep plum-rose — Vulnerability Management domain
  c9: "#522e38", // darkest — primary body text
  bg: "#fdf6f8", // page background
  white: "#fff",
  success: "#3F8F5F",
  successText: "#2D6B45",
  danger: "#C24444",
  dangerText: "#A23333",
};

// ── Domains ────────────────────────────────────────────────────────────
// Each CySA+ domain's display color, short label, and exam weight.
export const DOMAINS = {
  "Security Operations": { color: palette.c6, short: "SecOps", weight: "33%" },
  "Vulnerability Management": { color: palette.c7, short: "VulnMgmt", weight: "30%" },
  "Incident Response": { color: palette.c5, short: "IR", weight: "20%" },
  "Reporting & Communication": { color: palette.c4, short: "Reporting", weight: "17%" },
};

// ── Typography ─────────────────────────────────────────────────────────
export const fontFamily = "'Poppins', sans-serif";

// ── Component styles ───────────────────────────────────────────────────
// `c.opt` takes `revealed` as an explicit second argument (rather than
// closing over component state) so this object can live outside the
// component and stay a plain, static export.
export const c = {
  app: { minHeight: "100vh", background: palette.bg, color: palette.c9, fontFamily },
  hdr: { padding: "24px 24px 0", borderBottom: `1px solid ${palette.c2}`, background: palette.white },
  title: { fontSize: "19px", fontWeight: "700", color: palette.c9, letterSpacing: "-0.01em", margin: "0 0 2px", fontFamily },
  sub: { fontSize: "10px", color: palette.c7, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px", fontWeight: "600" },
  tabs: { display: "flex" },
  tab: (a) => ({ padding: "10px 18px", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", background: "none", border: "none", color: a ? palette.c6 : palette.c7, borderBottom: a ? `2px solid ${palette.c6}` : "2px solid transparent", fontFamily, fontWeight: a ? "700" : "500", transition: "all 0.2s" }),
  body: { padding: "20px" },
  card: { background: palette.white, border: `1px solid ${palette.c1}`, borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 2px rgba(122,35,72,0.04)" },
  statRow: { display: "flex", gap: "10px", marginBottom: "16px" },
  sBox: (color) => ({ flex: 1, background: palette.white, borderLeft: `3px solid ${color}`, border: `1px solid ${palette.c1}`, borderLeftWidth: "3px", borderLeftColor: color, borderRadius: "8px", padding: "12px 10px", textAlign: "center", boxShadow: "0 1px 2px rgba(122,35,72,0.04)" }),
  sNum: () => ({ fontSize: "24px", fontWeight: "700", color: palette.c9, display: "block", fontFamily }),
  sLbl: { fontSize: "8px", color: palette.c7, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700" },
  sec: { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: palette.c7, marginBottom: "10px", fontWeight: "700" },
  opt: (state, revealed) => ({
    width: "100%", textAlign: "left", padding: "11px 13px", marginBottom: "7px", borderRadius: "7px",
    border: `1px solid ${state === "correct" ? palette.success : state === "wrong" ? palette.danger : state === "selected" ? palette.c6 : palette.c2}`,
    background: state === "correct" ? "rgba(63,143,95,0.07)" : state === "wrong" ? "rgba(194,68,68,0.07)" : state === "selected" ? "rgba(194,68,122,0.06)" : palette.white,
    color: state === "correct" ? palette.successText : state === "wrong" ? palette.dangerText : palette.c9,
    cursor: revealed ? "default" : "pointer", fontSize: "12px", fontFamily, lineHeight: "1.55", transition: "all 0.2s",
  }),
  btn: (col) => ({ width: "100%", padding: "12px", background: col === palette.c6 ? palette.c6 : `${col}14`, border: `1px solid ${col}`, borderRadius: "8px", color: col === palette.c6 ? palette.white : col, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily, fontWeight: "700", marginTop: "6px" }),
  domTag: (d) => ({ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "700", background: `${DOMAINS[d]?.color || "#888"}16`, border: `1px solid ${DOMAINS[d]?.color || "#888"}40`, color: DOMAINS[d]?.color || "#888", marginBottom: "6px", marginRight: "6px" }),
  objTag: () => ({ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "8px", letterSpacing: "0.06em", background: palette.c1, border: `1px solid ${palette.c2}`, color: palette.c7, marginBottom: "8px", fontWeight: "600" }),
  expl: { background: palette.c1, border: `1px solid ${palette.c2}`, borderRadius: "8px", padding: "13px", marginTop: "10px", fontSize: "11px", color: palette.c7, lineHeight: "1.7" },
  sel: { background: palette.white, border: `1px solid ${palette.c2}`, borderRadius: "7px", color: palette.c9, padding: "9px 11px", fontSize: "11px", fontFamily, width: "100%", marginBottom: "10px", cursor: "pointer" },
  textarea: { background: palette.white, border: `1px solid ${palette.c2}`, borderRadius: "7px", color: palette.c9, padding: "10px 11px", fontSize: "11px", fontFamily, width: "100%", marginBottom: "10px", resize: "vertical", lineHeight: "1.6", boxSizing: "border-box" },
  label: { fontSize: "8px", color: palette.c7, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "5px", display: "block", fontWeight: "700" },
  toggleRow: { display: "flex", gap: "8px", marginBottom: "10px" },
  togRow: { display: "flex", gap: "6px", marginBottom: "14px" },
  tog: (a) => ({ flex: 1, padding: "7px", background: a ? palette.c6 : palette.bg, border: `1px solid ${a ? palette.c6 : palette.c2}`, borderRadius: "6px", color: a ? palette.white : palette.c7, fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily, fontWeight: "700", textAlign: "center" }),
  histItem: (ok) => ({ padding: "9px 11px", borderRadius: "7px", marginBottom: "5px", background: ok ? "rgba(63,143,95,0.05)" : "rgba(194,68,68,0.05)", border: `1px solid ${ok ? "rgba(63,143,95,0.18)" : "rgba(194,68,68,0.18)"}`, fontSize: "10px" }),
};
