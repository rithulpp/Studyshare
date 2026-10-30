import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Directories
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const DATA_DIR = path.resolve(__dirname, 'data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const PHP_DIR = path.resolve(__dirname, 'php_backend');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Minimal 100% compliant PDF generator with accurate xref table
function generateValidPdf(title: string, subject: string, semester: number, department: string, author: string, desc: string): Buffer {
  const sanitizedTitle = title.replace(/[^\w\s.,;:!?-]/g, '');
  const sanitizedSubject = subject.replace(/[^\w\s.,;:!?-]/g, '');
  const sanitizedDept = department.replace(/[^\w\s.,;:!?-]/g, '');
  const sanitizedAuthor = author.replace(/[^\w\s.,;:!?-]/g, '');
  const sanitizedDesc = desc.replace(/[^\w\s.,;:!?-]/g, '').slice(0, 160);

  const streamContent = [
    'BT',
    '/F1 22 Tf',
    '50 720 Td',
    `(${sanitizedTitle.slice(0, 45)}) Tj`,
    '/F1 12 Tf',
    '0 -32 Td',
    `(Course: ${sanitizedSubject}  |  Semester: ${semester}  |  Dept: ${sanitizedDept}) Tj`,
    '0 -22 Td',
    `(Verified Academic Notes  |  Uploaded by: ${sanitizedAuthor}  |  StudyShare) Tj`,
    '0 -30 Td',
    '/F1 14 Tf',
    '(Document Overview & Core Syllabus Focus:) Tj',
    '/F1 11 Tf',
    '0 -24 Td',
    `(${sanitizedDesc || 'Comprehensive study resource covering all key concepts and numericals.'}) Tj`,
    '0 -35 Td',
    '/F1 14 Tf',
    '(Key Units & Modules Included:) Tj',
    '/F1 11 Tf',
    '0 -22 Td',
    '(Unit 1: Fundamentals, Definitions, Mathematical Foundations & Axioms) Tj',
    '0 -20 Td',
    '(Unit 2: Detailed Architectural Diagrams, Theorems & Rigorous Proofs) Tj',
    '0 -20 Td',
    '(Unit 3: Step-by-Step Solved Problem Sets & Numerical Explanations) Tj',
    '0 -20 Td',
    '(Unit 4: University Previous Examination Trends & High-Yield Questions) Tj',
    '0 -20 Td',
    '(Unit 5: Lab Workflows, Code Implementations & Viva-Voce Key Points) Tj',
    '0 -45 Td',
    '/F1 10 Tf',
    '(Permanent Server-Side Storage - Powered by StudyShare Academic Network) Tj',
    '0 -16 Td',
    '(Shared for peer learning under Educational Fair Use. Free student download.) Tj',
    'ET'
  ].join('\n');

  const streamLength = Buffer.byteLength(streamContent, 'utf8');

  const header = '%PDF-1.4\n';
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj5 = `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  const offset1 = Buffer.byteLength(header, 'utf8');
  const offset2 = offset1 + Buffer.byteLength(obj1, 'utf8');
  const offset3 = offset2 + Buffer.byteLength(obj2, 'utf8');
  const offset4 = offset3 + Buffer.byteLength(obj3, 'utf8');
  const offset5 = offset4 + Buffer.byteLength(obj4, 'utf8');
  const xrefOffset = offset5 + Buffer.byteLength(obj5, 'utf8');

  const pad = (n: number) => String(n).padStart(10, '0');

  const xref = [
    'xref',
    '0 6',
    '0000000000 65535 f ',
    `${pad(offset1)} 00000 n `,
    `${pad(offset2)} 00000 n `,
    `${pad(offset3)} 00000 n `,
    `${pad(offset4)} 00000 n `,
    `${pad(offset5)} 00000 n `,
    'trailer',
    '<< /Size 6 /Root 1 0 R >>',
    'startxref',
    `${xrefOffset}`,
    '%%EOF'
  ].join('\n');

  return Buffer.from(header + obj1 + obj2 + obj3 + obj4 + obj5 + xref);
}

// Initial Starter Notes Seed
interface NoteItem {
  id: string;
  studentName: string;
  uploaderEmail: string;
  title: string;
  subject: string;
  subjectCode: string;
  semester: number;
  department: string;
  category: 'notes' | 'pyq' | 'syllabus' | 'lab_manual';
  examYear?: string;
  university: string;
  description: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  downloadsCount: number;
  viewsCount: number;
  rating: number;
  ratingCount: number;
  uploadedAt: string;
  tags: string[];
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-001',
    studentName: 'Aarav Sharma',
    uploaderEmail: 'aarav.sharma@studyshare.edu',
    title: 'Data Structures & Algorithms Complete Handwritten Notes',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    semester: 3,
    department: 'Computer Science & Engineering',
    category: 'notes',
    university: 'State Technical University',
    description: 'Master binary search trees, AVL trees, Dijkstra algorithm, Dynamic Programming paradigms, and time complexity with neatly sketched handwritten diagrams.',
    fileName: 'dsa_handwritten_complete.pdf',
    originalFileName: 'DSA_Unit1-5_Complete_Handwritten_Notes.pdf',
    fileSize: 3485760,
    downloadsCount: 512,
    viewsCount: 1420,
    rating: 4.9,
    ratingCount: 38,
    uploadedAt: '2026-09-15T10:30:00.000Z',
    tags: ['DSA', 'Trees', 'Graphs', 'Dynamic Programming', 'Handwritten']
  },
  {
    id: 'note-002',
    studentName: 'Priya Patel',
    uploaderEmail: 'priya.patel@studyshare.edu',
    title: 'Operating Systems 2024 End-Semester Question Paper (Solved)',
    subject: 'Operating Systems',
    subjectCode: 'CS401',
    semester: 4,
    department: 'Computer Science & Engineering',
    category: 'pyq',
    examYear: '2024',
    university: 'State Technical University',
    description: 'Official May 2024 question paper with verified answers, Banker algorithm safe state calculation, Round Robin scheduling Gantt chart, and Page Replacement algorithms.',
    fileName: 'os_pyq_2024_solved.pdf',
    originalFileName: 'OS_EndSem_2024_QuestionPaper_With_Solutions.pdf',
    fileSize: 1945600,
    downloadsCount: 684,
    viewsCount: 1980,
    rating: 4.8,
    ratingCount: 52,
    uploadedAt: '2026-08-20T14:15:00.000Z',
    tags: ['Operating Systems', 'PYQ 2024', 'Solved Paper', 'Scheduling']
  },
  {
    id: 'note-003',
    studentName: 'Rohan Verma',
    uploaderEmail: 'rohan.verma@studyshare.edu',
    title: 'Database Management Systems (DBMS) - SQL & Normalization',
    subject: 'Database Management Systems',
    subjectCode: 'CS402',
    semester: 4,
    department: 'Information Technology',
    category: 'notes',
    university: 'National Institute of Tech',
    description: 'Concise lecture notes covering Relational Algebra, ER modeling, 1NF to BCNF step-by-step decomposition examples, ACID transactions, and Concurrency Control.',
    fileName: 'dbms_lecture_notes.pdf',
    originalFileName: 'DBMS_Normalization_and_SQL_Notes.pdf',
    fileSize: 2894100,
    downloadsCount: 380,
    viewsCount: 960,
    rating: 4.7,
    ratingCount: 29,
    uploadedAt: '2026-09-02T09:00:00.000Z',
    tags: ['DBMS', 'SQL', 'Normalization', 'Relational Algebra']
  },
  {
    id: 'note-004',
    studentName: 'Vikram Joshi',
    uploaderEmail: 'vikram.j@studyshare.edu',
    title: 'Fluid Mechanics & Hydraulic Machinery Comprehensive Guide',
    subject: 'Fluid Mechanics',
    subjectCode: 'ME303',
    semester: 3,
    department: 'Mechanical Engineering',
    category: 'notes',
    university: 'Metro College of Engineering',
    description: 'Detailed derivations of Navier-Stokes simplified equations, Bernoulli theorem with venturimeter problems, boundary layer separation, and Pelton wheel efficiency curves.',
    fileName: 'fluid_mechanics_guide.pdf',
    originalFileName: 'Fluid_Mechanics_and_Machinery_Complete.pdf',
    fileSize: 4120000,
    downloadsCount: 295,
    viewsCount: 710,
    rating: 4.8,
    ratingCount: 22,
    uploadedAt: '2026-07-28T11:45:00.000Z',
    tags: ['Mechanical', 'Fluid Mechanics', 'Bernoulli', 'Hydraulics']
  },
  {
    id: 'note-005',
    studentName: 'Sneha Kulkarni',
    uploaderEmail: 'sneha.k@studyshare.edu',
    title: 'Digital Signal Processing (DSP) 2023 End-Sem PYQ with Solutions',
    subject: 'Digital Signal Processing',
    subjectCode: 'EC501',
    semester: 5,
    department: 'Electronics & Communication',
    category: 'pyq',
    examYear: '2023',
    university: 'Autonomous Tech University',
    description: 'Dec 2023 University Question Paper with worked solutions: Radix-2 DIT/DIF FFT butterfly diagrams, Butterworth/Chebyshev filter design, and bilinear transformation.',
    fileName: 'dsp_pyq_2023_solved.pdf',
    originalFileName: 'DSP_Dec2023_QuestionPaper_Solved.pdf',
    fileSize: 2450000,
    downloadsCount: 420,
    viewsCount: 1150,
    rating: 4.9,
    ratingCount: 34,
    uploadedAt: '2026-08-05T16:20:00.000Z',
    tags: ['DSP', 'Electronics', 'PYQ 2023', 'FFT', 'Filters']
  },
  {
    id: 'note-006',
    studentName: 'Ananya Roy',
    uploaderEmail: 'ananya.roy@studyshare.edu',
    title: 'Structural Analysis I - Trusses, Moment Distribution & Deflection',
    subject: 'Structural Analysis',
    subjectCode: 'CE403',
    semester: 4,
    department: 'Civil Engineering',
    category: 'notes',
    university: 'Apex Engineering College',
    description: 'Handwritten notes containing solved problems on Method of Joints, Castigliano theorem for frame deflections, and Hardy Cross moment distribution method for continuous beams.',
    fileName: 'structural_analysis_notes.pdf',
    originalFileName: 'Structural_Analysis_1_Handwritten.pdf',
    fileSize: 3100000,
    downloadsCount: 198,
    viewsCount: 540,
    rating: 4.6,
    ratingCount: 16,
    uploadedAt: '2026-09-10T08:15:00.000Z',
    tags: ['Civil', 'Structures', 'Trusses', 'Deflection']
  },
  {
    id: 'note-007',
    studentName: 'Karthik Nair',
    uploaderEmail: 'karthik.n@studyshare.edu',
    title: 'Engineering Mathematics I (Calculus, Matrices & ODE) PYQ 2022-2024',
    subject: 'Engineering Mathematics',
    subjectCode: 'BS101',
    semester: 1,
    department: 'Applied Sciences & Humanities',
    category: 'pyq',
    examYear: '2024',
    university: 'State Technical University',
    description: 'Compiled previous year question paper collection with step-by-step solutions for Cayley-Hamilton theorem, Maxima-Minima of two variables, and Taylor series expansions.',
    fileName: 'engg_maths_1_pyqs.pdf',
    originalFileName: 'Maths_1_Previous_Year_Papers_2022_2024.pdf',
    fileSize: 2780000,
    downloadsCount: 840,
    viewsCount: 2310,
    rating: 4.9,
    ratingCount: 67,
    uploadedAt: '2026-06-12T13:00:00.000Z',
    tags: ['First Year', 'Maths', 'Calculus', 'Matrices', 'PYQ']
  },
  {
    id: 'note-008',
    studentName: 'Aarav Sharma',
    uploaderEmail: 'aarav.sharma@studyshare.edu',
    title: 'Computer Networks - OSI Model, TCP/IP & Socket Programming',
    subject: 'Computer Networks',
    subjectCode: 'CS502',
    semester: 5,
    department: 'Computer Science & Engineering',
    category: 'notes',
    university: 'State Technical University',
    description: 'Detailed lecture notes on Flow control (Stop-and-Wait, Go-Back-N, Selective Repeat), Subnetting & CIDR calculations, OSPF/BGP routing protocols, and HTTP/HTTPS handshakes.',
    fileName: 'computer_networks_notes.pdf',
    originalFileName: 'CN_Unit1-5_Complete_Lecture_Notes.pdf',
    fileSize: 3620000,
    downloadsCount: 442,
    viewsCount: 1280,
    rating: 4.8,
    ratingCount: 31,
    uploadedAt: '2026-10-02T11:20:00.000Z',
    tags: ['Networks', 'OSI', 'TCP/IP', 'Subnetting', 'Routing']
  }
];

// Seed sample notes & ensure valid PDF files on disk
function initializeStorage() {
  if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(INITIAL_NOTES, null, 2), 'utf8');
  }

  // Create PDFs on disk for all initial items if missing
  const notes = getNotesData();
  for (const item of notes) {
    const pdfPath = path.join(UPLOADS_DIR, item.fileName);
    if (!fs.existsSync(pdfPath)) {
      const buffer = generateValidPdf(
        item.title,
        item.subject,
        item.semester,
        item.department,
        item.studentName,
        item.description
      );
      fs.writeFileSync(pdfPath, buffer);
    }
  }

  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: 'user-001',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@studyshare.edu',
        password: 'password123',
        department: 'Computer Science & Engineering',
        semester: 5,
        collegeName: 'State Technical University',
        rollNumber: 'CS2023-042',
        joinedAt: '2026-01-15T00:00:00.000Z'
      },
      {
        id: 'user-002',
        name: 'Priya Patel',
        email: 'priya.patel@studyshare.edu',
        password: 'password123',
        department: 'Information Technology',
        semester: 4,
        collegeName: 'National Institute of Tech',
        rollNumber: 'IT2024-118',
        joinedAt: '2026-02-10T00:00:00.000Z'
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
  }

  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function getNotesData(): NoteItem[] {
  try {
    if (fs.existsSync(NOTES_FILE)) {
      const content = fs.readFileSync(NOTES_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading notes.json:', err);
  }
  return [];
}

function saveNotesData(notes: NoteItem[]) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

initializeStorage();

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Multer Storage Configuration for Permanent Server-side PDF Storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const cleanName = file.originalname.replace(/[^\w.-]/g, '_');
    cb(null, `note_${timestamp}_${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024 // 30MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only valid PDF files (.pdf) are permitted.'));
    }
  }
});

