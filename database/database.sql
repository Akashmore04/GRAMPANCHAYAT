-- =====================================================================
-- GRAM PANCHAYAT EXPENSE TRACKER & GRIEVANCE MANAGEMENT SYSTEM
-- Database Schema & Initial Seed Data
-- =====================================================================

-- Drop tables if they already exist (in reverse order of foreign key dependencies)
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS upcoming_plans;
DROP TABLE IF EXISTS complaint_categories;
DROP TABLE IF EXISTS expense_categories;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- 1. USERS TABLE (Admin & Official Authentication)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'official',
    designation VARCHAR(100) DEFAULT 'Panchayat Secretary',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Official Users
INSERT INTO users (email, password, full_name, role, designation) VALUES
('sarpanch@phuleragov.in', 'panchayat2026', 'Manju Devi (Sarpanch)', 'admin', 'Gram Sarpanch'),
('secretary@phuleragov.in', 'panchayat2026', 'Abhishek Tripathi', 'official', 'Panchayat Secretary');

-- ---------------------------------------------------------------------
-- 2. EXPENSE CATEGORIES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expense_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    allocated_budget REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Categories
INSERT INTO expense_categories (name, description, allocated_budget) VALUES
('Gram Sadak Yojana', 'Village road construction, paving, and pothole repairs', 600000),
('School Maintenance', 'Primary and secondary school infrastructure, repairs, and supplies', 250000),
('Water Tank Construction', 'Drinking water pipelines, pump repairs, and storage tank construction', 450000),
('Street Lights', 'Solar street lights, electrical poles, wiring, and bulb replacements', 150000),
('Drainage/Sewage', 'Drain cleaning, concrete sewage canal construction, and rainwater routing', 350000),
('Panchayat Building Renovation', 'Panchayat Bhawan repairs, painting, computer setup, and office WiFi', 200000),
('Public Toilet', 'Community sanitation complexes, latrine maintenance, and running water', 150000),
('Health Camp', 'Village medical checkup camps, medicine distribution, and PHC support', 150000),
('Tree Plantation', 'Afforestation drives, saplings, tree guards, and nursery maintenance', 100000),
('Cleanliness Campaign', 'Swachh Bharat village sanitation, waste bins, and tractor waste disposal', 100000);

-- ---------------------------------------------------------------------
-- 3. EXPENSES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    category_id INTEGER,
    category VARCHAR(100) NOT NULL,
    amount REAL NOT NULL,
    date DATE NOT NULL,
    vendor VARCHAR(150),
    receipt_no VARCHAR(100),
    description TEXT,
    project VARCHAR(150),
    status VARCHAR(50) DEFAULT 'Paid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL
);

-- Seed Initial Expenses
INSERT INTO expenses (title, category, amount, date, vendor, receipt_no, description, project, status) VALUES
('Main Road Phase 1 Paving', 'Gram Sadak Yojana', 450000, '2026-08-15', 'Shree Constructions', 'INV-4022', 'Bitumen and gravel paving of 1.2km connecting link to main highway.', 'Main Road Phase 1', 'Paid'),
('Primary School Roof & Wall Repair', 'School Maintenance', 85000, '2026-08-10', 'Local Builders Co.', 'INV-4010', 'Waterproofing of classroom ceilings and wall plastering before monsoon.', 'Primary School Renovation', 'Paid'),
('Village Water Tank Construction (Phase 1)', 'Water Tank Construction', 250000, '2026-08-05', 'JalTech Solutions', 'INV-3998', 'Excavation, foundation, and RCC pillar structure for 20,000L overhead water tank.', 'Water Tank Construction', 'Paid'),
('Solar Street Lights (50 Units)', 'Street Lights', 125000, '2026-08-01', 'Laxmi Electricals', 'INV-3985', 'Supply and installation of 50 standalone solar LED street light fixtures in Ward 1-4.', 'Street Light Project', 'Paid'),
('Central Market Drainage Canal Desilting', 'Drainage/Sewage', 95000, '2026-07-25', 'Panchayat Sanitation Crew', 'INV-3970', 'Cleaning and desilting 800m open drainage canal along the vegetable market.', 'Market Sanitation', 'Paid'),
('Panchayat Office WiFi & Solar Inverter', 'Panchayat Building Renovation', 45000, '2026-07-20', 'BharatNet & MicroTech', 'INV-3952', 'High-speed broadband optical fiber setup and 2kVA backup solar inverter.', 'Panchayat Digital Center', 'Paid'),
('Community Toilet Complex Door & Plumbing Fixes', 'Public Toilet', 35000, '2026-07-15', 'Janta Plumbers', 'INV-3940', 'Replaced 4 broken PVC doors, installed brass bib taps and overhead PVC storage tank.', 'Swachh Village', 'Paid'),
('Monsoon Health & Vaccination Camp', 'Health Camp', 65000, '2026-07-10', 'District PHC Medical Team', 'INV-3925', 'Free health checkups, blood tests, iron supplements, and water purification tablets.', 'Aarogya Gram', 'Paid'),
('Green Belt Tree Plantation (500 Saplings)', 'Tree Plantation', 40000, '2026-07-05', 'Forest Dept Nursery', 'INV-3910', 'Neem, Peepal, and Banyan saplings along canal banks with bamboo tree guards.', 'Harit Phulera', 'Paid'),
('Village Cleanliness Drive & 20 Steel Dustbins', 'Cleanliness Campaign', 50000, '2026-07-01', 'Swachh Equipments Ltd', 'INV-3890', 'Purchased community color-coded waste bins and protective gear for 8 sanitary workers.', 'Swachh Village', 'Paid');

