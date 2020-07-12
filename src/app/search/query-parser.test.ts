import { parseQuery, lexer, Token } from './query-parser';

// To update the snapshots, run:
// npx jest --updateSnapshot src/app/search/query-parser.test.ts

// TODO: explicit "and" should have higher precedence than "or", but implicit "and" should have *lower* precedence than "or"
// TODO: test "not not not", nested parens, etc
// TODO: failed parse - a failed parse should return the parts that didn't fail plus an error code??

// Some of these are contrived, some are from past search parsing issues
const cases = [
  ['is:blue is:haspower -is:maxpower'],
  ['is:blue is:haspower not:maxpower'],
  ['not not:maxpower'],
  ['-is:equipped is:haspower is:incurrentchar'],
  ['-source:garden -source:lastwish sunsetsafter:arrival'],
  ['-is:exotic -is:locked -is:maxpower -is:tagged stat:total:<55'],
  ['(is:weapon is:sniperrifle) or (is:armor modslot:arrival)'],
  ['(is:weapon and is:sniperrifle) or not (is:armor and modslot:arrival)'],
  ['is:weapon and is:sniperrifle or not is:armor and modslot:arrival'], // => is:weapon (is:sniperrifle or -is:armor) modslot:arrival
  ['-(power:>1000 and -modslot:arrival)'],
  ['( power:>1000 and -modslot:arrival ) '],
  ['- is:exotic - (power:>1000)'],
  ['is:armor2.0'],
  ['not forgotten'], // => -"forgotten"
  ['cluster tracking'], // => "cluster" and "tracking"
  ['name:"Hard Light"'],
  ["name:'Hard Light'"],
  ['name:"Gahlran\'s Right Hand"'],
  ['-witherhoard'],
  ['perk:수집가'],
  ['perk:"수집가"'],
  ['"수집가"'],
  ['수집가'],
  ['is:rocketlauncher -"cluster" -"tracking module"'],
  ['is:rocketlauncher -"cluster" -\'tracking module\''],
  ['is:rocketlauncher (perk:"cluster" or perk:"tracking module")'],
  ['(is:hunter power:>=540) or (is:warlock power:>=560)'],
  ['"grenade launcher reserves"'],
  // These test copy/pasting from somewhere that automatically converts quotes to "smart quotes"
  ['“grenade launcher reserves”'],
  ['‘grenade launcher reserves’'],
];

test.each(cases)('parse |%s|', (query) => {
  // Test just the lexer
  const tokens: Token[] = [];
  for (const t of lexer(query)) {
    tokens.push(t);
  }
  expect(tokens).toMatchSnapshot('lexer');

  // Test the full parse tree
  const ast = parseQuery(query);
  expect(ast).toMatchSnapshot('ast');
});
