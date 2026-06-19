# VermIQ Navigation & Page Layout Guide

## Quick Navigation Reference

### Home Page
**Route**: `/` (default)
**Component**: `HomePage.tsx`
**When Shown**: When user first lands on site OR clicks "Return to Home"

### Schematic Page
**Route**: `/schematic` (state-based)
**Component**: `SchematicPage.tsx`
**When Shown**: When user clicks "View Schematic" button

### Dashboard/Auth
**Route**: `/dashboard` (state-based)
**Component**: `AuthManager.tsx` → `DashboardLayout.tsx`
**When Shown**: When user clicks "Launch Dashboard" or "Sign In to System"

---

## Page Layouts (Visual Guide)

### 1. HOME PAGE

```
┌──────────────────────────────────────────────────┐
│  HEADER: Logo + [View Schematic] + [Dashboard]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  HERO SECTION:                                   │
│  ┌─ Left Side ──────┐  ┌─ Right Side ─────┐    │
│  │ • Hero Title     │  │ • Live Preview   │    │
│  │ • Description    │  │   Card with      │    │
│  │ • CTA Buttons    │  │   Telemetry      │    │
│  │   [Sign In]      │  │   Values         │    │
│  │   [Schematic]    │  │ • Decorative     │    │
│  └──────────────────┘  │   Elements       │    │
│                        └──────────────────┘    │
│                                                  │
├──────────────────────────────────────────────────┤
│ ARCHITECTURE SECTION (Split background):        │
│ • Title + Description                           │
│ • 4-Column Flow Diagram:                        │
│   [ESP32] → [Database] → [Dashboard]            │
├──────────────────────────────────────────────────┤
│ FEATURES GRID (3 columns):                      │
│ • Moisture Monitoring Card                      │
│ • Temperature Stability Card                    │
│ • Alert System Card                             │
├──────────────────────────────────────────────────┤
│ INTEGRATION CTA (Full Width):                   │
│ • Cloud Integration Message                     │
│ • [Sign In to Station] Button                   │
├──────────────────────────────────────────────────┤
│ FOOTER: Logo + Copyright + Links                │
└──────────────────────────────────────────────────┘
```

### 2. SCHEMATIC PAGE

```
┌──────────────────────────────────────────────────┐
│  HEADER: [← Back] + Logo                        │
├──────────────────────────────────────────────────┤
│                                                  │
│ PAGE TITLE: "Circuit Schematic & Hardware       │
│            Architecture"                        │
│ Description: Overview text                      │
│                                                  │
├──────────────────────────────────────────────────┤
│ SCHEMATIC IMAGE SECTION:                        │
│ ┌──────────────────────────────────────────┐   │
│ │                                          │   │
│ │     [HIGH-RES CIRCUIT DIAGRAM SVG]       │   │
│ │     (Responsive, scales to container)    │   │
│ │                                          │   │
│ └──────────────────────────────────────────┘   │
│ Subtitle: "Circuit diagram with connections"   │
│                                                  │
├──────────────────────────────────────────────────┤
│ SYSTEM COMPONENTS (2-column layout):            │
│ ┌─ Component 1 ─┐  ┌─ Component 2 ─┐          │
│ │ Icon + Title  │  │ Icon + Title  │          │
│ │ Description   │  │ Description   │          │
│ │ Specs list    │  │ Specs list    │          │
│ └───────────────┘  └───────────────┘          │
│ ┌─ Component 3 ─┐  ┌─ Component 4 ─┐          │
│ │ Icon + Title  │  │ Icon + Title  │          │
│ │ Description   │  │ Description   │          │
│ │ Specs list    │  │ Specs list    │          │
│ └───────────────┘  └───────────────┘          │
│                                                  │
├──────────────────────────────────────────────────┤
│ CIRCUIT OPERATION FLOW:                         │
│ ┌─────────────────────────────────────────┐    │
│ │ ① Sensor Data Acquisition               │    │
│ │    Detailed explanation                 │    │
│ │    [Progress line]                      │    │
│ ├─────────────────────────────────────────┤    │
│ │ ② Data Validation & Thresholding        │    │
│ │    Detailed explanation                 │    │
│ │    [Progress line]                      │    │
│ ├─────────────────────────────────────────┤    │
│ │ ③ MQTT Transmission                     │    │
│ │    Detailed explanation                 │    │
│ │    [Progress line]                      │    │
│ ├─────────────────────────────────────────┤    │
│ │ ④ Cloud Ingestion & Dashboard           │    │
│ │    Detailed explanation                 │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
├──────────────────────────────────────────────────┤
│ POWER DISTRIBUTION (2-column layout):           │
│ ┌─ Voltage Regulators ─┐ ┌─ Pinout Ref ─┐    │
│ │ • 5V Rail           │ │ GPIO 35 →    │    │
│ │ • 3.3V Logic        │ │ GPIO 4 →     │    │
│ │ • AREF              │ │ GPIO 5 →     │    │
│ │ • Ground            │ │ GPIO 18 →    │    │
│ └─────────────────────┘ └──────────────┘    │
│                                                  │
├──────────────────────────────────────────────────┤
│ DESIGN CONSIDERATIONS (4-column grid):          │
│ ┌─ Sensor ─┐ ┌─ Signal ─┐ ┌─ Firmware ─┐     │
│ │ Placement │ │ Integrity │ │ Reliability │    │
│ │ • Tips   │ │ • Tips    │ │ • Features  │    │
│ └──────────┘ └───────────┘ └─────────────┘    │
│ ┌─ Thermal ─┐                                  │
│ │ Management │                                 │
│ │ • Tips     │                                 │
│ └────────────┘                                 │
│                                                  │
├──────────────────────────────────────────────────┤
│ CTA SECTION:                                    │
│ "Ready to Deploy?"                              │
│ [Return to Home] Button                         │
│                                                  │
├──────────────────────────────────────────────────┤
│ FOOTER: Logo + Copyright + Links                │
└──────────────────────────────────────────────────┘
```

