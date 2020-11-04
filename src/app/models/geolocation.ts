
export interface Country {
    country_id: number;
    name: string;
    code: string;
    phone_code: number;
}

export interface State {
    state_id: number;
    name: string;
    country_id: number;
}

export interface City {
    city_id: number;
    name: string;
    state_id: number;
}