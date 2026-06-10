export const Split = [
  {
    // Simple list - returns ["a", "b", "c"]
    yaml: `!Split [ "|" , "a|b|c" ]
`,
    json: { "Fn::Split": ["|", "a|b|c"] },
  },
  {
    // List with empty string values - returns ["a", "", "c", ""]
    yaml: `!Split [ "|" , "a||c|" ]
`,
    json: { "Fn::Split": ["|", "a||c|"] },
  },
  {
    // Split an imported output value and select element
    yaml: `!Select [2, !Split [",", !ImportValue AccountSubnetIDs]]
`,
    json: {
      "Fn::Select": [
        2,
        { "Fn::Split": [",", { "Fn::ImportValue": "AccountSubnetIDs" }] },
      ],
    },
  },
];
