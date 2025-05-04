
import { Customer, Motorcycle, Repair, InventoryPart, Invoice } from "../types";

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    phone: "333-1234567",
    address: "Via Roma 123, Milano"
  },
  {
    id: "c2",
    name: "Luigi Bianchi",
    email: "luigi.bianchi@example.com",
    phone: "333-7654321",
    address: "Via Napoli 45, Roma"
  },
  {
    id: "c3",
    name: "Giovanna Verdi",
    email: "giovanna.verdi@example.com",
    phone: "333-9876543",
    address: "Via Firenze 78, Torino"
  }
];

export const motorcycles: Motorcycle[] = [
  {
    id: "m1",
    customerId: "c1",
    make: "Ducati",
    model: "Monster 821",
    year: "2018",
    licensePlate: "AB123CD",
    vin: "ZDMAADBW3JB123456"
  },
  {
    id: "m2",
    customerId: "c2",
    make: "Honda",
    model: "CB650R",
    year: "2020",
    licensePlate: "EF456GH",
    vin: "JHUEGH4567B987654"
  },
  {
    id: "m3",
    customerId: "c3",
    make: "Yamaha",
    model: "MT-07",
    year: "2019",
    licensePlate: "IL789MN",
    vin: "JYARJ16E09A012345"
  },
  {
    id: "m4",
    customerId: "c1",
    make: "BMW",
    model: "R1250GS",
    year: "2021",
    licensePlate: "OP012QR",
    vin: "WB10A0203EZ123456"
  }
];

export const repairs: Repair[] = [
  {
    id: "r1",
    motorcycleId: "m1",
    customerId: "c1",
    title: "Manutenzione programmata",
    description: "Cambio olio, filtri e controllo generale",
    dateCreated: "2023-11-15T10:00:00Z",
    dateUpdated: "2023-11-15T16:30:00Z",
    dateCompleted: "2023-11-15T16:30:00Z",
    status: "completed",
    laborHours: 2,
    laborRate: 60,
    notes: "Cliente molto soddisfatto, prossima revisione tra 10000km",
    photos: [
      {
        id: "ph1",
        repairId: "r1",
        url: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f",
        caption: "Filtro dell'olio sostituito",
        dateAdded: "2023-11-15T12:30:00Z"
      }
    ],
    parts: [
      {
        id: "up1",
        repairId: "r1",
        partId: "p1",
        partName: "Olio motore premium",
        quantity: 4,
        priceEach: 18.50
      },
      {
        id: "up2",
        repairId: "r1",
        partId: "p2",
        partName: "Filtro olio",
        quantity: 1,
        priceEach: 15.75
      }
    ]
  },
  {
    id: "r2",
    motorcycleId: "m2",
    customerId: "c2",
    title: "Sostituzione pneumatici",
    description: "Sostituzione pneumatici anteriore e posteriore",
    dateCreated: "2023-12-01T09:15:00Z",
    dateUpdated: "2023-12-01T14:45:00Z",
    status: "in-progress",
    laborHours: 1.5,
    laborRate: 60,
    photos: [
      {
        id: "ph2",
        repairId: "r2",
        url: "https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668",
        caption: "Pneumatico usurato",
        dateAdded: "2023-12-01T09:30:00Z"
      }
    ],
    parts: [
      {
        id: "up3",
        repairId: "r2",
        partId: "p3",
        partName: "Pneumatico Michelin Pilot Road 5",
        quantity: 2,
        priceEach: 145.00
      }
    ]
  },
  {
    id: "r3",
    motorcycleId: "m3",
    customerId: "c3",
    title: "Diagnosi problema elettrico",
    description: "La moto non si avvia, problema alla batteria o all'impianto elettrico",
    dateCreated: "2023-12-05T11:30:00Z",
    dateUpdated: "2023-12-05T11:30:00Z",
    status: "pending",
    photos: [],
    parts: []
  }
];

export const inventoryParts: InventoryPart[] = [
  {
    id: "p1",
    name: "Olio motore premium",
    partNumber: "OIL-PREM-1L",
    price: 18.50,
    cost: 12.75,
    quantity: 28,
    minimumQuantity: 10,
    location: "Scaffale A1",
    supplier: "MotoRicambi Srl"
  },
  {
    id: "p2",
    name: "Filtro olio",
    partNumber: "FO-DUC-001",
    price: 15.75,
    cost: 9.20,
    quantity: 15,
    minimumQuantity: 5,
    location: "Scaffale A2",
    supplier: "MotoRicambi Srl"
  },
  {
    id: "p3",
    name: "Pneumatico Michelin Pilot Road 5",
    partNumber: "MICH-PR5-180",
    price: 145.00,
    cost: 98.50,
    quantity: 6,
    minimumQuantity: 2,
    location: "Scaffale B3",
    supplier: "Gomme Express Srl"
  },
  {
    id: "p4",
    name: "Pastiglie freno anteriori",
    partNumber: "PFA-BREMBO-01",
    price: 65.00,
    cost: 42.30,
    quantity: 8,
    minimumQuantity: 4,
    location: "Scaffale B1",
    supplier: "Freni&Co Srl"
  },
  {
    id: "p5",
    name: "Batteria Yuasa YTX12-BS",
    partNumber: "BAT-YUASA-12",
    price: 95.50,
    cost: 68.20,
    quantity: 3,
    minimumQuantity: 2,
    location: "Scaffale C1",
    supplier: "Elettro Moto Spa"
  }
];

export const invoices: Invoice[] = [
  {
    id: "i1",
    repairId: "r1",
    customerId: "c1",
    number: "INV-2023-001",
    date: "2023-11-15",
    dueDate: "2023-12-15",
    subtotal: 155.50,
    tax: 34.21,
    total: 189.71,
    notes: "Pagamento effettuato con carta di credito",
    status: "paid"
  },
  {
    id: "i2",
    repairId: "r2",
    customerId: "c2",
    number: "INV-2023-002",
    date: "2023-12-01",
    dueDate: "2023-12-31",
    subtotal: 380.00,
    tax: 83.60,
    total: 463.60,
    status: "sent"
  }
];

export const getLowStockParts = () => {
  return inventoryParts.filter(part => part.quantity <= (part.minimumQuantity || 0));
};

export const getRepairsByStatus = (status: string) => {
  return repairs.filter(repair => repair.status === status);
};

export const getActiveRepairs = () => {
  return repairs.filter(repair => repair.status === 'pending' || repair.status === 'in-progress');
};

export const getRepairWithDetails = (repairId: string) => {
  const repair = repairs.find(r => r.id === repairId);
  if (!repair) return null;
  
  const motorcycle = motorcycles.find(m => m.id === repair.motorcycleId);
  const customer = customers.find(c => c.id === repair.customerId);
  
  return {
    ...repair,
    motorcycle,
    customer
  };
};

export const getCustomerWithMotorcycles = (customerId: string) => {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;
  
  const customerMotorcycles = motorcycles.filter(m => m.customerId === customerId);
  
  return {
    ...customer,
    motorcycles: customerMotorcycles
  };
};
