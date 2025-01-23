import './EmptyState.scss';

import { PropsWithChildren } from 'react';
import classNames from 'classnames';

type EmptyStateProps = PropsWithChildren<{
  className?: string;
}>;

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div className={classNames('empty-state', props.className)}>
      <h3>{props.children ?? 'No data'}</h3>
    </div>
  );
}
