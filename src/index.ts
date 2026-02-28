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
const capsWordActive = ifVar('caps_word', 1);

writeToProfile('Default', [
  // Simultaneous combos
  rule('Combos').condition(builtIn).manipulators([
    mapSimultaneous(['f', 'j', 'k', 'l'], { key_up_when: 'any' }).to('⏎', '⌘'),
    mapSimultaneous(['a', 'j', 'k', 'l'], { key_up_when: 'any' }).to('⏎', '⇧'),
    mapSimultaneous(['q', 'w'], { key_up_when: 'any' }).to('⎋'),
    mapSimultaneous(['a', 's'], { key_up_when: 'any' }).to('⇥'),
    mapSimultaneous(['j', 'k', 'l'], { key_up_when: 'any' }).to('⏎'),
    mapSimultaneous(['l', ';'], { key_up_when: 'any' }).to('⌫'),
    mapSimultaneous(['j', 'k'], { key_up_when: 'any' }).to('←', '⌥'),
    mapSimultaneous(['k', 'l'], { key_up_when: 'any' }).to('→', '⌥'),
    mapSimultaneous(['a', ';'], { key_up_when: 'any' }).to(toSetVar('caps_word', 1)),
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

  // Disable Cmd+H (hide) and Cmd+Opt+H (hide others) globally
  // Must be after Nav Layer so Cmd+H → left arrow works when nav is active
  rule('Disable Cmd+H').manipulators([
    map('h', '⌘').to('vk_none'),
    map('h', '⌘⌥').to('vk_none'),
  ]),

  // Caps Word: a+; activates, break keys deactivate, letters produce shift+letter
  rule('Caps Word').condition(builtIn).manipulators([
    ...['spacebar', '⏎', '⇥', '⎋', '⌫'].map(key =>
      map(key as any).condition(capsWordActive)
        .to(toSetVar('caps_word', 0))
        .to(key as any)
    ),
    ...'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
      map(letter as any).condition(capsWordActive)
        .to(letter as any, '⇧')
    ),
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
      .holdTapStrategy("permissive-hold")
      .build()
  ),
])
