import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';

type EvsPageProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  fixedSlotPlacement?: 'before' | 'after';
  padding?: boolean;
  title?: string;
};

function EvsPage(
  { children, color, title, ...props }: EvsPageProps,
  ref: React.MutableRefObject<HTMLElement>
) {
  return (
    <IonPage ref={ref} className={classNames('evs-page', props.className)}>
      <IonHeader className="evs-page-header">
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className={classNames('evs-page-content', { 'ion-padding': props.padding })}
        color={color}
        fullscreen
        fixedSlotPlacement={props.fixedSlotPlacement}
      >
        <IonHeader className="evs-page-content-header" collapse="condense">
          <IonToolbar color={color}>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {children}
      </IonContent>
    </IonPage>
  );
}

export default React.forwardRef(EvsPage);