// ================= API ENDPOINTS =================

// 1. Get all notes with search, filters, and sorting
app.get('/api/notes', (req: Request, res: Response) => {
  try {
    let notes = getNotesData();
    const { search, department, semester, category, examYear, sort } = req.query;

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        (n.subjectCode && n.subjectCode.toLowerCase().includes(q)) ||
        n.studentName.toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q))) ||
        (n.description && n.description.toLowerCase().includes(q))
      );
    }

    if (department && department !== 'all') {
      notes = notes.filter(n => n.department === department);
    }

    if (semester && semester !== 'all') {
      const semNum = Number(semester);
      if (!isNaN(semNum) && semNum > 0) {
        notes = notes.filter(n => n.semester === semNum);
      }
    }

    if (category && category !== 'all') {
      notes = notes.filter(n => n.category === category);
    }

    if (examYear && examYear !== 'all') {
      notes = notes.filter(n => n.examYear === examYear);
    }

    // Sorting
    switch (sort) {
      case 'downloads':
        notes.sort((a, b) => b.downloadsCount - a.downloadsCount);
        break;
      case 'rating':
        notes.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        notes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'views':
        notes.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case 'newest':
      default:
        notes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        break;
    }

    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get single note details & increment view count
app.get('/api/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const notes = getNotesData();
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  notes[noteIndex].viewsCount += 1;
  saveNotesData(notes);

  res.json({ success: true, note: notes[noteIndex] });
});

