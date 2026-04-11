#!/bin/bash
set -e

# Build the layered cacophony from real keynote clips
# Output: 21 seconds of progressively garbled AI hype voices
# Timeline: maps to 7-28s in the final video

DIR="/Users/patricksmith/Work/instrument-repo/assets/audio"
KEYS="$DIR/cacophony/keynotes"
CLIPS="$DIR/cacophony/clips"
OUT="$DIR/cacophony-real.wav"

echo "=== Building Cacophony from Real Keynotes ==="

# Phase 1 (0-5s = video 7-12s): Altman alone, clear and recognizable
# Phase 2 (5-11s = video 12-18s): Altman + Jensen + Nadella competing
# Phase 3 (11-21s = video 18-28s): ALL voices + TTS buzzwords = wall of noise

# Keynote delays (seconds into the 21s cacophony):
#   altman-agi:           0s  (solo for first 5s)
#   jensen-factories:     4s  (overlaps altman in phase 2)
#   nadella-agents:       6s  (three-way in phase 2)
#   pichai-profound:      9s  (phase 2→3 transition)
#   gates-biggest:       11s  (phase 3 starts)
#   zuckerberg-agi:      12s  (pile on)
#   cnbc-ai-jobs:        13s  (wall of noise)
#   ted-revolution:      14s  (wall of noise)
#   jensen-trillion:     15s  (encore)
#   vc-agent-era:        16s  (chaos)
#   nadella-people:      13s  (more overlap)
#   yang-automate:       17s  (chaos)

# TTS buzzword clips sprinkled in phase 3 (11-21s):
#   c00-c15 placed at 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5

echo "  Layering keynotes + buzzword clips..."

ffmpeg -y -hide_banner -loglevel warning \
  -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
  -i "$KEYS/altman-agi.mp3" \
  -i "$KEYS/jensen-factories.mp3" \
  -i "$KEYS/nadella-agents.mp3" \
  -i "$KEYS/pichai-profound.mp3" \
  -i "$KEYS/gates-biggest.mp3" \
  -i "$KEYS/zuckerberg-agi.mp3" \
  -i "$KEYS/cnbc-ai-jobs.mp3" \
  -i "$KEYS/ted-revolution.mp3" \
  -i "$KEYS/jensen-trillion.mp3" \
  -i "$KEYS/vc-agent-era.mp3" \
  -i "$KEYS/nadella-people-agents.mp3" \
  -i "$KEYS/yang-automate.mp3" \
  -i "$CLIPS/c00.mp3" \
  -i "$CLIPS/c01.mp3" \
  -i "$CLIPS/c02.mp3" \
  -i "$CLIPS/c03.mp3" \
  -i "$CLIPS/c04.mp3" \
  -i "$CLIPS/c05.mp3" \
  -i "$CLIPS/c06.mp3" \
  -i "$CLIPS/c07.mp3" \
  -i "$CLIPS/c08.mp3" \
  -i "$CLIPS/c09.mp3" \
  -i "$CLIPS/c10.mp3" \
  -i "$CLIPS/c11.mp3" \
  -i "$CLIPS/c12.mp3" \
  -i "$CLIPS/c13.mp3" \
  -i "$CLIPS/c14.mp3" \
  -i "$CLIPS/c15.mp3" \
  -filter_complex "
    [1:a]adelay=0|0,volume=0.7[k1];
    [2:a]adelay=4000|4000,volume=0.55[k2];
    [3:a]adelay=6000|6000,volume=0.5[k3];
    [4:a]adelay=9000|9000,volume=0.4[k4];
    [5:a]adelay=11000|11000,volume=0.35[k5];
    [6:a]adelay=12000|12000,volume=0.3[k6];
    [7:a]adelay=13000|13000,volume=0.3[k7];
    [8:a]adelay=14000|14000,volume=0.3[k8];
    [9:a]adelay=15000|15000,volume=0.3[k9];
    [10:a]adelay=16000|16000,volume=0.25[k10];
    [11:a]adelay=13000|13000,volume=0.3[k11];
    [12:a]adelay=17000|17000,volume=0.25[k12];
    [13:a]adelay=11000|11000,volume=0.2[b0];
    [14:a]adelay=11500|11500,volume=0.2[b1];
    [15:a]adelay=12000|12000,volume=0.2[b2];
    [16:a]adelay=12500|12500,volume=0.2[b3];
    [17:a]adelay=13000|13000,volume=0.2[b4];
    [18:a]adelay=13500|13500,volume=0.2[b5];
    [19:a]adelay=14000|14000,volume=0.2[b6];
    [20:a]adelay=14500|14500,volume=0.2[b7];
    [21:a]adelay=15000|15000,volume=0.2[b8];
    [22:a]adelay=15500|15500,volume=0.2[b9];
    [23:a]adelay=16000|16000,volume=0.2[b10];
    [24:a]adelay=16500|16500,volume=0.2[b11];
    [25:a]adelay=17000|17000,volume=0.2[b12];
    [26:a]adelay=17500|17500,volume=0.2[b13];
    [27:a]adelay=18000|18000,volume=0.2[b14];
    [28:a]adelay=18500|18500,volume=0.2[b15];
    [0:a][k1][k2][k3][k4][k5][k6][k7][k8][k9][k10][k11][k12][b0][b1][b2][b3][b4][b5][b6][b7][b8][b9][b10][b11][b12][b13][b14][b15]amix=inputs=29:duration=first:dropout_transition=0:normalize=0,volume=1.5[mix];
    [mix]afade=t=out:st=20:d=1[out]
  " -map "[out]" -t 21 -c:a pcm_s16le "$OUT"

echo "  Duration: $(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUT")s"
echo "  ✓ $OUT"
