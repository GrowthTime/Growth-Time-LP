#!/usr/bin/env python3
"""
GTR motion — procedural soundtrack + sound design.

Reads out/timeline.json (written by `node tools/render.mjs --info`), which
contains the timeline duration, the music arrangement (GTR.TIMELINE.music)
and every SFX cue the scenes registered with ctx.cue(). Synthesizes a
beat-synced track (numpy only, no samples except the app's own
cha-ching.mp3) and writes:
    audio/gtr-soundtrack.wav   (48 kHz / 16-bit stereo — used for the mux)
    audio/gtr-soundtrack.mp3   (for the in-browser player)

Usage:  python3 tools/soundtrack.py [--no-sfx] [--no-music]
"""
import json
import math
import os
import subprocess
import sys

import numpy as np
from scipy import signal

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SR = 48000
RNG = np.random.default_rng(7)


# ------------------------------------------------------------------ utils
def db(x):
    return 10 ** (x / 20)


def note_hz(n):
    """MIDI note -> Hz"""
    return 440.0 * 2 ** ((n - 69) / 12)


NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6,
        'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}


def chord_notes(name, octave=4):
    """'Am' / 'F' / 'C' / 'G' / 'Em' / 'Dm' / 'Fmaj7' / 'Am9' / 'Gsus4' -> list of MIDI notes"""
    root = name[0]
    rest = name[1:]
    if rest[:1] in ('#', 'b'):
        root += rest[0]
        rest = rest[1:]
    r = 12 * (octave + 1) + NOTE[root]
    if rest.startswith('m') and not rest.startswith('maj'):
        iv = [0, 3, 7]
        rest = rest[1:]
    else:
        iv = [0, 4, 7]
    if rest == 'sus4':
        iv = [0, 5, 7]
    if rest == 'sus2':
        iv = [0, 2, 7]
    if rest == '7':
        iv = iv + [10]
    if rest == 'maj7':
        iv = iv + [11]
    if rest == '9':
        iv = iv + [10, 14]
    if rest == 'add9':
        iv = iv + [14]
    return [r + i for i in iv]


def env_adsr(n, a, d, s, r, sr=SR):
    a_n, d_n, r_n = int(a * sr), int(d * sr), int(r * sr)
    s_n = max(0, n - a_n - d_n - r_n)
    e = np.concatenate([
        np.linspace(0, 1, max(a_n, 1), endpoint=False),
        np.linspace(1, s, max(d_n, 1), endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, max(r_n, 1)),
    ])
    if len(e) < n:
        e = np.pad(e, (0, n - len(e)))
    return e[:n]


def lp(x, fc, q=0.707, sr=SR):
    fc = min(max(fc, 20), sr * 0.45)
    b, a = signal.iirfilter(2, fc / (sr / 2), btype='low', ftype='butter')
    return signal.lfilter(b, a, x)


def hp(x, fc, sr=SR):
    fc = min(max(fc, 20), sr * 0.45)
    b, a = signal.iirfilter(2, fc / (sr / 2), btype='high', ftype='butter')
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, sr=SR):
    lo = max(lo, 20)
    hi = min(hi, sr * 0.45)
    b, a = signal.iirfilter(2, [lo / (sr / 2), hi / (sr / 2)], btype='band', ftype='butter')
    return signal.lfilter(b, a, x)


def svf_sweep(x, f_start, f_end, q=0.9, sr=SR, mode='lp'):
    """time-varying state-variable filter (exp sweep) — for risers/pluck envelopes"""
    n = len(x)
    f = f_start * (f_end / f_start) ** (np.arange(n) / max(n - 1, 1))
    g = np.tan(np.pi * np.clip(f, 20, sr * 0.45) / sr)
    k = 1.0 / q
    ic1 = ic2 = 0.0
    out = np.empty(n)
    for i in range(n):
        gi = g[i]
        a1 = 1 / (1 + gi * (gi + k))
        v3 = x[i] - ic2
        v1 = a1 * ic1 + gi * a1 * v3
        v2 = ic2 + gi * v1
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        out[i] = v2 if mode == 'lp' else (v1 if mode == 'bp' else x[i] - k * v1 - v2)
    return out


