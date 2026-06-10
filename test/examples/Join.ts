export const Join = [
  {
    // Join a simple string array - returns "a:b:c"
    yaml: `!Join [ ":", [ a, b, c ] ]
`,
    json: { "Fn::Join": [":", ["a", "b", "c"]] },
  },
  {
    // Join using Ref with parameters
    yaml: `!Join
  - ''
  - - 'arn:'
    - !Ref AWS::Partition
    - ':s3:::elasticbeanstalk-*-'
    - !Ref AWS::AccountId
`,
    json: {
      "Fn::Join": [
        "",
        [
          "arn:",
          { Ref: "AWS::Partition" },
          ":s3:::elasticbeanstalk-*-",
          { Ref: "AWS::AccountId" },
        ],
      ],
    },
  },
];