// 3. Permanent PDF Upload Endpoint
app.post('/api/upload', upload.single('pdfFile'), (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
    }

    const {
      title,
      subject,
      subjectCode,
      semester,
      department,
      category,
      examYear,
      university,
      studentName,
      uploaderEmail,
      description,
      tags
    } = req.body;

    if (!title || !subject || !semester || !department || !studentName) {
      // Remove uploaded file if validation fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: Title, Subject, Semester, Department, and Student Name are required.'
      });
    }

    const semNumber = parseInt(semester, 10);
    if (isNaN(semNumber) || semNumber < 1 || semNumber > 8) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({ success: false, message: 'Semester must be between 1 and 8.' });
    }

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : Array.isArray(tags) ? tags : [subject];

    const newNote: NoteItem = {
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      subject: subject.trim(),
      subjectCode: (subjectCode || '').trim().toUpperCase(),
      semester: semNumber,
      department: department.trim(),
      category: ['notes', 'pyq', 'syllabus', 'lab_manual'].includes(category) ? category : 'notes',
      examYear: examYear ? String(examYear).trim() : undefined,
      university: (university || 'State Technical University').trim(),
      studentName: studentName.trim(),
      uploaderEmail: (uploaderEmail || 'student@studyshare.edu').trim(),
      description: (description || '').trim(),
      fileName: file.filename,
      originalFileName: file.originalname,
      fileSize: file.size,
      downloadsCount: 0,
      viewsCount: 1,
      rating: 5.0,
      ratingCount: 1,
      uploadedAt: new Date().toISOString(),
      tags: parsedTags
    };

    const notes = getNotesData();
    notes.unshift(newNote);
    saveNotesData(notes);

    res.status(201).json({
      success: true,
      message: 'PDF notes uploaded and stored permanently on the server!',
      note: newNote
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'File upload failed.' });
  }
});

