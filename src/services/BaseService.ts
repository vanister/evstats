import { PartialPropertyRecord } from './service-types';

export abstract class BaseService {
  /**
   * Maps proeprties that exists in a property map from one object to a new object.
   *
   * `From` a given object.
   *
   * `To` a new object that is created from the mapping.
   *
   * Using a `propertyMap` of properties to look up for properties that are not a 1:1 match.
   *
   * @param from The object with the values to map proeprties from.
   * @param propertyMap The partial property map to use for lookup for non-1:1 matches.
   */
  protected mapFrom<From, To>(from: From, propertyMap: PartialPropertyRecord<From, To>): To {
    const to = Object.entries(from).reduce((prev, [key, value]) => {
      const mappedKey: string = propertyMap[key] ?? key;

      return { ...prev, [mappedKey]: value };
    }, {} as To);

    return to;
  }
}
