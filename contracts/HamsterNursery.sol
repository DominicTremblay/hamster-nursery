// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import 'hardhat/console.sol';

contract HamsterNursery {
  enum ColorType {
    golden,
    beige,
    brown,
    black,
    blonde,
    chocolate,
    cream,
    dove,
    grey,
    lilac,
    sable,
    mink,
    rust,
    white
  }
  enum PatternType {
    banded,
    dominantspot,
    tortoiseshell,
    recessivedappled,
    cinnamon
  }

  // creating the Hamster type
  struct Hamster {
    string name;
    ColorType color;
    PatternType pattern;
  }

  // declare a dynamic array of hamsters
  Hamster[] public hamsters;

  function _createHamster(string memory _name, ColorType _color, PatternType _pattern) private {
    // create a new hamster
    Hamster memory newHamster = Hamster(_name, _color, _pattern);
    hamsters.push(newHamster);
  }
}
