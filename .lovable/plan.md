

# Neurora — AI Medical Assistant Dashboard

## Design System
- **Primary palette**: Deep charcoal background (#1A1A2E) with Electric Indigo (#5D3FD3) accents
- **Status colors**: Vitality Mint (#00FFAB) for positive trends, Warning Amber (#FFB800) for risks, Red for emergencies
- **Typography**: Space Grotesk for data/labels, Plus Jakarta Sans for readable patient content (min 16px for summaries)
- **Visual style**: Glassmorphism — frosted glass cards with soft layered shadows, backdrop blur, and a Bento-box grid layout
- **Animations**: Smooth fade/slide page transitions, pulse animations for alerts, neural wave effects, brain-pulse loading indicators

## Page 1: Dashboard (Analysis Canvas)
- **Bento-box grid layout** with glassmorphic cards
- **Medicine Knowledge Engine card**: Displays a stylized medication molecule visualization (CSS/SVG 3D-style) alongside a "Simplified Summary" card with warm, high-readability typography
- **Conflict Shield module**: A glowing, pulsing alert card highlighting drug-drug interactions with severity levels (High Risk = red pulse, Moderate = amber, Safe = mint)
- **Progress Horizon chart**: Fluid organic line chart (Recharts) showing health trends with color-gradient zones for "Stable," "Improved," and "Degraded"
- **Quick stats row**: Key health metrics in small glassmorphic tiles

## Page 2: Prescription Parsing
- **Upload zone** with drag-and-drop for prescription images
- **"Scan-to-Data" animation**: When uploaded, a digital laser-line sweep animates over the image to simulate OCR processing
- **Parsed results card**: Extracted medication names, dosages, and frequencies displayed in clean data cards
- **Brain-pulse loading animation** instead of a standard spinner

## Page 3: Conflict Engine
- **Full conflict detection view** with detailed interaction analysis
- **Screen-dim focus mode**: When a high-risk conflict is detected, the background subtly dims to draw attention to the alert
- **Interaction matrix**: Visual grid showing which drugs interact and severity
- **Safety-first UI** with clear action recommendations

## Page 4: Lab Analytics (Report Analysis)
- **Lab results timeline** with the Progress Horizon chart expanded
- **Trend indicators** with Vitality Mint (improving), amber (watch), red (degraded) color coding
- **Historical comparison cards** showing previous vs. current values
- **AI-generated plain-language insights** in accessible summary cards

## Page 5: Medicine Pricing
- **Price comparison table** with glassmorphic styling
- **"Neurora Choice" badge** highlighting best value (price + delivery balance)
- **Value Badges** on each option showing price tier and availability
- **Pharmacy/delivery info** in clean card format

## Persistent UI Elements

### Neural Core Sidebar
- Semi-transparent frosted glass sidebar with blur effect
- Custom line-art icons (using Lucide + CSS styling) for each section: Dashboard, Prescriptions, Conflict Engine, Lab Analytics, Pricing
- Active route highlighting with Electric Indigo glow
- Collapsible to mini icon-only mode

### SOS Emergency Button
- Persistent floating button in a fixed position
- Default state: visible red emergency button
- Animated color shift when emergency context is detected (simulated)

### "Aura" AI Chatbot
- Floating circular chat bubble in the bottom-right corner
- Neural wave animation on the button (CSS animated sine wave)
- Expandable chat panel with glassmorphic styling
- Message history with typing indicator animation

### Top Header Bar
- Minimal header with sidebar toggle, search, and user avatar
- Notification bell with subtle badge for alerts

