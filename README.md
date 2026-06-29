# TRICKER — Event Ticket Marketplace

Plateforme web de vente de billets d'événements. Les utilisateurs peuvent parcourir des événements, réserver des tickets, payer via **Stripe Checkout**, et recevoir un billet par email avec **QR code**.

---

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Flux métier](#flux-métier)
- [Flux de paiement Stripe](#flux-de-paiement-stripe)
- [API REST](#api-rest)
- [Routes frontend](#routes-frontend)
- [Modèle de données](#modèle-de-données)
- [Tests](#tests)
- [Dépannage](#dépannage)
- [Sécurité](#sécurité)
- [Améliorations futures](#améliorations-futures)

---

## Vue d'ensemble

**TRICKER** est une marketplace de tickets composée de :

| Composant | Rôle |
|-----------|------|
| **Frontend** | Interface React (auth, événements, panier, paiement) |
| **Backend** | API Spring Boot (auth JWT, CRUD événements, commandes, Stripe) |
| **MySQL** | Persistance des utilisateurs, événements et commandes |
| **Stripe** | Paiement en ligne (Checkout Session) |
| **Cloudinary** | Hébergement des images d'événements |
| **SMTP (Gmail)** | Envoi des billets avec QR code après paiement confirmé |

---

## Architecture

```
┌─────────────────┐     HTTP/REST      ┌──────────────────────┐
│  React + Vite   │ ◄────────────────► │  Spring Boot :8085   │
│  localhost:5173 │                    │  JWT + JPA + Stripe  │
└────────┬────────┘                    └──────────┬───────────┘
         │                                        │
         │ localStorage (panier)                  ├── MySQL
         │                                        ├── Cloudinary
         └── Redirection Stripe Checkout          ├── Stripe API
                                                  └── SMTP + QR Code
```

---

## Stack technique

### Frontend (`/frontend`)

| Technologie | Usage |
|-------------|--------|
| React 19 | UI |
| TypeScript | Typage |
| Vite 8 | Build & dev server |
| Tailwind CSS 3 | Design system |
| React Router 7 | Navigation |
| Axios | Appels API |

### Backend (`/backend`)

| Technologie | Usage |
|-------------|--------|
| Spring Boot 3.5 | API REST |
| Spring Security + JWT | Authentification |
| Spring Data JPA | ORM |
| MySQL | Base de données |
| Stripe Java SDK | Paiements |
| Cloudinary | Upload images |
| JavaMail | Emails |
| ZXing | Génération QR code |
| Lombok | Réduction boilerplate |

---

## Fonctionnalités

### Utilisateur
- Inscription et connexion (JWT)
- Parcourir la liste des événements
- Rechercher un événement par nom
- Ajouter un ticket au panier
- Modifier la quantité
- Payer via Stripe Checkout
- Recevoir un email avec QR code (après confirmation webhook)

### Organisateur / Admin
- Créer un événement (nom, description, date, lieu, prix, stock, image)
- Upload d'image via Cloudinary

### Système
- Commandes avec statuts : `PENDING` → `CONFIRMED` / `FAILED`
- Déduction automatique du stock après paiement confirmé
- Webhook Stripe pour finaliser la commande

---

## Structure du projet

```
Event_Ticket_Marketplace/
├── README.md                 # Documentation globale (ce fichier)
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/example/backendv/
│       ├── config/           # Security, JWT, Cloudinary
│       ├── Controller/       # REST endpoints
│       ├── Entity/           # User, Event, Order
│       ├── Repository/       # JPA repositories
│       ├── Service/          # Logique métier
│       └── resources/
│           └── application.properties
└── frontend/
    ├── package.json
    └── src/
        ├── App.tsx           # Routes principales
        ├── pages/            # Authenticate, Register, Events, Card
        ├── Components/       # NavBar, EventCard, UI, layout
        ├── context/          # UserContext
        ├── lib/              # Utilitaires (formatPrice, errors)
        └── types/            # Types TypeScript
```

---

## Prérequis

| Outil | Version minimale |
|-------|------------------|
| Java | 17 |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8+ |
| Stripe CLI | Dernière (dev local) |
| Compte Stripe | Mode Test |
| Compte Cloudinary | Pour les images |

---

## Installation

### 1. Base de données MySQL

```sql
CREATE DATABASE Ticket_Marketplace;
```

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Le serveur démarre sur **http://localhost:8085**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur **http://localhost:5173**.

---

## Configuration

Configurer `backend/src/main/resources/application.properties` :

```properties
# MySQL
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/Ticket_Marketplace?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE

# Serveur
server.port=8085

# Email (Gmail App Password recommandé)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=votre-email@gmail.com
spring.mail.password=VOTRE_APP_PASSWORD

# Stripe (Dashboard → Developers → API keys → Secret key test)
stripe.secretKey=sk_test_VOTRE_CLE

# Webhook (généré par `stripe listen` en local)
WEBHOOK_SECRET_KEY=whsec_VOTRE_SECRET

# QR Code (répertoire local pour debug)
qrcode.output.directory=/chemin/vers/dossier
```

### Cloudinary

Les credentials Cloudinary sont dans `backend/.../config/CloudinaryConfig.java`.  
Remplacer par vos propres clés ou externaliser via variables d'environnement.

> **Important :** ne jamais committer de vraies clés API, mots de passe ou secrets Stripe sur Git.

---

## Lancement

Pour un environnement de développement complet :

```bash
# Terminal 1 — Backend
cd backend && ./mvnw spring-boot:run

# Terminal 2 — Stripe webhooks (local)
stripe login
stripe listen --forward-to localhost:8085/api/webhooks/stripe

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Copier le `whsec_...` affiché par `stripe listen` dans `WEBHOOK_SECRET_KEY`, puis redémarrer le backend.

---

## Flux métier

### Authentification

```
Register → POST /api/v1/auth/register → JWT + user
Login    → POST /api/v1/auth/authenticate → JWT stocké dans localStorage
```

Le token est envoyé dans le header : `Authorization: Bearer <token>`.

### Événements

```
GET  /api/events          → Liste des événements
POST /api/events          → Créer un événement (auth)
POST /api/cloudinary/upload → Upload image → URL Cloudinary
```

### Panier (localStorage)

```
EventCard → localStorage.setItem("events", JSON.stringify(event))
Card.tsx  → lit "events", affiche le panier
```

---

## Flux de paiement Stripe

```
1. Utilisateur clique "Proceed to Payment"
        ↓
2. POST /api/orders
   - Valide stock
   - Crée commande status = PENDING
   - Retourne Order { id, event, user, quantity, ... }
        ↓
3. POST /api/addingPayment
   - Crée Stripe Checkout Session
   - Retourne URL https://checkout.stripe.com/...
        ↓
4. Redirection navigateur → Stripe Checkout
        ↓
5. Paiement test : 4242 4242 4242 4242
        ↓
6. Webhook POST /api/webhooks/stripe
   - checkout.session.completed
   - status → CONFIRMED
   - Déduit available_tickets
   - Envoie email + QR code
        ↓
7. Redirection → http://localhost:5173/events
```

### Carte de test Stripe

| Champ | Valeur |
|-------|--------|
| Numéro | `4242 4242 4242 4242` |
| Date | Toute date future |
| CVC | `123` |

---

## API REST

Base URL : `http://localhost:8085`

### Authentification — `/api/v1/auth`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription | Non |
| POST | `/authenticate` | Connexion | Non |
| GET | `/AllUsers` | Liste utilisateurs | Non* |

### Événements — `/api/events`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/events` | Liste | Bearer |
| GET | `/events/{id}` | Détail | Bearer |
| POST | `/events` | Créer | Bearer |
| PUT | `/events/{id}` | Modifier | Bearer |
| DELETE | `/events/{id}` | Supprimer | Bearer |

### Commandes — `/api/orders`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/orders` | Liste commandes | Bearer |
| POST | `/orders` | Créer commande PENDING | Bearer |

### Paiement — `/api`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/addingPayment` | Créer session Stripe | Bearer |
| POST | `/webhooks/stripe` | Webhook Stripe | Signature Stripe |

### Médias — `/api/cloudinary/upload`

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/` | Upload image (multipart) | Bearer |

\* La sécurité est actuellement en `permitAll()` en développement.

---

## Routes frontend

| Route | Page | Description |
|-------|------|-------------|
| `/` | Authenticate | Connexion |
| `/register` | Register | Inscription |
| `/events` | Events | Liste + recherche + création événement |
| `/card` | Card | Panier + paiement Stripe |

---

## Modèle de données

### User
| Champ | Type | Description |
|-------|------|-------------|
| id | Long | PK |
| name | String | Nom |
| email | String | Email (unique) |
| password | String | Hash BCrypt |
| role | String | USER / ADMIN |

### Event
| Champ | Type | Description |
|-------|------|-------------|
| id | Long | PK |
| name | String | Nom |
| description | String | Description |
| date | LocalDate | Date |
| price | Double | Prix unitaire (USD) |
| available_tickets | Integer | Stock |
| location | String | Lieu |
| fileName | String | URL image Cloudinary |

### Order
| Champ | Type | Description |
|-------|------|-------------|
| id | Long | PK |
| quantity | Long | Nombre de billets |
| totalPrice | Double | Total calculé |
| status | String | PENDING / CONFIRMED / FAILED |
| user | User | FK |
| event | Event | FK |

---

## Tests

### Build frontend

```bash
cd frontend
npm run build
```

### Build backend

```bash
cd backend
./mvnw clean package -DskipTests
```

### Test manuel du paiement

1. Se connecter
2. Ajouter un événement au panier
3. Aller sur `/card` → **Proceed to Payment**
4. Payer avec `4242 4242 4242 4242`
5. Vérifier dans `stripe listen` : `[200] POST .../webhooks/stripe`
6. Vérifier en BDD : `status = CONFIRMED`

---

## Dépannage

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| 500 sur `/api/addingPayment` | `order.id` null | Vérifier que `/api/orders` retourne l'Order avec id |
| `GrantedAuthority` JSON error | Sérialisation User | `@JsonIgnore` sur méthodes UserDetails |
| `[object Object]` frontend | Erreur API mal affichée | Utiliser `getApiErrorMessage()` |
| Paiement OK mais status PENDING | Webhook non reçu | Lancer `stripe listen`, vérifier `whsec_...` |
| Pas d'email | SMTP mal configuré | Vérifier Gmail App Password |
| Page Stripe ne s'ouvre pas | `/api/addingPayment` non appelé | Vérifier `Card.tsx` flux 2 étapes |
| Image event cassée | Cloudinary mal configuré | Vérifier `CloudinaryConfig.java` |

---

## Sécurité

Recommandations pour la production :

- [ ] Externaliser secrets via variables d'environnement
- [ ] Activer JWT sur toutes les routes sensibles
- [ ] Retirer `permitAll()` dans `SecurityConfiguration`
- [ ] Ne pas exposer `password` dans les réponses JSON
- [ ] Utiliser clés Stripe **Live** uniquement en production
- [ ] Configurer webhook Stripe en production (URL publique HTTPS)
- [ ] Ajouter `.env` et secrets au `.gitignore`

---

## Améliorations futures

- [ ] Page d'accueil (landing)
- [ ] Page détail événement `/events/:id`
- [ ] Historique des commandes utilisateur
- [ ] Page confirmation paiement `/payment/success`
- [ ] Profil utilisateur
- [ ] Protection des routes frontend (`ProtectedRoute`)
- [ ] DTOs backend (éviter exposition entités JPA)
- [ ] Variables d'environnement pour tous les secrets
- [ ] Tests unitaires et d'intégration

---

## Auteurs

Projet **TRICKER** — Event Ticket Marketplace.

---

## Licence

Projet académique / personnel. Préciser la licence si nécessaire.
