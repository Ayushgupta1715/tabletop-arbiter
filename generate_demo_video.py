import os
import sys
import asyncio
import subprocess
from PIL import Image, ImageDraw, ImageFont

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Colors
BG_COLOR = (8, 18, 12)       # Dark Felt
PANEL_BG = (14, 28, 20)      # Plaque surface
PANEL_BORDER = (50, 70, 50)  # Border
GOLD = (212, 167, 72)        # Ormolu Brass
GOLD_LIGHT = (253, 232, 167) # Bright Brass
CREAM = (248, 245, 235)      # Parchment Text
MUTED = (150, 165, 155)      # Muted text
GREEN = (52, 211, 153)       # Upheld
RED = (248, 113, 113)        # Overruled
ACCENT_BLUE = (96, 165, 250) # Link/Code

VOICE = "en-US-ChristopherNeural"

SCENES = [
    {
        "id": 1,
        "title": "When Tabletop Rules Threaten Friendships...",
        "subtitle": "DEV Community x Sanity Challenge — Path One: Ship an Agent That Queries Real Content",
        "script": "In competitive gaming, rules disputes stall matches. When players ask generic AI or vector RAG, they routinely hallucinate—confusing obsolete printed rulebooks with active tournament errata.",
        "badge": "THE PROBLEM: VECTOR RAG BLINDNESS",
        "badge_color": RED,
        "items": [
            ("❌ Vector Search Blindness", "Chunks text blindly without structural awareness of game zones or timing layers."),
            ("❌ Keyword Hallucination", "Matches 'can't be countered' on a card and assumes it protects all subsequent fight spells."),
            ("❌ Outdated Rule Bleed", "Surfaces 2014 printed rulebooks over modern 2024 Balance Dataslates and FAQs."),
            ("❌ Zero Accountability", "Black-box responses with no verifiable citations or paper trail for tournament judges.")
        ]
    },
    {
        "id": 2,
        "title": "TableTop Arbiter: Sanity Context MCP",
        "subtitle": "Eliminating AI Hallucinations via Structured Content Lake & Atomic GROQ Dereferencing",
        "script": "Enter TableTop Arbiter: an autonomous Head Tournament Judge grounded in Sanity's Structured Content Lake. Using the Model Context Protocol, it navigates rules as a relational graph with atomic GROQ dereferencing.",
        "badge": "THE SOLUTION: RELATIONAL KNOWLEDGE LAKE",
        "badge_color": GREEN,
        "items": [
            ("🏛️ Structured Schemas", "Game, GameRule, and RuleErrata documents with typed section codes and authorities."),
            ("⚡ Atomic GROQ Graph Dereferencing", "*[_type == 'ruleErrata' && references($ruleId)] traverses superseding tournament updates."),
            ("🛰️ Official Sanity MCP API", "Standards-compliant JSON-RPC 2.0 endpoint exposing Knowledge Base & GROQ modes."),
            ("📜 Dual-Stream Verification", "Runs unassisted naive models side-by-side with grounded Sanity Arbiter verdicts.")
        ]
    },
    {
        "id": 3,
        "title": "Championship Dispute: Carnage Tyrant vs Ward {2}",
        "subtitle": "Magic: The Gathering Comprehensive Rules (2024 Oracle Update)",
        "script": "In Magic: The Gathering, Carnage Tyrant targets an opponent's Ward creature. Naive LLMs claim immunity. But TableTop Arbiter dereferences Comprehensive Rules 604.3a—proving uncounterable text is stack-only—and upholds Player B.",
        "badge": "OFFICIAL TOURNAMENT ADJUDICATION DECREE",
        "badge_color": GOLD,
        "items": [
            ("Player A Contention [OVERRULED]", "'Carnage Tyrant says \"This spell can't be countered\", so Ward cannot counter my fight spell!'"),
            ("Player B Contention [UPHELD]", "'Uncounterable text only protects the creature spell on the stack. The fight spell is countered unless {2} is paid.'"),
            ("Official Ruling (CR 604.3a & CR 702.21a)", "Under CR 604.3a, 'This spell can't be countered' functions solely on the stack. Ward counters the fight spell. PLAYER B UPHELD."),
            ("Cryptographic Lineage", "Governing Citation: WotC Official Oracle Ruling (2024-04-12) · Verified against Sanity Content Lake.")
        ]
    },
    {
        "id": 4,
        "title": "Live Sanity Context MCP Tool Execution Trace",
        "subtitle": "Full End-to-End Autonomous Agent Loop over JSON-RPC 2.0 (/api/sanity/mcp)",
        "script": "Every dispute streams live through official Sanity Context MCP tools—from initial knowledge base discovery and GROQ traversal to live errata diffing and cryptographic certification.",
        "badge": "5 ACTIVE SANITY CONTEXT MCP TOOLS",
        "badge_color": GREEN,
        "items": [
            ("1. mcp.initial_context()", "Discovered 3 Sanity Knowledge Bases (kb_mtg_comprehensive_rules, kb_tournament_errata_lake)."),
            ("2. mcp.query_tournament_knowledge_lake()", "Traversed Sanity Content Lake: Matched CR 702.21a & CR 701.12a with active errata overrides."),
            ("3. mcp.knowledge_base_read()", "Retrieved 2 authoritative source documents with linked origin provenance URLs."),
            ("4. mcp.get_rule_errata_diff()", "Critical override detected: Base rule CR 702.21a superseded by WotC Oracle Update 2024-04."),
            ("5. mcp.resolve_tabletop_dispute()", "Verdict certified: UPHELD for Player B. Cryptographic lineage sealed with SHA-256 hash.")
        ]
    },
    {
        "id": 5,
        "title": "Verifiable Provenance: Zero Hallucination",
        "subtitle": "Instant Certified Ruling Slips · Embedded Sanity Studio · Open Source",
        "script": "Every verdict generates a certified Ruling Slip with a tamper-evident SHA-256 hash. Eliminate tabletop arguments forever with TableTop Arbiter and Sanity Context MCP.",
        "badge": "DEV X SANITY CHALLENGE 2026 — PATH ONE",
        "badge_color": GOLD,
        "items": [
            ("📜 Certified Tournament Ruling Slip", "Printable and copyable adjudication certificate for head tournament judges."),
            ("🔒 Cryptographic Provenance Hash", "SHA-256 tamper-evident hash verifying the exact rulebook version and errata applied."),
            ("🎛️ Embedded Sanity Studio (/studio)", "Direct in-app CMS to manage rules, tournament circuits, erratas, and dockets."),
            ("🚀 Built with Modern Next.js 16", "Turbopack, TypeScript, Tailwind CSS, Ormolu Brass Design System, and Sanity MCP.")
        ]
    }
]