-- ---------------------------------------------------------------------
-- 4. COMPLAINT CATEGORIES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Complaint Categories
INSERT INTO complaint_categories (name, description) VALUES
('Garbage Not Collected', 'Waste dump, delayed trash collection truck, or roadside littering'),
('Air/Noise/Water Pollution', 'Toxic smoke, chemical emissions, crop burning, or loud noise during quiet hours'),
('Drainage or Sewage Problems', 'Clogged drains, overflowing sewer water, broken storm pipes'),
('Public Sanitation Issues', 'Dirty public toilets, open defecation spots, lack of sanitization'),
('Water Contamination', 'Discolored drinking water, pipeline leaks, foul odor in borewell supply'),
('Industrial/Environmental Violations', 'Illegal dumping, chemical discharge in village ponds, deforestation');

-- ---------------------------------------------------------------------
-- 5. COMPLAINTS TABLE (Citizen Grievances)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium', -- 'Critical', 'High', 'Medium', 'Low'
    date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Resolved', 'Rejected'
    image TEXT, -- Base64 encoded or image URL
    response TEXT, -- Official remarks by Panchayat officials
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Grievances
INSERT INTO complaints (tracking_id, title, category, location, priority, date, description, status, image, response) VALUES
('GRV-101', 'Severe pipeline leakage and muddy water in Ward 4', 'Water Contamination', 'Ward 4, Near Primary Health Center', 'Critical', '2026-08-20', 'Drinking water pipeline broke underground near the clinic. Water is discolored and smelling foul, posing an immediate health hazard to 80+ families.', 'In Progress', NULL, 'Emergency plumbing crew dispatched. Main valve closed for sanitization and pipe replacement underway.'),
('GRV-102', 'Major sewage overflow onto main market walkway', 'Drainage or Sewage Problems', 'Main Bazaar Road, Block B', 'High', '2026-08-19', 'The open drain has choked completely after morning rains. Sewage is overflowing onto shopfronts and pedestrian walkway.', 'Pending', NULL, NULL),
('GRV-103', 'Unattended waste dump near community hall for 4 days', 'Garbage Not Collected', 'Behind Panchayat Bhawan, Ward 2', 'Medium', '2026-08-18', 'Garbage collection truck skipped Ward 2 for four consecutive days. Stray animals are scattering waste across the road.', 'Pending', NULL, NULL),
('GRV-104', 'Broken sanitation stall doors in public toilet complex', 'Public Sanitation Issues', 'Bus Stand Public Sanitation Facility', 'Low', '2026-08-15', 'Latches and door hinges on stall #2 and #3 are broken, causing inconvenience for travelers and women.', 'Resolved', NULL, 'Sanitation maintenance contractor installed new stainless steel latches and hinges on all stalls.'),
('GRV-105', 'Illegal chemical runoff into local irrigation pond', 'Industrial/Environmental Violations', 'Eastern Boundary, Sector 9 Outskirts', 'Critical', '2026-08-21', 'A small processing unit on the edge of the village is releasing untreated chemical discharge directly into the communal irrigation pond.', 'Pending', NULL, NULL),
('GRV-106', 'Heavy smoke and burning plastic smell during night hours', 'Air/Noise/Water Pollution', 'North Ward 1, Near Old Brick Kiln', 'High', '2026-08-17', 'Open burning of rubber tires and plastic scrap occurring late night causing severe breathing difficulties for elderly residents.', 'Resolved', NULL, 'Panchayat team inspected site with village patrol. Offender fined ₹5,000 and burning ceased immediately.');

-- ---------------------------------------------------------------------
-- 6. PROJECTS TABLE (Works & Verified Records)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    vendor VARCHAR(150) NOT NULL,
    allocated_budget REAL NOT NULL,
    actual_spent REAL NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress', -- 'In Progress', 'Completed', 'Planned'
    image VARCHAR(255),
    receipt_ref VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Projects
INSERT INTO projects (title, category, vendor, allocated_budget, actual_spent, status, image, receipt_ref) VALUES
('Main Road Phase 1 Paving', 'Gram Sadak Yojana', 'Shree Constructions', 1500000, 1200000, 'In Progress', '/road.png', 'REC-2026-01'),
('Primary School Roof & Wall Repair', 'School Maintenance', 'Local Builders Co.', 800000, 800000, 'Completed', '/school.png', 'REC-2026-02'),
('Village Water Tank Installation', 'Water Tank Construction', 'JalTech Solutions', 2000000, 500000, 'In Progress', '/water-tank.png', 'REC-2026-03'),
('Community Solar Lights Network', 'Street Lights', 'EcoLight India', 300000, 300000, 'Completed', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', 'REC-2026-04');

-- ---------------------------------------------------------------------
-- 7. UPCOMING PLANS TABLE (Village Development Roadmap)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS upcoming_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    estimated_cost REAL NOT NULL,
    target_date VARCHAR(50),
    status_group VARCHAR(50) NOT NULL, -- 'approved', 'discussion', 'proposed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Upcoming Plans
INSERT INTO upcoming_plans (title, estimated_cost, target_date, status_group) VALUES
('New Anganwadi Child Care Center Building', 450000, 'Oct 2026', 'approved'),
('Main Market Covered Drainage Network', 120000, 'Nov 2026', 'approved'),
('Public Park Fencing & Walking Track', 85000, 'Dec 2026', 'discussion'),
('Panchayat High-Speed WiFi Extension to Ward 5', 15000, 'Dec 2026', 'discussion'),
('Gram Panchayat Digital E-Library Construction', 300000, 'Jan 2027', 'proposed'),
('Rooftop Solar Panels for Primary Health Center', 200000, 'Feb 2027', 'proposed'),
('Veterinary Clinic & Cattle Health Center Upgrade', 150000, 'Mar 2027', 'proposed');
