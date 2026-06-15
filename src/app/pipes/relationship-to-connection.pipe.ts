import { Pipe, PipeTransform } from '@angular/core';
import { Relationship } from '../services/models/relationship';

@Pipe({ name: 'relationShipToConnection' })
export default class RelationshipToConnectionPipe implements PipeTransform {
  transform(relationship: Relationship): string {
    return relationship.connected
      ? '1st'
      : relationship.hasConnectionInCommon
        ? '2nd'
        : '3rd';
  }
}
