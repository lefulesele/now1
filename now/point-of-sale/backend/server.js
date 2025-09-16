const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001; // backend runs on port 3001

// Middleware
app.use(cors());
app.use(express.json());

// File paths (ensure "backend" folder exists with empty JSON files)
const productsFilePath = path.join(__dirname, 'products.json');

// Utility functions
const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
};

const writeData = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

/* ===========================
   PRODUCTS API
=========================== */

app.get('/api/products', async (req, res) => {
  try {
    const products = await readData(productsFilePath);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error reading products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const products = await readData(productsFilePath);
    const newProduct = { _id: Date.now().toString(), ...req.body };
    products.push(newProduct);
    await writeData(productsFilePath, products);
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error saving product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const products = await readData(productsFilePath);
    const index = products.findIndex(p => p._id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await writeData(productsFilePath, products);
      res.json(products[index]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const products = await readData(productsFilePath);
    const filtered = products.filter(p => p._id !== id);
    await writeData(productsFilePath, filtered);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

/* ===========================
   CUSTOMERS API
=========================== */

// Path for customers.json
const customersFilePath = path.join(__dirname, 'customers.json');

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await readData(customersFilePath);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error reading customers' });
  }
});

// Add a new customer
app.post('/api/customers', async (req, res) => {
  try {
    const customers = await readData(customersFilePath);
    const newCustomer = {
      _id: Date.now().toString(),
      ...req.body, // expects {name, email, phone} from frontend
    };
    customers.push(newCustomer);
    await writeData(customersFilePath, customers);
    res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Error saving customer' });
  }
});


/* ===========================
   SALES API
=========================== */

const salesFilePath = path.join(__dirname, 'sales.json');

// Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await readData(salesFilePath);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Error reading sales' });
  }
});

// Add a new sale
app.post('/api/sales', async (req, res) => {
  try {
    const sales = await readData(salesFilePath);
    const products = await readData(productsFilePath);
    const customers = await readData(customersFilePath);

    const { productId, customerId, quantity } = req.body;

    // validate product
    const productIndex = products.findIndex(p => p._id === productId);
    if (productIndex === -1) return res.status(400).json({ message: "Product not found" });
    const product = products[productIndex];

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // validate customer
    const customer = customers.find(c => c._id === customerId);
    if (!customer) return res.status(400).json({ message: "Customer not found" });

    // Deduct stock
    products[productIndex].quantity -= quantity;
    await writeData(productsFilePath, products);

    // Create sale record
    const newSale = {
      _id: Date.now().toString(),
      productId,
      productName: product.name,
      customerId,
      customerName: customer.name,
      quantity,
      date: new Date().toLocaleString()
    };

    // Save sale
    sales.push(newSale);
    await writeData(salesFilePath, sales);

    res.json(newSale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving sale" });
  }
});



// Start server
console.log(`JSON backend running at http://localhost:${PORT}`);



