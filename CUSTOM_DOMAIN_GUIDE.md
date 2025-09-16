# 🌐 Configuración de Dominio Personalizado para SPARTAN 4

## ✅ Pasos para Configurar tu Dominio

### 1. **Comprar/Configurar Dominio**
```bash
# Ejemplos de dominios sugeridos:
- spartan4.app
- spartan4.fit
- spartan4.health
- spartan4.ai
- myspartan4.com
```

### 2. **Agregar Dominio en Vercel**
```bash
# Comando para agregar dominio
vercel domains add tu-dominio.com

# Verificar dominios
vercel domains ls
```

### 3. **Configurar DNS**
En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

#### Registros DNS requeridos:
```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com

Tipo: A
Nombre: @
Valor: 76.76.19.61
```

#### O usar Vercel como DNS:
```
Nameservers:
- ns1.vercel-dns.com
- ns2.vercel-dns.com
```

### 4. **Configurar en Vercel Dashboard**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto "spartan-4"
3. Ve a Settings → Domains
4. Agrega tu dominio personalizado
5. Configura como dominio principal

### 5. **SSL Automático**
- Vercel configurará HTTPS automáticamente
- Certificado SSL gratuito incluido
- Renovación automática

## 🎯 **Resultado Final**

Tu aplicación estará disponible en:
- `https://tu-dominio.com` (Dominio principal)
- `https://www.tu-dominio.com` (Redirect automático)
- SSL/HTTPS habilitado automáticamente
- CDN global de Vercel

## 🔧 **Comandos para el Setup**

```bash
# 1. Verificar proyecto actual
vercel ls

# 2. Agregar dominio
vercel domains add spartan4.tu-dominio.com

# 3. Verificar configuración
vercel domains ls

# 4. Re-deploy con dominio
vercel --prod
```

## 📱 **Configuración PWA para Dominio**

Actualizar `manifest.json` con tu dominio:
```json
{
  "start_url": "https://tu-dominio.com/",
  "scope": "https://tu-dominio.com/"
}
```

## ✅ **Verificar Funcionamiento**

1. **DNS Propagation**: Usar [whatsmydns.net](https://whatsmydns.net)
2. **SSL Certificate**: Verificar en navegador (candado verde)
3. **PWA**: Probar instalación en móvil
4. **Performance**: Usar Lighthouse para audit

¡Tu aplicación estará en tu dominio personalizado en 24-48 horas!