import type { Scalar, ScalarTag } from "yaml";

type FnGetAtt = {
  "Fn::GetAtt": [string, string];
};

function resolve(value: string) {
  const [resource, attribute] = value.split(".");
  return { "Fn::GetAtt": [resource, attribute] };
}

function identify(value: unknown): value is FnGetAtt {
  console.log("identify getAtt:", value);
  return (
    value !== null &&
    typeof value === "object" &&
    "Fn::GetAtt" in value &&
    Object.keys(value).length === 1 &&
    Array.isArray(value["Fn::GetAtt"]) &&
    value["Fn::GetAtt"].length === 2 &&
    value["Fn::GetAtt"].every((v) => typeof v === "string")
  );
}

function stringify(item: Scalar) {
  if (!identify(item.value)) {
    throw new TypeError(
      `Expected Fn::GetAtt object, got: ${JSON.stringify(item.value)}`,
    );
  }

  const [resource, attribute] = item.value["Fn::GetAtt"];
  return `${resource}.${attribute}`;
}

export const GetAtt: ScalarTag = {
  tag: "!GetAtt",
  resolve,
  identify,
  stringify,
};
