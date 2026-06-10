import { Base64 } from "./Base64";
import { Base64Collection } from "./Base64Collection";
import { GetAtt } from "./GetAtt";

export const customTags = [Base64, Base64Collection, GetAtt];

export function shuffle<T>(array: T[]) {
  for (let index = 0; index < array.length; index++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}
