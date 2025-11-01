# API Contracts - Module Services

> Documentation des contrats API pour le module Services
> **Dernière mise à jour** : 2025-10-29

---

## Endpoints Publics

Aucune authentification requise.

---

### GET /api/v1/services

Récupère le catalogue complet des services actifs avec leurs options.

**Response 200 OK**:
```json
[
  {
    "id": number,
    "code": string,
    "name": string,
    "description": string | null,
    "standardRate": number,
    "preferredRate": number | null,
    "vatRate": number,
    "minDuration": number,
    "maxDuration": number,
    "durationIncrement": number,
    "status": "ACTIVE" | "INACTIVE",
    "options": [
      {
        "id": number,
        "optionId": number,
        "optionCode": string,
        "optionName": string,
        "optionDescription": string | null,
        "optionType": "ADDON" | "FORMULA",
        "optionStatus": "ACTIVE" | "INACTIVE",
        "rate": number | null
      }
    ]
  }
]
```

---

### GET /api/v1/services/{id}

Récupère les détails d'un service spécifique.

**Path Parameters**:
- `id` (number): ID du service

**Response 200 OK**: Identique à `GET /api/v1/services` (objet unique)
**Response 404**: Service non trouvé

---

### GET /api/v1/services/{serviceId}/options

Récupère toutes les options disponibles pour un service spécifique.

**Path Parameters**:
- `serviceId` (number): ID du service

**Response 200 OK**:
```json
[
  {
    "id": number,
    "code": string,
    "name": string,
    "description": string | null,
    "type": "ADDON" | "FORMULA",
    "defaultRate": number,
    "status": "ACTIVE" | "INACTIVE"
  }
]
```

**Response 404**: Service non trouvé

---

### POST /api/v1/services/calculate-price

Calcule le prix d'une prestation.

**Request Body**:
```json
{
  "serviceId": number,
  "durationInMinutes": number,
  "usePreferredRate": boolean,
  "associationIds": number[]  // optionnel
}
```

**Validation**:
- `serviceId`: Obligatoire
- `durationInMinutes`: Obligatoire, doit respecter min/max/increment du service
- `usePreferredRate`: Obligatoire
- `associationIds`: Optionnel (IDs des associations service-option)

**Response 200 OK**:
```json
{
  "serviceId": number,
  "serviceName": string,
  "durationInMinutes": number,
  "hourlyRate": number,
  "baseAmountExclTax": number,
  "optionsAmountExclTax": number,
  "totalAmountExclTax": number,
  "vatRate": number,
  "vatAmount": number,
  "totalAmountInclTax": number,
  "usePreferredRate": boolean,
  "appliedOptions": [
    {
      "associationId": number,
      "optionId": number,
      "optionName": string,
      "rate": number,
      "amountExclTax": number
    }
  ]
}
```

**Response 400**: Validation ou durée invalide
**Response 404**: Service non trouvé

---

## Endpoints Admin - Services

Authentification OAuth2 requise avec rôle **ADMIN**.

**Headers requis**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

### GET /api/v1/admin/services

Liste tous les services (actifs + inactifs) avec informations d'audit.

**Response 200 OK**:
```json
[
  {
    "id": number,
    "code": string,
    "name": string,
    "description": string | null,
    "standardRate": number,
    "preferredRate": number | null,
    "vatRate": number,
    "minDuration": number,
    "maxDuration": number,
    "durationIncrement": number,
    "status": "ACTIVE" | "INACTIVE",
    "options": [
      {
        "id": number,
        "optionId": number,
        "optionCode": string,
        "optionName": string,
        "optionDescription": string | null,
        "optionType": "ADDON" | "FORMULA",
        "optionStatus": "ACTIVE" | "INACTIVE",
        "rate": number | null,
        "auditInfo": {
          "createdByName": string,
          "createdAt": string,  // ISO 8601
          "updatedByName": string,
          "updatedAt": string,  // ISO 8601
          "deletedAt": string | null  // ISO 8601 ou null
        }
      }
    ],
    "auditInfo": {
      "createdByName": string,
      "createdAt": string,  // ISO 8601
      "updatedByName": string,
      "updatedAt": string,  // ISO 8601
      "deletedAt": string | null  // ISO 8601 ou null
    }
  }
]
```

---

### GET /api/v1/admin/services/{id}/audit

Récupère un service avec informations d'audit complètes.

**Path Parameters**:
- `id` (number): ID du service

**Response 200 OK**: Identique à `GET /api/v1/admin/services` (objet unique)
**Response 404**: Service non trouvé

---

### POST /api/v1/admin/services

Crée un nouveau service.

**Request Body**:
```json
{
  "code": string,  // max 20 caractères, format ^[A-Z_]+$, unique
  "name": string,  // max 100 caractères
  "description": string | null,  // max 500 caractères
  "standardRate": number,  // > 0, max 999.99
  "preferredRate": number | null,  // > 0, max 999.99
  "vatRate": number,  // >= 0 et <= 99.99
  "minDuration": number,  // >= 30 et <= 480
  "maxDuration": number,  // >= 60 et <= 480
  "durationIncrement": number,  // >= 15 et <= 60
  "optionAssociations": [  // optionnel
    {
      "optionId": number,  // ID option existante
      "rate": number | null  // >= 0, null = utilise defaultRate
    }
  ]
}
```

