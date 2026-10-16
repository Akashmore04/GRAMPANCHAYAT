import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Pkg.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing (with limit for image uploads)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Setup
const DB_DIR = path.join(__dirname, '../database');
const DB_PATH = path.join(DB_DIR, 'panchayat.db');
const SQL_SCHEMA_PATH = path.join(DB_DIR, 'database.sql');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
  } else {
    console.log(' Connected to SQLite database at:', DB_PATH);
    initDatabase();
  }
});

// Initialize tables from SQL file if not present
function initDatabase() {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='expenses'", (err, row) => {
    if (err) {
      console.error('Database inspection error:', err);
      return;
    }
    if (!row) {
      console.log('🔄 First run detected. Initializing database schema and seed data from database.sql...');
      if (fs.existsSync(SQL_SCHEMA_PATH)) {
        const sql = fs.readFileSync(SQL_SCHEMA_PATH, 'utf8');
        db.exec(sql, (execErr) => {
          if (execErr) {
            console.error('❌ Error running database.sql:', execErr);
          } else {
            console.log('✅ Database schema and seed records initialized successfully!');
          }
        });
      } else {
        console.warn('⚠️ database.sql file not found at:', SQL_SCHEMA_PATH);
      }
    } else {
      console.log('✅ Existing tables found. Database ready.');
    }
  });
}

// =====================================================================
// 1. AUTHENTICATION API
// =====================================================================

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const query = 'SELECT id, email, full_name, role, designation FROM users WHERE LOWER(email) = LOWER(?) AND password = ?';
  db.get(query, [email.trim(), password.trim()], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error during authentication.' });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid official credentials. Access denied.' });
    }
    
    res.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        designation: user.designation,
      },
      token: `phulera_auth_${user.id}_${Date.now()}`
    });
  });
});

// =====================================================================
// 2. EXPENSE CATEGORIES API
// =====================================================================

