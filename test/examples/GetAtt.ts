export const GetAtt = [
  {
    // Return an attribute value (full function form)
    yaml: `Fn::GetAtt:
  - myELB
  - DNSName
`,
    json: { "Fn::GetAtt": ["myELB", "DNSName"] },
  },
  {
    // Return multiple attribute values (short form with dotted attribute)
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Resources:
  myELB:
    Type: AWS::ElasticLoadBalancing::LoadBalancer
    Properties:
      AvailabilityZones:
        - eu-west-1a
      Listeners:
        - LoadBalancerPort: '80'
          InstancePort: '80'
          Protocol: HTTP
  myELBIngressGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: ELB ingress group
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          SourceSecurityGroupOwnerId: !GetAtt myELB.SourceSecurityGroup.OwnerAlias
          SourceSecurityGroupName: !GetAtt myELB.SourceSecurityGroup.GroupName
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Resources: {
        myELB: {
          Type: "AWS::ElasticLoadBalancing::LoadBalancer",
          Properties: {
            AvailabilityZones: ["eu-west-1a"],
            Listeners: [
              { LoadBalancerPort: "80", InstancePort: "80", Protocol: "HTTP" },
            ],
          },
        },
        myELBIngressGroup: {
          Type: "AWS::EC2::SecurityGroup",
          Properties: {
            GroupDescription: "ELB ingress group",
            SecurityGroupIngress: [
              {
                IpProtocol: "tcp",
                FromPort: 80,
                ToPort: 80,
                SourceSecurityGroupOwnerId: {
                  "Fn::GetAtt": ["myELB", "SourceSecurityGroup.OwnerAlias"],
                },
                SourceSecurityGroupName: {
                  "Fn::GetAtt": ["myELB", "SourceSecurityGroup.GroupName"],
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    // Use Fn::Sub inside Fn::GetAtt (AWS::LanguageExtensions transform)
    yaml: `AWSTemplateFormatVersion: 2010-09-09
Transform: AWS::LanguageExtensions
Mappings:
  Buckets:
    Properties:
      Identifiers:
        - A
        - B
        - C
Resources:
  'Fn::ForEach::Buckets':
    - Identifier
    - Fn::FindInMap:
      - Buckets
      - Properties
      - Identifiers
    - 'S3Bucket\${Identifier}':
        Type: AWS::S3::Bucket
        Properties:
          AccessControl: PublicRead
          MetricsConfigurations:
            - Id:
                Fn::Sub: 'EntireBucket\${Identifier}'
          WebsiteConfiguration:
            IndexDocument: index.html
            ErrorDocument: error.html
            RoutingRules:
              - RoutingRuleCondition:
                  HttpErrorCodeReturnedEquals: '404'
                  KeyPrefixEquals: out1/
                RedirectRule:
                  HostName: ec2-11-22-333-44.compute-1.amazonaws.com
                  ReplaceKeyPrefixWith: report-404/
        DeletionPolicy: Retain
        UpdateReplacePolicy: Retain
Outputs:
  'Fn::ForEach::BucketOutputs':
    - Identifier
    - Fn::FindInMap:
      - Buckets
      - Properties
      - Identifiers
    - 'Fn::ForEach::GetAttLoop':
        - Property
        - - Arn
          - DomainName
          - WebsiteURL
        - 'S3Bucket\${Identifier}\${Property}':
            Value: !GetAtt
              - !Sub 'S3Bucket\${Identifier}'
              - !Ref Property
`,
    json: {
      AWSTemplateFormatVersion: "2010-09-09",
      Transform: "AWS::LanguageExtensions",
      Mappings: { Buckets: { Properties: { Identifiers: ["A", "B", "C"] } } },
      Resources: {
        "Fn::ForEach::Buckets": [
          "Identifier",
          { "Fn::FindInMap": ["Buckets", "Properties", "Identifiers"] },
          {
            "S3Bucket${Identifier}": {
              Type: "AWS::S3::Bucket",
              Properties: {
                AccessControl: "PublicRead",
                MetricsConfigurations: [
                  { Id: { "Fn::Sub": "EntireBucket${Identifier}" } },
                ],
                WebsiteConfiguration: {
                  IndexDocument: "index.html",
                  ErrorDocument: "error.html",
                  RoutingRules: [
                    {
                      RoutingRuleCondition: {
                        HttpErrorCodeReturnedEquals: "404",
                        KeyPrefixEquals: "out1/",
                      },
                      RedirectRule: {
                        HostName: "ec2-11-22-333-44.compute-1.amazonaws.com",
                        ReplaceKeyPrefixWith: "report-404/",
                      },
                    },
                  ],
                },
              },
              DeletionPolicy: "Retain",
              UpdateReplacePolicy: "Retain",
            },
          },
        ],
      },
      Outputs: {
        "Fn::ForEach::BucketOutputs": [
          "Identifier",
          { "Fn::FindInMap": ["Buckets", "Properties", "Identifiers"] },
          {
            "Fn::ForEach::GetAttLoop": [
              "Property",
              ["Arn", "DomainName", "WebsiteURL"],
              {
                "S3Bucket${Identifier}${Property}": {
                  Value: {
                    "Fn::GetAtt": [
                      { "Fn::Sub": "S3Bucket${Identifier}" },
                      { Ref: "Property" },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  },
];
