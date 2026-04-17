#!/bin/bash

# ============================================================================
# SUITE DE TESTS - FASE 1: RBAC + AUTENTICACION JWT + ENDPOINTS PUBLICOS
# ============================================================================
# Tests ejecutados: 10
# Validaciones: RBAC granular, JWT, acceso público, seguridad
# ============================================================================

set +e

API_BASE="http://localhost:8080/api"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

echo -e "${BLUE}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SUITE DE TESTS - FASE 1: RBAC + JWT AUTHENTICATION${NC}"
echo -e "${BLUE}Fecha: $(date '+%d de %B de %Y %H:%M:%S')${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================================
# TEST 1: LOGIN CON CREDENCIALES INVÁLIDAS
# ============================================================================
echo -e "${YELLOW}📋 TEST 1: Login con credenciales inválidas${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESPONSE=$(curl -s -X POST "$API_BASE/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid@test.com","password":"wrongpass"}')

SUCCESS=$(echo "$RESPONSE" | grep -o '"success":false' || true)

if [ -n "$SUCCESS" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Credenciales rechazadas correctamente"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Debería rechazar credenciales inválidas"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 2: LOGIN ADMIN VÁLIDO - OBTENER JWT TOKEN
# ============================================================================
echo -e "${YELLOW}📋 TEST 2: Login ADMIN válido - JWT Generation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ADMIN_LOGIN=$(curl -s -X POST "$API_BASE/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.local","password":"admin123"}')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
ADMIN_ID=$(echo "$ADMIN_LOGIN" | grep -o '"userId":[0-9]*' | cut -d: -f2)

if [ -n "$ADMIN_TOKEN" ] && [ ${#ADMIN_TOKEN} -gt 50 ]; then
  echo -e "${GREEN}✅ PASS${NC} - JWT token generado (longitud: ${#ADMIN_TOKEN})"
  echo "Token: ${ADMIN_TOKEN:0:40}..."
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - No se pudo generar token JWT"
  echo "Response: $ADMIN_LOGIN"
  ((FAIL++))
  exit 1
fi
echo ""

# ============================================================================
# TEST 3: ENDPOINT PROTEGIDO SIN TOKEN (403 FORBIDDEN)
# ============================================================================
echo -e "${YELLOW}📋 TEST 3: GET /api/admin/conversaciones/todas SIN token${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE/admin/conversaciones/todas")

if [ "$HTTP_CODE" == "403" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Retorna HTTP 403 Forbidden sin token"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Esperaba 403, obtuvo $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 4: ADMIN ACCEDE A ENDPOINT PROTEGIDO (200 OK)
# ============================================================================
echo -e "${YELLOW}📋 TEST 4: GET /api/admin/conversaciones/todas CON token ADMIN${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ADMIN_RESPONSE=$(curl -s -X GET "$API_BASE/admin/conversaciones/todas?page=0&size=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE/admin/conversaciones/todas" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
  
TOTAL=$(echo "$ADMIN_RESPONSE" | grep -o '"totalElements":[0-9]*' | cut -d: -f2)

if [ "$HTTP_CODE" == "200" ] && [ ! -z "$TOTAL" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Admin accede a endpoint (HTTP 200, $TOTAL conversaciones)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Error accediendo endpoint admin"
  echo "HTTP: $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 5: TOKEN INVÁLIDO RECHAZADO (403)
# ============================================================================
echo -e "${YELLOW}📋 TEST 5: GET /api/admin/... CON token inválido${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE/admin/conversaciones/todas" \
  -H "Authorization: Bearer invalid-token-xyz")

if [ "$HTTP_CODE" == "403" ] || [ "$HTTP_CODE" == "401" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Token inválido rechazado (HTTP $HTTP_CODE)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Debería rechazar token inválido, obtuvo $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 6: RBAC GRANULAR - VENDEDOR NO ACCEDE ENDPOINT ADMIN
# ============================================================================
echo -e "${YELLOW}📋 TEST 6: Vendedor intenta acceder endpoint ADMIN-only${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VENDEDOR_LOGIN=$(curl -s -X POST "$API_BASE/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.lopez@crm.local","password":"carlos123"}')

VENDEDOR_TOKEN=$(echo "$VENDEDOR_LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE/admin/conversaciones/todas" \
  -H "Authorization: Bearer $VENDEDOR_TOKEN")

if [ "$HTTP_CODE" == "403" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Vendedor rechazado en endpoint ADMIN-only (HTTP 403)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Vendedor debería ser rechazado, obtuvo HTTP $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 7: ENDPOINT PÚBLICO - VENDEDORES
# ============================================================================
echo -e "${YELLOW}📋 TEST 7: GET /api/usuarios/vendedores (endpoint público)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VENDEDORES_RESPONSE=$(curl -s -X GET "$API_BASE/usuarios/vendedores")
COUNT=$(echo "$VENDEDORES_RESPONSE" | grep -o '"role":"VENDEDOR"' | wc -l)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE/usuarios/vendedores")

if [ "$HTTP_CODE" == "200" ] && [ $COUNT -gt 0 ]; then
  echo -e "${GREEN}✅ PASS${NC} - Endpoint público accesible ($COUNT vendedores retornados)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Error accediendo endpoint público de vendedores"
  echo "HTTP: $HTTP_CODE, Count: $COUNT"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 8: ENDPOINT PÚBLICO - METRICAS
# ============================================================================
echo -e "${YELLOW}📋 TEST 8: GET /api/metricas/resumen (endpoint público)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

METRICAS_RESPONSE=$(curl -s -X GET "$API_BASE/metricas/resumen")
HAS_DATA=$(echo "$METRICAS_RESPONSE" | grep -o '"totalContactos"' || true)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_BASE/metricas/resumen")

if [ "$HTTP_CODE" == "200" ] && [ -n "$HAS_DATA" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Métricas públicas accesibles (HTTP 200)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Error accediendo metricas públicas"
  echo "HTTP: $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 9: CREAR USUARIO NUEVO (endpoint público)
# ============================================================================
echo -e "${YELLOW}📋 TEST 9: POST /api/usuarios (crear nuevo usuario)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RANDOM_EMAIL="test.user.$(date +%s)@crm.local"
CREATE_RESPONSE=$(curl -s -X POST "$API_BASE/usuarios" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Test User\",\"email\":\"$RANDOM_EMAIL\",\"password\":\"test123\"}")

NEW_USER_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | cut -d: -f2 | head -1)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE/usuarios" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Another User\",\"email\":\"another.$(date +%s)@crm.local\",\"password\":\"pass123\"}")

if [ "$HTTP_CODE" == "201" ] && [ -n "$NEW_USER_ID" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Nuevo usuario creado (ID: $NEW_USER_ID, HTTP 201)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Error creando usuario"
  echo "HTTP: $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# TEST 10: ACTUALIZAR/DESACTIVAR USUARIO (PUT endpoint público)
# ============================================================================
echo -e "${YELLOW}📋 TEST 10: PUT /api/usuarios/{id} (desactivar usuario)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE/usuarios/4" \
  -H "Content-Type: application/json" \
  -d '{"activo":false}')

IS_INACTIVE=$(echo "$UPDATE_RESPONSE" | grep -o '"activo":false' || true)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_BASE/usuarios/4" \
  -H "Content-Type: application/json" \
  -d '{"activo":false}')

if [ "$HTTP_CODE" == "200" ] && [ -n "$IS_INACTIVE" ]; then
  echo -e "${GREEN}✅ PASS${NC} - Usuario actualizado/desactivado (HTTP 200)"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL${NC} - Error actualizando usuario"
  echo "HTTP: $HTTP_CODE"
  ((FAIL++))
fi
echo ""

# ============================================================================
# RESUMEN FINAL
# ============================================================================
TOTAL=$((PASS + FAIL))
PERCENTAGE=$((PASS * 100 / TOTAL))

echo -e "${BLUE}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}RESUMEN DE TESTS${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════════${NC}"
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Pasados: $PASS${NC}"
if [ $FAIL -gt 0 ]; then
  echo -e "${RED}Fallidos: $FAIL${NC}"
else
  echo -e "Fallidos: $FAIL"
fi
echo -e "Porcentaje de Éxito: ${PERCENTAGE}%"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✅ FASE 1 COMPLETADA CON ÉXITO - TODOS LOS TESTS PASARON ${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════════════${NC}"
  exit 0
else
  echo -e "${RED}════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}⚠️  FASE 1 CON FALLOS - REVISAR TESTS FALLIDOS${NC}"
  echo -e "${RED}════════════════════════════════════════════════════════════════════${NC}"
  exit 1
fi
