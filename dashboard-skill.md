---
name: dashboard-design
description: Systematically design and develop professional, modern, responsive admin dashboard interfaces for web applications. Use this skill when the user asks to build an admin dashboard, analytics panel, CRM interface, SaaS back-office, data visualization page, reporting UI, or any multi-section data-rich management interface. Generates visually distinctive, fully responsive, accessible, and well-commented dashboard code with step-by-step reasoning. Inspired by real-world production dashboards like Codename.com (sales CRM) and Healthink (medical analytics).
---

This skill guides the creation of professional-grade admin dashboards that look genuinely designed — not like a template. Every dashboard has a personality, a data story, and a user who needs to make decisions fast. Build for that user. The reference aesthetic: clean whitespace, confident typography, purposeful color accents, data-dense but never cluttered, fully responsive from 320px mobile to 4K widescreen.

---

## Design Thinking Before Code

Before any implementation, commit to these decisions. They shape every component downstream.

### Ask These Questions First

**Who is the user?**
- Executive / C-suite → fewer KPIs, larger numbers, trend signals
- Operations manager → dense tables, filters, workflow tools
- Analyst → chart-heavy, export options, drill-down capability
- Field agent / mobile user → touch-friendly, minimal, fast-loading

**What domain is this for?**
Each domain has visual conventions players expect:

| Domain | Accent Color Direction | Density | Key Components |
|---|---|---|---|
| SaaS / CRM | Coral, indigo, slate | Medium | Pipeline, conversion, activity feed |
| Healthcare | Blue, teal, clean white | Medium-low | Vitals, schedules, patient list |
| Finance | Dark navy, green/red signals | High | Tables, sparklines, P&L |
| E-commerce | Orange, green, warm | Medium | Revenue, orders, inventory |
| DevOps / Tech | Dark mode, mono green/cyan | High | Logs, uptime, latency |
| Marketing | Vibrant, gradient-friendly | Medium | Funnel, campaign ROI, channels |

**What is the ONE screen users spend 80% of their time on?**
Make that screen extraordinary. Everything else serves it.

**The Aesthetic Commitment**
Pick a visual direction before writing HTML. Options:
- Soft light / card-based / rounded (Codename CRM style)
- Clinical white / structured grid / sharp (Healthink style)
- Dark mode / high contrast / glowing accents
- Editorial / magazine-layout / typographic hierarchy
- Glassmorphic / frosted panels / depth layers
- Brutalist / raw borders / stark data-forward

NEVER produce a grey-on-white generic dashboard. Every dashboard must have a point of view.

---

## Phase 1: Information Architecture

### 1.1 — Define the Navigation Structure

Every dashboard needs a clear hierarchy. Establish it first:

```
Level 1 — Primary Navigation (Sidebar or Top Nav)
  └─ Level 2 — Section Pages (Dashboard, Reports, Users, Settings)
       └─ Level 3 — Sub-pages / Detail Views (specific report, user profile)
```

**Sidebar Navigation (default — follows Codename CRM pattern)**
Best when: many navigation items (6+), users switch sections frequently, content is wide
- Width: 240–280px collapsed labels + icons; 64–72px icon-only collapsed state
- Sections: Group items with visual dividers, not walls of text
- Active state: bold label + colored left border or filled pill background
- Hover state: subtle background shift with 150ms ease transition

**Top Navigation**
Best when: few sections (<6), maximizing vertical content space, horizontal workflows
- Height: 56–64px; sticky to viewport top
- Breadcrumbs below the topbar for deep navigation contexts

**Hybrid (Sidebar + Top Sub-nav)**
Best when: complex multi-level navigation (used in Codename — sidebar for primary, breadcrumb trail for depth)

### 1.2 — Content Hierarchy per Page

Structure every dashboard page in layers of decreasing time-sensitivity:

```
┌──────────────────────────────────────────────────┐
│  LAYER 1: Page Header                            │
│  Title + Timeframe filter + Share/Export actions  │
├──────────────────────────────────────────────────┤
│  LAYER 2: KPI Hero Row                           │
│  3–5 stat cards. Headline numbers. Trends.        │
├──────────────────────────────────────────────────┤
│  LAYER 3: Primary Visualization                  │
│  Main chart(s). Takes visual priority.            │
├──────────────────────────────────────────────────┤
│  LAYER 4: Secondary Data                         │
│  Tables, breakdowns, lists, secondary charts.     │
├──────────────────────────────────────────────────┤
│  LAYER 5: Contextual / Detail                    │
│  Activity feed, team list, mini-profiles.         │
└──────────────────────────────────────────────────┘
```

Rule: a user should answer their top two questions within 10 seconds of the page loading.

---

## Phase 2: Design Token System

Establish a CSS custom property system before writing any component. This is the single source of truth for the entire dashboard.

### 2.1 — Color Token Architecture

