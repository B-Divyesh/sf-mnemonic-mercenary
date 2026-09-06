# Demo sandbox

- **URL:** `https://mnemonic-mercenary.sociobot.in/demo` or `/?demo=1`
- **Sample:** a realistic mid-run snapshot: fight 3 of 6, 4/6 health, a Brass
  compass relic, and two previous fights recorded. The seed is `field-204`.
- **Persistent label:** `Demo — sample data, nothing is saved.` remains visible
  throughout demo play and provides **Reset demo** and **Start for real**.
- **Storage isolation:** demo state uses only `demo:mnemonic-mercenary:run` and
  `demo:mnemonic-mercenary:settings`. Real play uses
  `mnemonic-mercenary:run` and `mnemonic-mercenary:settings`. Demo code never
  reads or writes the real names.
- **Reset:** Reset demo restores the fight-3 snapshot. Starting for real leaves
  the demo namespace and opens the real local run.

The browser tests enter only `/demo` for the claims and assert the real run
storage value remains unchanged.