---

## Button Navigation Reference

### From Home Page
| Button | Destination | Component |
|--------|-------------|-----------|
| "View Schematic" | Schematic Page | SchematicPage.tsx |
| "Launch Dashboard" | Auth/Dashboard | AuthManager.tsx |
| "Sign In to System" | Auth/Dashboard | AuthManager.tsx |
| "Explore Architecture" | Scroll to #architecture | (Same page) |
| Footer links | Dashboard | AuthManager.tsx |

### From Schematic Page
| Button | Destination | Component |
|--------|-------------|-----------|
| Logo / "← Back" | Home Page | HomePage.tsx |
| "Return to Home" | Home Page | HomePage.tsx |

### From Dashboard (after login)
| Navigation | Destination |
|------------|-------------|
| Sidebar/Menu | Dashboard pages |
| Logout | Auth/Home flow |

---

## State Management Flow

### App.tsx State
```typescript
type PageType = 'home' | 'schematic' | 'dashboard';
const [currentPage, setCurrentPage] = useState<PageType>('home');
```

### Page Transitions

```
USER CLICKS BUTTON
        ↓
onNavigate() called with target page
        ↓
setCurrentPage() updates state
        ↓
App re-renders with new component
        ↓
NEW PAGE DISPLAYED
        ↓
URL appears static (no route change)
        ↓
User can use browser back button
```

### Complete State Diagram

```
                    ┌─────────────┐
                    │   HOME      │
                    │   PAGE      │
                    └──────┬──────┘
                 /        |        \
            View Sch   Dashboard  (scroll)
            /            |            \
      ┌─────────┐    ┌────────────┐    ↓
      │ SCHEMATIC  │    │   AUTH    │  #arch
      │ PAGE    │    │ DASHBOARD  │
      └────┬────┘    └────────────┘
           |               |
           |               | (after login)
           |               ↓
           |         ┌──────────────┐
           |         │  DASHBOARD   │
           |         │  (DashLayout)│
           |         └──────────────┘
           |
        Back/Logo
           |
           ↓
        (HOME PAGE)
```

---

## Mobile Responsive Behavior

### Mobile (< 768px)
```
┌────────────────┐
│ HEADER         │
│ Logo + Button  │
├────────────────┤
│ FULL WIDTH     │
│ CONTENT        │
│                │
│ Stacked Cards  │
│ Grid → 1 col   │
│                │
│ FULL WIDTH     │
│ BUTTONS        │
└────────────────┘
```

