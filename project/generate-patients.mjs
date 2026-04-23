import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Seed data ────────────────────────────────────────────────────────────────

const FIRST_NAMES_HISPANIC = [
  'Maria', 'Jose', 'Carlos', 'Ana', 'Luis', 'Rosa', 'Juan', 'Carmen',
  'Miguel', 'Elena', 'Pedro', 'Sofia', 'Rafael', 'Isabella', 'Fernando',
  'Gabriela', 'Diego', 'Lucia', 'Alejandro', 'Valentina', 'Ricardo',
  'Camila', 'Eduardo', 'Mariana', 'Oscar', 'Daniela', 'Hector', 'Patricia',
  'Alberto', 'Veronica',
];

const FIRST_NAMES_BLACK = [
  'Jaylen', 'Aaliyah', 'DeShawn', 'Imani', 'Terrance', 'Keisha', 'Malik',
  'Tamika', 'Darius', 'Ebony', 'Jamal', 'Shanice', 'Tyrone', 'Latoya',
  'Andre', 'Monique', 'Marcus', 'Jasmine', 'Lamar', 'Tiffany', 'Derrick',
  'Crystal', 'Antoine', 'Brianna', 'Jerome', 'Diamond', 'Kendrick', 'Destiny',
  'Marquis', 'Ciara',
];

const FIRST_NAMES_WHITE = [
  'James', 'Emily', 'Michael', 'Sarah', 'David', 'Jennifer', 'Robert',
  'Jessica', 'William', 'Ashley', 'Daniel', 'Megan', 'Matthew', 'Amanda',
  'Christopher', 'Nicole', 'Andrew', 'Stephanie', 'Brian', 'Rachel', 'Kevin',
  'Lauren', 'Timothy', 'Heather', 'Patrick', 'Samantha', 'Thomas', 'Rebecca',
  'Sean', 'Elizabeth',
];

const FIRST_NAMES_ASIAN = [
  'Wei', 'Mei', 'Jian', 'Xia', 'Yong', 'Li', 'Chen', 'Ying', 'Hao', 'Fang',
  'Sang', 'Min-ji', 'Hiroshi', 'Yuki', 'Takeshi', 'Sakura', 'Anh', 'Linh',
  'Priya', 'Arjun', 'Raj', 'Sunita', 'Vinh', 'Tuan', 'Hien', 'Lan',
  'Kenji', 'Akiko', 'Soo-yeon', 'Jin',
];

const FIRST_NAMES_HAITIAN = [
  'Jean-Baptiste', 'Marie-Claire', 'Frantz', 'Nadine', 'Pierre', 'Guerline',
  'Reginald', 'Fabienne', 'Jean-Pierre', 'Roseline', 'Emmanuel', 'Mireille',
  'Wilner', 'Daphne', 'Jocelyn', 'Yvette', 'Fritz', 'Carole', 'Edouard',
  'Magalie', 'Jean-Louis', 'Bernadette', 'Jacques', 'Yolande', 'Lucien',
  'Marlene', 'Roland', 'Josette', 'Claude', 'Ginette',
];

const LAST_NAMES_HISPANIC = [
  'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Hernandez', 'Gonzalez',
  'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Rivera', 'Gomez', 'Diaz',
  'Cruz', 'Morales', 'Reyes', 'Ortiz', 'Gutierrez', 'Chavez', 'Mendoza',
];

const LAST_NAMES_BLACK = [
  'Washington', 'Jefferson', 'Williams', 'Jackson', 'Robinson', 'Brown',
  'Harris', 'Thompson', 'Johnson', 'Davis', 'Jones', 'Wilson', 'Taylor',
  'Carter', 'Mitchell', 'Moore', 'Lewis', 'Walker', 'Hall', 'Young',
];

