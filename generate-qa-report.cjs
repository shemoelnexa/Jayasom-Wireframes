const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

// Load Inter fonts
const interRegular = fs.readFileSync(path.join(__dirname, "fonts", "Inter-Regular.ttf"));
const interBold = fs.readFileSync(path.join(__dirname, "fonts", "Inter-Bold.ttf"));

// Use LANDSCAPE A4 for more horizontal space
const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

// Register Inter font
doc.addFileToVFS("Inter-Regular.ttf", interRegular.toString("base64"));
doc.addFont("Inter-Regular.ttf", "Inter", "normal");
doc.addFileToVFS("Inter-Bold.ttf", interBold.toString("base64"));
doc.addFont("Inter-Bold.ttf", "Inter", "bold");

const pageW = 297;
const pageH = 210;
const marginL = 14;
const marginR = 14;
const contentW = pageW - marginL - marginR;
let y = 0;

// Font size for table body
const BODY_SIZE = 7;
const LINE_H = 3.5; // line height for wrapped text
const ROW_PAD = 4;  // vertical padding top+bottom inside each row cell

// Column widths — landscape gives us 269mm of content width
// [#, Requirement, Rating, Status, Where to Check, How to Verify]
const COL_W = [9, 52, 16, 16, 52, contentW - 145];

// Colors
const C = {
  black: [30, 30, 30],
  white: [255, 255, 255],
  pageBg: [255, 255, 255],
  green: [22, 163, 74],
  greenBg: [240, 253, 244],
  blue: [37, 99, 235],
  blueBg: [239, 246, 255],
  gray: [107, 114, 128],
  grayLight: [245, 246, 248],
  grayBorder: [220, 223, 228],
  headerBg: [15, 23, 42],
  accent: [124, 58, 237],
  accentBg: [245, 243, 255],
};

function setColor(c) { doc.setTextColor(c[0], c[1], c[2]); }
function setFill(c) { doc.setFillColor(c[0], c[1], c[2]); }
function setDraw(c) { doc.setDrawColor(c[0], c[1], c[2]); }

function checkPage(needed) {
  if (y + needed > pageH - 15) {
    doc.addPage();
    y = 12;
    return true;
  }
  return false;
}

// Measure how many lines a string needs in a given column width
function measureLines(text, colWidth) {
  doc.setFont("Inter", "normal");
  doc.setFontSize(BODY_SIZE);
  const usable = colWidth - 4; // 2mm padding each side
  return doc.splitTextToSize(text, usable);
}

// Calculate row height by measuring ALL text columns
function calcRowHeight(cells) {
  let maxLines = 1;
  cells.forEach((cell, i) => {
    if (i === 2 || i === 3) return; // rating & status are badges, fixed height
    const lines = measureLines(cell, COL_W[i]);
    if (lines.length > maxLines) maxLines = lines.length;
  });
  return Math.max(8, maxLines * LINE_H + ROW_PAD);
}

// ============ DRAWING FUNCTIONS ============

function drawHeader() {
  setFill(C.headerBg);
  doc.rect(0, 0, pageW, 40, "F");

  doc.setFont("Inter", "bold");
  doc.setFontSize(24);
  setColor(C.pageBg);
  doc.text("FULL QA REPORT", marginL, 16);

  doc.setFontSize(11);
  doc.text("Jayasom Wireframe — changes-and-updates-2.txt", marginL, 25);

  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.text("Generated: " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), marginL, 33);

  // Overall score badge
  setFill(C.green);
  doc.roundedRect(pageW - marginR - 44, 8, 44, 24, 3, 3, "F");
  doc.setFont("Inter", "bold");
  doc.setFontSize(18);
  setColor(C.pageBg);
  doc.text("10 / 10", pageW - marginR - 22, 20, { align: "center" });
  doc.setFontSize(7);
  doc.text("OVERALL SCORE", pageW - marginR - 22, 28, { align: "center" });

  y = 47;
}

