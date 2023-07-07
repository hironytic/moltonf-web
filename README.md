# Moltonf (Web)

![Moltonf](public/moltonf.svg)

Moltonf is a log viewer for Jinro BBS

https://hironytic.github.io/moltonf-web/

## Features

### Watch the play data from a participant's point of view

Until you press the button to the next day, later days will not be displayed. You can't know whether the game will end or continue, especially near the end of the log data, so you can excite as if you were participating in real time.

The system deciedes the character according to the your pre-selected roll, just a villager, seer, shaman, wolf, etc., and only the information visible from thet character's perspective is displayed. For example, if the character is a wolf, the whispers, a.k.a. red logs, of his/her companions will be displayed, but not if the character is a villager. This allows you to watch the play data as if you were actually participating in it as a player, while avoiding spoilers.

### Works within your browser

Works with JavaScript within your browser. The logs you select and watching status will be stored in storage on your local computer managed by your browser. The data is not uploaded to the server.

### The logs are XML files

The logs are XML files that structures are defined as "[Jindolf XML Scheme](https://osdn.net/projects/jindolf/scm/git/XmlScheme)". You need to obtain the log that you wish to watch in advance.

## How to run

First, you need to install dependencies.

```sh
npm install
```

Next execute the following command to start debug:

```sh
npm run dev
```

The local server will start on port 5050. Open the URL displayed in the console in your browser.
