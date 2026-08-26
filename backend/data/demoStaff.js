// In-memory demo staff dataset used when MongoDB is unavailable

const demoStaff = [
  {
    _id: 'demo1',
    name: 'Dr. Alice Kumar',
    title: 'Associate Professor',
    department: 'Computer Science',
    email: 'alice.kumar@example.edu',
    contact: '+91-9876543210',
    joiningDate: '2018-07-01',
    employeeId: 'EMP1001',
    avatarUrl: '',
    username: 'alice.k',
    password: 'alice123',
  },
  {
    _id: 'demo2',
    name: 'Prof. Ravi Sharma',
    title: 'Professor',
    department: 'Mathematics',
    email: 'ravi.sharma@example.edu',
    contact: '+91-9123456780',
    joiningDate: '2015-02-15',
    employeeId: 'EMP1002',
    avatarUrl: '',
    username: 'ravi.s',
    password: 'ravi123',
  },
  {
    _id: 'demo3',
    name: 'Ms. Neha Patel',
    title: 'Lecturer',
    department: 'Physics',
    email: 'neha.patel@example.edu',
    contact: '+91-9012345678',
    joiningDate: '2020-09-01',
    employeeId: 'EMP1003',
    avatarUrl: '',
    username: 'neha.p',
    password: 'neha123',
  }
];

function getAll() {
  return demoStaff;
}

function getById(id) {
  return demoStaff.find(s => s._id === id);
}

function getByUsername(username) {
  return demoStaff.find(s => s.username === username);
}

function updateById(id, changes) {
  const idx = demoStaff.findIndex(s => s._id === id);
  if (idx === -1) return null;
  demoStaff[idx] = { ...demoStaff[idx], ...changes };
  return demoStaff[idx];
}

function deleteById(id) {
  const idx = demoStaff.findIndex(s => s._id === id);
  if (idx === -1) return false;
  demoStaff.splice(idx, 1);
  return true;
}

module.exports = { getAll, getById, getByUsername, updateById, deleteById };
