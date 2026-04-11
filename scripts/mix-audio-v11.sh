#!/bin/bash
set -e

DIR="/Users/patricksmith/Work/instrument-repo/assets"
VO="$DIR/audio/vo"
VIDEO="$DIR/video/perch-brand-reveal-v11.mp4"
FINAL="$DIR/video/perch-brand-reveal-v11-FINAL.mp4"
DUR=100

echo "=== Perch Brand Reveal v11 — Audio Mix ==="

# Step 0: Build cacophony from real keynotes
echo "  Step 0: Building cacophony from real keynotes..."
bash /Users/patricksmith/Work/instrument-repo/scripts/build-cacophony.sh

echo "  Layer 1: Cacophony (real keynotes, placed at 7-28s)..."
# The cacophony-real.wav is 21s long, fades out at end
# Volume builds with the density — no separate fade needed
ffmpeg -y -hide_banner -loglevel warning \
  -i "$DIR/audio/cacophony-real.wav" \
  -filter_complex "[0:a]volume=0.8[out]" \
  -map "[out]" -t 21 -c:a pcm_s16le "$DIR/audio/layer-cac.wav"

echo "  Layer 2: Tinnitus (independent, 14-28s = 14s of build)..."
# Tinnitus is 25s source. We want 14 seconds of it (building to peak at 28s).
# Start from 11s into the source (to get the crescendo's meat) and take 14s
ffmpeg -y -hide_banner -loglevel warning \
  -i "$DIR/audio/tinnitus-crescendo.wav" \
  -ss 11 -t 14 \
  -af "volume=1.3" \
  -c:a pcm_s16le "$DIR/audio/layer-tin.wav"

echo "  Layer 3: 15 VO clips..."
# VO clips 01-agents at 0.5s and 02-noise at 3.5s are BEFORE cacophony (7s)
# They should NOT overlap with the cacophony
ffmpeg -y -hide_banner -loglevel warning \
  -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
  -i "$VO/01-agents.mp3" -i "$VO/02-noise.mp3" -i "$VO/03-something.mp3" -i "$VO/04-instrument.mp3" \
  -i "$VO/04b-sits.mp3" -i "$VO/13-intro-perch.mp3" -i "$VO/14-first-by-cf.mp3" \
  -i "$VO/15-not-more-ai.mp3" -i "$VO/16-better-signal.mp3" -i "$VO/07-watches.mp3" \
  -i "$VO/08-no-dash.mp3" -i "$VO/09-comes.mp3" -i "$VO/10-first.mp3" -i "$VO/11-not-last.mp3" \
  -i "$VO/12-learn.mp3" \
  -filter_complex "
    [1:a]adelay=500|500[v1];[2:a]adelay=3500|3500[v2];[3:a]adelay=31500|31500[v3];
    [4:a]adelay=36000|36000[v4];[5:a]adelay=40000|40000[v5];[6:a]adelay=46000|46000[v6];
    [7:a]adelay=50500|50500[v7];[8:a]adelay=53500|53500[v8];[9:a]adelay=56500|56500[v9];
    [10:a]adelay=59000|59000[v10];[11:a]adelay=66000|66000[v11];[12:a]adelay=69500|69500[v12];
    [13:a]adelay=82000|82000[v13];[14:a]adelay=87000|87000[v14];[15:a]adelay=90000|90000[v15];
    [0:a][v1][v2][v3][v4][v5][v6][v7][v8][v9][v10][v11][v12][v13][v14][v15]amix=inputs=16:duration=first:dropout_transition=0:normalize=0[vo]
  " -map "[vo]" -t $DUR -c:a pcm_s16le "$DIR/audio/layer-vo-post.wav"

echo "  Layer 4: Score (31-100s)..."
ffmpeg -y -hide_banner -loglevel warning -stream_loop -1 -i "$DIR/audio/score-clean.aac" -vn -t 69 -c:a pcm_s16le "$DIR/audio/layer-score-clean.wav"

echo "  Final mix..."
# Cacophony at 7s, tinnitus at 14s (independent timeline), ringing tail at 28s
# Score at 31s, VO throughout
# HARD CUT: everything stops at 28s except the ringing tail (fades over 3s)
ffmpeg -y -hide_banner -loglevel warning \
  -i "$VIDEO" \
  -i "$DIR/audio/layer-cac.wav" \
  -i "$DIR/audio/layer-tin.wav" \
  -i "$DIR/audio/ringing-tail.wav" \
  -i "$DIR/audio/layer-score-clean.wav" \
  -i "$DIR/audio/layer-vo-post.wav" \
  -filter_complex "
    [1:a]adelay=7000|7000,volume=0.8[cac];
    [2:a]adelay=14000|14000,volume=1.3[tin];
    [3:a]adelay=28000|28000,volume=0.5[ring];
    [4:a]adelay=31000|31000,volume=0.3[score];
    [5:a]volume=1.2[vo];
    [cac][tin][ring][score][vo]amix=inputs=5:duration=longest:dropout_transition=0:normalize=0[premix];
    [premix]loudnorm=I=-14:TP=-1:LRA=11[audio]
  " -map 0:v -map "[audio]" -c:v copy -c:a aac -b:a 192k -t $DUR "$FINAL"

echo ""
ffmpeg -i "$FINAL" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
echo "  ✓ FINAL: $FINAL"
