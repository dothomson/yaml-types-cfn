export const ImportValue = [
  {
    // Stack A export with Fn::Sub and Fn::GetAtt
    yaml: `Outputs:
  PublicSubnet:
    Description: The subnet ID to use for public web servers
    Value:
      Ref: PublicSubnet
    Export:
      Name:
        'Fn::Sub': '\${AWS::StackName}-SubnetID'
  WebServerSecurityGroup:
    Description: The security group ID to use for public web servers
    Value:
      'Fn::GetAtt':
        - WebServerSecurityGroup
        - GroupId
    Export:
      Name:
        'Fn::Sub': '\${AWS::StackName}-SecurityGroupID'
`,
    json: {
      Outputs: {
        PublicSubnet: {
          Description: "The subnet ID to use for public web servers",
          Value: { Ref: "PublicSubnet" },
          Export: { Name: { "Fn::Sub": "${AWS::StackName}-SubnetID" } },
        },
        WebServerSecurityGroup: {
          Description: "The security group ID to use for public web servers",
          Value: { "Fn::GetAtt": ["WebServerSecurityGroup", "GroupId"] },
          Export: { Name: { "Fn::Sub": "${AWS::StackName}-SecurityGroupID" } },
        },
      },
    },
  },
  {
    // Fn::ImportValue with !Sub
    yaml: `Fn::ImportValue:
  !Sub "\${NetworkStackName}-SecurityGroupID"
`,
    json: {
      "Fn::ImportValue": { "Fn::Sub": "${NetworkStackName}-SecurityGroupID" },
    },
  },
];
