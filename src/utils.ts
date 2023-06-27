// Import types and APIs from graph-ts
import { Address, BigInt, ByteArray, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { Account, Domain } from "./types/schema";
import { NameWrapper } from "./types/NameWrapper/NameWrapper";
import { NetworkConfigs } from "./config";

export function createEventID(event: ethereum.Event): string {
  return event.block.number
    .toString()
    .concat("-")
    .concat(event.logIndex.toString());
}

export const IO_NODE =
  "b2b692c69df4aa3b0a24634d20a3ba1b44c3299d09d6c4377577e20b09e68395";
export const ROOT_NODE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export function nameByHash(lableHash: Bytes, registry: boolean): string | null {
  if (registry) {
    if (lableHash.toHex() == "0xdec08c9dbbdd0890e300eb5062089b2d4b1c40e3673bbccb5423f7b37dcf9a9c") {
      return "reverse";
    }
    if (lableHash.toHex() == "0xe5e14487b78f85faa6e1808e89246cf57dd34831548ff2e6097380d98db2504a") {
      return "addr";
    }
    if (lableHash.toHex() == "0x51143fc2477b19ad285ce702e5e9feb0f57c9cb4dbe9f081121e37c240ec6613") {
      return "io";
    }
    return null;
  }
  const nameWrapper = NameWrapper.bind(Address.fromString(NetworkConfigs.NAME_WRAPPER_ADDRESS));
  return nameWrapper.names(lableHash).toString();
}

// Helper for concatenating two byte arrays
export function concat(a: ByteArray, b: ByteArray): ByteArray {
  let out = new Uint8Array(a.length + b.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i];
  }
  for (let j = 0; j < b.length; j++) {
    out[a.length + j] = b[j];
  }
  // return out as ByteArray
  return changetype<ByteArray>(out);
}

export function byteArrayFromHex(s: string): ByteArray {
  if (s.length % 2 !== 0) {
    throw new TypeError("Hex string must have an even number of characters");
  }
  let out = new Uint8Array(s.length / 2);
  for (var i = 0; i < s.length; i += 2) {
    out[i / 2] = parseInt(s.substring(i, i + 2), 16) as u32;
  }
  return changetype<ByteArray>(out);
}

export function uint256ToByteArray(i: BigInt): ByteArray {
  let hex = i
    .toHex()
    .slice(2)
    .padStart(64, "0");
  return byteArrayFromHex(hex);
}

export function createOrLoadAccount(address: string): Account {
  let account = Account.load(address);
  if (account == null) {
    account = new Account(address);
    account.save();
  }

  return account;
}

export function createOrLoadDomain(node: string): Domain {
  let domain = Domain.load(node);
  if (domain == null) {
    domain = new Domain(node);
    domain.save();
  }

  return domain;
}

export function checkValidLabel(name: string): boolean {
  for (let i = 0; i < name.length; i++) {
    let c = name.charCodeAt(i);
    if (c === 0) {
      log.warning("Invalid label '{}' contained null byte. Skipping.", [name]);
      return false;
    } else if (c === 46) {
      log.warning(
        "Invalid label '{}' contained separator char '.'. Skipping.",
        [name]
      );
      return false;
    }
  }

  return true;
}
