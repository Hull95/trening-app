# Trening raspored

Nedeljni raspored treninga (Push / Pull / Leg) sa opisima vežbi i slikama.

## Lokalno pokretanje (bez backend-a)

```bash
npm install
npm run dev
```

Aplikacija: http://localhost:5173  

## Deploy na Vercel (sve statički)

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

Sve je u frontendu kao statički sadržaj (podaci + slike iz `client/public/exercises`), tako da ti ne treba poseban backend niti env varijable.
