import { DestinyVersion } from '@destinyitemmanager/dim-api-types';
import { DestinyClass } from 'bungie-api-ts/destiny2';

export interface LoadoutItem {
  id: string;
  hash: number;
  amount: number;
  equipped: boolean;
}

/** In memory loadout structure. */
export interface Loadout {
  id: string;
  classType: DestinyClass;
  name: string;
  items: LoadoutItem[];
  /** Platform membership ID this loadout is associated with */
  membershipId?: string;
  destinyVersion: DestinyVersion;
  // TODO: deprecate this
  platform?: string;
  /** Whether to move other items not in the loadout off the character when applying the loadout. */
  clearSpace?: boolean;
}
