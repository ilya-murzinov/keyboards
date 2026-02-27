import {
  ifDevice,
  ifVar,
  map,
  mapSimultaneous,
  rule,
  toSetVar,
  writeToProfile,
} from 'karabiner.ts'
import { hrm } from "karabiner.ts-greg-mods";

const builtIn = ifDevice({ is_built_in_keyboard: true });
const navActive = ifVar('nav_layer', 1);

writeToProfile('Default', [
  // Simultaneous combos
  rule('Combos').condition(builtIn).manipulators([
    mapSimultaneous(['q', 'w'], { key_up_when: 'any' }).to('⎋'),
    mapSimultaneous(['a', 's'], { key_up_when: 'any' }).to('⇥'),
    mapSimultaneous(['j', 'k', 'l'], { key_up_when: 'any' }).to('⏎'),
    mapSimultaneous(['l', ';'], { key_up_when: 'any' }).to('⌫'),
    mapSimultaneous(['j', 'k'], { key_up_when: 'any' }).to('←', '⌥'),
    mapSimultaneous(['k', 'l'], { key_up_when: 'any' }).to('→', '⌥'),
    mapSimultaneous(['a', ';'], { key_up_when: 'any' }).to('⇪'),
    mapSimultaneous(['j', 'l'], { key_up_when: 'any' }).to('⌫'),
  ]),

  // Nav layer: physical left Cmd sets nav variable AND passes Cmd through.
  // Nav keys consume Cmd; non-nav keys get normal Cmd behavior.
  // Use HRM (F/J) for Cmd shortcuts that overlap with nav (Cmd+C, Cmd+S, etc.)
  rule('Nav Layer').condition(builtIn).manipulators([
    map('left_command')
      .to(toSetVar('nav_layer', 1))
      .to('left_command')
      .toAfterKeyUp(toSetVar('nav_layer', 0))
      .toIfAlone('⎋'),
    map('h', '⌘', 'any').condition(navActive).to('←'),
    map('j', '⌘', 'any').condition(navActive).to('↓'),
    map('k', '⌘', 'any').condition(navActive).to('↑'),
    map('l', '⌘', 'any').condition(navActive).to('→'),
    map('u', '⌘', 'any').condition(navActive).to('page_down'),
    map('i', '⌘', 'any').condition(navActive).to('page_up'),
    map('s', '⌘').condition(navActive).to('↑', '⌃'),
    map('d', '⌘').condition(navActive).to('←', '⌃'),
    map('f', '⌘').condition(navActive).to('→', '⌃'),
    map('m', '⌘').condition(navActive).to('[', '⌘⇧'),
    map(',', '⌘').condition(navActive).to(']', '⌘⇧'),
  ]),

  // Home row mods
  rule("Home row mods").condition(builtIn).manipulators(
    hrm(
      new Map([
        ["a", "l⇧"],
        ["s", "l⌃"],
        ["d", "l⌥"],
        ["f", "l⌘"],
        [";", "r⇧"],
        ["j", "r⌘"],
        ["k", "r⌥"],
        ["l", "r⌃"],
      ])
    )
      .lazy(true)
      .holdTapStrategy("permissive-hold")
      .chordalHold(true)
      .build()
  ),
])