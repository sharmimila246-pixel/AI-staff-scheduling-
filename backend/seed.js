const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Staff = require('./models/Staff');
const Schedule = require('./models/Schedule');
const CalendarEvent = require('./models/CalendarEvent');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_staff_scheduler';
    await mongoose.connect(connStr);
    console.log('Connected to database for seeding...');

    // Clear existing data
    await Staff.deleteMany({});
    await Schedule.deleteMany({});
    await CalendarEvent.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing database records.');

    // 12 Staff Members
    const staffData = [
      {
        name: 'Dr. R. Sharma',
        title: 'Professor',
        department: 'Computer Science',
        email: 'rsharma@college.edu',
        contact: '+91 98765 43210',
        joiningDate: '12 Aug 2015',
        employeeId: 'CS/PROF/01',
        avatarUrl: 'sharma',
        username: 'rsharma',
        password: 'password123',
      },
      {
        name: 'Prof. M. Patel',
        title: 'Associate Professor',
        department: 'Electronics',
        email: 'mpatel@college.edu',
        contact: '+91 98765 43211',
        joiningDate: '15 Jan 2017',
        employeeId: 'EC/ASSOC/01',
        avatarUrl: 'patel',
        username: 'mpatel',
        password: 'password123',
      },
      {
        name: 'Prof. A. Singh',
        title: 'Assistant Professor',
        department: 'Mechanical',
        email: 'asingh@college.edu',
        contact: '+91 98765 43212',
        joiningDate: '20 Jul 2018',
        employeeId: 'ME/ASST/01',
        avatarUrl: 'singh',
        username: 'asingh',
        password: 'password123',
      },
      {
        name: 'Dr. P. Verma',
        title: 'Associate Professor',
        department: 'Civil Engineering',
        email: 'pverma@college.edu',
        contact: '+91 98765 43213',
        joiningDate: '10 Feb 2016',
        employeeId: 'CE/ASSOC/02',
        avatarUrl: 'verma',
        username: 'pverma',
        password: 'password123',
      },
      {
        name: 'Prof. S. Gupta',
        title: 'Assistant Professor',
        department: 'Mathematics',
        email: 'sgupta@college.edu',
        contact: '+91 98765 43214',
        joiningDate: '01 Aug 2019',
        employeeId: 'MA/ASST/02',
        avatarUrl: 'gupta',
        username: 'sgupta',
        password: 'password123',
      },
      {
        name: 'Prof. K. Mehta',
        title: 'Assistant Professor',
        department: 'Physics',
        email: 'kmehta@college.edu',
        contact: '+91 98765 43215',
        joiningDate: '05 Sep 2020',
        employeeId: 'PH/ASST/03',
        avatarUrl: 'mehta',
        username: 'kmehta',
        password: 'password123',
      },
      {
        name: 'Prof. N. Joshi',
        title: 'Assistant Professor',
        department: 'Chemistry',
        email: 'njoshi@college.edu',
        contact: '+91 98765 43216',
        joiningDate: '18 Nov 2019',
        employeeId: 'CH/ASST/04',
        avatarUrl: 'joshi',
        username: 'njoshi',
        password: 'password123',
      },
      {
        name: 'Prof. T. Iyer',
        title: 'Assistant Professor',
        department: 'English',
        email: 'tiyer@college.edu',
        contact: '+91 98765 43217',
        joiningDate: '12 Jan 2021',
        employeeId: 'EN/ASST/05',
        avatarUrl: 'iyer',
        username: 'tiyer',
        password: 'password123',
      },
      {
        name: 'Prof. V. Kumar',
        title: 'Assistant Professor',
        department: 'Management',
        email: 'vkumar@college.edu',
        contact: '+91 98765 43218',
        joiningDate: '10 Jun 2020',
        employeeId: 'MG/ASST/06',
        avatarUrl: 'kumar',
        username: 'vkumar',
        password: 'password123',
      },
      {
        name: 'Prof. D. Shah',
        title: 'Assistant Professor',
        department: 'Commerce',
        email: 'dshah@college.edu',
        contact: '+91 98765 43219',
        joiningDate: '01 Dec 2021',
        employeeId: 'CO/ASST/07',
        avatarUrl: 'shah',
        username: 'dshah',
        password: 'password123',
      },
      {
        name: 'Prof. R. Nair',
        title: 'Assistant Professor',
        department: 'IT',
        email: 'rnair@college.edu',
        contact: '+91 98765 43220',
        joiningDate: '15 Mar 2022',
        employeeId: 'IT/ASST/08',
        avatarUrl: 'nair',
        username: 'rnair',
        password: 'password123',
      },
      {
        name: 'Prof. P. Reddy',
        title: 'Assistant Professor',
        department: 'ECE',
        email: 'preddy@college.edu',
        contact: '+91 98765 43221',
        joiningDate: '01 Jul 2022',
        employeeId: 'EC/ASST/09',
        avatarUrl: 'reddy',
        username: 'preddy',
        password: 'password123',
      },
    ];

    // Seed Staff
    const createdStaff = [];
    for (const staff of staffData) {
      const newStaff = new Staff(staff);
      await newStaff.save();
      createdStaff.push(newStaff);
    }
    console.log(`Successfully seeded ${createdStaff.length} staff members.`);

    // Find profiles to associate schedules with
    const sharma = createdStaff.find(s => s.name === 'Dr. R. Sharma');
    const patel = createdStaff.find(s => s.name === 'Prof. M. Patel');
    const singh = createdStaff.find(s => s.name === 'Prof. A. Singh');

    // Default schedules template function to generate structured tables
    const generateScheduleData = (staffId, year, subjectCode, defaultLabName, defaultLabRoom) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (1st & 3rd)'];
      const periods = [
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:15 - 12:15', // break
        '12:15 - 01:15',
        '02:00 - 03:00',
        '03:00 - 04:00'
      ];

      const list = [];

      days.forEach(day => {
        periods.forEach((time, index) => {
          if (index === 2) {
            // Break
            list.push({
              staffId,
              year,
              day,
              timeSlot: time,
              subject: 'Break',
              room: '',
            });
            return;
          }

          // Generate subjects dynamically or specifically
          let sub = '';
          let rm = '';

          if (year === '1st Year') {
            if (day === 'Monday') {
              if (index === 0 || index === 1) { sub = 'CS101'; rm = 'A1'; }
              if (index === 3) { sub = 'Eng101'; rm = 'C1'; }
              if (index === 4) { sub = 'Lab (CS101)'; rm = 'Lab1'; }
              if (index === 5) { sub = 'Mentoring'; rm = ''; }
            } else if (day === 'Tuesday') {
              if (index === 0 || index === 1) { sub = 'Math101'; rm = 'A1'; }
              if (index === 3) { sub = 'CS101'; rm = 'A1'; }
              if (index === 4) { sub = 'Lib'; rm = ''; }
              if (index === 5) { sub = 'Seminar'; rm = ''; }
            } else if (day === 'Wednesday') {
              if (index === 0 || index === 1) { sub = 'CS101'; rm = 'A1'; }
              if (index === 3) { sub = 'Math101'; rm = 'A1'; }
              if (index === 4) { sub = 'Lab (CS101)'; rm = 'Lab1'; }
              if (index === 5) { sub = 'NPTEL'; rm = ''; }
            } else if (day === 'Thursday') {
              if (index === 0) { sub = 'Eng101'; rm = 'A1'; }
              if (index === 1) { sub = 'CS101'; rm = 'C1'; }
              if (index === 3) { sub = 'CS101'; rm = 'B1'; }
              if (index === 4) { sub = 'Sports'; rm = ''; }
              if (index === 5) { sub = 'Mentoring'; rm = ''; }
            } else if (day === 'Friday') {
              if (index === 0) { sub = 'CS101'; rm = 'A1'; }
              if (index === 1) { sub = 'Eng101'; rm = 'A1'; }
              if (index === 3) { sub = 'Math101'; rm = 'A1'; }
              if (index === 4) { sub = 'Mentoring'; rm = ''; }
              if (index === 5) { sub = 'Library'; rm = ''; }
            } else {
              // Saturday
              if (index === 0 || index === 1) { sub = 'CS101'; rm = 'A1'; }
              if (index === 3 || index === 4) { sub = 'Lab (CS101)'; rm = 'Lab1'; }
              if (index === 5) { sub = 'Seminar'; rm = ''; }
            }
          } else if (year === '2nd Year') {
            if (day === 'Monday') {
              if (index === 0) { sub = 'EC201'; rm = 'A2'; }
              if (index === 1) { sub = 'Signals'; rm = 'A2'; }
              if (index === 3) { sub = 'Math201'; rm = 'C2'; }
              if (index === 4) { sub = 'Lab (EC201)'; rm = 'Lab2'; }
              if (index === 5) { sub = 'Seminar'; rm = ''; }
            } else if (day === 'Tuesday') {
              if (index === 0 || index === 1) { sub = 'Signals'; rm = 'B2'; }
              if (index === 3) { sub = 'EC201'; rm = 'A2'; }
              if (index === 4) { sub = 'Mentoring'; rm = ''; }
              if (index === 5) { sub = 'Sports'; rm = ''; }
            } else if (day === 'Wednesday') {
              if (index === 0 || index === 1) { sub = 'EC201'; rm = 'A2'; }
              if (index === 3) { sub = 'EC201'; rm = 'C2'; }
              if (index === 4) { sub = 'Lab (EC201)'; rm = 'Lab2'; }
              if (index === 5) { sub = 'Tutoring'; rm = ''; }
            } else if (day === 'Thursday') {
              if (index === 0) { sub = 'EDC'; rm = 'A2'; }
              if (index === 1) { sub = 'EC201'; rm = 'B2'; }
              if (index === 3) { sub = 'EDC'; rm = 'B2'; }
              if (index === 4) { sub = 'Library'; rm = ''; }
              if (index === 5) { sub = 'Mentoring'; rm = ''; }
            } else if (day === 'Friday') {
              if (index === 0) { sub = 'Math201'; rm = 'A2'; }
              if (index === 1) { sub = 'EC201'; rm = 'B2'; }
              if (index === 3) { sub = 'Signals'; rm = 'A2'; }
              if (index === 4) { sub = 'Library'; rm = ''; }
              if (index === 5) { sub = 'Mentoring'; rm = ''; }
            } else {
              // Saturday
              if (index === 0) { sub = 'EC201'; rm = 'A2'; }
              if (index === 1) { sub = 'Signals'; rm = 'B2'; }
              if (index === 3) { sub = 'Lab (EDC)'; rm = 'Lab2'; }
              if (index === 4) { sub = 'NPTEL'; rm = ''; }
              if (index === 5) { sub = 'Library'; rm = ''; }
            }
          } else {
            // 3rd Year
            if (day === 'Monday') {
              if (index === 0 || index === 1) { sub = 'ME301'; rm = 'A3'; }
              if (index === 3) { sub = 'Machine Design'; rm = 'C3'; }
              if (index === 4) { sub = 'Lab (ME301)'; rm = 'Lab3'; }
              if (index === 5) { sub = 'Mentoring'; rm = ''; }
            } else if (day === 'Tuesday') {
              if (index === 0) { sub = 'Thermo'; rm = 'B3'; }
              if (index === 1) { sub = 'ME301'; rm = 'A3'; }
              if (index === 3) { sub = 'Machine Design'; rm = 'C3'; }
              if (index === 4) { sub = 'Library'; rm = ''; }
              if (index === 5) { sub = 'Seminar'; rm = ''; }
            } else if (day === 'Wednesday') {
              if (index === 0 || index === 1) { sub = 'ME301'; rm = 'A3'; }
              if (index === 3) { sub = 'Thermo'; rm = 'B3'; }
              if (index === 4) { sub = 'Lab (ME301)'; rm = 'Lab3'; }
              if (index === 5) { sub = 'Sports'; rm = ''; }
            } else if (day === 'Thursday') {
              if (index === 0) { sub = 'Machine Design'; rm = 'A3'; }
              if (index === 1) { sub = 'Machine Design'; rm = 'C3'; }
              if (index === 3) { sub = 'ME301'; rm = 'B3'; }
              if (index === 4) { sub = 'Mentoring'; rm = ''; }
              if (index === 5) { sub = 'Tutoring'; rm = ''; }
            } else if (day === 'Friday') {
              if (index === 0) { sub = 'Thermo'; rm = 'A3'; }
              if (index === 1) { sub = 'ME301'; rm = 'B3'; }
              if (index === 3) { sub = 'Thermo'; rm = 'A3'; }
              if (index === 4) { sub = 'NPTEL'; rm = ''; }
              if (index === 5) { sub = 'Library'; rm = ''; }
            } else {
              // Saturday
              if (index === 0 || index === 1) { sub = 'Thermo'; rm = 'A3'; }
              if (index === 3) { sub = 'Machine Design'; rm = 'C3'; }
              if (index === 4) { sub = 'Lab (ME301)'; rm = 'Lab3'; }
              if (index === 5) { sub = 'Seminar'; rm = ''; }
            }
          }

          list.push({
            staffId,
            year,
            day,
            timeSlot: time,
            subject: sub,
            room: rm,
          });
        });
      });

      return list;
    };

    // We will populate schedules for ALL 12 staff, defaulting to:
    // Sharma -> 1st Year primarily, but we add all years so they can navigate tabs
    // Patel -> 2nd Year primarily, but we add all years
    // Singh -> 3rd Year primarily, but we add all years
    // For other staff, we generate automatic schedules
    for (const staff of createdStaff) {
      const sh1 = generateScheduleData(staff._id, '1st Year', 'CS101', 'Lab (CS101)', 'Lab1');
      const sh2 = generateScheduleData(staff._id, '2nd Year', 'EC201', 'Lab (EDC)', 'Lab2');
      const sh3 = generateScheduleData(staff._id, '3rd Year', 'ME301', 'Lab (ME301)', 'Lab3');

      await Schedule.insertMany([...sh1, ...sh2, ...sh3]);
    }
    console.log('Seeded schedule tables for all staff.');

    // Seed Calendar Events (May 2024)
    // 1st and 3rd Saturdays are working: 11th and 18th (Wait: in May 2024, Saturdays are 4th, 11th, 18th, 25th)
    // 1st working Saturday = 11th, 3rd working Saturday = 18th. (Actually, 1st Sat is 4th, 2nd is 11th, 3rd is 18th, 4th is 25th)
    // Wait, in the image, "Working Saturday" is highlighted on Saturday 11th and Saturday 18th of May 2024.
    // Sunday is Holiday. Mon-Fri are Class Days. 2nd & 4th Saturdays are holidays.
    const calendarEvents = [];
    const classDays = [
      1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29, 30, 31
    ];
    const workingSaturdays = [11, 18];
    const holidays = [4, 5, 12, 19, 25, 26]; // Sundays and 2nd & 4th Saturdays

    for (let day = 1; day <= 31; day++) {
      const dateStr = `2024-05-${day.toString().padStart(2, '0')}`;
      let type = 'Class Day';
      let desc = 'Regular classes scheduled';

      if (workingSaturdays.includes(day)) {
        type = 'Working Saturday';
        desc = 'Classes follow Saturday timetable';
      } else if (holidays.includes(day)) {
        type = 'Holiday';
        desc = day % 7 === 5 || day % 7 === 6 ? 'Weekend Holiday' : 'Public Holiday';
      }

      calendarEvents.push({
        date: dateStr,
        type,
        description: desc,
      });
    }

    await CalendarEvent.insertMany(calendarEvents);
    console.log('Seeded calendar events for May 2024.');

    // Seed Notifications for all staff
    for (const staff of createdStaff) {
      const staffNotifications = [
        {
          staffId: staff._id,
          title: 'New Schedule Generated',
          message: 'Schedule for May 2024 has been generated by AI.',
          time: '10:30 AM',
        },
        {
          staffId: staff._id,
          title: 'Class Reminder',
          message: 'You have a class (CS101 - A1) at 09:00 AM tomorrow.',
          time: 'Yesterday',
        },
        {
          staffId: staff._id,
          title: 'Working Saturday',
          message: 'Classes scheduled on 1st & 3rd Saturday of every month.',
          time: '2 Days Ago',
        },
        {
          staffId: staff._id,
          title: 'Schedule Updated',
          message: 'Your schedule has been updated. Please check.',
          time: '5 Days Ago',
        },
      ];
      await Notification.insertMany(staffNotifications);
    }
    console.log('Seeded notifications for all staff.');

    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
