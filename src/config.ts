import { dataSource } from "@graphprotocol/graph-ts";

export namespace Network {
  export const IOTEX = "IOTEX";
  export const IOTEX_TESTNET = "IOTEX_TESTNET";
}

let NAME_WRAPPER_ADDRESS_TEMP: string;

if (dataSource.network() == Network.IOTEX.toLowerCase()) {
  NAME_WRAPPER_ADDRESS_TEMP = "0x26DEFAD6414321b13028A072a46D88400e94abb3";
} else if (dataSource.network() == Network.IOTEX.toLowerCase()) {
  NAME_WRAPPER_ADDRESS_TEMP = "0x92f0926350268a0147E36c4Dfbc4c72Eb11696cF";
}

export namespace NetworkConfigs {
  export const NAME_WRAPPER_ADDRESS = NAME_WRAPPER_ADDRESS_TEMP;
}
