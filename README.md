# Trening raspored

Nedeljni raspored treninga (Push / Pull / Leg) sa opisima vežbi i slikama.

## Lokalno pokretanje

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Aplikacija: http://localhost:5173  
API: http://localhost:3001  

## Deploy na Vercel (frontend)

1. **GitHub**
   - Kreiraj novi repozitorijum na GitHub-u (npr. `trening-app`).
   - Lokalno:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TVOJ_USER/trening-app.git
   git push -u origin main
   ```

2. **Vercel**
   - Uloguj se na [vercel.com](https://vercel.com), **Add New** → **Project**.
   - Importuj repozitorijum sa GitHub-a.
   - Root Directory ostavi prazno ili postavi na `client` ako Vercel ne prepozna automatski (u `vercel.json` je već `rootDirectory: "client"`).
   - Build i Output Directory: Vercel će uzeti iz `vercel.json` (build u `client`, output `client/dist`). Ako koristiš root repo bez rootDirectory u Vercel UI, u Project Settings stavi **Root Directory** = `client`.
   - **Deploy**.

3. **Backend (API + slike)**  
   Vercel hostuje samo frontend. API (Express + SQLite) treba da radi negde drugde, npr.:
   - **Railway** ([railway.app](https://railway.app)) ili **Render** ([render.com](https://render.com)): novi Web Service, poveži isti GitHub repo, root = `server`, start npr. `npx tsx src/index.ts` ili dodaj `build`/`start` u `server/package.json`.
   - Na Railway/Render uključi **persistent disk** za SQLite (ili koristi njihov PostgreSQL i Prisma adapter ako želiš).
   - Nakon deploya backend-a dobiješ URL, npr. `https://trening-app-api.railway.app`.

4. **Env varijable na Vercel**
   - U Vercel projektu: **Settings** → **Environment Variables**.
   - Dodaj (za produkciju):
     - `VITE_API_URL` = pun URL API-ja, npr. `https://trening-app-api.railway.app/api`
     - `VITE_ASSET_ORIGIN` = isti domen bez `/api`, npr. `https://trening-app-api.railway.app` (da slike vežbi rade).
   - Snimi i ponovo deployuj (Redeploy).

Posle toga frontend na Vercel-u koristi tvoj backend i slike sa Railway/Render-a.
