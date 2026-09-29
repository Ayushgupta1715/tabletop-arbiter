# ⚖️ TableTop Arbiter — Eliminating Rulebook Hallucinations with Sanity Context MCP & Structured Errata Lakes

*DEV Community x Sanity Challenge Submission — Path One: Ship an Agent That Queries Real Content*

---

## 🎯 What I Built

**TableTop Arbiter** is an authoritative, zero-hallucination AI Head Tournament Judge for competitive tabletop games and trading card games, featuring deep, tournament-level grounding in **Magic: The Gathering (Comprehensive Rules 2024)**.

In competitive gaming, rules arguments between players frequently stall high-stakes matches or ruin game nights. While players often consult modern LLMs (ChatGPT, Claude) for quick answers, standard LLMs and traditional vector-based RAG pipelines **routinely hallucinate** because they cannot distinguish between obsolete printed base rulebooks and newer official tournament errata, layer dependencies, or zone boundaries.

**TableTop Arbiter fixes this by grounding the AI in a Sanity Structured Content Lake** via the **Model Context Protocol (MCP)**. Instead of relying on fuzzy vector embeddings, the arbiter uses **atomic GROQ graph dereferencing** (`*[_type == "ruleErrata" && references($ruleId)]`) to resolve contradictions deterministically and streams the live tool execution trace directly in the UI.

---

## ⚡ The Failure of Vector RAG vs The Sanity Solution

| Vector RAG / Generic LLM | Sanity Context MCP (TableTop Arbiter) |
| :--- | :--- |
| **Fuzzy Semantic Chunking:** Chunks text blindly; conflates permanent abilities with spell abilities. | **Typed Structured Schemas:** 18+ Comprehensive Rules documents with explicit section codes, categories, and zone tags. |
| **Keyword-Matching Hallucinations:** Sees "cannot be countered" on a creature card and assumes it protects all subsequent fight spells. | **Relational Graph Dereferencing:** Uses `references($ruleId)` to verify zone scope (CR 604.3a) and active tournament errata. |
| **Outdated Rule Bleed:** Surfaces old base rulebook text because it has high keyword overlap. | **Hierarchical Overrides:** Automatically dereferences superseding tournament directives and WotC Oracle updates. |
| **Black-Box Scripted Answers:** "Trust me, I'm an AI." | **Live Agent Tool Trace:** Real-time visibility into every MCP tool call (`query_tournament_knowledge_lake`, `get_rule_errata_diff`, `resolve_tabletop_dispute`). |
| **No Accountability:** No paper trail for tournament judges. | **Official Ruling Slip:** Generates printable/copyable certified tournament slips with SHA-256 provenance hashes. |

---

## 🔬 How Contradictions Were Discovered and Resolved

During the development and testing of TableTop Arbiter against the official **Magic: The Gathering Comprehensive Rules (CR)** and judge tournament logs, we discovered critical rules failure patterns where vector RAG and naive LLMs consistently fail:

### 1. The Stack vs Battlefield Zone Boundary (Carnage Tyrant vs Ward {2})
- **The Controversy:** Player A has Carnage Tyrant on the battlefield and casts *Bushwhack* (fight) targeting Player B's Ward {2} creature. Player A is tapped out and claims: *"Carnage Tyrant explicitly says 'This spell can't be countered', so Ward cannot counter the fight!"*
- **Why Naive LLMs Hallucinate:** Vector search matches semantic tokens between "can't be countered" on Carnage Tyrant and Ward's "counter that spell unless paid", hallucinating that the creature's immunity protects the fight effect.
- **The Sanity Resolution:** Sanity dereferences base rule **CR 604.3a** and **CR 113.6**: *"This spell can't be countered"* is a static ability that functions **solely while the card is a spell on the stack**. Once on the battlefield, Carnage Tyrant is a permanent, and the fight spell is an independent spell that does not inherit uncounterable status. Because Player A cannot pay {2}, Ward triggers and counters the fight spell under **CR 702.21a**. **Player B is UPHELD!**

