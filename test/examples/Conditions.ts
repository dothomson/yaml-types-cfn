export const Conditions = [
  {
    // Fn::And
    yaml: `MyAndCondition: !And
  - !Equals ["sg-mysggroup", !Ref ASecurityGroup]
  - !Condition SomeOtherCondition
`,
    json: {
      MyAndCondition: {
        "Fn::And": [
          { "Fn::Equals": ["sg-mysggroup", { Ref: "ASecurityGroup" }] },
          { Condition: "SomeOtherCondition" },
        ],
      },
    },
  },
  {
    // Fn::Equals
    yaml: `IsProduction:
  !Equals [!Ref EnvironmentType, prod]
`,
    json: {
      IsProduction: { "Fn::Equals": [{ Ref: "EnvironmentType" }, "prod"] },
    },
  },
  {
    // Fn::If - conditionally choosing a resource
    yaml: `Resources:
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0abcdef1234567890
      InstanceType: t3.micro
      SecurityGroupIds: !If
        - CreateNewSecurityGroup
        - [!Ref NewSecurityGroup]
        - [!Ref ExistingSecurityGroupId]
`,
    json: {
      Resources: {
        EC2Instance: {
          Type: "AWS::EC2::Instance",
          Properties: {
            ImageId: "ami-0abcdef1234567890",
            InstanceType: "t3.micro",
            SecurityGroupIds: {
              "Fn::If": [
                "CreateNewSecurityGroup",
                [{ Ref: "NewSecurityGroup" }],
                [{ Ref: "ExistingSecurityGroupId" }],
              ],
            },
          },
        },
      },
    },
  },
  {
    // Fn::Not
    yaml: `MyNotCondition:
  !Not [!Equals [!Ref EnvironmentType, prod]]
`,
    json: {
      MyNotCondition: {
        "Fn::Not": [{ "Fn::Equals": [{ Ref: "EnvironmentType" }, "prod"] }],
      },
    },
  },
  {
    // Fn::Or
    yaml: `MyOrCondition:
  !Or [!Equals [sg-mysggroup, !Ref ASecurityGroup], Condition: SomeOtherCondition]
`,
    json: {
      MyOrCondition: {
        "Fn::Or": [
          { "Fn::Equals": ["sg-mysggroup", { Ref: "ASecurityGroup" }] },
          { Condition: "SomeOtherCondition" },
        ],
      },
    },
  },
  {
    // Sample template: conditionally create resources for prod/dev/test
    yaml: `AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  EnvType:
    Description: Environment type.
    Default: test
    Type: String
    AllowedValues: [prod, dev, test]
    ConstraintDescription: must specify prod, dev, or test.
Conditions:
  CreateProdResources: !Equals [!Ref EnvType, prod]
  CreateDevResources: !Equals [!Ref EnvType, "dev"]
Resources:
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-1234567890abcdef0
      InstanceType: !If [CreateProdResources, c5.xlarge, !If [CreateDevResources, t3.medium, t3.small]]
  MountPoint:
    Type: AWS::EC2::VolumeAttachment
    Condition: CreateProdResources
    Properties:
      InstanceId: !Ref EC2Instance
      VolumeId: !Ref NewVolume
      Device: /dev/sdh
  NewVolume:
    Type: AWS::EC2::Volume
    Condition: CreateProdResources
    Properties:
      Size: 100
      AvailabilityZone: !GetAtt EC2Instance.AvailabilityZone
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Parameters: {
        EnvType: {
          Description: "Environment type.",
          Default: "test",
          Type: "String",
          AllowedValues: ["prod", "dev", "test"],
          ConstraintDescription: "must specify prod, dev, or test.",
        },
      },
      Conditions: {
        CreateProdResources: { "Fn::Equals": [{ Ref: "EnvType" }, "prod"] },
        CreateDevResources: { "Fn::Equals": [{ Ref: "EnvType" }, "dev"] },
      },
      Resources: {
        EC2Instance: {
          Type: "AWS::EC2::Instance",
          Properties: {
            ImageId: "ami-1234567890abcdef0",
            InstanceType: {
              "Fn::If": [
                "CreateProdResources",
                "c5.xlarge",
                { "Fn::If": ["CreateDevResources", "t3.medium", "t3.small"] },
              ],
            },
          },
        },
        MountPoint: {
          Type: "AWS::EC2::VolumeAttachment",
          Condition: "CreateProdResources",
          Properties: {
            InstanceId: { Ref: "EC2Instance" },
            VolumeId: { Ref: "NewVolume" },
            Device: "/dev/sdh",
          },
        },
        NewVolume: {
          Type: "AWS::EC2::Volume",
          Condition: "CreateProdResources",
          Properties: {
            Size: 100,
            AvailabilityZone: {
              "Fn::GetAtt": ["EC2Instance", "AvailabilityZone"],
            },
          },
        },
      },
    },
  },
];
