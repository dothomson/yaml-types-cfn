# yaml-types-cfn

AWS CloudFormation template tag types for [`yaml`](https://github.com/eemeli/yaml). Enables parsing of YAML intrinsic function short-form tags in CloudFormation templates.

> **Requires Node.js ≥ 18 and `yaml` v2 (ESM only)**

## Installation

```sh
npm install yaml yaml-types-cfn
```

## Usage

Import individual tags or `customTags` (all tags) and pass them to `yaml`'s `parse`:

```ts
import { parse } from 'yaml'
import { customTags } from 'yaml-types-cfn'

const templateYaml = `---
MyBucket: !Ref BucketParam
MyArn: !Sub 'arn:aws:s3:::\${BucketParam}'
AZ: !Select [0, !GetAZs '']
`

const template = parse(templateYaml, { customTags })

console.log(template)
/*
{
  MyBucket: { Ref: 'BucketParam' },
  MyArn: { 'Fn::Sub': 'arn:aws:s3:::${BucketParam}' },
  AZ: { 'Fn::Select': [ 0, { 'Fn::GetAZs': '' } ] }
}
*/
```

Or import individual tags when you only need a subset:

```ts
import { parse } from 'yaml'
import { GetAtt, Sub } from 'yaml-types-cfn'
import type { Tag } from 'yaml'

const templateYaml = `---
DNSName: !GetAtt myELB.DNSName
ARN: !Sub 'arn:aws:elasticloadbalancing:::\${myELB}'
`

const template = parse(templateYaml, { customTags: [...GetAtt, ...Sub] })

console.log(template)

/*
{
  DNSName: { 'Fn::GetAtt': [ 'myELB', 'DNSName' ] },
  ARN: { 'Fn::Sub': 'arn:aws:elasticloadbalancing:::${myELB}' }
}
*/
```

## Supported tags

All intrinsic functions with a YAML short form, per the [AWS CloudFormation documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference.html):

| Export        | Tag              | CloudFormation key |
| ------------- | ---------------- | ------------------ |
| `Base64`      | `!Base64`        | `Fn::Base64`       |
| `Cidr`        | `!Cidr`          | `Fn::Cidr`         |
| `FindInMap`   | `!FindInMap`     | `Fn::FindInMap`    |
| `GetAtt`      | `!GetAtt`        | `Fn::GetAtt`       |
| `GetAZs`      | `!GetAZs`        | `Fn::GetAZs`       |
| `If`          | `!If`            | `Fn::If`           |
| `ImportValue` | `!ImportValue`   | `Fn::ImportValue`  |
| `Join`        | `!Join`          | `Fn::Join`         |
| `Select`      | `!Select`        | `Fn::Select`       |
| `Split`       | `!Split`         | `Fn::Split`        |
| `Sub`         | `!Sub`           | `Fn::Sub`          |
| `Transform`   | `!Transform`     | `Fn::Transform`    |
| `And`         | `!And`           | `Fn::And`          |
| `Equals`      | `!Equals`        | `Fn::Equals`       |
| `Not`         | `!Not`           | `Fn::Not`          |
| `Or`          | `!Or`            | `Fn::Or`           |
| `Ref`         | `!Ref`           | `Ref`              |
| `Condition`   | `!Condition`     | `Condition`        |
| `customTags`  | all of the above | —                  |

## License

MIT
