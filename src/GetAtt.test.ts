import { describe, expect, it } from "vitest";
import { parse, stringify } from "yaml";
import { GetAtt } from "./GetAtt";

describe("GetAtt", () => {
  it("should parse !GetAtt tag with dot notation", () => {
    const yaml = "Value: !GetAtt Resource.Attribute";
    const result = parse(yaml, { customTags: [GetAtt] });

    expect(result).toEqual({
      Value: {
        "Fn::GetAtt": ["Resource", "Attribute"],
      },
    });
  });

  it("should work in complex template structure", () => {
    const yaml = `
Resources:
  MyBucket:
    Type: AWS::S3::Bucket

Outputs:
  BucketArn: !GetAtt MyBucket.Arn
  BucketDomain: !GetAtt MyBucket.DomainName
`;
    const result = parse(yaml, { customTags: [GetAtt] });

    expect(result.Outputs.BucketArn).toEqual({
      "Fn::GetAtt": ["MyBucket", "Arn"],
    });
    expect(result.Outputs.BucketDomain).toEqual({
      "Fn::GetAtt": ["MyBucket", "DomainName"],
    });
  });

  it("should convert JSON back to YAML with tag", () => {
    const obj = {
      Value: {
        "Fn::GetAtt": ["MyResource", "Arn"],
      },
    };

    const yaml = stringify(obj, { customTags: [GetAtt] });

    expect(yaml).toBe("Value: !GetAtt MyResource.Arn\n");
  });

  it("should round-trip parse and stringify", () => {
    const originalYaml = "BucketArn: !GetAtt MyBucket.Arn\n";

    const parsed = parse(originalYaml, { customTags: [GetAtt] });
    const stringified = stringify(parsed, { customTags: [GetAtt] });

    expect(stringified).toBe(originalYaml);
  });
});

describe("GetAtt internals", () => {
  it("correctly identifies a correct object", () => {
    const obj = {
      "Fn::GetAtt": ["Resource", "Attribute"],
    };

    expect(GetAtt.identify?.(obj)).toBeTruthy;
  });

  it.each([
    {
      description: "objects with multiple keys",
      input: {
        "Fn::GetAtt": ["Resource", "Attribute"],
        AnotherKey: "value",
      },
    },
    {
      description: "objects with wrong array length",
      input: {
        "Fn::GetAtt": ["Resource"],
      },
    },
    {
      description: "objects with non-string array elements",
      input: {
        "Fn::GetAtt": ["Resource", 123],
      },
    },
    {
      description: "non-array Fn::GetAtt values",
      input: {
        "Fn::GetAtt": "Resource.Attribute",
      },
    },
  ])("should reject $description", ({ input }) => {
    expect(GetAtt.identify?.(input)).toBe(false);
  });
});