app.get('/api/expense-categories', (req, res) => {
  db.all('SELECT * FROM expense_categories ORDER BY name ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

app.post('/api/expense-categories', (req, res) => {
  const { name, description, allocated_budget } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Category name is required.' });
  }

  const query = 'INSERT INTO expense_categories (name, description, allocated_budget) VALUES (?, ?, ?)';
  db.run(query, [name.trim(), description || '', allocated_budget || 0], function(err) {
    if (err) {
      return res.status(400).json({ success: false, error: 'Category already exists or invalid data.' });
    }
    res.status(201).json({
      success: true,
      message: 'Expense category added successfully.',
      data: { id: this.lastID, name: name.trim(), description, allocated_budget: allocated_budget || 0 }
    });
  });
});

// =====================================================================
// 3. EXPENSES API
// =====================================================================

app.get('/api/expenses', (req, res) => {
  const { category, timeframe, search } = req.query;
  let sql = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (category && category !== 'All' && category !== 'All Categories') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (search && search.trim()) {
    const q = `%${search.trim()}%`;
    sql += ' AND (title LIKE ? OR vendor LIKE ? OR receipt_no LIKE ? OR description LIKE ?)';
    params.push(q, q, q, q);
  }

  sql += ' ORDER BY date DESC, id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    
    // Filter by timeframe in memory or SQL if requested
    let filtered = rows;
    if (timeframe && timeframe !== 'All') {
      const now = new Date();
      filtered = rows.filter(item => {
        const itemDate = new Date(item.date);
        if (timeframe === 'Today') {
          return itemDate.toDateString() === now.toDateString();
        } else if (timeframe === 'Week') {
          const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 7;
        } else if (timeframe === 'Month') {
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        } else if (timeframe === 'Year') {
          return itemDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  });
});

app.post('/api/expenses', (req, res) => {
  const { title, category, amount, date, vendor, receipt_no, description, project, status } = req.body;
  
  if (!title || !category || !amount || !date) {
    return res.status(400).json({ success: false, error: 'Title, category, amount, and date are required.' });
  }

  const query = `
    INSERT INTO expenses (title, category, amount, date, vendor, receipt_no, description, project, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    title.trim(),
    category.trim(),
    parseFloat(amount),
    date,
    vendor ? vendor.trim() : '',
    receipt_no ? receipt_no.trim() : `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    description ? description.trim() : '',
    project ? project.trim() : '',
    status || 'Paid'
  ], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    
    res.status(201).json({
      success: true,
      message: 'Expense record created successfully.',
      data: {
        id: this.lastID,
        title: title.trim(),
        category: category.trim(),
        amount: parseFloat(amount),
        date,
        vendor: vendor ? vendor.trim() : '',
        receipt_no: receipt_no ? receipt_no.trim() : '',
        description: description ? description.trim() : '',
        project: project ? project.trim() : '',
        status: status || 'Paid'
      }
    });
  });
});

app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, amount, date, vendor, receipt_no, description, project, status } = req.body;

  const query = `
    UPDATE expenses 
    SET title = ?, category = ?, amount = ?, date = ?, vendor = ?, receipt_no = ?, description = ?, project = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [
    title.trim(),
    category.trim(),
    parseFloat(amount),
    date,
    vendor ? vendor.trim() : '',
    receipt_no ? receipt_no.trim() : '',
    description ? description.trim() : '',
    project ? project.trim() : '',
    status || 'Paid',
    id
  ], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Expense record not found.' });

    res.json({ success: true, message: 'Expense updated successfully.' });
  });
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Expense record not found.' });

    res.json({ success: true, message: 'Expense deleted successfully.' });
  });
});

// =====================================================================
// 4. COMPLAINT CATEGORIES API
// =====================================================================

app.get('/api/complaint-categories', (req, res) => {
  db.all('SELECT * FROM complaint_categories ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

// =====================================================================
// 5. COMPLAINTS (CITIZEN GRIEVANCE) API
// =====================================================================

app.get('/api/complaints', (req, res) => {
  const { category, priority, status, search } = req.query;
  let sql = 'SELECT * FROM complaints WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (priority && priority !== 'All') {
    sql += ' AND priority = ?';
    params.push(priority);
  }

  if (status && status !== 'All') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    const q = `%${search.trim()}%`;
    sql += ' AND (tracking_id LIKE ? OR title LIKE ? OR location LIKE ? OR description LIKE ?)';
    params.push(q, q, q, q);
  }

  sql += `
    ORDER BY 
      CASE priority 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
        ELSE 5 
      END ASC,
      id DESC
  `;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, count: rows.length, data: rows });
  });
});

app.post('/api/complaints', (req, res) => {
  const { title, category, location, priority, date, description, image } = req.body;

  if (!title || !category || !location || !description) {
    return res.status(400).json({ success: false, error: 'Title, category, location, and description are required.' });
  }

  const nextNum = Math.floor(100 + Math.random() * 900);
  const tracking_id = `GRV-${nextNum}`;
  const currentDate = date || new Date().toISOString().split('T')[0];
  const assignedPriority = priority || 'Medium';

  const query = `
    INSERT INTO complaints (tracking_id, title, category, location, priority, date, description, status, image, response)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, NULL)
  `;

  db.run(query, [
    tracking_id,
    title.trim(),
    category.trim(),
    location.trim(),
    assignedPriority,
    currentDate,
    description.trim(),
    image || null
  ], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.status(201).json({
      success: true,
      message: 'Grievance registered successfully.',
      data: {
        id: this.lastID,
        tracking_id,
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        priority: assignedPriority,
        date: currentDate,
        description: description.trim(),
        status: 'Pending',
        image: image || null,
        response: null
      }
    });
  });
});

app.put('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { status, response } = req.body;

  let query = 'UPDATE complaints SET ';
  const updates = [];
  const params = [];

  if (status !== undefined) {
    updates.push('status = ?');
    params.push(status);
  }
  if (response !== undefined) {
    updates.push('response = ?');
    params.push(response ? response.trim() : null);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, error: 'No fields provided to update.' });
  }

  query += updates.join(', ') + ' WHERE id = ? OR tracking_id = ?';
  params.push(id, id);

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Complaint record not found.' });

    res.json({ success: true, message: 'Complaint updated successfully.' });
  });
});

app.delete('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM complaints WHERE id = ? OR tracking_id = ?', [id, id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Complaint not found.' });

    res.json({ success: true, message: 'Complaint deleted successfully.' });
  });
});

// =====================================================================
// 6. PROJECTS & UPCOMING PLANS API
// =====================================================================

app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

app.get('/api/plans', (req, res) => {
  db.all('SELECT * FROM upcoming_plans ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    
    // Group by status_group
    const grouped = {
      approved: rows.filter(r => r.status_group === 'approved'),
      discussion: rows.filter(r => r.status_group === 'discussion'),
      proposed: rows.filter(r => r.status_group === 'proposed'),
    };

    res.json({ success: true, data: grouped, all: rows });
  });
});

// =====================================================================
// 7. DASHBOARD & ANALYTICS STATS API
// =====================================================================

app.get('/api/dashboard/stats', (req, res) => {
  const TOTAL_GRANT = 2500000;

  // Run multiple queries in parallel
  db.get('SELECT SUM(amount) as totalSpent, COUNT(*) as count FROM expenses', [], (errExp, expData) => {
    if (errExp) return res.status(500).json({ success: false, error: errExp.message });

    const totalSpent = expData && expData.totalSpent ? expData.totalSpent : 0;
    const remainingBalance = TOTAL_GRANT - totalSpent;
    const expenseCount = expData && expData.count ? expData.count : 0;

    // Get category breakdown
    db.all('SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses GROUP BY category ORDER BY total DESC', [], (errCat, catData) => {
      if (errCat) return res.status(500).json({ success: false, error: errCat.message });

      // Get complaint metrics
      db.all('SELECT status, priority, COUNT(*) as count FROM complaints GROUP BY status, priority', [], (errCmp, cmpRows) => {
        if (errCmp) return res.status(500).json({ success: false, error: errCmp.message });

        db.all('SELECT status, COUNT(*) as count FROM complaints GROUP BY status', [], (errStat, statRows) => {
          if (errStat) return res.status(500).json({ success: false, error: errStat.message });

          const statsObj = {
            total: 0,
            pending: 0,
            inProgress: 0,
            resolved: 0,
            rejected: 0,
            critical: 0,
          };

          statRows.forEach(r => {
            statsObj.total += r.count;
            if (r.status === 'Pending') statsObj.pending = r.count;
            if (r.status === 'In Progress') statsObj.inProgress = r.count;
            if (r.status === 'Resolved') statsObj.resolved = r.count;
            if (r.status === 'Rejected') statsObj.rejected = r.count;
          });

          cmpRows.forEach(r => {
            if (r.priority === 'Critical') statsObj.critical += r.count;
          });

          res.json({
            success: true,
            data: {
              annualGrant: TOTAL_GRANT,
              totalSpent,
              remainingBalance,
              expenseCount,
              categories: catData,
              fundSources: [
                { name: 'Central Government Grants (MGNREGA, 15th FC)', amount: 1500000, percentage: 60 },
                { name: 'State Government Funds', amount: 700000, percentage: 28 },
                { name: 'Local Panchayat Tax Revenue', amount: 300000, percentage: 12 },
              ],
              complaintsSummary: statsObj
            }
          });
        });
      });
    });
  });
});

// Root & Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Phulera Panchayat Expense Tracker API', timestamp: new Date().toISOString() });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Panchayat Expense Tracker Backend running on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
});
