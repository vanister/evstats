import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import classNames from 'classnames';

export interface EvsSelectOptionItem {
  value: any;
  display: React.ReactNode;
}

export interface EvsSelect {
  className?: string;
  inset?: boolean;
  label: string;
  labelPlacement?: 'fixed' | 'start' | 'end' | 'floating' | 'stacked';
  /** The Selected value */
  value?: any;
  /** The header that is shown on the opened select list. */
  header?: string;
  /** The sub header that is shown below the header of the opened select list. */
  subHeader?: string;
  /** The list options to choose from. If `children` is defined, that will take precedence. */
  options?: EvsSelectOptionItem[];
  /** The options of the list */
  children?: React.ReactNode;

  onSelect?: (value: any) => void;
}

export default function EvsSelect(props: EvsSelect) {
  const headerOptions = {
    header: props.header,
    subHeader: props.subHeader
  };

  const handleSelectChange = (event: { detail: { value: any } }) => {
    const value = event.detail.value;

    props.onSelect?.(value);
  };

  return (
    <IonSelect
      className={classNames('evs-select', props.className)}
      label={props.label}
      labelPlacement={props.labelPlacement}
      value={props.value}
      onIonChange={handleSelectChange}
      interfaceOptions={headerOptions}
    >
      {props.children ??
        props.options?.map((o) => (
          <EvsSelectOption key={o.value} value={o.value}>
            {o.display}
          </EvsSelectOption>
        ))}
    </IonSelect>
  );
}

export interface EvsSelectOption {
  value?: any;
  children: React.ReactNode;
}

export function EvsSelectOption(props: EvsSelectOption) {
  return (
    <IonSelectOption value={props.value}>{props.children}</IonSelectOption>
  );
}
