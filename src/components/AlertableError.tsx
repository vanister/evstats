import { IonAlert } from '@ionic/react';

type AlertableErrorProps = {
  displayType?: 'page' | 'alert';
  header?: string;
  message: string;
};

export default function AlertableError({ message, header = "Something went wrong...", displayType = 'alert' }: AlertableErrorProps) {
  if (displayType === 'alert') {
    return <IonAlert isOpen={true} header={header} message={message} />;
  }

  // todo - add ionpage
  return (
    <div className="root-error">
      <h1>{header}</h1>
      <p className="error-message">{message}</p>
    </div>
  );
}