### Tablet (768px - 1023px)
```
┌──────────────────────────┐
│ HEADER                   │
├──────────────────────────┤
│ CONTENT                  │
│                          │
│ 2-Column Layout          │
│ Grid → 2 columns         │
│                          │
└──────────────────────────┘
```

### Desktop (1024px+)
```
┌────────────────────────────────────────┐
│ HEADER: Logo  [Buttons]                │
├────────────────────────────────────────┤
│ HERO: [Left]          [Right Preview]  │
├────────────────────────────────────────┤
│ ARCHITECTURE: [Flow Diagram]           │
├────────────────────────────────────────┤
│ FEATURES: [Card 1] [Card 2] [Card 3]   │
├────────────────────────────────────────┤
│ [Full Width CTA]                       │
├────────────────────────────────────────┤
│ FOOTER                                 │
└────────────────────────────────────────┘
```

---

## Color Scheme Reference

### Primary Colors
- **Emerald** (#10b981): Primary actions, success, growth
- **Cyan** (#06b6d4): Secondary, data, technology
- **Dark Slate** (#0d121f): Background, text contrast

### Accent Colors
- **Amber** (#f59e0b): Temperature, warmth
- **Rose** (#f43f5e): Alerts, warnings
- **Purple** (#a855f7): Dashboard, premium
- **Blue** (#3b82f6): Water, moisture

### Text Hierarchy
- **White** (#ffffff): Headlines, primary text
- **Slate-400** (#78716c): Body text, secondary
- **Slate-500** (#64748b): Labels, tertiary
- **White/5** (#fffff0 at 5%): Borders, dividers

---

## Animation & Transitions

### Hover Effects
```css
Button hover: background-color transition + shadow glow
Card hover: border-color transition + light background change
Text hover: color transition to brighter shade
```

### Loading & Transitions
```css
Page transition: Smooth fade (CSS opacity)
Icon animations: pulse, ping, spin
Background glows: blur animation
Element float: gentle up-down movement
```

### Interactive Elements
```css
Buttons: 300ms transition duration
Cards: 200ms transition duration
Icons: spin (1.5s rotation), pulse (2s opacity)
Badges: ping (2s scale + opacity)
```

---

## Accessibility Features

### Navigation
- ✅ Semantic HTML structure
- ✅ Clear button labels and CTAs
- ✅ Keyboard-navigable buttons
- ✅ Logical tab order

### Visual
- ✅ High contrast text colors
- ✅ Icon + text button labels
- ✅ Descriptive image alt text
- ✅ Color not sole indicator

### Structure
- ✅ Proper heading hierarchy (H1 → H3)
- ✅ Descriptive link text
- ✅ Form labels and inputs
- ✅ Error messaging

---

## Testing Navigation

### Test Scenarios

1. **Landing Test**
   - [ ] App loads on home page
   - [ ] All buttons visible and clickable
   - [ ] Page title displays correctly

2. **Page Navigation**
   - [ ] Home → Schematic → Home works
   - [ ] Home → Dashboard → (login)
   - [ ] Schematic → Home works
   - [ ] Back button browser support

3. **Responsive Test**
   - [ ] Mobile layout (< 768px)
   - [ ] Tablet layout (768-1023px)
   - [ ] Desktop layout (> 1024px)
   - [ ] Touch-friendly buttons on mobile

4. **Visual Test**
   - [ ] All animations smooth
   - [ ] Images load correctly
   - [ ] Colors render properly
   - [ ] No layout shifts

5. **Functional Test**
   - [ ] Links work correctly
   - [ ] Scrolling smooth
   - [ ] Telemetry preview animates
   - [ ] No console errors

---

## Quick Links for Development

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main routing and page state |
| `src/components/home/HomePage.tsx` | Home page component |
| `src/components/schematic/SchematicPage.tsx` | Schematic page component |
| `src/assets/schematic.svg` | Circuit diagram image |
| `SCHEMATIC_PAGE_GUIDE.md` | Feature documentation |

---

**Last Updated**: June 19, 2026
**Navigation System**: React State-Based (no external router)
**Status**: Production Ready ✅
