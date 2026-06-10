export const Sub = [
  {
    // Fn::Sub without a key-value map
    yaml: `InstanceSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: !Sub "SSH security group for \${AWS::StackName}"
`,
    json: {
      InstanceSecurityGroup: {
        Type: "AWS::EC2::SecurityGroup",
        Properties: {
          GroupDescription: {
            "Fn::Sub": "SSH security group for ${AWS::StackName}",
          },
        },
      },
    },
  },
  {
    // Fn::Sub with a key-value map
    yaml: `WWWBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub
      - 'www.\${Domain}'
      - Domain: !Ref RootDomainName
`,
    json: {
      WWWBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: {
            "Fn::Sub": ["www.${Domain}", { Domain: { Ref: "RootDomainName" } }],
          },
        },
      },
    },
  },
  {
    // Use multiple variables to construct ARNs
    yaml: `!Sub 'arn:aws:ec2:\${AWS::Region}:\${AWS::AccountId}:vpc/\${vpc}'
`,
    json: {
      "Fn::Sub": "arn:aws:ec2:${AWS::Region}:${AWS::AccountId}:vpc/${vpc}",
    },
  },
  {
    // Specify conditional values using mappings
    yaml: `Mappings:
  LogGroupMapping:
    Test:
      Name: test_log_group
    Prod:
      Name: prod_log_group
Resources:
  myLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub
        - 'cloud_watch_\${log_group_name}'
        - log_group_name: !FindInMap
            - LogGroupMapping
            - Test
            - Name
`,
    json: {
      Mappings: {
        LogGroupMapping: {
          Test: { Name: "test_log_group" },
          Prod: { Name: "prod_log_group" },
        },
      },
      Resources: {
        myLogGroup: {
          Type: "AWS::Logs::LogGroup",
          Properties: {
            LogGroupName: {
              "Fn::Sub": [
                "cloud_watch_${log_group_name}",
                {
                  log_group_name: {
                    "Fn::FindInMap": ["LogGroupMapping", "Test", "Name"],
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
];
