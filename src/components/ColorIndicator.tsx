import './ColorIndicator.scss';
import { IonSlots } from '../constants';
import classNames from 'classnames';

type ColorIndicatorProps = {
  color: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  slot?: IonSlots;
};

export default function ColorIndicator({
  color,
  size = 'medium',
  className = '',
  slot
}: ColorIndicatorProps) {
  return (
    <div
      className={classNames('color-indicator', `color-indicator--${size}`, className)}
      style={{ backgroundColor: color }}
      slot={slot}
    />
  );
}