```css
/* ============================================
   DASHBOARD DESIGN TOKENS
   Define once. Use everywhere.
   ============================================ */

:root {
  /* --- Brand / Accent --- */
  /* Pick ONE accent color. Resist the urge for multiple. */
  --accent-500: #E8436A;          /* Primary CTA, active states, highlights */
  --accent-400: #ED6B88;          /* Hover states */
  --accent-100: #FCE8ED;          /* Light accent backgrounds, badges */

  /* --- Neutrals (the backbone of the layout) --- */
  --neutral-0:   #FFFFFF;         /* Card surfaces, inputs */
  --neutral-50:  #F8F9FA;         /* Page background */
  --neutral-100: #F1F3F5;         /* Subtle dividers, hover bg */
  --neutral-200: #E9ECEF;         /* Borders, separators */
  --neutral-400: #ADB5BD;         /* Placeholder text, disabled */
  --neutral-600: #6C757D;         /* Secondary labels, metadata */
  --neutral-800: #343A40;         /* Primary body text */
  --neutral-900: #212529;         /* Headings, high-contrast text */

  /* --- Semantic Signals (used for data, never decoration) --- */
  --signal-positive: #2DD4BF;     /* Growth, up trends, success */
  --signal-negative: #F87171;     /* Decline, down trends, error */
  --signal-warning:  #FBBF24;     /* Caution, attention */
  --signal-info:     #60A5FA;     /* Informational, neutral trend */

  /* --- Surface Layers (elevation system) --- */
  --surface-page:    var(--neutral-50);   /* Page background */
  --surface-card:    var(--neutral-0);    /* Card/panel background */
  --surface-raised:  var(--neutral-0);    /* Modals, popovers */
  --surface-sidebar: var(--neutral-0);    /* Sidebar background */

  /* --- Typography Scale --- */
  --font-display: 'Clash Display', 'DM Sans', sans-serif;   /* Headings, KPI numbers */
  --font-body:    'Inter', 'Geist', system-ui, sans-serif;  /* Body, labels, data */
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace; /* Code, IDs, exact values */

  --text-xs:   0.75rem;   /* 12px - metadata, timestamps */
  --text-sm:   0.875rem;  /* 14px - labels, table cells */
  --text-base: 1rem;      /* 16px - body text */
  --text-lg:   1.125rem;  /* 18px - card titles */
  --text-xl:   1.25rem;   /* 20px - section titles */
  --text-2xl:  1.5rem;    /* 24px - page titles */
  --text-3xl:  1.875rem;  /* 30px - KPI numbers */
  --text-4xl:  2.25rem;   /* 36px - hero stats */

  /* --- Spacing Scale (8px base unit) --- */
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */

  /* --- Border Radius --- */
  --radius-sm:   4px;   /* Badges, tags */
  --radius-md:   8px;   /* Inputs, buttons */
  --radius-lg:   12px;  /* Cards */
  --radius-xl:   16px;  /* Large cards, modals */
  --radius-full: 9999px; /* Pills, avatars */

  /* --- Shadows (elevation levels) --- */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04);

  /* --- Transitions --- */
  --transition-fast:   120ms ease;
  --transition-base:   200ms ease;
  --transition-slow:   350ms ease;

  /* --- Layout Dimensions --- */
  --sidebar-width:          260px;
  --sidebar-collapsed-width: 68px;
  --topbar-height:           60px;
  --content-max-width:       1440px;
}

/* --- Dark Mode Token Override --- */
[data-theme="dark"] {
  --neutral-0:   #1E2025;
  --neutral-50:  #16181C;
  --neutral-100: #23262D;
  --neutral-200: #2E3138;
  --neutral-400: #5A6072;
  --neutral-600: #8B929E;
  --neutral-800: #CDD2DA;
  --neutral-900: #F0F2F5;
  --surface-page:    #16181C;
  --surface-card:    #1E2025;
  --surface-sidebar: #1A1D22;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.4);
}
```

### 2.2 — Typography Implementation

```css
/* Load distinctive fonts — not generic system fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* KPI numbers, hero stats */
.text-kpi {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--neutral-900);
}

/* Card titles, section headers */
.text-card-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--neutral-800);
}

/* Table cells, body labels */
.text-data {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--neutral-700);
}

/* Exact values: IDs, percentages, monetary amounts */
.text-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 500;
}
```

---

## Phase 3: Layout Architecture

### 3.1 — The Shell Layout (CSS Grid)

```html
<!-- Dashboard Shell — the outer container for all pages -->
<div class="dashboard-shell" id="app">

  <!-- Sidebar — persistent navigation -->
  <aside class="sidebar" id="sidebar" aria-label="Primary navigation">
    <!-- ... sidebar content ... -->
  </aside>

  <!-- Main area — topbar + scrollable content -->
  <div class="main-area">
    <header class="topbar" role="banner">
      <!-- ... topbar content ... -->
    </header>
    <main class="content-area" role="main" id="main-content">
      <!-- Page content renders here -->
    </main>
  </div>

</div>
```

```css
/* ============================================
   SHELL LAYOUT SYSTEM
   CSS Grid powers the outer shell.
   Sidebar + Main. Clean. No hacks.
   ============================================ */

.dashboard-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 1fr;
  min-height: 100vh;
  background: var(--surface-page);
  transition: grid-template-columns var(--transition-base);
}

/* Collapsed state — icon-only sidebar */
.dashboard-shell.sidebar-collapsed {
  grid-template-columns: var(--sidebar-collapsed-width) 1fr;
}

.main-area {
  display: grid;
  grid-template-rows: var(--topbar-height) 1fr;
  min-height: 100vh;
  overflow: hidden;
}

.content-area {
  overflow-y: auto;
  padding: var(--space-6) var(--space-8);
  max-width: var(--content-max-width);
}

/* ============================================
   RESPONSIVE BREAKPOINTS
   Mobile-first. Desktop is the enhancement.
   ============================================ */

/* Mobile: sidebar becomes a drawer overlay */
@media (max-width: 768px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    box-shadow: var(--shadow-lg);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* Backdrop for mobile sidebar */
  .sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 199;
    backdrop-filter: blur(2px);
  }

  .sidebar-backdrop.visible {
    display: block;
  }

  .content-area {
    padding: var(--space-4);
  }
}

/* Tablet: mini-sidebar */
@media (min-width: 769px) and (max-width: 1024px) {
  .dashboard-shell {
    grid-template-columns: var(--sidebar-collapsed-width) 1fr;
  }
  
  .sidebar .nav-label { display: none; }
  .sidebar .nav-section-title { display: none; }
}
```

### 3.2 — The Sidebar Component

