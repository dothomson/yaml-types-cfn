import { describe, expect, it } from "vitest";
import { parse, stringify } from "yaml";
import { Base64 } from "./Base64";
import { Base64Collection } from "./Base64Collection";
import { GetAtt } from "./GetAtt";
import { customTags, shuffle } from "./tags";

const customTagsShuffled = shuffle(customTags);
console.log(customTagsShuffled);
describe("Base64", () => {
  it("should parse !Base64 tag with string value", () => {
    const yaml = "Value: !Base64 AWS CloudFormation";
    const result = parse(yaml, { customTags: [Base64] });

    expect(result).toEqual({
      Value: {
        "Fn::Base64": "AWS CloudFormation",
      },
    });
  });

  it("should work in complex template structure", () => {
    const yaml = `
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      UserData: !Base64 |
        #!/bin/bash
        echo "Hello World"
`;
    const result = parse(yaml, { customTags: [Base64] });

    expect(result.Resources.MyInstance.Properties.UserData).toEqual({
      "Fn::Base64": '#!/bin/bash\necho "Hello World"\n',
    });
  });

  it("should convert JSON back to YAML with tag", () => {
    const obj = {
      Value: {
        "Fn::Base64": "AWS CloudFormation",
      },
    };

    const yaml = stringify(obj, { customTags: [Base64] });

    expect(yaml).toBe("Value: !Base64 AWS CloudFormation\n");
  });

  it("should round-trip parse and stringify", () => {
    const originalYaml = "UserData: !Base64 AWS CloudFormation\n";

    const parsed = parse(originalYaml, { customTags: [Base64] });
    const stringified = stringify(parsed, { customTags: [Base64] });

    expect(stringified).toBe(originalYaml);
  });

  it("should parse nested !Tag then Fn", () => {
    const originalYaml = `
Value: !Base64
  Fn::GetAtt:
    - MyBucket
    - Arn
`;
    const parsed = parse(originalYaml, {
      customTags: [Base64Collection, Base64, GetAtt],
    });

    console.log(JSON.stringify(parsed));

    expect(parsed).toMatchObject({
      Value: {
        "Fn::Base64": {
          "Fn::GetAtt": ["MyBucket", "Arn"],
        },
      },
    });
  });

  it.only("should parse nested Fn then !Tag", () => {
    const originalYaml = `
Value:
  Fn::Base64: !GetAtt MyBucket.Arn
`;
    const parsed = parse(originalYaml, {
      customTags: [Base64, Base64Collection, GetAtt],
    });

    console.log(JSON.stringify(parsed));

    expect(parsed).toMatchObject({
      Value: {
        "Fn::Base64": {
          "Fn::GetAtt": ["MyBucket", "Arn"],
        },
      },
    });

    const stringified = stringify(parsed, {
      customTags: [Base64, Base64Collection, GetAtt],
    });

    console.log(stringified);
  });

  it("should fail multiple tags - Fn then !Tag", () => {
    const originalYaml = `
Value:
  "Fn::Base64": !GetAtt MyBucket.Arn
`;
    const parsed = parse(originalYaml, {
      customTags: [Base64, Base64Collection, GetAtt],
    });

    console.log(JSON.stringify(parsed));

    expect(parsed).toMatchObject({
      Value: {
        "Fn::Base64": {
          "Fn::GetAtt": ["MyBucket", "Arn"],
        },
      },
    });
  });
});

describe("Base64 internals", () => {
  it("correctly identifies a correct object", () => {
    const obj = {
      "Fn::Base64": "some value",
    };

    expect(Base64.identify?.(obj)).toBeTruthy();
    expect(Base64Collection.identify?.(obj)).toBeFalsy();
  });

  it("correctly identifies a correct object", () => {
    const obj = {
      "Fn::Base64": {
        "Fn::GetAtt": ["MyBucket", "Arn"],
      },
    };

    expect(Base64.identify?.(obj)).toBeFalsy();
    expect(Base64Collection.identify?.(obj)).toBeTruthy();
  });

  it.each([
    {
      description: "objects with multiple keys",
      input: {
        "Fn::Base64": "value",
        AnotherKey: "value",
      },
    },
    {
      description: "objects without Fn::Base64 key",
      input: {
        SomeOtherKey: "value",
      },
    },
    {
      description: "null values",
      input: null,
    },
    {
      description: "primitive values",
      input: "just a string",
    },
  ])("should reject $description", ({ input }) => {
    expect(Base64.identify?.(input)).toBe(false);
  });
});