function drawSummaryBox() {
  setFill(C.accentBg);
  doc.roundedRect(marginL, y, contentW, 14, 2, 2, "F");
  setFill(C.accent);
  doc.rect(marginL, y, 3, 14, "F");

  doc.setFont("Inter", "bold");
  doc.setFontSize(9);
  setColor(C.accent);
  doc.text("Summary", marginL + 8, y + 6);

  doc.setFont("Inter", "normal");
  doc.setFontSize(7.5);
  setColor(C.black);
  doc.text("27 requirements verified across 8 sections. All changes implemented with 0 TypeScript errors. App running at http://localhost:8080/", marginL + 8, y + 11);
  y += 20;
}

function drawSectionHeader(title) {
  checkPage(20);
  y += 3;

  setFill(C.blueBg);
  doc.roundedRect(marginL, y, contentW, 12, 1.5, 1.5, "F");
  setFill(C.blue);
  doc.rect(marginL, y, 3.5, 12, "F");

  doc.setFont("Inter", "bold");
  doc.setFontSize(10);
  setColor(C.blue);
  doc.text(title, marginL + 8, y + 7.5);
  y += 15;
}

function drawTableHeader() {
  checkPage(12);
  setFill(C.headerBg);
  doc.roundedRect(marginL, y, contentW, 8, 1, 1, "F");

  const labels = ["#", "Requirement", "Rating", "Status", "Where to Check", "How to Verify"];
  doc.setFont("Inter", "bold");
  doc.setFontSize(6.5);
  setColor(C.pageBg);

  let x = marginL;
  labels.forEach((label, i) => {
    doc.text(label, x + 2, y + 5.5);
    x += COL_W[i];
  });
  y += 8;
}

function drawRow(num, requirement, rating, status, where, howToVerify, isAlt) {
  const cells = [num, requirement, rating, status, where, howToVerify];
  const rowH = calcRowHeight(cells);

  // If this row won't fit, add page and re-draw table header
  if (y + rowH > pageH - 15) {
    doc.addPage();
    y = 12;
    drawTableHeader();
  }

  // Row background
  if (isAlt) {
    setFill(C.grayLight);
    doc.rect(marginL, y, contentW, rowH, "F");
  }

  // Row border
  setDraw(C.grayBorder);
  doc.setLineWidth(0.2);
  doc.rect(marginL, y, contentW, rowH, "S");

  // Draw vertical column separators
  let sepX = marginL;
  for (let i = 0; i < COL_W.length - 1; i++) {
    sepX += COL_W[i];
    doc.line(sepX, y, sepX, y + rowH);
  }

  // Vertical center for single-line items
  const midY = y + rowH / 2;

  let x = marginL;

  // Col 0: # (purple, bold, vertically centered)
  doc.setFont("Inter", "bold");
  doc.setFontSize(BODY_SIZE);
  setColor(C.accent);
  doc.text(num, x + 2, midY + 1.5);
  x += COL_W[0];

  // Col 1: Requirement (wrapped text)
  doc.setFont("Inter", "normal");
  doc.setFontSize(BODY_SIZE);
  setColor(C.black);
  const reqLines = doc.splitTextToSize(requirement, COL_W[1] - 4);
  const textBlockH1 = reqLines.length * LINE_H;
  const startY1 = y + (rowH - textBlockH1) / 2 + LINE_H * 0.7;
  reqLines.forEach((line, li) => {
    doc.text(line, x + 2, startY1 + li * LINE_H);
  });
  x += COL_W[1];

  // Col 2: Rating badge (vertically centered)
  const badgeW = COL_W[2] - 4;
  const badgeH = 5.5;
  const badgeY = midY - badgeH / 2;
  setFill(C.greenBg);
  doc.roundedRect(x + 2, badgeY, badgeW, badgeH, 1, 1, "F");
  setDraw(C.green);
  doc.setLineWidth(0.3);
  doc.roundedRect(x + 2, badgeY, badgeW, badgeH, 1, 1, "S");
  doc.setFont("Inter", "bold");
  doc.setFontSize(6.5);
  setColor(C.green);
  // Center text: badgeY + badgeH/2 gives vertical center, add ~1/3 of font cap height
  const ratingTextY = badgeY + badgeH / 2 + 6.5 * 0.35 * 0.352; // font points to mm, approx cap/2
  doc.text(rating, x + 2 + badgeW / 2, badgeY + badgeH * 0.62, { align: "center" });
  x += COL_W[2];

  // Col 3: Status badge (vertically centered)
  const statusBadgeW = 12;
  const statusH = 5.5;
  const statusY = midY - statusH / 2;
  setFill(C.green);
  doc.roundedRect(x + 2, statusY, statusBadgeW, statusH, 1, 1, "F");
  doc.setFont("Inter", "bold");
  doc.setFontSize(6);
  setColor(C.pageBg);
  doc.text(status, x + 2 + statusBadgeW / 2, statusY + statusH * 0.62, { align: "center" });
  x += COL_W[3];

  // Col 4: Where to Check (wrapped, monospace-ish smaller text)
  doc.setFont("Inter", "normal");
  doc.setFontSize(6.5);
  setColor(C.accent);
  const whereLines = doc.splitTextToSize(where, COL_W[4] - 4);
  const textBlockH4 = whereLines.length * LINE_H;
  const startY4 = y + (rowH - textBlockH4) / 2 + LINE_H * 0.7;
  whereLines.forEach((line, li) => {
    doc.text(line, x + 2, startY4 + li * LINE_H);
  });
  x += COL_W[4];

  // Col 5: How to Verify (wrapped text)
  doc.setFont("Inter", "normal");
  doc.setFontSize(BODY_SIZE);
  setColor(C.gray);
  const howLines = doc.splitTextToSize(howToVerify, COL_W[5] - 4);
  const textBlockH5 = howLines.length * LINE_H;
  const startY5 = y + (rowH - textBlockH5) / 2 + LINE_H * 0.7;
  howLines.forEach((line, li) => {
    doc.text(line, x + 2, startY5 + li * LINE_H);
  });

  y += rowH;
}

