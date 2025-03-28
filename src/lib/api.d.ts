// Type declarations for API functions
export function getSupabaseCredentials(): { url: string; key: string } | null;
export function createSupabaseClient(): any;
export function isSupabaseConfigured(): boolean;
export function refreshLocalProducts(): void;
export function getAllProducts(): Promise<any[]>;
export function getFeaturedProducts(): Promise<any[]>;
export function getProductById(id: string): Promise<any>;
export function getProductsByCategory(category: string): Promise<any[]>;
export function addProduct(product: any): Promise<any>;
export function updateProduct(productToUpdate: any): Promise<any>;
export function deleteProduct(id: string): Promise<boolean>;
