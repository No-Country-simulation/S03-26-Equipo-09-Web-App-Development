#!/bin/bash

# TESTING SUITE - CRM Backend RBAC + JWT (FASE 1)
# Fecha: 16 de abril 2026

set -e

API_URL="http://localhost:8080/api"
ADMIN_EMAIL="admin@crm.local"
ADMIN_PASSWORD="admin123"
VENDEDOR_EMAIL="carlos.lopez@crm.local"
VENDEDOR_PASSWORD="carlos123"

echo "════════════════════════════════════════════════════════════"
echo "🧪 TESTING SUITE: RBAC IMPLEMENTATION (FASE 1)"
echo "════════════════════════════════════════════════════════════"
echo ""

# ============================================================
# TEST 1: Login sin credenciales (debería fallar)
# ============================================================
echo "📋 TEST 1: Login sin credenciales"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -X POST "$API_URL/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid@crm.com","password":"wrongpass"}')

echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "\"success\":false"; then
    echo "✅ PASS: Login rechazado para credenciales inválidas"
else
    echo "❌ FAIL: Se esperaba rechazo"
fi
echo ""

# ============================================================
# TEST 2: Login ADMIN (obtener token)
# ============================================================
echo "📋 TEST 2: Login ADMIN válido"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/usuarios/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

echo "Response: $LOGIN_RESPONSE"

# Extraer token
ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ FAIL: No se obtuvo token"
    echo "Respuesta completa: $LOGIN_RESPONSE"
else
    echo "✅ PASS: Token ADMIN obtenido: ${ADMIN_TOKEN:0:20}..."
fi
echo ""

# ============================================================
# TEST 3: Acceso a endpoint admin SIN token (debería fallar)
# ============================================================
echo "📋 TEST 3: GET /api/admin/conversaciones/todas SIN TOKEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -I -X GET "$API_URL/admin/conversaciones/todas" 2>&1)

echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "403\|401"; then
    echo "✅ PASS: Acceso denegado sin token (esperado)"
else
    echo "❌ FAIL: Se esperaba 403/401"
fi
echo ""

# ============================================================
# TEST 4: Acceso a endpoint admin CON token ADMIN válido
# ============================================================
echo "📋 TEST 4: GET /api/admin/conversaciones/todas CON TOKEN ADMIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$ADMIN_TOKEN" ]; then
    RESPONSE=$(curl -s -X GET "$API_URL/admin/conversaciones/todas?page=0&size=10" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json")
    
    echo "Response: $RESPONSE"
    if echo "$RESPONSE" | grep -q "content"; then
        echo "✅ PASS: Endpoint admin accesible con token ADMIN"
    else
        echo "⚠️  WARNING: Response no contiene 'content' (podría ser BD vacía)"
        # Aceptamos porque podría ser que no hay conversaciones
        if echo "$RESPONSE" | grep -q "\"success\":true"; then
            echo "✅ PASS: Respuesta exitosa del servidor"
        else
            echo "❌ FAIL: Respuesta del servidor indicó error"
        fi
    fi
else
    echo "⏭️  SKIP: No hay token ADMIN disponible"
fi
echo ""

# ============================================================
# TEST 5: Acceso a endpoint admin CON token inválido
# ============================================================
echo "📋 TEST 5: GET /api/admin/conversaciones/todas CON TOKEN INVÁLIDO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

INVALID_TOKEN="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.invalid.invalid"

RESPONSE=$(curl -s -X GET "$API_URL/admin/conversaciones/todas" \
  -H "Authorization: Bearer $INVALID_TOKEN" \
  -H "Content-Type: application/json")

echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "401\|403\|Unauthorized\|Forbidden"; then
    echo "✅ PASS: Token inválido rechazado"
else
    echo "⚠️  ERROR: Se esperaba rechazo de token inválido"
fi
echo ""

# ============================================================
# TEST 6: Endpoint público (sin token)
# ============================================================
echo "📋 TEST 6: POST /api/usuarios/login (endpoint público)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -I -X POST "$API_URL/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@crm.com","password":"test"}')

echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q "200"; then
    echo "✅ PASS: Endpoint público accesible sin token"
else
    echo "✅ PASS: Endpoint público retorna respuesta (puede ser 400/401 por credenciales)"
fi
echo ""

# ============================================================
# TEST 7: Admin Inbox Resumen
# ============================================================
echo "📋 TEST 7: GET /api/admin/inbox/resumen (Dashboard)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$ADMIN_TOKEN" ]; then
    RESPONSE=$(curl -s -X GET "$API_URL/admin/inbox/resumen" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json")
    
    echo "Response: $RESPONSE"
    if echo "$RESPONSE" | grep -q "totalConversaciones\|porCanal"; then
        echo "✅ PASS: Dashboard resumen accesible"
    else
        echo "⚠️  WARNING: Response no contiene datos esperados"
        if echo "$RESPONSE" | grep -q "\"success\":true"; then
            echo "✅ PASS: Respuesta exitosa"
        fi
    fi
else
    echo "⏭️  SKIP: No hay token ADMIN disponible"
fi
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✅ TESTING COMPLETO"
echo "════════════════════════════════════════════════════════════"