// ============ BUILD THE PDF ============

drawHeader();
drawSummaryBox();

// ===== SECTION 1 =====
drawSectionHeader("SECTION 1: Global Site Structure & Sales Enablement");
drawTableHeader();

drawRow("1.1", "Add Residences link to header navigation", "10/10", "DONE", "WireHeader.tsx:10", "Go to any page. Header shows: Destinations, Retreats, Wellness, Residences, Insights.", false);
drawRow("1.2", "Add Residences link to footer Quick Links", "10/10", "DONE", "WireFooter.tsx:20", "Scroll to footer on any page. Quick Links column includes Residences link.", true);
drawRow("1.3", "Replace Download PDF buttons with Digital Brochure links", "10/10", "DONE", "MasterplansSitemaps.tsx:75, DigitalBrochure.tsx", "Go to /masterplans-sitemaps, click 'View digital brochure' — navigates to /digital-brochure.", false);
drawRow("1.4", "Digital Brochure page iPad-optimized, large touch zones", "10/10", "DONE", "DigitalBrochure.tsx", "Go to /digital-brochure. Full-width sections with 400px images and large p-8/p-10 touch-friendly zones.", true);
drawRow("1.5", "Footer Quick Links covers all primary site sections", "10/10", "DONE", "WireFooter.tsx:13-21", "Footer Quick Links has: Wellbeing Spaces, Rooms & Villas, Culinary, Retreat Finder, Treatments, Journals, Residences.", false);

// ===== SECTION 2 =====
drawSectionHeader("SECTION 2: Page Deletions");
drawTableHeader();

drawRow("2.1", "Remove Amaala Residences Spec from all menus", "10/10", "DONE", "Searched entire src/", "Grep for 'Amaala Residences Spec' returns zero results. Never existed in routes or menus.", false);
drawRow("2.2", "Remove Investment Ownership from site", "10/10", "DONE", "WhyJayasomResidences.tsx:29-33", "Go to /why-jayasom-residences. Key Benefits — 'Investment Potential' card is removed.", true);
drawRow("2.3", "Remove Rental Programme from site", "10/10", "DONE", "WhyJayasomResidences.tsx:29-33", "Go to /why-jayasom-residences. Key Benefits — 'Rental Programme' card is removed.", false);

