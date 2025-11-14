# Guide d'Intégration Frontend - Les Astiqueuses Backend

> **Version :** Phase 1 - MVP
> **Date :** Janvier 2025
> **Auteur :** Équipe Backend Les Astiqueuses

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Vue d'ensemble du métier](#vue-densemble-du-métier)
3. [Relations entre entités](#relations-entre-entités)
4. [API Clients](#api-clients)
5. [API Properties (Biens immobiliers)](#api-properties-biens-immobiliers)
6. [API Réservations](#api-réservations)
7. [API Zones d'Intervention](#api-zones-dintervention)
8. [Énumérations et Types](#énumérations-et-types)
9. [Règles Métier](#règles-métier)
10. [Notes pour Développeurs](#notes-pour-développeurs)

---

## Introduction

Ce document présente les API REST du backend Les Astiqueuses pour l'intégration frontend. Il couvre les modules **Clients**, **Properties** (biens immobiliers), **Réservations** et **Zones d'Intervention**.

### Contexte Métier

Les Astiqueuses est une plateforme de gestion de services de nettoyage pour :
- **Particuliers** : Ménage et repassage à domicile (maisons)
- **Clients Airbnb** : Nettoyage d'appartements avec gestion des objets
- **Entreprises** : Nettoyage de bureaux professionnels

---

## Vue d'ensemble du métier

### Client
Un **Client** est une personne ou entreprise qui commande des services de nettoyage.

**Caractéristiques :**
- Peut être de type `INDIVIDUAL`, `BUSINESS` ou `AIRBNB`
- Possède une adresse principale
- Peut avoir un tarif horaire personnalisé
- Peut posséder plusieurs biens immobiliers (Properties)

### Property (Bien immobilier)
Un **Property** est un lieu physique où un service de nettoyage est effectué.

**Caractéristiques :**
- Appartient toujours à un Client
- Peut être de type `APARTMENT`, `OFFICE` ou `HOUSE`
- Contient des informations détaillées (adresse, surface, code INSEE, coordonnées GPS)
- Peut avoir des matériels disponibles sur place
- **Important :** Le type du Property doit correspondre au type du Service pour permettre une réservation

### Service
Un **Service** représente un type de prestation proposée.

**Caractéristiques :**
- Peut être pour `APARTMENT` (Airbnb), `OFFICE` (bureaux) ou `HOUSE` (maisons)
- Possède un tarif horaire standard et optionnellement un tarif préférentiel
- A des contraintes de durée (min, max, incrément)
- Peut avoir des options associées (repassage, vitres, désinfection, etc.)

### Réservation
Une **Réservation** est une demande de service planifiée.

**Caractéristiques :**
- Lie un Client à un Service
- Peut être liée à un Property spécifique (obligatoire pour OFFICE et AIRBNB)
- Peut être ponctuelle (`ONE_TIME`) ou récurrente (`WEEKLY`, `MONTHLY`)
- Contient les informations de prix, options sélectionnées, horaires
- Génère automatiquement un numéro unique (format : `RES-YYYYMMDD-XXXXX`)

### Zone d'Intervention
Une **Zone d'Intervention** définit les communes où l'entreprise propose ses services.

**Caractéristiques :**
- Basée sur le code INSEE de la commune
- Contient les données géographiques (nom, code postal, département, région, GPS)
- Peut être ACTIVE ou INACTIVE
- Permet de valider qu'un Property se situe dans une zone couverte

---

## Relations entre entités

```
┌─────────────┐
│   Client    │
│  (UUID id)  │
└──────┬──────┘
       │
       │ 1:N
       ├──────────────────────────┐
       │                          │
       ▼                          ▼
┌─────────────┐            ┌─────────────┐
│  Property   │            │ Reservation │
│  (Long id)  │            │  (Long id)  │
│  - type     │◄───────────┤  - serviceId│
│  - inseeCode│     0:1    │  - propertyId
└─────────────┘            │  - frequency│
       │                   └──────┬──────┘
       │ N:N                      │
       │                          │ N:1
       ▼                          ▼
┌─────────────┐            ┌─────────────┐
│PropertyMaterial│         │   Service   │
│  - materialId            │  (Long id)  │
│  - quantity │            │  - type     │
└─────────────┘            │  - hourlyRate
                           └─────────────┘
```

**Règles clés :**
1. Un Client peut avoir 0..N Properties
2. Un Client peut avoir 0..N Réservations
3. Une Réservation est toujours liée à 1 Service
4. Une Réservation peut être liée à 0..1 Property
5. **Property.type DOIT égaler Service.type** pour créer une réservation

---

## API Clients

### URL de base
```
/v1/admin/clients
```

### Authentification
**Bearer JWT** - Rôle Admin requis

---

### 1. Créer un client

**POST** `/v1/admin/clients`

Crée un nouveau client actif. En Phase 1, l'admin crée les clients directement sans workflow d'activation.

#### Request Body

```typescript
{
  type: "INDIVIDUAL" | "BUSINESS" | "AIRBNB",  // Obligatoire
  origin: string,                              // Obligatoire (max 50 chars)
  companyName?: string,                        // Obligatoire si type=BUSINESS (max 100)
  firstName?: string,                          // Optionnel pour INDIVIDUAL (max 100)
  lastName: string,                            // Obligatoire (max 100)
  email: string,                               // Obligatoire, unique (max 255)
  phone: string,                               // Obligatoire (format: +33612345678)
  address: string,                             // Obligatoire
  city: string,                                // Obligatoire (max 100)
  postalCode: string,                          // Obligatoire (5 chiffres)
  country?: string,                            // Optionnel (défaut: "France")
  googleId?: string,                           // Optionnel (pour OAuth Google)
  siret?: string,                              // Obligatoire si type=BUSINESS (14 chiffres)
  customHourlyRate?: number,                   // Optionnel (decimal 3,2)
  emailVerified?: boolean,                     // Optionnel (défaut: false)
  phoneVerified?: boolean                      // Optionnel (défaut: false)
}
```

#### Response `201 Created`

```typescript
{
  id: string,                    // UUID
  type: "INDIVIDUAL" | "BUSINESS" | "AIRBNB",
  origin: string,
  companyName: string | null,
  firstName: string,
  lastName: string,
  fullName: string,              // Calculé automatiquement
  email: string,
  phone: string,
  emailVerified: boolean,
  phoneVerified: boolean,
  address: string,
  city: string,
  postalCode: string,
  country: string,
  googleAccount: boolean,
  siret: string | null,
  customHourlyRate: number | null,
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PROSPECT",
  lastLogin: string | null,      // ISO 8601
  createdAt: string,             // ISO 8601
  updatedAt: string,             // ISO 8601
  auditInfo: {
    createdBy: string,
    createdAt: string,
    updatedBy: string,
    updatedAt: string,
    deletedAt: string | null
  }
}
```

#### Erreurs possibles
- `400 Bad Request` : Données invalides
- `403 Forbidden` : Accès refusé (admin uniquement)
- `409 Conflict` : Email ou SIRET déjà utilisé

---

### 2. Récupérer un client par ID

**GET** `/v1/admin/clients/{id}`

#### Path Parameter
- `id` : UUID du client

#### Response `200 OK`
Même structure que la réponse de création.

---

### 3. Lister tous les clients

**GET** `/v1/admin/clients`

#### Query Parameters
- `page` (int, défaut: 0) : Numéro de page (commence à 0)
- `size` (int, défaut: 20) : Taille de la page
- `sortBy` (string, défaut: "createdAt") : Champ de tri
- `sortDirection` (string, défaut: "DESC") : Direction du tri (ASC ou DESC)

#### Response `200 OK`

```typescript
{
  content: Array<ClientResponse>,
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      sorted: boolean,
      empty: boolean
    }
  },
  totalElements: number,
  totalPages: number,
  last: boolean,
  first: boolean,
  numberOfElements: number,
  empty: boolean
}
```

---

### 4. Rechercher des clients

**GET** `/v1/admin/clients/search`

Recherche avec filtres multiples.

#### Query Parameters
- `type` (ClientType, optionnel) : Filtrer par type
- `status` (ClientStatus, optionnel) : Filtrer par statut
- `searchTerm` (string, optionnel) : Recherche dans nom, prénom, email, téléphone, société
- `page`, `size`, `sortBy`, `sortDirection` : Paramètres de pagination

#### Response `200 OK`
Même structure que la liste paginée.

---

### 5. Mettre à jour un client

**PUT** `/v1/admin/clients/{id}`

Tous les champs du body sont optionnels. Seuls les champs fournis sont modifiés.

#### Request Body

```typescript
{
  companyName?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  address?: string,
  city?: string,
  postalCode?: string,
  country?: string,
  siret?: string,
  customHourlyRate?: number,
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PROSPECT",
  emailVerified?: boolean,
  phoneVerified?: boolean
}
```

#### Response `200 OK`
Structure complète du client mis à jour.

---

### 6. Supprimer un client

**DELETE** `/v1/admin/clients/{id}`

Suppression logique (soft delete) : le client reste en base avec `deletedAt` renseigné.

#### Response `204 No Content`

---

### 7. Restaurer un client

**POST** `/v1/admin/clients/{id}/restore`

Restaure un client précédemment supprimé.

#### Response `200 OK`
Client restauré avec `deletedAt = null`.

---

### 8. Statistiques clients

**GET** `/v1/admin/clients/stats`

Retourne des statistiques globales (nombre total, par type, par statut).

#### Response `200 OK`

```typescript
{
  totalClients: number,
  byType: {
    INDIVIDUAL: number,
    BUSINESS: number,
    AIRBNB: number
  },
  byStatus: {
    ACTIVE: number,
    INACTIVE: number,
    SUSPENDED: number,
    PROSPECT: number
  }
}
```

---

## API Properties (Biens immobiliers)

### URL de base
```
/api/v1/properties
```

### Authentification
**Bearer JWT** pour les endpoints admin. Endpoints publics non authentifiés.

---

### 1. Créer un bien immobilier

**POST** `/api/v1/properties`

Crée un nouveau bien immobilier pour un client.

**💡 Astuce :** Si le champ `name` n'est pas fourni, il est généré automatiquement au format : `"{address}, {postalCode} {city}"`

#### Request Body

```typescript
{
  clientId: string,              // Obligatoire (UUID)
  name?: string,                 // Optionnel (max 200) - auto-généré si absent
  type: "APARTMENT" | "OFFICE" | "HOUSE",  // Obligatoire
  address: string,               // Obligatoire (max 500)
  city: string,                  // Obligatoire (max 100)
  postalCode: string,            // Obligatoire (5 chiffres)
  country?: string,              // Optionnel (max 50)
  surfaceArea?: number,          // Optionnel (decimal 6,2) - positif
  floorCount?: number,           // Optionnel (int >= 0)
  reference?: string,            // Optionnel (référence externe - Airbnb, lot, etc.)
  roomCount?: number,            // Optionnel (chambres pour APARTMENT/HOUSE, bureaux pour OFFICE)
  contactName?: string,          // Optionnel (max 100)
  contactPhone?: string,         // Optionnel (format: +33612345678)
  accessInstructions?: {         // Optionnel (JSON clé/valeur)
    [key: string]: string
  },
  comment?: string               // Optionnel (max 1000)
}
```

**Exemple complet :**

```json
{
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Appartement Airbnb - Boulevard Haussmann",
  "type": "APARTMENT",
  "address": "45 Boulevard Haussmann",
  "city": "Paris",
  "postalCode": "75008",
  "country": "France",
  "surfaceArea": 85.5,
  "floorCount": 2,
  "reference": "HM123456",
  "roomCount": 3,
  "contactName": "Jean Dupont",
  "contactPhone": "+33612345678",
  "accessInstructions": {
    "code_portail": "1234A",
    "digicode": "5678B",
    "etage": "3ème"
  },
  "comment": "Prévoir des protections pour le parquet"
}
```

#### Response `201 Created`

```typescript
{
  id: number,
  clientId: string,              // UUID
  name: string,
  type: "APARTMENT" | "OFFICE" | "HOUSE",
  address: string,
  city: string,
  postalCode: string,
  country: string,
  surfaceArea: number | null,
  floorCount: number | null,
  reference: string | null,
  roomCount: number | null,
  contactName: string | null,
  contactPhone: string | null,
  accessInstructions: object | null,
  comment: string | null,
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED",
  createdBy: string,
  updatedBy: string,
  createdAt: string,             // ISO 8601
  updatedAt: string,             // ISO 8601
  deletedAt: string | null       // ISO 8601
}
```

---

### 2. Récupérer un bien par ID

**GET** `/api/v1/properties/{id}`

#### Path Parameter
- `id` : Long (ID du bien)

#### Response `200 OK`
Même structure que la réponse de création.

---

### 3. Rechercher des biens

**GET** `/api/v1/properties`

#### Query Parameters
- `clientId` (UUID, optionnel) : Filtrer par client
- `type` (PropertyType, optionnel) : Filtrer par type de bien
- `status` (PropertyStatus, optionnel) : Filtrer par statut
- `city` (string, optionnel) : Filtrer par ville
- Paramètres de pagination Spring Data

#### Response `200 OK`
Page paginée de PropertyResponse.

---

### 4. Mettre à jour un bien

**PUT** `/api/v1/properties/{id}`

Tous les champs sont optionnels. Seuls les champs fournis sont modifiés.

#### Request Body

```typescript
{
  name?: string,
  type?: "APARTMENT" | "OFFICE" | "HOUSE",
  address?: string,
  city?: string,
  postalCode?: string,
  country?: string,
  surfaceArea?: number,
  floorCount?: number,
  reference?: string,
  roomCount?: number,
  contactName?: string,
  contactPhone?: string,
  accessInstructions?: object,
  comment?: string,
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED"
}
```

#### Response `200 OK`
Bien mis à jour.

---

### 5. Supprimer un bien

**DELETE** `/api/v1/properties/{id}`

Suppression logique (soft delete).

#### Response `204 No Content`

---

### Gestion des Matériels

Les matériels représentent les équipements disponibles sur un bien (aspirateur, balai, produits, etc.).

### 6. Ajouter un matériel à un bien

**POST** `/api/v1/properties/{locationId}/materials`

#### Path Parameter
- `locationId` : Long (ID du bien)

#### Request Body

```typescript
{
  materialId: number,            // Obligatoire
  quantity?: number,             // Optionnel (défaut: 1, >= 1)
  location?: string,             // Optionnel (emplacement dans le bien)
  notes?: string                 // Optionnel (max 500)
}
```

**Exemple :**

```json
{
  "materialId": 5,
  "quantity": 2,
  "location": "Placard sous l'escalier",
  "notes": "Aspirateur neuf, à manipuler avec précaution"
}
```

#### Response `201 Created`

```typescript
{
  id: number,
  propertyId: number,
  materialId: number,
  materialName: string,
  materialCategory: string,
  quantity: number,
  location: string | null,
  notes: string | null,
  createdBy: string,
  createdAt: string,
  deletedAt: string | null
}
```

---

### 7. Lister les matériels d'un bien

**GET** `/api/v1/properties/{locationId}/materials`

#### Response `200 OK`
Array de PropertyMaterialResponse.

---

### 8. Mettre à jour un matériel

**PUT** `/api/v1/properties/{locationId}/materials/{materialId}`

#### Request Body

```typescript
{
  quantity?: number,
  location?: string,
  notes?: string
}
```

---

### 9. Retirer un matériel d'un bien

**DELETE** `/api/v1/properties/{locationId}/materials/{materialId}`

Suppression logique de l'association matériel-bien.

#### Response `204 No Content`

---

### Catalogue de Matériels (Admin)

### 10. Créer un matériel dans le catalogue

**POST** `/api/v1/admin/useful-materials`

Admin uniquement. Ajoute un nouveau matériel au catalogue de référence.

#### Request Body

```typescript
{
  name: string,                  // Obligatoire (max 100)
  description?: string,          // Optionnel (max 500)
  category?: string              // Optionnel (max 50)
}
```

---

### 11. Lister tous les matériels actifs

**GET** `/api/v1/admin/useful-materials`

Admin uniquement. Retourne tous les matériels du catalogue (statut ACTIVE uniquement).

#### Response `200 OK`

```typescript
Array<{
  id: number,
  name: string,
  description: string | null,
  category: string | null,
  status: "ACTIVE" | "INACTIVE",
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}>
```

---

## API Réservations

### URL de base
```
/v1/admin/reservations
```

### Authentification
**Bearer JWT** - Rôle Admin requis

### ⚠️ Important : Idempotence
L'endpoint POST `/v1/admin/reservations` **REQUIERT** un header `Idempotency-Key` pour éviter les doublons de réservations.

---

### 1. Créer une réservation

**POST** `/v1/admin/reservations`

Crée une nouvelle réservation confirmée. En Phase 1, l'admin crée les réservations directement sans statut DRAFT.

#### Headers
- `Authorization` : Bearer {token}
- **`Idempotency-Key`** : string (UUID v4 recommandé) - **OBLIGATOIRE**

#### Request Body

```typescript
{
  clientId: string,              // Obligatoire (UUID)
  serviceId: number,             // Obligatoire
  serviceLocationId?: number,    // Optionnel (OBLIGATOIRE pour services OFFICE et AIRBNB)
  interventionDate: string,      // Obligatoire (format: YYYY-MM-DD, date future)
  startTime: string,             // Obligatoire (format: HH:mm)
  duration: number,              // Obligatoire (minutes, 30-480)
  frequency: "ONE_TIME" | "WEEKLY" | "MONTHLY",  // Obligatoire
  days?: string[],               // Optionnel (voir règles ci-dessous)
  recurrenceEndDate?: string,    // Optionnel (format: YYYY-MM-DD, NULL = illimité)
  selectedOptionIds?: number[],  // Optionnel (IDs des options sélectionnées)
  selectedPaymentMethodId?: number,  // Optionnel
  customHourlyRate?: number,     // Optionnel (si absent, tarif du service utilisé)
  discountType?: "PERCENTAGE" | "FIXED_AMOUNT" | "PROMO_CODE",
  discountValue?: number,        // Optionnel (>= 0)
  notes?: string                 // Optionnel (max 1000)
}
```

**Règles pour `days` selon `frequency` :**
- `ONE_TIME` : `days` doit être NULL ou absent
- `WEEKLY` : `days` = tableau de jours (ex: `["MONDAY", "WEDNESDAY", "FRIDAY"]`)
- `MONTHLY` : `days` = tableau de numéros de jours (ex: `["1", "15", "30"]`)

**Exemple complet :**

```json
{
  "clientId": "550e8400-e29b-41d4-a716-446655440000",
  "serviceId": 5,
  "serviceLocationId": 12,
  "interventionDate": "2025-03-15",
  "startTime": "09:00",
  "duration": 120,
  "frequency": "WEEKLY",
  "days": ["MONDAY", "WEDNESDAY"],
  "recurrenceEndDate": "2025-12-31",
  "selectedOptionIds": [2, 5],
  "selectedPaymentMethodId": 3,
  "customHourlyRate": 25.00,
  "discountType": "PERCENTAGE",
  "discountValue": 10.00,
  "notes": "Prévoir l'accès au garage"
}
```

#### Response `201 Created`

```typescript
{
  id: number,
  number: string,                // Format: "RES-YYYYMMDD-XXXXX"
  clientId: string,              // UUID
  serviceId: number,
  serviceLocationId: number | null,
  interventionDate: string,      // YYYY-MM-DD
  startTime: string,             // HH:mm
  duration: number,              // minutes
  frequency: "ONE_TIME" | "WEEKLY" | "MONTHLY",
  days: string[] | null,
  recurrenceEndDate: string | null,
  selectedPaymentMethodId: number | null,
  hourlyRate: number,            // Tarif appliqué
  amountExclTax: number,         // Montant HT
  vatAmount: number,             // Montant TVA
  amountInclTax: number,         // Montant TTC
  discountType: string | null,
  discountValue: number | null,
  status: "DRAFT" | "PENDING" | "CONFIRMED" | "CANCELLED",
  notes: string | null,
  reservedOptions: Array<{
    id: number,
    serviceOptionId: number,
    serviceOptionName: string,
    appliedRate: number
  }>,
  createdBy: string,
  updatedBy: string,
  createdAt: string,             // ISO 8601
  updatedAt: string              // ISO 8601
}
```

#### Erreurs possibles
- `400 Bad Request` : Validation échouée (date invalide, jours fériés, horaires, etc.)
- `403 Forbidden` : Accès refusé
- `404 Not Found` : Client, service ou property introuvable
- `409 Conflict` : Clé d'idempotence déjà utilisée

---

### 2. Récupérer une réservation par ID

**GET** `/v1/admin/reservations/{id}`

#### Path Parameter
- `id` : Long (ID de la réservation)

#### Response `200 OK`
Même structure que la réponse de création.

---

### 3. Récupérer une réservation par numéro

**GET** `/v1/admin/reservations/number/{number}`

#### Path Parameter
- `number` : string (numéro de réservation, ex: "RES-20250315-00001")

#### Response `200 OK`
Même structure que la réponse de création.

---

### 4. Lister toutes les réservations

**GET** `/v1/admin/reservations`

#### Query Parameters
- `page` (int, défaut: 0)
- `size` (int, défaut: 20)
- `sortBy` (string, défaut: "interventionDate")
- `sortDirection` (string, défaut: "DESC")

#### Response `200 OK`
Page paginée de ReservationResponse.

---

### 5. Rechercher des réservations

**GET** `/v1/admin/reservations/search`

#### Query Parameters
- `clientId` (UUID, optionnel) : Filtrer par client
- `serviceId` (Long, optionnel) : Filtrer par service
- `status` (ReservationStatus, optionnel) : Filtrer par statut
- `frequency` (Frequency, optionnel) : Filtrer par fréquence
- Paramètres de pagination

#### Response `200 OK`
Page paginée de ReservationResponse.

---

### 6. Mettre à jour une réservation

**PUT** `/v1/admin/reservations/{id}`

Tous les champs sont optionnels. Si les options sont modifiées, les montants sont recalculés automatiquement.

#### Request Body

```typescript
{
  interventionDate?: string,     // YYYY-MM-DD (future)
  startTime?: string,            // HH:mm
  duration?: number,             // 30-480 minutes
  days?: string[],
  recurrenceEndDate?: string,
  selectedOptionIds?: number[],
  status?: "DRAFT" | "PENDING" | "CONFIRMED" | "CANCELLED",
  customHourlyRate?: number,
  discountType?: "PERCENTAGE" | "FIXED_AMOUNT" | "PROMO_CODE",
  discountValue?: number,
  notes?: string
}
```

#### Response `200 OK`
Réservation mise à jour.

---

### 7. Supprimer une réservation

**DELETE** `/v1/admin/reservations/{id}`

Suppression logique (soft delete).

#### Response `204 No Content`

---

### 8. Réservations d'un client

**GET** `/v1/admin/reservations/client/{clientId}`

Récupère toutes les réservations d'un client spécifique.

#### Path Parameter
- `clientId` : UUID du client

#### Query Parameters
Paramètres de pagination standard.

#### Response `200 OK`
Page paginée de ReservationResponse.

---

## API Zones d'Intervention

### URL de base
```
/v1
```

### Authentification
- Endpoints admin (`/v1/admin/*`) : Bearer JWT - Rôle Admin requis
- Endpoints publics (`/v1/public/*`) : Aucune authentification

---

### Endpoints Admin

### 1. Créer une zone d'intervention

**POST** `/v1/admin/intervention-zones`

Crée une nouvelle zone d'intervention à partir d'un code INSEE. Les données (nom, code postal, département, région, GPS) sont automatiquement récupérées depuis le fichier CSV des communes.

#### Request Body

```typescript
{
  inseeCode: string              // Obligatoire (code INSEE)
}
```

**Exemple :**

```json
{
  "inseeCode": "75101"
}
```

#### Response `201 Created`

```typescript
{
  id: number,
  inseeCode: string,
  postalName: string,            // Ex: "PARIS 01"
  postalCode: string,            // Ex: "75001"
  communeName: string,           // Ex: "Paris 01"
  departmentCode: string,        // Ex: "75"
  departmentName: string,        // Ex: "Paris"
  regionCode: string,            // Ex: "11"
  regionName: string,            // Ex: "Île-de-France"
  latitude: number,              // Coordonnées GPS
  longitude: number,
  status: "ACTIVE" | "INACTIVE",
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string
}
```

---

### 2. Récupérer une zone par ID

**GET** `/v1/admin/intervention-zones/{id}`

#### Path Parameter
- `id` : Long (ID de la zone)

#### Response `200 OK`
Même structure que la réponse de création.

---

### 3. Lister toutes les zones

**GET** `/v1/admin/intervention-zones`

Récupère toutes les zones (actives ET inactives).

#### Response `200 OK`
Array de InterventionZoneResponse.

---

### 4. Mettre à jour le statut d'une zone

**PUT** `/v1/admin/intervention-zones/{id}`

Met à jour uniquement le statut de la zone (ACTIVE/INACTIVE).

#### Request Body

```typescript
{
  status: "ACTIVE" | "INACTIVE"  // Obligatoire
}
```

#### Response `200 OK`
Zone mise à jour.

---

### 5. Supprimer une zone

**DELETE** `/v1/admin/intervention-zones/{id}`

Suppression logique (soft delete).

#### Response `204 No Content`

---

### Endpoints Publics

### 6. Lister les communes actives (Public)

**GET** `/v1/public/communes`

**Aucune authentification requise.**

Récupère la liste de toutes les communes où l'entreprise opère (zones ACTIVE uniquement).

#### Response `200 OK`

```typescript
Array<{
  inseeCode: string,
  postalName: string,
  postalCode: string
}>
```

**Exemple :**

```json
[
  {
    "inseeCode": "75101",
    "postalName": "PARIS 01",
    "postalCode": "75001"
  },
  {
    "inseeCode": "75102",
    "postalName": "PARIS 02",
    "postalCode": "75002"
  }
]
```

---

### 7. Rechercher des communes (Public)

**GET** `/v1/public/communes/search`

**Aucune authentification requise.**

Recherche des communes dans le fichier CSV complet par code INSEE, nom, code postal, département ou région. Retourne jusqu'à 50 suggestions. Les données proviennent du cache avec expiration de 1h.

#### Query Parameters
- `searchTerm` (string, obligatoire) : Terme de recherche

**Exemples de recherche :**
- Par code INSEE : `75101`
- Par nom : `Paris`
- Par code postal : `75001`
- Par département : `Paris`
- Par région : `Île-de-France`

#### Response `200 OK`

```typescript
Array<{
  inseeCode: string,
  postalName: string,
  postalCode: string,
  communeName: string,
  departmentCode: string,
  departmentName: string,
  regionName: string,
  latitude: number,
  longitude: number
}>
```

**Exemple :**

```json
[
  {
    "inseeCode": "75101",
    "postalName": "PARIS 01",
    "postalCode": "75001",
    "communeName": "Paris 01",
    "departmentCode": "75",
    "departmentName": "Paris",
    "regionName": "Île-de-France",
    "latitude": 48.8626304852,
    "longitude": 2.33629344655
  }
]
```

---

## Énumérations et Types

### ClientType

Type de client.

```typescript
enum ClientType {
  INDIVIDUAL = "INDIVIDUAL",  // Particulier (ménage et repassage à domicile)
  BUSINESS = "BUSINESS",      // Entreprise (nettoyage de bureaux)
  AIRBNB = "AIRBNB"          // Client Airbnb (nettoyage appartements)
}
```

---

### ClientStatus

Statut du client.

```typescript
enum ClientStatus {
  ACTIVE = "ACTIVE",          // Client actif - peut effectuer des réservations
  INACTIVE = "INACTIVE",      // Client inactif - temporairement désactivé
  SUSPENDED = "SUSPENDED",    // Client suspendu - ne peut plus réserver
  PROSPECT = "PROSPECT"       // En cours d'inscription (avant activation compte)
}
```

---

### PropertyType

Type de bien immobilier.

**⚠️ RÈGLE MÉTIER CRUCIALE :** Une réservation ne peut être créée que si `Property.type == Service.type`

```typescript
enum PropertyType {
  APARTMENT = "APARTMENT",    // Appartement (résidence, Airbnb, location courte durée, etc.)
  OFFICE = "OFFICE",         // Bureau / Espace professionnel
  HOUSE = "HOUSE"           // Maison individuelle
}
```

**Exemples d'utilisation :**

- **APARTMENT** : Appartement Airbnb, appartement personnel, studio de location saisonnière
- **OFFICE** : Bureaux d'entreprise, espaces de coworking, cabinets médicaux, commerces
- **HOUSE** : Maison individuelle, villa, pavillon

---

### PropertyStatus

Statut du bien immobilier.

```typescript
enum PropertyStatus {
  ACTIVE = "ACTIVE",         // Lieu actif et disponible pour les réservations
  INACTIVE = "INACTIVE",     // Lieu inactif (temporairement indisponible)
  ARCHIVED = "ARCHIVED"      // Lieu archivé (n'apparaît plus dans les listes par défaut)
}
```

---

### Frequency

Fréquence de récurrence des réservations.

```typescript
enum Frequency {
  ONE_TIME = "ONE_TIME",     // Réservation ponctuelle (une seule fois)
                            // - interventionDate = date fixe
                            // - days = NULL
                            // - recurrenceEndDate = NULL

  WEEKLY = "WEEKLY",        // Réservation hebdomadaire (se répète chaque semaine)
                            // - days = ["MONDAY", "WEDNESDAY", "FRIDAY"]
                            // - interventionDate = prochaine occurrence (recalculée auto)

  MONTHLY = "MONTHLY"       // Réservation mensuelle (se répète chaque mois)
                            // - days = ["1", "10", "15", "30"] (jours du mois)
                            // - interventionDate = prochaine occurrence (recalculée auto)
                            // - Si jour inexistant (ex: 31 février) → dernier jour du mois
}
```

---

### ReservationStatus

Statut de la réservation.

```typescript
enum ReservationStatus {
  DRAFT = "DRAFT",           // Brouillon - Réservation en cours de création
  PENDING = "PENDING",       // En attente de validation (paiement, disponibilité)
  CONFIRMED = "CONFIRMED",   // Réservation confirmée et active
  CANCELLED = "CANCELLED"    // Réservation annulée
}
```

**Note Phase 1 :** Seul le statut `CONFIRMED` est utilisé. L'admin crée les réservations directement confirmées.

---

### DiscountType

Type de réduction appliquée.

```typescript
enum DiscountType {
  PERCENTAGE = "PERCENTAGE",      // Réduction en pourcentage (ex: 10%)
  FIXED_AMOUNT = "FIXED_AMOUNT",  // Réduction en montant fixe (ex: 20€)
  PROMO_CODE = "PROMO_CODE"      // Code promo appliqué
}
```

---

### ZoneStatus

Statut de la zone d'intervention.

```typescript
enum ZoneStatus {
  ACTIVE = "ACTIVE",       // Zone active - disponible pour les réservations
  INACTIVE = "INACTIVE"    // Zone inactive - non disponible
}
```

---

## Règles Métier

### 📋 Validation des Réservations

#### 1. Contraintes de Date

- `interventionDate` doit être dans le futur
- `interventionDate` ne doit pas être un jour férié avec `applies_to_clients = TRUE`
- `interventionDate` doit être dans les horaires d'ouverture (business hours)
- `interventionDate` doit être <= date actuelle + `RESERVATION_MAX_DAYS_IN_ADVANCE` (paramètre système, défaut: 60 jours)

#### 2. Obligation du Property selon le Type de Service

| Type de Service | Property requis ? | Type de Property |
|----------------|------------------|-----------------|
| HOUSE (particulier) | ❌ Non (optionnel) | HOUSE |
| APARTMENT (Airbnb) | ✅ **OUI** | APARTMENT |
| OFFICE (bureaux) | ✅ **OUI** | OFFICE |

**Règle :** Si `service.type = OFFICE` ou `service.type = APARTMENT` → `serviceLocationId` est **OBLIGATOIRE**

#### 3. Correspondance Property.type == Service.type

**⚠️ RÈGLE CRITIQUE**

Pour qu'une réservation soit acceptée, le type du bien immobilier DOIT correspondre au type du service.

**Exemples :**

| Service.type | Property.type | Réservation | Raison |
|-------------|--------------|-------------|--------|
| APARTMENT | APARTMENT | ✅ Autorisée | Types identiques |
| OFFICE | OFFICE | ✅ Autorisée | Types identiques |
| HOUSE | HOUSE | ✅ Autorisée | Types identiques |
| APARTMENT | OFFICE | ❌ Refusée | Types différents |
| OFFICE | APARTMENT | ❌ Refusée | Types différents |
| HOUSE | APARTMENT | ❌ Refusée | Types différents |

**Erreur levée :** `PropertyServiceTypeMismatchException`

#### 4. Règles de Récurrence

| Frequency | days | recurrenceEndDate | Validation |
|-----------|------|-------------------|-----------|
| ONE_TIME | NULL | NULL | ✅ Valide |
| ONE_TIME | ["MONDAY"] | NULL | ❌ Erreur - days doit être NULL |
| WEEKLY | ["MONDAY", "FRIDAY"] | "2025-12-31" | ✅ Valide |
| WEEKLY | NULL | "2025-12-31" | ❌ Erreur - days obligatoire |
| MONTHLY | ["1", "15", "30"] | NULL | ✅ Valide (récurrence illimitée) |
| MONTHLY | ["31"] | "2025-12-28" | ✅ Valide (jour 31 → dernier jour du mois si inexistant) |

#### 5. Contraintes de Durée

- **Minimum :** 30 minutes
- **Maximum :** 480 minutes (8 heures)

#### 6. Idempotence

L'endpoint `POST /v1/admin/reservations` **REQUIERT** un header `Idempotency-Key`.

**Comportement :**
- Même clé + même body → même réponse (pas de doublon créé)
- Clé différente + même body → nouvelle réservation créée
- Les clés sont valides pour 24h (configurable)

**Utilisation recommandée :**
```typescript
// Générer un UUID v4 pour chaque tentative de réservation
const idempotencyKey = crypto.randomUUID();

fetch('/v1/admin/reservations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Idempotency-Key': idempotencyKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(reservationData)
});
```

---

### 📋 Validation des Clients

#### 1. Champs Requis selon le Type

| Type | Champs obligatoires supplémentaires |
|------|-----------------------------------|
| INDIVIDUAL | Aucun (mais `firstName` recommandé) |
| BUSINESS | `companyName`, `siret` |
| AIRBNB | Aucun |

#### 2. Contraintes d'Unicité

- `email` : unique pour tous les clients
- `siret` : unique pour les clients BUSINESS
- `googleId` : unique si utilisation de Google OAuth

#### 3. Validations de Format

| Champ | Format | Exemple |
|-------|--------|---------|
| email | Email valide, max 255 chars | `jean.dupont@example.com` |
| phone | `^\+?[0-9]{10,20}$` | `+33612345678` |
| postalCode | `^[0-9]{5}$` | `75001` |
| siret | `^[0-9]{14}$` | `12345678901234` |

---

### 📋 Validation des Properties

#### 1. Génération Automatique du Nom

Si le champ `name` n'est pas fourni lors de la création, il est généré automatiquement :

**Format :** `"{address}, {postalCode} {city}"`

**Exemple :**
```json
// Request
{
  "clientId": "...",
  "type": "APARTMENT",
  "address": "45 Boulevard Haussmann",
  "postalCode": "75008",
  "city": "Paris"
}

// Nom généré automatiquement
"name": "45 Boulevard Haussmann, 75008 Paris"
```

#### 2. Contrainte d'Unicité

Le nom d'un Property doit être unique **par client**.

- ✅ Client A peut avoir "Bureau Paris"
- ✅ Client B peut aussi avoir "Bureau Paris"
- ❌ Client A ne peut pas avoir deux Properties nommés "Bureau Paris"

#### 3. Sémantique de `roomCount`

| Type | Signification de `roomCount` | Exemple |
|------|----------------------------|---------|
| APARTMENT | Nombre de chambres | T2 = 2, T3 = 3 |
| HOUSE | Nombre de chambres | 4 chambres |
| OFFICE | Nombre de bureaux | 10 bureaux |

---

### 📋 Zones d'Intervention

#### 1. Création

- Seul le code INSEE est requis
- Toutes les autres données (nom commune, code postal, coordonnées GPS, département, région) sont automatiquement récupérées depuis le fichier CSV

#### 2. Statut

- Seules les zones **ACTIVE** apparaissent dans la liste publique des communes
- Les zones **INACTIVE** sont masquées du public mais visibles par l'admin

#### 3. Recherche Publique

- Endpoint `/v1/public/communes/search` retourne jusqu'à 50 suggestions
- Les résultats sont mis en cache pendant 1 heure pour optimiser les performances

---

### 📋 Audit Trail

Toutes les entités possèdent des champs d'audit automatiquement remplis :

```typescript
{
  createdBy: string,        // Login de l'utilisateur créateur
  updatedBy: string,        // Login de l'utilisateur modificateur
  createdAt: string,        // Timestamp de création (ISO 8601)
  updatedAt: string,        // Timestamp de dernière modification (ISO 8601)
  deletedAt: string | null  // Timestamp de suppression logique (NULL si non supprimé)
}
```

**Suppression logique (Soft Delete) :**
- Les ressources supprimées ont un `deletedAt` renseigné
- Elles ne apparaissent plus dans les requêtes normales
- Elles peuvent être restaurées via les endpoints de restauration (si disponibles)

---

## Notes pour Développeurs

### 🔐 Authentification

#### Endpoints Admin
Tous les endpoints admin requièrent un token JWT Bearer dans le header Authorization.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Endpoints Publics
Les endpoints `/v1/public/*` ne nécessitent **AUCUNE** authentification.

---

### 📄 Pagination

La pagination utilise le système standard de Spring Data.

**Paramètres de requête :**
```typescript
{
  page: number,              // Numéro de page (commence à 0)
  size: number,              // Taille de la page (défaut: 20)
  sortBy: string,            // Champ de tri (ex: "createdAt", "lastName")
  sortDirection: "ASC" | "DESC"  // Direction du tri
}
```

**Structure de réponse :**
```typescript
{
  content: Array<T>,         // Données de la page
  pageable: {
    pageNumber: number,
    pageSize: number,
    sort: {
      sorted: boolean,
      empty: boolean
    }
  },
  totalElements: number,     // Nombre total d'éléments
  totalPages: number,        // Nombre total de pages
  last: boolean,             // Est-ce la dernière page ?
  first: boolean,            // Est-ce la première page ?
  numberOfElements: number,  // Nombre d'éléments sur cette page
  empty: boolean             // Page vide ?
}
```

---

### 🚨 Gestion des Erreurs

#### Codes de Statut HTTP

| Code | Signification | Action recommandée |
|------|--------------|-------------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Vérifier les données envoyées (voir body pour détails) |
| 403 | Forbidden | Vérifier l'authentification et les permissions |
| 404 | Not Found | La ressource demandée n'existe pas |
| 409 | Conflict | Conflit (doublon, clé d'idempotence, etc.) |
| 500 | Internal Server Error | Erreur serveur - contacter l'équipe backend |

#### Structure des Erreurs

```typescript
{
  timestamp: string,         // ISO 8601
  status: number,            // Code HTTP
  error: string,             // Type d'erreur
  message: string,           // Message d'erreur détaillé
  path: string              // Chemin de la requête
}
```

**Exemple d'erreur de validation :**

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Le type du bien immobilier (ID=12, type=OFFICE) ne correspond pas au type du service (ID=5, type=APARTMENT). Une réservation ne peut être créée que si Property.type == Service.type",
  "path": "/v1/admin/reservations"
}
```

---

### 📅 Formats Date/Heure

| Type | Format | Exemple | Utilisation |
|------|--------|---------|-------------|
| Date | `YYYY-MM-DD` | `2025-03-15` | `interventionDate`, `recurrenceEndDate` |
| Heure | `HH:mm` | `09:00` | `startTime` |
| Timestamp | ISO 8601 avec timezone | `2025-01-15T10:30:00Z` | `createdAt`, `updatedAt`, `deletedAt` |

**TypeScript :**
```typescript
// Formater une date pour l'API
const interventionDate = new Date().toISOString().split('T')[0];  // "2025-03-15"

// Formater une heure
const startTime = "09:00";

// Parser un timestamp
const createdAt = new Date("2025-01-15T10:30:00Z");
```

---

### 🔄 Idempotence

Pour éviter les doublons de réservations en cas de retry réseau, utilisez toujours un header `Idempotency-Key` lors de la création de réservations.

**Best Practice :**

```typescript
function createReservation(reservationData: CreateReservationRequest) {
  // Générer une clé unique (UUID v4)
  const idempotencyKey = crypto.randomUUID();

  // Stocker la clé en local pour permettre les retries
  localStorage.setItem('lastReservationKey', idempotencyKey);

  return fetch('/v1/admin/reservations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservationData)
  });
}

// En cas d'erreur réseau, retenter avec la même clé
function retryCreateReservation(reservationData: CreateReservationRequest) {
  const lastKey = localStorage.getItem('lastReservationKey');

  return fetch('/v1/admin/reservations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Idempotency-Key': lastKey,  // Réutiliser la même clé
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservationData)
  });
}
```

**Durée de validité des clés :** 24 heures (configurable côté backend)

---

### 🗑️ Suppression Logique (Soft Delete)

Toutes les suppressions sont **logiques** (soft delete) : les ressources restent en base de données avec un timestamp `deletedAt`.

**Comportement :**
- Les ressources supprimées n'apparaissent plus dans les requêtes normales
- Elles peuvent être restaurées via les endpoints de restauration (si disponibles)
- Les admins peuvent voir toutes les ressources (y compris supprimées) via des endpoints spécifiques

**Vérifier si une ressource est supprimée :**
```typescript
if (resource.deletedAt !== null) {
  console.log("Cette ressource a été supprimée le", resource.deletedAt);
}
```

---

### 🔍 Recherche et Filtrage

#### Recherche Full-Text

Pour les clients, utilisez le paramètre `searchTerm` qui recherche dans :
- Nom
- Prénom
- Email
- Téléphone
- Nom de société

```typescript
GET /v1/admin/clients/search?searchTerm=dupont&page=0&size=20
```

#### Filtres Multiples

Combinez plusieurs filtres pour affiner les résultats :

```typescript
GET /v1/admin/reservations/search?clientId=550e8400-e29b-41d4-a716-446655440000&status=CONFIRMED&frequency=WEEKLY
```

---

### 📊 Documentation Interactive

Pour tester les API de manière interactive, accédez à la documentation Swagger/OpenAPI :

```
http://localhost:8080/swagger-ui.html
```

La documentation Swagger fournit :
- Tous les endpoints disponibles
- Modèles de données détaillés
- Possibilité de tester les endpoints directement depuis le navigateur
- Exemples de requêtes et réponses

---

## 🎯 Flux Recommandés

### Flux 1 : Créer un Client et son Premier Property

```typescript
// 1. Créer le client
const createClientResponse = await fetch('/v1/admin/clients', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: "INDIVIDUAL",
    origin: "WEB",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33612345678",
    address: "123 Rue de la Paix",
    city: "Paris",
    postalCode: "75001"
  })
});

const client = await createClientResponse.json();

// 2. Créer un property pour ce client (nom auto-généré)
const createPropertyResponse = await fetch('/api/v1/properties', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clientId: client.id,
    type: "HOUSE",
    address: "123 Rue de la Paix",
    city: "Paris",
    postalCode: "75001",
    surfaceArea: 120.5,
    roomCount: 4
  })
});

