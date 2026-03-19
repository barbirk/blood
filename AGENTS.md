# Blood Adventure Academy / Académie de l'Aventure Sanguine

## Project Overview

Blood Adventure Academy is an interactive educational web application designed to teach children about blood biology, blood types, and transfusion compatibility through gamified learning experiences.

The application is fully bilingual (English and French) and features a single-page architecture with 12 interactive modules (chapters) that progressively teach blood science concepts.

**Project Type:** Static Single-Page Web Application  
**Primary Language:** English (with full French translation)  
**Target Audience:** Children learning about blood science  
**Deployment:** Static HTML file - can be served by any web server

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Pure HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Styling | Inline CSS (all styles embedded in HTML) |
| External Dependencies | Google Fonts (Nunito font family) |
| Build System | None - pure static file |
| Package Manager | None |

**Note:** This is a zero-dependency project with no build step required. The entire application is contained in a single HTML file.

---

## Project Structure

```
/
├── index.html          # Complete application (HTML, CSS, JS all-in-one)
└── AGENTS.md           # This documentation file
```

The project intentionally uses a single-file architecture for:
- Simple deployment (any static web server)
- No build dependencies or toolchain maintenance
- Easy offline usage
- Direct browser execution without bundling

---

## Architecture

### Single-File Organization

The `index.html` file is organized into three main sections:

1. **`<head>` - Styles (Lines 7-579)**
   - CSS custom properties (variables) for theming
   - Responsive design with mobile breakpoints
   - Animation keyframes
   - Component styles (cards, buttons, modals, etc.)

2. **`<body>` - HTML Structure (Lines 581-1244)**
   - Language switcher component
   - Achievement popup system
   - Certificate modal
   - Welcome modal (player onboarding)
   - Dashboard with progress tracking
   - Navigation menu (12 chapter buttons)
   - 12 module sections (each representing a learning chapter)

3. **`<script>` - JavaScript Logic (Lines 1245-1647)**
   - Game state management
   - Language switching
   - Progress tracking
   - 12 interactive module implementations
   - Blood compatibility algorithms

### Core Game Systems

#### State Management
```javascript
// Global game state (line 1246-1254)
- currentLang: 'en' | 'fr'
- currentSection: number (0-11)
- playerName: string
- playerAvatar: emoji string
- progress: number (0-100)
- stars: number (player score)
- badges: number (achievements count)
- sectionsCompleted: Set<number>
```

#### Localization System
- Uses `data-en` and `data-fr` attributes on HTML elements
- `setLanguage()` function switches text content based on selected language
- All user-facing text has bilingual support

#### Progress System
- 12 sections total, each contributes ~8.3% to progress
- Progress bar updates as sections are visited
- Certificate shown when all 12 sections completed

---

## Module/Chapter Breakdown

| # | Module ID | English Title | French Title | Game Type |
|---|-----------|---------------|--------------|-----------|
| 1 | section-0 | The City of Blood | La Ville du Sang | Memory cards, click-to-reveal |
| 2 | section-1 | Microscope Explorer | Explorateur | Interactive blood drop visualization |
| 3 | section-2 | Emergency Response | Intervention | Drag-and-drop matching |
| 4 | section-3 | Blood Type Passports | Passeports | Clickable information cards |
| 5 | section-4 | The Matching Game | Le Jeu d'Assortiment | Key-lock compatibility game |
| 6 | section-5 | The Rules of Compatibility | Les Règles de Compatibilité | Reference table display |
| 7 | section-6 | The Compatibility Lab | Le Labo de Compatibilité | Two-selector test simulation |
| 8 | section-7 | Quiz Challenge | Défi Quiz | True/False quiz with rotation |
| 9 | section-8 | Hospital Emergency | Urgence à l'Hôpital | Doctor simulation game |
| 10 | section-9 | The Blood Factory | L'Usine à Sang | Information cards |
| 11 | section-10 | Genetics & Inheritance | Génétique et Hérédité | Parent blood type predictor |
| 12 | section-11 | Final Challenge | Défi Final | Multi-patient emergency simulation |

---

## Key Functions Reference

### Navigation & UI
- `showSection(index)` - Switches between modules
- `setLanguage(lang)` - Toggles between English/French
- `startGame()` - Initializes player from welcome modal
- `selectAvatar(el, avatar)` - Sets player avatar
- `showAchievement(name)` - Displays achievement popup
- `showCertificate()` - Shows completion certificate

