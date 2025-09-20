"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Server, Database, BarChart3 } from "lucide-react"

export default function SalesAnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sales Analytics Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive MERN stack application for sales data analysis and reporting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Backend API
              </CardTitle>
              <CardDescription>Node.js + Express.js REST API with MongoDB integration</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• MongoDB with Mongoose ODM</li>
                <li>• Advanced aggregation pipelines</li>
                <li>• Input validation & error handling</li>
                <li>• 7 REST API endpoints</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Models
              </CardTitle>
              <CardDescription>Comprehensive data structure for sales analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Customers (name, region, type)</li>
                <li>• Products (name, category, price)</li>
                <li>• Sales (quantity, revenue, date)</li>
                <li>• Analytics Reports (aggregated data)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Features
              </CardTitle>
              <CardDescription>Advanced reporting and visualization capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Revenue tracking by date range</li>
                <li>• Top-selling products analysis</li>
                <li>• Customer performance metrics</li>
                <li>• Region & category statistics</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Structure</CardTitle>
            <CardDescription>Complete MERN stack application with separate backend and frontend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Backend (Node.js)</h3>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div>backend/</div>
                  <div>├── models/ (Customer, Product, Sales)</div>
                  <div>├── routes/ (API endpoints)</div>
                  <div>├── controllers/ (Business logic)</div>
                  <div>├── utils/ (Seeding & helpers)</div>
                  <div>└── server.js (Express app)</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Frontend (React)</h3>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div>frontend/</div>
                  <div>├── src/components/ (UI components)</div>
                  <div>├── src/pages/ (Dashboard, Reports)</div>
                  <div>├── src/services/ (API calls)</div>
                  <div>├── src/hooks/ (Custom hooks)</div>
                  <div>└── src/App.js (Main app)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>Follow these steps to run the complete MERN stack application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Backend Setup</h3>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div>cd backend</div>
                  <div>npm install</div>
                  <div>cp .env.example .env</div>
                  <div># Update .env with MongoDB URI</div>
                  <div>npm run seed # Generate sample data</div>
                  <div>npm run dev # Start on port 5000</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Frontend Setup</h3>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div>cd frontend</div>
                  <div>npm install</div>
                  <div>cp .env.example .env</div>
                  <div>npm start # Start on port 3000</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            This page is deployed on Vercel. The complete MERN stack application files are included in the project.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Github className="h-4 w-4" />
              View Source Code
            </Button>
            <Button className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Download Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
