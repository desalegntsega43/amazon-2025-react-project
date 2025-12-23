# Amazon-Style E-commerce Website

A fully responsive Amazon-style e-commerce application built with React, Vite, React Router DOM, and CSS Modules.

## 🚀 Live Demo

**Deployed on Netlify**: [https://capable-salamander-c75e58.netlify.app](https://capable-salamander-c75e58.netlify.app)

## Features

- 🏠 **Home Page** - Hero carousel with category cards overlay (Amazon-style)
- 🧭 **Horizontal SubNav** - Scrollable menu bar with smooth navigation
- 🛍️ **Product Listing** - Filter by category and sort by price/rating
- 📦 **Product Details** - Detailed product view with add to cart
- 🛒 **Shopping Cart** - Add, remove, update quantities, and view total
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **CSS Modules** - Scoped styling for each component
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **CSS Modules** - Component-scoped styling
- **Context API** - Global state management for cart

## Project Structure

```
amazon-react/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── SubNav/          # Horizontal scrolling menu (2 approaches)
│   │   ├── Footer/
│   │   ├── Layout/
│   │   └── ProductCard/
│   ├── pages/
│   │   ├── Home/            # Hero carousel + category cards
│   │   ├── Products/
│   │   ├── ProductDetail/
│   │   └── Cart/
│   ├── context/
│   │   └── CartContext.jsx
│   ├── data/
│   │   └── products.json
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── SUBNAV-GUIDE.md          # Documentation for SubNav approaches
└── package.json
```

## Getting Started

### Installation

```bash
cd amazon-react
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features Breakdown

### Cart Context

Global cart state management with:

- Add to cart
- Remove from cart
- Update quantity
- Calculate total
- Get cart count
- Clear cart

### Routing

- `/` - Home page
- `/products` - All products with filters
- `/product/:id` - Product detail page
- `/cart` - Shopping cart

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Collapsible navigation on mobile

## SubNav Component

The project includes **two approaches** for the horizontal scrolling navigation:

1. **JavaScript Approach** (default) - Scroll buttons with smooth animation
2. **CSS-Only Approach** - Pure CSS, no JavaScript required

See `SUBNAV-GUIDE.md` for detailed documentation and how to switch between approaches.

## Customization

### Adding Products

Edit `src/data/products.json` to add or modify products:

```json
{
  "id": 9,
  "name": "Product Name",
  "price": 99.99,
  "rating": 4.5,
  "reviews": 100,
  "image": "https://example.com/image.jpg",
  "category": "Category",
  "description": "Product description"
}
```

### Styling

Each component has its own CSS Module file (`.module.css`). Modify these files to customize the appearance.

### API Integration

Replace the static JSON data with API calls:

1. Create an API service in `src/services/api.js`
2. Use `fetch` or `axios` to get data
3. Update components to use async data fetching

## Future Enhancements

- [ ] User authentication
- [ ] Search functionality
- [ ] Product reviews
- [ ] Wishlist
- [ ] Payment integration
- [ ] Order history
- [ ] Admin dashboard
- [ ] Product recommendations

## License

MIT

## Author

Built with ❤️ using React and Vite
