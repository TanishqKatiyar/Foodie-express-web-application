import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Restaurants Data
  const restaurants = [
    {
      id: "1",
      name: "Burger King",
      cuisine: "Fast Food",
      rating: 4.5,
      deliveryTime: "20-30 min",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      menu: [
        { id: "bk1", name: "Whopper", price: 6.49, description: "Flame-grilled beef patty with tomatoes, lettuce, mayo, ketchup, pickles, and onions on a toasted sesame seed bun.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" },
        { id: "bk2", name: "Chicken Fries", price: 4.99, description: "Crispy, breaded white meat chicken in a fry shape.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400" },
        { id: "bk3", name: "Impossible Whopper", price: 7.49, description: "A plant-based patty that tastes like beef, topped with tomatoes, lettuce, mayo, ketchup, pickles, and onions.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=400" },
        { id: "bk4", name: "Big King", price: 5.99, description: "Two flame-grilled beef patties, topped with melted American cheese, fresh onions, pickles, lettuce, and signature Stacker Sauce.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400" }
      ]
    },
    {
      id: "2",
      name: "Pizza Hut",
      cuisine: "Italian",
      rating: 4.2,
      deliveryTime: "30-40 min",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000",
      featured: true,
      menu: [
        { id: "ph1", name: "Pepperoni Pizza", price: 14.99, description: "Classic pepperoni, mozzarella cheese, and signature tomato sauce.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400" },
        { id: "ph2", name: "Meat Lover's Pizza", price: 16.99, description: "Pepperoni, Italian sausage, ham, bacon, seasoned pork, and beef.", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=400" },
        { id: "ph3", name: "Stuffed Crust Pizza", price: 18.99, description: "Our famous crust stuffed with warm, melty cheese.", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=400" },
        { id: "ph4", name: "Breadsticks", price: 5.99, description: "Crispy on the outside, soft on the inside, sprinkled with garlic and parmesan.", image: "https://images.unsplash.com/photo-1604467731651-3d9b8969826a?auto=format&fit=crop&q=80&w=400" }
      ]
    },
    {
      id: "3",
      name: "Sushi Zen",
      cuisine: "Japanese",
      rating: 4.8,
      deliveryTime: "40-50 min",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      menu: [
        { id: "sz1", name: "California Roll", price: 8.50, description: "Crab, avocado, and cucumber rolled in seaweed and rice.", image: "https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&q=80&w=400" },
        { id: "sz2", name: "Spicy Tuna Roll", price: 9.95, description: "Fresh tuna mixed with spicy mayo and cucumber.", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=400" },
        { id: "sz3", name: "Dragon Roll", price: 14.50, description: "Shrimp tempura and cucumber topped with avocado and eel sauce.", image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&q=80&w=400" },
        { id: "sz4", name: "Miso Soup", price: 3.50, description: "Traditional Japanese soup with tofu, seaweed, and green onions.", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400" }
      ]
    },
    {
      id: "4",
      name: "Taco Bell",
      cuisine: "Mexican",
      rating: 4.0,
      deliveryTime: "15-25 min",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      menu: [
        { id: "tb1", name: "Crunchwrap Supreme", price: 4.89, description: "A flour tortilla layered with seasoned beef, nacho cheese sauce, a crunchy tostada shell, sour cream, lettuce, and tomatoes.", image: "https://images.unsplash.com/photo-1599974599969-a7801b6a4f77?auto=format&fit=crop&q=80&w=400" },
        { id: "tb2", name: "Chalupa Supreme", price: 4.19, description: "A chewy, flaky flatbread shell filled with seasoned beef, lettuce, tomatoes, cheese, and sour cream.", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=400" },
        { id: "tb3", name: "Nacho Fries", price: 2.29, description: "Crispy fries seasoned with bold Mexican spices and served with a side of warm nacho cheese sauce.", image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=400" },
        { id: "tb4", name: "Cheesy Gordita Crunch", price: 4.69, description: "A warm flatbread layered with three-cheese blend and wrapped around a crunchy taco shell filled with seasoned beef, spicy ranch sauce, lettuce, and cheddar cheese.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=400" }
      ]
    },
  ];

  app.get("/api/restaurants", (req, res) => {
    res.json(restaurants);
  });

  app.get("/api/restaurants/:id", (req, res) => {
    const restaurant = restaurants.find((r) => r.id === req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    
    res.json(restaurant);
  });

  // Mock Payment
  app.post("/api/payment", (req, res) => {
    const { amount, cart } = req.body;
    // Simulate payment processing
    setTimeout(() => {
      res.json({ success: true, transactionId: "TXN-" + Math.random().toString(36).substr(2, 9) });
    }, 1000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
