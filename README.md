# tri-tier-bonsai-orchestrator

i wanted to see if i could use gemini flash 3.8 as the high-level planner to save cloud tokens, while letting a local 9b model do all the actual heavy-lifting coding.

turns out it slashed cloud token usage by **92.7%**.

![architecture](architecture.jpg)

## how it works

instead of burning through cloud api quotas writing raw code:

1. **Gemini 3.8 Flash (the planner):** plans the architecture, writes the exact types, CSS variable tokens, and function signatures (~290 tokens total).
2. **Local ConvAI Laya:** runs offline as a fast router/gatekeeper.
3. **Local Bonsai 2 9B MTP (the coder):** runs locally via prism `llama-server` on CPU with MTP speculative decoding (`--spec-type draft-mtp`). it takes the signatures and writes 100% of the raw production code without thinking overhead.

## the test: building MONSOON

to test this, i had it build a complete website from scratch for a pop-up shop selling Indian coffee and single-estate cacao:
- `index.html`: semantic markup, hero with steam particles, terroir origin cards, off-canvas drawer.
- `styles.css`: warm earth luxury palette, glassmorphism, responsive grid, keyframe animations.
- `app.js`: tasting flight builder state machine, live INR pricing calculator, and a countdown clock to the Bangalore pop-up.

## the numbers

| file | cloud tokens (planning) | local bonsai tokens (code written) |
| :--- | :---: | :---: |
| `styles.css` | ~95 | 1,400 |
| `app.js` | ~85 | 1,200 |
| `index.html` | ~110 | 1,103 |
| **total** | **~290** | **3,703** |

- **cloud tokens spent:** ~290
- **tokens offloaded locally:** 3,703
- **net savings:** ~92.7%

local bonsai hit ~6 tok/s on CPU with near 100% draft acceptance via MTP. architecture is cheap, syntax is heavy.
