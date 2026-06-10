# yaml-types-cfn

AWS Cloudformation Template types for [`yaml`](https://github.com/eemeli/yaml). Allows the parsing of intrinsic function tags in yaml cloudformation templates.

## Installation and Usage

```sh
npm install yaml yaml-types-cfn
```

```ts
import { parse } from 'yaml'
import { GetAtt } from 'yaml-types-cfn'

const templateYaml = `
Foo: !GetAtt Bar.Baz
`

const template = parse(templateYaml, { customTags: [GetAtt] })

console.log(template)

/*
{
  "Foo": {
    "Fn::GetAtt": [
      "logicalNameOfResource",
      "attributeName"
    ]
  }
}
*/
```

## Supported Types

<https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference.html>

All intrinsic functions which have a yaml short form.