### 2. Lethal Damage Assignment vs Destruction (Deathtouch + Trample vs Indestructible)
- **The Controversy:** Player A attacks with a 6/6 creature with Deathtouch and Trample. Player B blocks with a 10/10 Indestructible blocker (Darksteel Colossus). Player A assigns 1 damage to the blocker and 5 damage to Player B. Player B argues: *"1 damage does not kill an Indestructible creature, so it's not lethal damage! You must assign all 6 to my blocker!"*
- **Why Naive LLMs Hallucinate:** LLMs find that Indestructible permanents cannot be destroyed by lethal damage, hallucinating that an attacking creature cannot trample past an indestructible blocker without absorbing its full toughness.
- **The Sanity Resolution:** Sanity dereferences **CR 702.2c** and **CR 702.19b**: Any nonzero damage from a deathtouch source is legally defined as "lethal damage" for assignment purposes. Player A only needs to assign 1 damage to the 10/10 indestructible blocker; the remaining 5 damage legally tramples through to Player B. **Player A is UPHELD!**

### 3. Layer Subtype Overwrites vs Saga State-Based Actions (Blood Moon vs Urza's Saga)
- **The Controversy:** Player A controls Urza's Saga with 2 lore counters. Player B resolves *Blood Moon* ("Nonbasic lands are Mountains"). Player A claims Urza's Saga stays on the battlefield tapping for {R}.
- **Why Naive LLMs Hallucinate:** Vector RAG matches Blood Moon's text and concludes Urza's Saga simply stays on the battlefield tapping for red mana.
- **The Sanity Resolution:** Sanity traverses **CR 305.7** (Layer 4 Subtype Overwrite) and **CR 704.5s** (Saga State-Based Actions). Blood Moon removes chapter abilities, setting the Saga's maximum chapter number to 0. Because 2 counters $\ge$ 0, Urza's Saga is **immediately sacrificed to the graveyard**. **Player B is UPHELD!**

### 4. Stack Independence vs Battlefield Continuous Effects (Dress Down vs Thassa's Oracle)
- **The Controversy:** Player A casts Thassa's Oracle with an empty library. In response to the ETB trigger on the stack, Player B flashes in *Dress Down* ("Creatures lose all abilities").
- **The Sanity Resolution:** Sanity dereferences **CR 113.7a** and **CR 603.3**: Abilities on the stack exist independently of their sources. Removing abilities from the creature in Layer 6 does not remove the trigger from the stack. **Player A is UPHELD!**

---

## ⏱️ The 2-Minute Demo Flow

1. **0:00 – 0:30 | The Naive Baseline:** Ask the unassisted model about Carnage Tyrant's fight spell targeting a Ward creature. Watch the naive LLM hallucinate that Player A is protected by "cannot be countered".
2. **0:30 – 1:15 | The TableTop Arbiter (Live MCP Trace):** Click **Trace MCP Tools** or submit the inquiry. Watch the live MCP tool trace invoke `query_tournament_knowledge_lake`, `get_rule_errata_diff`, and `resolve_tabletop_dispute`. See the authoritative verdict upholding Player B with exact citations of CR 604.3a and CR 702.21a.
3. **1:15 – 1:45 | Contradiction Matrix Inspection:** Open the **Contradictions Matrix** modal to inspect the side-by-side reconciliation of printed base rules vs authoritative tournament errata.
4. **1:45 – 2:00 | Certified Tournament Slip:** Click **Generate Ruling Slip** (or press <kbd>G</kbd>) to view and copy the certified tournament adjudication certificate with its SHA-256 provenance hash.

---

## 🛠️ Sanity Schema & MCP Architecture

The Sanity Content Lake models rules as an interconnected relational graph:

```
[Game: Magic: The Gathering]
       ▲
       │ belongsTo
[GameRule (18+ Comprehensive Rules)] ◄──────┐ supersedesRules[]
       ▲                                     │
       │ governingRule                       │
[DisputedScenario (4 Real Controversies)] ───┴──► [RuleErrata (WotC Oracle / Tournament Updates)]
```

### Production MCP Server (`/api/sanity/mcp`)
Exposes 4 production-grade Model Context Protocol tools:
1. `query_tournament_knowledge_lake`: Queries the Sanity Content Lake for rules and errata via GROQ structured traversal.
2. `get_rule_errata_diff`: Dereferences base rules against active superseding errata documents.
3. `resolve_tabletop_dispute`: Evaluates tournament scenarios and computes verifiable SHA-256 provenance hashes.
4. `fetch_supported_games`: Catalogs supported games and governing circuits.

---

## 🚀 Quickstart & Verification

```bash
# 1. Clone repository
git clone https://github.com/your-username/tabletop-arbiter.git
cd tabletop-arbiter

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

- **Web UI:** [http://localhost:3000](http://localhost:3000)
- **Embedded Sanity Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)
- **Live MCP HTTP Endpoint:** [http://localhost:3000/api/sanity/mcp](http://localhost:3000/api/sanity/mcp)
