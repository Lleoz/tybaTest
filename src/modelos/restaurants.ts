
export interface Address {
    city: string;
    state: string;
    postal_code: string;
    street: string;
    formatted: string;
}

export interface Geo {
    lat: number;
    lon: number;
}

export interface Datum {
    restaurant_name: string;
    restaurant_phone: string;
    restaurant_website: string;
    hours: string;
    price_range: string;
    restaurant_id: any;
    cuisines: string[];
    address: Address;
    geo: Geo;
    menus: any[];
    last_updated: Date;
}

export interface RestaurantsResponse {
    totalResults: number;
    page: number;
    total_pages: number;
    more_pages: boolean;
    data: Datum[];
    numResults: number;
}

export interface RestaurantRequest{
    ciudad?: string;
    lat?: string;
    lgn?: string;
}
