# EquiLedger AI Financial Assistant

## 🚀 **Production-Ready Multi-Tenant AI Financial Assistant**

A comprehensive AI-powered financial management system for South African SMEs, featuring WhatsApp/Telegram integration, VAT compliance, and multi-tenant architecture.

## ✨ **Key Features**

- **🤖 AI Financial Assistant**: Natural language processing for financial tasks
- **📱 Multi-Channel Support**: WhatsApp + Telegram integration
- **🏢 Multi-Tenant Architecture**: Secure business isolation
- **📊 VAT Compliance**: South African tax regulations built-in
- **💼 Invoice Management**: PDF generation and tracking
- **📈 Financial Reporting**: Real-time insights and summaries
- **🔗 External Integrations**: Xero, QuickBooks, banking APIs
- **🌐 Web Dashboard**: Subscription management and data import

## 🏗️ **Architecture**

### **Tech Stack**
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL with RLS)
- **ORM**: Prisma with multi-tenant schema
- **AI**: Vercel AI SDK + OpenAI
- **Workflows**: Vercel Workflows
- **Messaging**: Twilio WhatsApp + Telegram Bot API
- **Deployment**: Vercel

### **Multi-Tenant Strategy**
- **Database**: Single database, shared schema with business_id
- **Isolation**: Row Level Security (RLS) + application-level checks
- **Context**: Business ID injected in all operations
- **Security**: Signature verification + rate limiting

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- OpenAI API key
- Twilio account (WhatsApp + SMS)
- Telegram Bot Token

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-org/equiledger-ai.git
cd equiledger-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your environment variables

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### **Environment Variables**

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your_supabase_anon_key"

# OpenAI
OPENAI_API_KEY="your_openai_api_key"

# Twilio (WhatsApp + SMS)
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+1234567890"
TWILIO_SMS_NUMBER="+1234567890"

# Telegram
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_WEBHOOK_SECRET="your_webhook_secret"

# Application
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 📁 **Project Structure**

```
equiledger-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Dashboard routes
│   ├── api/                      # API routes
│   │   ├── webhooks/             # Webhook handlers
│   │   ├── ai/                   # AI agent endpoints
│   │   └── integrations/         # External integrations
│   └── globals.css
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   ├── charts/                   # Financial charts
│   └── ai/                       # AI-specific components
├── lib/                          # Core libraries
│   ├── db/                       # Database utilities
│   ├── ai/                       # AI tools and workflows
│   ├── messaging/                # WhatsApp/Telegram
│   ├── integrations/             # External APIs
│   └── security/                 # Security utilities
├── prisma/                       # Database schema
├── workflows/                    # Vercel Workflows
├── types/                        # TypeScript types
└── tests/                        # Test suites
```

## 🤖 **AI Agent Features**

### **Financial Tools**
- **Invoice Creation**: Natural language invoice generation
- **Expense Tracking**: AI-powered expense categorization
- **Financial Summaries**: Monthly/quarterly reports
- **VAT Calculations**: Automatic South African VAT compliance
- **Payment Tracking**: Invoice status management

### **Multi-Tenant Security**
- **Business Isolation**: All operations scoped to business context
- **Secure Database Access**: AI tools with automatic business ID injection
- **Audit Logging**: Complete activity tracking
- **Rate Limiting**: Protection against abuse

## 📱 **Messaging Integration**

### **WhatsApp (Twilio)**
- Webhook signature verification
- PDF invoice delivery
- SMS fallback for failed messages
- Rate limiting and error handling

### **Telegram**
- Bot API integration
- Webhook secret validation
- Thread-based conversations
- Rich media support

## 🌐 **Web Application**

### **Dashboard Features**
- **Subscription Management**: Tier upgrades and billing
- **Data Import/Export**: CSV/Excel integration
- **Integration Setup**: Xero, QuickBooks connections
- **Financial Reports**: Charts and analytics
- **User Management**: Team member access control

### **Onboarding Flow**
- **Business Registration**: VAT number and compliance setup
- **Data Migration**: Import from existing systems
- **Integration Setup**: Connect external tools
- **Training**: AI assistant customization

## 🔒 **Security Features**

### **Multi-Tenant Isolation**
- Row Level Security (RLS) policies
- Business ID injection in all operations
- Cross-tenant data access prevention
- Secure credential storage

### **API Security**
- Webhook signature verification
- Rate limiting and DDoS protection
- Input validation and sanitization
- SQL injection prevention

## 🧪 **Testing**

### **Test Coverage**
- **Unit Tests**: Database operations, AI tools, calculations
- **Integration Tests**: Webhook processing, multi-tenant isolation
- **Security Tests**: Cross-tenant access prevention
- **End-to-End Tests**: Complete user workflows

### **Running Tests**
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:security
```

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
# ... add all required environment variables
```

### **Database Setup**
```bash
# Run migrations
npx prisma migrate deploy

# Set up RLS policies
npx prisma db execute --file supabase/multi-tenant-security.sql
```

## 📊 **Monitoring & Analytics**

### **Performance Metrics**
- Response time tracking
- Error rate monitoring
- Database query performance
- AI processing time

### **Business Metrics**
- User engagement
- Feature usage
- Revenue tracking
- Compliance reporting

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 **Support**

- **Documentation**: [docs.equiledger.ai](https://docs.equiledger.ai)
- **Issues**: [GitHub Issues](https://github.com/your-org/equiledger-ai/issues)
- **Discord**: [Community Server](https://discord.gg/equiledger)

---

**Built with ❤️ for South African SMEs**