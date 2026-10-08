import { useState } from "react";

type ColumnId = "todo" | "doing" | "done";
const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "In progress" },
  { id: "done", title: "Done" },
];
const NEXT: Record<ColumnId, ColumnId | null> = { todo: "doing", doing: "done", done: null };

interface Card {
  id: number;
  title: string;
  column: ColumnId;
}

let nextId = 5;
const seed: Card[] = [
  { id: 1, title: "Sketch the onboarding flow", column: "todo" },
  { id: 2, title: "Wire up the settings page", column: "doing" },
  { id: 3, title: "Fix the mobile header", column: "todo" },
  { id: 4, title: "Ship the changelog", column: "done" },
];

export default function App() {
  const [cards, setCards] = useState<Card[]>(seed);
  const [draft, setDraft] = useState("");

  function addCard(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const card: Card = { id: nextId++, title, column: "todo" };
    setCards((c) => [...c, card]);
    setDraft("");
    // The handler logs the action.
    console.log("card_added", { id: card.id });
  }

  function moveCard(id: number) {
    setCards((c) =>
      c.map((card) => {
        if (card.id !== id) return card;
        const to = NEXT[card.column];
        if (!to) return card;
        console.log(to === "done" ? "card_completed" : "card_moved", { id, to });
        return { ...card, column: to };
      }),
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--accent)" }} />
        <strong style={{ fontSize: 17 }}>Trellis</strong>
      </header>

      <form onSubmit={addCard} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a card to To do…"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: "1px solid var(--line)", fontSize: 15, background: "#fff" }}
        />
        <button type="submit" style={{ padding: "10px 18px", borderRadius: 9, border: 0, background: "var(--accent)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Add
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {COLUMNS.map((col) => (
          <section key={col.id} style={{ background: "#eef1f5", borderRadius: 12, padding: 12, minHeight: 220 }}>
            <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", margin: "4px 6px 12px" }}>
              {col.title}
            </h2>
            <div style={{ display: "grid", gap: 10 }}>
              {cards
                .filter((c) => c.column === col.id)
                .map((card) => (
                  <article key={card.id} style={{ background: "var(--card)", borderRadius: 10, border: "1px solid var(--line)", padding: "11px 12px" }}>
                    <p style={{ margin: "0 0 10px", fontSize: 14 }}>{card.title}</p>
                    {NEXT[card.column] && (
                      <button
                        onClick={() => moveCard(card.id)}
                        style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid var(--line)", background: "#fff", fontSize: 12.5, cursor: "pointer", color: "var(--accent)" }}
                      >
                        {NEXT[card.column] === "done" ? "Mark done →" : "Move to In progress →"}
                      </button>
                    )}
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
