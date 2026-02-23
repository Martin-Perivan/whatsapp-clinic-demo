#!/bin/bash

# Script de setup automático para el proyecto
# Verifica e instala pnpm si es necesario

echo "🚀 WhatsApp Clinic Demo - Setup Script"
echo "========================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Descárgalo de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js versión $NODE_VERSION detectada"
    echo "   Se requiere Node.js 20 o superior"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo ""

# Verificar/Instalar pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm no está instalado"
    echo "   Instalando pnpm via corepack..."
    echo ""
    
    # Habilitar corepack
    corepack enable
    
    # Preparar pnpm
    corepack prepare pnpm@9.15.0 --activate
    
    if command -v pnpm &> /dev/null; then
        echo "✅ pnpm $(pnpm -v) instalado correctamente"
    else
        echo "❌ Error al instalar pnpm"
        echo "   Intenta manualmente: npm install -g pnpm"
        exit 1
    fi
else
    echo "✅ pnpm $(pnpm -v) detectado"
fi

echo ""
echo "📦 Instalando dependencias..."
echo ""

# Instalar dependencias
pnpm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencias instaladas correctamente"
    echo ""
    echo "📋 Siguiente paso:"
    echo "   1. Copia .env.example a .env"
    echo "      cp .env.example .env"
    echo ""
    echo "   2. Edita .env con tus credenciales"
    echo "      nano .env"
    echo ""
    echo "   3. Inicia el servidor"
    echo "      pnpm dev"
    echo ""
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi
