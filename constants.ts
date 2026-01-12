import { Product, Order, ReturnRequest, ReturnStatus, ReturnReason, ReturnMode, Role, User } from './types';

export const MOCK_USERS: User[] = [
  {
    name: "Ahmed Bennani",
    email: "client@example.com",
    role: Role.CLIENT,
    phone: "+212 600 000 000",
    city: "Casablanca",
    avatar: "https://picsum.photos/200/200"
  },
  {
    name: "Logistique Maroc S.A.R.L",
    email: "admin@example.com",
    role: Role.ADMIN,
    phone: "+212 500 000 000",
    city: "Rabat",
    avatar: "https://picsum.photos/201/201"
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    sku: "PRD-001",
    name: "Smartphone Atlas X1",
    category: "Électronique",
    price: 2500,
    image: "https://picsum.photos/300/300?random=1",
    description: "Smartphone haute performance conçu au Maroc."
  },
  {
    sku: "PRD-002",
    name: "Cafetière Express",
    category: "Électroménager",
    price: 800,
    image: "https://picsum.photos/300/300?random=2",
    description: "Cafetière automatique compatible capsules."
  },
  {
    sku: "PRD-003",
    name: "Chaussures Cuir Fès",
    category: "Mode",
    price: 450,
    image: "https://picsum.photos/300/300?random=3",
    description: "Cuir véritable fait main."
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "CMD-2023-884",
    clientEmail: "client@example.com",
    productSku: "PRD-001",
    purchaseDate: "2023-10-01",
    status: "Livré",
    returnDeadline: "2023-11-01"
  },
  {
    id: "CMD-2023-992",
    clientEmail: "client@example.com",
    productSku: "PRD-002",
    purchaseDate: "2023-10-15",
    status: "Livré",
    returnDeadline: "2023-11-15"
  },
  {
    id: "CMD-2023-995",
    clientEmail: "client@example.com",
    productSku: "PRD-003",
    purchaseDate: "2023-10-20",
    status: "Livré",
    returnDeadline: "2023-11-20"
  }
];

export const INITIAL_RETURNS: ReturnRequest[] = [
  {
    id: "RET-001",
    orderId: "CMD-2023-884",
    clientEmail: "client@example.com",
    requestDate: "2023-10-25",
    reason: ReturnReason.DEFECTIVE,
    returnMode: ReturnMode.HOME,
    status: ReturnStatus.PROCESSING,
    progress: 60,
    satisfaction: 4,
    timeline: [
      { status: ReturnStatus.CREATED, date: "2023-10-25" },
      { status: ReturnStatus.VALIDATED, date: "2023-10-26" },
      { status: ReturnStatus.COLLECTED, date: "2023-10-27" },
      { status: ReturnStatus.PROCESSING, date: "2023-10-28" }
    ]
  },
  {
    id: "RET-002",
    orderId: "CMD-2023-992",
    clientEmail: "another@example.com",
    requestDate: "2023-10-26",
    reason: ReturnReason.CHANGE_MIND,
    returnMode: ReturnMode.RELAY,
    status: ReturnStatus.CREATED,
    progress: 10,
    timeline: [
        { status: ReturnStatus.CREATED, date: "2023-10-26" }
    ]
  }
];
