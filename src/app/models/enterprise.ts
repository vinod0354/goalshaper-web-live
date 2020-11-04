export interface Enterprise {
	enterprise_id: number;
	name: string;
	category_id: number;
	category_name: string;
    email: string;
    website: string;
    address_line1: string;
    address_line2: string;
    city_id: string;
    city_name: string;
    state_id: number;
    state_name: string;
    country_id: number;
    country_name: string;
    phone_code: number;
    pincode: string;
    created_date: Date;
    modified_date: string;
    logo: string;
    contact_name: string;
    contact_title: string;
    contact_email: string;
    contact_phone: string;
    email_notification: string;
    push_notification: string;
    is_active: string;
}

export interface EnterpriseCategory {
    category_id: number;
    name: string;
    description: string;
}