def filt_env(x, f_lo, f_hi, decay, sr=SR):
    """lowpass with exponential cutoff decay from f_hi to f_lo (block-wise biquads, cheap)"""
    n = len(x)
    out = np.zeros(n)
    blk = 256
    zi = None
    for s in range(0, n, blk):
        t = s / sr
        fc = f_lo + (f_hi - f_lo) * math.exp(-t / decay)
        b, a = signal.iirfilter(2, min(fc, sr * 0.45) / (sr / 2), btype='low', ftype='butter')
        if zi is None:
            zi = signal.lfilter_zi(b, a) * 0
        out[s:s + blk], zi = signal.lfilter(b, a, x[s:s + blk], zi=zi)
    return out


def saw(freq, n, phase=0.0, sr=SR):
    t = np.arange(n) / sr
    ph = (phase + freq * t) % 1.0
    # polyBLEP-ish softening via slight lowpass later; naive saw is fine after filtering
    return 2 * ph - 1


def supersaw(freq, n, voices=7, detune=0.18, sr=SR, seed=0):
    r = np.random.default_rng(seed)
    out = np.zeros(n)
    for v in range(voices):
        d = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune  # semitone offset
        f = freq * 2 ** (d / 12)
        out += saw(f, n, r.random(), sr) * (1.0 if v == voices // 2 else 0.7)
    return out / voices


def pan(mono, p):
    """p in [-1,1] -> stereo (equal power)"""
    a = (p + 1) * math.pi / 4
    return np.stack([mono * math.cos(a), mono * math.sin(a)], axis=1)


def place(buf, clip, t, gain=1.0):
    """mix stereo clip (n,2) or mono into buf at time t (seconds)"""
    if clip.ndim == 1:
        clip = np.stack([clip, clip], axis=1)
    i = int(round(t * SR))
    if i >= len(buf):
        return
    if i < 0:
        clip = clip[-i:]
        i = 0
    n = min(len(clip), len(buf) - i)
    buf[i:i + n] += clip[:n] * gain


def reverb_ir(seconds=2.4, decay=3.0, seed=3, lowcut=250, highcut=9000):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    env = np.exp(-decay * t)
    ir = np.stack([r.standard_normal(n) * env, r.standard_normal(n) * env], axis=1)
    for c in range(2):
        ir[:, c] = bp(ir[:, c], lowcut, highcut)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def convolve_st(x, ir):
    out = np.zeros((len(x) + len(ir) - 1, 2))
    for c in range(2):
        out[:, c] = signal.fftconvolve(x[:, c], ir[:, c])
    return out[: len(x)]


def delay_st(x, t_l, t_r, fb=0.35, mix=0.3, n_taps=5):
    out = x.copy()
    for k in range(1, n_taps + 1):
        g = mix * fb ** (k - 1)
        for c, tt in enumerate((t_l, t_r)):
            d = int(tt * k * SR)
            if d < len(x):
                out[d:, c] += x[:-d, c if k % 2 else 1 - c] * g
    return out


def load_audio(path):
    ff = os.environ.get('FFMPEG', 'ffmpeg')
    raw = subprocess.run([ff, '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)


# ------------------------------------------------------------------ instruments
def kick(punch=1.0):
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 42 + 120 * np.exp(-t * 32) + 30 * np.exp(-t * 8)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(RNG.standard_normal(n) * np.exp(-t * 400), 2500) * 0.35 * punch
    x = np.tanh((body + click) * 1.6)
    return x * 0.95


def clap():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    nz = RNG.standard_normal(n)
    e = np.zeros(n)
    for off in (0.0, 0.011, 0.022, 0.031):
        i = int(off * SR)
        e[i:] += np.exp(-(t[: n - i]) * 55)
    e += 0.35 * np.exp(-t * 9)
    x = bp(nz * e, 900, 5200)
    return x / (np.max(np.abs(x)) + 1e-9) * 0.8


def hat(open_=False):
    n = int((0.32 if open_ else 0.07) * SR)
    t = np.arange(n) / SR
    nz = RNG.standard_normal(n)
    x = bp(nz, 6500, 13500) * np.exp(-t * (9 if open_ else 70))
    return x / (np.max(np.abs(x)) + 1e-9) * (0.32 if open_ else 0.26)


def tick():
    """clock tick for the 'time' motif"""
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 180) + 0.4 * hp(RNG.standard_normal(n), 5000) * np.exp(-t * 300)
    return x * 0.5


def sub_note(freq, dur, glide_from=None):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = np.full(n, freq)
    if glide_from:
        f = freq + (glide_from - freq) * np.exp(-t * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.18 * np.sin(2 * ph)
    return np.tanh(x * 1.3) * env_adsr(n, 0.005, 0.1, 0.85, 0.05)


def pluck(freq, dur=0.22, bright=5200):
    n = int(max(dur, 0.05) * SR) + int(0.25 * SR)
    x = supersaw(freq, n, voices=3, detune=0.08) + 0.5 * np.sign(np.sin(2 * np.pi * freq * np.arange(n) / SR)) * 0.3
    x = filt_env(x, 400, bright, 0.09)
    return x * env_adsr(n, 0.002, 0.18, 0.25, 0.2) * 0.9


def pad_chord(notes, dur, bright=2400, seed=0):
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for k, m in enumerate(notes):
        f = note_hz(m)
        l = supersaw(f, n, voices=7, detune=0.22, seed=seed * 31 + k)
        r = supersaw(f, n, voices=7, detune=0.24, seed=seed * 31 + k + 101)
        out[:, 0] += l
        out[:, 1] += r
    for c in range(2):
        out[:, c] = lp(out[:, c], bright)
    e = env_adsr(n, min(0.35, dur * 0.3), 0.3, 0.9, min(0.5, dur * 0.3))
    return out * e[:, None] / max(len(notes), 1) * 0.9


def riser(dur, f0=300, f1=9000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = RNG.standard_normal(n)
    x = svf_sweep(nz, f0, f1, q=2.2, mode='bp')
    tone_f = 110 * 2 ** (3 * (t / dur) ** 1.5)
    tone = np.sin(2 * np.pi * np.cumsum(tone_f) / SR) * 0.25
    e = (t / dur) ** 2.2
    x = (x * 0.9 + tone) * e
    st = np.stack([x, np.roll(x, 90)], axis=1)
    return st / (np.max(np.abs(st)) + 1e-9) * 0.55


def impact(size=1.0):
    n = int(2.8 * SR)
    t = np.arange(n) / SR
    f = 38 + 70 * np.exp(-t * 14)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crack = lp(RNG.standard_normal(n), 6000) * np.exp(-t * 16) * 0.55
    x = np.tanh((boom * 1.4 + crack) * 1.3) * size
    return np.stack([x, x * 0.98], axis=1) * 0.9


def whoosh(dur=0.7, up=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = RNG.standard_normal(n)
    f0, f1 = (500, 6000) if up else (6000, 400)
    x = svf_sweep(nz, f0, f1, q=1.6, mode='bp')
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    x = x * e
    x = x / (np.max(np.abs(x)) + 1e-9)
    p = np.linspace(-0.6, 0.6, n) if up else np.linspace(0.6, -0.6, n)
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1) * 0.5


def blip(freq=1800, dur=0.09, kind='sine'):
    n = int(dur * SR) + int(0.05 * SR)
    t = np.arange(n) / SR
    if kind == 'tri':
        x = signal.sawtooth(2 * np.pi * freq * t, 0.5)
    else:
        x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)
    return x * np.exp(-t * (1 / dur) * 3.2) * 0.35


def ping(freq=1318.5):
    """notification ding — two partials, bell-ish"""
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * t) + 0.45 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 6)) * np.exp(-t * 4.5)
    return x * 0.3