def draw_slide(scene, filename):
    img = Image.new("RGB", (1920, 1080), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Ambient subtle gradient / border
    draw.rectangle([(20, 20), (1900, 1060)], outline=PANEL_BORDER, width=2)
    draw.rectangle([(24, 24), (1896, 1056)], outline=(20, 40, 25), width=1)

    # Brass corner accents
    for x, y in [(20, 20), (1900, 20), (20, 1060), (1900, 1060)]:
        draw.rectangle([(x-8, y-8), (x+8, y+8)], fill=GOLD)

    # Fonts (using default / fallback bitmap fonts with size simulation or sys fonts)
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 24)
        font_badge = ImageFont.truetype("arialbd.ttf", 18)
        font_head = ImageFont.truetype("arialbd.ttf", 26)
        font_body = ImageFont.truetype("arial.ttf", 21)
        font_footer = ImageFont.truetype("arial.ttf", 18)
    except:
        font_title = ImageFont.load_default()
        font_sub = font_title
        font_badge = font_title
        font_head = font_title
        font_body = font_title
        font_footer = font_title

    # Header Badge
    badge_text = scene["badge"]
    draw.rounded_rectangle([(80, 55), (80 + len(badge_text)*11 + 30, 95)], radius=6, fill=(15, 30, 20), outline=scene["badge_color"], width=2)
    draw.text((95, 65), badge_text, font=font_badge, fill=scene["badge_color"])

    # Header Title & Subtitle
    draw.text((80, 115), scene["title"], font=font_title, fill=GOLD_LIGHT)
    draw.text((80, 175), scene["subtitle"], font=font_sub, fill=MUTED)

    # Horizontal Divider Line with Gold center
    draw.line([(80, 220), (1840, 220)], fill=PANEL_BORDER, width=2)
    draw.line([(80, 220), (450, 220)], fill=GOLD, width=3)

    # Cards / Items Grid
    items = scene["items"]
    card_w = 860
    card_h = 165
    positions = [
        (80, 260),
        (980, 260),
        (80, 455),
        (980, 455),
        (80, 650) if len(items) > 4 else None
    ]

    for idx, (head, body) in enumerate(items[:4]):
        x, y = positions[idx]
        draw.rounded_rectangle([(x, y), (x + card_w, y + card_h)], radius=12, fill=PANEL_BG, outline=PANEL_BORDER, width=2)
        
        # Left accent stripe
        stripe_color = GREEN if "UPHELD" in head or "mcp." in head or "Structured" in head or "Certified" in head else (RED if "OVERRULED" in head or "Blindness" in head or "Hallucination" in head or "Bleed" in head or "Zero" in head else GOLD)
        draw.rectangle([(x, y+10), (x+6, y+card_h-10)], fill=stripe_color)

        draw.text((x + 25, y + 20), head, font=font_head, fill=GOLD_LIGHT if stripe_color == GOLD else (GREEN if stripe_color == GREEN else RED))
        
        # Word wrap body
        words = body.split(" ")
        lines = []
        cur_line = ""
        for w in words:
            if len(cur_line + " " + w) > 68:
                lines.append(cur_line)
                cur_line = w
            else:
                cur_line = (cur_line + " " + w).strip()
        if cur_line:
            lines.append(cur_line)

        for l_idx, line in enumerate(lines[:3]):
            draw.text((x + 25, y + 65 + l_idx * 28), line, font=font_body, fill=CREAM)

    # Bottom Banner / Footer
    draw.rounded_rectangle([(80, 930), (1840, 1010)], radius=10, fill=(12, 24, 18), outline=GOLD, width=1)
    draw.text((110, 955), "⚖️ TableTop Arbiter — Official Tournament Errata Grounded Copilot", font=font_head, fill=GOLD_LIGHT)
    draw.text((1200, 958), "Powered by Sanity Content Lake & Model Context Protocol (MCP)", font=font_footer, fill=MUTED)

    img.save(filename)
    print(f"✓ Saved slide: {filename}")

