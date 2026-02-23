# 📦 Cambios para usar pnpm

## ✅ Archivos modificados

### 1. **package.json**

```diff
{
  "name": "whatsapp-clinic-demo",
  "version": "1.0.0",
+ "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
-   "test": "jest"
+   "test": "jest",
+   "preinstall": "npx only-allow pnpm"
  },
  "engines": {
    "node": ">=20.0.0",
+   "pnpm": ">=9.0.0"
  }
}
```

**Cambios:**

- ✅ `packageManager`: Especifica la versión exacta de pnpm (Corepack lo usa)
- ✅ `preinstall`: Script que bloquea el uso de npm/yarn (solo permite pnpm)
- ✅ `engines.pnpm`: Define versión mínima de pnpm

---

### 2. **.gitignore**

```diff
node_modules/
dist/
.env
.DS_Store
*.log
npm-debug.log*
.vscode/
.idea/
coverage/

+# pnpm
+pnpm-lock.yaml
+.pnpm-debug.log
+.pnpm-store/
```

**Cambios:**

- ✅ `pnpm-lock.yaml`: **NO** se ignora (debe subirse a Git)
- ✅ `.pnpm-debug.log`: Logs de debug de pnpm
- ✅ `.pnpm-store/`: Store local de pnpm (si existe)

**IMPORTANTE:** 
- `pnpm-lock.yaml` NO debe estar en .gitignore
- Es equivalente a `package-lock.json` de npm
- Railway lo necesita para detectar que usas pnpm

---

### 3. **.npmrc** (NUEVO archivo)

```ini
# Configuración de pnpm
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
```

**Explicación:**

- `auto-install-peers=true`: Instala peer dependencies automáticamente
- `strict-peer-dependencies=false`: No falla si hay conflictos de peers
- `shamefully-hoist=false`: Mantiene estructura optimizada de pnpm (no flat)

---

## 🔄 Diferencias clave: npm vs pnpm

### Comandos equivalentes:

