import { BaseService } from './BaseService';
import { logToDevServer } from '../logger';

export interface TipProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  priceMicros: number;
  currency: string;
  available: boolean;
}

export interface PurchaseResult {
  success: boolean;
  productId: string;
  error?: string;
}

export interface PurchaseService extends BaseService {
  initialize(): Promise<void>;
  getAvailableProducts(): Promise<TipProduct[]>;
  purchaseProduct(productId: string): Promise<PurchaseResult>;
  restorePurchases(): Promise<void>;
  isInitialized(): boolean;
}

export class EvsPurchaseService extends BaseService implements PurchaseService {
  private initialized = false;
  private products: TipProduct[] = [];

  private readonly PRODUCT_IDS = {
    TIP_JAR: 'com.evstats.tip_jar',
    BUY_COFFEE: 'com.evstats.buy_coffee', 
    BUY_LUNCH: 'com.evstats.buy_lunch',
    GENEROUS_TIP: 'com.evstats.generous_tip'
  } as const;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!window.CdvPurchase) {
      logToDevServer('CdvPurchase not available - using mock data for development', 'warn');
      this.initializeMockData();
      this.initialized = true;
      return;
    }

    try {
      logToDevServer('Initializing purchase service');
      
      // Register products
      Object.values(this.PRODUCT_IDS).forEach(productId => {
        window.CdvPurchase.store.register({
          id: productId,
          type: window.CdvPurchase.ProductType.CONSUMABLE,
          platform: window.CdvPurchase.Platform.APPLE_APPSTORE
        });
      });

      // Set up event listeners
      this.setupEventListeners();

      // Initialize store
      await window.CdvPurchase.store.initialize([{
        platform: window.CdvPurchase.Platform.APPLE_APPSTORE
      }]);

      this.initialized = true;
      logToDevServer('Purchase service initialized successfully');
    } catch (error) {
      logToDevServer(`Failed to initialize purchase service: ${error?.message}`, 'error', error?.stack ?? error);
      this.initializeMockData();
      this.initialized = true;
    }
  }

  private setupEventListeners(): void {
    if (!window.CdvPurchase) return;

    // Handle product updates
    Object.values(this.PRODUCT_IDS).forEach(productId => {
      window.CdvPurchase.store
        .when(productId)
        .updated((product) => {
          this.updateProductFromStore(product);
        })
        .approved((product) => {
          // Purchase approved - verify and finish
          return this.handlePurchaseApproved(product);
        })
        .verified((product) => {
          // Purchase verified - complete the transaction
          this.handlePurchaseVerified(product);
        })
        .cancelled((product) => {
          logToDevServer(`Purchase cancelled: ${product.id}`);
        })
        .error((error) => {
          logToDevServer(`Purchase error: ${error?.message || error}`, 'error');
        });
    });
  }

  private updateProductFromStore(storeProduct: any): void {
    const product: TipProduct = {
      id: storeProduct.id,
      title: storeProduct.title || this.getDefaultTitle(storeProduct.id),
      description: storeProduct.description || this.getDefaultDescription(storeProduct.id),
      price: storeProduct.pricing?.price || '$0.00',
      priceMicros: storeProduct.pricing?.priceMicros || 0,
      currency: storeProduct.pricing?.currency || 'USD',
      available: storeProduct.canPurchase || false
    };

    const existingIndex = this.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = product;
    } else {
      this.products.push(product);
    }
  }

  private initializeMockData(): void {
    this.products = [
      {
        id: this.PRODUCT_IDS.TIP_JAR,
        title: 'Tip Jar',
        description: 'Support the app with a small tip',
        price: '$0.99',
        priceMicros: 990000,
        currency: 'USD',
        available: true
      },
      {
        id: this.PRODUCT_IDS.BUY_COFFEE,
        title: 'Buy me a Coffee',
        description: 'Fuel development with coffee',
        price: '$2.99',
        priceMicros: 2990000,
        currency: 'USD',
        available: true
      },
      {
        id: this.PRODUCT_IDS.BUY_LUNCH,
        title: 'Buy me Lunch',
        description: 'Support with a hearty meal',
        price: '$4.99',
        priceMicros: 4990000,
        currency: 'USD',
        available: true
      },
      {
        id: this.PRODUCT_IDS.GENEROUS_TIP,
        title: 'Generous Tip',
        description: 'Show your appreciation generously',
        price: '$9.99',
        priceMicros: 9990000,
        currency: 'USD',
        available: true
      }
    ];
  }

  private getDefaultTitle(productId: string): string {
    switch (productId) {
      case this.PRODUCT_IDS.TIP_JAR: return 'Tip Jar';
      case this.PRODUCT_IDS.BUY_COFFEE: return 'Buy me a Coffee';
      case this.PRODUCT_IDS.BUY_LUNCH: return 'Buy me Lunch';  
      case this.PRODUCT_IDS.GENEROUS_TIP: return 'Generous Tip';
      default: return 'Support the App';
    }
  }

  private getDefaultDescription(productId: string): string {
    switch (productId) {
      case this.PRODUCT_IDS.TIP_JAR: return 'Support the app with a small tip';
      case this.PRODUCT_IDS.BUY_COFFEE: return 'Fuel development with coffee';
      case this.PRODUCT_IDS.BUY_LUNCH: return 'Support with a hearty meal';
      case this.PRODUCT_IDS.GENEROUS_TIP: return 'Show your appreciation generously';
      default: return 'Support app development';
    }
  }

  private async handlePurchaseApproved(product: any): Promise<void> {
    // In a real app, you would verify the purchase with your backend here
    // For now, we'll just mark it as verified
    logToDevServer(`Purchase approved: ${product.id}`);
  }

  private handlePurchaseVerified(product: any): void {
    logToDevServer(`Purchase verified and completed: ${product.id}`);
  }

  async getAvailableProducts(): Promise<TipProduct[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return [...this.products];
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      if (!window.CdvPurchase) {
        // Mock purchase for development
        logToDevServer(`Mock purchase: ${productId}`);
        return { success: true, productId };
      }

      const product = window.CdvPurchase.store.get(productId);
      if (!product) {
        return { 
          success: false, 
          productId, 
          error: 'Product not found' 
        };
      }

      const offer = product.getOffer();
      if (!offer) {
        return { 
          success: false, 
          productId, 
          error: 'No offer available for this product' 
        };
      }

      await offer.order();
      return { success: true, productId };

    } catch (error) {
      logToDevServer(`Purchase failed: ${error?.message}`, 'error', error?.stack ?? error);
      return { 
        success: false, 
        productId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async restorePurchases(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    // For consumable products, there's nothing to restore
    logToDevServer('Restore purchases called (consumable products)');
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}