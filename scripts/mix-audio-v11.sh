#!/bin/bash
set -e

DIR="/Users/patricksmith/Work/instrument-repo/assets"
VO="$DIR/audio/vo"
VIDEO="$DIR/video/perch-brand-reveal-v11.mp4"
FINAL="$DIR/video/perch-brand-reveal-v11-FINAL.mp4"
DUR=100

echo "=== Perch Brand Reveal v11 — Audio Mix ==="

echo "  Layer 1: Cacophony..."
ffmpeg -y -hide_banner -loglevel warning -i "$DIR/audio/cacophony-rebuilt.wav" -filter_complex "[0:a]volume=0.7,afade=t=out:st=20:d=1[out]" -map "[out]" -t 21 -c:a pcm_s16le "$DIR/audio/layer-cac.wav"

echo "  Layer 2: Tinnitus..."
ffmpeg -y -hide_banner -loglevel warning -i "$DIR/audio/tinnitus-crescendo.wav" -t 18 -af "volume=1.5" -c:a pcm_s16le "$DIR/audio/layer-tin.wav"

echo "  Layer 3: 15 VO clips..."
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
  " -map "[vo]" -t $DUR -c:a pcm_s16le "$DIR/audio/layer-vo.wav"

echo "  Layer 4: Score (31-100s)..."
ffmpeg -y -hide_banner -loglevel warning -stream_loop -1 -i "$DIR/audio/score-clean.aac" -vn -t 69 -c:a pcm_s16le "$DIR/audio/layer-score.wav"

echo "  Final mix..."
ffmpeg -y -hide_banner -loglevel warning \
  -i "$VIDEO" -i "$DIR/audio/layer-cac.wav" -i "$DIR/audio/layer-tin.wav" \
  -i "$DIR/audio/ringing-tail.wav" -i "$DIR/audio/layer-score.wav" -i "$DIR/audio/layer-vo.wav" \
  -filter_complex "
    [1:a]adelay=7000|7000,volume=0.7[cac];[2:a]adelay=10000|10000,volume=1.2[tin];
    [3:a]adelay=28000|28000,volume=0.5[ring];[4:a]adelay=31000|31000,volume=0.3[score];
    [5:a]volume=1.2[vo];
    [cac][tin][ring][score][vo]amix=inputs=5:duration=longest:dropout_transition=0:normalize=0[premix];
    [premix]loudnorm=I=-14:TP=-1:LRA=11[audio]
  " -map 0:v -map "[audio]" -c:v copy -c:a aac -b:a 192k -t $DUR "$FINAL"

echo ""
ffmpeg -i "$FINAL" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
echo "  ✓ FINAL: $FINAL"
