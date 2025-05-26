# Odit Gouvernance - Application de Gestion Immobilière

Application web SaaS pour la gestion immobilière, permettant la gestion des immeubles, des appartements, des charges et des locataires.

## Fonctionnalités

- 🔐 Authentification et gestion des utilisateurs
- 🏢 Gestion des immeubles et des appartements
- 👥 Gestion des locataires
- 💰 Gestion des charges et des dépenses
- 📊 Tableaux de bord et rapports
- 🔑 Clés de répartition personnalisables

## Technologies utilisées

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Zustand

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd odit-gouvernance
```

2. Installer les dépendances du backend
```bash
cd backend
npm install
```

3. Installer les dépendances du frontend
```bash
cd ../frontend
npm install
```

4. Configurer les variables d'environnement
```bash
# Dans le dossier backend
cp .env.example .env
# Éditer le fichier .env avec vos configurations

# Dans le dossier frontend
cp .env.example .env.local
# Éditer le fichier .env.local avec vos configurations
```

5. Démarrer les serveurs de développement
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Structure du projet

```
odit-gouvernance/
├── backend/               # API NestJS
│   ├── src/
│   │   ├── modules/      # Modules de l'application
│   │   ├── entities/     # Entités TypeORM
│   │   ├── common/       # Code partagé
│   │   └── main.ts       # Point d'entrée
│   └── test/             # Tests
│
└── frontend/             # Application Next.js
    ├── src/
    │   ├── app/         # Pages et composants
    │   ├── components/  # Composants réutilisables
    │   ├── services/    # Services API
    │   └── store/       # État global
    └── public/          # Assets statiques
```

## Rôles utilisateurs

- SUPER_ADMIN : Accès complet à toutes les fonctionnalités
- PROPRIETAIRE : Gestion de ses immeubles et appartements
- GESTIONNAIRE : Gestion des immeubles assignés
- COPROPRIETAIRE : Accès limité à ses informations

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 