```html
<!-- Sidebar Structure -->
<aside class="sidebar">

  <!-- Logo / Brand -->
  <div class="sidebar-brand">
    <div class="brand-logo">
      <!-- SVG logo or img -->
    </div>
    <span class="brand-name">Codename</span>
    <!-- Collapse toggle button -->
    <button class="sidebar-collapse-btn" aria-label="Collapse sidebar">
      <svg><!-- chevron icon --></svg>
    </button>
  </div>

  <!-- Search -->
  <div class="sidebar-search">
    <input type="search" placeholder="Search..." aria-label="Search dashboard" />
  </div>

  <!-- Navigation -->
  <nav class="sidebar-nav" aria-label="Main navigation">

    <!-- Pinned / Starred items -->
    <div class="nav-section">
      <span class="nav-section-title">Pinned</span>
      <ul role="list">
        <li>
          <a href="#" class="nav-item" aria-current="page">
            <svg class="nav-icon" aria-hidden="true"><!-- icon --></svg>
            <span class="nav-label">Dashboard</span>
            <!-- Optional: notification badge -->
            <span class="nav-badge" aria-label="7 notifications">7</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Main navigation sections -->
    <div class="nav-section">
      <span class="nav-section-title">Analytics</span>
      <ul role="list">
        <li>
          <a href="#" class="nav-item">
            <svg class="nav-icon" aria-hidden="true"><!-- icon --></svg>
            <span class="nav-label">Sales list</span>
          </a>
        </li>
        <!-- Expandable sub-nav item -->
        <li>
          <button class="nav-item nav-expandable" aria-expanded="true">
            <svg class="nav-icon" aria-hidden="true"><!-- icon --></svg>
            <span class="nav-label">Reports</span>
            <svg class="nav-chevron" aria-hidden="true"><!-- chevron --></svg>
          </button>
          <ul class="nav-subitems" role="list">
            <li><a href="#" class="nav-subitem">Deals by user</a></li>
            <li><a href="#" class="nav-subitem">Deal duration</a></li>
            <li><a href="#" class="nav-subitem active">New report</a></li>
          </ul>
        </li>
      </ul>
    </div>

  </nav>

  <!-- Sidebar Footer -->
  <div class="sidebar-footer">
    <a href="#" class="nav-item">
      <svg class="nav-icon" aria-hidden="true"><!-- settings --></svg>
      <span class="nav-label">Settings</span>
    </a>
    <!-- User avatar -->
    <div class="sidebar-user">
      <img src="avatar.jpg" alt="Profile: Jane Doe" class="avatar avatar-sm" />
      <span class="nav-label">Jane Doe</span>
    </div>
  </div>

</aside>
```

```css
/* ============================================
   SIDEBAR COMPONENT STYLES
   ============================================ */

.sidebar {
  background: var(--surface-sidebar);
  border-right: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-3);
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 0;
  height: 100vh;
  scrollbar-width: thin;
}

/* Brand area */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-2) var(--space-6);
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--neutral-900);
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.brand-name {
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--neutral-900);
  white-space: nowrap;
}

/* Navigation sections */
.nav-section {
  margin-bottom: var(--space-6);
}

.nav-section-title {
  display: block;
  font-size: 0.6875rem;       /* 11px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--neutral-400);
  padding: 0 var(--space-2) var(--space-2);
}

/* Nav items */
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--neutral-600);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: background var(--transition-fast), color var(--transition-fast);
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
}

.nav-item:hover {
  background: var(--neutral-100);
  color: var(--neutral-900);
}

/* Active state — this is where the accent color lives */
.nav-item[aria-current="page"],
.nav-item.active {
  background: var(--accent-100);
  color: var(--accent-500);
  font-weight: 600;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: inherit;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Notification badge */
.nav-badge {
  background: var(--accent-500);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
  line-height: 16px;
}

/* Sub-navigation */
.nav-subitems {
  padding-left: calc(var(--space-3) + 18px + var(--space-3)); /* aligns with label */
  margin-top: var(--space-1);
}

.nav-subitem {
  display: block;
  padding: var(--space-1-5, 6px) var(--space-2);
  font-size: var(--text-sm);
  color: var(--neutral-600);
  text-decoration: none;
  border-radius: var(--radius-sm);
  border-left: 2px solid transparent;
  transition: all var(--transition-fast);
}

.nav-subitem:hover {
  color: var(--neutral-900);
  background: var(--neutral-100);
}

.nav-subitem.active {
  color: var(--accent-500);
  border-left-color: var(--accent-500);
  background: var(--accent-100);
}

/* Collapsed state: hide labels */
.dashboard-shell.sidebar-collapsed .sidebar .nav-label,
.dashboard-shell.sidebar-collapsed .sidebar .nav-section-title,
.dashboard-shell.sidebar-collapsed .sidebar .brand-name,
.dashboard-shell.sidebar-collapsed .sidebar .nav-badge {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
```

### 3.3 — The Topbar Component

```html
<header class="topbar">

  <!-- Left: Mobile menu toggle + breadcrumb -->
  <div class="topbar-left">
    <button class="mobile-menu-btn" aria-label="Open navigation menu" aria-expanded="false">
      <svg><!-- hamburger icon --></svg>
    </button>
    <!-- Page title / breadcrumb context -->
    <h1 class="page-title">New report</h1>
  </div>

  <!-- Center: Global search -->
  <div class="topbar-search">
    <label for="global-search" class="sr-only">Search</label>
    <div class="search-wrapper">
      <svg class="search-icon" aria-hidden="true"><!-- search icon --></svg>
      <input
        id="global-search"
        type="search"
        placeholder='Try searching "insights"'
        class="search-input"
        aria-label="Global search"
      />
      <kbd class="search-shortcut" aria-label="Keyboard shortcut: Command K">⌘K</kbd>
    </div>
  </div>

  <!-- Right: Actions + user -->
  <div class="topbar-right">
    <!-- Active collaborators (Codename pattern) -->
    <div class="collaborators" aria-label="Active collaborators">
      <img src="armin.jpg" alt="Armin A." class="collab-avatar" />
      <img src="eren.jpg" alt="Eren Y." class="collab-avatar" />
      <img src="mikasa.jpg" alt="Mikasa A." class="collab-avatar" />
    </div>

    <!-- Timeframe picker -->
    <button class="timeframe-btn" aria-label="Change timeframe: Sep 1 to Nov 30, 2023">
      <span class="timeframe-label">Sep 1 – Nov 30, 2023</span>
      <svg aria-hidden="true"><!-- chevron --></svg>
    </button>

    <!-- Action icons -->
    <button class="icon-btn" aria-label="Customize columns">
      <svg><!-- filter icon --></svg>
    </button>
    <button class="icon-btn" aria-label="Export data">
      <svg><!-- download icon --></svg>
    </button>
    <button class="icon-btn" aria-label="Share report">
      <svg><!-- share icon --></svg>
    </button>

    <!-- Dark mode toggle -->
    <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode">
      <svg class="icon-sun" aria-hidden="true"><!-- sun --></svg>
      <svg class="icon-moon" aria-hidden="true"><!-- moon --></svg>
    </button>

    <!-- User avatar -->
    <button class="user-menu-btn" aria-label="User menu" aria-haspopup="true">
      <img src="user.jpg" alt="" aria-hidden="true" class="avatar avatar-md" />
    </button>
  </div>

</header>
```

