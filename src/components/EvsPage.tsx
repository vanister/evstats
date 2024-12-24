import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import classNames from 'classnames';
import React from 'react';

type EvsPageProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  fixedSlotPlacement?: 'before' | 'after';
  padding?: boolean;
  title?: string;
  staticHeader?: boolean;
  actionConfig?: {
    primaryText?: string;
    primaryDisabled?: boolean;
    secondaryText?: string;
    secondaryDisabled?: boolean;
    onPrimaryAction?: VoidFunction;
    onSecondaryAction?: VoidFunction;
  };
};

function EvsPage(
  { children, color = 'light', title, ...props }: EvsPageProps,
  ref: React.MutableRefObject<HTMLElement>
) {
  const {
    primaryText = 'Save',
    primaryDisabled = false,
    secondaryText = 'Cancel',
    secondaryDisabled = false,
    onPrimaryAction = undefined,
    onSecondaryAction = undefined
  } = props.actionConfig ?? {};

  return (
    <IonPage ref={ref} className={classNames('evs-page', props.className)}>
      <IonHeader className="evs-page-header">
        <IonToolbar>
          <IonButtons>
            <IonBackButton />
          </IonButtons>
          {onSecondaryAction && (
            <IonButtons slot="secondary">
              <IonButton onClick={onSecondaryAction} disabled={secondaryDisabled}>
                {secondaryText}
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>{title}</IonTitle>
          {onPrimaryAction && (
            <IonButtons slot="primary">
              <IonButton onClick={onPrimaryAction} disabled={primaryDisabled}>
                {primaryText}
              </IonButton>
            </IonButtons>
          )}
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
