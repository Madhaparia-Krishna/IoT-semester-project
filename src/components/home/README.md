# Home & Navigation System

## Directory Structure

```
src/components/
├── home/
│   ├── HomePage.tsx          # Main landing page component
│   └── README.md            # This file
├── schematic/
│   ├── SchematicPage.tsx    # Circuit schematic & documentation
│   └── README.md            # Schematic documentation
├── landing/
│   └── LandingPage.tsx      # [DEPRECATED - Replaced by HomePage]
└── ...
```

## Component Details

### HomePage Component

**Purpose**: Serves as the main entry point for unauthenticated users. Displays system overview, features, and navigation options.

**Props**:
```typescript
interface HomePageProps {
  onNavigate: (page: 'schematic' | 'auth') => void;
}
```

**Navigation Options**:
- "View Schematic" → Routes to SchematicPage
- "Launch Dashboard" → Routes to AuthManager (login screen)
- "Explore Architecture" → Smooth scroll to architecture section

**Key Sections**:
1. **Navigation Bar**: Logo + navigation buttons
2. **Hero Section**: Main value proposition with live telemetry preview
3. **System Architecture**: Visual flow diagram showing data pipeline
4. **Features Grid**: Key capabilities (Moisture monitoring, Thermal stability, Alerts)
5. **Integration CTA**: Call-to-action for dashboard access
6. **Footer**: Links and copyright information

### SchematicPage Component

**Purpose**: Provides comprehensive technical documentation of the circuit design and hardware architecture.

**Props**:
```typescript
interface SchematicPageProps {
  onNavigate: (page: 'home' | 'schematic') => void;
}
```

**Navigation**: Back button + logo click returns to HomePage

**Key Sections**:
1. **Circuit Schematic Image**: High-resolution SVG diagram
2. **System Components**: Detailed cards for each hardware component
3. **Circuit Operation Flow**: Step-by-step data flow explanation
4. **Power Distribution**: Voltage rails and connector information
5. **Design Considerations**: Best practices and deployment tips
6. **Call-to-Action**: Link back to home or to dashboard

## App-Level Navigation

The main routing logic is in `src/App.tsx`:

```typescript
type PageType = 'home' | 'schematic' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  // ...
  
  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={...} />}
      {currentPage === 'schematic' && <SchematicPage onNavigate={...} />}
      {currentPage === 'dashboard' && <AuthManager />}
      <ToastContainer />
    </>
  );
}
```

## Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    HOME PAGE                         │
│  - Hero section with live telemetry preview         │
│  - System architecture overview                      │
│  - Feature highlights                                │
│  - CTA buttons                                       │
└────────┬────────────────────────┬───────────────────┘
         │                        │
    [View Schematic]         [Launch Dashboard]
         │                        │
         ▼                        ▼
┌──────────────────────┐   ┌──────────────────┐
│  SCHEMATIC PAGE      │   │  AUTH MANAGER    │
│                      │   │  (Login Screen)  │
│  - Circuit diagram   │   │                  │
│  - Component details │   │  - Login form    │
│  - Operation flow    │   │  - Registration  │
│  - Best practices    │   └──────────────────┘
│                      │         │
│  [Return to Home]◄───┤    [Authenticated]
└──────────────────────┘         │
                                 ▼
                        ┌──────────────────────┐
                        │ DASHBOARD (DashLayout)
                        │                      │
                        │ - Sensor readings    │
                        │ - Analytics charts   │
                        │ - Alert management   │
                        └──────────────────────┘
```

## Styling & Design

### CSS Classes Used
- **Layout**: Tailwind grid, flex, max-w-7xl
- **Colors**: Emerald (#10b981), Cyan (#06b6d4), Amber, Rose
- **Effects**: Backdrop blur, glass morphism, gradient backgrounds
- **Animations**: Fade, pulse, ping, float animations

### Custom Components
- `Logo`: Brand logo component
- `GlassCard`: Glass-morphism card wrapper
- `StatusBadge`: Status indicator badge
- `ToastContainer`: Notification system

### Responsive Breakpoints
- **Mobile**: Base styles (full width)
- **Tablet**: `md:` breakpoints (768px+)
- **Desktop**: `lg:` breakpoints (1024px+)

## Data Flow

### HomePage
```
Component Mount
    ↓
Initialize telemetry simulation state
    ↓
Render static content + dynamic values
    ↓
User clicks navigation button
    ↓
Call onNavigate() callback
    ↓
Parent App updates currentPage state
```

### SchematicPage
```
Component Mount
    ↓
Load and render schematic SVG image
    ↓
Display component documentation
    ↓
User navigates back
    ↓
Call onNavigate('home')
    ↓
Return to HomePage
```

## Update Process

To modify any section:

1. **Update HomePage content**:
   - Edit `src/components/home/HomePage.tsx`
   - Modify text, add/remove sections, adjust styling
   - Run `npm run build` to verify changes

2. **Update Schematic Page**:
   - Edit `src/components/schematic/SchematicPage.tsx`
   - Replace schematic image: `src/assets/schematic.svg`
   - Add/update component descriptions

3. **Change Navigation Routes**:
   - Modify `PageType` union type in `App.tsx`
   - Update routing logic in App component
   - Update props and callback functions

## Integration Notes

### Removed/Deprecated
- `LandingPage.tsx` is no longer used but kept for reference
- All landing page functionality moved to `HomePage.tsx`

### Imports to Update
- If creating new pages, import from `./components/home/HomePage`
- Use consistent naming: `HomePage`, `SchematicPage`, etc.

### Dependencies
- React 19
- Lucide React icons
- Tailwind CSS
- No additional routing libraries (simple state-based routing)

## Testing Checklist

- [ ] HomePage renders without errors
- [ ] SchematicPage renders without errors
- [ ] Navigation buttons work (Home → Schematic → Home)
- [ ] Navigation buttons work (Home → Auth → Dashboard)
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Schematic SVG displays correctly
- [ ] All links and buttons are clickable
- [ ] Animations smooth and performant
- [ ] Build completes successfully

## Performance Notes

- Schematic SVG is 599.51 kB (gzipped: 57.85 kB)
- Total JS bundle: 1,417.56 kB (gzipped: 366.56 kB)
- Consider lazy loading if bundle size becomes an issue
- All animations use CSS for optimal performance

---

For questions or issues, refer to the main `SCHEMATIC_PAGE_GUIDE.md` documentation.