```css
/* ============================================
   TOPBAR COMPONENT
   ============================================ */

.topbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--space-6);
  background: var(--surface-card);
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--topbar-height);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.page-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--neutral-400);   /* Lighter — content below takes priority */
  white-space: nowrap;
}

.topbar-search {
  flex: 1;
  max-width: 400px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 0 var(--space-4) 0 calc(var(--space-4) + 20px);
  border: 1.5px solid var(--neutral-200);
  border-radius: var(--radius-full);
  background: var(--neutral-50);
  color: var(--neutral-800);
  font-size: var(--text-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-500);
  box-shadow: 0 0 0 3px var(--accent-100);
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  color: var(--neutral-400);
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.search-shortcut {
  position: absolute;
  right: var(--space-3);
  font-size: var(--text-xs);
  color: var(--neutral-400);
  background: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
}

/* Collaborator avatars — stacked */
.collaborators {
  display: flex;
  align-items: center;
}

.collab-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid var(--surface-card);
  margin-left: -8px;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.collab-avatar:first-child { margin-left: 0; }
.collab-avatar:hover { transform: translateY(-2px); z-index: 1; }

/* Timeframe button */
.timeframe-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1.5px solid var(--neutral-200);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  font-size: var(--text-sm);
  color: var(--neutral-700);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  white-space: nowrap;
}

.timeframe-btn:hover {
  border-color: var(--neutral-400);
  background: var(--neutral-50);
}

/* Icon-only action buttons */
.icon-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--neutral-500);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.icon-btn:hover {
  background: var(--neutral-100);
  color: var(--neutral-800);
}

/* Hide mobile elements on desktop */
.mobile-menu-btn { display: none; }

@media (max-width: 768px) {
  .mobile-menu-btn { display: grid; place-items: center; }
  .topbar-search { display: none; }
  .collab-avatar, .timeframe-btn { display: none; }
  .page-title { font-size: var(--text-base); }
}
```

---

## Phase 4: Core Dashboard Components

### 4.1 — KPI Stat Card

The most important component on any dashboard. Make the number the hero.

```html
<!-- KPI Stat Card -->
<article class="stat-card" aria-label="Revenue KPI">
  <div class="stat-header">
    <span class="stat-label">Revenue</span>
    <button class="icon-btn stat-action" aria-label="View revenue details">
      <svg><!-- arrow icon --></svg>
    </button>
  </div>

  <div class="stat-value-group">
    <!-- Hero number — this dominates -->
    <p class="stat-value" aria-label="$528,976.82">
      $528,976<span class="stat-cents">.82</span>
    </p>
    <!-- Trend indicator -->
    <div class="stat-trend trend-up" aria-label="Up 7.9% vs previous period">
      <svg class="trend-icon" aria-hidden="true"><!-- up arrow --></svg>
      <span class="trend-value">7.9%</span>
    </div>
  </div>

  <!-- Comparison context -->
  <p class="stat-comparison">
    vs prev. <span>$501,641.73</span>
    <button class="comparison-period">Jun 1 – Aug 31, 2023 ↓</button>
  </p>

  <!-- Optional: sparkline chart -->
  <div class="stat-sparkline" aria-hidden="true">
    <canvas id="sparkline-revenue" width="200" height="40"></canvas>
  </div>
</article>
```

```css
/* ============================================
   KPI STAT CARD
   ============================================ */

.stat-card {
  background: var(--surface-card);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  border: 1px solid var(--neutral-200);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* HIGHLIGHTED / featured card — dark variant (Best Deal in reference) */
.stat-card.stat-featured {
  background: var(--neutral-900);
  border-color: var(--neutral-900);
  color: var(--neutral-0);
}

.stat-card.stat-featured .stat-label,
.stat-card.stat-featured .stat-comparison { color: var(--neutral-400); }

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--neutral-600);
  text-transform: capitalize;
}

.stat-value-group {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--neutral-900);
  line-height: 1;
}

.stat-cents {
  font-size: var(--text-2xl);
  font-weight: 500;
  opacity: 0.6;
}

.stat-comparison {
  font-size: var(--text-xs);
  color: var(--neutral-500);
}

/* Trend badges */
.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  flex-shrink: 0;
}

.trend-up {
  background: #D1FAE5;
  color: #065F46;
}

.trend-down {
  background: #FEE2E2;
  color: #991B1B;
}

[data-theme="dark"] .trend-up { background: #064E3B; color: #6EE7B7; }
[data-theme="dark"] .trend-down { background: #7F1D1D; color: #FCA5A5; }

/* Secondary value badge (like $27,335.09 in reference) */
.stat-secondary-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  border: 1.5px solid var(--accent-500);
  color: var(--accent-500);
}
```

### 4.2 — Data Table Component

```html
<!-- Data Table with sorting, filtering, responsive behavior -->
<div class="table-container">

  <!-- Table toolbar -->
  <div class="table-toolbar">
    <h3 class="table-title">Sales by rep</h3>
    <div class="table-actions">
      <div class="search-wrapper table-search">
        <input type="search" placeholder="Filter..." aria-label="Filter table" />
      </div>
      <button class="btn btn-secondary btn-sm">
        <svg aria-hidden="true"><!-- filter icon --></svg>
        Filters
      </button>
      <button class="btn btn-ghost btn-sm" aria-label="Download table as CSV">
        <svg aria-hidden="true"><!-- download --></svg>
      </button>
    </div>
  </div>

  <!-- Responsive table wrapper — horizontal scroll on mobile -->
  <div class="table-scroll-wrapper" role="region" aria-label="Sales data table" tabindex="0">
    <table class="data-table" aria-label="Sales performance by representative">
      <thead>
        <tr>
          <th scope="col" class="th-check">
            <input type="checkbox" aria-label="Select all rows" />
          </th>
          <th scope="col" class="sortable" aria-sort="none">
            <button class="sort-btn">
              Sales rep
              <svg class="sort-icon" aria-hidden="true"><!-- sort icon --></svg>
            </button>
          </th>
          <th scope="col" class="sortable th-number" aria-sort="descending">
            <button class="sort-btn">
              Revenue
              <svg class="sort-icon sort-active" aria-hidden="true"><!-- sort asc --></svg>
            </button>
          </th>
          <th scope="col" class="th-number">Leads</th>
          <th scope="col" class="th-number">KPI</th>
          <th scope="col">W/L</th>
          <th scope="col" class="th-actions">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Table row -->
        <tr class="table-row" data-rowid="armin">
          <td class="td-check">
            <input type="checkbox" aria-label="Select Armin A." />
          </td>
          <td class="td-user">
            <img src="armin.jpg" alt="" class="avatar avatar-sm" aria-hidden="true" />
            <span class="td-name">Armin A.</span>
          </td>
          <td class="td-number td-primary">$209,633</td>
          <td class="td-number">
            <span class="pill pill-info">41</span>
          </td>
          <td class="td-number">0.84</td>
          <td class="td-number">
            <span class="td-wl">31% <span class="td-wl-detail">12 / 29</span></span>
          </td>
          <td class="td-actions">
            <button class="icon-btn row-action" aria-label="More options for Armin A.">
              <svg><!-- ellipsis --></svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="table-pagination">
    <span class="pagination-info">Showing 1–10 of 48 results</span>
    <div class="pagination-controls">
      <button class="btn btn-ghost btn-sm" disabled aria-label="Previous page">←</button>
      <button class="btn btn-primary btn-sm" aria-current="page" aria-label="Page 1">1</button>
      <button class="btn btn-ghost btn-sm" aria-label="Page 2">2</button>
      <button class="btn btn-ghost btn-sm" aria-label="Page 3">3</button>
      <button class="btn btn-ghost btn-sm" aria-label="Next page">→</button>
    </div>
  </div>

</div>
```

