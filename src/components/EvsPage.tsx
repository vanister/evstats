import { PropsWithChildrenAndClass } from '@evs-core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

// todo - turn into config
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
}>;

function EvsPage(
  { children, color = 'light', title, ...props }: EvsPageProps,
  ref: React.MutableRefObject<HTMLElement>
) {
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
