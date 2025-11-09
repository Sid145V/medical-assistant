import { UserRole, User, Patient, Doctor, Shop, Admin, ContactMessage, Medicine, Appointment, Order, Address, Slot, HistoryItem } from '../types';

export type Credentials = {
  identifier: string; // email, phone, or username for admin
  password?: string;
};

// --- In-memory database with localStorage persistence ---

const DB_KEY = 'ai-medical-assistant-db';

const defaultDoctors: Doctor[] = [
  { id: 'doc-seed-1', role: UserRole.DOCTOR, name: "Dr. Arjun R Gowda", email: "dr.arjun.kolar@example.com", phone: "9876543210", location: "Kolar", qualification: "MBBS, MD (General Medicine)", specialization: "General Physician", experience: 10, license: "ARJU2012", image: "https://wallpapercave.com/wp/wp2968524.jpg" },
  { id: 'doc-seed-2', role: UserRole.DOCTOR, name: "Dr. Sneha N Raj", email: "dr.sneha.malur@example.com", phone: "9876543211", location: "Malur", qualification: "MBBS, MS (Gynecology)", specialization: "Gynecologist", experience: 7, license: "SNEH2014", image: "https://picsum.photos/seed/sneha/200" },
  { id: 'doc-seed-3', role: UserRole.DOCTOR, name: "Dr. Manoj B Patil", email: "dr.manoj.bangarpet@example.com", phone: "9876543212", location: "Bangarpet", qualification: "MBBS, MS (Orthopedics)", specialization: "Orthopedic Surgeon", experience: 12, license: "MANO2010", image: "https://picsum.photos/seed/manoj/200" },
  { id: 'doc-seed-4', role: UserRole.DOCTOR, name: "Dr. Kavya R Shankar", email: "dr.kavya.srinivaspura@example.com", phone: "9876543213", location: "Srinivaspura", qualification: "MBBS, MD (Pediatrics)", specialization: "Pediatrician", experience: 8, license: "KAVY2015", image: "https://picsum.photos/seed/kavya/200" },
  { id: 'doc-seed-5', role: UserRole.DOCTOR, name: "Dr. Rakesh M Kumar", email: "dr.rakesh.kolar@example.com", phone: "9876543214", location: "Kolar", qualification: "MBBS, MS (ENT)", specialization: "ENT Specialist", experience: 9, license: "RAKE2013", image: "https://picsum.photos/seed/rakesh/200" },
  { id: 'doc-seed-6', role: UserRole.DOCTOR, name: "Dr. Priya S Nair", email: "dr.priya.kgf@example.com", phone: "9876543215", location: "KGF", qualification: "MBBS, MD (Dermatology)", specialization: "Dermatologist", experience: 6, license: "PRIY2017", image: "https://picsum.photos/seed/priya/200" },
  { id: 'doc-seed-7', role: UserRole.DOCTOR, name: "Dr. Raghavendra P Hegde", email: "dr.raghavendra.mulbagilu@example.com", phone: "9876543216", location: "Mulbagilu", qualification: "MBBS, MS (General Surgery)", specialization: "General Surgeon", experience: 14, license: "RAGH2009", image: "https://picsum.photos/seed/raghavendra/200" },
  { id: 'doc-seed-8', role: UserRole.DOCTOR, name: "Dr. Harini V Reddy", email: "dr.harini.kolar@example.com", phone: "9876543217", location: "Kolar", qualification: "MBBS, MS (Ophthalmology)", specialization: "Eye Specialist", experience: 9, license: "HARI2013", image: "https://picsum.photos/seed/harini/200" },
  { id: 'doc-seed-9', role: UserRole.DOCTOR, name: "Dr. Naveen S R", email: "dr.naveen.malur@example.com", phone: "9876543218", location: "Malur", qualification: "MBBS, MD (Psychiatry)", specialization: "Psychiatrist", experience: 10, license: "NAVE2012", image: "https://picsum.photos/seed/naveen/200" },
  { id: 'doc-seed-10', role: UserRole.DOCTOR, name: "Dr. Divya K Shetty", email: "dr.divya.bangarpet@example.com", phone: "9876543219", location: "Bangarpet", qualification: "MBBS, MD (Radiology)", specialization: "Radiologist", experience: 8, license: "DIVY2015", image: "https://picsum.photos/seed/divya/200" },
  { id: 'doc-seed-11', role: UserRole.DOCTOR, name: "Dr. Shashank R Naik", email: "dr.shashank.kolar@example.com", phone: "9876543220", location: "Kolar", qualification: "MBBS, MD (Cardiology)", specialization: "Cardiologist", experience: 11, license: "SHAS2011", image: "https://picsum.photos/seed/shashank/200" },
  { id: 'doc-seed-12', role: UserRole.DOCTOR, name: "Dr. Meghana S H", email: "dr.meghana.srinivaspura@example.com", phone: "9876543221", location: "Srinivaspura", qualification: "MBBS, MD (Neurology)", specialization: "Neurologist", experience: 10, license: "MEGH2012", image: "https://picsum.photos/seed/meghana/200" },
  { id: 'doc-seed-13', role: UserRole.DOCTOR, name: "Dr. Vijay R Keshav", email: "dr.vijay.kgf@example.com", phone: "9876543222", location: "KGF", qualification: "MBBS, MD (Anesthesiology)", specialization: "Anesthesiologist", experience: 13, license: "VIJA2010", image: "https://picsum.photos/seed/vijay/200" },
  { id: 'doc-seed-14', role: UserRole.DOCTOR, name: "Dr. Lavanya P N", email: "dr.lavanya.malur@example.com", phone: "9876543223", location: "Malur", qualification: "MBBS, MS (Gynecology)", specialization: "Gynecologist", experience: 9, license: "LAVA2014", image: "https://picsum.photos/seed/lavanya/200" },
  { id: 'doc-seed-15', role: UserRole.DOCTOR, name: "Dr. Sandeep M Reddy", email: "dr.sandeep.kolar@example.com", phone: "9876543224", location: "Kolar", qualification: "MBBS, MS (Orthopedics)", specialization: "Orthopedic Surgeon", experience: 11, license: "SAND2011", image: "https://picsum.photos/seed/sandeep/200" },
  { id: 'doc-seed-16', role: UserRole.DOCTOR, name: "Dr. Nisha V Kumar", email: "dr.nisha.bangarpet@example.com", phone: "9876543225", location: "Bangarpet", qualification: "MBBS, MD (Dermatology)", specialization: "Dermatologist", experience: 6, license: "NISH2017", image: "https://picsum.photos/seed/nisha/200" },
  { id: 'doc-seed-17', role: UserRole.DOCTOR, name: "Dr. Goutham S R", email: "dr.goutham.mulbagilu@example.com", phone: "9876543226", location: "Mulbagilu", qualification: "MBBS, MS (Urology)", specialization: "Urologist", experience: 10, license: "GOUT2012", image: "https://picsum.photos/seed/goutham/200" },
  { id: 'doc-seed-18', role: UserRole.DOCTOR, name: "Dr. Aishwarya R Naidu", email: "dr.aishwarya.srinivaspura@example.com", phone: "9876543227", location: "Srinivaspura", qualification: "MBBS, MD (Psychiatry)", specialization: "Psychiatrist", experience: 8, license: "AISH2015", image: "https://picsum.photos/seed/aishwarya/200" },
  { id: 'doc-seed-19', role: UserRole.DOCTOR, name: "Dr. Kiran N Murthy", email: "dr.kiran.kgf@example.com", phone: "9876543228", location: "KGF", qualification: "MBBS, MS (Cardiothoracic Surgery)", specialization: "Cardiothoracic Surgeon", experience: 12, license: "KIRA2010", image: "https://picsum.photos/seed/kiran/200" },
  { id: 'doc-seed-20', role: UserRole.DOCTOR, name: "Dr. Ramya G Rao", email: "dr.ramya.malur@example.com", phone: "9876543229", location: "Malur", qualification: "MBBS, MS (Ophthalmology)", specialization: "Eye Specialist", experience: 7, license: "RAMY2016", image: "https://picsum.photos/seed/ramya/200" }
];