def glitch(dur=0.25):
    n = int(dur * SR)
    x = RNG.standard_normal(n)
    # sample & hold bitcrush
    hold = 40
    x = np.repeat(x[::hold], hold)[:n]
    x = bp(x, 300, 6000) * (np.sign(np.sin(2 * np.pi * 22 * np.arange(n) / SR)) > 0)
    return x * 0.3 * env_adsr(n, 0.002, 0.05, 0.8, 0.05)


def typing(dur=1.0, rate=14):
    n = int(dur * SR)
    out = np.zeros(n)
    r = np.random.default_rng(11)
    k = 0.0
    while k < dur:
        i = int(k * SR)
        m = int(0.018 * SR)
        seg = hp(r.standard_normal(m), 2500) * np.exp(-np.arange(m) / SR * 260) * r.uniform(0.5, 1.0)
        out[i:i + m] += seg[: max(0, min(m, n - i))]
        k += 1 / rate * r.uniform(0.7, 1.3)
    return out * 0.25


def heartbeat():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 48 * t) * np.exp(-t * 18)
    x2 = np.zeros(n)
    i = int(0.18 * SR)
    x2[i:] = np.sin(2 * np.pi * 44 * t[: n - i]) * np.exp(-t[: n - i] * 16) * 0.7
    return np.tanh((x + x2) * 2) * 0.8


