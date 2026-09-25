# Van Duc Tan Design System

**Version:** 1.0  
**Extracted:** 2026-09-25  
**Sources:**

- [Portfolio — vanductan.id.vn](https://vanductan.id.vn/)
- [FocusFlow — tanflow.lovable.app](https://tanflow.lovable.app/)
- [Portfolio repository — vanductan-NLT/porfolio](https://github.com/vanductan-NLT/porfolio)
- [FocusFlow repository — vanductan-NLT/tanflow](https://github.com/vanductan-NLT/tanflow)

This document turns the visual language visible across the two websites into a reusable system for future personal, product, and internal-tool interfaces.

## 1. System Positioning

The two websites share one recognizable direction:

- Dark-first, high-contrast interfaces.
- Mint/green accents used to signal action, progress, and identity.
- Technical content presented with a calm, premium surface.
- Strong typography hierarchy instead of decorative complexity.
- Motion used to clarify state and focus attention.
- Dense information is organized into modular cards, panels, rails, and sections.

The system has two modes:

| Mode | Primary use | Visual character |
| --- | --- | --- |
| **Brand / Neon Noir** | Portfolio, landing pages, public-facing identity | Near-black canvas, mint highlights, oversized display type, grain, asymmetry, floating rail navigation |
| **Product / FocusFlow** | Productivity tools, dashboards, internal apps | Adaptive light/dark surfaces, compact controls, state colors, glass panels, timer-centered hierarchy |

Do not force every product screen to look like the portfolio. Reuse the tokens and interaction principles, then choose the mode that matches the product context.

## 2. Design Principles

### 2.1 Make the product's purpose obvious

The first screen should answer what the interface is for within a few seconds. Portfolio pages lead with identity and proof. FocusFlow leads with the timer and immediate controls.

### 2.2 One dominant action per view

Use one primary accent action. Secondary actions should remain quiet until needed. Avoid several equally bright buttons competing for attention.

### 2.3 Content is the visual hero

Use large type, real metrics, project names, clear labels, and meaningful states. Decoration should support hierarchy, not replace content.

### 2.4 Calm surfaces, expressive states

Keep the base interface restrained. Reserve bright color, glow, and motion for active, successful, selected, or important states.

### 2.5 Technical, but not sterile

Use precise grids and strong alignment, then add human texture through grain, organic blur, rounded surfaces, and subtle motion.

### 2.6 Progressive disclosure

Show the essential state first. Hide secondary controls in collapsible panels, drawers, accordions, or contextual actions.

## 3. Color System

### 3.1 Brand tokens — Neon Noir

These tokens describe the portfolio's primary visual language.

| Token | Hex | Purpose |
| --- | --- | --- |
| `brand-bg` | `#111111` | Main dark canvas |
| `brand-surface` | `#1A1A1A` | Cards and elevated sections |
| `brand-surface-highlight` | `#222222` | Inputs, hover states, secondary panels |
| `brand-accent` | `#99E5B7` | Primary brand accent, links, key numbers |
| `brand-accent-strong` | `#7AF298` | Accent gradient end, active hover state |
| `brand-accent-light` | `#BBEECF` | Light accent surface or soft highlight |
| `brand-accent-dark` | `#33443A` | Dark accent background |
| `text-primary` | `#FFFFFF` | Headings and high-priority content |
| `text-secondary` | `#A3A3A3` | Body copy and descriptions |
| `text-muted` | `#666666` | Captions, metadata, inactive labels |
| `border-subtle` | `rgba(255,255,255,0.07)` | Quiet card and glass borders |
| `border-strong` | `#333333` | Dividers and visible boundaries |

Recommended brand gradient:

```css
background: linear-gradient(135deg, #99E5B7 0%, #7AF298 100%);
```

Recommended glow:

```css
box-shadow: 0 0 30px rgba(153, 229, 183, 0.10);
```

### 3.2 Product tokens — FocusFlow

FocusFlow uses HSL design tokens so the theme can switch without changing component code.

#### Light theme

| Token | HSL | Role |
| --- | --- | --- |
| `background` | `0 0% 100%` | Page background |
| `foreground` | `0 0% 9%` | Main text |
| `card` | `0 0% 100%` | Elevated panel |
| `secondary` | `0 0% 96%` | Secondary surface |
| `muted-foreground` | `0 0% 45%` | Supporting text |
| `border` | `0 0% 90%` | Borders and inputs |
| `primary` | `142 76% 36%` | Active action and progress |
| `info` | `199 89% 48%` | Informational state / short break |
| `warning` | `38 92% 50%` | Warning state |
| `destructive` | `0 84% 60%` | Errors and destructive actions |

#### Dark theme

| Token | HSL | Role |
| --- | --- | --- |
| `background` | `0 0% 8%` | Page background |
| `foreground` | `0 0% 95%` | Main text |
| `card` | `0 0% 12%` | Elevated panel |
| `secondary` | `0 0% 15%` | Secondary surface |
| `muted-foreground` | `0 0% 60%` | Supporting text |
| `border` | `0 0% 20%` | Borders and inputs |
| `primary` | `142 70% 45%` | Active action and progress |
| `info` | `199 89% 55%` | Informational state / short break |
| `warning` | `38 92% 55%` | Warning state |
| `destructive` | `0 62% 50%` | Errors and destructive actions |

#### FocusFlow mode colors

Use these consistently for the timer and its mode selector:

| Mode | Token | HSL in the source system |
| --- | --- | --- |
| Focus | `timer-accent` | `142 76% 36%` light / `142 70% 45%` dark |
| Short break | `timer-break` | `199 89% 48%` light / `199 89% 55%` dark |
| Long break | `timer-long-break` | `262 83% 58%` light / `262 83% 65%` dark |
| Meditation | `timer-meditation` | `280 70% 50%` light / `280 70% 60%` dark |

### 3.3 Color rules

- Use mint for identity and primary action in brand surfaces.
- Use product green for functional success, active progress, and running states.
- Never use the accent as body text over a busy background unless contrast is verified.
- Keep large surfaces neutral; bright color should occupy a small visual area.
- Use semantic colors for meaning, not decoration.
- Do not introduce a new accent color for each section.

## 4. Typography

### 4.1 Font roles

| Role | Recommended family | Use |
| --- | --- | --- |
| Display / brand heading | `Outfit`, sans-serif | Portfolio hero, section headings, large metrics |
| Body / interface text | `Manrope`, sans-serif | Descriptions, navigation, card copy |
| Technical / metadata | `JetBrains Mono`, monospace | Code-like labels, IDs, technical data |
| Product fallback | `Inter`, system sans-serif | Dense productivity UI when loading a separate brand font is not useful |

If only one font can be shipped, use `Manrope` for public brand pages and `Inter` for dense product UI.

### 4.2 Type scale

| Role | Desktop | Mobile | Weight | Line height |
| --- | ---: | ---: | ---: | ---: |
| Hero display | `150px` | `50px` | 200–600 | `1.0` |
| Display | `140px` | `40px` | 500 | `1.0` |
| H1 | `85px` | `32px` | 500 | `1.0` |
| H2 | `50px` | `27px` | 500 | `1.18` |
| H3 | `30px` | `22px` | 500 | `1.18` |
| H4 | `24px` | `20px` | 600 | `1.18–1.46` |
| Body large | `22px` | `18px` | 400 | `1.5` |
| Body | `18–20px` | `16px` | 400–500 | `1.6–1.88` |
| Body small | `16px` | `14px` | 400 | `1.6–1.88` |
| Caption | `14px` | `12px` | 500 | `1.0` |
| Button | `16px` | `14px` | 600 | `1.0` |
| Navigation | `17px` | `16px` | 600 | `1.0` |

### 4.3 Typography rules

- Use tight tracking for very large headings: approximately `-0.02em`.
- Keep body copy readable; do not use the display font for long paragraphs.
- Use sentence case for product controls.
- Use uppercase only for short eyebrow labels, metadata, or navigation hints.
- Keep heading width constrained so the hero does not become a wall of text.

## 5. Spacing and Geometry

Use an 8px-based scale, with a few deliberate in-between values for visual tuning.

| Token | Size | Typical use |
| --- | ---: | --- |
| `xs` | `6px` | Tight icon/label grouping |
| `sm` | `8px` | Icon + text gap |
| `md` | `10px` | Compact controls |
| `base` | `16px` | Default gap and padding |
| `lg` | `20px` | Card padding on compact screens |
| `xl` | `25px` | Component gap |
| `2xl` | `30px` | Card and section inner gap |
| `3xl` | `40px` | Major component gap |
| `4xl` | `50px` | Section rhythm |
| `5xl` | `70px` | Section padding |
| `6xl` | `130px` | Hero breathing room |

### Container and grid

- Maximum content width: `1280px`.
- Mobile side padding: `16px`.
- Tablet and desktop side padding: `32px`.
- Desktop grid: 12 columns with `32px` gaps.
- Tablet grid: 6 columns with `24px` gaps.
- Mobile grid: 4 columns with `16px` gaps.

### Border radius

| Token | Size | Use |
| --- | ---: | --- |
| `radius-sm` | `5px` | Tags and compact badges |
| `radius-md` | `10px` | Buttons, inputs, small controls |
| `radius-lg` | `15px` | Cards and medium containers |
| `radius-xl` | `20–24px` | Large cards and product panels |
| `radius-pill` | `140px` | Pills and segmented controls |
| `radius-full` | `50%` | Avatars and icon buttons |

## 6. Surfaces, Borders, and Depth

### Brand surfaces

```css
.brand-card {
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  padding: 24px;
}
```

### Product glass surface

```css
.product-glass {
  background: hsl(var(--card) / 0.80);
  border: 1px solid hsl(var(--border) / 0.50);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

### Elevation

Use depth sparingly:

```css
--shadow-soft:
  rgba(0, 0, 0, 0.11) 0 0.6px 1.3px -0.94px,
  rgba(0, 0, 0, 0.10) 0 1.8px 4px -1.88px,
  rgba(0, 0, 0, 0.09) 0 4.8px 10.5px -2.81px,
  rgba(0, 0, 0, 0.04) 0 15px 33px -3.75px;

--shadow-accent-glow: 0 0 10px rgba(83, 137, 114, 0.25);
```

### Background treatment

The portfolio uses grain/noise and soft green atmospheric light. Use these behind content, never on top of text or controls.

```css
.brand-background {
  background-color: #111111;
  background-image:
    radial-gradient(ellipse at 20% 0%, rgba(153, 229, 183, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(153, 229, 183, 0.03) 0%, transparent 50%);
}
```

## 7. Layout Patterns

### 7.1 Portfolio shell

- Full-page, scroll-based sections.
- Fixed or floating vertical navigation rail on desktop.
- Centered content column with strong horizontal breathing room.
- Hero content centered, with large name treatment and two clear CTAs.
- Proof metrics grouped below the main CTA.
- Section labels and headings repeat a consistent eyebrow → title → description pattern.
- Mobile collapses the rail into a compact top navigation or menu.

### 7.2 Product shell

- Persistent top bar for product identity, language, theme, and utilities.
- Primary work area receives the strongest visual emphasis.
- Secondary features live in stacked panels or a responsive side column.
- Collapsible panels reduce cognitive load without removing capability.
- Timer, dashboard metric, or current task should be visually dominant.

### 7.3 Responsive behavior

| Breakpoint | Behavior |
| --- | --- |
| `0–639px` | Single column, compact controls, reduced display type |
| `640–1023px` | Two-column content where useful, simplified navigation |
| `1024–1279px` | Full layout with reduced section padding |
| `1280px+` | Wide composition, maximum container, full rail/navigation treatment |

## 8. Component Rules

### 8.1 Buttons

| Variant | Height | Padding | Background | Text |
| --- | ---: | --- | --- | --- |
| Primary | `48px` | `13px 20px` | Brand mint or product primary | Black or high-contrast foreground |
| Secondary | `48px` | `13px 20px` | Transparent | Primary text |
| Small | `36px` | `8px 16px` | Variant-dependent | Variant-dependent |
| Icon-only | `48px` | `12px` | Surface highlight | Primary text |

Behavior:

- Primary hover: `translateY(-2px)` plus a soft shadow.
- Secondary hover: surface highlight plus accent border.
- Active state: scale to approximately `0.98`.
- Every clickable element must expose a clear hover, focus, and disabled state.
- Use visible focus rings; never rely on color alone.

### 8.2 Cards

- Default: `24px` padding on desktop, `20px` on mobile.
- Background: brand surface or product card token.
- Border: subtle by default; accent on meaningful hover/selection.
- Hover lift is allowed for portfolio project cards, but should be reduced in dense product dashboards.
- Avoid stacking more than two strong shadows in one visual region.

### 8.3 Navigation

Portfolio navigation can use a glass rail or floating glass bar:

```css
.glass-nav {
  background: rgba(17, 17, 17, 0.80);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 16px;
  backdrop-filter: blur(20px);
}
```

FocusFlow uses a compact top bar with utility actions. Keep product navigation more functional than decorative.

### 8.4 Stats and proof

- Use large accent numerals.
- Keep labels muted and short.
- Align multiple metrics on a shared baseline.
- Use stats only when they prove capability, scale, or outcome.

### 8.5 Skill bars and progress

- Track label on the left, percentage/value on the right.
- Track uses a quiet surface.
- Fill uses a mint-to-green gradient or semantic product color.
- Animate from zero only when the bar enters the viewport.
- Never use a skill percentage as a substitute for real project evidence.

### 8.6 Inputs

```css
.input {
  height: 48px;
  padding: 0 16px;
  border-radius: 10px;
  background: #222222;
  border: 1px solid transparent;
  color: #FFFFFF;
}

.input:focus {
  border-color: #99E5B7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(153, 229, 183, 0.16);
}
```

For light product themes, replace the background and border with the adaptive product tokens.

### 8.7 Segmented controls and filters

Use pill-shaped segmented controls for timer modes and project filters. The selected item receives the strongest contrast; unselected items remain readable but visually quiet.

### 8.8 Accordions and collapsible panels

Use them for secondary information such as health reminders, FAQ content, or optional media controls. The trigger must expose the current open/closed state and remain easy to scan.

## 9. Iconography and Media

- Use Lucide or another consistent outline icon set for interface actions.
- Keep icon stroke weight consistent with the surrounding text.
- Use icons as labels only when the meaning is obvious; otherwise pair them with text.
- The product may use playful pictograms for music categories, but brand navigation should stay icon-system-first.
- Use atmospheric media, such as FocusFlow's background video, as a low-contrast backdrop with a dark overlay.
- Always provide a fallback gradient when media fails to load.
- Do not allow background media to reduce text contrast or distract from the timer.

## 10. Motion System

### Timing tokens

| Token | Duration | Use |
| --- | ---: | --- |
| `fast` | `150ms` | Hover, focus, small state changes |
| `normal` | `300ms` | Buttons, panels, theme transitions |
| `slow` | `500ms` | Card movement and content reveal |
| `slower` | `800ms` | Hero or large section entrance |

### Easing

```css
--ease-standard: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

### Approved motion patterns

- Fade-up reveal: opacity `0 → 1`, translateY `30px → 0`.
- Scroll reveal: opacity `0 → 1`, translateY `50px → 0`, optional scale `0.95 → 1`.
- Stagger children by approximately `100ms`.
- Skill fill: width `0 → value` over `1.2s`.
- Card hover: translateY `-4px` to `-8px` only in spacious brand layouts.
- Timer running state: restrained pulse or progress movement, never a distracting loop.
- Theme transition: color-only transition around `300ms`.

Always support `prefers-reduced-motion: reduce` by disabling non-essential transforms, parallax, and looping background effects.

## 11. Accessibility Rules

- Maintain WCAG AA contrast for text and controls.
- Never communicate a state with color alone; pair color with text, icon, or shape.
- Provide keyboard focus styles for every interactive element.
- Keep touch targets at least `44px` where possible.
- Respect reduced motion.
- Label icon-only buttons with accessible names.
- Provide media fallback and meaningful alt text.
- Avoid overly large text that becomes clipped on narrow screens.

## 12. Starter Tokens

Use this as the starting point for a new Tailwind/CSS project. Extend it only when a real product requirement appears.

```css
:root {
  --brand-bg: #111111;
  --brand-surface: #1A1A1A;
  --brand-surface-highlight: #222222;
  --brand-accent: #99E5B7;
  --brand-accent-strong: #7AF298;
  --text-primary: #FFFFFF;
  --text-secondary: #A3A3A3;
  --text-muted: #666666;
  --border-subtle: rgba(255, 255, 255, 0.07);

  --radius-sm: 5px;
  --radius-md: 10px;
  --radius-lg: 15px;
  --radius-xl: 24px;
  --radius-pill: 140px;

  --space-1: 6px;
  --space-2: 8px;
  --space-3: 10px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 25px;
  --space-8: 30px;
  --space-10: 40px;
  --space-12: 50px;
  --space-16: 70px;
  --space-32: 130px;

  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-standard: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

## 13. Recommended Tailwind Mapping

```ts
export default {
  theme: {
    extend: {
      colors: {
        background: '#111111',
        surface: {
          DEFAULT: '#1A1A1A',
          highlight: '#222222',
        },
        primary: {
          DEFAULT: '#99E5B7',
          light: '#BBEECF',
          dark: '#83AF95',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#7AF298',
          glow: 'rgba(153, 229, 183, 0.576)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A3A3A3',
          muted: '#666666',
        },
        border: {
          DEFAULT: '#333333',
          subtle: 'rgba(255, 255, 255, 0.07)',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '140px',
      },
    },
  },
};
```

## 14. What to Reuse vs. What to Fix

### Reuse

- Near-black background and mint identity accent.
- Strong hero typography and proof metrics.
- Floating/rail navigation for portfolio-like experiences.
- Glass surfaces with restrained blur.
- Compact pill filters and segmented controls.
- Modular cards with subtle borders.
- Scroll reveal, skill-fill, and state-aware motion.
- Adaptive product theme tokens from FocusFlow.

### Fix before copying blindly

- The portfolio rules describe a dark mint system, while FocusFlow also exposes a functional green product theme. Keep brand mint and product green as separate semantic layers.
- The original rules discourage emoji icons, but FocusFlow currently uses emoji-like music category labels. Keep that exception limited to playful content categories; use Lucide icons for navigation and actions.
- FocusFlow's source still contains starter Vite `.card` and logo CSS. Treat those as scaffold leftovers, not canonical design tokens.
- Background video can fail or show an unavailable-media message. The product must always fall back to a gradient or static image.
- Decorative grain, glow, and blur should never reduce contrast or compete with the primary task.
- Skill percentages look polished but are subjective. Prefer project outcomes, shipped features, or measurable impact when presenting proof.

## 15. Decision Checklist for New Screens

Before shipping a new page or component, verify:

- [ ] The screen clearly has one dominant purpose.
- [ ] The chosen mode is Brand / Neon Noir or Product / FocusFlow.
- [ ] Colors come from the token system.
- [ ] Accent color has semantic meaning.
- [ ] Typography follows the type hierarchy.
- [ ] Spacing follows the 8px-based scale.
- [ ] Interactive states cover hover, focus, active, disabled, and loading.
- [ ] Responsive behavior is defined for mobile and desktop.
- [ ] Motion is useful and reduced-motion safe.
- [ ] Text contrast and keyboard access are verified.
- [ ] Media has a fallback.
- [ ] No decorative element is more prominent than the content.

## 16. Canonical Design Direction

The strongest shared identity is:

> **Calm dark interfaces with mint intelligence: bold enough to feel personal, structured enough to ship real products.**

Use the portfolio system to express identity. Use the FocusFlow system to express behavior and state. Keep the shared foundation—dark surfaces, mint emphasis, disciplined spacing, high-contrast type, modular cards, and purposeful motion—consistent across both.
