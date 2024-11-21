export const mockPets = [
    {
      id: "1",
      name: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      birthDate: "2020-01-15",
      weight: 65.5,
      imageUrl: "https://example.com/max.jpg",
      ownerId: "user123",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-12-31T00:00:00Z"
    }
  ];
  
  export const mockHealthRecords = [
    {
      id: "1",
      petId: "1",
      type: "weight",
      value: 65.5,
      unit: "lbs",
      date: "2023-12-31T00:00:00Z",
      createdAt: "2023-12-31T00:00:00Z"
    }
  ];
  
  export const mockNotifications = [
    {
      id: "1",
      userId: "user123",
      title: "Medication Reminder",
      message: "Time for Max's Heartgard Plus",
      type: "reminder",
      read: false,
      createdAt: "2024-01-15T09:00:00Z"
    }
  ];