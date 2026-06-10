import { describe, expect, test } from "vitest";
import { parse } from "yaml";
import {
  And,
  Base64,
  Cidr,
  Condition,
  customTags,
  Equals,
  FindInMap,
  GetAtt,
  GetAZs,
  If,
  ImportValue,
  Join,
  Not,
  Or,
  Ref,
  Select,
  Split,
  Sub,
  Transform,
} from "../src/tags";
import { Cidr as CidrExamples } from "./examples/Cidr";
import { Conditions as ConditionsExamples } from "./examples/Conditions";
import { FindInMap as FindInMapExamples } from "./examples/FindInMap";
import { GetAtt as GetAttExamples } from "./examples/GetAtt";
import { GetAZs as GetAZsExamples } from "./examples/GetAZs";
import { ImportValue as ImportValueExamples } from "./examples/ImportValue";
import { Join as JoinExamples } from "./examples/Join";
import { Ref as RefExamples } from "./examples/Ref";
import { Select as SelectExamples } from "./examples/Select";
import { Split as SplitExamples } from "./examples/Split";
import { Sub as SubExamples } from "./examples/Sub";
import { Transform as TransformExamples } from "./examples/Transform";

describe("correctly parses tags:", () => {
  test("!Base64", () => {
    expect(parse("!Base64 valueToEncode", { customTags: Base64 })).toEqual({
      "Fn::Base64": "valueToEncode",
    });

    expect(parse("!Base64\n  Fn::Sub: string", { customTags: Base64 })).toEqual(
      { "Fn::Base64": { "Fn::Sub": "string" } },
    );
  });

  test("!Cidr", () => {
    expect(
      parse("!Cidr [ ipBlock, count, cidrBits ]", { customTags: Cidr }),
    ).toEqual({ "Fn::Cidr": ["ipBlock", "count", "cidrBits"] });

    for (const { yaml, json } of CidrExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!FindInMap", () => {
    expect(
      parse("!FindInMap [ MapName, TopLevelKey, SecondLevelKey ]", {
        customTags: FindInMap,
      }),
    ).toEqual({
      "Fn::FindInMap": ["MapName", "TopLevelKey", "SecondLevelKey"],
    });

    expect(
      parse(
        "!FindInMap [ MapName, TopLevelKey, SecondLevelKey, DefaultValue: DefaultValue ]",
        { customTags: FindInMap },
      ),
    ).toEqual({
      "Fn::FindInMap": [
        "MapName",
        "TopLevelKey",
        "SecondLevelKey",
        { DefaultValue: "DefaultValue" },
      ],
    });

    for (const { yaml, json } of FindInMapExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!GetAtt", () => {
    expect(
      parse("!GetAtt logicalNameOfResource.attributeName", {
        customTags: GetAtt,
      }),
    ).toEqual({ "Fn::GetAtt": ["logicalNameOfResource", "attributeName"] });

    for (const { yaml, json } of GetAttExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!GetAZs", () => {
    expect(parse("!GetAZs region", { customTags: GetAZs })).toEqual({
      "Fn::GetAZs": "region",
    });

    expect(parse('Fn::GetAZs: ""', { customTags: GetAZs })).toEqual({
      "Fn::GetAZs": "",
    });
    expect(
      parse('Fn::GetAZs:\n  Ref: "AWS::Region"', {
        customTags: [...GetAZs, ...Ref],
      }),
    ).toEqual({ "Fn::GetAZs": { Ref: "AWS::Region" } });
    expect(parse("Fn::GetAZs: us-east-1", { customTags: GetAZs })).toEqual({
      "Fn::GetAZs": "us-east-1",
    });

    for (const { yaml, json } of GetAZsExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!ImportValue", () => {
    expect(
      parse("!ImportValue sharedValueToImport", { customTags: ImportValue }),
    ).toEqual({ "Fn::ImportValue": "sharedValueToImport" });

    for (const { yaml, json } of ImportValueExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!Join", () => {
    expect(parse('!Join [ ":", [ a, b, c ] ]', { customTags: Join })).toEqual({
      "Fn::Join": [":", ["a", "b", "c"]],
    });

    for (const { yaml, json } of JoinExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!Select", () => {
    expect(
      parse('!Select [ "1", [ a, b, c ] ]', { customTags: Select }),
    ).toEqual({ "Fn::Select": ["1", ["a", "b", "c"]] });

    for (const { yaml, json } of SelectExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!Split", () => {
    expect(parse('!Split [ "|", "a|b|c" ]', { customTags: Split })).toEqual({
      "Fn::Split": ["|", "a|b|c"],
    });

    for (const { yaml, json } of SplitExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!Sub", () => {
    expect(
      parse("!Sub 'Hello ${AWS::StackName}'", { customTags: Sub }),
    ).toEqual({ "Fn::Sub": "Hello ${AWS::StackName}" });

    for (const { yaml, json } of SubExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!Transform", () => {
    expect(
      parse("!Transform\n  Name: MyMacro\n  Parameters:\n    Key: Value", {
        customTags: Transform,
      }),
    ).toEqual({ "Fn::Transform": { Name: "MyMacro", Parameters: { Key: "Value" } } });

    for (const { yaml, json } of TransformExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("!Ref", () => {
    expect(parse("!Ref MyResource", { customTags: Ref })).toEqual({
      Ref: "MyResource",
    });

    for (const { yaml, json } of RefExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });

  test("Condition functions", () => {
    expect(
      parse("!And [ condition1, condition2 ]", { customTags: And }),
    ).toEqual({ "Fn::And": ["condition1", "condition2"] });

    expect(parse("!Equals [ value1, value2 ]", { customTags: Equals })).toEqual(
      { "Fn::Equals": ["value1", "value2"] },
    );

    expect(
      parse("!If [ condition, value_if_true, value_if_false ]", {
        customTags: If,
      }),
    ).toEqual({ "Fn::If": ["condition", "value_if_true", "value_if_false"] });

    expect(parse("!Not [ condition ]", { customTags: Not })).toEqual({
      "Fn::Not": ["condition"],
    });

    expect(parse("!Or [ condition1, condition2 ]", { customTags: Or })).toEqual(
      { "Fn::Or": ["condition1", "condition2"] },
    );

    expect(parse("!Condition MyCondition", { customTags: Condition })).toEqual({
      Condition: "MyCondition",
    });

    for (const { yaml, json } of ConditionsExamples) {
      expect(parse(yaml, { customTags: customTags })).toEqual(json);
    }
  });
});
