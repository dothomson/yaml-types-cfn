import type { CollectionTag, ScalarTag, YAMLMap, YAMLSeq } from "yaml";

type Tag = ScalarTag | CollectionTag;

function scalar(tag: string, key: string): ScalarTag {
  return { tag, resolve: (value: string) => ({ [key]: value }) };
}

function mapTag(tag: string, key: string): CollectionTag {
  return {
    tag,
    collection: "map",
    resolve: (value: YAMLMap.Parsed | YAMLSeq.Parsed) => ({
      [key]: value.toJSON(),
    }),
  };
}

function seqTag(tag: string, key: string): CollectionTag {
  return {
    tag,
    collection: "seq",
    resolve: (value: YAMLMap.Parsed | YAMLSeq.Parsed) => ({
      [key]: value.toJSON(),
    }),
  };
}

export const Base64: Tag[] = [
  scalar("!Base64", "Fn::Base64"),
  mapTag("!Base64", "Fn::Base64"),
];
export const GetAtt: Tag[] = [
  {
    tag: "!GetAtt",
    resolve: (value: string) => {
      const i = value.indexOf(".");
      return { "Fn::GetAtt": [value.slice(0, i), value.slice(i + 1)] };
    },
  },
  seqTag("!GetAtt", "Fn::GetAtt"),
];
export const Ref: Tag[] = [scalar("!Ref", "Ref"), mapTag("!Ref", "Ref")];
export const GetAZs: Tag[] = [
  scalar("!GetAZs", "Fn::GetAZs"),
  mapTag("!GetAZs", "Fn::GetAZs"),
];
export const ImportValue: Tag[] = [
  scalar("!ImportValue", "Fn::ImportValue"),
  mapTag("!ImportValue", "Fn::ImportValue"),
];
export const Sub: Tag[] = [
  scalar("!Sub", "Fn::Sub"),
  seqTag("!Sub", "Fn::Sub"),
];
export const Condition: Tag[] = [scalar("!Condition", "Condition")];
export const Cidr: Tag[] = [seqTag("!Cidr", "Fn::Cidr")];
export const And: Tag[] = [seqTag("!And", "Fn::And")];
export const Equals: Tag[] = [seqTag("!Equals", "Fn::Equals")];
export const If: Tag[] = [seqTag("!If", "Fn::If")];
export const Not: Tag[] = [seqTag("!Not", "Fn::Not")];
export const Or: Tag[] = [seqTag("!Or", "Fn::Or")];
export const FindInMap: Tag[] = [seqTag("!FindInMap", "Fn::FindInMap")];
export const Join: Tag[] = [seqTag("!Join", "Fn::Join")];
export const Select: Tag[] = [seqTag("!Select", "Fn::Select")];
export const Split: Tag[] = [seqTag("!Split", "Fn::Split")];
export const Transform: Tag[] = [mapTag("!Transform", "Fn::Transform")];

export const customTags: Tag[] = [
  Base64,
  GetAtt,
  Ref,
  GetAZs,
  ImportValue,
  Sub,
  Condition,
  Cidr,
  And,
  Equals,
  If,
  Not,
  Or,
  FindInMap,
  Join,
  Select,
  Split,
  Transform,
].flat();
