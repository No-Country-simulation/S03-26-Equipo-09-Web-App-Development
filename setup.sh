#!/bin/bash

# ========================================
# SCRIPT DE SETUP AUTOMÁTICO - CRM PROJECT
# ========================================
# Uso: bash setup.sh
# Configura variables de entorno y dependencias

set -e  # Exit on error

echo "🚀 Iniciando configuración del proyecto CRM..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ========================================
# BACKEND SETUP
# ========================================
echo -e "${YELLOW}📦 Configurando Backend...${NC}"

cd Backend/crm-backend

# Check if .env exists
if [ -f .env ]; then
    echo -e "${GREEN}✓ .env ya existe${NC}"
else
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Creado .env desde .env.example${NC}"
        echo -e "${YELLOW}⚠️  Por favor edita .env con tus credenciales locales${NC}"
        echo ""
        echo "Abre el archivo con:"
        echo "  nano .env"
        echo ""
    else
        echo -e "${RED}✗ No se encuentra .env.example${NC}"
        exit 1
    fi
fi

# Build backend (optional - comentado)
# echo "Compilando Backend..."
# ./mvnw clean package -q

echo -e "${GREEN}✓ Backend configurado${NC}"
echo ""

# ========================================
# FRONTEND SETUP
# ========================================
echo -e "${YELLOW}📦 Configurando Frontend...${NC}"

cd ../../Frontend

# Check if .env.local exists
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ .env.local ya existe${NC}"
else
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✓ Creado .env.local desde .env.example${NC}"
    else
        echo -e "${RED}✗ No se encuentra .env.example${NC}"
        exit 1
    fi
fi

# Install dependencies
if [ ! -d node_modules ]; then
    echo "📥 Instalando dependencias con pnpm..."
    pnpm install --frozen-lockfile || {
        echo -e "${YELLOW}⚠️  pnpm no instalado, intentando con npm...${NC}"
        npm install
    }
    echo -e "${GREEN}✓ Dependencias instaladas${NC}"
else
    echo -e "${GREEN}✓ node_modules ya existe${NC}"
fi

echo ""

# ========================================
# VERIFICACIONES FINALES
# ========================================
echo -e "${YELLOW}🔍 Verificaciones finales...${NC}"
echo ""

# Check Database
echo "🗄️  Base de datos:"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL instalado${NC}"
    echo "  Para iniciar PostgreSQL:"
    echo "    sudo service postgresql start  # Linux"
    echo "    brew services start postgresql # macOS"
else
    echo -e "${RED}✗ PostgreSQL no encontrado - instálalo antes de iniciar${NC}"
fi
echo ""

# Check Node
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js instalado ($(node -v))${NC}"
else
    echo -e "${RED}✗ Node.js no encontrado${NC}"
    exit 1
fi
echo ""

# Check Java
echo "☕ Java:"
if command -v java &> /dev/null; then
    echo -e "${GREEN}✓ Java instalado ($(java -version 2>&1 | grep version | head -1))${NC}"
else
    echo -e "${RED}✗ Java no encontrado${NC}"
    exit 1
fi
echo ""

# ========================================
# RESUMEN
# ========================================
echo -e "${GREEN}"
echo "================================================"
echo "✅ CONFIGURACIÓN COMPLETADA"
echo "================================================"
echo -e "${NC}"
echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣  EDITAR VARIABLES DE ENTORNO:"
echo "   Backend:  nano Backend/crm-backend/.env"
echo "   Frontend: nano Frontend/.env.local"
echo ""
echo "2️⃣  INICIAR SERVICIOS (en terminales separadas):"
echo ""
echo "   Terminal 1 - Backend:"
echo "   cd Backend/crm-backend"
echo "   ./mvnw spring-boot:run"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   cd Frontend"
echo "   pnpm run dev"
echo ""
echo "3️⃣  ACCEDER A LA APP:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8080"
echo ""
echo "📚 DOCUMENTACIÓN:"
echo "   • SETUP_SEGURIDAD.md - Guía completa de setup"
echo "   • README.md - Descripción del proyecto"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   • NO commitear .env ni application.properties"
echo "   • Estos archivos están en .gitignore"
echo "   • Contactar al lead si encuentras credenciales expuestas"
echo ""
echo -e "${GREEN}¡Listo!${NC} Ejecuta step 2️⃣ para iniciar el desarrollo 🚀"
echo ""