// 4. Download PDF File
app.get('/api/download/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const notes = getNotesData();
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).send('Note not found');
  }

  const note = notes[noteIndex];
  const filePath = path.join(UPLOADS_DIR, note.fileName);

  if (!fs.existsSync(filePath)) {
    // Self-heal: generate PDF if missing
    const buffer = generateValidPdf(
      note.title,
      note.subject,
      note.semester,
      note.department,
      note.studentName,
      note.description
    );
    fs.writeFileSync(filePath, buffer);
  }

  // Increment download counter
  notes[noteIndex].downloadsCount += 1;
  saveNotesData(notes);

  const downloadFilename = note.originalFileName || `${note.subject}_sem${note.semester}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFilename)}"`);
  res.download(filePath, downloadFilename);
});

// 5. In-browser View / Stream PDF
app.get('/api/view/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const notes = getNotesData();
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).send('Note not found');
  }

  const note = notes[noteIndex];
  const filePath = path.join(UPLOADS_DIR, note.fileName);

  if (!fs.existsSync(filePath)) {
    const buffer = generateValidPdf(
      note.title,
      note.subject,
      note.semester,
      note.department,
      note.studentName,
      note.description
    );
    fs.writeFileSync(filePath, buffer);
  }

  // Increment view counter
  notes[noteIndex].viewsCount += 1;
  saveNotesData(notes);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(note.originalFileName)}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// 6. Delete Note (for author/dashboard)
