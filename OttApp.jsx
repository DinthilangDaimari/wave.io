import { useState, useMemo } from "react";

// Replace `video` URLs and gradients with your real data / API.
const TITLES = [
  { id: 1, title: "Monsoon Line", genre: "Drama", year: 2025, rating: "U/A 13+", mins: 118, c: ["#1f6f78", "#0e2a32"], desc: "A night-train conductor uncovers a secret that could stop the city's last line.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 2, title: "Paper Kingdom", genre: "Animation", year: 2024, rating: "U", mins: 96, c: ["#f2a93b", "#8a3b12"], desc: "Two siblings fold their way into a world made of origami.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 3, title: "Static", genre: "Thriller", year: 2026, rating: "A", mins: 104, c: ["#5a3e8a", "#1b1330"], desc: "A radio host starts receiving calls from tomorrow.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 4, title: "Last Over", genre: "Sports", year: 2023, rating: "U", mins: 132, c: ["#3c8d4f", "#123524"], desc: "A small-town team, one ball left, and a final nobody expected.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 5, title: "Salt & Saffron", genre: "Drama", year: 2024, rating: "U/A 7+", mins: 110, c: ["#e4572e", "#5c1a0b"], desc: "Three generations, one kitchen, and a recipe nobody wrote down.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 6, title: "Deep Signal", genre: "Sci-Fi", year: 2026, rating: "U/A 13+", mins: 124, c: ["#2a5bd7", "#0a1a4a"], desc: "A research crew hears something answering from the ocean floor.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 7, title: "Gully Beats", genre: "Music", year: 2025, rating: "U", mins: 92, c: ["#d63a8a", "#4a0f2e"], desc: "Street drummers compete for one spot on a national stage.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 8, title: "Cold Harbour", genre: "Thriller", year: 2022, rating: "A", mins: 115, c: ["#6b7f8c", "#1a2229"], desc: "A harbour inspector finds a ship that was never registered.", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

const ROWS = [
  { name: "Trending now", ids: [3, 6, 1, 5, 2] },
  { name: "Drama", ids: [1, 5] },
  { name: "Thrillers", ids: [3, 8] },
  { name: "Family & animation", ids: [2, 7, 4] },
];

const css = `
.ott{--bg:#0e2a32;--ink:#f3eee4;--mute:#9db3b8;--gold:#f2a93b;min-height:100vh;background:var(--bg);color:var(--ink);font-family:"Trebuchet MS",system-ui,sans-serif}
.ott *{box-sizing:border-box}
.ott header{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:14px 5vw;position:sticky;top:0;background:#0e2a32ee;z-index:5}
.ott .logo{font:700 22px Georgia,serif;letter-spacing:.5px}
.ott input{background:#ffffff14;border:1px solid #ffffff30;color:var(--ink);border-radius:999px;padding:9px 16px;width:min(280px,50vw)}
.ott input:focus-visible,.ott button:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.ott .tabs{display:flex;gap:6px}
.ott .tab{background:none;border:0;color:var(--mute);padding:8px 12px;cursor:pointer;border-radius:8px;font-size:14px}
.ott .tab[aria-pressed=true]{color:var(--ink);background:#ffffff18}
.ott .hero{margin:8px 5vw 0;border-radius:18px;padding:clamp(24px,6vw,64px);min-height:300px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px}
.ott .hero h1{font:700 clamp(34px,7vw,64px)/1 Georgia,serif;margin:0}
.ott .hero p{max-width:52ch;margin:0;color:#f3eee4e0;line-height:1.5}
.ott .btn{border:0;border-radius:10px;padding:11px 20px;font-weight:700;cursor:pointer;background:var(--gold);color:#2a1700}
.ott .btn.ghost{background:#ffffff1f;color:var(--ink)}
.ott .acts{display:flex;gap:10px;margin-top:6px;flex-wrap:wrap}
.ott section{padding:22px 5vw 0}
.ott h2{font-size:18px;margin:0 0 12px}
.ott .row{display:flex;gap:14px;overflow-x:auto;padding-bottom:10px;scroll-snap-type:x proximity}
.ott .card{flex:0 0 160px;height:230px;border-radius:12px;border:0;padding:12px;text-align:left;color:var(--ink);cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;scroll-snap-align:start;transition:transform .15s}
.ott .card:hover{transform:translateY(-4px)}
.ott .card b{font:700 16px Georgia,serif}
.ott .card span{font-size:12px;color:#f3eee4cc}
.ott .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.ott .grid .card{flex:none;width:100%}
.ott .empty{color:var(--mute);padding:30px 0}
.ott .modal{position:fixed;inset:0;background:#000b;display:grid;place-items:center;padding:16px;z-index:10}
.ott .sheet{background:#13363f;border-radius:16px;width:min(720px,100%);max-height:92vh;overflow:auto}
.ott .sheet video{width:100%;display:block;background:#000;border-radius:16px 16px 0 0;aspect-ratio:16/9}
.ott .info{padding:18px 22px 22px;display:grid;gap:8px}
.ott .meta{color:var(--mute);font-size:13px}
@media (prefers-reduced-motion:reduce){.ott .card{transition:none}}
`;

export default function OttApp() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("home");
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(null);

  const byId = (id) => TITLES.find((t) => t.id === id);
  const toggleList = (id) => setList((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const feature = TITLES[2];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? TITLES.filter((t) => (t.title + t.genre).toLowerCase().includes(q)) : null;
  }, [query]);

  const Card = ({ t }) => (
    <button className="card" style={{ background: `linear-gradient(160deg, ${t.c[0]}, ${t.c[1]})` }} onClick={() => setOpen(t)} aria-label={`Open ${t.title}`}>
      <b>{t.title}</b>
      <span>{t.genre}, {t.year}</span>
    </button>
  );

  const showGrid = results || tab === "list";
  const gridItems = results || list.map(byId);

  return (
    <div className="ott">
      <style>{css}</style>
      <header>
        <span className="logo">Reelhouse</span>
        <div className="tabs">
          <button className="tab" aria-pressed={tab === "home"} onClick={() => setTab("home")}>Home</button>
          <button className="tab" aria-pressed={tab === "list"} onClick={() => setTab("list")}>My list ({list.length})</button>
        </div>
        <input type="search" placeholder="Search titles or genres" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
      </header>

      {!showGrid && (
        <div className="hero" style={{ background: `linear-gradient(135deg, ${feature.c[0]}, ${feature.c[1]})` }}>
          <h1>{feature.title}</h1>
          <p>{feature.desc}</p>
          <div className="acts">
            <button className="btn" onClick={() => setOpen(feature)}>Play</button>
            <button className="btn ghost" onClick={() => toggleList(feature.id)}>{list.includes(feature.id) ? "Remove from list" : "Add to list"}</button>
          </div>
        </div>
      )}

      {showGrid ? (
        <section>
          <h2>{results ? `Results for "${query}"` : "My list"}</h2>
          {gridItems.length ? (
            <div className="grid">{gridItems.map((t) => <Card key={t.id} t={t} />)}</div>
          ) : (
            <p className="empty">{results ? "No titles match. Try a different word or genre." : "Nothing here yet. Open a title and choose Add to list."}</p>
          )}
        </section>
      ) : (
        ROWS.map((r) => (
          <section key={r.name}>
            <h2>{r.name}</h2>
            <div className="row">{r.ids.map((id) => <Card key={id} t={byId(id)} />)}</div>
          </section>
        ))
      )}

      {open && (
        <div className="modal" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <video src={open.video} controls autoPlay playsInline />
            <div className="info">
              <h2 style={{ margin: 0 }}>{open.title}</h2>
              <div className="meta">{open.year}, {open.rating}, {open.mins} min, {open.genre}</div>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{open.desc}</p>
              <div className="acts">
                <button className="btn" onClick={() => toggleList(open.id)}>{list.includes(open.id) ? "Remove from list" : "Add to list"}</button>
                <button className="btn ghost" onClick={() => setOpen(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
