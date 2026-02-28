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
  // Simultaneous combos
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

  // Nav layer: physical left Cmd sets nav variable AND passes Cmd through.
  // Nav keys consume Cmd; non-nav keys get normal Cmd behavior.
  // Use HRM (F/J) for Cmd shortcuts that overlap with nav (Cmd+C, Cmd+S, etc.)
  rule('Nav Layer').condition(builtIn).manipulators([
    map('left_command')
      .to(toSetVar('nav_layer', 1))
      .to('left_command')
      .toAfterKeyUp(toSetVar('nav_layer', 0))
      .toIfAlone('escape'),
    map('h', 'command', 'any').condition(navActive).to('left_arrow'),
    map('j', 'command', 'any').condition(navActive).to('down_arrow'),
    map('k', 'command', 'any').condition(navActive).to('up_arrow'),
    map('l', 'command', 'any').condition(navActive).to('right_arrow'),
    map('u', 'command', 'any').condition(navActive).to('page_down'),
    map('i', 'command', 'any').condition(navActive).to('page_up'),
    map('s', 'command').condition(navActive).to('up_arrow', 'control'),
    map('d', 'command').condition(navActive).to('left_arrow', 'control'),
    map('f', 'command').condition(navActive).to('right_arrow', 'control'),
    map('m', 'command').condition(navActive).to('open_bracket', 'command | shift'),
    map(',', 'command').condition(navActive).to('close_bracket', 'command | shift'),
  ]),

  // Disable Cmd+H (hide) and Cmd+Opt+H (hide others) globally
  // Must be after Nav Layer so Cmd+H -> left arrow works when nav is active
  rule('Disable Cmd+H').manipulators([
    map('h', 'command').to('vk_none'),
    map('h', 'command | option').to('vk_none'),
  ]),

  // Caps Word: a+; toggles, deactivates on space/enter/escape/comma/period/slash/shifts
  // Uses actual Caps Lock under the hood, doesn't conflict with HRM
  capsWord()
    .toggle(mapSimultaneous(['a', ';'], { key_up_when: 'any' }).condition(builtIn).build()[0])
    .build(),

  // Home row mods
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