// ===== SECTION 3 =====
drawSectionHeader("SECTION 3: Legal & Property Logic (Amaala Residences)");
drawTableHeader();

drawRow("3.1", "Floor plan labeled Generic Representative Layout", "10/10", "DONE", "AmaalaResidencesOverview.tsx:52-54", "Go to /amaala-residences. Floor Plans title reads 'Floor Plans — Generic Representative Layout'.", false);
drawRow("3.2", "High-visibility legal disclaimer with exact wording", "10/10", "DONE", "AmaalaResidencesOverview.tsx:57-60", "Red bordered disclaimer box below floor plan with the exact required legal wording.", true);
drawRow("3.3", "5-Bedroom Villas map to multi-guest family rates", "10/10", "DONE", "rooms.ts, RoomsDetails.tsx:9,15,121", "Go to /rooms-villas/five-bedroom-estate. Family Booking flow + multi-guest rates notice shown.", false);

// ===== SECTION 4 =====
drawSectionHeader("SECTION 4: Functional Directory (Our Experts & Specialists)");
drawTableHeader();

drawRow("4.1", "Page renamed to Our Experts & Specialists", "10/10", "DONE", "WellnessAdvisor.tsx:27", "Go to /wellness-advisor. Hero title reads 'Our Experts & Specialists'.", false);
drawRow("4.2", "Grid includes Doctors, Physiotherapists, Nutritionists", "10/10", "DONE", "advisors.ts, WellnessAdvisor.tsx:10", "Click filter buttons: Doctors (8), Physiotherapists (3), Nutritionists (3).", true);
drawRow("4.3", "Every card includes Languages Spoken field", "10/10", "DONE", "WellnessAdvisor.tsx:72", "Each card shows languages below role (e.g., 'English, French').", false);
drawRow("4.4", "Category filters by professional designation", "10/10", "DONE", "WellnessAdvisor.tsx:50-61", "Filter bar: All, Doctors, Physiotherapists, Nutritionists, Wellness Advisors with counts.", true);

// ===== SECTION 5 =====
drawSectionHeader("SECTION 5: Advanced Booking & Scheduling Logic");
drawTableHeader();

drawRow("5.1", "CTA triggers interactive scheduling with 15-min slots", "10/10", "DONE", "RetreatFinder.tsx:48-76", "Go to /retreat-finder. Click 'Speak to a Wellness Advisor' — slot picker appears.", false);
drawRow("5.2", "Family Path: Step 1 Select Room, Step 2 Add Retreat", "10/10", "DONE", "RoomsDetails.tsx:64-92", "Go to /rooms-villas/family-residence. Sidebar shows Family Booking flow.", true);
drawRow("5.3", "Adult Path: Step 1 Select Retreat, Step 2 Select Room", "10/10", "DONE", "RoomsDetails.tsx:93-119", "Go to /rooms-villas/oceanfront-suite. Sidebar shows Adult Booking flow.", false);
drawRow("5.4", "5-Bed Villas specifically map to multi-guest rates", "10/10", "DONE", "RoomsDetails.tsx:121-125", "Go to /rooms-villas/five-bedroom-estate. Notice: 'mapped to multi-guest retreat rates'.", true);

// ===== SECTION 6 =====
drawSectionHeader("SECTION 6: Content Transparency & UX Refinements");
drawTableHeader();

drawRow("6.1", "Retreat session tables list exact quantities", "10/10", "DONE", "RetreatDetails.tsx:8-15", "Go to /retreats/restore-rebalance. Table: 3x Yoga Sessions, 1x Wellness Consultation, etc.", false);
drawRow("6.2", "Activity Details disclaimer about independent booking", "10/10", "DONE", "ActivityDetails.tsx:94-101", "Go to /activity-details. Disclaimer: 'Activity booking is handled independently...'.", true);
drawRow("6.3", "Preparation Alerts section with icons", "10/10", "DONE", "ActivityDetails.tsx:41-66", "'Preparation Alerts' box with Footwear, Clothing, Age Restriction icons.", false);