const property = await createPropertyResponse.json();
```

---

### Flux 2 : Créer une Réservation avec Validation de Type

```typescript
// 1. Récupérer le service (pour connaître son type)
const service = await fetch('/v1/admin/services/5').then(r => r.json());
// service.type = "APARTMENT"

// 2. Récupérer le property (pour connaître son type)
const property = await fetch('/api/v1/properties/12').then(r => r.json());
// property.type = "APARTMENT"

// 3. Vérifier que property.type === service.type
if (property.type !== service.type) {
  alert(`Erreur : Le service "${service.name}" (type ${service.type}) ne peut pas être réservé pour ce bien (type ${property.type})`);
  return;
}

// 4. Créer la réservation avec clé d'idempotence
const idempotencyKey = crypto.randomUUID();

const createReservationResponse = await fetch('/v1/admin/reservations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Idempotency-Key': idempotencyKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    clientId: client.id,
    serviceId: service.id,
    serviceLocationId: property.id,
    interventionDate: "2025-03-15",
    startTime: "09:00",
    duration: 120,
    frequency: "WEEKLY",
    days: ["MONDAY", "WEDNESDAY"],
    recurrenceEndDate: "2025-12-31"
  })
});

const reservation = await createReservationResponse.json();
console.log("Réservation créée:", reservation.number);
```

---

### Flux 3 : Vérifier si une Zone est Couverte (Public)

```typescript
// 1. L'utilisateur entre son code postal
const userPostalCode = "75001";

// 2. Rechercher les communes correspondantes (endpoint public)
const communes = await fetch(`/v1/public/communes/search?searchTerm=${userPostalCode}`)
  .then(r => r.json());

if (communes.length === 0) {
  alert("Désolé, nous n'intervenons pas encore dans votre commune.");
} else {
  console.log("Communes disponibles:", communes);
  // Afficher une liste de sélection avec les communes trouvées
}
```

---

## 📞 Support

Pour toute question ou clarification supplémentaire :

1. **Documentation Swagger :** `http://localhost:8080/swagger-ui.html`
2. **Code Source Backend :** Consulter les contrôleurs et services dans le repository
3. **Équipe Backend :** Contacter l'équipe de développement backend

---

**Fin du guide d'intégration frontend**

*Document généré pour Les Astiqueuses - Phase 1 MVP - Janvier 2025*
