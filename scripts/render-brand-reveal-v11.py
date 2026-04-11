#!/usr/bin/env python3
"""
Perch Brand Reveal v11 — Full-Screen Overhaul
1290x2796 (iPhone 15 Pro Max) · 30 fps · 100 s

v11 fixes from v10:
- ALL hero text fitted edge-to-edge via _fit() — fills iPhone screen
- Typewriter cursor: proportional width (8px+), blinks at 2Hz when idle
- Quote cards: analytical scroll integral, pre-computed positions
- Camera flash: pre-bloom overlay → 6 white frames → teal afterimage
- Data reveals: full-width stacked metric cards (no overlap/clipping)
- 80px margins + bounds checking on all text
- "Sits still. / Sees everything." vertically centered as massive block
- "The answer isn't / more AI. / It's better signal." spread at 25/43/70%
- Global fade-to-black 97-100s
"""

import subprocess, sys, io, os
from PIL import Image, ImageDraw, ImageFont
import qrcode

# ── Constants ────────────────────────────────────────────
W, H = 1290, 2796
SAFE_TOP = 60
SAFE_BOT = 40
CZ_TOP = SAFE_TOP
CZ_BOT = H - SAFE_BOT
CZ_H = CZ_BOT - CZ_TOP

MARGIN_H = 80
MAX_TW = W - 2 * MARGIN_H  # 1130

FPS = 30
DUR = 100
FRAMES = FPS * DUR

BLACK   = (0, 0, 0)
SURFACE = (23, 23, 23)
CARD_BG = (14, 14, 14)
WHITE   = (255, 255, 255)
ACCENT  = (74, 155, 168)
BRIGHT  = (94, 196, 201)
CYAN    = (4, 218, 246)
AMBER   = (229, 165, 54)
RED     = (196, 69, 54)
GREEN   = (45, 138, 94)
GRAY    = (187, 187, 187)
GRAY_MD = (153, 153, 153)
DIM     = (102, 102, 102)
WHISPER = (136, 136, 136)

F_INTER_B  = "/Users/patricksmith/Library/Fonts/Inter-Bold.otf"
F_INTER_SB = "/Users/patricksmith/Library/Fonts/Inter-SemiBold.otf"
F_INTER_R  = "/Users/patricksmith/Library/Fonts/Inter-Regular.otf"
F_JBMONO   = "/Users/patricksmith/Library/Fonts/JetBrainsMonoNL-Regular.ttf"
F_JBMONO_B = "/Users/patricksmith/Library/Fonts/JetBrainsMonoNL-Bold.ttf"
F_BERKELEY = "/Users/patricksmith/Library/Fonts/BerkeleyMono-Regular.otf"

FISH_PNG  = "/Users/patricksmith/Work/instrument-repo/workers/instrument-architecture/dist/brand/mark-white-corrected.png"
SLIDE_DIR = "/Users/patricksmith/Work/tharp"
OUT_DIR   = "/Users/patricksmith/Work/instrument-repo/assets/video"
OUT_FILE  = f"{OUT_DIR}/perch-brand-reveal-v11.mp4"