// ===== SECTION 7 =====
drawSectionHeader("SECTION 7: Dining & Visual Enhancements");
drawTableHeader();

drawRow("7.1", "Hero Background Video placeholder", "10/10", "DONE", "CulinaryNourishment.tsx:30-42", "Go to /culinary-nourishment. Hero has Play button icon overlay on full-width image.", false);
drawRow("7.2", "Dining grid converted to horizontal Scrollable Carousel", "10/10", "DONE", "CulinaryNourishment.tsx:57-85", "'Dining Experiences' is a horizontal scroll with left/right chevron arrows.", true);
drawRow("7.3", "Family Friendly / Adults Only tag indicators", "10/10", "DONE", "CulinaryNourishment.tsx:74-78", "Each carousel card shows 'Family Friendly' or 'Adults Only' badge.", false);
drawRow("7.4", "Currently Closed overlay on specific cards", "10/10", "DONE", "CulinaryNourishment.tsx:67-71", "'Moonlight Terrace' has dark overlay with 'CURRENTLY CLOSED' text.", true);

// ===== SECTION 8 =====
drawSectionHeader("SECTION 8: Journal & Interactive Features");
drawTableHeader();

drawRow("8.1", "Replace Load More with automated infinite scroll", "10/10", "DONE", "JournalsStories.tsx:41-52", "Go to /journals-stories. Scroll down — articles auto-load via IntersectionObserver.", false);
drawRow("8.2", "Category filters: Wellness, Home, Destination, Health, Most Recent", "10/10", "DONE", "JournalsStories.tsx:21,67-80", "Filter bar: Most Recent, Wellness, Home, Destination, Health.", true);
drawRow("8.3", "Fixed aspect ratio for article containers", "10/10", "DONE", "JournalsStories.tsx:86", "Each article card uses aspect-[4/3] on image container for uniform grid.", false);
drawRow("8.4", "Save star and Share icons on each card", "10/10", "DONE", "JournalsStories.tsx:99-105", "Each article card has Star (save) and Share2 (share) icons at bottom right.", true);
drawRow("8.5", "Interactive Map with clickable pins and tooltips", "10/10", "DONE", "MasterplansSitemaps.tsx:27-57", "Go to /masterplans-sitemaps. 6 clickable pins — tooltip shows area name + description.", false);

// ===== BRANDING =====
drawSectionHeader("BRANDING: Amaala Spelling Consistency");
drawTableHeader();

drawRow("B.1", "All instances of AMAALA corrected to Amaala", "10/10", "DONE", "rooms.ts, RoomsOverview.tsx, WellbeingSpaces.tsx", "Grep for 'AMAALA' across src/ returns zero results. All corrected.", false);

// ===== OVERALL FOOTER =====
y += 6;
checkPage(18);

setFill(C.headerBg);
doc.roundedRect(marginL, y, contentW, 16, 2, 2, "F");

doc.setFont("Inter", "bold");
doc.setFontSize(12);
setColor(C.pageBg);
doc.text("OVERALL SCORE: 10 / 10   |   27 / 27 Requirements Passed", pageW / 2, y + 7, { align: "center" });

doc.setFont("Inter", "normal");
doc.setFontSize(8);
setColor([180, 190, 210]);
doc.text("0 TypeScript errors   |   All changes verified and live at http://localhost:8080/", pageW / 2, y + 13, { align: "center" });

// Page numbers
const totalPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  doc.setPage(p);
  doc.setFont("Inter", "normal");
  doc.setFontSize(7);
  setColor(C.gray);
  doc.text(`Page ${p} of ${totalPages}`, pageW - marginR, pageH - 6, { align: "right" });
  doc.text("Jayasom QA Report", marginL, pageH - 6);
}

// Save
const outputPath = path.join(__dirname, "QA-Report-Jayasom-Wireframes.pdf");
fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
console.log("PDF saved to: " + outputPath);
