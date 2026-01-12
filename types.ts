export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export enum ReturnStatus {
  CREATED = 'Créé',
  VALIDATED = 'Validé',
  COLLECTED = 'Collecté',
  TRANSIT = 'En Transit',
  RECEIVED = 'Réceptionné',
  PROCESSING = 'Traitement',
  REFUNDED = 'Remboursé',
  REFUSED = 'Refusé'
}

export enum ReturnReason {
  DEFECTIVE = 'Défectueux',
  RECYCLING = 'Recyclage',
  REFURBISH = 'Reconditionnement',
  DEPOSIT = 'Consigne',
  CHANGE_MIND = 'Changement d\'avis'
}

export enum ReturnMode {
  HOME = 'Collecte à Domicile',
  RELAY = 'Point Relais',
  STORE = 'Dépôt Magasin'
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  clientEmail: string;
  productSku: string;
  purchaseDate: string;
  status: string;
  returnDeadline: string;
  product?: Product; // Hydrated
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  clientEmail: string;
  requestDate: string;
  reason: ReturnReason;
  proofImage?: string;
  description?: string;
  returnMode: ReturnMode;
  status: ReturnStatus;
  progress: number; // 0-100
  satisfaction?: number; // 1-5
  timeline: { status: ReturnStatus; date: string }[];
}

export interface User {
  name: string;
  email: string;
  role: Role;
  phone: string;
  city: string;
  avatar: string;
}