# ── 48 Quote cards ──────────────────────────────────────
QUOTE_CARDS = [
    {"q": "We are now confident we know how to build AGI.", "who": "Sam Altman", "org": "OpenAI", "bar": ACCENT},
    {"q": "Every company needs a copilot for everything.", "who": "Satya Nadella", "org": "Microsoft", "bar": CYAN},
    {"q": "We are building AI factories around the world.", "who": "Jensen Huang", "org": "NVIDIA", "bar": AMBER},
    {"q": "Intelligence is becoming too cheap to meter.", "who": "Sam Altman", "org": "OpenAI", "bar": GRAY_MD},
    {"q": "This is a trillion dollar opportunity.", "who": "Jensen Huang", "org": "NVIDIA", "bar": RED},
    {"q": "The year of the AI agent has arrived.", "who": "Satya Nadella", "org": "Microsoft", "bar": ACCENT},
    {"q": "Agentic workflows will drive massive progress.", "who": "Andrew Ng", "org": "DeepLearning.AI", "bar": CYAN},
    {"q": "We're building a country of geniuses.", "who": "Jensen Huang", "org": "NVIDIA", "bar": AMBER},
    {"q": "AI won't replace you. Someone using AI will.", "who": "Everyone", "org": "LinkedIn", "bar": DIM},
    {"q": "Our most intelligent model yet.", "who": "Product Launch", "org": "Every AI Company", "bar": RED},
    {"q": "We are at the dawn of the intelligence age.", "who": "Sam Altman", "org": "OpenAI", "bar": ACCENT},
    {"q": "Autonomous agents that never sleep.", "who": "Enterprise AI", "org": "Salesforce", "bar": CYAN},
    {"q": "Multi-agent systems will transform every industry.", "who": "Tech Conference", "org": "2025", "bar": GRAY_MD},
    {"q": "Agents as teammates.", "who": "Marc Benioff", "org": "Salesforce", "bar": AMBER},
    {"q": "Vibe coding is the future.", "who": "Andrej Karpathy", "org": "", "bar": DIM},
    {"q": "Digital transformation reimagined with AI.", "who": "Consulting Deck", "org": "McKinsey", "bar": ACCENT},
    {"q": "Superintelligence is closer than you think.", "who": "The Discourse", "org": "Twitter/X", "bar": RED},
    {"q": "No-code agents for everyone.", "who": "Product Hunt", "org": "Every Startup", "bar": CYAN},
    {"q": "Let that sink in.", "who": "", "org": "", "bar": GRAY_MD},
    {"q": "The future of work is autonomous.", "who": "Future of Work", "org": "Forbes", "bar": AMBER},
    {"q": "Every employee will have an AI agent.", "who": "Bill Gates", "org": "Microsoft", "bar": ACCENT},
    {"q": "AI is the new electricity.", "who": "Andrew Ng", "org": "Stanford", "bar": RED},
    {"q": "This will be bigger than the internet.", "who": "Sundar Pichai", "org": "Google", "bar": CYAN},
    {"q": "We're going to have a billion agents.", "who": "Marc Benioff", "org": "Salesforce", "bar": AMBER},
    {"q": "The cost of intelligence is going to zero.", "who": "Sam Altman", "org": "OpenAI", "bar": DIM},
    {"q": "AI agents will replace knowledge workers.", "who": "McKinsey", "org": "Report", "bar": ACCENT},
    {"q": "Every workflow will be agentic by 2027.", "who": "Gartner", "org": "Prediction", "bar": RED},
    {"q": "The AI copilot era is here.", "who": "GitHub", "org": "Microsoft", "bar": CYAN},
    {"q": "Your next employee will be an AI.", "who": "Y Combinator", "org": "Demo Day", "bar": GRAY_MD},
    {"q": "AGI will be the most important technology ever.", "who": "Demis Hassabis", "org": "DeepMind", "bar": AMBER},
    {"q": "10x productivity with AI agents.", "who": "TechCrunch", "org": "", "bar": ACCENT},
    {"q": "The agent stack is the new SaaS stack.", "who": "a16z", "org": "Blog", "bar": RED},
    {"q": "We're entering the intelligence explosion.", "who": "Tech Twitter", "org": "", "bar": CYAN},
    {"q": "AI-first companies will eat the world.", "who": "Venture Capital", "org": "", "bar": AMBER},
    {"q": "Every tool will have an agent layer.", "who": "Product Hunt", "org": "", "bar": DIM},
    {"q": "Autonomous AI is the endgame.", "who": "The Discourse", "org": "", "bar": ACCENT},
    {"q": "Agents talking to agents.", "who": "Everyone", "org": "Everywhere", "bar": CYAN},
    {"q": "Your AI workforce is ready.", "who": "Enterprise AI", "org": "Email", "bar": RED},
    {"q": "Build your personal AI army.", "who": "LinkedIn", "org": "Post", "bar": AMBER},
    {"q": "The singularity is near.", "who": "The Hype", "org": "", "bar": DIM},
    {"q": "AI-powered everything.", "who": "Product Launch", "org": "", "bar": ACCENT},
    {"q": "Just ship it with AI.", "who": "Startup Twitter", "org": "", "bar": CYAN},
    {"q": "Replace your entire team with agents.", "who": "Hot Take", "org": "", "bar": AMBER},
    {"q": "Intelligence too cheap to meter.", "who": "Again", "org": "", "bar": RED},
    {"q": "More agents. More agents. More agents.", "who": "", "org": "", "bar": DIM},
    {"q": "Deploy an army of AI workers today.", "who": "Ad", "org": "", "bar": ACCENT},
    {"q": "The future is automated.", "who": "Conference", "org": "", "bar": CYAN},
    {"q": "Resistance is futile.", "who": "The Zeitgeist", "org": "", "bar": AMBER},
]

_t = 7.0
for i, c in enumerate(QUOTE_CARDS):
    c['t'] = _t
    if i < 4:      _t += 1.3    # 7-12s: 4 cards, large and readable
    elif i < 8:    _t += 0.9    # 12-16s: 4 cards, medium pace
    elif i < 14:   _t += 0.65   # 16-20s: 6 cards, building
    elif i < 22:   _t += 0.45   # 20-24s: 8 cards, fast
    elif i < 32:   _t += 0.25   # 24-26.5s: 10 cards, flooding
    elif i < 42:   _t += 0.12   # 26.5-27.7s: 10 cards, machine-gun
    else:          _t += 0.05   # 27.7-28s: 6 cards, pure noise burst


# ── Utility functions ────────────────────────────────────

