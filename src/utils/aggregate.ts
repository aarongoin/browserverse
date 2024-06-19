type Value =
  | unknown
  | null
  | boolean
  | number
  | bigint
  | string
  | unknown[]
  | Record<string, unknown>;
type Aggregate = Record<string, Value>;

/*

  Aggregate is a method used to aggregate objects together into a single new object.

  It functions in a similar vein as _.merge() or Object.assign(), except that it returns a new object rather than merging into the first argument.
  The other significant difference with these methods is how the aggregate method merges values:
    Undefined and null values are ignored, ex. aggregate({ foo: 4 }, { foo: null }) === { foo: 4 }
    Booleans are combined with a logical AND operater, ex aggregate({ foo: true }, { foo: false }) === { foo: false }
    Numbers and BigInts are added together, ex. aggregate({ foo: BigInt(4) }, { foo: 1 }) === { foo: BigInt(5) }
    Arrays are spread into a single new array, ex. aggregate({ foo: [1] }, { foo: [2, 3] }) === { foo: [1, 2, 3] }
    Objects recurse and are aggregated together.
    All other values are replaced with the last version, ex. aggregate({ foo: () => "hi" }, { foo: () => "bye" }, { foo: null }) === { foo: () => "bye" }

*/

export default function aggregate<A extends Aggregate = Aggregate>(
  ...chunks: Array<Partial<A>>
): A {
  const result = {} as A;
  for (const [key, value] of chunks.flatMap((chunk) =>
    Object.entries<Value>(chunk)
  ) as Array<[keyof A, A[keyof A]]>) {
    if (value == null) continue;
    else if (typeof value === "number") aggregate_number(result, key, value);
    else if (typeof value === "boolean") aggregate_boolean(result, key, value);
    else if (typeof value === "string") aggregate_string(result, key, value);
    else if (Array.isArray(value)) aggregate_array(result, key, value);
    else if (typeof value === "object")
      aggregate_object(result, key, value as object);
    else if (typeof value === "bigint") aggregate_bigint(result, key, value);
    else result[key] = value;
  }
  return result;
}

function aggregate_boolean<A extends Aggregate = Aggregate>(
  result: A,
  key: keyof A,
  value: boolean
): void {
  // @ts-ignore
  result[key] = typeof result[key] === "boolean" ? result[key] && value : value;
}

function aggregate_number<A extends Aggregate = Aggregate>(
  result: A,
  key: keyof A,
  value: number
): void {
  // @ts-ignore
  result[key] = typeof result[key] === "number" ? result[key] + value : value;
}

function aggregate_string<A extends Aggregate = Aggregate>(
  result: A,
  key: keyof A,
  value: string
): void {
  // @ts-ignore
  result[key] = typeof agg === "string" ? `${agg}${value}` : value;
}

function aggregate_bigint<A extends Aggregate = Aggregate>(
  result: A,
  key: keyof A,
  value: bigint
): void {
  if (typeof result[key] === "number" || typeof result[key] === "bigint") {
    // @ts-ignore
    result[key] = BigInt(result[key] + value);
  } else {
    // @ts-ignore
    result[key] = value;
  }
}

function aggregate_object<A extends Aggregate = Aggregate>(
  result: A,
  key: keyof A,
  value: object
): void {
  if (typeof result[key] === "object" && !Array.isArray(result[key])) {
    // @ts-ignore
    result[key] = aggregate(result[key], value);
  } else {
    // @ts-ignore
    result[key] = value;
  }
}
function aggregate_array<A extends Aggregate = Aggregate>(
  result: A,
  key: keyof A,
  value: unknown[]
): void {
  if (Array.isArray(result[key])) {
    // @ts-ignore
    result[key] = [...result[key], ...value];
  } else {
    // @ts-ignore
    result[key] = value;
  }
}
