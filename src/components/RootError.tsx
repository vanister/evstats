import { IonAlert } from '@ionic/react';

type RootErrorProps = {
  message: string;
  displayType?: 'page' | 'alert';
};

export default function RootError({ message, displayType = 'alert' }: RootErrorProps) {
  if (displayType === 'alert') {
    return <IonAlert isOpen={true} header="Error" message={message} />;
  }

  // todo - add ionpage
  return (
    <div className="root-error">
      <h1>Something went wrong...</h1>
      <p className="error-message">{message}</p>
    </div>
  );
}
