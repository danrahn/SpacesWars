This originally was a userscript created by NiArK for the games SpacesWars (SpacesWars.com). I have since expanded upon it, but the combination of the unmaintainability of the original and my lack of planning has turned it into an entirely new beast.

Watch me attempt to make this Tampermonkey script monstrosity somewhat manageable

Some of my original release notes can be found here: http://spaceswars.com/forum/viewtopic.php?f=167&t=13416 (and a longish youtube video laying out the state of the script 2 years ago here: https://youtu.be/vMoggQTAbmU)

# SpacesWars Scripts

These javascript files contain a collection of scripts that enhance the user experience of SpacesWars. Navigation is improved, handy shortcuts are provided, and helpful information is shown to the user.

## Configurable Scripts

### RConverter

Parses combat reports and generates a nice report that can be pasted into a bb forum. You can set custom icons for different sections of the report in the configuration page. This script is largely unchanged from the original, and I have only tweaked it to ensure it continues to function

### EasyFarm

EasyFarm's main function is to highlight espionage reports if they meet the user-defined loot cutoffs. In the spy reports, those that match the criteria will be highlighted with the user-defined colors, and any reports that do not meet the standards will be selected, allowing for easy deletion.

A tooltip is also displayed inline with the spy report, and hovering will give a rundown of the ships, defense, and possible loot, without having to expand the entire report. When the report is expanded, new text is displayed at the bottom indicating the number of Massive Cargos needed to capture the possible loot, and how many waves of attacks are needed before he looting level goes below the threshold.

### AllinDeut

This script works on the buildings and research page, and shows the total cost of a building/research in deut only. For example, if a building costs 8000 metal, 4000 crystal, and 2000 deut, AllinDeut will show 6000, as there is a 4:2:1 trading ratio.

### IFly

On the overview page, the tooltip that appears by hovering over the [i] next to the planet selector will have a new section that shows how many resources (in deut) are currently being flown.

### TChatty

"Better Chat". Allows one to easily change chat color, adjusts smileys, and prevents sending coordinates, which is against game rules.

### InactiveStats

Show if a player is inactive/long inactive in the statistics page. Gets the data when the user is in galaxy view, so is only as up to date as the last time you came across a given user in the galaxy.

### EasyTarget

A replacement for Carto, which stored galaxy information on a separate server that is now dead. This keeps a local copy of galaxy data that automatically updates as you scan the galaxy, and displays the known information on a player in galaxy view. Hovering over the new target icon in galaxy view will display a tooltip that indicates all the known locations of a player. Clicking on the player's row will show another list of all the locations, and clicking a location will navigate to that spot. It also allows for easy navigation. Once a player is selected (green outline), pressing N will take you to their next location, and P to the previous one.

You can also import/export galaxy data in the configuration page. If you have data on one machine that you want to transfer to another, you can export/import it to stay in sync.

### NoAutoComplete

It can often be annoying to start typing and have a huge dropdown of previous entries displayed. NoAutoComplete prevents those dropdowns from appearing on a configurable page-by-page basis.

### Markit

Mark planets in the galaxy with a user-defined color. Clicking on the target in galaxy mode will bring up a dialog that lets the user select the color to display.

### GalaxyRanks

Display and color a user's rank directly in galaxy view to quickly measure a player. Configure the color and rank thresholds in the configuration page.

### BetterEmpire

Change empire view such that moons are listed last, and the totals column is first.

### FleetPoints

May have to remove, as I've been told it breaks the game rules. By default, one can only see the number of ships a player has, not the value of their fleet. The value can be discovered easily enough though by subtracting the value of the other categories by their total score (total - buildings - defenses - research = fleet). This script scans and saves the values found in the stats page and creates a new "Fleet Points" category that a user can select and determine the value of a user's fleet. The user also gets a notification if not all the values are up to date.

### More

These are smaller scripts that aren't configurable other than on/off.

#### MoonsList

Marks moons blue in the planet selector

#### ConvertDeut

Creates three links at the top of the merchant page that allows a user to quickly convert all resources to metal/crystal/deut.

#### Traductor

