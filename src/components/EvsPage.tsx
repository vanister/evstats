import { PropsWithChildrenAndClass } from '@evs-core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent
} from '@ionic/react';
import classNames from 'classnames';
import React, { ReactNode, useCallback } from 'react';

type HeaderButton = {
  button: ReactNode;
  slot?: string;
  key: string | number;
};

type EvsPageProps = PropsWithChildrenAndClass<{
  color?: string;
  fixedSlotPlacement?: 'before' | 'after';
  padding?: boolean;
  title?: string;
  staticHeader?: boolean;
  hideBack?: boolean;
  headerButtons?: HeaderButton[];
  enableRefresher?: boolean; 
  onRefresh?: () => Promise<void>; 
}>;

function EvsPage(
  { children, color = 'light', title, enableRefresher, ...props }: EvsPageProps,
  ref: React.MutableRefObject<HTMLElement>
) {

  const handleRefresh = useCallback(async (event: RefresherCustomEvent) => {
    await Promise.all([
      props.onRefresh?.(),
      new Promise((resolve) => setTimeout(resolve, 500)) // Ensure a minimum wait of 500ms
    ]);

    event.detail.complete();
  }, []);

  return (
    <IonPage ref={ref} className={classNames('evs-page', props.className)}>
      <IonHeader className="evs-page-header">
        <IonToolbar>
          {!props.hideBack && (
            <IonButtons>
              <IonBackButton />
            </IonButtons>
          )}
          <IonTitle>{title}</IonTitle>
          {props.headerButtons?.map(({ key, button, slot }) => (
            <IonButtons key={key} slot={slot}>
              {button}
            </IonButtons>
          ))}
        </IonToolbar>
      </IonHeader>
      <IonContent
        className={classNames('evs-page-content', { 'ion-padding': props.padding })}
        color={color}
        fullscreen
        fixedSlotPlacement={props.fixedSlotPlacement}
      >
        {enableRefresher && (
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent refreshingSpinner="circles" />
          </IonRefresher>
        )}
        {!props.staticHeader && (
          <IonHeader className="evs-page-content-header" collapse="condense">
            <IonToolbar color={color}>
              <IonTitle size="large">{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}
        {children}
      </IonContent>
    </IonPage>
  );
}

export default React.forwardRef(EvsPage);
