import * as React from 'react';
import { t } from 'i18next';
import { Subscription } from 'rxjs/Subscription';
import { AppIcon, refreshIcon } from './icons';
import { Subject } from 'rxjs/Subject';
import { loadingTracker } from './loading-tracker';
import { GlobalHotKeys, KeyMap } from 'react-hotkeys';

export const refresh$ = new Subject();

export function refresh() {
  // Individual pages should listen to this event and decide what to refresh,
  // and their services should decide how to cache/dedup refreshes.
  // This event should *NOT* be listened to by services!
  refresh$.next();
}

const keyMap: KeyMap = {
  RefreshInventory: 'r'
};

export default class Refresh extends React.Component<{}, { active: boolean }> {
  private subscription: Subscription;

  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  componentDidMount() {
    this.subscription = loadingTracker.active$.subscribe((active) => {
      this.setState({ active });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { active } = this.state;

    return (
      <span className="link" onClick={refresh} title={t('Header.Refresh')}>
        <GlobalHotKeys
          keyMap={keyMap}
          handlers={{
            RefreshInventory: refresh
          }}
        />
        <AppIcon icon={refreshIcon} spinning={active} />
      </span>
    );
  }
}
