import { assertType, expectTypeOf } from 'vitest';

import { Builder } from './builder.js';

describe('Builder', () => {
  describe('type inference', () => {
    it('should be a function', () => {
      expectTypeOf(Builder).toBeFunction();
    });

    it('should build a class', () => {
      class Person {
        firstName!: string;
        lastName?: string;
        age!: number;
      }

      const personBuilder = Builder<Person>(Person);

      expectTypeOf(personBuilder.build).toBeNever();

      assertType<number>(personBuilder.age());
      assertType<string>(personBuilder.firstName());
      assertType<string | undefined>(personBuilder.lastName());

      const person = personBuilder
        .firstName('John')
        .lastName('Doe')
        .age(30)
        .build();

      expectTypeOf(person).toEqualTypeOf<Person>();
      expect(person).toEqual({ firstName: 'John', lastName: 'Doe', age: 30 });
    });

    it('should build an interface', () => {
      interface Person {
        firstName: string;
        lastName?: string;
        age: number;
      }

      const personBuilder = Builder<Person>();

      assertType<number>(personBuilder.age());
      assertType<string>(personBuilder.firstName());
      assertType<string | undefined>(personBuilder.lastName());

      const person = personBuilder
        .firstName('John')
        .lastName('Doe')
        .age(30)
        .build();

      expectTypeOf(person).toEqualTypeOf<Person>();
      expect(person).toEqual({ firstName: 'John', lastName: 'Doe', age: 30 });
    });
  });

  describe('runtime behavior', () => {
    it('should build a class', () => {
      class Person {
        name!: string;
        age!: number;
      }

      const personBuilder = Builder(Person);

      const person = personBuilder.name('John').age(30).build();

      expect(person).toBeInstanceOf(Person);
      expect(person).toEqual({ name: 'John', age: 30 });
    });

    it('should build an interface', () => {
      interface Person {
        name: string;
        age: number;
      }

      const personBuilder = Builder<Person>();

      const person = personBuilder.name('John').age(30).build();

      expect(person).toBeInstanceOf(Object);
      expect(person).toEqual({ name: 'John', age: 30 });
    });
  });
});
