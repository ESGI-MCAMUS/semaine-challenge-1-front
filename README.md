# Semaine Challenge 1 — Front

## 🖥️ Run the project

### 📦 Install dependencies

```bash
npm install
```

### 🚀 Run the project

```bash
npm run dev
```

The project will be available at [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

## App deployement

[![💻 Deploy to dev](https://github.com/ESGI-MCAMUS/semaine-challenge-1-front/actions/workflows/deploy-developement.yml/badge.svg)](https://github.com/ESGI-MCAMUS/semaine-challenge-1-front/actions/workflows/deploy-developement.yml)
[![🖥️ Deploy to prod](https://github.com/ESGI-MCAMUS/semaine-challenge-1-front/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/ESGI-MCAMUS/semaine-challenge-1-front/actions/workflows/deploy-production.yml)

We're using GitHub Actions in order to deploy the app on the development and production server.

### How it works? 

Both CIs (dev and prod) are using those steps in order to deploy the app:
1. 💾 Build env: It'll create a `.env` file with the proper values for the targeted environment
2. ⚙️ Generating .htaccess for the server: It'll create and store the `.htaccess` stored in the GitHub Actions secrets 
3. 🔑 Generate JWT keys: It'll create the `public.pem` and `private.pem`
4. 📦 Generate vendor autoload: It'll generate the vendors in order to make it work outside of the Docker
5. 📤 Upload to server: It'll connect to the FTP server and upload the project

### How to trigger those GitHub Actions?

- `deploy-to-dev`: It'll trigger automatically when some code is pushed to master branch
- `deploy-to-prod`: It'll trigger whenever you create a new release on GitHub
