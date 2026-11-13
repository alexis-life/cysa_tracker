import { useMemo, useState } from "react";
import { c, palette } from "./theme";
import resources from "./data/resources.json";

const CATEGORIES = [];
const RESOURCES_BY_OBJECTIVE = {};

for (const resource of resources) {
  if (!CATEGORIES.includes(resource.category)) CATEGORIES.push(resource.category);
  for (const objectiveId of resource.objectives || []) {
    if (!RESOURCES_BY_OBJECTIVE[objectiveId]) RESOURCES_BY_OBJECTIVE[objectiveId] = [];
    RESOURCES_BY_OBJECTIVE[objectiveId].push(resource);
  }
}

function isDead(resource) {
  return resource.status === "dead";
}

function safeHttpUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url) ? url : null;
}

function formatLocator(resource) {
  const pages = (resource.pages || []).map(String);
  const pageText = pages.length === 0 ? "" : pages.length === 1 ? `p. ${pages[0]}` : `pp. ${pages.join(", ")}`;
  const chapter = resource.chapter
    ? /^\d/.test(String(resource.chapter)) ? `Ch ${resource.chapter}` : String(resource.chapter)
    : "";
  return [chapter, pageText].filter(Boolean).join(" · ");
}

function matchesQuery(resource, query) {
  if (!query) return true;
  const haystack = [
    resource.title,
    resource.description,
    resource.category,
    resource.chapter,
    ...(resource.pages || []).map(String),
    ...(resource.objectives || []),
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

const deadBadge = {
  display: "inline-block",
  padding: "2px 7px",
  borderRadius: "20px",
  fontSize: "8px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: "700",
  color: "#7a6570",
  background: "#f3eef0",
  border: "1px solid #e4d7dc",
};

const objPill = {
  display: "inline-block",
  padding: "2px 7px",
  borderRadius: "20px",
  fontSize: "8px",
  letterSpacing: "0.04em",
  fontWeight: "700",
  background: palette.c1,
  border: `1px solid ${palette.c2}`,
  color: palette.c7,
};

function ResourceTitle({ resource }) {
  const href = isDead(resource) ? null : safeHttpUrl(resource.url);
  if (!href) {
    return (
      <span style={{ fontSize: "12px", fontWeight: "600", color: "#7a6570" }}>
        {resource.title}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: "12px", fontWeight: "600", color: palette.c6, textDecoration: "none" }}
    >
      {resource.title}
    </a>
  );
}

function ResourceItem({ resource, last }) {
  const dead = isDead(resource);
  return (
    <div style={{ padding: "9px 0", borderBottom: last ? "none" : `1px solid ${palette.c1}` }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        <ResourceTitle resource={resource} />
        {dead && <span style={deadBadge}>dead link</span>}
      </div>
      <div style={{ fontSize: "11px", lineHeight: "1.5", marginTop: "3px", color: dead ? "#7a6570" : palette.c9 }}>
        {resource.description}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginTop: "6px" }}>
        <span style={{ fontSize: "9px", color: dead ? "#7a6570" : palette.c7, fontWeight: "600" }}>
          {formatLocator(resource)}
        </span>
        {(resource.objectives || []).map((id) => (
          <span key={id} style={objPill}>{id}</span>
        ))}
      </div>
    </div>
  );
}

export function BookResourceLinks({ objectiveId }) {
  const items = RESOURCES_BY_OBJECTIVE[objectiveId];
  if (!items || items.length === 0) return null;
  return (
    <details style={{ marginBottom: "8px", border: `1px solid ${palette.c2}`, borderRadius: "8px", background: palette.white, padding: "6px 10px" }}>
      <summary style={{ cursor: "pointer", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: palette.c6, fontWeight: "700" }}>
        Links from the book ({items.length})
      </summary>
      <ul style={{ margin: "8px 0 0", paddingLeft: "16px", fontSize: "10px", color: palette.c9, lineHeight: "1.45" }}>
        {items.map((resource) => {
          const dead = isDead(resource);
          const href = dead ? null : safeHttpUrl(resource.url);
          return (
            <li key={resource.url} style={{ marginBottom: "4px", color: dead ? "#7a6570" : palette.c9 }}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: palette.c6, fontWeight: "600", textDecoration: "none" }}>
                  {resource.title}
                </a>
              ) : (
                <span style={{ fontWeight: "600" }}>
                  {resource.title}
                  {dead ? " (dead link)" : ""}
                </span>
              )}
              <span style={{ color: dead ? "#7a6570" : palette.c7 }}> — {resource.description}</span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const normalized = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    const visible = resources.filter((resource) => {
      if (category !== "all" && resource.category !== category) return false;
      return matchesQuery(resource, normalized);
    });
    return CATEGORIES
      .map((name) => ({ name, items: visible.filter((resource) => resource.category === name) }))
      .filter((group) => group.items.length > 0);
  }, [category, normalized]);

  const shown = grouped.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <div style={{ fontSize: "11px", color: palette.c7, lineHeight: "1.5", marginBottom: "12px" }}>
        External links cited in the Sybex CS0-003 study guide. {resources.length} links, grouped by what they are for.
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, description, or objective"
          aria-label="Search resources"
          style={{ ...c.sel, flex: "1 1 220px", width: "auto", minWidth: "180px", marginBottom: 0, boxSizing: "border-box" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          style={{ ...c.sel, flex: "0 1 240px", width: "auto", minWidth: "160px", marginBottom: 0 }}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: "9px", color: palette.c3, marginBottom: "14px", fontWeight: "600" }}>
        {shown === resources.length ? `${shown} links` : `${shown} of ${resources.length} links`}
      </div>

      {shown === 0 && (
        <div style={{ color: palette.c3, fontSize: "11px", textAlign: "center", padding: "36px 0" }}>
          No links match that filter.
        </div>
      )}

      {grouped.map((group) => (
        <div key={group.name} style={c.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
            <div style={{ ...c.sec, marginBottom: 0 }}>{group.name}</div>
            <div style={{ fontSize: "9px", color: palette.c7, fontWeight: "700" }}>{group.items.length}</div>
          </div>
          {group.items.map((resource, index) => (
            <ResourceItem key={resource.url} resource={resource} last={index === group.items.length - 1} />
          ))}
        </div>
      ))}
    </>
  );
}
