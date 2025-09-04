# HorseSharing 🐎

Een modern matchingplatform dat bijrijders verbindt met paard/pony-eigenaren en stallen.

## 🎯 Doel

HorseSharing maakt het mogelijk voor:
- **Bijrijders**: Vind paarden om mee te rijden in jouw buurt
- **Eigenaren**: Deel je paard met betrouwbare rijders
- **Stallen**: Beheer en promoot je faciliteiten

## 🏗️ Technische Stack

### Frontend
- **React 18** met Vite
- **TypeScript** voor type safety
- **Tailwind CSS** voor styling
- **Framer Motion** voor animaties
- **PWA** ondersteuning

### Backend
- **FastAPI** (Python)
- **PostgreSQL** met SQLAlchemy ORM
- **Alembic** voor database migraties
- **Redis** voor caching en rate limiting

### Authenticatie & Autorisatie
- **Kinde** OIDC provider
- Roles: `RIDER`, `OWNER`, `STABLE`, `ADMIN`

### Betalingen
- **Stripe** voor Nederlandse/EU betalingen
- **iDEAL** ondersteuning

### Infrastructuur
- **Azure App Service** voor hosting
- **Azure Database for PostgreSQL**
- **Azure Storage** voor media bestanden
- **Azure CDN** voor content delivery

## 🎨 Branding

- **Primaire kleur**: `#3CBF8C` (groen)
- **Accent kleur**: `#FFC65A` (geel/oranje)
- **Tekst kleur**: `#2A2A2A` (donkergrijs)

## 📁 Project Structuur

```
horsesharing/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # FastAPI backend
├── packages/
│   └── ui/           # Gedeelde UI componenten
├── infra/            # Azure infrastructuur
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Vereisten
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Lokale Development

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd horsesharing
   ```

2. **Start services met Docker**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   cd apps/web
   npm install
   npm run dev

   # Backend
   cd ../api
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Setup database**
   ```bash
   cd apps/api
   alembic upgrade head
   ```

### Environment Variables

Kopieer `.env.example` naar `.env` en vul de juiste waarden in:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/horsesharing

# Redis
REDIS_URL=redis://localhost:6379

# Kinde Auth
KINDE_DOMAIN=your-domain.kinde.com
KINDE_CLIENT_ID=your-client-id
KINDE_CLIENT_SECRET=your-client-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
```

## 🧪 Testing

```bash
# Frontend tests
cd apps/web
npm run test

# Backend tests
cd apps/api
pytest
```

## 📦 Deployment

### Azure Deployment

1. **Build containers**
   ```bash
   docker build -f apps/web/Dockerfile.prod -t horsesharing-web .
   docker build -f apps/api/Dockerfile.prod -t horsesharing-api .
   ```

2. **Deploy via Azure CLI**
   ```bash
   az webapp deploy --resource-group horsesharing-rg --name horsesharing-web --src-path horsesharing-web.tar.gz
   ```

## 🤝 Contributing

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/amazing-feature`)
3. Commit je changes (`git commit -m 'Add amazing feature'`)
4. Push naar de branch (`git push origin feature/amazing-feature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🆘 Support

Voor vragen of support, open een issue op GitHub of neem contact op via [support@horsesharing.nl](mailto:support@horsesharing.nl).
