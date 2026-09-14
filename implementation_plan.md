# Implementation Plan: RAZZ MOBILES - Premium Business Website

Create a modern, elegant, fully responsive business website for **RAZZ MOBILES** located in **Kanchipuram, Tamil Nadu, India**, centered on a sophisticated **Lavender & White** visual identity.

---

## 1. Brand & Design System

### Color Palette (Lavender & White)
* **Canvas White**: `#FFFFFF`
* **Soft Lavender Tint (Backgrounds)**: `#F8F6FE` / `#F3F0FF`
* **Subtle Lavender Borders**: `rgba(124, 58, 237, 0.14)`
* **Primary Accent (Vibrant Lavender/Violet)**: `#7C3AED`
* **Deep Purple (Primary CTAs & Footer)**: `#5B21B6` / `#4C1D95`
* **Hover Accent**: `#6D28D9`
* **Dark Charcoal Text**: `#1E1B4B` (Headings) and `#334155` (Body text)
* **Card Glow & Shadow**: `0 10px 30px -5px rgba(124, 58, 237, 0.08), 0 4px 12px -2px rgba(124, 58, 237, 0.04)`
* *Strict exclusion of black and orange as instructed.*

### Typography & Icons
* **Typography**: Google Fonts `Plus Jakarta Sans` (headings) and `Inter` (body copy) for a high-end, clean tech appearance.
* **Icons**: Inline scalable Lucide / Feather SVG icons with soft lavender fills and purple strokes.

---

## 2. Proposed Architecture & File Structure

```
Razz Mobiles/
├── index.html              # Comprehensive single-page modern website with modular sections
├── css/
│   ├── style.css           # Core styling, variables, layout, animations, responsive rules
│   └── components.css      # Badges, cards, modals, filter pills, toast alerts, buttons
├── js/
│   ├── app.js              # State management, search/filter logic, modal logic, booking submission
│   └── data.js             # Rich product inventory (Smartphones, Accessories, Services, Reviews)
└── assets/
    ├── images/             # Generated & curated realistic imagery (smartphones, repair, shop)
    └── icons/              # SVG assets
```

---

## 3. Detailed Sections & Features

1. **Sticky Header & Mobile Navigation**:
   * Brand Logo: "RAZZ MOBILES" with subtle purple glow badge.
   * Navigation items: Home, Mobiles, Accessories, Services, About, Reviews, Contact.
   * Primary CTA: "Book Service" button with smooth scroll to booking section.
   * Mobile Hamburger drawer with quick call and WhatsApp actions.

2. **Hero Section**:
   * Headline: **RAZZ MOBILES** — *“Your Trusted Mobile Store & Service Center in Kanchipuram”*.
   * Description: “Discover the latest smartphones, quality accessories, and reliable mobile repair services — all under one roof.”
   * CTAs: "Explore Mobiles", "Book a Service", "WhatsApp Us".
   * Trust badges: "10,000+ Happy Customers", "15+ Years in Kanchipuram", "100% Genuine Spares", "Quick 30-Min Service".
   * High-resolution realistic visual showcase of premium smartphones & repair workbench.

3. **Latest Smartphones (Interactive Catalog)**:
   * Real-time search bar ("Search mobile phones...").
   * Filter pills: Brand (Apple, Samsung, OnePlus, Vivo, Oppo, Xiaomi, Realme, Motorola, Nothing), Condition (All, Brand New, Certified Used), RAM, Storage, and Price sorting.
   * Product cards with specs: RAM, Storage, Display, Camera, Battery, Indicative Price, Availability badge, "View Details" (modal), "Enquire on WhatsApp" (prefilled dynamic message).
   * Detailed phone modal showing complete specifications, warranty, exchange options, and direct WhatsApp quote trigger.

4. **Mobile Accessories**:
   * Categories: Phone Cases, Tempered Glass, Chargers, USB Cables, Power Banks, Earphones, Bluetooth Speakers, Smart Watches, Car Chargers, Mobile Stands.
   * Category filter pills with smooth card filtering.
   * Card with image, warranty badge, price quote, and WhatsApp enquiry button.

5. **Mobile Service & Repair**:
   * 8 core services: Screen Replacement, Battery Replacement, Charging Port Repair, Speaker & Mic Repair, Camera Repair, Software Service, Water Damage Inspection, General Mobile Repair.
   * Service detail modal and "Book Service" button that instantly pre-selects the service in the booking form.

6. **Book a Service (Interactive Form)**:
   * Fields: Customer Name, Mobile Number (with Indian 10-digit validation), Mobile Brand, Mobile Model, Select Service, Problem Description, Preferred Date, Preferred Time, Upload Device Image preview.
   * Real-time field validation, smooth interactive submission, and a success confirmation modal with direct WhatsApp notification shortcut to the shop.

7. **Why Choose Razz Mobiles?**:
   * 5 feature cards: Quality Products, Experienced Service, Transparent Pricing, Fast Service, Customer Satisfaction with minimal lavender line icons.

8. **About Razz Mobiles**:
   * Authentic local store story in Kanchipuram, heritage, service commitment, realistic shop interior & technician photography, key achievement stats.

9. **Customer Reviews**:
   * 5-star ratings, testimonials from verified local Kanchipuram customers, review filter/pagination, and "Write a Review" interactive modal.

10. **Kanchipuram Location & Contact Section**:
    * Address card (configurable Gandhi Road / Railway Station Road, Kanchipuram, Tamil Nadu).
    * Operating Hours: Mon-Sat 9:30 AM - 9:30 PM, Sun 10:00 AM - 8:00 PM.
    * Interactive Google Map embed card styled in soft lavender borders.
    * One-tap actions: "Get Directions", "Call Now", "WhatsApp".
    * Quick Contact form for general inquiries.

11. **Floating WhatsApp & Quick Action Bar**:
    * Floating WhatsApp button at bottom-right with pulsating lavender ring.
    * Mobile sticky action bar with Call & WhatsApp shortcuts for high conversion.

12. **Footer**:
    * Deep lavender/purple footer (`#4C1D95`) with white text, brand info, sitemap links, social icons, and copyright notice.

---

## 4. Verification Plan

### Automated & Browser Verification
- Start a local HTTP server and run browser tests using `browser_subagent`.
- Verify:
  1. Desktop (1920x1080) & Mobile (390x844 iPhone / 412x915 Android) responsive rendering.
  2. Search bar and brand filter interactions on smartphones.
  3. Accessory category filter switching.
  4. Service card "Book This Service" pre-filling the booking form.
  5. Booking form validation and submission flow with success dialog.
  6. WhatsApp enquiry links generating correct `https://wa.me/` URLs with encoded parameters.
  7. Mobile navigation drawer open/close.
  8. Color theme adherence (lavender & white, no black or orange).