**Validation**:
- `code`: Obligatoire, max 20 caractères, format `^[A-Z_]+$`, unique
- `name`: Obligatoire, max 100 caractères
- `description`: Optionnel, max 500 caractères
- `standardRate`: Obligatoire, > 0, max 999.99
- `preferredRate`: Optionnel, > 0, max 999.99
- `vatRate`: Obligatoire, >= 0 et <= 99.99
- `minDuration`: Obligatoire, >= 30 et <= 480
- `maxDuration`: Obligatoire, >= 60 et <= 480
- `durationIncrement`: Obligatoire, >= 15 et <= 60
- `optionAssociations`: Optionnel, liste d'associations
  - `optionId`: Obligatoire, ID d'une option existante
  - `rate`: Optionnel, >= 0. **Si NULL, utilise `defaultRate` de l'option**

**Response 201 Created**: Service créé (format identique à GET)
**Response 400**: Validation échouée
**Response 409**: Code déjà existant

---

### PUT /api/v1/admin/services/{id}

Met à jour un service existant. **Remplace toutes les associations existantes**.

**Path Parameters**:
- `id` (number): ID du service

**Request Body**:
```json
{
  "code": string,
  "name": string,
  "description": string | null,
  "standardRate": number,
  "preferredRate": number | null,
  "vatRate": number,
  "minDuration": number,
  "maxDuration": number,
  "durationIncrement": number,
  "status": "ACTIVE" | "INACTIVE",  // obligatoire en update
  "optionAssociations": [
    {
      "optionId": number,
      "rate": number | null
    }
  ]
}
```

**Validation**: Identique à POST + `status` obligatoire
**Response 200 OK**: Service mis à jour
**Response 400**: Validation échouée
**Response 404**: Service non trouvé
**Response 409**: Code déjà existant

---

### DELETE /api/v1/admin/services/{id}

Supprime logiquement un service (soft delete).

**Path Parameters**:
- `id` (number): ID du service

**Response 204 No Content**: Aucun body
**Response 404**: Service non trouvé

---

## Endpoints Admin - Options de Service

Gestion des options autonomes réutilisables.

---

### GET /api/v1/admin/service-options

Liste toutes les options (actives + inactives) avec informations d'audit.

**Response 200 OK**:
```json
[
  {
    "id": number,
    "code": string,
    "name": string,
    "description": string | null,
    "type": "ADDON" | "FORMULA",
    "defaultRate": number,
    "status": "ACTIVE" | "INACTIVE",
    "auditInfo": {
      "createdByName": string,  // email ou "Système" ou "Utilisateur inconnu (ID: X)"
      "createdAt": string,  // ISO 8601
      "updatedByName": string,
      "updatedAt": string,  // ISO 8601
      "deletedAt": string | null  // ISO 8601 ou null
    }
  }
]
```

**Note**: `createdByName` et `updatedByName` affichent l'email de l'utilisateur ou "Système" si NULL.

---

### GET /api/v1/admin/service-options/{id}

Récupère une option par ID avec informations d'audit.

**Path Parameters**:
- `id` (number): ID de l'option

**Response 200 OK**: Objet unique (format identique à GET /admin/service-options)
**Response 404**: Option non trouvée

---

### POST /api/v1/admin/service-options

Crée une nouvelle option.

**Request Body**:
```json
{
  "code": string,  // max 20 caractères, unique
  "name": string,  // max 100 caractères
  "description": string | null,
  "type": "ADDON" | "FORMULA",
  "defaultRate": number  // > 0
}
```

**Validation**:
- `code`: Obligatoire, max 20 caractères, unique
- `name`: Obligatoire, max 100 caractères
- `description`: Optionnel
- `type`: Obligatoire, `"ADDON"` ou `"FORMULA"`
- `defaultRate`: Obligatoire, > 0

**Response 201 Created**: Option créée avec `status: "ACTIVE"`
**Response 400**: Validation échouée
**Response 409**: Code déjà existant

---

### PUT /api/v1/admin/service-options/{id}

Met à jour une option existante.

**Path Parameters**:
- `id` (number): ID de l'option

**Request Body**:
```json
{
  "code": string,
  "name": string,
  "description": string | null,
  "type": "ADDON" | "FORMULA",
  "defaultRate": number,
  "status": "ACTIVE" | "INACTIVE"  // obligatoire en update
}
```

**Validation**: Identique à POST + `status` obligatoire
**Response 200 OK**: Option mise à jour
**Response 400**: Validation échouée
**Response 404**: Option non trouvée
**Response 409**: Code déjà existant

---

### DELETE /api/v1/admin/service-options/{id}

Supprime logiquement une option (soft delete).

**Path Parameters**:
- `id` (number): ID de l'option

**Response 204 No Content**: Aucun body
**Response 404**: Option non trouvée

---

