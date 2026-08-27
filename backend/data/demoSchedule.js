const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (1st & 3rd)'];
const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00',
];

const subjectsByYear = {
  '1st Year': ['CS101', 'Math101', 'Eng101', 'Lab (CS101)', 'Mentoring', 'Seminar'],
  '2nd Year': ['EC201', 'Signals', 'Math201', 'Lab (EC201)', 'Mentoring', 'Library'],
  '3rd Year': ['ME301', 'Thermo', 'Machine Design', 'Lab (ME301)', 'Mentoring', 'NPTEL'],
};

function getAllForStaff(staffId) {
  return Object.entries(subjectsByYear).flatMap(([year, subjects]) => (
    days.flatMap((day, dayIndex) => (
      timeSlots.map((timeSlot, slotIndex) => {
        if (slotIndex === 2) {
          return { _id: `demo-${staffId}-${year}-${dayIndex}-${slotIndex}`, staffId, year, day, timeSlot, subject: 'Break', room: '' };
        }

        const subject = subjects[(dayIndex + slotIndex) % subjects.length];
        return {
          _id: `demo-${staffId}-${year}-${dayIndex}-${slotIndex}`,
          staffId,
          year,
          day,
          timeSlot,
          subject,
          room: subject.includes('Lab') ? 'Lab1' : subject.match(/^(CS|EC|ME|Math)/) ? 'A1' : '',
        };
      })
    ))
  ));
}

module.exports = { getAllForStaff };