def ease_out(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3

def ease_in(t):
    t = max(0.0, min(1.0, t))
    return t ** 3

def lerp(a, b, t):
    return a + (b - a) * max(0.0, min(1.0, t))

def fade_window(t, t_in, dur_in, t_out, dur_out):
    if t < t_in:            return 0.0
    if t < t_in + dur_in:   return ease_out((t - t_in) / dur_in)
    if t < t_out:           return 1.0
    if t < t_out + dur_out: return 1.0 - ease_out((t - t_out) / dur_out)
    return 0.0

def mul_c(c, a):
    a = max(0.0, min(1.0, a))
    return tuple(int(v * a) for v in c)

def composite(canvas, ov, cx, cy, opacity=1.0, scale=1.0):
    if opacity <= 0: return
    if scale != 1.0:
        ov = ov.resize((max(1, int(ov.width * scale)), max(1, int(ov.height * scale))), Image.LANCZOS)
    if opacity < 1.0:
        r, g, b, a = ov.split()
        a = a.point(lambda v: int(v * opacity))
        ov = Image.merge('RGBA', (r, g, b, a))
    canvas.paste(ov, (cx - ov.width // 2, cy - ov.height // 2), ov)

def txt_c(draw, text, cx, cy, font, color, opacity=1.0):
    if opacity <= 0: return
    bb = draw.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    x = cx - tw // 2
    y = cy - th // 2
    x = max(MARGIN_H, min(x, W - MARGIN_H - tw))
    draw.text((x, y), text, font=font, fill=mul_c(color, opacity))

def typewriter_text(draw, text, cx, cy, font, color, progress, opacity=1.0, frame=0, align='center'):
    """Typewriter with proportional blinking teal cursor."""
    if opacity <= 0 or progress <= 0: return
    chars = int(len(text) * min(progress, 1.0))
    if chars <= 0: return
    visible = text[:chars]
    bb_full = draw.textbbox((0, 0), text, font=font)
    tw = bb_full[2] - bb_full[0]
    th = bb_full[3] - bb_full[1]
    if align == 'center':
        x = cx - tw // 2
    elif align == 'left':
        x = cx
    else:
        x = cx - tw
    y = cy - th // 2
    x = max(MARGIN_H, min(x, W - MARGIN_H - tw))
    draw.text((x, y), visible, font=font, fill=mul_c(color, opacity))
    # Proportional cursor
    cursor_w = max(8, th // 14)
    vbb = draw.textbbox((0, 0), visible, font=font)
    cursor_x = x + (vbb[2] - vbb[0]) + 4
    if progress < 1.0:
        show = True
    else:
        show = (frame // (FPS // 4)) % 2 == 0
    if show and cursor_x + cursor_w < W - MARGIN_H:
        draw.rectangle([cursor_x, y, cursor_x + cursor_w, y + th],
                       fill=mul_c(ACCENT, opacity))

def wrap_text(draw, text, font, max_w):
    words = text.split()
    lines, line = [], ""
    for word in words:
        test = f"{line} {word}".strip()
        bb = draw.textbbox((0, 0), test, font=font)
        if bb[2] - bb[0] > max_w and line:
            lines.append(line)
            line = word
        else:
            line = test
    if line:
        lines.append(line)
    return lines


# ── Renderer ─────────────────────────────────────────────

class Renderer:
    def __init__(self):
        fish_full = Image.open(FISH_PNG).convert("RGBA")
        fish_target_w = int(W * 0.55)
        fish_scale = fish_target_w / fish_full.width
        self.fish = fish_full.resize(
            (fish_target_w, int(fish_full.height * fish_scale)), Image.LANCZOS)

        # ── Fitted fonts: each text fills MAX_TW width ──
        td = ImageDraw.Draw(Image.new('RGB', (1, 1)))
        self.ff = {}
        self.lh = {}

        def fit(name, text, max_size, min_size=60, font_path=F_INTER_B):
            for size in range(max_size, min_size - 1, -2):
                f = ImageFont.truetype(font_path, size)
                bb = td.textbbox((0, 0), text, font=f)
                if bb[2] - bb[0] <= MAX_TW:
                    self.ff[name] = f
                    self.lh[name] = bb[3] - bb[1]
                    return
            f = ImageFont.truetype(font_path, min_size)
            self.ff[name] = f
            bb = td.textbbox((0, 0), text, font=f)
            self.lh[name] = bb[3] - bb[1]

        # Hero moments
        fit('agents', "Everyone's building agents.", 400)
        fit('tools', "More tools. More dashboards.", 300)
        fit('noise', "More noise.", 400)
        fit('built', "We built something else.", 300)
        fit('instrument', "An instrument.", 400)
        fit('sits', "Sits still.", 400)
        fit('sees', "Sees everything.", 300)
        fit('answer1', "The answer isn't", 300)
        fit('answer2', "more AI.", 500)
        fit('signal', "It's better signal.", 260)
        fit('comes', "It comes to you.", 300)
        fit('intro', "Introducing Perch.", 300)
        fit('perch', "Perch.", 300)

        # Data card titles
        fit('d1_title', "Revenue up. Margins down.", 200)
        fit('d2_title', "Two identical charges.", 200)
        fit('d3_title', "41 operating days.", 200)

        # Fixed fonts for smaller elements
        self.f_eyebrow     = ImageFont.truetype(F_JBMONO, 28)
        self.f_data_metric = ImageFont.truetype(F_JBMONO_B, 84)
        self.f_data_label  = ImageFont.truetype(F_JBMONO, 36)
        self.f_action      = ImageFont.truetype(F_JBMONO, 32)
        self.f_attr        = ImageFont.truetype(F_BERKELEY, 38)
        self.f_attr_sm     = ImageFont.truetype(F_BERKELEY, 32)
        self.f_url         = ImageFont.truetype(F_BERKELEY, 48)

        # Quote card fonts
        self.f_quote     = ImageFont.truetype(F_INTER_R, 34)
        self.f_quote_md  = ImageFont.truetype(F_INTER_R, 28)
        self.f_quote_sm  = ImageFont.truetype(F_INTER_SB, 22)
        self.f_quote_who = ImageFont.truetype(F_INTER_SB, 22)

        # Slide backgrounds
        self.slides = {}
        for name in ['perch-slide-03.png', 'perch-slide-07.png', 'perch-slide-11.png']:
            path = f"{SLIDE_DIR}/{name}"
            if os.path.exists(path):
                im = Image.open(path).convert('RGBA')
                aspect = im.width / im.height
                new_h = int(W / aspect)
                im = im.resize((W, new_h), Image.LANCZOS)
                r, g, b, a = im.split()
                r = r.point(lambda v: int(v * 0.10))
                g = g.point(lambda v: int(v * 0.10))
                b = b.point(lambda v: int(v * 0.10))
                self.slides[name] = Image.merge('RGBA', (r, g, b, a))

        # QR code
        qr = qrcode.QRCode(version=1, box_size=7, border=2,
                           error_correction=qrcode.constants.ERROR_CORRECT_H)
        qr.add_data("https://instruments.highline.work")
        qr.make(fit=True)
        self.qr = qr.make_image(fill_color="white", back_color="black").convert("RGBA")
        self.qr = self.qr.resize((200, 200), Image.LANCZOS)

        # Pre-compute card stack positions (O(n) instead of O(n^2))
        self._precompute_card_stack()

    def _precompute_card_stack(self):
        """Pre-compute card dimensions with SHRINK + OVERLAP decay.

        Cards shrink from 200px tall (large, readable) to 20px slivers.
        Gaps shrink from 16px to negative (overlap).
        """
        n = len(QUOTE_CARDS)
        self.card_heights = []
        self.card_gaps = []
        self.card_y_offsets = []
        cumulative = 0.0
        for i in range(n):
            progress = i / max(1, n - 1)
            # A) SHRINK: 200 → 20 with exponent for acceleration
            ch = int(lerp(200, 20, progress ** 1.5))
            # B) OVERLAP: gaps go from 16 → negative (cards pile on top)
            # After card ~30, gaps go negative = overlap
            gp = lerp(16, -ch * 0.5, progress ** 1.3)
            self.card_heights.append(ch)
            self.card_gaps.append(gp)
            self.card_y_offsets.append(cumulative)
            cumulative += ch + gp

    # ── Main render ──────────────────────────────────────

    def render(self, n):
        t = n / FPS
        img = Image.new('RGBA', (W, H), BLACK + (255,))
        draw = ImageDraw.Draw(img)

        # TOTAL AMBUSH: exactly 3 frames of pure white at 28s (frames 840-842)
        flash_frame = 28.0 * FPS  # frame 840
        if flash_frame <= n < flash_frame + 3:
            return Image.new('RGB', (W, H), WHITE)

        # After flash: hard cut to black (teal tint fades quickly)
        flash_end_t = (flash_frame + 3) / FPS  # 28.1s
        if flash_end_t <= t < 29.5:
            decay = 1.0 - ease_out((t - flash_end_t) / 1.4)
            teal_t = min(1.0, (t - flash_end_t) / 0.3) * 0.08
            rv = int(255 * decay * (1.0 - teal_t) + 74 * decay * teal_t)
            gv = int(255 * decay * (1.0 - teal_t) + 155 * decay * teal_t)
            bv = int(255 * decay * (1.0 - teal_t) + 168 * decay * teal_t)
            return Image.new('RGB', (W, H), (rv, gv, bv))

        # Draw acts
        self._act1_feed(img, draw, t, n)
        self._act2_pivot(draw, t, n)
        self._act3_intro(img, draw, t, n)
        self._act4_signal(draw, t, n)
        self._act5_data(img, draw, t, n)
        self._act6_close(img, draw, t, n)

        # NO pre-bloom — total ambush, chaos goes straight to white flash

        # Global fade to black
        if t >= 97:
            fade = min(1.0, (t - 97) / 3.0)
            ov = Image.new('RGBA', (W, H), BLACK + (int(fade * 255),))
            img = Image.alpha_composite(img, ov)

        return img.convert('RGB')

    # ── ACT 1: Opening + Feed (0-28s) ────────────────────

    def _act1_feed(self, img, draw, t, n):
        if t >= 28.0: return

        cy = CZ_TOP + CZ_H // 2

        # "Everyone's building agents." (0.3-2.5s)
        a = fade_window(t, 0.3, 0.1, 2.5, 0.5)
        if a > 0:
            p = min(1.0, (t - 0.3) / 1.8)
            typewriter_text(draw, "Everyone's building agents.", W // 2, cy,
                           self.ff['agents'], WHITE, p, a, n)

        # "More tools. More dashboards." (3.3-5.3s)
        a = fade_window(t, 3.3, 0.1, 5.3, 0.5)
        if a > 0:
            p = min(1.0, (t - 3.3) / 1.6)
            typewriter_text(draw, "More tools. More dashboards.", W // 2, cy,
                           self.ff['tools'], GRAY, p, a, n)

        # "More noise." (5.8-6.8s)
        a = fade_window(t, 5.8, 0.1, 6.8, 0.3)
        if a > 0:
            p = min(1.0, (t - 5.8) / 0.6)
            typewriter_text(draw, "More noise.", W // 2, cy,
                           self.ff['noise'], GRAY_MD, p, a, n)

        if t < 7: return

        # ── QUOTE CARD FLOOD — all three decay modes ────────────
        margin = 30
        card_w = W - 2 * margin
        elapsed = t - 7.0
        total_dur = 21.0   # 7s to 28s

        # Global progress through the cacophony (0.0 → 1.0)
        global_p = min(1.0, elapsed / total_dur)

        # C) SPEED: scroll accelerates exponentially
        # Early: barely scrolls (cards accumulate on screen)
        # Late: STREAKING upward (cards blur past)
        scroll_speed = lerp(5, 400, global_p ** 3)
        # Integrate scroll speed over time for offset
        # Approximate: s = 5*t + 395 * t^4 / (4 * 21^3)
        scroll_offset = 5.0 * elapsed + 395.0 * (elapsed ** 4) / (4.0 * total_dur ** 3)

        # Place cards so they fill the visible screen area
        # Each new card appears at: previous_card_bottom + gap
        # Cards overlap because gaps go negative for later cards
        start_y = CZ_TOP + 200  # Start a bit down from top

        for i, card in enumerate(QUOTE_CARDS):
            if t < card['t']: continue
            card_age = t - card['t']
            ch = self.card_heights[i]
            progress_i = i / max(1, len(QUOTE_CARDS) - 1)

            # Position: stack from offset, scroll removes earlier cards
            y_base = start_y + self.card_y_offsets[i] - scroll_offset
            y = int(y_base)

            # Cull off-screen (generous bounds for ghosts)
            ghost_range = int(min(scroll_speed * 0.4, 120)) + 60
            if y < -ch - ghost_range or y > H + ghost_range: continue

            card_a = min(1.0, card_age / 0.15)
            if card_a <= 0: continue

            # C) SPEED BLUR: ghost/smear effect for fast-moving cards
            blur_intensity = 0.0
            if scroll_speed > 60 and progress_i > 0.25:
                blur_intensity = min(1.0, (scroll_speed - 60) / 200)
                ghost_offset = int(min(scroll_speed * 0.25, 100))
                ghost_opacity = card_a * 0.35 * blur_intensity
                # Draw ghost (leading smear — card trails upward)
                self._draw_quote_card(draw, margin, y + ghost_offset,
                                      card_w, ch, card, ghost_opacity, progress_i)
                # Second ghost for extreme speeds (double trail)
                if scroll_speed > 180:
                    ghost2_offset = int(min(scroll_speed * 0.12, 50))
                    self._draw_quote_card(draw, margin, y + ghost2_offset,
                                          card_w, ch, card, ghost_opacity * 0.4, progress_i)

            # Draw main card (slightly dimmed at high speed)
            main_opacity = card_a * lerp(1.0, 0.75, blur_intensity)
            self._draw_quote_card(draw, margin, y, card_w, ch, card,
                                  main_opacity, progress_i)

    def _draw_quote_card(self, draw, x, y, w, h, card, a, progress=0.0):
        """Draw a single quote card with decay-aware rendering.

        progress: 0.0 (first card) to 1.0 (last card) controls text detail.
        Cards shorter than 50px render as pure colored bars (no text).
        Cards shorter than 100px show truncated text.
        """
        if y + h < 0 or y > H: return
        if a <= 0.01: return

        y_top = max(0, y)
        y_bot = min(H, y + h)
        if y_top >= y_bot: return

        # Background
        draw.rectangle([x, y_top, x + w, y_bot], fill=mul_c(CARD_BG, a))

        # Accent bar (always visible — becomes the only visual at small sizes)
        bar_w = max(4, int(lerp(7, 12, progress)))  # bars get thicker as cards shrink
        draw.rectangle([x, y_top, x + bar_w, y_bot], fill=mul_c(card['bar'], a))

        # B) Text detail degrades with card height
        if h < 35:
            # Pure accent bar — no text, just color
            return
        if h < 60:
            # Tiny: just the bar color visible, maybe a blur of text
            if card['q'] and h > 45:
                # One line of tiny text, clipped
                draw.text((x + bar_w + 8, y + 4), card['q'][:30],
                          font=self.f_quote_sm, fill=mul_c(WHITE, a * 0.3))
            return

        # Select font based on card height
        if h > 160:
            font, line_h = self.f_quote, 42
        elif h > 120:
            font, line_h = self.f_quote_md, 34
        else:
            font, line_h = self.f_quote_sm, 28

        tx = x + bar_w + 24
        ty = y + 14
        words = card['q'].split()
        line, max_w = "", w - bar_w - 48
        for word in words:
            test = f"{line} {word}".strip()
            bb = draw.textbbox((0, 0), test, font=font)
            if bb[2] - bb[0] > max_w and line:
                if 0 < ty < H - 20 and ty < y + h - 10:
                    draw.text((tx, ty), line, font=font, fill=mul_c(WHITE, a * 0.95))
                ty += line_h
                line = word
            else:
                line = test
        if line and 0 < ty < H - 20 and ty < y + h - 10:
            draw.text((tx, ty), line, font=font, fill=mul_c(WHITE, a * 0.95))

        # Attribution — only if card is tall enough
        if h > 100 and card.get('who'):
            attr_y = y + h - 30
            if 0 < attr_y < H - 10:
                attrib = f"\u2014 {card['who']}" + (f"  \u00b7  {card['org']}" if card.get('org') else "")
                draw.text((tx, attr_y), attrib, font=self.f_quote_who,
                          fill=mul_c(DIM, a * 0.6))

    # ── ACT 2: Pivot (28-42s) ────────────────────────────

    def _act2_pivot(self, draw, t, n):
        if t < 29.5 or t > 42: return

        cy = CZ_TOP + CZ_H // 2

        # "We built something else." (31-34.5s)
        a = fade_window(t, 31.0, 0.1, 34.5, 0.6)
        if a > 0:
            p = min(1.0, (t - 31.0) / 1.8)
            typewriter_text(draw, "We built something else.", W // 2, cy,
                           self.ff['built'], WHITE, p, a, n)

        # "An instrument." (35.5-38s, teal)
        a = fade_window(t, 35.5, 0.1, 38.0, 0.6)
        if a > 0:
            p = min(1.0, (t - 35.5) / 1.0)
            typewriter_text(draw, "An instrument.", W // 2, cy,
                           self.ff['instrument'], ACCENT, p, a, n)

        # "Sits still." + "Sees everything." — massive vertically centered block
        gap = 120
        total_h = self.lh['sits'] + gap + self.lh['sees']
        block_top = CZ_TOP + (CZ_H - total_h) // 2
        y1 = block_top + self.lh['sits'] // 2
        y2 = block_top + self.lh['sits'] + gap + self.lh['sees'] // 2

        a1 = fade_window(t, 39.0, 0.1, 42.0, 0.8)
        if a1 > 0:
            p = min(1.0, (t - 39.0) / 0.8)
            typewriter_text(draw, "Sits still.", W // 2, y1,
                           self.ff['sits'], WHITE, p, a1, n)

        a2 = fade_window(t, 40.0, 0.1, 42.0, 0.8)
        if a2 > 0:
            p = min(1.0, (t - 40.0) / 1.2)
            typewriter_text(draw, "Sees everything.", W // 2, y2,
                           self.ff['sees'], WHITE, p, a2, n)

    # ── ACT 3: Introducing Perch (42-53s) ────────────────

    def _act3_intro(self, img, draw, t, n):
        if t < 42 or t > 53: return

        fish_cy = CZ_TOP + int(CZ_H * 0.28)
        intro_cy = CZ_TOP + int(CZ_H * 0.52)
        sub_cy = CZ_TOP + int(CZ_H * 0.62)

        # Fish mark
        fish_a = fade_window(t, 44.0, 2.0, 51.0, 2.0)
        scale = lerp(0.93, 1.0, ease_out(min((t - 44) / 3.0, 1.0)))
        composite(img, self.fish, W // 2, fish_cy, opacity=fish_a, scale=scale)

        # "Introducing Perch." — typewriter with teal period
        txt_a = fade_window(t, 46.0, 1.5, 51.0, 2.0)
        if txt_a > 0:
            font = self.ff['intro']
            full = "Introducing Perch."
            p = min(1.0, (t - 46.0) / 2.0)
            typewriter_text(draw, full, W // 2, intro_cy, font, WHITE, p, txt_a, n)
            # Overdraw period in teal when visible
            chars = int(len(full) * min(p, 1.0))
            if chars >= len(full):
                bb_full = draw.textbbox((0, 0), full, font=font)
                tw_full = bb_full[2] - bb_full[0]
                th_full = bb_full[3] - bb_full[1]
                x = W // 2 - tw_full // 2
                x = max(MARGIN_H, min(x, W - MARGIN_H - tw_full))
                y = intro_cy - th_full // 2
                bb_text = draw.textbbox((0, 0), "Introducing Perch", font=font)
                tw_text = bb_text[2] - bb_text[0]
                draw.text((x + tw_text, y), ".", font=font, fill=mul_c(ACCENT, txt_a))

        # "the first instrument by Candlefish"
        sub_a = fade_window(t, 50.0, 1.5, 51.0, 2.0)
        txt_c(draw, "the first instrument by Candlefish",
              W // 2, sub_cy, self.f_attr, DIM, sub_a * 0.6)

    # ── ACT 4: Signal (53-59s) ───────────────────────────

    def _act4_signal(self, draw, t, n):
        if t < 53 or t > 59: return

        y1 = CZ_TOP + int(CZ_H * 0.25)
        y2 = CZ_TOP + int(CZ_H * 0.43)
        y3 = CZ_TOP + int(CZ_H * 0.70)

        # "The answer isn't" types first
        a = fade_window(t, 53.3, 0.1, 58.5, 0.5)
        if a > 0:
            p1 = min(1.0, (t - 53.3) / 1.5)
            typewriter_text(draw, "The answer isn't", W // 2, y1,
                           self.ff['answer1'], WHITE, p1, a, n)
            # "more AI." types after first line
            if t >= 54.8:
                p2 = min(1.0, (t - 54.8) / 0.8)
                typewriter_text(draw, "more AI.", W // 2, y2,
                               self.ff['answer2'], WHITE, p2, a, n)

        # "It's better signal." (teal)
        a2 = fade_window(t, 56.5, 0.1, 58.5, 0.5)
        if a2 > 0:
            p = min(1.0, (t - 56.5) / 1.2)
            typewriter_text(draw, "It's better signal.", W // 2, y3,
                           self.ff['signal'], ACCENT, p, a2, n)

    # ── ACT 5: Data reveals (59-80s) ─────────────────────

    def _act5_data(self, img, draw, t, n):
        if t < 58.5 or t > 80: return

        # Data 1: Weekly Owner Briefing (59-64.5s)
        r1_a = fade_window(t, 59.0, 0.8, 64.5, 0.5)
        if r1_a > 0:
            bg = self.slides.get('perch-slide-03.png')
            if bg:
                composite(img, bg, W // 2, CZ_TOP + CZ_H // 2, opacity=r1_a * 0.5)
            self._data_briefing(draw, t, r1_a, n)

        # Data 2: Anomaly Alert (64.5-70.5s)
        r2_a = fade_window(t, 64.5, 0.8, 70.5, 0.5)
        if r2_a > 0:
            bg = self.slides.get('perch-slide-07.png')
            if bg:
                composite(img, bg, W // 2, CZ_TOP + CZ_H // 2, opacity=r2_a * 0.4)
            self._data_anomaly(draw, t, r2_a, n)

        # Data 3: Cash Flow (70.5-77s)
        r3_a = fade_window(t, 70.5, 0.8, 77.0, 0.5)
        if r3_a > 0:
            bg = self.slides.get('perch-slide-11.png')
            if bg:
                composite(img, bg, W // 2, CZ_TOP + CZ_H // 2, opacity=r3_a * 0.4)
            self._data_cashflow(draw, t, r3_a, n)

        # "It comes to you." (77-79.5s)
        a = fade_window(t, 77.0, 0.1, 79.5, 0.5)
        if a > 0:
            p = min(1.0, (t - 77.0) / 1.2)
            typewriter_text(draw, "It comes to you.", W // 2, CZ_TOP + CZ_H // 2,
                           self.ff['comes'], ACCENT, p, a, n)

    def _metric_card(self, draw, y, value, label, accent, opacity, height=180):
        x_l, x_r = MARGIN_H, W - MARGIN_H
        draw.rectangle([x_l, y, x_r, y + height], fill=mul_c(SURFACE, opacity))
        draw.rectangle([x_l, y, x_l + 8, y + height], fill=mul_c(accent, opacity))
        draw.text((x_l + 36, y + 30), value, font=self.f_data_metric,
                  fill=mul_c(WHITE, opacity))
        draw.text((x_l + 36, y + height - 55), label, font=self.f_data_label,
                  fill=mul_c(GRAY_MD, opacity))

    def _data_briefing(self, draw, t, a, n):
        elapsed = t - 59.0
        ey_y   = CZ_TOP + int(CZ_H * 0.06)
        t1_cy  = CZ_TOP + int(CZ_H * 0.16)
        mc1_y  = CZ_TOP + int(CZ_H * 0.32)
        mc2_y  = CZ_TOP + int(CZ_H * 0.46)
        act_ey = CZ_TOP + int(CZ_H * 0.62)
        act_y  = CZ_TOP + int(CZ_H * 0.68)

        draw.text((MARGIN_H, ey_y), "WEEKLY OWNER BRIEFING", font=self.f_eyebrow,
                  fill=mul_c(ACCENT, a))
        progress = min(1.0, elapsed / 2.0)
        typewriter_text(draw, "Revenue up. Margins down.", W // 2, t1_cy,
                       self.ff['d1_title'], WHITE, progress, a, n)
        if elapsed > 1.0:
            p = min(1.0, (elapsed - 1.0) / 0.5)
            self._metric_card(draw, mc1_y, "+12%", "Revenue", GREEN, a * p)
        if elapsed > 1.5:
            p = min(1.0, (elapsed - 1.5) / 0.5)
            self._metric_card(draw, mc2_y, "-11 pts", "Gross Margin", RED, a * p)
        if elapsed > 2.5:
            p = min(1.0, (elapsed - 2.5) / 0.8)
            draw.text((MARGIN_H, act_ey), "NEXT ACTION", font=self.f_eyebrow,
                      fill=mul_c(ACCENT, a * p * 0.7))
            lines = wrap_text(draw, "Talk with the PM before the next bid.",
                            self.f_action, MAX_TW - 20)
            for i, ln in enumerate(lines):
                draw.text((MARGIN_H, act_y + i * 42), ln, font=self.f_action,
                          fill=mul_c(WHITE, a * p * 0.8))

    def _data_anomaly(self, draw, t, a, n):
        elapsed = t - 65.0
        ey_y   = CZ_TOP + int(CZ_H * 0.06)
        t1_cy  = CZ_TOP + int(CZ_H * 0.16)
        mc1_y  = CZ_TOP + int(CZ_H * 0.32)
        act_ey = CZ_TOP + int(CZ_H * 0.52)
        act_y  = CZ_TOP + int(CZ_H * 0.58)

        draw.text((MARGIN_H, ey_y), "ANOMALY ALERT", font=self.f_eyebrow,
                  fill=mul_c(AMBER, a))
        progress = min(1.0, elapsed / 1.8)
        typewriter_text(draw, "Two identical charges.", W // 2, t1_cy,
                       self.ff['d2_title'], WHITE, progress, a, n)
        if elapsed > 1.0:
            p = min(1.0, (elapsed - 1.0) / 0.5)
            self._metric_card(draw, mc1_y, "Sherwin-Williams", "$2,847 \u00d7 2",
                            AMBER, a * p, height=200)
        if elapsed > 2.0:
            p = min(1.0, (elapsed - 2.0) / 0.8)
            draw.text((MARGIN_H, act_ey), "INTERPRETATION", font=self.f_eyebrow,
                      fill=mul_c(AMBER, a * p * 0.7))
            lines = wrap_text(draw, "Likely duplicate. Check with bookkeeper.",
                            self.f_action, MAX_TW - 20)
            for i, ln in enumerate(lines):
                draw.text((MARGIN_H, act_y + i * 42), ln, font=self.f_action,
                          fill=mul_c(WHITE, a * p * 0.8))

    def _data_cashflow(self, draw, t, a, n):
        elapsed = t - 71.0
        ey_y   = CZ_TOP + int(CZ_H * 0.06)
        t1_cy  = CZ_TOP + int(CZ_H * 0.16)
        mc1_y  = CZ_TOP + int(CZ_H * 0.30)
        mc2_y  = CZ_TOP + int(CZ_H * 0.42)
        mc3_y  = CZ_TOP + int(CZ_H * 0.54)
        act_ey = CZ_TOP + int(CZ_H * 0.68)
        act_y  = CZ_TOP + int(CZ_H * 0.74)

        draw.text((MARGIN_H, ey_y), "CASH FLOW READ", font=self.f_eyebrow,
                  fill=mul_c(BRIGHT, a))
        progress = min(1.0, elapsed / 2.0)
        typewriter_text(draw, "41 operating days.", W // 2, t1_cy,
                       self.ff['d3_title'], WHITE, progress, a, n)
        if elapsed > 1.0:
            p = min(1.0, (elapsed - 1.0) / 0.4)
            self._metric_card(draw, mc1_y, "41", "Days Runway", BRIGHT, a * p)
        if elapsed > 1.4:
            p = min(1.0, (elapsed - 1.4) / 0.4)
            self._metric_card(draw, mc2_y, "Clean", "AR to 45", GREEN, a * p)
        if elapsed > 1.8:
            p = min(1.0, (elapsed - 1.8) / 0.4)
            self._metric_card(draw, mc3_y, "May 28", "Watchpoint", AMBER, a * p)
        if elapsed > 2.5:
            p = min(1.0, (elapsed - 2.5) / 0.8)
            draw.text((MARGIN_H, act_ey), "FORWARD LOOK", font=self.f_eyebrow,
                      fill=mul_c(BRIGHT, a * p * 0.7))
            lines = wrap_text(draw, "Equipment lease + Q2 taxes land same week.",
                            self.f_action, MAX_TW - 20)
            for i, ln in enumerate(lines):
                draw.text((MARGIN_H, act_y + i * 42), ln, font=self.f_action,
                          fill=mul_c(WHITE, a * p * 0.8))

    # ── ACT 6: Close (78-100s) ───────────────────────────

    def _act6_close(self, img, draw, t, n):
        if t < 78: return

        fish_cy = CZ_TOP + int(CZ_H * 0.30)
        word_cy = CZ_TOP + int(CZ_H * 0.50)
        line_y  = CZ_TOP + int(CZ_H * 0.57)
        attr1_y = CZ_TOP + int(CZ_H * 0.63)
        attr2_y = CZ_TOP + int(CZ_H * 0.69)
        url_y   = CZ_TOP + int(CZ_H * 0.80)
        qr_cy   = CZ_TOP + int(CZ_H * 0.90)

        # Fish
        fish_a = fade_window(t, 80.0, 1.5, 97.0, 3.0)
        composite(img, self.fish, W // 2, fish_cy, opacity=fish_a)

        # "Perch." — typewriter with teal period
        word_a = fade_window(t, 81.5, 1.5, 97.0, 3.0)
        if word_a > 0:
            font = self.ff['perch']
            full = "Perch."
            p = min(1.0, (t - 81.5) / 1.0)
            typewriter_text(draw, full, W // 2, word_cy, font, WHITE, p, word_a, n)
            # Overdraw period in teal
            chars = int(len(full) * min(p, 1.0))
            if chars >= len(full):
                bb_full = draw.textbbox((0, 0), full, font=font)
                tw_full = bb_full[2] - bb_full[0]
                th_full = bb_full[3] - bb_full[1]
                x = W // 2 - tw_full // 2
                x = max(MARGIN_H, min(x, W - MARGIN_H - tw_full))
                y = word_cy - th_full // 2
                bb_text = draw.textbbox((0, 0), "Perch", font=font)
                tw_text = bb_text[2] - bb_text[0]
                draw.text((x + tw_text, y), ".", font=font, fill=mul_c(ACCENT, word_a))

        # Accent line
        line_a = fade_window(t, 83.0, 1.0, 97.0, 3.0)
        if line_a > 0:
            draw.rectangle([MARGIN_H, line_y, W - MARGIN_H, line_y + 2],
                          fill=mul_c(ACCENT, line_a))

        # "the first instrument"
        a1 = fade_window(t, 83.5, 0.1, 97.0, 3.0)
        if a1 > 0:
            p = min(1.0, (t - 83.5) / 1.5)
            typewriter_text(draw, "the first instrument", W // 2, attr1_y,
                           self.f_attr, GRAY_MD, p, a1, n)

        # "built by Candlefish" — whisper reveal
        a2 = fade_window(t, 87.0, 3.0, 97.0, 3.0)
        if a2 > 0:
            p = min(1.0, (t - 87.0) / 2.0)
            typewriter_text(draw, "built by Candlefish", W // 2, attr2_y,
                           self.f_attr_sm, WHISPER, p, a2 * 0.55, n)

        # URL
        url_a = fade_window(t, 90.0, 1.0, 97.0, 3.0)
        if url_a > 0:
            p = min(1.0, (t - 90.0) / 1.5)
            typewriter_text(draw, "instruments.highline.work", W // 2, url_y,
                           self.f_url, ACCENT, p, url_a, n)

        # QR
        qr_a = fade_window(t, 91.5, 1.0, 97.0, 3.0)
        composite(img, self.qr, W // 2, qr_cy, opacity=qr_a * 0.7)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    renderer = Renderer()
    cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'warning',
           '-f', 'image2pipe', '-vcodec', 'png', '-r', str(FPS), '-i', 'pipe:',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
           '-pix_fmt', 'yuv420p', OUT_FILE]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for frame_n in range(FRAMES):
        if frame_n % FPS == 0:
            print(f"\r  Rendering: {frame_n // FPS}/{DUR}s  ", end='', file=sys.stderr, flush=True)
        frame = renderer.render(frame_n)
        buf = io.BytesIO()
        frame.save(buf, format='PNG', compress_level=1)
        proc.stdin.write(buf.getvalue())
    proc.stdin.close()
    rc = proc.wait()
    print(file=sys.stderr)
    if rc == 0:
        print(f"  \u2713 {OUT_FILE}  ({os.path.getsize(OUT_FILE) / 1024 / 1024:.1f} MB)", file=sys.stderr)
    else:
        print(f"  \u2717 ffmpeg exited {rc}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
