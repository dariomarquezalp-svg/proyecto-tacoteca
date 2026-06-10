const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1️⃣ ¡AQUÍ NACE 'app'! (Línea crítica, todo lo que use 'app' va abajo de esto)
const app = express();

// 2️⃣ Middlewares globales obligatorios
app.use(cors());
app.use(express.json());

// 🍃 Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tacoteca_db')
  .then(() => console.log('✅ ¡Conectado exitosamente a MongoDB Compass!'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// 📐 Esquema y Modelo de Usuario
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: { type: Array, default: [] } 
});

const User = mongoose.model('User', UserSchema);

// 📐 Esquema y Modelo de Pedidos
const OrderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: { type: Array, required: true }, 
  total: { type: Number, required: true },
  direccion: { type: Object, default: {} }, 
  fecha: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);


// 🚪 RUTA 1: Registro de Usuarios
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const newUser = new User({ name, email, password, addresses: [] });
    await newUser.save();

    res.status(201).json({ user: { name: newUser.name, email: newUser.email, addresses: [] } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
});

// 🚪 RUTA 2: Inicio de Sesión (Login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({ user: { name: user.name, email: user.email, addresses: user.addresses || [] } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
});

// 📍 RUTAS ESTÁTICAS: Control de Direcciones (GET y POST)
app.route(['/api/addresses', '/addresses'])
  .get(async (req, res) => {
    try {
      const email = req.query.email;
      if (email) {
        const user = await User.findOne({ email });
        return res.status(200).json(user?.addresses || []);
      }
      res.status(200).json([]);
    } catch (error) {
      res.status(500).json({ message: 'Error al cargar las direcciones' });
    }
  })
  .post(async (req, res) => {
    try {
      const { email, label, address, city, state, zip, isDefault, lat, lng } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (isDefault) {
        user.addresses = user.addresses.map(addr => ({ ...addr, isDefault: false }));
      }

      const newAddress = {
        _id: new mongoose.Types.ObjectId().toString(),
        label,
        address,
        city,
        state,
        zip,
        isDefault: isDefault || false,
        lat: Number(lat),
        lng: Number(lng)
      };

      user.addresses.push(newAddress);
      await user.save();
      
      console.log(`📍 ¡Nueva dirección guardada con éxito para ${email}!`);
      res.status(200).json({ message: "Dirección guardada", addresses: user.addresses });
    } catch (error) {
      console.error("❌ Error al guardar dirección:", error);
      res.status(500).json({ message: "Error interno al procesar la dirección" });
    }
  });


// ==========================================
// 🔄 LÓGICA Y RUTAS DINÁMICAS (PUT)
// ==========================================
const updateAddressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, label, address, city, state, zip, isDefault, lat, lng } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (isDefault) {
      user.addresses = user.addresses.map(addr => ({ ...addr, isDefault: false }));
    }

    user.addresses = user.addresses.map(addr => {
      if (addr._id === id || addr.id === id) {
        return {
          ...addr,
          label,
          address,
          city,
          state,
          zip,
          isDefault,
          lat: Number(lat),
          lng: Number(lng)
        };
      }
      return addr;
    });

    await user.save();
    console.log(`🔄 Dirección ${id} actualizada para ${email}`);
    return res.status(200).json({ message: "Dirección actualizada con éxito", addresses: user.addresses });
  } catch (error) {
    console.error("❌ Error al actualizar dirección:", error);
    return res.status(500).json({ message: "Error al actualizar dirección" });
  }
};

app.put('/api/addresses/:id', updateAddressHandler);
app.put('/addresses/:id', updateAddressHandler);


// ==========================================
// 🗑️ LÓGICA Y RUTAS DINÁMICAS (DELETE)
// ==========================================
const deleteAddressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.addresses = user.addresses.filter(addr => addr._id !== id && addr.id !== id);
    await user.save();

    console.log(`🗑️ Dirección ${id} eliminada para el usuario ${email}.`);
    return res.status(200).json({ message: "Dirección eliminada con éxito", addresses: user.addresses });
  } catch (error) {
    console.error("❌ Error al eliminar dirección:", error);
    return res.status(500).json({ message: "Error al eliminar dirección" });
  }
};

app.delete('/api/addresses/:id', deleteAddressHandler);
app.delete('/addresses/:id', deleteAddressHandler);


// 🛒 RUTA 3: Guardar Órdenes de Compra (Checkout)
app.post(['/api/orders', '/orders'], async (req, res) => {
  try {
    const { email, items, total, direccion } = req.body;

    const newOrder = new Order({
      email: email || "usuario_anonimo@tacoteca.com",
      items,
      total,
      direccion
    });

    await newOrder.save();
    console.log("🛒 ¡Pedido guardado con éxito en MongoDB Compass!");

    res.status(201).json({ message: '¡Pedido procesado con éxito!', order: newOrder });
  } catch (error) {
    console.error("❌ Error al guardar pedido:", error);
    res.status(500).json({ message: 'Error en el servidor al procesar el pedido' });
  }
});

// 📦 RUTA 4: Obtener Historial de Pedidos (GET)
app.get(['/api/orders', '/orders'], async (req, res) => {
  try {
    const orders = await Order.find().sort({ fecha: -1 });
    console.log(`📦 Enviando ${orders.length} pedidos al historial del frontend.`);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error al obtener el historial de pedidos:", error);
    res.status(500).json({ message: 'Error en el servidor al cargar tus pedidos' });
  }
});


// 🚀 Encender el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de la Tacoteca corriendo en http://localhost:${PORT}`);
});