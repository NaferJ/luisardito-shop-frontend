// Script para verificar comportamiento de autenticación
// Ejecutar con: node test-auth-behavior.js

const API_BASE_URL = 'http://localhost:3001'

// Simular diferentes escenarios de autenticación
async function testAuthScenarios() {
  console.log('🧪 Probando comportamiento de autenticación...\n')

  // Escenario 1: Sin token
  console.log('📋 Escenario 1: Sin token de autenticación')
  try {
    const response = await fetch(`${API_BASE_URL}/api/kick-admin/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    console.log(`  Respuesta: ${response.status} ${response.statusText}`)

    if (response.status === 401) {
      console.log('  ✅ Esperado: 401 Unauthorized sin token')
    } else {
      console.log('  ⚠️  Inesperado: debería devolver 401')
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
  }
  console.log()

  // Escenario 2: Token inválido
  console.log('📋 Escenario 2: Token inválido')
  try {
    const response = await fetch(`${API_BASE_URL}/api/kick-admin/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token_invalido_123'
      }
    })
    console.log(`  Respuesta: ${response.status} ${response.statusText}`)

    if (response.status === 401) {
      console.log('  ✅ Esperado: 401 Unauthorized con token inválido')
    } else {
      console.log('  ⚠️  Inesperado: debería devolver 401')
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
  }
  console.log()

  // Escenario 3: Endpoint de login (para verificar que funciona)
  console.log('📋 Escenario 3: Endpoint de login disponible')
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Cuerpo vacío, solo para ver si responde
    })
    console.log(`  Respuesta: ${response.status} ${response.statusText}`)

    if (response.status === 400 || response.status === 422) {
      console.log('  ✅ Esperado: endpoint funciona (400/422 por datos faltantes)')
    } else if (response.status === 404) {
      console.log('  ❌ Endpoint de login no disponible')
    } else {
      console.log('  ℹ️  Respuesta inesperada pero endpoint responde')
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
  }
  console.log()

  console.log('📊 Análisis:')
  console.log('  - Si todos los endpoints de Kick devuelven 401: ✅ Normal')
  console.log('  - Si el endpoint de login funciona: ✅ Backend operativo')
  console.log('  - El problema está en el frontend manejando los 401s')
  console.log('\n💡 Solución aplicada:')
  console.log('  - Interceptor de Axios modificado para no procesar endpoints /kick')
  console.log('  - Hooks modificados para verificar autenticación antes de llamar')
  console.log('  - Página modificada para cargar de forma más defensiva')
}

testAuthScenarios().catch(console.error)
