# Skill: UI_UX_DESIGN_SYSTEM

## Purpose

Generate clean, modern, professional, and maintainable user interfaces.

All generated UI must follow a centralized design system and corporate branding rules.

The application should feel consistent, intuitive, responsive, and enterprise-ready.

---

# Design Philosophy

The interface should be:

* Clean
* Modern
* Professional
* Minimalist
* Consistent
* Responsive
* Accessible

Avoid visual clutter.

Every element must have a clear purpose.

Prioritize readability over decoration.

---

# Design System

All visual properties must come from a centralized theme system.

Never hardcode visual values inside components.

This includes:

* Colors
* Typography
* Spacing
* Border radius
* Shadows
* Animations
* Breakpoints

---

# Theme Structure

Required structure:

src/

theme/

├── colors.ts
├── typography.ts
├── spacing.ts
├── shadows.ts
├── borderRadius.ts
├── animations.ts
└── theme.ts

All components must consume values from this theme.

---

# Corporate Branding

The application must use only theme colors.

Never use hardcoded HEX values.

Bad:

```tsx
backgroundColor: "#0D6EFD"
```

Good:

```tsx
backgroundColor: theme.colors.primary
```

---

# Corporate Colors

The application uses three corporate colors.

## Primary Color

Main brand color.

Used for:

* Primary buttons
* Main actions
* Navigation highlights
* Active tabs
* Selected elements

---

## Secondary Color

Supporting brand color.

Used for:

* Secondary buttons
* Cards
* Section titles
* Informational elements

---

## Auxiliary Color

Complementary brand color.

Used for:

* Badges
* Highlights
* Counters
* Small supporting actions

---

# Semantic Colors

The theme must also include:

```ts
success
warning
error
info
```

These colors should be used instead of corporate colors for status messages.

Example:

Delete Button → error

Success Alert → success

Warning Message → warning

---

# Typography

Use a consistent typography scale.

Required hierarchy:

* Page Title
* Section Title
* Card Title
* Body Text
* Caption

Avoid random font sizes.

All typography must come from:

```tsx
theme.typography
```

---

# Spacing

All spacing must use theme values.

Bad:

```tsx
marginTop: 17
padding: 11
```

Good:

```tsx
theme.spacing.md
theme.spacing.lg
```

Use consistent spacing across the application.

---

# Layout Rules

Prefer generous whitespace.

Avoid crowded interfaces.

Use:

* Cards
* Sections
* Containers
* Responsive grids

Group related information together.

Separate unrelated information.

---

# Cards

Cards should:

* Have subtle shadows
* Consistent padding
* Rounded corners
* Clear visual hierarchy

Avoid excessive borders.

---

# Buttons

Buttons must communicate importance.

---

Primary Actions

Examples:

* Save
* Create
* Submit
* Confirm

Use:

Primary Color

---

Secondary Actions

Examples:

* Edit
* View Details
* Search

Use:

Secondary Color

---

Support Actions

Examples:

* Export
* Download
* Print

Use:

Auxiliary Color

---

Danger Actions

Examples:

* Delete
* Remove
* Disable

Use:

Error Color

Never use corporate colors for destructive actions.

---

# Icons

Use a single icon library.

Preferred:

* Material Icons
* Lucide React

Icons must:

* Match action meaning
* Be visually consistent
* Improve usability

Avoid decorative icons without purpose.

Examples:

Edit → Pencil Icon

Delete → Trash Icon

Search → Search Icon

Download → Download Icon

User → User Icon

---

# Tables

Tables must include:

* Hover state
* Loading state
* Empty state
* Pagination
* Sorting
* Filtering

Large tables should use DataGrid.

Rows should have subtle hover feedback.

---

# Forms

Forms should:

* Be visually organized
* Have labels
* Display validation messages
* Use proper spacing

Complex forms should be divided into sections.

Avoid overwhelming users.

---

# Animations

Animations should be subtle.

Purpose:

* Improve feedback
* Improve usability

Never distract users.

---

Allowed Animations

Hover

```css
transition: all 0.2s ease;
```

Card Hover

```css
transform: translateY(-2px);
```

Button Hover

```css
opacity change
small elevation change
```

Modal Opening

```css
fade-in
scale-in
```

---

Forbidden Animations

Avoid:

* Flashing effects
* Excessive movement
* Infinite animations
* Large scaling effects
* Long transitions

Enterprise applications should feel calm and professional.

---

# Loading States

Never leave users without feedback.

Always provide:

* Skeleton loaders
* Progress indicators
* Loading messages

---

# Empty States

Every list must have an empty state.

Include:

* Meaningful icon
* Helpful message
* Suggested action

Example:

"No support agents found."

"Create your first support agent."

---

# Responsive Design

Mobile-first approach.

Support:

* Mobile
* Tablet
* Desktop

Avoid fixed widths.

Prefer:

* Flexbox
* CSS Grid

---

# Accessibility

Always include:

* Labels
* Keyboard navigation
* Focus states
* ARIA attributes when necessary

Color should never be the only way to convey information.

---

# CSS Best Practices

Prefer:

* Theme tokens
* Design system variables
* Reusable styles

Avoid:

* Inline styles
* Magic numbers
* Duplicated CSS
* Deep selector nesting

Keep styling simple and maintainable.

---

# Visual Quality Checklist

Before completing any UI implementation verify:

✓ Uses theme system

✓ Uses corporate colors

✓ No hardcoded colors

✓ No hardcoded spacing

✓ Responsive design

✓ Consistent typography

✓ Proper icon usage

✓ Accessible forms

✓ Loading states

✓ Empty states

✓ Error states

✓ Subtle animations

✓ Clean visual hierarchy

✓ Professional appearance

If any item fails, refactor before finishing.

---

# Final Rule

The entire application must be fully rebrandable by modifying only:

* colors.ts
* typography.ts
* spacing.ts
* shadows.ts
* borderRadius.ts
* animations.ts

No component-level visual modifications should be required when corporate branding changes.
