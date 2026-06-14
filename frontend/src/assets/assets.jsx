import { TruckIcon, LeafIcon, ClockIcon, ShieldCheckIcon, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";
import { SiFacebook, SiX, SiInstagram } from "@icons-pack/react-simple-icons";

// Guardamos una imagen de fondo de respaldo de Unsplash ya que borraste "hero_bg.jpeg"
const hero_bg_fallback = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&q=80";

export const assets = {
    delivery_truck: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png", // Respaldo en línea
    hero_bg: hero_bg_fallback,
};

export const categoriesData = [
    {
        slug: "tacos",
        name: "Tacos",
        image: "https://i.imgur.com/VxqDR4R.jpeg"
    },
    {
        slug: "refrescos",
        name: "Refrescos",
        image: "https://i.imgur.com/PTTU7b5.jpeg"
    },
    {
        slug: "postres",
        name: "Postres",
        image: "https://i.imgur.com/xnsgp5s.jpeg"
    },
];

export const heroSectionData = {
    description: "Tacos calientes, salsas artesanales y entregas rápidas a tu mesa. Pide directo desde nuestro menú.",
    hero_image: hero_bg_fallback, // Usando el enlace de respaldo seguro
    hero_features: [
        { icon: TruckIcon, title: "Entrega Rápida", desc: "Listo en minutos" },
        { icon: LeafIcon, title: "Sabor Auténtico", desc: "Recetas tradicionales" },
        { icon: ClockIcon, title: "Caliente al Llegar", desc: "Siempre recién hecho" },
        { icon: ShieldCheckIcon, title: "Pago Seguro", desc: "Tus datos protegidos" },
    ],
};

export const deliveryPartnerLoginImage = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200";

export const appPromoBannerData = {
    title: "",
    description: "",
};

export const footerData = {
    brand: {
        name: "Tacoteca",
        description: "Menú auténtico de tacos, refrescos y postres. Pide rápido, recibe caliente.",
        socials: [
            { icon: SiFacebook, link: "#" },
            { icon: SiX, link: "#" },
            { icon: SiInstagram, link: "#" },
        ],
    },

    sections: [
        {
            title: "Enlaces",
            links: [
                { label: "Menú", to: "/products" },
                { label: "Rastrear Pedido", to: "/orders" },
            ],
        },
    ],

    contact: [
        { icon: MapPinIcon, text: "Ave. Las Puentes # 944 Col. Las Puentes 7º Sector, San Nicolás de los Garza 66460" },
        { icon: PhoneIcon, text: "+52 81 2630 7135" },
    ],

    bottom: {
        copyright: "© 2026 TACOTECA. Todos los derechos reservados.",
        links: [
            { label: "Política de Privacidad", href: "#" },
            { label: "Términos de Servicio", href: "#" },
        ],
    },
};

export const statusColors = {
    Placed: "bg-blue-100 text-blue-700",
    Confirmed: "bg-indigo-100 text-indigo-700",
    Packed: "bg-purple-100 text-purple-700",
    "Out for Delivery": "bg-app-orange/10 text-app-orange",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
};

export const iconsForLeafpad = {
    truck: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
    destination: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
};

export const dummyProducts = [
    {
        _id: "tac-001",
        name: "Taco de Carne Asada",
        description: "Carnita Asada con tortilla de maíz recién hecha.",
        price: 28,
        originalPrice: 28,
        image: "https://i.imgur.com/OhgntjD.jpeg",
        category: "tacos",
        unit: "1pz",
        stock: 100,
        isOrganic: false,
        discount: 0,
        id: "tac-001",
    },
    {
        _id: "tac-002",
        name: "Taco de Barbacoa",
        description: "Barbacoa del día tierna de labio con tortilla de maíz recién hecha.",
        price: 28,
        originalPrice: 28,
        image: "https://i.imgur.com/VxqDR4R.jpeg",
        category: "tacos",
        unit: "1pz",
        stock: 95,
        isOrganic: false,
        discount: 0,
        id: "tac-002",
    },
    {
        _id: "tac-003",
        name: "Chileteca 🔥",
        description: "Taco de Chilito toreado relleno de queso gratinado y carne asada con tortilla de maíz recién hecha.",
        price: 40,
        originalPrice: 40,
        image: "https://i.imgur.com/Uct4Ik0.jpeg",
        category: "tacos",
        unit: "1pz",
        stock: 80,
        isOrganic: false,
        discount: 0,
        id: "tac-003",
    },
    {
        _id: "tac-004",
        name: "Tostateca",
        description: "Tostadita Asada con queso gratinado y carnita asada recién salida con tortilla de maíz recién hecha.",
        price: 40,
        originalPrice: 40,
        image: "https://i.imgur.com/dlAXrcv.jpeg",
        category: "tacos",
        unit: "1pz",
        stock: 85,
        isOrganic: false,
        discount: 0,
        id: "tac-004",
    },
    {
        _id: "tac-005",
        name: "Nopalight",
        description: "Nopalito asado con queso gratinado y carne asada, recién salida de la parrilla, alto en proteína.",
        price: 60,
        originalPrice: 60,
        image: "https://i.imgur.com/2rZEuvK.png",
        category: "tacos",
        unit: "1pz",
        stock: 60,
        isOrganic: false,
        discount: 0,
        id: "tac-005",
    },
    {
        _id: "ref-001",
        name: "Coca Cola",
        description: "Bebida refrescante en botella.",
        price: 28,
        originalPrice: 28,
        image: "https://i.imgur.com/PTTU7b5.jpeg",
        category: "refrescos",
        unit: "botella",
        stock: 150,
        isOrganic: false,
        discount: 0,
        id: "ref-001",
    },
    {
        _id: "ref-002",
        name: "Joya",
        description: "Bebida refrescante natural.",
        price: 28,
        originalPrice: 28,
        image: "https://i.imgur.com/NBmMODM.jpeg",
        category: "refrescos",
        unit: "botella",
        stock: 140,
        isOrganic: false,
        discount: 0,
        id: "ref-002",
    },
    {
        _id: "ref-003",
        name: "Ciel",
        description: "Agua embotellada.",
        price: 35,
        originalPrice: 35,
        image: "https://i.imgur.com/pAC1EHF.jpeg",
        category: "refrescos",
        unit: "botella",
        stock: 130,
        isOrganic: false,
        discount: 0,
        id: "ref-003",
    },
    {
        _id: "ref-004",
        name: "Fuze Tea",
        description: "Bebida refrescante con sabor a té.",
        price: 35,
        originalPrice: 35,
        image: "https://i.imgur.com/V0HsT50.jpeg",
        category: "refrescos",
        unit: "botella",
        stock: 120,
        isOrganic: false,
        discount: 0,
        id: "ref-004",
    },
    {
        _id: "ref-005",
        name: "Café",
        description: "Café recién preparado.",
        price: 28,
        originalPrice: 28,
        image: "https://i.imgur.com/JwNG6Ho.jpeg",
        category: "refrescos",
        unit: "taza",
        stock: 100,
        isOrganic: false,
        discount: 0,
        id: "ref-005",
    },
    {
        _id: "pos-001",
        name: "Pan de Elote",
        description: "Pan dulce de elote casero.",
        price: 40,
        originalPrice: 40,
        image: "https://i.imgur.com/xnsgp5s.jpeg",
        category: "postres",
        unit: "1pz",
        stock: 50,
        isOrganic: false,
        discount: 0,
        id: "pos-001",
    },
    {
        _id: "pos-002",
        name: "Kilo de Tortillas de Maíz",
        description: "Tortillas de maíz recién hechas.",
        price: 28,
        originalPrice: 28,
        image: "https://i.imgur.com/RmFg8YV.jpeg",
        category: "postres",
        unit: "1kg",
        stock: 80,
        isOrganic: false,
        discount: 0,
        id: "pos-002",
    },
    {
        _id: "pos-003",
        name: "Totopos 300 gr",
        description: "Totopos crujientes de maíz.",
        price: 30,
        originalPrice: 30,
        image: "https://i.imgur.com/W3e2PxZ.jpeg",
        category: "postres",
        unit: "300gr",
        stock: 70,
        isOrganic: false,
        discount: 0,
        id: "pos-003",
    },
];

export const dummyAdminDashboardData = {
    totalOrders: 1,
    totalUsers: 3,
    totalProducts: 14,
    outOfStock: 0,
    totalPartners: 2,
    recentOrders: [
        {
            shippingAddress: {
                label: "Home",
                address: "New Market Road ",
                city: "New York ",
                state: "NY",
                zip: "876543",
                lat: 40.7128,
                lng: -74.006,
            },
            liveLocation: {
                lat: 40.7128,
                lng: -74.006,
                updatedAt: "2026-04-06T08:41:27.211Z",
            },
            _id: "69d366617ed7e54198d67dac",
            user: {
                _id: "69bb6caf448f2d818db59122",
                name: "Admin",
                email: "admin@example.com",
            },
            items: [
                {
                    product: "tac-001",
                    name: "Tacos al Pastor (3pz)",
                    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=500&q=80",
                    price: 98,
                    quantity: 2,
                    unit: "3pz",
                    _id: "69d366617ed7e54198d67dad",
                },
                {
                    product: "tac-003",
                    name: "Tacos de Carnitas (3pz)",
                    image: "https://images.unsplash.com/photo-1601924926742-0e4b833d8eed?auto=format&fit=crop&w=500&q=80",
                    price: 105,
                    quantity: 1,
                    unit: "3pz",
                    _id: "69d366617ed7e54198d67dae",
                },
            ],
            paymentMethod: "cash",
            subtotal: 230,
            deliveryFee: 0,
            tax: 18.4,
            total: 248.4,
            status: "Delivered",
            statusHistory: [
                { status: "Placed", note: "Order placed successfully", _id: "69d366617ed7e54198d67daf", timestamp: "2026-04-06T07:53:05.769Z" },
                { status: "Assigned", note: "Assigned to Rahul", _id: "69d366ab7ed7e54198d67dbe", timestamp: "2026-04-06T07:54:19.796Z" },
                { status: "Packed", note: "Status updated to Packed", _id: "69d366b37ed7e54198d67ddc", timestamp: "2026-04-06T07:54:27.171Z" },
                { status: "Out for Delivery", note: "Status updated to Out for Delivery", _id: "69d366b57ed7e54198d67e00", timestamp: "2026-04-06T07:54:29.226Z" },
                { status: "Delivered", note: "Delivered by partner", _id: "69d373207ed7e54198d681b1", timestamp: "2026-04-06T08:47:28.983Z" },
            ],
            deliveryPartner: { _id: "69bbfc3866db7c6cdea47ede", name: "Rahul", phone: "987654321" },
            deliveryOtp: "",
            isPaid: false,
            createdAt: "2026-04-06T07:53:05.774Z",
            updatedAt: "2026-04-06T08:47:28.984Z",
            __v: 4,
        },
    ],
};

export const dummyDeliveryPartnerData = [
    {
        _id: "69bbfc6c66db7c6cdea47ee4",
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "987654321",
        avatar: "",
        vehicleType: "bike",
        isActive: true,
        createdAt: "2026-03-19T13:38:52.827Z",
        updatedAt: "2026-03-19T13:38:52.827Z",
        __v: 0,
    },
    {
        _id: "69bbfc3866db7c6cdea47ede",
        name: "Rahul",
        email: "rahul@example.com",
        phone: "987654321",
        avatar: "",
        vehicleType: "bike",
        isActive: true,
        createdAt: "2026-03-19T13:38:00.872Z",
        updatedAt: "2026-03-19T13:38:00.872Z",
        __v: 0,
    },
];

export const dummyDashboardOrdersData = [
    {
        shippingAddress: { label: "Home", address: "Av. Tacoteca 123", city: "Ciudad", state: "CDMX", zip: "01000", lat: 19.4326, lng: -99.1332 },
        liveLocation: { lat: 19.4326, lng: -99.1332, updatedAt: "2026-04-06T08:41:27.211Z" },
        _id: "69d366617ed7e54198d67dac",
        user: { _id: "69bb6caf448f2d818db59122", name: "Admin", email: "admin@example.com" },
        items: [
            { product: "tac-001", name: "Taco de Carne Asada", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80", price: 28, quantity: 2, unit: "1pz", _id: "69d366617ed7e54198d67dad" },
            { product: "ref-001", name: "Coca Cola / Joya", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=500&q=80", price: 28, quantity: 1, unit: "botella", _id: "69d366617ed7e54198d67dae" },
        ],
        paymentMethod: "cash",
        subtotal: 84,
        deliveryFee: 0,
        tax: 24.08,
        total: 325.08,
        status: "Delivered",
        statusHistory: [
            { status: "Placed", note: "Order placed successfully", _id: "69d366617ed7e54198d67daf", timestamp: "2026-04-06T07:53:05.769Z" },
            { status: "Assigned", note: "Assigned to Rahul", _id: "69d366ab7ed7e54198d67dbe", timestamp: "2026-04-06T07:54:19.796Z" },
            { status: "Packed", note: "Status updated to Packed", _id: "69d366b37ed7e54198d67ddc", timestamp: "2026-04-06T07:54:27.171Z" },
            { status: "Out for Delivery", note: "Status updated to Out for Delivery", _id: "69d366b57ed7e54198d67e00", timestamp: "2026-04-06T07:54:29.226Z" },
            { status: "Delivered", note: "Delivered by partner", _id: "69d373207ed7e54198d681b1", timestamp: "2026-04-06T08:47:28.983Z" },
        ],
        deliveryPartner: { _id: "69bbfc3866db7c6cdea47ede", name: "Rahul", email: "rahul@example.com", phone: "987654321" },
        deliveryOtp: "",
        isPaid: false,
        createdAt: "2026-04-06T07:53:05.774Z",
        updatedAt: "2026-04-06T08:47:28.984Z",
        __v: 4,
    },
    {
        shippingAddress: { label: "Home", address: "Av. Tacoteca 123", city: "Ciudad", state: "CDMX", zip: "01000", lat: 19.4326, lng: -99.1332 },
        liveLocation: { lat: 19.4326, lng: -99.1332, updatedAt: "2026-04-06T08:41:27.211Z" },
        _id: "69d366617ed7e54198d67dad",
        user: { _id: "69bb6caf448f2d818db59122", name: "Admin", email: "admin@example.com" },
        items: [
            { product: "tac-002", name: "Taco de Barbacoa", image: "https://images.unsplash.com/photo-1601924926742-0e4b833d8eed?auto=format&fit=crop&w=500&q=80", price: 28, quantity: 3, unit: "1pz", _id: "69d366617ed7e54198d67dad" },
            { product: "pos-001", name: "Pan de Elote", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80", price: 40, quantity: 1, unit: "1pz", _id: "69d366617ed7e54198d67dae" },
        ],
        paymentMethod: "cash",
        subtotal: 124,
        deliveryFee: 0,
        tax: 9.92,
        total: 133.92,
        status: "Out for Delivery",
        statusHistory: [
            { status: "Placed", note: "Order placed successfully", _id: "69d366617ed7e54198d67daf", timestamp: "2026-04-06T07:53:05.769Z" },
            { status: "Assigned", note: "Assigned to Rahul", _id: "69d366ab7ed7e54198d67dbe", timestamp: "2026-04-06T07:54:19.796Z" },
            { status: "Packed", note: "Status updated to Packed", _id: "69d366b37ed7e54198d67ddc", timestamp: "2026-04-06T07:54:27.171Z" },
            { status: "Out for Delivery", note: "Status updated to Out for Delivery", _id: "69d366b57ed7e54198d67e00", timestamp: "2026-04-06T07:54:29.226Z" },
        ],
        deliveryPartner: { _id: "69bbfc3866db7c6cdea47ede", name: "Rahul", email: "rahul@example.com", phone: "987654321" },
        deliveryOtp: "754730",
        isPaid: false,
        createdAt: "2026-04-06T07:53:05.774Z",
        updatedAt: "2026-04-06T08:47:28.984Z",
        __v: 4,
    },
];

export const dummyCartData = [
    { product: dummyProducts[0], quantity: 1 },
    { product: dummyProducts[1], quantity: 1 },
    { product: dummyProducts[2], quantity: 1 },
];

export const dummyAddressData = [
    { label: "Home", address: "123 Main St ", city: "New York ", state: "NY", zip: "10001", isDefault: true, lat: 40.7128, lng: -74.006, _id: "69d3652df9a340288f1a0f8c" },
    { label: "Work", address: "456 Market St ", city: "New York ", state: "NY", zip: "10002", isDefault: false, lat: 40.7128, lng: -74.006, _id: "69d3652df9a340288f1a0f8d" },
];