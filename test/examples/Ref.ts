export const Ref = [
  {
    // Create references between resources
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Resources:
  MyEIP:
    Type: AWS::EC2::EIP
    Properties:
      InstanceId: !Ref MyEC2Instance
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Resources: {
        MyEIP: {
          Type: "AWS::EC2::EIP",
          Properties: { InstanceId: { Ref: "MyEC2Instance" } },
        },
      },
    },
  },
  {
    // Return a resource identifier as stack output
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub \${AWS::StackName}-mybucket
Outputs:
  BucketNameOutput:
    Description: The name of the S3 bucket
    Value: !Ref MyBucket
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Resources: {
        MyBucket: {
          Type: "AWS::S3::Bucket",
          Properties: {
            BucketName: { "Fn::Sub": "${AWS::StackName}-mybucket" },
          },
        },
      },
      Outputs: {
        BucketNameOutput: {
          Description: "The name of the S3 bucket",
          Value: { Ref: "MyBucket" },
        },
      },
    },
  },
];
