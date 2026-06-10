export const Transform = [
  {
    // Call the AWS::Include transform
    yaml: `Fn::Transform:
  Name: AWS::Include
  Parameters:
    Location: !Ref InputValue
`,
    json: {
      "Fn::Transform": {
        Name: "AWS::Include",
        Parameters: { Location: { Ref: "InputValue" } },
      },
    },
  },
];
