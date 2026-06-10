export const FindInMap = [
  {
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Parameters:
  InstanceType:
    Description: The EC2 instance type
    Type: String
    AllowedValues:
      - t3.micro
      - t4g.nano
    Default: t3.micro
Mappings:
  AWSInstanceType2Arch:
    t3.micro:
      Arch: HVM64
    t4g.nano:
      Arch: ARM64
  AWSRegionArch2AMI:
    us-east-1:
      HVM64: ami-12345678901234567
      ARM64: ami-23456789012345678
    us-west-1:
      HVM64: ami-34567890123456789
      ARM64: ami-45678901234567890
    eu-west-1:
      HVM64: ami-56789012345678901
      ARM64: ami-67890123456789012
    ap-southeast-1:
      HVM64: ami-78901234567890123
      ARM64: ami-89012345678901234
    ap-northeast-1:
      HVM64: ami-90123456789012345
      ARM64: ami-01234567890123456
Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId:
        Fn::FindInMap:
        - AWSRegionArch2AMI
        - Ref: AWS::Region
        - Fn::FindInMap:
          - AWSInstanceType2Arch
          - Ref: InstanceType
          - Arch
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Parameters: {
        InstanceType: {
          Description: "The EC2 instance type",
          Type: "String",
          AllowedValues: ["t3.micro", "t4g.nano"],
          Default: "t3.micro",
        },
      },
      Mappings: {
        AWSInstanceType2Arch: {
          "t3.micro": { Arch: "HVM64" },
          "t4g.nano": { Arch: "ARM64" },
        },
        AWSRegionArch2AMI: {
          "us-east-1": {
            HVM64: "ami-12345678901234567",
            ARM64: "ami-23456789012345678",
          },
          "us-west-1": {
            HVM64: "ami-34567890123456789",
            ARM64: "ami-45678901234567890",
          },
          "eu-west-1": {
            HVM64: "ami-56789012345678901",
            ARM64: "ami-67890123456789012",
          },
          "ap-southeast-1": {
            HVM64: "ami-78901234567890123",
            ARM64: "ami-89012345678901234",
          },
          "ap-northeast-1": {
            HVM64: "ami-90123456789012345",
            ARM64: "ami-01234567890123456",
          },
        },
      },
      Resources: {
        MyEC2Instance: {
          Type: "AWS::EC2::Instance",
          Properties: {
            InstanceType: { Ref: "InstanceType" },
            ImageId: {
              "Fn::FindInMap": [
                "AWSRegionArch2AMI",
                { Ref: "AWS::Region" },
                {
                  "Fn::FindInMap": [
                    "AWSInstanceType2Arch",
                    { Ref: "InstanceType" },
                    "Arch",
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Parameters:
  EnvironmentType:
    Description: The environment type (Dev or Prod)
    Type: String
    Default: Dev
    AllowedValues:
      - Dev
      - Prod
Mappings:
  SecurityGroups:
    Dev:
      SecurityGroupIds: sg-12345678
    Prod:
      SecurityGroupIds: sg-abcdef01,sg-ghijkl23
Resources:
  Ec2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: '{{resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64}}'
      InstanceType: t2.micro
      SecurityGroupIds:
        Fn::Split:
          - ","
          - Fn::FindInMap: [ SecurityGroups, !Ref EnvironmentType, SecurityGroupIds ]
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Parameters: {
        EnvironmentType: {
          Description: "The environment type (Dev or Prod)",
          Type: "String",
          Default: "Dev",
          AllowedValues: ["Dev", "Prod"],
        },
      },
      Mappings: {
        SecurityGroups: {
          Dev: { SecurityGroupIds: "sg-12345678" },
          Prod: { SecurityGroupIds: "sg-abcdef01,sg-ghijkl23" },
        },
      },
      Resources: {
        Ec2Instance: {
          Type: "AWS::EC2::Instance",
          Properties: {
            ImageId:
              "{{resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64}}",
            InstanceType: "t2.micro",
            SecurityGroupIds: {
              "Fn::Split": [
                ",",
                {
                  "Fn::FindInMap": [
                    "SecurityGroups",
                    { Ref: "EnvironmentType" },
                    "SecurityGroupIds",
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Mappings:
  RegionMap:
    us-east-1:
      InstanceType: t3.large
    eu-west-1:
      InstanceType: t3.medium
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: '{{resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64}}'
      InstanceType: !FindInMap
        - RegionMap
        - !Ref AWS::Region
        - InstanceType
        - DefaultValue: t3.micro
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Mappings: {
        RegionMap: {
          "us-east-1": { InstanceType: "t3.large" },
          "eu-west-1": { InstanceType: "t3.medium" },
        },
      },
      Resources: {
        MyInstance: {
          Type: "AWS::EC2::Instance",
          Properties: {
            ImageId:
              "{{resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64}}",
            InstanceType: {
              "Fn::FindInMap": [
                "RegionMap",
                { Ref: "AWS::Region" },
                "InstanceType",
                { DefaultValue: "t3.micro" },
              ],
            },
          },
        },
      },
    },
  },
];