const LAST_NAMES_WHITE = [
  'Sullivan', 'Murphy', 'O\'Brien', 'McCarthy', 'Walsh', 'Fitzgerald',
  'Kelly', 'Doyle', 'Murray', 'Quinn', 'Smith', 'Anderson', 'Peterson',
  'Johnson', 'Nelson', 'Miller', 'Baker', 'Clark', 'Hall', 'Adams',
];

const LAST_NAMES_ASIAN = [
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Kim', 'Park', 'Lee',
  'Nguyen', 'Tran', 'Pham', 'Patel', 'Shah', 'Singh', 'Tanaka', 'Yamamoto',
  'Suzuki', 'Wong', 'Huang',
];

const LAST_NAMES_HAITIAN = [
  'Jean-Baptiste', 'Aristide', 'Celestin', 'Desrosiers', 'Estimé', 'Fils-Aimé',
  'Guillaume', 'Hyppolite', 'Innocent', 'Joseph', 'Lafontant', 'Magloire',
  'Narcisse', 'Olivier', 'Pierre-Louis', 'Romain', 'Saint-Louis', 'Toussaint',
  'Vilsaint', 'Beauvais',
];

const BOSTON_ZIPS = [
  '02134', '02136', '02119', '02121', '02122', '02124',
  '02125', '02126', '02128', '02130', '02131', '02132',
];

const HIGH_RISK_ZIPS = ['02119', '02121', '02124', '02126'];
const OTHER_ZIPS = BOSTON_ZIPS.filter(z => !HIGH_RISK_ZIPS.includes(z));

const RISK_FACTORS = [
  'Address instability',
  'Prior procedural failure',
  'Language barrier',
  'No phone on file',
  'Prior disenrollment',
  'Complex medical needs',
];

const ADMITTING_UNITS = [
  'Emergency', 'Medical-Surgical', 'ICU', 'Pediatrics', 'OB/GYN',
  'Psychiatry', 'Rehabilitation', 'Cardiology', 'Oncology', 'Neurology',
];

const OUTREACH_METHODS = ['SMS', 'Phone', 'Mail', 'In-person'];
const OUTREACH_OUTCOMES = [
  'No response', 'Left voicemail', 'Spoke with patient',
  'Letter returned', 'Appointment scheduled',
];

const LANGUAGES = {
  English: 0.55,
  Spanish: 0.25,
  Portuguese: 0.05,
  'Haitian Creole': 0.05,
  Chinese: 0.05,
  Other: 0.05,
};

const EXEMPTION_CATEGORIES = [
  { category: 'Pregnancy', weight: 0.25 },
  { category: 'Medically frail', weight: 0.30 },
  { category: 'Caregiver', weight: 0.20 },
  { category: 'Student', weight: 0.15 },
  { category: 'Other', weight: 0.10 },
];

// ── Utility functions ────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedPick(options) {
  const r = Math.random();
  let cumulative = 0;
  for (const [value, weight] of Object.entries(options)) {
    cumulative += weight;
    if (r < cumulative) return value;
  }
  return Object.keys(options).at(-1);
}

