import { CollectionTag, Node, Schema, YAMLMap, YAMLSeq } from "yaml";
import { CreateNodeContext } from "yaml/util";

type FnBase64 = {
  "Fn::Base64": unknown;
};

function resolve(value: YAMLMap.Parsed | YAMLSeq.Parsed) {
  return { "Fn::Base64": value.toJSON() };
}

// could use the identify function for any of the string returning functions
// !FindInMap(sometimes) !GetAtt !ImportValue(sometimes)
function identify(value: unknown): value is FnBase64 {
  console.log("identify base64mapping:", value);
  const ret =
    value !== null &&
    typeof value === "object" &&
    "Fn::Base64" in value &&
    Object.keys(value).length === 1 &&
    Object.values(value)[0] !== null &&
    typeof Object.values(value)[0] === "object";
  console.log({ ret });
  return ret;
}

export const Base64Collection: CollectionTag = {
  tag: "!Base64",
  collection: "map",
  resolve,
  identify,
  createNode,
};

function createNode(
  schema: Schema,
  value: unknown,
  ctx: CreateNodeContext,
): Node {}
