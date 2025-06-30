# FoodSaver Connect

<div align="center">
  <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200" alt="FoodSaver Connect Logo" width="100" height="100">
  
  **Reduce Food Waste, Save Money, Help Your Community**
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
</div>

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌟 About

FoodSaver Connect is an innovative web application designed to combat food waste among households and small businesses. By providing intelligent inventory management, smart recipe suggestions, and efficient food donation capabilities, we help users save money, reduce environmental impact, and contribute to their communities.

### The Problem We Solve

- **Financial Losses**: Billions of dollars worth of food is wasted annually due to poor inventory management
- **Environmental Impact**: Food waste contributes significantly to greenhouse gas emissions
- **Social Inequality**: Edible food is discarded while many people face food insecurity

### Our Solution

FoodSaver Connect provides a comprehensive platform that transforms how people manage their food inventory, discover recipes, and donate surplus food to those in need.

## ✨ Features

### 🏠 Smart Inventory Management
- **Barcode Scanning**: Quick item entry using camera-based barcode scanning
- **Manual Entry**: Fallback option for items without barcodes
- **Expiration Tracking**: Automated alerts for items nearing expiration
- **Storage Organization**: Categorize items by storage location (fridge, freezer, pantry, counter)
- **Consumption Logging**: Track usage patterns and reduce waste

### 👨‍🍳 Smart Recipe Suggestions
- **Ingredient-Based Matching**: Recipes suggested based on available inventory
- **Advanced Filtering**: Filter by meal type, cuisine, dietary restrictions, and difficulty
- **Automatic Deduction**: Used ingredients are automatically removed from inventory
- **Nutritional Information**: Access to detailed nutritional data for recipes

### ❤️ Food Donation Module
- **Location-Based Discovery**: Find nearby food banks and charities using Google Maps
- **Interactive Map**: Visual representation of donation opportunities
- **Charity Information**: Detailed information about operating hours, accepted items, and contact details
- **Donation Tracking**: Monitor your donation history and impact

### 📊 Dashboard & Analytics
- **Waste Reports**: Comprehensive statistics on food waste patterns
- **Cost Savings**: Track financial savings from reduced waste
- **Inventory Overview**: Visual dashboard of current stock and expiration alerts
- **Impact Metrics**: Monitor your environmental and social contribution

## 🛠 Technologies Used

### Frontend
- **React 18.3.1** - Modern UI library with hooks and functional components
- **TypeScript 5.5.3** - Type-safe JavaScript for better development experience
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for rapid styling
- **React Router DOM 6.8.1** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **Recharts 2.12.2** - Responsive charts for data visualization
- **Date-fns 3.3.1** - Modern JavaScript date utility library

### Backend (Planned)
- **Node.js with Express** or **Python with Flask/Django**
- **PostgreSQL** or **MongoDB** for data persistence
- **JWT Authentication** for secure user sessions
- **RESTful API** design for frontend-backend communication

### External APIs
- **Open Food Facts API** - Product information from barcode scanning
- **Google Maps API** - Geolocation and charity discovery
- **Google Geocoding API** - Address to coordinates conversion

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/botwhatsappappbob/myapp.git
   cd myapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your API keys:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_OPEN_FOOD_FACTS_API_URL=https://world.openfoodfacts.org/api/v0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📱 Usage

### Adding Food Items

1. **Barcode Scanning** (Recommended)
   - Click "Quick Scan" or "Scan Barcode" button
   - Allow camera permissions
   - Point camera at product barcode
   - Confirm and edit product details
   - Set expiration date and storage location

2. **Manual Entry**
   - Click "Add Item" button
   - Fill in product details manually
   - Set quantity, expiration date, and storage location

### Finding Recipes

1. Navigate to the **Recipes** page
2. Browse suggested recipes based on your inventory
3. Use filters to narrow down options:
   - Meal type (breakfast, lunch, dinner, snack, dessert)
   - Cuisine type
   - Dietary restrictions
4. Click on a recipe to view detailed instructions
5. Cook the recipe to automatically deduct ingredients

### Donating Food

1. Go to the **Donations** page
2. View nearby charities on the interactive map
3. Click on a charity to see details
4. Select "Donate Here" to start the donation process
5. Choose items from your inventory to donate
6. Schedule pickup or drop-off

### Monitoring Your Impact

1. Visit the **Dashboard** to see:
   - Current inventory status
   - Items expiring soon
   - Waste reduction statistics
   - Money saved through better management
   - Donation impact metrics

## 📁 Project Structure

```
foodsaver-connect/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Dashboard/      # Dashboard-specific components
│   │   ├── Donations/      # Donation-related components
│   │   ├── Inventory/      # Inventory management components
│   │   ├── Layout/         # Layout and navigation components
│   │   └── Recipes/        # Recipe-related components
│   ├── contexts/           # React context providers
│   ├── data/              # Mock data and constants
│   ├── pages/             # Main page components
│   ├── services/          # API services and utilities
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── README.md             # Project documentation
```

## 🔌 API Integration

### Barcode Scanning Service

The application integrates with product databases to fetch information from barcodes:

```typescript
// Example usage
const product = await BarcodeService.lookupProduct('1234567890123');
if (product) {
  // Pre-fill form with product data
  setFormData({
    name: product.name,
    brand: product.brand,
    category: product.category,
    // ... other fields
  });
}
```

### Google Maps Integration

Location-based charity discovery using Google Maps API:

```typescript
// Find nearby charities
const location = await MapsService.getCurrentLocation();
const charities = await MapsService.findNearbyCharities(location);
```

### Planned Backend API

Future backend implementation will provide:
- User authentication and authorization
- Persistent data storage
- Real-time notifications
- Advanced analytics
- Business reporting features

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design for all components

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists
2. Create a new issue with detailed description
3. Include steps to reproduce (for bugs)
4. Add relevant labels

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Project Maintainers:**
- Email: contact@foodsaverconnect.com
- GitHub: [@botwhatsappappbob](https://github.com/botwhatsappappbob)

**Project Links:**
- Repository: [https://github.com/botwhatsappappbob/myapp](https://github.com/botwhatsappappbob/myapp)
- Issues: [https://github.com/botwhatsappappbob/myapp/issues](https://github.com/botwhatsappappbob/myapp/issues)
- Documentation: [https://foodsaverconnect.com/docs](https://foodsaverconnect.com/docs)

---

<div align="center">
  <p><strong>Together, we can reduce food waste and build a more sustainable future! 🌱</strong></p>
  
  ⭐ **Star this repository if you find it helpful!** ⭐
</div>