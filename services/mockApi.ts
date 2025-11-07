import { UserRole, User, Patient, Doctor, Shop, Admin, ContactMessage, Medicine, Appointment, Order } from '../types';

export type Credentials = {
  identifier: string; // email, phone, or username for admin
  password?: string;
};

// --- In-memory database with localStorage persistence ---

const DB_KEY = 'ai-medical-assistant-db';

const defaultDB = {
  users: [
    { id: 'admin-1', role: UserRole.ADMIN, username: 'admin', email: 'admin@test.com', phone: '0000000000' },
    { id: 'patient-1', role: UserRole.PATIENT, firstName: 'John', lastName: 'Doe', age: 35, gender: 'male', location: 'New York', email: 'john@test.com', phone: '1234567890' },
    { id: 'doctor-1', role: UserRole.DOCTOR, name: 'Dr. Alice Smith', qualification: 'MD, Cardiology', experience: 15, location: 'New York', email: 'alice@test.com', phone: '1112223333', image: 'https://picsum.photos/seed/doc1/200' },
    { id: 'doctor-2', role: UserRole.DOCTOR, name: 'Dr. Bob Johnson', qualification: 'MBBS, General Physician', experience: 8, location: 'Los Angeles', email: 'bob@test.com', phone: '4445556666', image: 'https://picsum.photos/seed/doc2/200' },
    { id: 'shop-1', role: UserRole.SHOP, shopName: 'HealthFirst Pharmacy', ownerName: 'Charlie Brown', license: 'LIC12345', yearsActive: 10, location: 'New York', email: 'shop1@test.com', phone: '7778889999' },
  ] as User[],
  passwords: {
    'admin-1': 'admin',
    'patient-1': 'password',
    'doctor-1': 'password',
    'doctor-2': 'password',
    'shop-1': 'password',
  } as Record<string, string>,
  medicines: [
    { id: 'med-1', shopId: 'shop-1', shopName: 'HealthFirst Pharmacy', name: 'Paracetamol 500mg', price: 5.99, minOrderQuantity: 1, image: 'https://picsum.photos/seed/med1/300' },
    { id: 'med-2', shopId: 'shop-1', shopName: 'HealthFirst Pharmacy', name: 'Cough Syrup', price: 12.50, minOrderQuantity: 1, image: 'https://picsum.photos/seed/med2/300' },
  ] as Medicine[],
  appointments: [] as Appointment[],
  orders: [] as Order[],
  messages: [] as ContactMessage[],
};

const getDB = () => {
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      return JSON.parse(dbString);
    }
  } catch (e) {
    console.error("Failed to parse DB from localStorage", e);
  }
  return JSON.parse(JSON.stringify(defaultDB)); // Deep copy to avoid mutation issues
};

const saveDB = (db: any) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Seed DB if it doesn't exist
if (!localStorage.getItem(DB_KEY)) {
  saveDB(defaultDB);
}

// --- API Implementation ---

const simulateDelay = (ms = 500) => new Promise(res => setTimeout(res, ms));

const findUser = (db: any, identifier: string): User | undefined => {
    return db.users.find((u: User) => {
        if (u.role === UserRole.ADMIN) {
            return (u as Admin).username === identifier;
        }
        return u.email === identifier || u.phone === identifier;
    });
};