### Game Logic
- `isCompatible(donor, recipient)` - Core blood type compatibility algorithm (lines 1436-1446)
- `getPossibleTypes(p1, p2)` - Genetic inheritance calculator (lines 1560-1568)
- `checkMatch(donor, patient, btn)` - Validates donor-patient match
- `testMix()` - Lab simulation for blood mixing
- `calculateInheritance()` - Predicts child's blood type from parents

### Module Initializers
- `initMemoryGame()` - Module 1: Memory game setup
- `initBloodDrop()` - Module 2: Animated blood cell visualization
- `initKeysGame()` - Module 5: Key-lock matching game
- `initHospital()` - Module 9: Doctor game setup
- `initFinalChallenge()` - Module 12: Final challenge setup

---

## Blood Type Compatibility Rules

The application implements standard ABO/Rh blood typing rules:

### Compatibility Algorithm (from line 1436)
```javascript
function isCompatible(donor, recipient) {
    // Extract ABO group and Rh factor
    const dGroup = donor.replace(/[+-]/, '');    // A, B, AB, or O
    const dRh = donor.includes('+') ? '+' : '-';
    const rGroup = recipient.replace(/[+-]/, '');
    const rRh = recipient.includes('+') ? '+' : '-';
    
    // Rh rule: Rh- can only receive from Rh-
    if (rRh === '-' && dRh === '+') return false;
    
    // O is universal donor
    if (dGroup === 'O') return true;
    
    // AB is universal recipient
    if (rGroup === 'AB') return true;
    
    // Same group is compatible
    return dGroup === rGroup;
}
```

### Key Rules for Development
1. **O-negative** is the universal donor (can give to anyone)
2. **AB-positive** is the universal recipient (can receive from anyone)
3. **Rh-negative** recipients can only receive from Rh-negative donors
4. **Rh-positive** recipients can receive from both Rh+ and Rh-

---

## Development Guidelines

### Code Style
- **JavaScript:** ES6+ syntax (arrow functions, const/let, template literals)
- **CSS:** BEM-like naming with kebab-case (e.g., `.card-detail`, `.lang-switcher`)
- **HTML:** Semantic structure with data attributes for localization

### Adding New Content

#### Adding a New Module
1. Add new button to `.nav-menu` section (line 671-720)
2. Create new `.section` div with unique `id="section-N"`
3. Add module initialization to `showSection()` override (line 1641-1646)
4. Update `sectionsCompleted` size reference from 12 to 13 (line 1295)

#### Adding New Translations
1. Add `data-en` and `data-fr` attributes to new elements
2. Follow existing pattern: `<span data-en="English" data-fr="Français"></span>`

#### Adding New Quiz Questions
Add to `quizData` array (line 1476-1482):
```javascript
{ q: { en: "English question?", fr: "Question française?" }, a: true/false }
```

---

## Testing

### Manual Testing Checklist

1. **Language Toggle:** Click both EN/FR buttons - all text should switch
2. **Welcome Flow:** Enter name, select avatar, verify dashboard updates
3. **Progress Tracking:** Visit all 12 sections, verify progress bar fills
4. **Certificate:** Complete all sections, verify certificate displays with correct name
5. **Blood Compatibility:** Test various donor/recipient combinations
6. **Quiz:** Verify questions rotate and scoring works
7. **Drag-and-Drop:** Module 3 drag items should highlight drop zones
8. **Mobile Responsive:** Test on viewport < 768px

### Browser Compatibility
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## Deployment

### No Build Required
Simply serve the `index.html` file with any static web server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000

# Ruby
ruby -run -ehttpd . -p8000
```

### Hosting Options
- GitHub Pages
- Netlify Drop
- Vercel
- Any CDN
- Local file:// (limited functionality due to CORS)

---

## Security Considerations

1. **XSS Prevention:** All user input (player name) is displayed via `textContent`, not `innerHTML`
2. **No External Data:** Application is self-contained with no API calls
3. **No Cookies/Storage:** Game state is in-memory only (refreshes reset progress)

---

## Educational Content Accuracy

The blood type information is based on established medical knowledge:
- ABO blood group system
- Rh factor system
- Transfusion compatibility rules
- Genetic inheritance patterns (simplified Mendelian model)

**Note:** The inheritance calculator uses simplified genetics for educational purposes and does not account for rare subtypes or Bombay phenotype.