```css
/* ============================================
   DATA TABLE COMPONENT
   ============================================ */

.table-container {
  background: var(--surface-card);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--neutral-200);
  gap: var(--space-3);
  flex-wrap: wrap;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.table-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

/* Table headers */
.data-table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--neutral-500);
  background: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
  white-space: nowrap;
}

.th-number { text-align: right; }
.th-check  { width: 48px; }
.th-actions { width: 48px; }

/* Sort button */
.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
  letter-spacing: inherit;
  text-transform: inherit;
}

.sort-btn:hover { color: var(--neutral-800); }
.sort-icon { width: 12px; height: 12px; opacity: 0.4; }
.sort-active { opacity: 1; color: var(--accent-500); }

/* Table rows */
.table-row {
  border-bottom: 1px solid var(--neutral-100);
  transition: background var(--transition-fast);
}

.table-row:last-child { border-bottom: none; }

.table-row:hover {
  background: var(--neutral-50);
}

/* Table cells */
.data-table td {
  padding: var(--space-3) var(--space-4);
  color: var(--neutral-700);
  vertical-align: middle;
}

.td-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  white-space: nowrap;
}

.td-name { font-weight: 500; color: var(--neutral-900); }
.td-number { text-align: right; font-variant-numeric: tabular-nums; }
.td-primary { font-weight: 600; color: var(--neutral-900); }

/* W/L display */
.td-wl { display: flex; flex-direction: column; align-items: flex-end; }
.td-wl-detail { font-size: var(--text-xs); color: var(--neutral-400); }

/* Pagination */
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--neutral-200);
}

.pagination-info { font-size: var(--text-sm); color: var(--neutral-500); }

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Mobile: simplify table to key columns */
@media (max-width: 640px) {
  .table-toolbar { flex-direction: column; align-items: flex-start; }
  .td-check, .th-check { display: none; }
  .td-actions, .th-actions { display: none; }
}
```

### 4.3 — Chart Card Component

```html
<!-- Chart Card wrapper — wraps any chart library instance -->
<div class="chart-card">
  <div class="chart-card-header">
    <div class="chart-title-group">
      <!-- Chart type switcher (like Codename bar/line toggle) -->
      <button class="chart-type-btn active" aria-pressed="true" aria-label="Bar chart view">
        <svg><!-- bar chart icon --></svg>
      </button>
      <button class="chart-type-btn" aria-pressed="false" aria-label="Line chart view">
        <svg><!-- line chart icon --></svg>
      </button>
      <h3 class="chart-title">Deals amount by referrer category</h3>
    </div>
    <button class="btn btn-ghost btn-sm">
      Filters
      <svg aria-hidden="true"><!-- filter --></svg>
    </button>
  </div>

  <!-- Legend (if needed) -->
  <div class="chart-legend" aria-label="Chart legend">
    <span class="legend-item">
      <span class="legend-dot" style="background: var(--accent-500);" aria-hidden="true"></span>
      Revenue
    </span>
    <span class="legend-item">
      <span class="legend-dot" style="background: var(--signal-info);" aria-hidden="true"></span>
      Leads
    </span>
  </div>

  <!-- Chart canvas / container — library renders here -->
  <div class="chart-canvas-wrapper" role="img" aria-label="Bar chart showing deals amount by referrer category">
    <canvas id="chart-referrer" aria-hidden="true"></canvas>
    <!-- Accessible fallback table for screen readers -->
    <table class="chart-data-table sr-only">
      <caption>Deals amount by referrer category</caption>
      <thead><tr><th>Platform</th><th>Amount</th><th>Share</th></tr></thead>
      <tbody>
        <tr><td>Dribbble</td><td>$227,459</td><td>43%</td></tr>
        <tr><td>Instagram</td><td>$142,823</td><td>27%</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

```css
/* ============================================
   CHART CARD COMPONENT
   ============================================ */

.chart-card {
  background: var(--surface-card);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.chart-title-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.chart-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--neutral-800);
}

/* Chart type toggle buttons */
.chart-type-btn {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--neutral-200);
  background: transparent;
  color: var(--neutral-400);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chart-type-btn.active,
.chart-type-btn[aria-pressed="true"] {
  background: var(--neutral-900);
  border-color: var(--neutral-900);
  color: white;
}

/* Legend */
.chart-legend {
  display: flex;
  gap: var(--space-4);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--neutral-600);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
}

/* Canvas wrapper */
.chart-canvas-wrapper {
  position: relative;
  width: 100%;
  min-height: 180px;
}

.chart-canvas-wrapper canvas {
  width: 100% !important;
  max-height: 240px;
}
```

### 4.4 — Button System

```css
/* ============================================
   BUTTON SYSTEM
   Every variant. Every size.
   ============================================ */

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
  line-height: 1.5;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* Focus ring — accessibility */
.btn:focus-visible {
  outline: 2px solid var(--accent-500);
  outline-offset: 2px;
}

