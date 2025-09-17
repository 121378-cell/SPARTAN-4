#!/bin/bash
# Script para configurar variables de entorno en Vercel

echo "🔧 Configurando variables de entorno en Vercel..."

# Variables de entorno para producción
vercel env add VITE_API_URL "https://spartan-4-backend.up.railway.app/api" production
vercel env add VITE_GEMINI_API_KEY "AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8" production
vercel env add NODE_ENV "production" production

# Variables de entorno para preview
vercel env add VITE_API_URL "https://spartan-4-backend.up.railway.app/api" preview
vercel env add VITE_GEMINI_API_KEY "AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8" preview
vercel env add NODE_ENV "production" preview

# Variables de entorno para desarrollo
vercel env add VITE_API_URL "http://localhost:3001/api" development
vercel env add VITE_GEMINI_API_KEY "AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8" development
vercel env add NODE_ENV "development" development

echo "✅ Variables de entorno configuradas en Vercel"
echo "🚀 Ejecutando nuevo deploy..."
vercel --prod

echo "🎉 Deploy completado con nuevas variables de entorno"