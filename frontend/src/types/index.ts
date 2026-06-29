export type Event ={
    id?: number;
    name?: string;
    description?: string;
    date?: string;
    price?: number;
    available_tickets?: number;
    location?: string;
    fileName?: string;
}

export type Order={
    id?: number;
    event: Event;
    user: object;
    totalPrice: number;
    quantity: number;
}

export type UserAuthenticate={
    id?: number;
    email:string;
    password: string;
    role: string
}

export type UserRegister={
    id?: number;
    name: string;
    email:string;
    password?: string;
    role: string
}

export type UserContextType={
    userConnected: UserRegister | null;
    setUserConnected: (user:UserRegister | null) => void
}