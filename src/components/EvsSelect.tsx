import { IonSelect, IonSelectOption } from '@ionic/react';
import classNames from 'classnames';
import { ExplicitAny } from 'evs-types';

type IonSelectChangeEvent = { detail: { value: ExplicitAny } };

export interface EvsSelectOptionItem {
  value: unknown;
  display: React.ReactNode;
}

export interface EvsSelectProps {
  className?: string;
  inset?: boolean;
  label: string;
  labelPlacement?: 'fixed' | 'start' | 'end' | 'floating' | 'stacked';
  /** The Selected value */
  value?: unknown;
  /** The header that is shown on the opened select list. */
  header?: string;
  /** The sub header that is shown below the header of the opened select list. */
  subHeader?: string;
  /** The list options to choose from. If `children` is defined, that will take precedence. */
  options?: EvsSelectOptionItem[];
  /** The options of the list */
  children?: React.ReactNode;

  /**
   * Raised when an option is selected.
   *
   * @param value The value of the selected option.
   */
  onSelect?: (value: unknown) => void;
}

export default function EvsSelect(props: EvsSelectProps) {
  const headerOptions = {
    header: props.header,
    subHeader: props.subHeader
  };

  const handleSelectChange = (event: IonSelectChangeEvent) => {
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
          <EvsSelectOption key={o.value as ExplicitAny} value={o.value}>
            {o.display}
          </EvsSelectOption>
        ))}
    </IonSelect>
  );
}

export interface EvsSelectOption {
  value?: unknown;
  children: React.ReactNode;
}

export function EvsSelectOption(props: EvsSelectOption) {
  return <IonSelectOption value={props.value}>{props.children}</IonSelectOption>;
}
