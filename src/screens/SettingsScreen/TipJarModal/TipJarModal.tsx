import './TipJarModal.scss';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
  useIonToast
} from '@ionic/react';
import { closeOutline, heartOutline, cashOutline, fastFoodOutline, cafeOutline } from 'ionicons/icons';
import { useServices } from '../../../providers/ServiceProvider';
import { useEffect, useState } from 'react';
import { TipProduct, PurchaseResult } from '../../../services/PurchaseService';
import { logToDevServer } from '../../../logger';

type TipJarModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TipJarModal({ isOpen, onClose }: TipJarModalProps) {
  const purchaseService = useServices('purchaseService');
  const [products, setProducts] = useState<TipProduct[]>([]);
  const [showLoading, hideLoading] = useIonLoading();
  const [showAlert] = useIonAlert();
  const [present] = useIonToast();

  useEffect(() => {
    if (!isOpen) return;

    const loadProducts = async () => {
      try {
        const availableProducts = await purchaseService.getAvailableProducts();
        setProducts(availableProducts);
      } catch (error) {
        logToDevServer(`Failed to load products: ${error.message || error}`, 'error');
        setProducts([]);
      }
    };

    loadProducts();
  }, [isOpen, purchaseService]);

  const getProductIcon = (productId: string) => {
    if (productId.includes('tip_jar')) return cashOutline;
    if (productId.includes('coffee')) return cafeOutline;
    if (productId.includes('lunch')) return fastFoodOutline;
    return heartOutline;
  };

  const handlePurchase = async (product: TipProduct) => {
    if (!product.available) {
      present({
        message: 'This product is currently not available',
        duration: 3000,
        color: 'warning'
      });
      return;
    }

    await showLoading('Processing purchase...');

    try {
      const result: PurchaseResult = await purchaseService.purchaseProduct(product.id);
      
      await hideLoading();

      if (result.success) {
        present({
          message: 'Thank you for your support! ❤️',
          duration: 4000,
          color: 'success'
        });
        onClose();
      } else {
        showAlert({
          header: 'Purchase Failed',
          message: result.error || 'Something went wrong with your purchase. Please try again.',
          buttons: ['OK']
        });
      }
    } catch (error) {
      await hideLoading();
      logToDevServer(`Purchase error: ${error.message || error}`, 'error');
      showAlert({
        header: 'Purchase Error',
        message: 'Unable to process your purchase. Please check your connection and try again.',
        buttons: ['OK']
      });
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Support EVStats</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="tip-jar-modal">
        <div className="tip-jar-header">
          <IonIcon icon={heartOutline} color="danger" />
          <h2>Show Your Support</h2>
          <p>
            EVStats is built with love and passion. Your support helps keep the app free 
            and motivates continued development of new features.
          </p>
        </div>

        <IonList inset>
          {products.map((product) => (
            <IonItem key={product.id} className="tip-product-item">
              <IonIcon 
                icon={getProductIcon(product.id)} 
                slot="start"
              />
              <IonLabel>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </IonLabel>
              <IonButton
                slot="end"
                fill="outline"
                size="small"
                disabled={!product.available}
                onClick={() => handlePurchase(product)}
              >
                {product.price}
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {products.length === 0 && (
          <div className="no-products">
            <p>Loading support options...</p>
          </div>
        )}

        <div className="tip-jar-footer">
          <p>
            All purchases are one-time tips to support development. 
            Thank you for considering a contribution!
          </p>
        </div>
      </IonContent>
    </IonModal>
  );
}