app.delete('/api/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const notes = getNotesData();
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  const note = notes[noteIndex];
  const filePath = path.join(UPLOADS_DIR, note.fileName);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Could not remove file on disk:', e);
    }
  }

  notes.splice(noteIndex, 1);
  saveNotesData(notes);

  res.json({ success: true, message: 'Note deleted permanently.' });
});

// 7. Rate Note
app.post('/api/notes/:id/rate', (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating } = req.body;
  const r = Number(rating);

  if (isNaN(r) || r < 1 || r > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
  }

  const notes = getNotesData();
  const note = notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  const totalPoints = note.rating * note.ratingCount + r;
  note.ratingCount += 1;
  note.rating = parseFloat((totalPoints / note.ratingCount).toFixed(1));
  saveNotesData(notes);

  res.json({ success: true, newRating: note.rating, ratingCount: note.ratingCount });
});

// 8. Auth: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, department, semester, collegeName, rollNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, message: 'This email is already registered.' });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // In production this would be bcrypt
      department: department || 'Computer Science & Engineering',
      semester: Number(semester) || 1,
      collegeName: collegeName || 'State Technical University',
      rollNumber: rollNumber || '',
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to StudyShare.',
      user: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 10. Contact & Feedback
app.post('/api/feedback', (req: Request, res: Response) => {
  try {
    const { name, email, subject, category, rating, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const feedbackList = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    const entry = {
      id: `fb-${Date.now()}`,
      name,
      email,
      subject: subject || 'General Feedback',
      category: category || 'Feedback',
      rating: Number(rating) || 5,
      message,
      submittedAt: new Date().toISOString()
    };

    feedbackList.unshift(entry);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbackList, null, 2), 'utf8');

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! The StudyShare team will review it.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/feedback', (_req: Request, res: Response) => {
  try {
    const feedbackList = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    res.json({ success: true, feedback: feedbackList });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 11. Platform Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  const notes = getNotesData();
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const totalDownloads = notes.reduce((sum, n) => sum + (n.downloadsCount || 0), 0);
  const totalViews = notes.reduce((sum, n) => sum + (n.viewsCount || 0), 0);
  const totalPYQs = notes.filter(n => n.category === 'pyq').length;

  res.json({
    success: true,
    stats: {
      totalNotes: notes.length,
      totalDownloads,
      totalViews,
      totalPYQs,
      totalStudents: users.length,
      departmentsCount: new Set(notes.map(n => n.department)).size
    }
  });
});

// 12. PHP Backend Code Provider for Project Submission & Export
app.get('/api/php-source', (_req: Request, res: Response) => {
  try {
    const files = [
      { name: 'db.sql', label: 'MySQL Schema & Seeds' },
      { name: 'config.php', label: 'Database Connection & Config' },
      { name: 'upload.php', label: 'Secure PDF Upload' },
      { name: 'download.php', label: 'PDF Download & Streamer' },
      { name: 'get_notes.php', label: 'Search & Filter Engine' },
      { name: 'register.php', label: 'Student Registration' },
      { name: 'login.php', label: 'Student Authentication' },
      { name: 'feedback.php', label: 'Feedback & Contact' },
      { name: 'README.md', label: 'XAMPP / cPanel Setup Guide' }
    ];

    const sourceData = files.map(f => {
      const p = path.join(PHP_DIR, f.name);
      return {
        filename: f.name,
        label: f.label,
        content: fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''
      };
    });

    res.json({ success: true, files: sourceData });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Vite Frontend Dev / Production Handler
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyShare server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