function weightedPickArray(items) {
  const r = Math.random();
  let cumulative = 0;
  for (const { category, weight } of items) {
    cumulative += weight;
    if (r < cumulative) return category;
  }
  return items.at(-1).category;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function randomDateBetween(start, end) {
  const s = start.getTime();
  const e = end.getTime();
  return new Date(s + Math.random() * (e - s));
}

function generateMedicaidId() {
  const prefix = 'MA';
  const digits = String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
  return `${prefix}${digits}`;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── Name generation ──────────────────────────────────────────────────────────

function generateName(language) {
  // Bias name ethnicity by language, but allow mixing
  const r = Math.random();
  let firstNames, lastNames;

  if (language === 'Spanish') {
    firstNames = FIRST_NAMES_HISPANIC;
    lastNames = LAST_NAMES_HISPANIC;
  } else if (language === 'Haitian Creole') {
    firstNames = FIRST_NAMES_HAITIAN;
    lastNames = LAST_NAMES_HAITIAN;
  } else if (language === 'Chinese') {
    firstNames = FIRST_NAMES_ASIAN;
    lastNames = LAST_NAMES_ASIAN;
  } else if (language === 'Portuguese') {
    // Mix of Hispanic and Black names for Cape Verdean / Brazilian community
    firstNames = r < 0.5 ? FIRST_NAMES_HISPANIC : FIRST_NAMES_BLACK;
    lastNames = r < 0.5 ? LAST_NAMES_HISPANIC : LAST_NAMES_BLACK;
  } else {
    // English or Other: diverse mix
    const pool = Math.random();
    if (pool < 0.30) {
      firstNames = FIRST_NAMES_BLACK;
      lastNames = LAST_NAMES_BLACK;
    } else if (pool < 0.55) {
      firstNames = FIRST_NAMES_WHITE;
      lastNames = LAST_NAMES_WHITE;
    } else if (pool < 0.70) {
      firstNames = FIRST_NAMES_HISPANIC;
      lastNames = LAST_NAMES_HISPANIC;
    } else if (pool < 0.85) {
      firstNames = FIRST_NAMES_ASIAN;
      lastNames = LAST_NAMES_ASIAN;
    } else {
      firstNames = FIRST_NAMES_HAITIAN;
      lastNames = LAST_NAMES_HAITIAN;
    }
  }

  return `${pick(firstNames)} ${pick(lastNames)}`;
}

// ── Core generation ──────────────────────────────────────────────────────────

function generatePatients() {
  const patients = [];

  // Build risk-level distribution: High 125, Medium 200, Low 175
  const riskAssignments = [
    ...Array(125).fill('High'),
    ...Array(200).fill('Medium'),
    ...Array(175).fill('Low'),
  ];
  // Shuffle
  for (let i = riskAssignments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [riskAssignments[i], riskAssignments[j]] = [riskAssignments[j], riskAssignments[i]];
  }

  // Build exemption status distribution:
  // "Likely exempt" 100, "Exempt documented" 50, "Not exempt" 250, "Unknown" 100
  const exemptionAssignments = [
    ...Array(100).fill('Likely exempt'),
    ...Array(50).fill('Exempt documented'),
    ...Array(250).fill('Not exempt'),
    ...Array(100).fill('Unknown'),
  ];
  for (let i = exemptionAssignments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [exemptionAssignments[i], exemptionAssignments[j]] = [exemptionAssignments[j], exemptionAssignments[i]];
  }

  for (let i = 0; i < 500; i++) {
    const riskLevel = riskAssignments[i];
    const exemptionStatus = exemptionAssignments[i];

    // Language
    const language = weightedPick(LANGUAGES);

    // Name
    const name = generateName(language);

    // DOB: 1958-2007
    const dob = formatDate(randomDateBetween(new Date(1958, 0, 1), new Date(2007, 11, 31)));

    // Zip code: cluster high-risk in specific zips
    let zipCode;
    if (riskLevel === 'High') {
      zipCode = Math.random() < 0.65 ? pick(HIGH_RISK_ZIPS) : pick(OTHER_ZIPS);
    } else if (riskLevel === 'Medium') {
      zipCode = Math.random() < 0.35 ? pick(HIGH_RISK_ZIPS) : pick(OTHER_ZIPS);
    } else {
      zipCode = Math.random() < 0.15 ? pick(HIGH_RISK_ZIPS) : pick(OTHER_ZIPS);
    }

    // Contact method
    const contactMethod = pick(['Phone', 'Mail', 'Email', 'SMS', 'Patient portal']);

    // Phone and address stability - correlate with risk
    let phoneOnFile, addressStable;
    if (riskLevel === 'High') {
      phoneOnFile = Math.random() < 0.55;
      addressStable = Math.random() < 0.45;
    } else if (riskLevel === 'Medium') {
      phoneOnFile = Math.random() < 0.75;
      addressStable = Math.random() < 0.70;
    } else {
      phoneOnFile = Math.random() < 0.90;
      addressStable = Math.random() < 0.90;
    }

    // Enrollment date: 1-10 years ago
    const enrollmentDate = formatDate(
      randomDateBetween(new Date(2016, 0, 1), new Date(2025, 11, 31))
    );

    // Last redetermination: 6-18 months ago
    const lastRedet = randomDateBetween(new Date(2024, 9, 1), new Date(2025, 9, 30));
    const lastRedetermination = formatDate(lastRedet);

    // Next redetermination: next 12 months from April 2026, concentrated in first 6 months
    let nextRedetMonth;
    if (Math.random() < 0.70) {
      // First 6 months: Apr-Sep 2026
      nextRedetMonth = randomInt(3, 8); // 0-indexed: 3=April, 8=September
    } else {
      // Last 6 months: Oct 2026 - Mar 2027
      nextRedetMonth = randomInt(9, 14); // 9=Oct, 14=Mar next year
    }
    const nextRedetYear = nextRedetMonth > 11 ? 2027 : 2026;
    const actualMonth = nextRedetMonth > 11 ? nextRedetMonth - 12 : nextRedetMonth;
    const nextRedetDay = randomInt(1, 28);
    const nextRedetermination = formatDate(new Date(nextRedetYear, actualMonth, nextRedetDay));

    // Prior disenrollments and procedural failures
    const priorDisenrollments = riskLevel === 'High' ? randomInt(1, 4)
      : riskLevel === 'Medium' ? randomInt(0, 2) : randomInt(0, 1);
    const priorProceduralFailures = riskLevel === 'High' ? randomInt(1, 3)
      : riskLevel === 'Medium' ? randomInt(0, 2) : randomInt(0, 1);

    // Inpatient days: right-skewed, mean ~4, range 0-21
    const inpatientDays12mo = Math.floor(Math.random() * Math.random() * 21);

    // Outpatient visits
    const outpatientVisits12mo = randomInt(0, 24);

    // Admitting units
    const numUnits = inpatientDays12mo > 0 ? randomInt(1, Math.min(3, inpatientDays12mo)) : 0;
    const admittingUnits = [];
    const unitsCopy = [...ADMITTING_UNITS];
    for (let u = 0; u < numUnits; u++) {
      const idx = Math.floor(Math.random() * unitsCopy.length);
      admittingUnits.push(unitsCopy.splice(idx, 1)[0]);
    }

    // Total Medicaid days: based on enrollment date
    const enrollDate = new Date(enrollmentDate);
    const today = new Date(2026, 3, 23); // April 23, 2026
    const totalMedicaidDays = Math.max(30, Math.floor((today - enrollDate) / (1000 * 60 * 60 * 24)));

    // Risk score: correlate with risk level
    let riskScore;
    if (riskLevel === 'High') {
      riskScore = +(70 + Math.random() * 30).toFixed(1);
    } else if (riskLevel === 'Medium') {
      riskScore = +(35 + Math.random() * 35).toFixed(1);
    } else {
      riskScore = +(5 + Math.random() * 30).toFixed(1);
    }

    // Risk factors
    let numFactors;
    if (riskLevel === 'High') {
      numFactors = randomInt(2, 4);
    } else if (riskLevel === 'Medium') {
      numFactors = randomInt(1, 2);
    } else {
      numFactors = randomInt(0, 1);
    }
    const riskFactors = [];
    const factorPool = [...RISK_FACTORS];
    // Ensure coherence: if no phone, include that factor; if address unstable, include that
    if (!phoneOnFile && !factorPool.includes('No phone on file')) factorPool.push('No phone on file');
    if (!addressStable && !factorPool.includes('Address instability')) factorPool.push('Address instability');

    // Prioritize coherent factors
    if (!phoneOnFile && numFactors > 0) {
      riskFactors.push('No phone on file');
      const idx = factorPool.indexOf('No phone on file');
      if (idx !== -1) factorPool.splice(idx, 1);
      numFactors--;
    }
    if (!addressStable && numFactors > 0) {
      riskFactors.push('Address instability');
      const idx = factorPool.indexOf('Address instability');
      if (idx !== -1) factorPool.splice(idx, 1);
      numFactors--;
    }
    if (language !== 'English' && numFactors > 0) {
      riskFactors.push('Language barrier');
      const idx = factorPool.indexOf('Language barrier');
      if (idx !== -1) factorPool.splice(idx, 1);
      numFactors--;
    }

    for (let f = 0; f < numFactors; f++) {
      if (factorPool.length === 0) break;
      const idx = Math.floor(Math.random() * factorPool.length);
      const factor = factorPool.splice(idx, 1)[0];
      if (!riskFactors.includes(factor)) {
        riskFactors.push(factor);
      }
    }

    // Exemption category
    let likelyExemptionCategory = null;
    let exemptionDocumented = false;

    if (exemptionStatus === 'Exempt documented') {
      likelyExemptionCategory = weightedPickArray(EXEMPTION_CATEGORIES);
      exemptionDocumented = true;
    } else if (exemptionStatus === 'Likely exempt') {
      likelyExemptionCategory = weightedPickArray(EXEMPTION_CATEGORIES);
      exemptionDocumented = false;
    } else {
      likelyExemptionCategory = null;
      exemptionDocumented = false;
    }

    // Work requirement status
    let workRequirementStatus;
    if (exemptionStatus === 'Exempt documented') {
      workRequirementStatus = 'Exempt';
    } else if (exemptionStatus === 'Likely exempt') {
      workRequirementStatus = 'Pending review';
    } else if (exemptionStatus === 'Unknown') {
      workRequirementStatus = 'Unknown';
    } else {
      // Not exempt
      const wr = Math.random();
      if (wr < 0.30) {
        workRequirementStatus = 'Compliant';
      } else if (wr < 0.50) {
        workRequirementStatus = 'Non-compliant';
      } else {
        workRequirementStatus = 'Documentation pending';
      }
    }

    // DSH impact: -(inpatientDays12mo / 89200)
    const dshImpactIfLost = +(-(inpatientDays12mo / 89200)).toFixed(6);

    // Suggested action
    const actions = [];
    if (exemptionStatus === 'Likely exempt' && !exemptionDocumented) {
      actions.push(`File ${likelyExemptionCategory} exemption`);
    }
    if (!addressStable) {
      actions.push('Update mailing address');
    }
    if (language !== 'English') {
      actions.push(`Send renewal packet in ${language}`);
    }
    if (!phoneOnFile) {
      actions.push('Obtain current phone number');
    }
    if (priorProceduralFailures > 0) {
      actions.push('Assign case worker for direct follow-up');
    }
    if (workRequirementStatus === 'Non-compliant') {
      actions.push('Verify work requirement compliance or document exemption');
    }
    if (workRequirementStatus === 'Documentation pending') {
      actions.push('Request pending documentation');
    }
    if (actions.length === 0) {
      actions.push('Standard renewal reminder');
    }
    const suggestedAction = actions.join('; ');

    // Outreach history
    let maxEvents;
    if (riskLevel === 'High') {
      maxEvents = randomInt(1, 3);
    } else if (riskLevel === 'Medium') {
      maxEvents = randomInt(0, 2);
    } else {
      maxEvents = randomInt(0, 1);
    }
    const outreachHistory = [];
    for (let e = 0; e < maxEvents; e++) {
      const eventDate = formatDate(
        randomDateBetween(new Date(2026, 1, 1), new Date(2026, 3, 23))
      );
      outreachHistory.push({
        date: eventDate,
        method: pick(OUTREACH_METHODS),
        outcome: pick(OUTREACH_OUTCOMES),
      });
    }
    // Sort outreach by date
    outreachHistory.sort((a, b) => a.date.localeCompare(b.date));

    patients.push({
      id: generateUUID(),
      name,
      dob,
      medicaidId: generateMedicaidId(),
      zipCode,
      language,
      contactMethod,
      phoneOnFile,
      addressStable,
      enrollmentDate,
      lastRedetermination,
      nextRedetermination,
      priorDisenrollments,
      priorProceduralFailures,
      inpatientDays12mo,
      outpatientVisits12mo,
      admittingUnits,
      totalMedicaidDays,
      riskLevel,
      riskScore,
      riskFactors,
      workRequirementStatus,
      likelyExemptionCategory,
      exemptionDocumented,
      exemptionStatus,
      suggestedAction,
      dshImpactIfLost,
      priorityRank: 0, // placeholder, assigned after sorting
      outreachHistory,
    });
  }

  // Sort by dshImpactIfLost (most negative first) and assign priority rank
  patients.sort((a, b) => a.dshImpactIfLost - b.dshImpactIfLost);
  patients.forEach((p, idx) => {
    p.priorityRank = idx + 1;
  });

  return patients;
}

// ── Output TypeScript file ───────────────────────────────────────────────────

function escapeString(s) {
  if (s === null) return 'null';
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function formatPatient(p, indent = '  ') {
  const lines = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: ${escapeString(p.id)},`);
  lines.push(`${indent}  name: ${escapeString(p.name)},`);
  lines.push(`${indent}  dob: ${escapeString(p.dob)},`);
  lines.push(`${indent}  medicaidId: ${escapeString(p.medicaidId)},`);
  lines.push(`${indent}  zipCode: ${escapeString(p.zipCode)},`);
  lines.push(`${indent}  language: ${escapeString(p.language)},`);
  lines.push(`${indent}  contactMethod: ${escapeString(p.contactMethod)},`);
  lines.push(`${indent}  phoneOnFile: ${p.phoneOnFile},`);
  lines.push(`${indent}  addressStable: ${p.addressStable},`);
  lines.push(`${indent}  enrollmentDate: ${escapeString(p.enrollmentDate)},`);
  lines.push(`${indent}  lastRedetermination: ${escapeString(p.lastRedetermination)},`);
  lines.push(`${indent}  nextRedetermination: ${escapeString(p.nextRedetermination)},`);
  lines.push(`${indent}  priorDisenrollments: ${p.priorDisenrollments},`);
  lines.push(`${indent}  priorProceduralFailures: ${p.priorProceduralFailures},`);
  lines.push(`${indent}  inpatientDays12mo: ${p.inpatientDays12mo},`);
  lines.push(`${indent}  outpatientVisits12mo: ${p.outpatientVisits12mo},`);
  lines.push(`${indent}  admittingUnits: [${p.admittingUnits.map(u => escapeString(u)).join(', ')}],`);
  lines.push(`${indent}  totalMedicaidDays: ${p.totalMedicaidDays},`);
  lines.push(`${indent}  riskLevel: ${escapeString(p.riskLevel)},`);
  lines.push(`${indent}  riskScore: ${p.riskScore},`);
  lines.push(`${indent}  riskFactors: [${p.riskFactors.map(f => escapeString(f)).join(', ')}],`);
  lines.push(`${indent}  workRequirementStatus: ${escapeString(p.workRequirementStatus)},`);
  lines.push(`${indent}  likelyExemptionCategory: ${p.likelyExemptionCategory === null ? 'null' : escapeString(p.likelyExemptionCategory)},`);
  lines.push(`${indent}  exemptionDocumented: ${p.exemptionDocumented},`);
  lines.push(`${indent}  exemptionStatus: ${escapeString(p.exemptionStatus)},`);
  lines.push(`${indent}  suggestedAction: ${escapeString(p.suggestedAction)},`);
  lines.push(`${indent}  dshImpactIfLost: ${p.dshImpactIfLost},`);
  lines.push(`${indent}  priorityRank: ${p.priorityRank},`);

  // Outreach history
  if (p.outreachHistory.length === 0) {
    lines.push(`${indent}  outreachHistory: [],`);
  } else {
    lines.push(`${indent}  outreachHistory: [`);
    for (const event of p.outreachHistory) {
      lines.push(`${indent}    { date: ${escapeString(event.date)}, method: ${escapeString(event.method)}, outcome: ${escapeString(event.outcome)} },`);
    }
    lines.push(`${indent}  ],`);
  }

  lines.push(`${indent}},`);
  return lines.join('\n');
}

function generateTypeScriptFile(patients) {
  const parts = [];

  parts.push(`// Auto-generated synthetic patient data — do not edit manually.`);
  parts.push(`// Generated on ${new Date().toISOString().split('T')[0]}\n`);

  parts.push(`export interface OutreachEvent {`);
  parts.push(`  date: string;`);
  parts.push(`  method: string;`);
  parts.push(`  outcome: string;`);
  parts.push(`}\n`);

  parts.push(`export interface Patient {`);
  parts.push(`  id: string;`);
  parts.push(`  name: string;`);
  parts.push(`  dob: string;`);
  parts.push(`  medicaidId: string;`);
  parts.push(`  zipCode: string;`);
  parts.push(`  language: string;`);
  parts.push(`  contactMethod: string;`);
  parts.push(`  phoneOnFile: boolean;`);
  parts.push(`  addressStable: boolean;`);
  parts.push(`  enrollmentDate: string;`);
  parts.push(`  lastRedetermination: string;`);
  parts.push(`  nextRedetermination: string;`);
  parts.push(`  priorDisenrollments: number;`);
  parts.push(`  priorProceduralFailures: number;`);
  parts.push(`  inpatientDays12mo: number;`);
  parts.push(`  outpatientVisits12mo: number;`);
  parts.push(`  admittingUnits: string[];`);
  parts.push(`  totalMedicaidDays: number;`);
  parts.push(`  riskLevel: 'High' | 'Medium' | 'Low';`);
  parts.push(`  riskScore: number;`);
  parts.push(`  riskFactors: string[];`);
  parts.push(`  workRequirementStatus: string;`);
  parts.push(`  likelyExemptionCategory: string | null;`);
  parts.push(`  exemptionDocumented: boolean;`);
  parts.push(`  exemptionStatus: string;`);
  parts.push(`  suggestedAction: string;`);
  parts.push(`  dshImpactIfLost: number;`);
  parts.push(`  priorityRank: number;`);
  parts.push(`  outreachHistory: OutreachEvent[];`);
  parts.push(`}\n`);

  parts.push(`export const patients: Patient[] = [`);
  for (const patient of patients) {
    parts.push(formatPatient(patient));
  }
  parts.push(`];\n`);

  return parts.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('Generating 500 synthetic patient records...');
const patients = generatePatients();
const tsContent = generateTypeScriptFile(patients);

const outputPath = join(__dirname, 'src', 'data', 'patients.ts');
writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`Written ${patients.length} patient records to ${outputPath}`);

// Validation summary
const riskCounts = { High: 0, Medium: 0, Low: 0 };
const langCounts = {};
const exemptionCounts = {};
let totalInpatient = 0;

for (const p of patients) {
  riskCounts[p.riskLevel]++;
  langCounts[p.language] = (langCounts[p.language] || 0) + 1;
  exemptionCounts[p.exemptionStatus] = (exemptionCounts[p.exemptionStatus] || 0) + 1;
  totalInpatient += p.inpatientDays12mo;
}

console.log('\n--- Distribution Summary ---');
console.log('Risk levels:', riskCounts);
console.log('Languages:', langCounts);
console.log('Exemption statuses:', exemptionCounts);
console.log(`Mean inpatient days: ${(totalInpatient / 500).toFixed(2)}`);
console.log(`Priority rank range: ${patients[0].priorityRank} - ${patients[patients.length - 1].priorityRank}`);
console.log(`DSH impact range: ${patients[0].dshImpactIfLost} to ${patients[patients.length - 1].dshImpactIfLost}`);