/* Primary */
.btn-primary {
  background: var(--neutral-900);
  color: white;
  border-color: var(--neutral-900);
}

.btn-primary:hover { background: var(--neutral-700); border-color: var(--neutral-700); }

/* Accent */
.btn-accent {
  background: var(--accent-500);
  color: white;
  border-color: var(--accent-500);
}

.btn-accent:hover { background: var(--accent-400); border-color: var(--accent-400); }

/* Secondary */
.btn-secondary {
  background: var(--surface-card);
  color: var(--neutral-700);
  border-color: var(--neutral-200);
}

.btn-secondary:hover {
  background: var(--neutral-100);
  border-color: var(--neutral-300);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--neutral-600);
  border-color: transparent;
}

.btn-ghost:hover { background: var(--neutral-100); color: var(--neutral-800); }

/* Sizes */
.btn-sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
.btn-lg { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn-icon { padding: var(--space-2); width: 36px; height: 36px; justify-content: center; }
```

### 4.5 — Avatar Component

```css
/* ============================================
   AVATAR COMPONENT
   ============================================ */

.avatar {
  border-radius: var(--radius-full);
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.avatar-xs  { width: 24px; height: 24px; }
.avatar-sm  { width: 32px; height: 32px; }
.avatar-md  { width: 40px; height: 40px; }
.avatar-lg  { width: 48px; height: 48px; }
.avatar-xl  { width: 64px; height: 64px; }

/* Fallback: text initials avatar */
.avatar-placeholder {
  border-radius: var(--radius-full);
  background: var(--accent-100);
  color: var(--accent-500);
  font-weight: 700;
  font-size: var(--text-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

### 4.6 — Badge / Pill Component

```css
/* ============================================
   BADGES & PILLS
   ============================================ */

.pill {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1.4;
}

.pill-neutral { background: var(--neutral-100); color: var(--neutral-600); }
.pill-info    { background: #DBEAFE; color: #1D4ED8; }
.pill-success { background: #D1FAE5; color: #065F46; }
.pill-warning { background: #FEF3C7; color: #92400E; }
.pill-danger  { background: #FEE2E2; color: #991B1B; }
.pill-accent  { background: var(--accent-100); color: var(--accent-500); }

[data-theme="dark"] .pill-info    { background: #1E3A5F; color: #93C5FD; }
[data-theme="dark"] .pill-success { background: #064E3B; color: #6EE7B7; }
```

---

## Phase 5: Content Grid Layout System

### 5.1 — The Page Grid

```css
/* ============================================
   CONTENT GRID SYSTEM
   Responsive grid for placing widgets/cards.
   ============================================ */

/* Default 12-column grid */
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-5);
  align-items: start;
}

/* Column span utilities */
.col-1  { grid-column: span 1; }
.col-2  { grid-column: span 2; }
.col-3  { grid-column: span 3; }
.col-4  { grid-column: span 4; }
.col-5  { grid-column: span 5; }
.col-6  { grid-column: span 6; }
.col-7  { grid-column: span 7; }
.col-8  { grid-column: span 8; }
.col-9  { grid-column: span 9; }
.col-12 { grid-column: span 12; }

/* Row span for tall widgets */
.row-2 { grid-row: span 2; }

/* Common layout patterns */
.layout-stats {
  /* 4 equal KPI cards */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.layout-two-thirds-one-third {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-5);
}

.layout-sidebar-right {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-5);
}

/* Responsive: collapse all grids to single column on mobile */
@media (max-width: 768px) {
  .page-grid { grid-template-columns: 1fr; }
  .page-grid [class*="col-"] { grid-column: span 1; }
  .layout-two-thirds-one-third { grid-template-columns: 1fr; }
  .layout-sidebar-right { grid-template-columns: 1fr; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .page-grid { grid-template-columns: repeat(6, 1fr); }
  .col-3 { grid-column: span 3; }
  .col-4 { grid-column: span 6; }
  .col-8 { grid-column: span 6; }
  .layout-sidebar-right { grid-template-columns: 1fr; }
}
```

---

## Phase 6: Dark Mode Implementation

```javascript
/* ============================================
   DARK MODE TOGGLE — JavaScript
   Persists to localStorage. Respects OS preference.
   ============================================ */

const THEME_KEY = 'dashboard-theme';
const root = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');

/**
 * Gets the user's preferred theme.
 * Priority: localStorage → OS preference → light
 */
function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies a theme to the document root.
 * @param {'light' | 'dark'} theme
 */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  // Update toggle button state
  const isDark = theme === 'dark';
  themeToggleBtn?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggleBtn?.setAttribute('aria-pressed', String(isDark));

  // Update chart colors if charts exist
  updateChartTheme(theme);
}

/**
 * Toggles between light and dark modes.
 */
function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Initialize on page load
applyTheme(getPreferredTheme());

// Wire up toggle button
themeToggleBtn?.addEventListener('click', toggleTheme);

// Listen for OS preference changes (user changes system setting mid-session)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem(THEME_KEY)) {
    // Only auto-switch if user hasn't manually set preference
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
```

---

## Phase 7: Chart Integration

### 7.1 — Chart Library Selection

| Library | Best For | Bundle Size | License |
|---|---|---|---|
| **Chart.js** | General dashboards, simple charts | ~60KB | MIT |
| **ApexCharts** | Rich interactions, sparklines, annotations | ~120KB | MIT |
| **Recharts** | React dashboards, composable API | ~100KB | MIT |
| **Nivo** | Beautiful defaults, React, D3 powered | ~200KB+ | MIT |
| **D3.js** | Fully custom visualizations, maps | ~90KB | ISC |
| **ECharts** | Data-heavy, geographic, large datasets | ~900KB | Apache 2 |
| **Tremor** | Tailwind-native, pre-built components | ~30KB | Apache 2 |

**Recommendation for most dashboards**: Chart.js (simple) or ApexCharts (interactive).

### 7.2 — Dashboard-Ready Chart Configuration

```javascript
/* ============================================
   CHART CONFIGURATION
   Theme-aware, accessible, consistent styling.
   ============================================ */

/**
 * Returns theme-appropriate chart colors from CSS variables.
 * Call this when applying or switching themes.
 */
function getChartTheme() {
  const styles = getComputedStyle(document.documentElement);
  return {
    // Read from CSS custom properties — single source of truth
    textColor:     styles.getPropertyValue('--neutral-600').trim(),
    gridColor:     styles.getPropertyValue('--neutral-200').trim(),
    accentColor:   styles.getPropertyValue('--accent-500').trim(),
    positiveColor: styles.getPropertyValue('--signal-positive').trim(),
    negativeColor: styles.getPropertyValue('--signal-negative').trim(),
    infoColor:     styles.getPropertyValue('--signal-info').trim(),
    surfaceColor:  styles.getPropertyValue('--surface-card').trim(),
    fontFamily:    styles.getPropertyValue('--font-body').trim(),
  };
}

/**
 * Global Chart.js defaults — apply once on page load.
 * All charts inherit these.
 */
function setChartDefaults() {
  const theme = getChartTheme();

  Chart.defaults.font.family = theme.fontFamily;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = theme.textColor;

  Chart.defaults.plugins.legend.display = false; // we render custom legends
  Chart.defaults.plugins.tooltip.backgroundColor = '#1a1a1a';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#cccccc';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.displayColors = true;

  Chart.defaults.scale.grid.color = theme.gridColor;
  Chart.defaults.scale.grid.drawBorder = false;
  Chart.defaults.scale.ticks.padding = 8;
}

/**
 * Creates a sparkline chart for KPI cards.
 * @param {string} canvasId - The canvas element ID
 * @param {number[]} data - Array of data points
 * @param {'up' | 'down'} trend - Determines line color
 */
function createSparkline(canvasId, data, trend = 'up') {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  const theme = getChartTheme();
  const color = trend === 'up' ? theme.positiveColor : theme.negativeColor;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 2,
        fill: true,
        backgroundColor: hexToRgba(color, 0.08),
        tension: 0.4,
        pointRadius: 0,         // no dots on sparklines
        pointHoverRadius: 4,    // dots appear on hover only
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    },
  });
}

/**
 * Creates a bar chart for channel/breakdown data.
 */
function createBarChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  const theme = getChartTheme();

  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: 'easeOutCubic',
        // Bars animate up from the bottom
        delay: (ctx) => ctx.dataIndex * 50,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            // Format monetary values
            label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
        },
        y: {
          grid: { color: theme.gridColor },
          border: { display: false },
          ticks: {
            callback: (val) => `$${(val/1000).toFixed(0)}k`,
          },
        },
      },
    },
  });
}

/** Helper: convert hex to rgba */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Update all chart instances when theme changes */
function updateChartTheme(theme) {
  setChartDefaults();
  Chart.instances.forEach(chart => {
    chart.options.plugins.tooltip.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#212529';
    chart.update('none'); // 'none' = no animation on theme switch
  });
}
```

---

## Phase 8: Sidebar Behavior & JavaScript

```javascript
/* ============================================
   SIDEBAR BEHAVIOR
   Collapse, mobile drawer, keyboard navigation.
   ============================================ */

const shell = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const backdrop = document.querySelector('.sidebar-backdrop');
const SIDEBAR_KEY = 'sidebar-collapsed';

/** Toggle collapsed state on desktop */
function toggleSidebarCollapse() {
  const isCollapsed = shell.classList.toggle('sidebar-collapsed');
  localStorage.setItem(SIDEBAR_KEY, String(isCollapsed));

  // Update all nav items with tooltip titles when collapsed
  sidebar.querySelectorAll('.nav-item').forEach(item => {
    const label = item.querySelector('.nav-label')?.textContent;
    item.setAttribute('title', isCollapsed ? label : '');
  });

  // Announce state change to screen readers
  sidebar.setAttribute('aria-expanded', String(!isCollapsed));
}

/** Open sidebar drawer on mobile */
function openMobileSidebar() {
  sidebar.classList.add('open');
  backdrop.classList.add('visible');
  sidebar.setAttribute('aria-hidden', 'false');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');

  // Trap focus inside sidebar when open
  const firstFocusable = sidebar.querySelector('a, button, input');
  firstFocusable?.focus();

  // Close on Escape key
  document.addEventListener('keydown', closeSidebarOnEsc);
}

/** Close sidebar drawer on mobile */
function closeMobileSidebar() {
  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  sidebar.setAttribute('aria-hidden', 'true');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileMenuBtn.focus(); // return focus to trigger

  document.removeEventListener('keydown', closeSidebarOnEsc);
}

function closeSidebarOnEsc(e) {
  if (e.key === 'Escape') closeMobileSidebar();
}

// Wire up events
mobileMenuBtn?.addEventListener('click', openMobileSidebar);
backdrop?.addEventListener('click', closeMobileSidebar);
document.querySelector('.sidebar-collapse-btn')?.addEventListener('click', toggleSidebarCollapse);

// Restore collapsed state from localStorage
if (localStorage.getItem(SIDEBAR_KEY) === 'true') {
  shell.classList.add('sidebar-collapsed');
}

/* --- Expandable nav sections --- */
document.querySelectorAll('.nav-expandable').forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isExpanded));

    const submenu = btn.nextElementSibling;
    submenu.style.maxHeight = isExpanded ? '0' : submenu.scrollHeight + 'px';
    submenu.style.overflow = 'hidden';
    submenu.style.transition = 'max-height var(--transition-base)';
  });
});

/* --- Global keyboard shortcut for search (⌘K / Ctrl+K) --- */
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('global-search')?.focus();
  }
});
```

---

## Phase 9: Accessibility Implementation

```html
<!-- Accessibility requirements — non-negotiable -->

<!-- 1. Skip navigation link (first element in body) -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- 2. Live region for dynamic updates (alerts, data refreshes) -->
<div
  id="live-region"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
></div>

<!-- 3. Loading state announcement -->
<!-- When data is loading, update aria-busy -->
<main aria-busy="false" id="main-content">
  <!-- Dashboard content -->
</main>
```

```css
/* ============================================
   ACCESSIBILITY UTILITIES
   ============================================ */

/* Screen reader only — visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip link — hidden until focused */
.skip-link {
  position: absolute;
  top: -40px;
  left: var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--accent-500);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
  z-index: 9999;
  transition: top var(--transition-fast);
  text-decoration: none;
}

.skip-link:focus {
  top: var(--space-4);
  outline: 2px solid white;
  outline-offset: 2px;
}

/* Focus ring — must be visible for keyboard navigation */
:focus-visible {
  outline: 2px solid var(--accent-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Reduced motion — respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --neutral-200: #000000;
    --neutral-600: #000000;
    --accent-500: #0000EE;
  }
}
```

### 9.1 — ARIA Checklist for Dashboard Components

Every interactive component MUST have:
- `aria-label` on all icon-only buttons
- `aria-current="page"` on the active nav item
- `aria-expanded` on collapsible sections
- `aria-sort` on sortable table columns
- `aria-live` regions for dynamic data updates
- `role="status"` on loading spinners
- `alt` text on all meaningful images
- `aria-hidden="true"` on decorative icons and images
- Minimum 4.5:1 color contrast for body text
- Minimum 3:1 for UI components (buttons, inputs)
- All interactive elements reachable and operable via keyboard

---

## Phase 10: Performance & Production

### 10.1 — CSS Performance

```css
/* Contain layout changes to specific components — prevent full-page reflows */
.stat-card       { contain: layout style; }
.chart-card      { contain: layout style; }
.table-container { contain: layout; }

/* Use GPU-accelerated properties for animations */
.sidebar { will-change: transform; }  /* Remove after animation completes */
.collab-avatar { will-change: transform; }

/* Content visibility — skip rendering off-screen sections */
.content-section { content-visibility: auto; }
```

### 10.2 — Loading States (Skeletons)

```css
/* Skeleton loading animation */
@keyframes skeleton-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-100) 25%,
    var(--neutral-200) 50%,
    var(--neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite ease-in-out;
  border-radius: var(--radius-md);
}

/* Skeleton variants */
.skeleton-text-lg  { height: 36px; width: 160px; }
.skeleton-text-sm  { height: 14px; width: 100%; }
.skeleton-card     { height: 120px; width: 100%; }
.skeleton-avatar   { width: 40px; height: 40px; border-radius: var(--radius-full); }
.skeleton-chart    { height: 200px; width: 100%; }
```

### 10.3 — Project Folder Structure

```
/dashboard-project
  /assets
    /fonts               ← Self-hosted fonts (woff2 format)
    /icons               ← SVG sprite or individual SVGs
    /images              ← Avatars, logos (optimized WebP)
  /css
    tokens.css           ← Design tokens (Phase 2) — import first
    reset.css            ← Minimal CSS reset
    layout.css           ← Shell, sidebar, topbar, grid (Phase 3)
    components.css       ← All components (Phase 4–5)
    utilities.css        ← Helper classes (sr-only, skeleton, etc.)
    themes.css           ← Dark mode overrides
  /js
    theme.js             ← Dark mode logic
    sidebar.js           ← Sidebar behavior
    charts.js            ← Chart configuration and instances
    dashboard.js         ← Page-specific data and init
    utils.js             ← Shared helpers (debounce, formatters)
  /pages
    index.html           ← Main dashboard page
    reports.html         ← Reports page
    users.html           ← User management
    settings.html        ← Settings
  /components
    sidebar.html         ← Sidebar partial (for includes)
    topbar.html          ← Topbar partial
  README.md              ← Setup, customization guide
```

### 10.4 — Performance Checklist

Before shipping:
- [ ] Images: use WebP format, add `width` and `height` attributes to prevent CLS
- [ ] Fonts: preload critical font files, use `font-display: swap`
- [ ] Charts: initialize after page paint (`requestIdleCallback` or `DOMContentLoaded`)
- [ ] Heavy data: paginate tables (never render >200 rows at once without virtualization)
- [ ] CSS: remove unused variables; confirm dark mode variables actually override correctly
- [ ] JS: debounce search inputs, throttle window resize handlers
- [ ] Color contrast: test all text/background combinations with a contrast checker
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Keyboard navigation: tab through entire dashboard, every control must be reachable
- [ ] Screen reader: test with VoiceOver (macOS) or NVDA (Windows)

---

## Core Dashboard Design Principles

**Data is the product, not the interface.** The UI should recede and let the data speak. Every decorative element that doesn't aid comprehension is a mistake.

**Every number needs context.** A revenue of $528,976 means nothing without "vs last period" and a trend direction. Never show raw numbers without comparison anchors.

**The KPI row is sacred.** The most important numbers sit above the fold, large, immediate. Users should not need to scroll to understand if today is a good day or a bad day.

**One accent color.** Not two. Not three. One. Used for active states, CTAs, and signals. Everything else is neutral.

**Dark mode is not an afterthought.** Design both modes simultaneously with CSS custom properties. Test charts, tables, and all components in both themes.

**Mobile is a different UX, not a scaled-down desktop.** On mobile: sidebar becomes a drawer, multi-column layouts collapse, tables simplify to key columns, touch targets are 44px minimum.

**Accessibility is a feature.** Keyboard navigation, screen reader support, WCAG 2.1 AA contrast, and reduced-motion support are requirements, not bonuses.

**Comments explain intent, not syntax.** Every CSS section, every JavaScript function, every HTML landmark should be commented with WHY — not just WHAT. The next developer reading this code is your user.

---

## Required Output Format

When building a dashboard, always produce in this order:

1. **Design Vision** — Domain, user type, aesthetic direction, accent color, ONE feature that makes it memorable
2. **Token System** — CSS custom properties tailored to the domain (colors, typography, spacing)
3. **Shell Layout** — HTML structure + CSS grid for sidebar + main area
4. **Sidebar** — Fully structured with navigation, states, collapse behavior
5. **Topbar** — Search, actions, user, responsive behavior
6. **KPI Stat Cards** — Data-driven, trend indicators, sparklines
7. **Primary Chart** — Configured with theme-aware colors, accessible fallback table
8. **Data Table** — Sortable, filterable, responsive, paginated
9. **Dark Mode** — CSS token overrides + JavaScript toggle implementation
10. **Responsive Behavior** — Explicit breakpoint decisions for every major component
11. **Accessibility Pass** — ARIA attributes, focus management, skip links, contrast check
12. **Performance Notes** — Skeleton states, loading patterns, production checklist

Always write real, working HTML, CSS, and JavaScript. Comments must explain WHY decisions were made. NEVER produce a generic grey-white-blue dashboard — every implementation must have a distinctive visual identity that reflects the domain it serves.

