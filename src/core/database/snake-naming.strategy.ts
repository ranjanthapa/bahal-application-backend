import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName?: string): string {
    return customName ?? this.camelToSnake(className);
  }

  columnName(propertyName: string, customName?: string): string {
    return customName ?? this.camelToSnake(propertyName);
  }

  relationName(propertyName: string): string {
    return this.camelToSnake(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return this.camelToSnake(`${relationName}_${referencedColumnName}`);
  }

  private camelToSnake(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }
}