def error_buzz(dur=0.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = signal.square(2 * np.pi * 110 * t) * 0.5 + signal.square(2 * np.pi * 116.5 * t) * 0.5
    return lp(x, 1800) * env_adsr(n, 0.005, 0.05, 0.8, 0.08) * 0.28


def reverse_swell(dur=1.2):
    x = impact(0.6)[:, 0][: int(dur * SR)][::-1]
    x = hp(x, 200)
    return np.stack([x, x], axis=1) * 0.5


def coin_shimmer():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, f in enumerate([2093, 2637, 3136, 4186]):
        d = int(k * 0.06 * SR)
        out[d:] += np.sin(2 * np.pi * f * t[: n - d]) * np.exp(-t[: n - d] * 7)
    return out * 0.12


# ------------------------------------------------------------------ music
def render_music(music, dur):
    bpm = music.get('bpm', 120)
    beat = 60.0 / bpm
    n = int((dur + 4) * SR)
    drums = np.zeros((n, 2))
    bass = np.zeros((n, 2))
    pads = np.zeros((n, 2))
    arps = np.zeros((n, 2))
    fx = np.zeros((n, 2))
    duck = np.ones(n)  # sidechain envelope (kick)

    K, CL, HH, OH, TK = kick(), clap(), hat(), hat(True), tick()
    prog = music.get('progression', ['Am', 'F', 'C', 'G'])
    bars_per_chord = music.get('barsPerChord', 1)

    for sec in music.get('sections', []):
        s0, s1 = sec['start'], sec['end']
        feat = set(sec.get('layers', []))
        energy = sec.get('energy', 1.0)
        prog_s = sec.get('progression', prog)
        bpc = sec.get('barsPerChord', bars_per_chord)
        n_beats = int(round((s1 - s0) / beat))
        for b in range(n_beats):
            t = s0 + b * beat
            bar_i = b // 4
            chord = prog_s[(bar_i // bpc) % len(prog_s)]
            notes = chord_notes(chord, 3)
            in_bar = b % 4
            # drums
            if 'kick' in feat or ('halfkick' in feat and in_bar in (0,)):
                place(drums, K, t, 0.9 * energy)
                i = int(t * SR)
                m = int(0.32 * SR)
                if i < n:
                    seg = 1 - 0.72 * np.exp(-np.arange(min(m, n - i)) / SR * 9)
                    duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], seg)
            if 'clap' in feat and in_bar in (1, 3):
                place(drums, pan(CL, 0.05), t, 0.55 * energy)
            if 'hats' in feat:
                place(drums, pan(HH, -0.25), t + beat / 2, 0.5 * energy)
                if 'hats16' in feat:
                    place(drums, pan(HH, 0.3), t + beat / 4, 0.22 * energy)
                    place(drums, pan(HH, 0.3), t + 3 * beat / 4, 0.22 * energy)
            if 'openhat' in feat and in_bar in (1, 3):
                place(drums, pan(OH, 0.2), t + beat / 2, 0.22 * energy)
            if 'ticks' in feat:
                place(drums, pan(TK, 0.4 if b % 2 else -0.4), t, 0.5 * energy)
                if 'ticks8' in feat:
                    place(drums, pan(TK, 0.0), t + beat / 2, 0.25 * energy)
            # bass: 8th-note offbeat pump on chord root
            if 'bass' in feat:
                root = notes[0] - 12
                for k8 in range(2):
                    tt = t + k8 * beat / 2
                    bn = sub_note(note_hz(root), beat / 2 * 0.92)
                    place(bass, bn, tt, (0.42 if k8 else 0.3) * energy)
            if 'sub' in feat and in_bar == 0:
                place(bass, sub_note(note_hz(notes[0] - 12), beat * 4 * 0.98), t, 0.34 * energy)
            # arp: 16ths over chord tones, 2 octaves
            if 'arp' in feat:
                tones = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[0] + 24, notes[2] + 12, notes[1] + 24]
                for k16 in range(4):
                    idx = (b * 4 + k16) % len(tones)
                    tt = t + k16 * beat / 4
                    place(arps, pan(pluck(note_hz(tones[idx]), beat / 4, 3800 + 2600 * energy), -0.35 if k16 % 2 else 0.35), tt, 0.16 * energy)
            if 'lead' in feat and in_bar in (0, 2):
                top = chord_notes(chord, 5)
                mel = [top[2], top[1], top[0] + 12, top[2]]
                place(arps, pan(pluck(note_hz(mel[(bar_i * 2 + in_bar // 2) % 4]), beat * 1.6, 6000), 0.0), t, 0.2 * energy)
        # build-up snare roll over the last `rollBars` bars (8ths → 16ths, rising)
        if sec.get('roll'):
            rb = sec.get('rollBars', 2)
            r0 = s1 - rb * 4 * beat
            steps = int(rb * 4 * 4)
            for k in range(steps):
                tt = r0 + k * beat / 4
                frac = k / max(steps - 1, 1)
                if frac < 0.5 and k % 2:
                    continue
                place(drums, pan(CL, 0.0), tt, (0.12 + 0.45 * frac ** 1.5) * sec.get('rollGain', 1.0))
        # chord stabs on the off-beats
        if 'stabs' in feat:
            for b in range(n_beats):
                t = s0 + b * beat
                bar_i = b // 4
                chord = prog_s[(bar_i // bpc) % len(prog_s)]
                st = pad_chord(chord_notes(chord, 4), beat * 0.45, bright=4200, seed=b % 4)
                st *= np.exp(-np.arange(len(st)) / SR * 9)[:, None]
                place(arps, st, t + beat / 2, 0.55 * energy)
        # pads per chord span
        if 'pad' in feat:
            bar = beat * 4
            span = bar * bpc
            k = 0
            t = s0
            while t < s1 - 0.01:
                chord = prog_s[k % len(prog_s)]
                d = min(span, s1 - t)
                sweep = sec.get('padSweep')
                bright = sec.get('padBright', 2200) * (0.6 + 0.4 * energy)
                if sweep:
                    fr = (t - s0) / max(s1 - s0, 1e-6)
                    bright = sweep[0] * (sweep[1] / sweep[0]) ** fr
                pc = pad_chord(chord_notes(chord, 4) + [chord_notes(chord, 3)[0]], d + 0.4, bright=bright, seed=k)
                place(pads, pc, t, 0.5 * sec.get('padGain', 1.0))
                t += span
                k += 1
        if sec.get('riserOut'):
            rd = sec['riserOut'] if isinstance(sec['riserOut'], (int, float)) and sec['riserOut'] is not True else 4 * beat
            place(fx, riser(rd), s1 - rd, 0.5)
        if sec.get('impactIn'):
            place(fx, impact(1.0), s0, 0.75)
        if sec.get('swellOut'):
            place(fx, reverse_swell(1.2), s1 - 1.2, 0.6)

    # sidechain pump on pads/arps/bass
    pads *= duck[:, None] ** 1.2
    arps *= (0.35 + 0.65 * duck[:, None])
    bass *= (0.25 + 0.75 * duck[:, None])
    arps = delay_st(arps, beat * 0.75, beat * 0.5, fb=0.4, mix=0.28)
    ir = reverb_ir(2.8, 2.6)
    wet_pad = convolve_st(pads, ir)
    wet_arp = convolve_st(arps, ir)
    wet_fx = convolve_st(fx, ir)
    for c in range(2):
        bass[:, c] = lp(bass[:, c], 900)
        drums[:, c] = hp(drums[:, c], 28)
    music_mix = drums * 0.9 + bass * 1.0 + (pads + wet_pad * 0.35) * 0.55 + (arps + wet_arp * 0.25) * 0.8 + (fx + wet_fx * 0.3) * 0.9
    return music_mix


# ------------------------------------------------------------------ sfx
def render_sfx(cues, dur):
    n = int((dur + 4) * SR)
    sfx = np.zeros((n, 2))
    send = np.zeros((n, 2))
    chaching_path = os.path.join(ROOT, 'assets/sfx/cha-ching.mp3')
    chaching = load_audio(chaching_path) if os.path.exists(chaching_path) else None
    lib_cache = {}

    def get(name, c):
        key = (name, c.get('dur'), c.get('freq'), c.get('up'))
        if key in lib_cache:
            return lib_cache[key]
        if name == 'whoosh':
            clip = whoosh(c.get('dur', 0.7), c.get('up', True))
        elif name == 'swoosh':
            clip = whoosh(c.get('dur', 0.35), c.get('up', True))
        elif name == 'impact':
            clip = impact(c.get('size', 1.0))
        elif name == 'boom':
            clip = impact(1.3)
        elif name == 'riser':
            clip = riser(c.get('dur', 2.0))
        elif name == 'blip':
            clip = pan(blip(c.get('freq', 1800), c.get('dur', 0.09)), c.get('pan', 0))
        elif name == 'pop':
            clip = pan(blip(c.get('freq', 900), 0.06, 'tri'), c.get('pan', 0))
        elif name == 'ping' or name == 'notify':
            clip = pan(ping(c.get('freq', 1318.5)), c.get('pan', 0))
        elif name == 'glitch':
            clip = pan(glitch(c.get('dur', 0.25)), c.get('pan', 0))
        elif name == 'type':
            clip = pan(typing(c.get('dur', 1.0), c.get('rate', 14)), c.get('pan', 0))
        elif name == 'tick':
            clip = pan(tick(), c.get('pan', 0))
        elif name == 'heartbeat':
            clip = pan(heartbeat(), 0)
        elif name == 'error':
            clip = pan(error_buzz(c.get('dur', 0.4)), 0)
        elif name == 'cash' or name == 'chaching':
            clip = chaching if chaching is not None else pan(coin_shimmer(), 0)
        elif name == 'shimmer' or name == 'coins':
            clip = pan(coin_shimmer(), c.get('pan', 0))
        elif name == 'swell':
            clip = reverse_swell(c.get('dur', 1.2))
        else:
            print('  ! unknown cue', name)
            clip = np.zeros((10, 2))
        lib_cache[key] = clip
        return clip

    counts = {}
    for c in cues:
        name = c['name']
        counts[name] = counts.get(name, 0) + 1
        clip = get(name, c)
        g = db(c.get('db', 0)) * c.get('gain', 1.0)
        base = {'whoosh': 0.55, 'swoosh': 0.4, 'impact': 0.8, 'boom': 0.9, 'riser': 0.45, 'blip': 0.35, 'pop': 0.35,
                'ping': 0.4, 'notify': 0.45, 'glitch': 0.45, 'type': 0.45, 'tick': 0.5, 'heartbeat': 0.7,
                'error': 0.5, 'cash': 0.55, 'chaching': 0.55, 'shimmer': 0.5, 'coins': 0.5, 'swell': 0.5}.get(name, 0.4)
        place(sfx, clip, c['t'], base * g)
        if name in ('impact', 'boom', 'whoosh', 'ping', 'notify', 'swell'):
            place(send, clip, c['t'], base * g * 0.5)
    wet = convolve_st(send, reverb_ir(2.2, 3.2, seed=9))
    print('  sfx cues:', ', '.join(f'{k}×{v}' for k, v in sorted(counts.items())))
    return sfx + wet * 0.35


# ------------------------------------------------------------------ master
def master(x, dur, target_rms_db=-15.0):
    n = int(dur * SR)
    x = x[:n].copy()
    for c in range(2):
        x[:, c] = lp(x[:, c], 16500)
    # gentle bus compression (RMS envelope)
    mono = np.mean(np.abs(x), axis=1)
    envl = signal.lfilter([1 - 0.9995], [1, -0.9995], mono)
    thr = 0.18
    gain = np.where(envl > thr, (thr / (envl + 1e-9)) ** 0.35, 1.0)
    x *= gain[:, None]
    rms = np.sqrt(np.mean(x ** 2))
    x *= db(target_rms_db) / (rms + 1e-9)
    x = np.tanh(x * 1.05) / np.tanh(1.05)
    peak = np.max(np.abs(x))
    if peak > db(-1.0):
        x *= db(-1.0) / peak
    # fades
    fi = int(0.02 * SR)
    fo = int(1.5 * SR)
    x[:fi] *= np.linspace(0, 1, fi)[:, None]
    x[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2
    return x


def main():
    info_path = os.path.join(ROOT, 'out/timeline.json')
    info = json.load(open(info_path))
    dur = info['duration']
    music = info.get('music') or {}
    cues = info.get('cues', [])
    no_sfx = '--no-sfx' in sys.argv
    no_music = '--no-music' in sys.argv
    print(f'soundtrack: {dur:.2f}s · {len(cues)} cues · bpm {music.get("bpm", "?")}')
    n = int((dur + 4) * SR)
    mix = np.zeros((n, 2))
    if not no_music and music:
        mix += render_music(music, dur) * db(music.get('gainDb', 0))
    if not no_sfx:
        mix += render_sfx(cues, dur) * 0.9
    out = master(mix, dur)
    os.makedirs(os.path.join(ROOT, 'audio'), exist_ok=True)
    wav = os.path.join(ROOT, 'audio/gtr-soundtrack.wav')
    pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
    import wave
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    ff = os.environ.get('FFMPEG', 'ffmpeg')
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '192k',
                    os.path.join(ROOT, 'audio/gtr-soundtrack.mp3')], check=True)
    peak = 20 * math.log10(np.max(np.abs(out)) + 1e-12)
    rms = 20 * math.log10(np.sqrt(np.mean(out ** 2)) + 1e-12)
    print(f'  → audio/gtr-soundtrack.wav  peak {peak:.1f} dBFS · rms {rms:.1f} dBFS')


if __name__ == '__main__':
    main()
