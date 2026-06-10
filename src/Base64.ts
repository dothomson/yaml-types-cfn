import type { Scalar, ScalarTag } from "yaml";

type FnBase64 = {
  "Fn::Base64": string;
};

function resolve(value: string) {
  return { "Fn::Base64": value };
}

function identify(value: unknown): value is FnBase64 {
  console.log("identify base64scalar:", value);
  const ret =
    value !== null &&
    typeof value === "object" &&
    "Fn::Base64" in value &&
    Object.keys(value).length === 1 &&
    typeof value["Fn::Base64"] === "string";
  console.log({ ret });
  if (
    value !== null &&
    typeof value === "object" &&
    "Fn::Base64" in value &&
    Object.keys(value).length === 1
  ) {
    console.log(typeof value["Fn::Base64"]);
  }
  return ret;
}

// Can b
function stringify(item: Scalar) {
  if (!identify(item.value)) {
    throw new TypeError(
      `Expected Fn::Base64 object, got: ${JSON.stringify(item.value)}`,
    );
  }

  const value = item.value["Fn::Base64"];

  // Only handle string values for ScalarTag
  if (typeof value === "string") {
    return value;
  }

  // For non-string values, throw an error since ScalarTag can't handle them
  throw new TypeError(
    `Base64 ScalarTag can only handle string values, got: ${typeof value}`,
  );
}

export const Base64: ScalarTag = {
  tag: "!Base64",
  resolve,
  identify,
  stringify,
};
