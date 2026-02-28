import {
  ifDevice,
  ifVar,
  map,
  mapSimultaneous,
  rule,
  toSetVar,
  writeToProfile,
} from 'karabiner.ts'
import { capsWord, hrm } from "karabiner.ts-greg-mods";

const builtIn = ifDevice({ is_built_in_keyboard: true });
const navActive = ifVar('nav_layer', 1);

writeToProfile('Default', [
  rule('Remap kes').condition(builtIn).manipulators([
    map('spacebar', 'command').to('spacebar', 'control'),
  ]),

  rule('Combos').condition(builtIn).manipulators([
    mapSimultaneous(['f', 'j', 'k', 'l'], { key_up_when: 'any' }).to('return_or_enter', 'command'),
    mapSimultaneous(['a', 'j', 'k', 'l'], { key_up_when: 'any' }).to('return_or_enter', 'shift'),
    mapSimultaneous(['q', 'w'], { key_up_when: 'any' }).to('escape'),
    mapSimultaneous(['a', 's'], { key_up_when: 'any' }).to('tab'),
    mapSimultaneous(['j', 'k', 'l'], { key_up_when: 'any' }).to('return_or_enter'),
    mapSimultaneous(['l', ';'], { key_up_when: 'any' }).to('delete_or_backspace'),
    mapSimultaneous(['j', 'k'], { key_up_when: 'any' }).to('left_arrow', 'option'),
    mapSimultaneous(['k', 'l'], { key_up_when: 'any' }).to('right_arrow', 'option'),
    mapSimultaneous(['j', 'l'], { key_up_when: 'any' }).to('delete_or_backspace'),
  ]),

  rule('Nav Layer').condition(builtIn).manipulators([
    map('␣')
       .toIfAlone('␣')
      .to(toSetVar('nav_layer', 1))
      .toAfterKeyUp(toSetVar('nav_layer', 0)),
    map('h').condition(navActive).to('left_arrow'),
    map('j').condition(navActive).to('down_arrow'),
    map('k').condition(navActive).to('up_arrow'),
    map('l').condition(navActive).to('right_arrow'),
    map('u').condition(navActive).to('page_down'),
    map('i').condition(navActive).to('page_up'),
    map('s').condition(navActive).to('up_arrow', 'control'),
    map('d').condition(navActive).to('left_arrow', 'control'),
    map('f').condition(navActive).to('right_arrow', 'control'),
    map('c').condition(navActive).to('open_bracket', '⌘'),
    map('v').condition(navActive).to('close_bracket', '⌘'),
    map('m').condition(navActive).to('open_bracket', '⌘⇧'),
    map(',').condition(navActive).to('close_bracket', '⌘⇧'),
  ]),

  rule('Disable Cmd+H').manipulators([
    map('h', 'command').to('vk_none'),
    map('m', 'command').to('vk_none'),
    map('h', 'command | option').to('vk_none'),
  ]),

  capsWord()
    .toggle(mapSimultaneous(['a', ';'], { key_up_when: 'any' }).condition(builtIn).build()[0])
    .build(),

  rule("Home row mods").condition(builtIn).manipulators(
    hrm(
      new Map([
        ["a", "left_shift"],
        ["s", "left_control"],
        ["d", "left_option"],
        ["f", "left_command"],
        [";", "right_shift"],
        ["j", "right_command"],
        ["k", "right_option"],
        ["l", "right_control"],
      ])
    )
      .holdTapStrategy("permissive-hold")
      .build()
  ),
])
