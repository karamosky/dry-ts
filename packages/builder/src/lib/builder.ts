type IBuilder<T, B = Record<string, unknown>> = {
  [k in keyof T]-?: ((arg: T[k]) => IBuilder<T, B & Record<k, T[k]>>) &
    (() => T[k]);
} & {
  build: B extends T ? () => T : never;
};

type Clazz<T> = new (...args: unknown[]) => T;

export function Builder<T>(type: Clazz<T>): IBuilder<T>;
export function Builder<T>(): IBuilder<T>;
export function Builder<T>(type?: Clazz<T>): IBuilder<T> {
  const built: Record<string, unknown> = {};

  const builder = new Proxy(
    {},
    {
      get(_target, prop) {
        if ('build' === prop) {
          if (type) {
            const obj: T = new type();
            return () => {
              return Object.assign(obj as T & Record<string, unknown>, {
                ...built,
              });
            };
          } else {
            return () => built;
          }
        }

        return (...args: unknown[]): unknown => {
          if (0 === args.length) {
            return built[prop.toString()];
          }

          built[prop.toString()] = args[0];
          return builder as IBuilder<T>;
        };
      },
    }
  );

  return builder as IBuilder<T>;
}