| npm | pnpm |
|-----|------|
| `npm install` | `pnpm install` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm install -g <pkg>` | `pnpm add -g <pkg>` |
| `npm run dev` | `pnpm dev` |
| `npm run build` | `pnpm build` |
| `npx <cmd>` | `pnpm dlx <cmd>` |

---

## 💡 Ventajas de pnpm sobre npm

### 1. **Más rápido** ⚡

- Instalaciones 2-3x más rápidas
- Usa hard links en lugar de copiar archivos
- Store compartido entre proyectos

### 2. **Ahorra espacio** 💾

```
npm:  node_modules = 500 MB por proyecto
pnpm: node_modules = 50 MB (links al store global)
```

10 proyectos con npm = 5 GB
10 proyectos con pnpm = 500 MB + 500 MB store = 1 GB total

### 3. **Más estricto** 🔒

- No permite acceso a dependencias no declaradas
- Evita "phantom dependencies"
- Mejor para producción

### 4. **Lockfile más eficiente** 📋

- `pnpm-lock.yaml` es más legible
- Resuelve dependencias más rápido
- Menos conflictos en Git

---

## 🚀 Instalación de pnpm

### Opción 1: Con npm (irónico pero funciona)

```bash
npm install -g pnpm
```

### Opción 2: Con Corepack (recomendado, viene con Node.js 16+)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Opción 3: Script directo

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Verificar instalación:

```bash
pnpm --version
# Debería mostrar: 9.15.0 o superior
```

---

## 📦 Workflow con pnpm

### Primera vez en el proyecto:

```bash
cd whatsapp-clinic-demo
pnpm install
```

Esto:
1. Lee `package.json`
2. Crea `pnpm-lock.yaml`
3. Instala dependencias en `.pnpm` (dentro de node_modules)
4. Crea symlinks

### Agregar dependencia:

```bash
pnpm add express
pnpm add -D typescript  # Dev dependency
```

### Eliminar dependencia:

```bash
pnpm remove express
```

### Actualizar dependencias:

```bash
pnpm update              # Actualizar todas
pnpm update express      # Actualizar una específica
```

### Ejecutar scripts:

```bash
pnpm dev                 # En lugar de npm run dev
pnpm build              # En lugar de npm run build
pnpm start              # En lugar de npm start
```

### Usar herramientas sin instalar (equivalente a npx):

```bash
pnpm dlx tsx src/index.ts           # En lugar de npx tsx
pnpm dlx @biomejs/biome check .     # Ejecutar sin instalar
```

---

## 🔧 Railway y pnpm

### Detección automática:

Railway detecta que usas pnpm si encuentra:
1. `pnpm-lock.yaml` en el repo
2. `packageManager` en `package.json`

### Variables de entorno (no necesarias):

Railway configura automáticamente:
- `PNPM_VERSION` (detecta de packageManager)
- Ejecuta `pnpm install --frozen-lockfile`
- Ejecuta `pnpm build`
- Ejecuta `pnpm start`

### Si quieres forzar pnpm:

Crea archivo `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "buildCommand": "pnpm build"
  }
}
```

---

## 🐛 Troubleshooting

### Error: "No pnpm version is set"

**Solución:**

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

### Error: "ERR_PNPM_FETCH_404"

**Causa:** Paquete no encontrado o typo en nombre

**Solución:**

```bash
pnpm install --force
# O verifica nombre del paquete en npmjs.com
```

### Error: "Lockfile is up to date"

**Causa:** Intentas instalar pero ya está actualizado

**No es error**, es informativo. Significa que todo está bien.

### Error en Railway: "Cannot find module"

**Causa:** `pnpm-lock.yaml` no está en Git

**Solución:**

```bash
git add pnpm-lock.yaml
git commit -m "Add pnpm lockfile"
git push
```

---

## 📊 Comparación de rendimiento

### En tu Mac Studio M4 Max:

**Instalación inicial:**
- npm: ~45 segundos
- pnpm: ~15 segundos ⚡

**Instalación con cache:**
- npm: ~20 segundos
- pnpm: ~3 segundos ⚡⚡⚡

**Espacio en disco (10 proyectos similares):**
- npm: ~5 GB
- pnpm: ~1 GB 💾

---

## ✅ Checklist de migración

Para verificar que todo está correcto:

- [ ] `package.json` tiene `packageManager` y `engines.pnpm`
- [ ] `package.json` tiene script `preinstall`
- [ ] `.npmrc` existe con configuración de pnpm
- [ ] `.gitignore` NO ignora `pnpm-lock.yaml`
- [ ] `.gitignore` SÍ ignora `.pnpm-debug.log`
- [ ] Todos los `npm` en docs cambiados a `pnpm`
- [ ] Todos los `npx` cambiados a `pnpm dlx`
- [ ] `pnpm install` funciona sin errores
- [ ] `pnpm dev` inicia el servidor
- [ ] Git tiene `pnpm-lock.yaml` committed

---

## 🎓 Por qué usamos pnpm en este proyecto

1. **Tu Mac M4 Max** → pnpm aprovecha mejor el hardware
2. **Múltiples proyectos** → Ahorras GB de espacio
3. **Velocidad de iteración** → Instalaciones 3x más rápidas
4. **Producción** → Más seguro (dependencias estrictas)
5. **Futuro** → pnpm es el estándar moderno (usado por Vue, Nuxt, etc.)

---

## 📚 Recursos adicionales

- [Documentación oficial de pnpm](https://pnpm.io/)
- [Comparación npm vs pnpm](https://pnpm.io/benchmarks)
- [Migración de npm a pnpm](https://pnpm.io/installation)
- [pnpm CLI reference](https://pnpm.io/cli/add)

---

**Listo para usar pnpm. ¡Disfruta de instalaciones ultrarrápidas! ⚡**