const defaultDoctorPasswords = defaultDoctors.reduce((acc, doc) => {
    acc[doc.id] = 'Doctor@123';
    return acc;
}, {} as Record<string, string>);

const defaultDB = {
  users: [
    { id: 'admin-1', role: UserRole.ADMIN, username: 'admin', email: 'admin@test.com', phone: '0000000000' },
    { id: 'patient-1', role: UserRole.PATIENT, firstName: 'John', lastName: 'Doe', age: 35, gender: 'male', location: 'Kolar', email: 'john@test.com', phone: '1234567890', address: undefined },
    ...defaultDoctors,
    { id: 'shop-1', role: UserRole.SHOP, shopName: 'HealthFirst Pharmacy', ownerName: 'Charlie Brown', license: 'LIC12345', yearsActive: 10, location: 'Kolar', email: 'shop1@test.com', phone: '7778889999', address: undefined },
  ] as User[],
  passwords: {
    'admin-1': 'admin',
    'patient-1': 'password',
    'shop-1': 'password',
    ...defaultDoctorPasswords,
  } as Record<string, string>,
  medicines: [
    { id: 'med-1', shopId: 'shop-1', shopName: 'HealthFirst Pharmacy', name: 'Paracetamol 500mg', price: 5.99, minOrderQuantity: 1, image: 'https://picsum.photos/seed/med1/300', dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'med-2', shopId: 'shop-1', shopName: 'HealthFirst Pharmacy', name: 'Cough Syrup', price: 12.50, minOrderQuantity: 1, image: 'https://picsum.photos/seed/med2/300', dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  ] as Medicine[],
  appointments: [] as Appointment[],
  orders: [] as Order[],
  messages: [] as ContactMessage[],
};

const getDB = () => {
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      const parsedDb = JSON.parse(dbString);
      
      // One-time migration to remove old foreign doctors from existing localStorage
      const foreignDoctorIds = ['doctor-1', 'doctor-2'];
      const userCountBefore = parsedDb.users.length;
      
      parsedDb.users = parsedDb.users.filter((u: User) => !foreignDoctorIds.includes(u.id));
      
      if (parsedDb.users.length < userCountBefore) {
        console.log("Migration: Removed foreign doctor accounts from local storage.");
        delete parsedDb.passwords['doctor-1'];
        delete parsedDb.passwords['doctor-2'];
        saveDB(parsedDb);
      }

      return parsedDb;
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

const formatAddress = (address: Address): string => {
    return `${address.fullName}, ${address.building}, ${address.street}, ${address.city}, ${address.pincode}${address.landmark ? ', ' + address.landmark : ''}`;
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
    
    // Explicitly check for email and phone collision to avoid ambiguity with admin username
    if (userData.email || userData.phone) {
      const isConflict = db.users.some((u: User) => 
        u.email === userData.email || u.phone === userData.phone
      );

      if (isConflict) {
        throw new Error('Email or phone already in use. Please log in.');
      }
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
  
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await simulateDelay(300);
    const db = getDB();
    const userIndex = db.users.findIndex((u: User) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    // Prevent changing role or id
    const { role, id, ...safeUpdates } = updates as any;
    
    const updatedUser = { ...db.users[userIndex], ...safeUpdates };
    db.users[userIndex] = updatedUser;
    
    saveDB(db);
    return updatedUser;
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

  async addMedicine(medicineData: Omit<Medicine, 'id' | 'shopName' | 'dateAdded'>): Promise<Medicine> {
      await simulateDelay();
      const db = getDB();
      const shop = db.users.find((u:User) => u.id === medicineData.shopId && u.role === UserRole.SHOP) as Shop;
      if (!shop) throw new Error("Shop not found");

      const newMedicine: Medicine = {
          ...medicineData,
          id: crypto.randomUUID(),
          shopName: shop.shopName,
          dateAdded: new Date().toISOString().split('T')[0],
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

      // --- Validation Logic ---
      const requestedSlotTime = new Date(`${appData.date}T${appData.time}:00`);
      if (isNaN(requestedSlotTime.getTime())) {
          throw new Error("Invalid date or time provided.");
      }
      const fifteenMinutes = 15 * 60 * 1000;

      for (const app of db.appointments) {
          // 1. Per-doctor double-booking check
          if (app.doctorId === appData.doctorId && app.date === appData.date && app.time === appData.time) {
              throw new Error('Slot already booked. Please choose another time.');
          }
          // 2. Global 15-minute gap rule check
          const existingSlotTime = new Date(`${app.date}T${app.time}:00`);
          const timeDifference = Math.abs(requestedSlotTime.getTime() - existingSlotTime.getTime());
          if (timeDifference < fifteenMinutes) {
              throw new Error('Please select a slot at least 15 minutes apart from other bookings.');
          }
      }
      // --- End Validation ---

      const newAppointment: Appointment = {
          id: crypto.randomUUID(),
          patientId: patient.id,
          patientName: appData.patientName,
          patientEmail: patient.email,
          doctorId: doctor.id,
          doctorName: doctor.name,
          doctorSpecialization: doctor.specialization || doctor.qualification,
          date: appData.date,
          time: appData.time,
          status: 'booked',
          createdAt: new Date().toISOString(),
      };
      db.appointments.push(newAppointment);
      saveDB(db);
      return newAppointment;
  },
  
  async cancelAppointment(appointmentId: string): Promise<Appointment> {
    await simulateDelay();
    const db = getDB();
    const appointment = db.appointments.find((a: Appointment) => a.id === appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    if (appointment.status !== 'booked') {
        throw new Error("Only booked appointments can be cancelled.");
    }
    appointment.status = 'cancelled';
    saveDB(db);
    return appointment;
  },
  
  async updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<Appointment> {
    await simulateDelay();
    const db = getDB();
    const appointment = db.appointments.find((a: Appointment) => a.id === appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    appointment.status = status;
    saveDB(db);
    return appointment;
  },

  async getAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
      await simulateDelay();
      return getDB().appointments.filter((a: Appointment) => a.patientId === patientId);
  },
  
  async getAppointmentsForDoctor(doctorId: string): Promise<Appointment[]> {
      await simulateDelay();
      return getDB().appointments.filter((a: Appointment) => a.doctorId === doctorId);
  },

  async getAllAppointments(): Promise<Appointment[]> {
    await simulateDelay();
    const db = getDB();
    // To handle old data that doesn't have the new fields, let's enrich it on the fly
    return db.appointments.map((app: Appointment) => {
        const patient = db.users.find((u:User) => u.id === app.patientId) as Patient;
        const doctor = db.users.find((u:User) => u.id === app.doctorId) as Doctor;
        return {
            ...app,
            patientEmail: app.patientEmail || patient?.email || 'N/A',
            doctorSpecialization: app.doctorSpecialization || doctor?.specialization || doctor?.qualification || 'N/A',
            patientAddress: patient?.address ? formatAddress(patient.address) : 'N/A',
            doctorAddress: doctor?.location || 'N/A',
            createdAt: app.createdAt || new Date(new Date(app.date).getTime() - 86400000).toISOString()
        };
    });
  },

  async placeOrder(orderData: any): Promise<{ order: Order; updatedPatient: Patient | null }> {
    await simulateDelay();
    const db = getDB();
    const medicine = db.medicines.find((m: Medicine) => m.id === orderData.medicineId);
    if (!medicine) throw new Error("Medicine not found");
    
    const patientIndex = db.users.findIndex((u: User) => u.id === orderData.patientId);
    const patient = db.users[patientIndex] as Patient;
    if (!patient) throw new Error("Patient not found");

    let patientWasUpdated = false;
    // Save address to patient profile if it's new
    if (orderData.addressObject) {
        patient.address = orderData.addressObject;
        db.users[patientIndex] = patient;
        patientWasUpdated = true;
    }

    const newOrder: Order = {
        id: crypto.randomUUID(),
        patientId: orderData.patientId,
        patientName: `${patient.firstName} ${patient.lastName}`,
        shopId: orderData.shopId,
        shopName: medicine.shopName,
        medicineId: orderData.medicineId,
        medicineName: medicine.name,
        quantity: orderData.quantity,
        totalPrice: medicine.price * orderData.quantity,
        address: formatAddress(patient.address!),
        paymentMethod: orderData.paymentMethod,
        utr: orderData.utr,
        timestamp: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    saveDB(db);
    return { order: newOrder, updatedPatient: patientWasUpdated ? patient : null };
  },

  async getOrdersForPatient(patientId: string): Promise<Order[]> {
      await simulateDelay();
      return getDB().orders.filter((o: Order) => o.patientId === patientId);
  },
  
  async getOrdersForShop(shopId: string): Promise<Order[]> {
      await simulateDelay();
      return getDB().orders.filter((o: Order) => o.shopId === shopId);
  },

  async getAllOrders(): Promise<Order[]> {
      await simulateDelay();
      return getDB().orders;
  },

  async getDoctorSlots(doctorId: string): Promise<Slot[]> {
    await simulateDelay();
    // Dummy data for slots
    const slots: Slot[] = [];
    const today = new Date();
    for(let i=0; i<5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        slots.push({ date: date.toISOString().split('T')[0], time: '10:00', status: 'available'});
        slots.push({ date: date.toISOString().split('T')[0], time: '11:00', status: 'booked'});
        slots.push({ date: date.toISOString().split('T')[0], time: '14:00', status: 'available'});
    }
    return slots;
  },

  async getPatientHistory(patientId: string): Promise<HistoryItem[]> {
      await simulateDelay();
      const db = getDB();
      const appointments = db.appointments.filter((a: Appointment) => a.patientId === patientId);
      return appointments.map((a: Appointment) => ({
          id: a.id,
          date: a.date,
          time: a.time,
          doctorName: a.doctorName,
          summary: `Appointment on ${a.date} - Status: ${a.status}`
      }));
  },
};