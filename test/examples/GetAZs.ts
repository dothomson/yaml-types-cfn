export const GetAZs = [
  {
    yaml: `mySubnet:
  Type: AWS::EC2::Subnet
  Properties:
    VpcId: !Ref VPC
    CidrBlock: 10.0.0.0/24
    AvailabilityZone:
      Fn::Select:
        - 0
        - Fn::GetAZs: ""`,
    json: {
      mySubnet: {
        Type: "AWS::EC2::Subnet",
        Properties: {
          VpcId: { Ref: "VPC" },
          CidrBlock: "10.0.0.0/24",
          AvailabilityZone: { "Fn::Select": [0, { "Fn::GetAZs": "" }] },
        },
      },
    },
  },
  {
    // Nested short form: !Select + !GetAZs with Ref
    yaml: `AvailabilityZone: !Select
  - 0
  - !GetAZs
    Ref: 'AWS::Region'`,
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
  - Fn::GetAZs: !Ref 'AWS::Region'`,
    json: {
      AvailabilityZone: {
        "Fn::Select": [0, { "Fn::GetAZs": { Ref: "AWS::Region" } }],
      },
    },
  },
];
