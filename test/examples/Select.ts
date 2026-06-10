export const Select = [
  {
    // Basic example - returns "grapes"
    yaml: `!Select [ "1", [ "apples", "grapes", "oranges", "mangoes" ] ]
`,
    json: { "Fn::Select": ["1", ["apples", "grapes", "oranges", "mangoes"]] },
  },
  {
    // Select from a CommaDelimitedList parameter ref
    yaml: `Subnet0:
  Type: AWS::EC2::Subnet
  Properties:
    VpcId: !Ref VPC
    CidrBlock: !Select [ 0, !Ref DbSubnetIpBlocks ]
`,
    json: {
      Subnet0: {
        Type: "AWS::EC2::Subnet",
        Properties: {
          VpcId: { Ref: "VPC" },
          CidrBlock: { "Fn::Select": [0, { Ref: "DbSubnetIpBlocks" }] },
        },
      },
    },
  },
  {
    // Nested short form: !Select + !GetAZs with Ref
    yaml: `AvailabilityZone: !Select
  - 0
  - !GetAZs
    Ref: 'AWS::Region'
`,
    json: {
      AvailabilityZone: {
        "Fn::Select": [0, { "Fn::GetAZs": { Ref: "AWS::Region" } }],
      },
    },
  },
  {
    // Nested short form: !Select + Fn::GetAZs with !Ref
    yaml: `AvailabilityZone: !Select
  - 0
  - Fn::GetAZs: !Ref 'AWS::Region'
`,
    json: {
      AvailabilityZone: {
        "Fn::Select": [0, { "Fn::GetAZs": { Ref: "AWS::Region" } }],
      },
    },
  },
];
