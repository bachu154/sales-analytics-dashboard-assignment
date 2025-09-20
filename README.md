# Sales Analytics Dashboard

A comprehensive MERN stack application for sales analytics and reporting, built for the Shanture assignment.

## 🚀 Features

### Backend
- **Node.js + Express.js** REST API
- **MongoDB** with Mongoose ODM
- **Data Models**: Customers, Products, Sales, Analytics Reports
- **Advanced Aggregation Pipelines** for analytics
- **Automated Data Seeding** with 2 years of sample data using Faker.js
- **Input Validation** with express-validator
- **Error Handling** middleware

### Frontend
- **React** with Material-UI components
- **Interactive Charts** using ECharts
- **Responsive Design** for all screen sizes
- **Date Range Filtering** with react-datepicker
- **Real-time Analytics** dashboard
- **Report Generation** and history

### Analytics Features
- Revenue tracking by date range
- Top-selling products analysis
- Customer performance metrics
- Region-wise sales statistics
- Category-wise performance
- Automated report generation and storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### Backend Setup

1. **Navigate to backend directory**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update `.env` with your MongoDB connection string:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/sales_analytics
   PORT=5000
   NODE_ENV=development
   \`\`\`

4. **Start MongoDB** (if running locally)
   \`\`\`bash
   mongod
   \`\`\`

5. **Seed the database**
   \`\`\`bash
   npm run seed
   \`\`\`
   This will create sample data for 2 years with customers, products, and sales records.

6. **Start the backend server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update `.env` if needed:
   \`\`\`env
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

4. **Start the frontend application**
   \`\`\`bash
   npm start
   \`\`\`
   Application will run on http://localhost:3000

## 📊 API Endpoints

### Analytics Endpoints
- `GET /api/revenue?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Revenue data
- `GET /api/top-products?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=10` - Top products
- `GET /api/top-customers?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=10` - Top customers
- `GET /api/region-stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Region statistics
- `GET /api/category-stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Category statistics

### Reports Endpoints
- `POST /api/reports` - Generate new analytics report
- `GET /api/reports?page=1&limit=10` - Get saved reports list
- `GET /api/reports/:id` - Get specific report details

### Health Check
- `GET /api/health` - API health status

## 🏗️ Project Structure

\`\`\`
sales-analytics-dashboard/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── analyticsController.js
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Sales.js
│   │   └── AnalyticsReport.js
│   ├── routes/
│   │   └── analytics.js
│   ├── utils/
│   │   ├── seedData.js
│   │   └── helpers.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── DateRangePicker.js
│   │   │   ├── StatCard.js
│   │   │   ├── Layout.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ErrorMessage.js
│   │   │   └── TopCustomersTable.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   └── Reports.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── README.md
\`\`\`

## 🎯 Usage

### Dashboard Features
1. **Date Range Selection**: Use the date picker to filter analytics by custom date ranges
2. **Quick Filters**: Select from preset ranges (Last 7 days, 30 days, 90 days, 1 year)
3. **Summary Cards**: View total revenue, orders, and average order value
4. **Interactive Charts**: 
   - Revenue trend over time
   - Top products by revenue
   - Sales distribution by region
   - Category performance analysis
5. **Top Customers Table**: Detailed customer performance metrics

### Reports Management
1. **Generate Reports**: Create comprehensive analytics reports for any date range
2. **View History**: Browse previously generated reports
3. **Detailed Analysis**: View complete breakdowns including top products, customers, regions, and categories

## 🚀 Deployment

### Backend Deployment (Heroku)

1. **Create Heroku app**
   \`\`\`bash
   heroku create your-app-name-backend
   \`\`\`

2. **Set environment variables**
   \`\`\`bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set NODE_ENV=production
   \`\`\`

3. **Deploy**
   \`\`\`bash
   git subtree push --prefix backend heroku main
   \`\`\`

### Frontend Deployment (Netlify)

1. **Build the application**
   \`\`\`bash
   cd frontend
   npm run build
   \`\`\`

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

3. **Set environment variables** in Netlify dashboard:
   \`\`\`
   REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api
   \`\`\`

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend
npm test
\`\`\`

## 📈 Sample Data

The seeding script generates:
- **100 customers** across 5 regions (North, South, East, West, Central)
- **50 products** in 6 categories (Electronics, Clothing, Books, Home, Sports, Beauty)
- **~10,000+ sales records** spanning 2 years with realistic patterns

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity for MongoDB Atlas

2. **CORS Issues**
   - Ensure backend CORS is configured for frontend URL
   - Check API URL in frontend `.env`

3. **Port Conflicts**
   - Change ports in respective `.env` files
   - Ensure no other applications are using the same ports

4. **Seeding Issues**
   - Clear existing data before re-seeding
   - Check MongoDB permissions
   - Verify sufficient disk space

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Shanture Assignment**
- Full-stack MERN application
- Sales Analytics Dashboard
- Built with modern web technologies

---

For any questions or issues, please create an issue in the repository or contact the development team.
