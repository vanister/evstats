declare namespace CdvPurchase {
  interface Store {
    register(product: ProductDefinition): void;
    initialize(platforms: PlatformDefinition[]): Promise<void>;
    when(productId: string): ProductEvents;
    owned(productId: string): boolean;
    get(productId: string): Product | undefined;
    ready(callback: () => void): void;
    error(callback: (error: IError) => void): void;
  }

  interface ProductDefinition {
    id: string;
    type: ProductType;
    platform?: Platform;
  }

  interface PlatformDefinition {
    platform: Platform;
    options?: Record<string, unknown>;
  }

  interface Product {
    id: string;
    title: string;
    description: string;
    pricing: Pricing;
    owned: boolean;
    canPurchase: boolean;
    getOffer(): Offer | undefined;
  }

  interface Pricing {
    price: string;
    currency: string;
    priceMicros: number;
  }

  interface Offer {
    id: string;
    productId: string;
    order(): Promise<void>;
  }

  interface ProductEvents {
    approved(callback: (product: Product) => void): ProductEvents;
    verified(callback: (product: Product) => void): ProductEvents;
    updated(callback: (product: Product) => void): ProductEvents;
    cancelled(callback: (product: Product) => void): ProductEvents;
    error(callback: (error: IError) => void): ProductEvents;
  }

  interface IError {
    code: string;
    message: string;
  }

  enum Platform {
    APPLE_APPSTORE = "apple-appstore",
    GOOGLE_PLAY = "google-play"
  }

  enum ProductType {
    CONSUMABLE = "consumable",
    NON_CONSUMABLE = "non consumable",
    PAID_SUBSCRIPTION = "paid subscription",
    FREE_SUBSCRIPTION = "free subscription"
  }

  const store: Store;
}

declare global {
  interface Window {
    CdvPurchase: typeof CdvPurchase;
  }
}

export = CdvPurchase;