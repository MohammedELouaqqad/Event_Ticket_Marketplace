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
    username: string;
    email:string;
    password: string;
    role: string
}