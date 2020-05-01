# GoZ Research

## Architecture Overview
![petom-IBC](petom-IBC.png)
1. User deposits ATOM from the `cosmoshub` into the `petomhub` via IBC
2. User locks up ATOM as collateral on the `petomhub`
3. User receives PAW from the `petomhub`, exchanged at the spot price of ATOM/PAW fed from an oracle

## Four Primitives
- **Clients**: an instance of a lite client for another chain that is committed to state. Clients allow you to validate any data you are committing to your chain from the counterparty chain that has the lite client. All other primitives rely on clients to prove their data was included in the counterparty chain. The clients on each chain need to be updated at least once every unbonding/trusting period (21 days on mainnet, 330h default in GoZ), or we could no longer trust it

- **Connections**: connections authenticate one chain with another chain in a 4-step handshake (2 on each chain). The clients need to be updated throughout the connections when kept alive to prove the newly committed state on both chains

- **Channels**: channels contain the specifics of which module in the chain (i.e. the port) to send the data as well as ordering semantics and application protocol versioning

- **Packets**: packets hold application data. For example, a transfer from one chain to another is a packet. Sending a packet requires at least two transactions, one on the sending chain and one on the receiving chain. You first send a packet from a sending chain, and then have to have a message to receive the packet on the receiving chain. The IBC protocol also contains ACK (confirming receipt and processing) packets and timeout packets.

## Task List
### General
- [x] Spin up gaia-based `petomhub`
- [ ] Spin up custom `petomhub` (in progress)
- [x] Set up a relayer between another chain and the gaia-based`petomhub`
- [ ] Set up a relayer between another chain and the custom `petomhub`
- [x] Establish connection with multiple chains in the gaia-based`petomhub`
- [ ] Establish connection with multiple chains in the custom `petomhub`
- [x] Transfer tokens back and forth with other chains in the gaia-based`petomhub`
- [ ] Transfer tokens back and forth with other chains in the custom `petomhub`
- [ ] Automate the process of establishing new connections (needs testing)
- [ ] Automate sending packets from the relayer at least once every 90 min
- [ ] More

### Infrastructure
- [ ] Audit with Lynis (in progress)
- [x] Whitelist `35.230.14.56`, `34.82.233.123` and `34.83.182.199` for port `26657`

## Key Points
- If you included new data from the other chain, you'd want to be constantly updating the client using the relayer so that you always have the latest block header to verify the data coming from the other chain
- If a client goes a long period of time (longer than the unbonding period or trusting period) without an update, you can no longer acurately trust the client to verify the data. You'd have to create new clients and other primitives if that happened
- **Send one packet at least every 90 min from the relayer. Need to automate this while we are sleeping**
- **HOW UPTIME WILL BE MEASURED** ⇒ Each client update in IBC has two heights associated with it, one of the sending chain and one of the receiving chain. The amounts of the heights can be used to measure how long the connections were kept alive for and how often they were updated
- Relaying is open to anyone who can read the source chain and write to the destination chain
- **Adversarial relayer is recommended** (e.g. sending arbitrary metadata) 
- Once GoZ kicks off, we need to find a way to connect to the hub. **There will be no info on which port is open**
- You can change the chain you run in each phase (might need confirmation on this one)
- **Chain restart due to any reason (e.g. software crash, lack of funds) would be considered a fail**. This is because the relayer light client wouldn't sync anymore if the chain went down.
- It's recommended to **run multiple relayers to maximize connection counts**, BUT this also increases your chances of losing points due to relayers going down.
- **If the zone you were connected went down, you'd need to delete the old light client you created for that chain and initiate a new one**.

## Potential Attack Vectors
- **Trusting period attack**. Set a relatively short `"trusting-period"` to force the counterparty chain to update their lite client as often as you do. If they failed to update their client in time, it would hurt their uptime. Or worse, they'd also have to create new a client and other primitives (e.g. connections, channels etc.) if that happened
- **Faucet heist attack**. Empty out a chain's faucet. This will essentially stop other chains who request tokens from the faucet getting an adequate amount of tokens into their accounts on the relayer
- **Misc.** Proposer priority attacks, double spending attacks, unnoticed equivocations, and other confusion attacks that attempt to disrupt communication and operations between zones and relayers

<br />*The following attacks require you to 1) have access to the genesis of a given chain; 2) acquire enough token to become a validator on that chain*
- **Network takeover attack**. DoS the validator(s) on a chain (e.g. `:26657` if it's open) to get them dropped from the active set and jailed. Once you control >1/3 of the network's stake, nobody else can join the active set afterwards
- **State bloat attack**. Increase `KeyMaxEntries` in `config.tmol` dratically (say 10X) to increase the state space on a node. This will lead to slow computation and decreased IO performance, hence a slower blockchain. Ultimately some validators may run out of space, or at least see increased server cost

## Weekly Challenges
- Week 1 - Pushes the limits of packet connections by maintaining the longest lived connection with the fewest packets sent
- Week 2 - Relay as many packets as possible with its relayer key
- Week 3 - Execute the best confusion or deception attacks against other zones

## Cumulative Contest Challenge Rewards
- Most Packets Relayed via IBC module
  - the team that invests in automation to relay more packets than any other team throughout the entire competition
- Best Custom Zone
  - the team that invests beta tests their custom zone designed to be part of the network when IBC is production-ready
- Most Creative Zone
  - the team with the most creative use for IBC-generated tokens used in novel ways
- Most Innovative/Deceptive State Machine
  - the team who pulls off the best deception attacks by configuring their state machine in ways that give them significant benefits throughout the competition
- The Gaia Award
  - the team that creates the best content and technical write ups that share best practices and document novel implementations for the community throughout the competition
  
## Important Links
- [Official GoZ Repo](https://github.com/cosmosdevs/GameOfZones)
- [Scope](https://goz.cosmosnetwork.dev/)
- [Updates](https://goz.cosmosnetwork.dev/blog-2/)
- [AMA](https://www.youtube.com/watch?v=_uEu1Yfd2sY)

## Instructions
Click [here](https://www.notion.so/jim380/GoZ-petomhub-c197bae889f64e189dfc1f7e6c93506e)

## Resources
- [IBC Specs](https://github.com/cosmos/ics)
- [Gaia](https://github.com/cosmos/gaia/tree/ibc-alpha)
- [Relayer](https://github.com/iqlusioninc/relayer)
- [IBC Video Demo](https://youtu.be/S6DKib4jINk)
- [Cosmos SDK Docs](https://docs.cosmos.network/)
- [Tendermint Docs](https://docs.tendermint.com/)
- [More](https://gist.github.com/lovincyrus/6d9e1f79102379e5cb935158fa0ba05a)