export const api = {
  async login(credentials: Credentials, role: UserRole): Promise<User> {
    await simulateDelay();
    const db = getDB();
    const user = findUser(db, credentials.identifier);

    if (!user || user.role !== role) {
      throw new Error('Account not found. Please sign up.');
    }

    if (db.passwords[user.id] !== credentials.password) {
      throw new Error('Invalid password.');
    }

    return user;
  },

  async signup(userData: any, role: UserRole): Promise<User> {
    await simulateDelay();
    const db = getDB();
    
    if (findUser(db, userData.email) || findUser(db, userData.phone)) {
        throw new Error('Email or phone already in use. Please log in.');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      role,
      ...userData,
    };
    
    db.users.push(newUser);
    db.passwords[newUser.id] = userData.password;
    saveDB(db);
    return newUser;
  },
  
  async getPatients(): Promise<Patient[]> {
    await simulateDelay();
    return getDB().users.filter((u: User) => u.role === UserRole.PATIENT);
  },
  
  async getDoctors(): Promise<Doctor[]> {
    await simulateDelay();
    return getDB().users.filter((u: User) => u.role === UserRole.DOCTOR);
  },
  
  async getShops(): Promise<Shop[]> {
    await simulateDelay();
    return getDB().users.filter((u: User) => u.role === UserRole.SHOP);
  },
  
  async getContactMessages(): Promise<ContactMessage[]> {
     await simulateDelay();
     return getDB().messages;
  },

  async submitContactForm(formData: Omit<ContactMessage, 'id' | 'timestamp'>): Promise<ContactMessage> {
      await simulateDelay();
      const db = getDB();
      const newMessage: ContactMessage = {
          ...formData,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
      };
      db.messages.push(newMessage);
      saveDB(db);
      return newMessage;
  },

  async getMedicines(): Promise<Medicine[]> {
      await simulateDelay();
      return getDB().medicines;
  },
  
  async getMedicinesByShop(shopId: string): Promise<Medicine[]> {
      await simulateDelay();
      return getDB().medicines.filter((m: Medicine) => m.shopId === shopId);
  },

  async addMedicine(medicineData: Omit<Medicine, 'id'>): Promise<Medicine> {
      await simulateDelay();
      const db = getDB();
      const shop = db.users.find((u:User) => u.id === medicineData.shopId && u.role === UserRole.SHOP) as Shop;
      if (!shop) throw new Error("Shop not found");

      const newMedicine: Medicine = {
          ...medicineData,
          id: crypto.randomUUID(),
          shopName: shop.shopName,
      };
      db.medicines.push(newMedicine);
      saveDB(db);
      return newMedicine;
  },

  async bookAppointment(appData: any): Promise<Appointment> {
      await simulateDelay();
      const db = getDB();
      const patient = db.users.find((u:User) => u.id === appData.patientId) as Patient;
      const doctor = db.users.find((u:User) => u.id === appData.doctorId) as Doctor;
      if (!patient || !doctor) throw new Error("Patient or Doctor not found");

      const newAppointment: Appointment = {
          id: crypto.randomUUID(),
          patientId: patient.id,
          patientName: appData.patientName,
          doctorId: doctor.id,
          doctorName: doctor.name,
          date: appData.date,
          time: appData.time,
          status: 'booked',
      };
      db.appointments.push(newAppointment);
      saveDB(db);
      return newAppointment;
  },
  
  async getAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
      await simulateDelay();
      return getDB().appointments.filter((a: Appointment) => a.patientId === patientId);
  },
  
  async getAppointmentsForDoctor(doctorId: string): Promise<Appointment[]> {
      await simulateDelay();
      return getDB().appointments.filter((a: Appointment) => a.doctorId === doctorId);
  },

  async placeOrder(orderData: any): Promise<Order> {
    await simulateDelay();
    const db = getDB();
    const medicine = db.medicines.find((m: Medicine) => m.id === orderData.medicineId);
    if (!medicine) throw new Error("Medicine not found");

    const newOrder: Order = {
        id: crypto.randomUUID(),
        patientId: orderData.patientId,
        shopId: orderData.shopId,
        medicineId: orderData.medicineId,
        medicineName: medicine.name,
        quantity: orderData.quantity,
        address: orderData.address,
        paymentMethod: orderData.paymentMethod,
        utr: orderData.utr,
        timestamp: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    saveDB(db);
    return newOrder;
  },

  async getOrdersForPatient(patientId: string): Promise<Order[]> {
      await simulateDelay();
      return getDB().orders.filter((o: Order) => o.patientId === patientId);
  },
  
  async getOrdersForShop(shopId: string): Promise<Order[]> {
      await simulateDelay();
      return getDB().orders.filter((o: Order) => o.shopId === shopId);
  },
};
