/**
 * Test script for Neural Interface Service
 * This script tests the import and basic functionality of the neural interface service
 */

console.log('Testing Neural Interface Service import...');

// Try to import the neural interface service
import('./lib/neural-interface-service.js')
  .then(module => {
    console.log('✅ Neural Interface Service imported successfully');
    console.log('Module contents:', Object.keys(module));
    
    // Try to access the service instance
    if (module.neuralInterfaceService) {
      console.log('✅ Neural Interface Service instance accessible');
    } else {
      console.log('⚠️ Neural Interface Service instance not found');
    }
  })
  .catch(err => {
    console.error('❌ Error importing Neural Interface Service:', err.message);
    
    // Try with .ts extension
    console.log('Trying with .ts extension...');
    import('./lib/neural-interface-service.ts')
      .then(module => {
        console.log('✅ Neural Interface Service imported successfully with .ts extension');
      })
      .catch(err2 => {
        console.error('❌ Error importing Neural Interface Service with .ts extension:', err2.message);
      });
  });