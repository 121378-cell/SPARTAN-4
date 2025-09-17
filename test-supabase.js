// Test rápido de conexión a Supabase
// Ejecuta: node test-supabase.js

import { createClient } from '@supabase/supabase-js';

// Usando tus credenciales reales
const supabaseUrl = 'https://dbgksgnfpqndhvhnkhtx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZ2tzZ25mcHFuZGh2aG5raHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDIwNjUsImV4cCI6MjA3MzYxODA2NX0.YicMzy6BB59xLmh1GUZSOMsWIzqewLQ-lARBkh_3GwE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...');
    
    // Test 1: Verificar conexión
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return;
    }
    
    console.log('✅ Conexión exitosa a Supabase!');
    
    // Test 2: Verificar tablas
    const tables = ['users', 'workout_plans', 'progress_data'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Tabla ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabla ${table}: OK`);
      }
    }
    
    console.log('\n🎉 ¡Supabase configurado correctamente!');
    console.log('Ahora puedes actualizar las variables en Vercel y hacer redeploy.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Verifica que:');
    console.log('1. Las variables SUPABASE_URL y SUPABASE_ANON_KEY sean correctas');
    console.log('2. Hayas ejecutado el SQL setup en Supabase');
  }
}

testConnection();