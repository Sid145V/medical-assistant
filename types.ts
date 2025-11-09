
export enum UserRole {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  SHOP = 'shop',
}

export interface BaseUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Patient extends BaseUser {
  role: UserRole.PATIENT;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
}

export interface Doctor extends BaseUser {
  role: UserRole.DOCTOR;
  name: string;
  qualification: string;
  experience: number;
  location: string;
  image: string;
}

export interface Shop extends BaseUser {
  role: UserRole.SHOP;
  shopName: string;
  ownerName: string;
  license: string;
  yearsActive: number;
  location: string;
}

export interface Admin extends BaseUser {
  role: UserRole.ADMIN;
  username: string;
}

export type User = Patient | Doctor | Shop | Admin;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

export interface Medicine {
    id: string;
    shopId: string;
    shopName: string;
    name: string;
    price: number;
    minOrderQuantity: number;
    image: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    status: 'booked' | 'completed' | 'cancelled';
}

export interface Order {
    id: string;
    patientId: string;
    shopId: string;
    medicineId: string;
    medicineName: string;
    quantity: number;
    address: string;
    paymentMethod: 'upi' | 'cash_on_delivery';
    utr?: string;
    timestamp: string;
}