async def generate_speech(text, output_file):
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate="+8%")
    await communicate.save(output_file)
    print(f"✓ Saved audio: {output_file}")

def get_audio_duration(filename):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", filename
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

async def main():
    os.makedirs("video_build", exist_ok=True)
    segment_files = []

    print("\n🎬 STEP 1: Generating High-Resolution Slides & Neural Audio...")
    for scene in SCENES:
        s_id = scene["id"]
        slide_img = f"video_build/slide_{s_id}.png"
        audio_mp3 = f"video_build/audio_{s_id}.mp3"
        video_seg = f"video_build/seg_{s_id}.mp4"

        draw_slide(scene, slide_img)
        await generate_speech(scene["script"], audio_mp3)

        dur = get_audio_duration(audio_mp3)
        # Tight padding of 0.2s for clean transitions
        total_dur = dur + 0.2
        print(f"  Scene {s_id} duration: {dur:.2f}s -> video {total_dur:.2f}s")

        # Encode single scene segment with ffmpeg
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", slide_img,
            "-i", audio_mp3,
            "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-t", str(total_dur),
            video_seg
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        segment_files.append(video_seg)
        print(f"  ✓ Segment {s_id} rendered: {video_seg}")

    # Concatenate all segments
    print("\n🎬 STEP 2: Concatenating into Final 60-Second Demo Video...")
    concat_list_file = "video_build/concat_list.txt"
    with open(concat_list_file, "w") as f:
        for seg in segment_files:
            # Absolute path with forward slashes for ffmpeg
            f.write(f"file '{os.path.abspath(seg).replace(os.sep, '/')}'\n")

    final_video = "TableTop_Arbiter_Demo_60s.mp4"
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list_file,
        "-c", "copy",
        final_video
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    final_dur = get_audio_duration(final_video)
    size_mb = os.path.getsize(final_video) / (1024 * 1024)
    print(f"\n🎉 SUCCESS! Broadcast-Quality 1-Minute Demo Video Created!")
    print(f"  File: {final_video}")
    print(f"  Duration: {final_dur:.1f} seconds")
    print(f"  Size: {size_mb:.2f} MB")
    print(f"  Resolution: 1920x1080 (Full HD)")
    print(f"  Voice: {VOICE} (Neural Human AI)")

if __name__ == "__main__":
    asyncio.run(main())
