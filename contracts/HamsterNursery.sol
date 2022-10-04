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

  constructor() {
    createHamster('Bubbles', ColorType.brown, PatternType.banded);
    createHamster('Fluffy', ColorType.cream, PatternType.cinnamon);
  }

  function getCount() public view returns (uint256) {
    return hamsters.length;
  }

  function createHamster(
    string memory _name,
    ColorType _color,
    PatternType _pattern
  ) public {
    // create a new hamster
    Hamster memory newHamster = Hamster(_name, _color, _pattern);
    hamsters.push(newHamster);
  }

  // get the hamsters
  function getHamsters() public view returns (Hamster[] memory) {
    return hamsters;
  }

  function multiplyHamster(Hamster memory hamster1, Hamster memory hamster2)
    public
    payable
  {

    require(msg.value >= 0.05 ether, "Please send at least 0.05 ETH");

    // creating a new color based on hamster1 and hamster2
    uint8 color1 = uint8(hamster1.color);
    uint8 color2 = uint8(hamster2.color);
    uint8 colorLength = uint8(type(ColorType).max) + 1;
    uint8 offSringcolor = (color1 + color2) % colorLength;

    //creating a new pattern based on hamster1 and hamster2
    uint8 pattern1 = uint8(hamster1.pattern);
    uint8 pattern2 = uint8(hamster2.pattern);
    uint8 patternLength = uint8(type(PatternType).max) + 1;
    uint8 offsringPattern = (pattern1 + pattern2) % patternLength;

    // create the offspring
    createHamster(
      string.concat(hamster1.name, hamster2.name),
      ColorType(offSringcolor),
      PatternType(offsringPattern)
    );
  }
}
