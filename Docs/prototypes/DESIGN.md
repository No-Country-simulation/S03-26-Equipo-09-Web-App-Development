# Design System Specification: The Invisible Interface

## 1. Overview & Creative North Star
**Creative North Star: "The Predictive Curator"**

In the fast-paced LATAM CRM market, cognitive load is the enemy. This design system moves beyond traditional dashboard "boxes" to create an editorial, high-end experience where the interface recedes, and data takes center stage. We reject the "Standard SaaS" aesthetic in favor of **Invisible Design**: a philosophy where the UI only appears when needed, using tonal depth and sophisticated typography to guide the eye rather than rigid lines.

By leveraging **Intentional Asymmetry** and **Tonal Layering**, we break the monotony of the grid. Large, bold typographic anchors serve as the "spine" of each page, while data visualizations float on layered surfaces, creating a sense of "Organic Precision."

---

## 2. Colors & Tonal Architecture
The palette is rooted in a professional **Deep Indigo** (#182442) and a growth-oriented **Soft Emerald** (#006c49). The goal is to feel authoritative yet breathing.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
- Boundaries must be defined solely through background color shifts.
- Use `surface-container-low` (#f3f4f5) for large layout blocks sitting on the `background` (#f8f9fa).
- Use `surface-container-lowest` (#ffffff) for high-priority interactive cards.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
1.  **Level 0 (Base):** `background` (#f8f9fa) - The canvas.
2.  **Level 1 (Sections):** `surface-container-low` (#f3f4f5) - Used for sidebars or secondary content regions.
3.  **Level 2 (Active Content):** `surface-container-lowest` (#ffffff) - Used for primary data cards and focus areas.
4.  **Level 3 (Pop-overs):** `surface-bright` with 80% opacity and a 20px Backdrop Blur (Glassmorphism).

### The "Glass & Gradient" Rule
To inject "soul" into the CRM, use subtle linear gradients for primary actions. Instead of a flat #2E3A59, use a transition from `primary` (#182442) to `primary_container` (#2e3a59) at a 135° angle. This creates a soft, convex depth that feels premium.

---

## 3. Typography: The Editorial Spine
We use **Inter** exclusively for its neutral, high-legibility "Swiss" character. Hierarchy is achieved through extreme scale contrast rather than color variation.

*   **Display (Editorial Hero):** `display-lg` (3.5rem) / Medium weight. Used for total revenue or primary KPIs. It should feel like a headline in a high-end financial magazine.
*   **Headline (Section Anchor):** `headline-sm` (1.5rem) / Semi-bold. Used for module titles (e.g., "Predictive Pipeline").
*   **Body (Utility):** `body-md` (0.875rem) / Regular. The workhorse for all CRM data entry and list views.
*   **Label (Metadata):** `label-sm` (0.6875rem) / All-caps / Tracking +5%. Used for timestamps and micro-data.

**Rule:** Always pair a `display-lg` value with `on_surface_variant` (#45464e) `label-md` text to create a sophisticated, unbalanced visual interest.

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** A card does not need a shadow if it is `surface-container-lowest` (#ffffff) sitting on a `surface-container` (#edeeef) background. The 1% shift in hex code is enough for the human eye to perceive depth.
*   **Ambient Shadows:** For "floating" elements like Modals or Tooltips, use: 
    *   `box-shadow: 0 20px 40px rgba(24, 36, 66, 0.06);` 
    *   This uses a 6% opacity of our `primary` Indigo color to mimic natural, tinted light.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., Input Fields), use `outline_variant` (#c6c6ce) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Navigation rails should use `surface` with a 70% alpha and `backdrop-filter: blur(12px)`. This allows the "growth emerald" accents of the background to bleed through, maintaining context.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. 12px (`DEFAULT`) radius. White text. No border.
*   **Secondary:** `surface-container-high` (#e7e8e9) background. `on_surface` (#191c1d) text. 
*   **Tertiary (Ghost):** No background. `primary` text. Use for low-emphasis actions like "Cancel."

### Input Fields
*   **Standard:** `surface-container-lowest` background with a 1px "Ghost Border" (15% opacity). 
*   **Focus State:** Border opacity increases to 100% using `secondary` (#006c49). No "glow" effects—just a sharp, clean transition.

### Cards & Lists
*   **Forbid Dividers:** Horizontal lines are banned. To separate list items, use `spacing-4` (1.4rem) of vertical white space or a subtle `surface_container_low` hover state.
*   **Predictive Chips:** Use `secondary_fixed` (#6ffbbe) with `on_secondary_fixed` (#002113) for AI-suggested actions. These should "glow" slightly to indicate they are predictive.

### Additional: The "Action Ribbon"
A floating, glassmorphic bar at the bottom center of the screen that contains context-aware primary actions. This keeps the main viewport clean and reinforces the "Invisible" UI philosophy.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical white space. If a card has 40px padding on the left, try 60px on the right to create a sense of movement.
*   **Do** use `secondary` (Emerald) only for "Growth" indicators—revenue up, new leads, or successful conversions.
*   **Do** trust the typography. Let large numbers be the primary visual element.

### Don't:
*   **Don't** use pure black (#000000). Always use `on_surface` (#191c1d) for text to maintain a soft, high-end feel.
*   **Don't** use "Alert Red" for everything. Use `tertiary_container` (#4a380c) for warnings and save `error` (#ba1a1a) only for critical data loss.
*   **Don't** crowd the interface. If you think it needs more features, it probably needs more white space.