Translator. I don't actually know if it works, as I've never tried it.

#### Resources

Quickly set all production percentages in the production page.

#### RedirectFleet

Quickly redirect back to the main fleet page after a fleet is sent

#### Arrows

Change the planet selection arrows from "<"/">" to "<<<<<"/">>>>>" to make them easier to click

#### Returns

Add transparency to return fleets in the overview

#### DeutRow

Add a row in the header that indicates the total amount of resources in deut

#### ConvertClick

Clicking on the metal/crystal/deut values in the header will instantly convert all resources to that one.

#### mcTransport

More experimental, and highly tailored to U17 speed/uni multipliers. In the fleet menu, adds an option to select the number of massive cargos needed to transport all the resources currently on the planet.


## Other non-configurable (for now) options:

### Click and Convert

Click on the image of any building, research, ship, or defense to instantly convert your resources to the ratio that maximizes the possible output of the selected item.

### Keyboard shortcuts/navigation

On pages where you use 2+ character combinations, pressing ESC will clear the current queue, allowing you to start over if something gets messed up.

#### Global

 * `SHIFT + O` : Overview
 * `SHIFT + G` : Galaxy
 * `SHIFT + F` : Fleet
 * `SHIFT + E` : Empire
 * `SHIFT + B` : Buildings
 * `SHIFT + R` : Research
 * `SHIFT + D` : Defense
 * `HIFT + M` : Messages
 * `[` : Previous Planet/Moon
 * `]` : Next Planet/Moon
 
 #### Messages
 
 * Categories
     * `S` : eSpionage
     * `P` : Player
     * `A` : Alliance
     * `C` : Combat
     * `H` : Harvest
     * `T` : Transport
     * `E` : Expedition
     * `M` : Missiles
     * `L` : alL
 * Message Navigation
     * `Tab`/`Down Arrow` : Focus next message
     * `HIFT + Tab`/`Up Arrow` : Focus previous message
     * `Right Arrow` : Expand Message
     * `Left Arrow` : Collapse Message
 * Message Management
     * `X` : Check/Uncheck Message
     * `DM` : Delete Marked
     * `DU` : Delete Unmarked
     * `DP` : Delete Page
     * `DA` : Delete All
 
 
#### Shipyard and Defenses

The following two-character combos will bring you to the specified item. If it can't find it, a message will appear saying as much.

* Shipyard
  * `SC` : Small Cargo
  * `LC` : Large Cargo
  * `LF` : Light Fighter
  * `HF` : Heavy Fighter
  * `CR` : CRuiser
  * `BS` : BattleShip
  * `CS` : Colony Ship
  * `RE` : REcycler
  * `EP` : Espionage Probe
  * `BM` : BoMber
  * `SS` : Solar Satellite
  * `DE` : DEstroyer
  * `DS` : DeathStar
  * `SN` : SuperNova
  * `MC` : Massive Cargo
  * `HR` : Heavy Recycler
  * `BL` : BLast
  * `EX` : EXtractor
 * Defenses
   * `RL` : Rocket Launcher
   * `LL` : Light Laser
   * `HL` : Heavy Laser
   * `GC` : Guass Cannon
   * `IC` : Ion Cannon
   * `PT` : Plasma Turret
   * `SD` : Small Shield Dome
   * `LD` : Large Shield Dome
   * `AB` : Anti-Ballastic Missiles
   * `IP` : InterPlanetary Missiles
   
#### Fleet Pages

 * Fleet (fleet.php)
   * `A` : Select all of the selected ship
   * `X` : Select none of the selected ship
   * `Up`/`Down Arrow` : Navigate to the next/previous ship
   * `T` : Select the mcTransport calculated number of Massive Cargos (if enabled)
 * Fleet 1 (floten1.php)
   * `N` : Select the last travelled location and continue sending the fleet
 * Fleet 2 (floten2.php)
   * `A` : Select all resosurces
   * `N` : Select all Deut
   * `S` : Submit/Send fleet
   
  ### Other
  There are other undocumented features as well, but until they are entirely fleshed out, I won't be adding a description.