### PATCH /api/v1/admin/service-options/{id}/status

Change le statut d'une option (ACTIVE/INACTIVE).

**Path Parameters**:
- `id` (number): ID de l'option

**Query Parameters**:
- `status` (string): `"ACTIVE"` ou `"INACTIVE"`

**Response 200 OK**: Option avec nouveau statut
**Response 404**: Option non trouvée

---

## Codes HTTP

| Code | Signification |
|------|---------------|
| 200  | Requête réussie |
| 201  | Ressource créée |
| 204  | Suppression réussie |
| 400  | Données invalides |
| 401  | Non authentifié |
| 403  | Droits insuffisants (rôle ADMIN requis) |
| 404  | Ressource non trouvée |
| 409  | Conflit (code existant) |
| 500  | Erreur serveur |

---

## Types d'erreur (RFC 7807)

Toutes les erreurs suivent le format RFC 7807 :

```json
{
  "type": string,  // URI format "https://api.lesexperts.com/errors/{error-type}"
  "title": string,
  "status": number,
  "detail": string
}
```

**Erreurs de validation** (400) incluent un champ supplémentaire :
```json
{
  "type": string,
  "title": string,
  "status": number,
  "detail": string,
  "errors": {
    "fieldName": string  // message d'erreur par champ
  }
}
```

| URI | Description |
|-----|-------------|
| `validation` | Validation échouée |
| `service-not-found` | Service non trouvé |
| `service-option-not-found` | Option non trouvée |
| `duplicate-service-code` | Code service déjà existant |
| `duplicate-service-option-code` | Code option déjà existant |
| `invalid-duration` | Durée invalide |
| `access-denied` | Accès refusé |
| `internal-server-error` | Erreur serveur |

---

## Modèles de données

### ServiceOption (autonome)

```typescript
interface ServiceOption {
  id: number
  code: string               // Unique globalement
  name: string
  description: string | null
  type: "ADDON" | "FORMULA"
  defaultRate: number        // Tarif par défaut (€/h)
  status: "ACTIVE" | "INACTIVE"
}
```

### ServiceOptionAssociation (lien Service-Option)

```typescript
interface ServiceOptionAssociation {
  id: number                 // ID de l'association
  optionId: number          // Référence à ServiceOption
  optionCode: string
  optionName: string
  optionDescription: string | null
  optionType: "ADDON" | "FORMULA"
  optionStatus: "ACTIVE" | "INACTIVE"
  rate: number | null       // Tarif spécifique (NULL = utilise defaultRate)
}
```

### AuditInfo

```typescript
interface AuditInfo {
  createdByName: string     // Email ou "Système" ou "Utilisateur inconnu (ID: X)"
  createdAt: string         // ISO 8601
  updatedByName: string
  updatedAt: string         // ISO 8601
  deletedAt: string | null  // ISO 8601 ou null
}
```

---

## Règles métier importantes

### Hiérarchie des tarifs pour les options

1. **Option autonome** : Définie avec `defaultRate` (ex: "IRONING" = 5.00 €/h)
2. **Association service-option** : Peut surcharger le tarif avec `rate`
   - Si `rate = 5.00` → Utilise 5.00 €/h
   - Si `rate = null` → Utilise `defaultRate` de l'option (5.00 €/h)
   - Si `rate = 0.00` → Gratuit (différent de null !)

**Exemple** :
```json
{
  "optionId": number,
  "rate": null
}
```
→ Backend utilisera automatiquement le `defaultRate` de l'option

### Associations Service-Option

- Une **option** (`ServiceOption`) est une entité autonome et réutilisable
- Une **association** (`ServiceOptionAssociation`) lie un service à une option avec un tarif
- Une même option peut être associée à plusieurs services avec des tarifs différents
- Exemple : "IRONING" peut coûter 5€/h pour "HOUSEWORK" et 6€/h pour "OFFICE"

### IDs à utiliser

- **Calcul de prix** : Utiliser `associationIds` (ID des associations, pas des options)
- **Création/MAJ service** : Utiliser `optionId` (ID de l'option à associer)

### Suppression logique

- Toutes les suppressions sont **soft delete** (champ `deletedAt` renseigné)
- Les entités supprimées n'apparaissent plus dans les endpoints publics
- Les admins voient `deletedAt != null` dans `auditInfo`

---

## Exemples de flux

### Créer un service avec options

1. **Lister les options disponibles** : `GET /api/v1/admin/service-options`
2. **Créer le service** : `POST /api/v1/admin/services` avec `optionAssociations`
3. **Vérifier** : `GET /api/v1/admin/services/{id}/audit`

### Calculer un prix

1. **Récupérer le service** : `GET /api/v1/services/{id}` pour avoir les `options[].id` (IDs associations)
2. **Calculer** : `POST /api/v1/services/calculate-price` avec `associationIds`

### Modifier le tarif d'une option pour un service

1. **Récupérer le service** : `GET /api/v1/admin/services/{id}/audit`
2. **Modifier** : `PUT /api/v1/admin/services/{id}` en changeant `rate` dans `optionAssociations`

---

**Fin du document**
