// Test the date calculation
const testDate = new Date('2023-06-13T19:30:00');
console.log('Test date:', testDate);
console.log('Day of week (0=Sunday):', testDate.getDay());

// Test time formatting
const hours = testDate.getHours().toString().padStart(2, '0');
const minutes = testDate.getMinutes().toString().padStart(2, '0');
const currentTime = `${hours}:${minutes}`;
console.log('Formatted time:', currentTime);

// Test comparison
console.log('Time comparison result:', currentTime >= '19:00' && currentTime <= '21:00');