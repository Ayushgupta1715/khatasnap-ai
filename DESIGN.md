# Design Brief: TrailWhisper

## Aesthetic & World: Canopy Nocturne
A deep, atmospheric dark nature aesthetic inspired by nightfall over ancient Indian forests and mist-covered riverine groves. The interface feels like an organic field instrument—tactile, grounded, high contrast, and serene.

## Color Tokens & Semantic Vocabulary
- **Backdrop:** `#070D0A` (Deepest forest canopy shadow)
- **Surfaces / Cards:** `#0E1712` with 1px border `#1B2E23` (Moss Slate)
- **Elevated / Interactive:** `#14221B` (Sunken Fern)
- **Primary Accent / Edge AI:** `#00C896` (Luminescent Mint Flora)
- **Secondary Accent:** `#76D7A5` (Pale Birch Leaf)
- **Warning / Solar / Screen Alert:** `#F2C94C` (Amber Canopy Glow)
- **Text High-Contrast:** `#F4F7F2` (Lichen White, ratio > 11:1 on bg)
- **Text Secondary / Muted:** `#97A89D` (Forest Mist, ratio > 5:1 on bg)

## Typography & Proportions
- **Sans:** `Plus Jakarta Sans`, clean, generous optical legibility outdoors.
- **Monospace:** `JetBrains Mono` strictly reserved for real measurements (frequency Hz, timestamps, cryptographic SHA hashes, latency ms).
- **No Unicode emoji for navigation or controls:** Real SVG stroke icons (Lucide React) in matching 1.5px/2px weight.

## Craft Floor Guardrails
- Contrast ratio ≥ 4.5:1 for all text.
- No fuzzy text gradients.
- Real clickable buttons with explicit accessible labels, active, hover, and focus rings.
- Audio spectrum visualizer runs at steady 60fps with graceful fallbacks.
- Tabular figures for ticking clocks (`font-feature-settings: "tnum"`).
